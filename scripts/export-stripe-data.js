#!/usr/bin/env node

/**
 * Script pour exporter toutes les données produits et prix Stripe dans un fichier CSV
 * Usage: node scripts/export-stripe-data.js
 */

import 'dotenv/config'
import Stripe from 'stripe'
import fs from 'fs'
import path from 'path'

// Configuration
const stripe = new Stripe(process.env.STRIPE_SK || process.env.STRIPE_SECRET_KEY)

/**
 * Convertit un objet en chaîne CSV-safe
 */
const toCsvValue = (value) => {
    if (value === null || value === undefined) return ''

    const str = String(value)
    // Échapper les guillemets doubles et entourer de guillemets si nécessaire
    if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
        return `"${str.replace(/"/g, '""')}"`
    }
    return str
}

/**
 * Aplatit les métadonnées en colonnes séparées
 */
const flattenMetadata = (metadata, prefix) => {
    const result = {}
    if (!metadata) return result

    Object.keys(metadata).forEach(key => {
        result[`${prefix}_${key}`] = metadata[key]
    })
    return result
}

/**
 * Récupère tous les produits avec leurs prix
 */
const getAllProductsWithPrices = async () => {
    console.log('📦 Récupération des produits Stripe...')

    const products = []
    let hasMore = true
    let startingAfter = undefined

    while (hasMore) {
        const response = await stripe.products.list({
            limit: 100,
            starting_after: startingAfter,
            expand: ['data.default_price']
        })

        products.push(...response.data)
        hasMore = response.has_more
        if (hasMore) {
            startingAfter = response.data[response.data.length - 1].id
        }
    }

    console.log(`✅ ${products.length} produits récupérés`)

    // Récupérer tous les prix pour chaque produit
    console.log('💰 Récupération des prix associés...')

    const productsWithPrices = []

    for (const product of products) {
        console.log(`🔍 Traitement du produit: ${product.name}`)

        // Récupérer tous les prix pour ce produit
        const prices = await stripe.prices.list({
            product: product.id,
            limit: 100
        })

        if (prices.data.length === 0) {
            // Produit sans prix
            productsWithPrices.push({
                product,
                price: null
            })
        } else {
            // Ajouter une ligne pour chaque prix
            prices.data.forEach(price => {
                productsWithPrices.push({
                    product,
                    price
                })
            })
        }
    }

    console.log(`✅ ${productsWithPrices.length} combinaisons produit-prix récupérées`)
    return productsWithPrices
}

/**
 * Convertit les données en format CSV
 */
