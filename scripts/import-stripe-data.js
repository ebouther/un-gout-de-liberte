#!/usr/bin/env node

/**
 * Script pour importer les modifications depuis un fichier CSV vers Stripe
 * Usage: node scripts/import-stripe-data.js [fichier.csv]
 */

import 'dotenv/config'
import Stripe from 'stripe'
import fs from 'fs'
import path from 'path'

// Configuration
const stripe = new Stripe(process.env.STRIPE_SK || process.env.STRIPE_SECRET_KEY)

/**
 * Parse une ligne CSV en tenant compte des guillemets et virgules
 */
const parseCSVLine = (line) => {
    const result = []
    let current = ''
    let inQuotes = false
    let i = 0

    while (i < line.length) {
        const char = line[i]

        if (char === '"') {
            if (inQuotes && line[i + 1] === '"') {
                // Double quote escaped
                current += '"'
                i += 2
            } else {
                // Toggle quote state
                inQuotes = !inQuotes
                i++
            }
        } else if (char === ',' && !inQuotes) {
            // End of field
            result.push(current)
            current = ''
            i++
        } else {
            current += char
            i++
        }
    }

    // Add last field
    result.push(current)
    return result
}

/**
 * Parse le fichier CSV
 */
const parseCSV = (filepath) => {
    const content = fs.readFileSync(filepath, 'utf8')
    const lines = content.split('\n').filter(line => line.trim())

    if (lines.length === 0) {
        throw new Error('Fichier CSV vide')
    }

    const headers = parseCSVLine(lines[0])
    const rows = lines.slice(1).map(line => {
        const values = parseCSVLine(line)
        const row = {}

        headers.forEach((header, index) => {
            row[header] = values[index] || ''
        })

        return row
    })

    return { headers, rows }
}

/**
 * Extrait les métadonnées depuis les colonnes CSV
 */
const extractMetadata = (row, prefix) => {
    const metadata = {}

    Object.keys(row).forEach(key => {
        if (key.startsWith(`${prefix}_metadata_`)) {
            const metaKey = key.replace(`${prefix}_metadata_`, '')
            const value = row[key]
            if (value && value.trim()) {
                metadata[metaKey] = value.trim()
            }
        }
    })

    return Object.keys(metadata).length > 0 ? metadata : null
}

/**
 * Met à jour un produit Stripe
 */
const updateProduct = async (productId, updates) => {
    try {
        const product = await stripe.products.update(productId, updates)
        return { success: true, product }
    } catch (error) {
        return { success: false, error: error.message }
    }
}

/**
 * Met à jour un prix Stripe
 */
const updatePrice = async (priceId, updates) => {
    try {
        // Note: Les prix Stripe ne peuvent pas être modifiés une fois créés
        // On ne peut que changer active, nickname, lookup_key et metadata
        const allowedUpdates = {}

        if ('active' in updates) allowedUpdates.active = updates.active
        if ('nickname' in updates) allowedUpdates.nickname = updates.nickname
        if ('lookup_key' in updates) allowedUpdates.lookup_key = updates.lookup_key
        if ('metadata' in updates) allowedUpdates.metadata = updates.metadata

        if (Object.keys(allowedUpdates).length === 0) {
            return { success: true, message: 'Aucune modification autorisée pour ce prix' }
        }

        const price = await stripe.prices.update(priceId, allowedUpdates)
        return { success: true, price }
    } catch (error) {
        return { success: false, error: error.message }
    }
}

/**
 * Traite les modifications depuis le CSV
 */
