// Script de mise à jour en masse des catégories Stripe
// Usage: node update-product-categories.js

const Stripe = require('stripe');
const path = require('path');

// Charger les variables d'environnement depuis le répertoire parent
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

// Vérifier que la clé Stripe est disponible
if (!process.env.STRIPE_SK) {
  console.error('❌ Erreur: Variable STRIPE_SK manquante dans le fichier .env');
  console.log('💡 Assurez-vous que le fichier .env contient: STRIPE_SK=sk_live_...');
  process.exit(1);
}

const stripe = new Stripe(process.env.STRIPE_SK);

// Mapping des noms de produits vers les catégories
const getCategoryFromName = (productName) => {
  const name = productName.toLowerCase();
  
  // Confitures
  if (name.includes('confiture')) return 'confitures';
  
  // Fruits au sirop
  if (name.includes('au sirop') || name.includes('de vigne')) return 'fruits-sirop';
  
  // Biscuits sucrés
  if (name.includes('cookie') || name.includes('sablé') || name.includes('biscuit') || 
      name.includes('canistrelli') || name.includes('langue de chat') || 
      name.includes('croquant') || name.includes('palet')) {
    return 'biscuits-sucres';
  }
  
  // Apéritifs
  if (name.includes('zap') || name.includes('croc') || name.includes('croûton')) {
    return 'aperitifs';
  }
  
  // Biscottes
  if (name.includes('biscotte')) return 'biscottes';
  
  // Macarons
  if (name.includes('macaron')) return 'macarons';
  
  // Confits et chutneys
  if (name.includes('confit') || name.includes('chutney')) return 'confits-chutneys';
  
  // Sirops
  if (name.includes('sirop')) return 'sirops';
  
  // Caramels
  if (name.includes('caramel')) return 'caramels';
  
  return 'autres'; // Catégorie par défaut
};

// Mapping des couleurs par catégorie pour l'affichage
const categoryColors = {
  'confitures': '#F59E0B',      // Amber
  'fruits-sirop': '#10B981',    // Emerald
  'biscuits-sucres': '#8B5CF6', // Violet
  'aperitifs': '#EF4444',       // Red
  'biscottes': '#F97316',       // Orange
  'macarons': '#EC4899',        // Pink
  'confits-chutneys': '#06B6D4', // Cyan
  'sirops': '#3B82F6',          // Blue
  'caramels': '#A855F7',        // Purple
  'autres': '#6B7280'           // Gray
};

async function updateProductCategories() {
  try {
    console.log('🔄 Récupération des produits...');
    
    // Récupérer tous les produits
    const products = await stripe.products.list({
      limit: 100,
      active: true
    });
    
    console.log(`📦 ${products.data.length} produits trouvés`);
    
    let updated = 0;
    let errors = 0;
    
    for (const product of products.data) {
      try {
        const category = getCategoryFromName(product.name);
        const color = categoryColors[category];
        
        // Mettre à jour les métadonnées
        await stripe.products.update(product.id, {
          metadata: {
            ...product.metadata, // Garder les métadonnées existantes
            category: category,
            category_color: color,
            updated_at: new Date().toISOString()
          }
        });
        
        console.log(`✅ ${product.name} → ${category}`);
        updated++;
        
        // Pause pour éviter les limites de taux
        await new Promise(resolve => setTimeout(resolve, 100));
        
      } catch (error) {
        console.error(`❌ Erreur pour ${product.name}:`, error.message);
        errors++;
      }
    }
    
    console.log(`\n🎉 Terminé ! ${updated} produits mis à jour, ${errors} erreurs`);
    
    // Afficher un résumé par catégorie
    console.log('\n📊 Résumé par catégorie:');
    const categoryCount = {};
    for (const product of products.data) {
      const category = getCategoryFromName(product.name);
      categoryCount[category] = (categoryCount[category] || 0) + 1;
    }
    
    Object.entries(categoryCount).forEach(([cat, count]) => {
      console.log(`   ${cat}: ${count} produits`);
    });
    
  } catch (error) {
    console.error('💥 Erreur globale:', error);
  }
}

// Fonction pour prévisualiser sans modifier
async function previewCategories() {
  try {
    console.log('👁️  Prévisualisation des catégories...\n');
    
    const products = await stripe.products.list({
      limit: 100,
      active: true
    });
    
    const categoryCount = {};
    
    products.data.forEach(product => {
      const category = getCategoryFromName(product.name);
      categoryCount[category] = (categoryCount[category] || 0) + 1;
      console.log(`${product.name} → ${category}`);
    });
    
    console.log('\n📊 Résumé:');
    Object.entries(categoryCount).forEach(([cat, count]) => {
      console.log(`   ${cat}: ${count} produits`);
    });
    
  } catch (error) {
    console.error('Erreur:', error);
  }
}

// Exécution
const mode = process.argv[2];
if (mode === 'preview') {
  previewCategories();
} else if (mode === 'update') {
  updateProductCategories();
} else {
  console.log(`
Usage:
  node update-product-categories.js preview  # Prévisualiser
  node update-product-categories.js update   # Mettre à jour
  `);
}

module.exports = { getCategoryFromName, categoryColors };