const convertToCSV = (data) => {
    if (data.length === 0) return ''

    // Définir toutes les colonnes possibles
    const columns = [
        // Identifiants
        'product_id',
        'price_id',

        // Informations produit
        'product_name',
        'product_description',
        'product_active',
        'product_created',
        'product_updated',
        'product_url',
        'product_shippable',
        'product_tax_code',

        // Informations prix
        'price_active',
        'price_created',
        'price_currency',
        'price_unit_amount',
        'price_unit_amount_decimal',
        'price_type',
        'price_recurring_interval',
        'price_recurring_interval_count',
        'price_billing_scheme',
        'price_nickname',
        'price_lookup_key',
        'price_tiers_mode',
        'price_transform_quantity',

        // Images (on prend les 3 premières)
        'product_image_1',
        'product_image_2',
        'product_image_3',
    ]

    // Collecter toutes les métadonnées possibles
    const allMetadataKeys = new Set()
    data.forEach(({ product, price }) => {
        if (product?.metadata) {
            Object.keys(product.metadata).forEach(key => {
                allMetadataKeys.add(`product_metadata_${key}`)
            })
        }
        if (price?.metadata) {
            Object.keys(price.metadata).forEach(key => {
                allMetadataKeys.add(`price_metadata_${key}`)
            })
        }
    })

    // Ajouter les colonnes de métadonnées
    const metadataColumns = Array.from(allMetadataKeys).sort()
    const allColumns = [...columns, ...metadataColumns]

    // En-têtes CSV
    const headers = allColumns.join(',')

    // Lignes de données
    const rows = data.map(({ product, price }) => {
        const row = {}

        // Données produit
        row.product_id = product?.id || ''
        row.product_name = product?.name || ''
        row.product_description = product?.description || ''
        row.product_active = product?.active || false
        row.product_created = product?.created ? new Date(product.created * 1000).toISOString() : ''
        row.product_updated = product?.updated ? new Date(product.updated * 1000).toISOString() : ''
        row.product_url = product?.url || ''
        row.product_shippable = product?.shippable || false
        row.product_tax_code = product?.tax_code || ''

        // Images produit
        if (product?.images) {
            row.product_image_1 = product.images[0] || ''
            row.product_image_2 = product.images[1] || ''
            row.product_image_3 = product.images[2] || ''
        }

        // Données prix
        row.price_id = price?.id || ''
        row.price_active = price?.active || false
        row.price_created = price?.created ? new Date(price.created * 1000).toISOString() : ''
        row.price_currency = price?.currency || ''
        row.price_unit_amount = price?.unit_amount || ''
        row.price_unit_amount_decimal = price?.unit_amount_decimal || ''
        row.price_type = price?.type || ''
        row.price_recurring_interval = price?.recurring?.interval || ''
        row.price_recurring_interval_count = price?.recurring?.interval_count || ''
        row.price_billing_scheme = price?.billing_scheme || ''
        row.price_nickname = price?.nickname || ''
        row.price_lookup_key = price?.lookup_key || ''
        row.price_tiers_mode = price?.tiers_mode || ''
        row.price_transform_quantity = price?.transform_quantity ? JSON.stringify(price.transform_quantity) : ''

        // Métadonnées produit
        if (product?.metadata) {
            Object.keys(product.metadata).forEach(key => {
                row[`product_metadata_${key}`] = product.metadata[key]
            })
        }

        // Métadonnées prix
        if (price?.metadata) {
            Object.keys(price.metadata).forEach(key => {
                row[`price_metadata_${key}`] = price.metadata[key]
            })
        }

        // Convertir en ligne CSV
        return allColumns.map(col => toCsvValue(row[col] || '')).join(',')
    })

    return [headers, ...rows].join('\n')
}

/**
 * Fonction principale
 */
const main = async () => {
    try {
        console.log('🚀 Début de l\'export des données Stripe...')

        // Vérifier la clé API
        if (!process.env.STRIPE_SK && !process.env.STRIPE_SECRET_KEY) {
            console.error('❌ Variable d\'environnement STRIPE_SK ou STRIPE_SECRET_KEY manquante')
            process.exit(1)
        }

        // Récupérer les données
        const data = await getAllProductsWithPrices()

        // Convertir en CSV
        console.log('📝 Conversion en format CSV...')
        const csv = convertToCSV(data)

        // Sauvegarder le fichier
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5)
        const filename = `stripe-export-${timestamp}.csv`
        const filepath = path.join(process.cwd(), 'exports', filename)

        // Créer le dossier exports s'il n'existe pas
        const exportsDir = path.dirname(filepath)
        if (!fs.existsSync(exportsDir)) {
            fs.mkdirSync(exportsDir, { recursive: true })
        }

        fs.writeFileSync(filepath, csv, 'utf8')

        console.log(`✅ Export terminé !`)
        console.log(`📄 Fichier sauvegardé : ${filepath}`)
        console.log(`📊 ${data.length} lignes exportées`)
        console.log(`💡 Tu peux maintenant ouvrir ce fichier dans Excel/LibreOffice pour le modifier`)

    } catch (error) {
        console.error('❌ Erreur lors de l\'export :', error.message)
        process.exit(1)
    }
}

// Exécution du script
main()
