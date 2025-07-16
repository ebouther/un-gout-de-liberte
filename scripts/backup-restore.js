// Script de sauvegarde/restauration des produits Stripe
const Stripe = require('stripe');
const fs = require('fs');
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

// Sauvegarder tous les produits
async function backupProducts() {
  try {
    console.log('💾 Sauvegarde des produits...');
    
    const products = await stripe.products.list({
      limit: 100,
      active: true
    });
    
    // Récupérer aussi les prix pour chaque produit
    const productsWithPrices = await Promise.all(
      products.data.map(async (product) => {
        const prices = await stripe.prices.list({
          product: product.id,
          active: true
        });
        return {
          ...product,
          prices: prices.data
        };
      })
    );
    
    const backup = {
      timestamp: new Date().toISOString(),
      products: productsWithPrices
    };
    
    const filename = `backup-products-${new Date().toISOString().split('T')[0]}.json`;
    fs.writeFileSync(filename, JSON.stringify(backup, null, 2));
    
    console.log(`✅ Sauvegarde créée: ${filename}`);
    console.log(`📦 ${products.data.length} produits sauvegardés`);
    
  } catch (error) {
    console.error('❌ Erreur lors de la sauvegarde:', error);
  }
}

// Restaurer les métadonnées depuis la sauvegarde
async function restoreMetadata(backupFile) {
  try {
    console.log(`🔄 Restauration depuis ${backupFile}...`);
    
    const backup = JSON.parse(fs.readFileSync(backupFile, 'utf8'));
    
    for (const product of backup.products) {
      await stripe.products.update(product.id, {
        metadata: product.metadata || {}
      });
      
      console.log(`✅ Restauré: ${product.name}`);
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    console.log('🎉 Restauration terminée');
    
  } catch (error) {
    console.error('❌ Erreur lors de la restauration:', error);
  }
}

const command = process.argv[2];
const file = process.argv[3];

if (command === 'backup') {
  backupProducts();
} else if (command === 'restore' && file) {
  restoreMetadata(file);
} else {
  console.log(`
Usage:
  node backup-restore.js backup                    # Créer une sauvegarde
  node backup-restore.js restore backup-file.json  # Restaurer depuis un fichier
  `);
}

module.exports = { backupProducts, restoreMetadata };
