#!/usr/bin/env node

/**
 * Script de migration pour transférer les métadonnées de poids
 * des produits vers les prix correspondants
 */

import Stripe from 'stripe'
import * as dotenv from 'dotenv'

dotenv.config()

const stripe = new Stripe(process.env.STRIPE_SK, {
  apiVersion: '2023-10-16',
})

async function migrateWeightMetadata() {
  console.log('🔄 Migration des métadonnées de poids vers les prix...')
  
  try {
    // Récupérer tous les produits
    console.log('📦 Récupération des produits...')
    const products = await stripe.products.list({ limit: 100, active: true })
    
    let migratedCount = 0
    let skippedCount = 0
    
    for (const product of products.data) {
      console.log(`\n📋 Traitement du produit: ${product.name}`)
      
      // Vérifier si le produit a des métadonnées de poids
      let productWeight = product.metadata?.['Poids']
      
      // Si "Poids" n'est pas trouvé, chercher "Poids net total"
      if (!productWeight) {
        productWeight = product.metadata?.['Poids net total']
      }
      
      if (!productWeight) {
        console.log(`  ⚠️  Pas de métadonnées de poids pour ${product.name}`)
        skippedCount++
        continue
      }
      
      // Récupérer tous les prix pour ce produit
      const prices = await stripe.prices.list({ 
        product: product.id,
        active: true,
        limit: 100 
      })
      
      for (const price of prices.data) {
        // Vérifier si le prix a déjà des métadonnées de poids
        if (price.metadata?.weight || price.metadata?.['Poids']) {
          console.log(`  ✅ Prix ${price.id} a déjà des métadonnées de poids`)
          continue
        }
        
        // Migrer les métadonnées de poids du produit vers le prix
        try {
          await stripe.prices.update(price.id, {
            metadata: {
              ...price.metadata,
              weight: productWeight
            }
          })
          
          console.log(`  ✅ Migration du poids "${productWeight}" vers le prix ${price.id}`)
          migratedCount++
          
        } catch (error) {
          console.error(`  ❌ Erreur lors de la migration du prix ${price.id}:`, error.message)
        }
      }
    }
    
    console.log(`\n🎉 Migration terminée!`)
    console.log(`✅ ${migratedCount} prix mis à jour`)
    console.log(`⚠️  ${skippedCount} produits ignorés (pas de métadonnées de poids)`)
    
  } catch (error) {
    console.error('❌ Erreur lors de la migration:', error)
    process.exit(1)
  }
}

async function verifyMigration() {
  console.log('🔍 Vérification de la migration...')
  
  try {
    const products = await stripe.products.list({ limit: 100, active: true })
    
    for (const product of products.data) {
      let productWeight = product.metadata?.['Poids']
      
      // Si "Poids" n'est pas trouvé, chercher "Poids net total"
      if (!productWeight) {
        productWeight = product.metadata?.['Poids net total']
      }
      
      if (!productWeight) continue
      
      const prices = await stripe.prices.list({ 
        product: product.id,
        active: true,
        limit: 100 
      })
      
      console.log(`\n📦 ${product.name} (poids produit: ${productWeight})`)
      
      for (const price of prices.data) {
        const priceWeight = price.metadata?.weight || price.metadata?.['Poids']
        const amount = (price.unit_amount / 100).toFixed(2)
        const currency = price.currency.toUpperCase()
        
        if (priceWeight) {
          console.log(`  ✅ Prix ${amount} ${currency} - Poids: ${priceWeight}`)
        } else {
          console.log(`  ❌ Prix ${amount} ${currency} - Pas de métadonnées de poids`)
        }
      }
    }
    
  } catch (error) {
    console.error('❌ Erreur lors de la vérification:', error)
  }
}

// Gestion des arguments de ligne de commande
const command = process.argv[2]

switch (command) {
  case 'migrate':
    migrateWeightMetadata()
    break
  case 'verify':
    verifyMigration()
    break
  default:
    console.log(`
📦 Script de migration des métadonnées de poids

Usage:
  node scripts/migrate-weight-metadata.js migrate   # Migrer les métadonnées
  node scripts/migrate-weight-metadata.js verify    # Vérifier la migration

Description:
  Ce script transfère les métadonnées "Poids" des produits Stripe
  vers les prix correspondants. Cela permet au système de variantes
  de fonctionner correctement avec le calcul des frais de port.

⚠️  Important: Toujours faire une sauvegarde avant migration
    `)
}
