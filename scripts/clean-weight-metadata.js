#!/usr/bin/env node

/**
 * Script pour supprimer la métadata "Poids" des prix Stripe
 * et ne garder que "weight"
 */

import Stripe from 'stripe'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Configuration
const stripe = new Stripe(process.env.STRIPE_SK)

async function cleanWeightMetadata() {
    console.log('🧹 Début du nettoyage des métadonnées "Poids" des prix Stripe...\n')

    try {
        // 1. Récupérer tous les prix
        console.log('📋 Récupération de tous les prix...')
        const allPrices = []
        let hasMore = true
        let startingAfter = undefined

        while (hasMore) {
            const prices = await stripe.prices.list({
                limit: 100,
                starting_after: startingAfter,
                expand: ['data.product']
            })

            allPrices.push(...prices.data)
            hasMore = prices.has_more
            if (hasMore) {
                startingAfter = prices.data[prices.data.length - 1].id
            }
        }

        console.log(`✅ ${allPrices.length} prix récupérés\n`)

        // 2. Filtrer les prix qui ont "Poids" dans leurs métadonnées
        const pricesToClean = allPrices.filter(price =>
            price.metadata && price.metadata.Poids
        )

        console.log(`🎯 ${pricesToClean.length} prix ont la métadata "Poids" à supprimer\n`)

        if (pricesToClean.length === 0) {
            console.log('✅ Aucun prix à nettoyer. Terminé!')
            return
        }

        // 3. Afficher un aperçu des prix à modifier
        console.log('📋 Aperçu des prix à nettoyer:')
        pricesToClean.slice(0, 5).forEach(price => {
            console.log(`  • ${price.id} - Produit: ${price.product.name}`)
            console.log(`    Métadonnées actuelles: Poids="${price.metadata.Poids}", weight="${price.metadata.weight || 'non défini'}"`)
        })
        if (pricesToClean.length > 5) {
            console.log(`  ... et ${pricesToClean.length - 5} autres`)
        }
        console.log()

        // 4. Demander confirmation
        console.log('⚠️  ATTENTION: Cette opération va supprimer définitivement la métadata "Poids" de tous ces prix.')
        console.log('Êtes-vous sûr de vouloir continuer? (Tapez "oui" pour confirmer)')

        // Attendre l'entrée utilisateur
        process.stdout.write('Confirmation: ')
        const confirmation = await new Promise(resolve => {
            process.stdin.once('data', data => {
                resolve(data.toString().trim().toLowerCase())
            })
        })

        if (confirmation !== 'oui') {
            console.log('❌ Opération annulée.')
            return
        }

        // 5. Créer un backup avant suppression
        const backupDir = path.join(__dirname, '..', 'backups')
        if (!fs.existsSync(backupDir)) {
            fs.mkdirSync(backupDir, { recursive: true })
        }

        const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
        const backupFile = path.join(backupDir, `prices-before-clean-${timestamp}.json`)

        console.log('💾 Création du backup...')
        fs.writeFileSync(backupFile, JSON.stringify(pricesToClean, null, 2))
        console.log(`✅ Backup créé: ${backupFile}\n`)

        // 6. Nettoyer les métadonnées
        console.log('🧹 Suppression de la métadata "Poids"...')

        let cleanedCount = 0
        let errorCount = 0

        for (const price of pricesToClean) {
            try {
                // Créer les nouvelles métadonnées sans "Poids"
                const newMetadata = { ...price.metadata }
                delete newMetadata.Poids

                // Mettre à jour le prix
                await stripe.prices.update(price.id, {
                    metadata: newMetadata
                })

                cleanedCount++
                console.log(`✅ Prix ${price.id} nettoyé (${cleanedCount}/${pricesToClean.length})`)

            } catch (error) {
                errorCount++
                console.error(`❌ Erreur pour le prix ${price.id}:`, error.message)
            }
        }

        // 7. Résumé final
        console.log('\n🎉 Nettoyage terminé!')
        console.log(`✅ Prix nettoyés: ${cleanedCount}`)
        console.log(`❌ Erreurs: ${errorCount}`)
        console.log(`💾 Backup: ${backupFile}`)

        if (errorCount > 0) {
            console.log('\n⚠️  Des erreurs se sont produites. Vérifiez les logs ci-dessus.')
        } else {
            console.log('\n🎊 Tous les prix ont été nettoyés avec succès!')
        }

    } catch (error) {
        console.error('❌ Erreur générale:', error)
        process.exit(1)
    }
}

// Exécuter le script
cleanWeightMetadata()
