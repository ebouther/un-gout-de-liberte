# Scripts de gestion des produits Stripe

## Installation
```bash
npm install stripe dotenv
```

## 1. Sauvegarde de sécurité (OBLIGATOIRE avant toute modification)
```bash
node scripts/backup-restore.js backup
```

## 2. Prévisualisation des catégories
```bash
node scripts/update-product-categories.js preview
```

## 3. Application des catégories
```bash
node scripts/update-product-categories.js update
```

## 4. Restauration en cas de problème
```bash
node scripts/backup-restore.js restore backup-products-2025-07-16.json
```

## Structure des catégories appliquées :

- **confitures** : Confiture de pêches, Confiture de Reine-Claude, etc.
- **fruits-sirop** : Mirabelles au sirop, Poires au sirop, Pêches de vigne, etc.
- **biscuits-sucres** : Cookies, Sablés, Biscuits à l'amande, Langue de chat, etc.
- **aperitifs** : Zap'moutarde, Zap'oignons, Croc'oignons, Croûtons, etc.
- **biscottes** : Biscottes aux fruits, Biscottes aux céréales, etc.
- **macarons** : Macarons
- **confits-chutneys** : Confit d'oignons, Chutney de coings, etc.
- **sirops** : Sirop de coings
- **caramels** : Caramels
- **autres** : Produits non catégorisés

## Métadonnées ajoutées à chaque produit :
- `category` : La catégorie du produit
- `category_color` : Couleur hexadécimale pour l'affichage
- `updated_at` : Timestamp de la dernière mise à jour

## Sécurité :
- ✅ Sauvegarde automatique recommandée
- ✅ Mode prévisualisation pour vérifier avant modification
- ✅ Pause entre les requêtes pour respecter les limites Stripe
- ✅ Gestion des erreurs
- ✅ Conservation des métadonnées existantes
