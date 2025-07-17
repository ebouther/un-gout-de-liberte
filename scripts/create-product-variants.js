// Script pour regrouper les produits par variantes de poids
// Usage: node scripts/create-product-variants.js

const Stripe = require('stripe');
const path = require('path');

require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

if (!process.env.STRIPE_SK) {
  console.error('❌ Erreur: Variable STRIPE_SK manquante dans le fichier .env');
  process.exit(1);
}

const stripe = new Stripe(process.env.STRIPE_SK);

// Fonction pour extraire le nom de base d'un produit (sans le poids)
const getBaseProductName = (productName) => {
  // Enlever les indications de poids/format
  return productName
    .replace(/\s*\d+(?:\.\d+)?\s*(g|kg|ml|l|cl)\s*/gi, '')
    .replace(/\s*\(\d+(?:\.\d+)?\s*(g|kg|ml|l|cl)\)\s*/gi, '')
    .replace(/\s*-\s*\d+(?:\.\d+)?\s*(g|kg|ml|l|cl)\s*/gi, '')
    .replace(/\s+/g, ' ')
    .trim();
};

// Fonction pour extraire le poids depuis les métadonnées du produit
const extractWeight = (product) => {
  // Chercher d'abord dans "Poids"
  if (product.metadata && product.metadata['Poids']) {
    return product.metadata['Poids'];
  }
  
  // Puis dans "Poids net total"
  if (product.metadata && product.metadata['Poids net total']) {
    return product.metadata['Poids net total'];
  }
  
  // Fallback : extraire depuis le nom du produit
  const weightMatch = product.name.match(/(\d+(?:\.\d+)?)\s*(g|kg|ml|l|cl)/gi);
  return weightMatch ? weightMatch[0] : null;
};

// Analyser les produits et identifier les groupes potentiels
async function analyzeProductGroups() {
  try {
    console.log('🔍 Analyse des produits pour identifier les variantes potentielles...\n');
    
    const products = await stripe.products.list({
      limit: 100,
      active: true
    });
    
    // Grouper par nom de base
    const productGroups = {};
    
    for (const product of products.data) {
      const baseName = getBaseProductName(product.name);
      const weight = extractWeight(product);
      
      if (!productGroups[baseName]) {
        productGroups[baseName] = [];
      }
      
      // Récupérer les prix pour ce produit
      const prices = await stripe.prices.list({
        product: product.id,
        active: true
      });
      
      productGroups[baseName].push({
        product,
        weight,
        prices: prices.data
      });
    }
    
    // Identifier les groupes avec plusieurs variantes
    console.log('📊 Groupes de produits identifiés:\n');
    
    Object.entries(productGroups).forEach(([baseName, variants]) => {
      if (variants.length > 1) {
        console.log(`🔄 "${baseName}" (${variants.length} variantes):`);
        variants.forEach(variant => {
          const price = variant.prices[0];
          const priceStr = price ? `${(price.unit_amount / 100).toFixed(2)}€` : 'Pas de prix';
          console.log(`   • ${variant.weight || 'Poids non spécifié'} - ${priceStr}`);
        });
        console.log('');
      } else {
        console.log(`✅ "${baseName}" - Produit unique`);
      }
    });
    
    // Suggestions pour les regroupements
    const multiVariantGroups = Object.entries(productGroups).filter(([_, variants]) => variants.length > 1);
    
    if (multiVariantGroups.length > 0) {
      console.log('\n💡 Suggestions de regroupement:');
      console.log('Les produits suivants pourraient être regroupés en variantes:');
      
      multiVariantGroups.forEach(([baseName, variants]) => {
        console.log(`\n• ${baseName}:`);
        console.log('  Action suggérée: Créer un produit principal avec plusieurs prix');
        variants.forEach(variant => {
          console.log(`  - Convertir "${variant.product.name}" en variante`);
        });
      });
    }
    
  } catch (error) {
    console.error('❌ Erreur:', error.message);
  }
}