const processUpdates = async (rows) => {
    const results = {
        products: { updated: 0, errors: 0 },
        prices: { updated: 0, errors: 0 },
        details: []
    }

    console.log(`📝 Traitement de ${rows.length} lignes...`)

    for (let i = 0; i < rows.length; i++) {
        const row = rows[i]
        const lineNum = i + 2 // +2 car ligne 1 = headers, index commence à 0

        console.log(`\n🔍 Ligne ${lineNum}: ${row.product_name || row.product_id}`)

        // Traiter le produit si présent
        if (row.product_id) {
            const productUpdates = {}

            // Champs modifiables du produit
            if (row.product_name) productUpdates.name = row.product_name
            if (row.product_description) productUpdates.description = row.product_description
            if (row.product_active !== '') productUpdates.active = row.product_active === 'true'
            if (row.product_url) productUpdates.url = row.product_url
            if (row.product_shippable !== '') productUpdates.shippable = row.product_shippable === 'true'
            if (row.product_tax_code) productUpdates.tax_code = row.product_tax_code

            // Images
            const images = [row.product_image_1, row.product_image_2, row.product_image_3]
                .filter(img => img && img.trim())
            if (images.length > 0) {
                productUpdates.images = images
            }

            // Métadonnées produit
            const productMetadata = extractMetadata(row, 'product')
            if (productMetadata) {
                productUpdates.metadata = productMetadata
            }

            // Mettre à jour le produit s'il y a des modifications
            if (Object.keys(productUpdates).length > 0) {
                console.log(`  📦 Mise à jour du produit ${row.product_id}...`)
                const result = await updateProduct(row.product_id, productUpdates)

                if (result.success) {
                    results.products.updated++
                    console.log(`  ✅ Produit mis à jour`)
                } else {
                    results.products.errors++
                    console.log(`  ❌ Erreur produit: ${result.error}`)
                    results.details.push({
                        line: lineNum,
                        type: 'product',
                        id: row.product_id,
                        error: result.error
                    })
                }
            }
        }

        // Traiter le prix si présent
        if (row.price_id) {
            const priceUpdates = {}

            // Champs modifiables du prix
            if (row.price_active !== '') priceUpdates.active = row.price_active === 'true'
            if (row.price_nickname) priceUpdates.nickname = row.price_nickname
            if (row.price_lookup_key) priceUpdates.lookup_key = row.price_lookup_key

            // Métadonnées prix
            const priceMetadata = extractMetadata(row, 'price')
            if (priceMetadata) {
                priceUpdates.metadata = priceMetadata
            }

            // Mettre à jour le prix s'il y a des modifications
            if (Object.keys(priceUpdates).length > 0) {
                console.log(`  💰 Mise à jour du prix ${row.price_id}...`)
                const result = await updatePrice(row.price_id, priceUpdates)

                if (result.success) {
                    results.prices.updated++
                    console.log(`  ✅ Prix mis à jour`)
                } else {
                    results.prices.errors++
                    console.log(`  ❌ Erreur prix: ${result.error}`)
                    results.details.push({
                        line: lineNum,
                        type: 'price',
                        id: row.price_id,
                        error: result.error
                    })
                }
            }
        }

        // Petite pause pour éviter de surcharger l'API
        if (i % 10 === 0 && i > 0) {
            console.log(`⏸️  Pause (traité ${i} lignes)...`)
            await new Promise(resolve => setTimeout(resolve, 1000))
        }
    }

    return results
}

/**
 * Fonction principale
 */
const main = async () => {
    try {
        const filepath = process.argv[2]

        if (!filepath) {
            console.error('❌ Usage: node scripts/import-stripe-data.js [fichier.csv]')
            process.exit(1)
        }

        if (!fs.existsSync(filepath)) {
            console.error(`❌ Fichier non trouvé: ${filepath}`)
            process.exit(1)
        }

        console.log('🚀 Début de l\'import des modifications...')

        // Vérifier la clé API
        if (!process.env.STRIPE_SK && !process.env.STRIPE_SECRET_KEY) {
            console.error('❌ Variable d\'environnement STRIPE_SK ou STRIPE_SECRET_KEY manquante')
            process.exit(1)
        }

        // Parser le CSV
        console.log(`📄 Lecture du fichier: ${filepath}`)
        const { headers, rows } = parseCSV(filepath)
        console.log(`📊 ${rows.length} lignes à traiter`)

        // Demander confirmation
        console.log('\n⚠️  ATTENTION: Cette opération va modifier vos données Stripe !')
        console.log('📝 Colonnes détectées:', headers.slice(0, 10).join(', ') + (headers.length > 10 ? '...' : ''))

        // Traiter les modifications
        const results = await processUpdates(rows)

        // Afficher le résumé
        console.log('\n📊 RÉSUMÉ DE L\'IMPORT:')
        console.log(`📦 Produits mis à jour: ${results.products.updated}`)
        console.log(`❌ Erreurs produits: ${results.products.errors}`)
        console.log(`💰 Prix mis à jour: ${results.prices.updated}`)
        console.log(`❌ Erreurs prix: ${results.prices.errors}`)

        if (results.details.length > 0) {
            console.log('\n❌ DÉTAIL DES ERREURS:')
            results.details.forEach(detail => {
                console.log(`  Ligne ${detail.line} (${detail.type} ${detail.id}): ${detail.error}`)
            })
        }

        console.log('\n✅ Import terminé !')

    } catch (error) {
        console.error('❌ Erreur lors de l\'import :', error.message)
        process.exit(1)
    }
}

// Exécution du script
main()
