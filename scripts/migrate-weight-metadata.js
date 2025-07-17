#!/usr/bin/env node

/**
 * Script pour migrer la métadata "Poids" des produits Stripe vers leurs prix associés
 * 1. Backup des produits et prix existants
 * 2. Migration de la métadata "Poids"
 */

import Stripe from 'stripe'
import * as dotenv from 'dotenv'
import fs from 'fs'
import path from 'path'

// Charger les variables d'environnement
dotenv.config()

// Configuration Stripe
const stripe = new Stripe(process.env.STRIPE_SK)

const BACKUP_DIR = './backups'

/**
 * Créer le dossier de backup s'il n'existe pas
 */
function ensureBackupDir() {
    if (!fs.existsSync(BACKUP_DIR)) {
        fs.mkdirSync(BACKUP_DIR, { recursive: true })
    }
}

/**
 * Backup de tous les produits Stripe
 */
async function backupProducts() {
    console.log('🔄 Backup des produits Stripe...')

    const products = []
    let hasMore = true
    let startingAfter = undefined

    while (hasMore) {
        const batch = await stripe.products.list({
            limit: 100,
            starting_after: startingAfter
        })

        products.push(...batch.data)
        hasMore = batch.has_more

        if (hasMore) {
            startingAfter = batch.data[batch.data.length - 1].id
        }
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
    const filename = path.join(BACKUP_DIR, `products-backup-${timestamp}.json`)

    fs.writeFileSync(filename, JSON.stringify(products, null, 2))
    console.log(`✅ ${products.length} produits sauvegardés dans ${filename}`)

    return products
}

/**
 * Backup de tous les prix Stripe
 */
async function backupPrices() {
    console.log('🔄 Backup des prix Stripe...')

    const prices = []
    let hasMore = true
    let startingAfter = undefined

    while (hasMore) {
        const batch = await stripe.prices.list({
            limit: 100,
            starting_after: startingAfter
        })

        prices.push(...batch.data)
        hasMore = batch.has_more

        if (hasMore) {
            startingAfter = batch.data[batch.data.length - 1].id
        }
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
    const filename = path.join(BACKUP_DIR, `prices-backup-${timestamp}.json`)

    fs.writeFileSync(filename, JSON.stringify(prices, null, 2))
    console.log(`✅ ${prices.length} prix sauvegardés dans ${filename}`)

    return prices
}

/**
 * Migrer la métadata "Poids" des produits vers leurs prix
 */
async function migrateWeightMetadata(products, prices) {
    console.log('🔄 Migration de la métadata "Poids"...')

    let updated = 0
    let skipped = 0
    let errors = 0

    for (const product of products) {
        // Vérifier si le produit a une métadata "Poids"
        const poids = product.metadata?.Poids
        if (!poids) {
            console.log(`⏭️  Produit ${product.name} - pas de métadata "Poids"`)
            skipped++
            continue
        }

        // Trouver tous les prix associés à ce produit
        const productPrices = prices.filter(price => price.product === product.id)

        if (productPrices.length === 0) {
            console.log(`⚠️  Produit ${product.name} - aucun prix associé`)
            skipped++
            continue
        }

        console.log(`📦 Produit ${product.name} - Poids: ${poids} - ${productPrices.length} prix à mettre à jour`)

        // Mettre à jour chaque prix avec la métadata "Poids"
        for (const price of productPrices) {
            try {
                // Vérifier si le prix a déjà la métadata "Poids"
                if (price.metadata?.Poids) {
                    console.log(`⏭️  Prix ${price.id} - métadata "Poids" déjà présente (${price.metadata.Poids})`)
                    skipped++
                    continue
                }

                // Mettre à jour le prix avec la métadata "Poids"
                await stripe.prices.update(price.id, {
                    metadata: {
                        ...price.metadata,
                        Poids: poids
                    }
                })

                console.log(`✅ Prix ${price.id} mis à jour avec Poids: ${poids}`)
                updated++

                // Pause pour éviter les rate limits
                await new Promise(resolve => setTimeout(resolve, 200))

            } catch (error) {
                console.error(`❌ Erreur lors de la mise à jour du prix ${price.id}:`, error.message)
                errors++
            }
        }
    }

    console.log('\n📊 Résumé de la migration:')
    console.log(`✅ Prix mis à jour: ${updated}`)
    console.log(`⏭️  Prix ignorés: ${skipped}`)
    console.log(`❌ Erreurs: ${errors}`)

    return { updated, skipped, errors }
}

/**
 * Script principal
 */
async function main() {
    try {
        console.log('� Début de la migration de la métadata "Poids"\n')

        // Vérifier la clé API Stripe
        if (!process.env.STRIPE_SK) {
            throw new Error('STRIPE_SK non définie dans les variables d\'environnement')
        }

        // Créer le dossier de backup
        ensureBackupDir()

        // 1. Backup des données existantes
        console.log('📥 Phase 1: Backup des données existantes')
        const products = await backupProducts()
        const prices = await backupPrices()

        console.log('\n🔄 Phase 2: Migration de la métadata')
        // 2. Migration de la métadata
        const result = await migrateWeightMetadata(products, prices)

        console.log('\n🎉 Migration terminée avec succès!')

        if (result.errors > 0) {
            console.log('⚠️  Certaines erreurs ont été rencontrées. Vérifiez les logs ci-dessus.')
        }

    } catch (error) {
        console.error('💥 Erreur lors de la migration:', error.message)
        process.exit(1)
    }
}

// Exécuter le script
main()