// Créer un produit avec variantes (exemple)
async function createProductWithVariants(baseName, variants) {
  try {
    console.log(`🆕 Création du produit avec variantes: ${baseName}`);
    
    // Utiliser le premier produit comme base
    const baseProduct = variants[0].product;
    
    // Préparer les données du produit en vérifiant chaque champ
    const productData = {
      name: baseName || 'Produit sans nom',
      metadata: {
        ...baseProduct.metadata,
        has_variants: 'true',
        variant_type: 'weight'
      }
    };
    
    // Ajouter la description seulement si elle n'est pas vide
    if (baseProduct.description && baseProduct.description.trim() !== '') {
      productData.description = baseProduct.description;
    }
    
    // Ajouter les images seulement si elles existent
    if (baseProduct.images && baseProduct.images.length > 0) {
      productData.images = baseProduct.images;
    }
    
    const newProduct = await stripe.products.create(productData);
    
    console.log(`✅ Produit principal créé: ${newProduct.id}`);
    
    // Créer les prix pour chaque variante
    for (const variant of variants) {
      const originalPrice = variant.prices[0];
      if (originalPrice) {
        const newPrice = await stripe.prices.create({
          product: newProduct.id,
          unit_amount: originalPrice.unit_amount,
          currency: originalPrice.currency,
          metadata: {
            weight: variant.weight || 'Non spécifié',
            original_product_id: variant.product.id,
            original_price_id: originalPrice.id,
            // Stocker les images spécifiques à cette variante
            variant_images: JSON.stringify(variant.product.images || [])
          }
        });
        
        console.log(`  💰 Prix créé: ${variant.weight} - ${(originalPrice.unit_amount / 100).toFixed(2)}€`);
        if (variant.product.images && variant.product.images.length > 0) {
          console.log(`    📸 Images spécifiques sauvegardées pour cette variante`);
        }
      }
    }
    
    return newProduct;
    
  } catch (error) {
    console.error('❌ Erreur lors de la création:', error.message);
  }
}

// Fonction de migration automatique
async function automaticMigration() {
  try {
    console.log('🚀 Début de la migration automatique des variantes...\n');
    
    const products = await stripe.products.list({
      limit: 100,
      active: true
    });
    
    // Grouper par nom de base
    const productGroups = {};
    
    for (const product of products.data) {
      const baseName = getBaseProductName(product.name);
      const weight = extractWeight(product);
      
      if (!productGroups[baseName]) {
        productGroups[baseName] = [];
      }
      
      // Récupérer les prix pour ce produit
      const prices = await stripe.prices.list({
        product: product.id,
        active: true
      });
      
      productGroups[baseName].push({
        product,
        weight,
        prices: prices.data
      });
    }
    
    // Identifier et traiter les groupes avec plusieurs variantes
    const multiVariantGroups = Object.entries(productGroups).filter(([_, variants]) => variants.length > 1);
    
    if (multiVariantGroups.length === 0) {
      console.log('ℹ️  Aucun groupe de variantes détecté. Aucune migration nécessaire.');
      return;
    }
    
    console.log(`📋 ${multiVariantGroups.length} groupes de variantes détectés. Début de la migration...\n`);
    
    for (const [baseName, variants] of multiVariantGroups) {
      console.log(`\n� Migration du groupe: "${baseName}"`);
      console.log(`   Variantes trouvées: ${variants.map(v => v.product.name).join(', ')}`);
      
      // Créer le nouveau produit avec variantes
      const newProduct = await createProductWithVariants(baseName, variants);
      
      if (newProduct) {
        // Marquer les anciens produits comme dépréciés
        console.log('   📝 Marquage des anciens produits comme dépréciés...');
        
        for (const variant of variants) {
          await stripe.products.update(variant.product.id, {
            metadata: {
              ...variant.product.metadata,
              deprecated: 'true',
              replaced_by: newProduct.id,
              migration_date: new Date().toISOString()
            }
          });
          
          console.log(`      ✅ ${variant.product.name} marqué comme déprécié`);
        }
        
        console.log(`   🎉 Migration terminée pour "${baseName}"`);
      }
    }
    
    console.log('\n🎊 Migration automatique terminée avec succès!');
    console.log('💡 Les anciens produits sont marqués comme dépréciés mais restent actifs.');
    console.log('💡 Vous pouvez les désactiver manuellement depuis le dashboard Stripe si nécessaire.');
    
  } catch (error) {
    console.error('❌ Erreur lors de la migration automatique:', error.message);
  }
}

const command = process.argv[2];

if (command === 'analyze') {
  analyzeProductGroups();
} else if (command === 'migrate') {
  automaticMigration();
} else if (command === 'create') {
  automaticMigration(); // Alias pour migrate
} else {
  console.log(`
📦 Gestion des variantes de produits Stripe

Usage:
  node scripts/create-product-variants.js analyze   # Analyser les produits existants
  node scripts/create-product-variants.js migrate   # Migration automatique des variantes
  node scripts/create-product-variants.js create    # Alias pour migrate

Exemples de cas d'usage:
  • "Confiture de pêches 250g" + "Confiture de pêches 500g" → Un produit avec 2 prix
  • "Biscuits sablés 200g" + "Biscuits sablés 400g" → Un produit avec 2 prix
  
⚠️  Important: Toujours faire une sauvegarde avant migration
  `);
}

module.exports = { getBaseProductName, extractWeight, analyzeProductGroups };
