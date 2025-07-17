# 📊 Guide d'utilisation des scripts Export/Import Stripe

## 🎯 Ce que tu peux faire

### 1. 📤 Export de toutes tes données
```bash
node scripts/export-stripe-data.js
```
→ Génère `exports/stripe-export-YYYY-MM-DDTHH-MM-SS.csv`

### 2. ✏️ Modification dans Excel/LibreOffice
- Ouvre le fichier CSV dans ton tableur préféré
- Modifie les colonnes que tu veux
- Sauvegarde (garde le format CSV)

### 3. 📥 Import des modifications
```bash
node scripts/import-stripe-data.js exports/mon-fichier-modifie.csv
```

## 🔧 Exemples pratiques

### ✅ Corriger les poids en masse
**Problème** : Tous tes `price_metadata_weight` sont incorrects

1. Export : `node scripts/export-stripe-data.js`
2. Ouvre le CSV dans Excel
3. Filtre sur la colonne `price_metadata_weight`
4. Modifie toutes les valeurs (ex: `90g` → `90g`, `500g` → `500g`)
5. Sauvegarde le fichier
6. Import : `node scripts/import-stripe-data.js exports/ton-fichier.csv`

### ✅ Ajouter des descriptions manquantes
**Problème** : Certains produits n'ont pas de description

1. Export des données
2. Filtre sur `product_description` (colonnes vides)
3. Remplis les descriptions manquantes
4. Réimporte

### ✅ Désactiver des produits obsolètes
**Problème** : Tu veux retirer certains produits de la vente

1. Export des données
2. Modifie `product_active` de `true` → `false` pour les produits à désactiver
3. Optionnel : modifie aussi `price_active` pour désactiver les prix
4. Réimporte

### ✅ Organiser les catégories
**Problème** : Tes métadonnées de catégorie sont en désordre

1. Export des données
2. Modifie `product_metadata_category` avec des valeurs cohérentes
3. Modifie `product_metadata_category_color` pour les couleurs
4. Réimporte

## ⚠️ Limitations importantes

### Prix Stripe (colonnes `price_*`)
- ✅ **Modifiable** : `active`, `nickname`, `lookup_key`, `metadata`
- ❌ **NON modifiable** : `unit_amount`, `currency`, `type`

> 💡 **Pour changer un prix** : Tu dois créer un nouveau prix dans Stripe, pas modifier l'existant.

### Données en lecture seule
- ❌ `product_id`, `price_id` (identifiants uniques)
- ❌ `product_created`, `price_created` (dates de création)
- ❌ `product_updated` (géré automatiquement par Stripe)

## 📋 Colonnes les plus utiles

### Produits
- `product_name` → Nom affiché
- `product_description` → Description visible
- `product_active` → Visible/caché (true/false)
- `product_metadata_*` → Toutes tes métadonnées personnalisées

### Prix
- `price_active` → Prix actif/inactif
- `price_metadata_weight` → **LE PLUS IMPORTANT** pour tes calculs de poids
- `price_nickname` → Nom d'affichage du prix (ex: "715g", "350g")

## 🚨 Conseils de sécurité

1. **Toujours tester d'abord** sur quelques lignes
2. **Faire une sauvegarde** avant les gros changements
3. **Vérifier les modifications** dans Stripe après import
4. **Garder une copie** de ton fichier CSV modifié

## 📁 Organisation des fichiers

```
exports/
├── stripe-export-2025-07-17T21-12-25.csv    # Export original
├── poids-corriges-2025-07-17.csv            # Version avec poids corrigés
└── descriptions-ajoutees-2025-07-17.csv     # Version avec descriptions
```

## 🎯 Cas d'usage fréquents

### Scenario 1: Migration des poids
Tu as migré tous tes poids vers `price_metadata_weight` mais tu veux vérifier que tout est correct.

### Scenario 2: Nettoyage des produits
Tu as des doublons ou des produits obsolètes à gérer.

### Scenario 3: Harmonisation des données
Tu veux que toutes tes catégories, descriptions soient cohérentes.

---
💡 **Astuce** : Une fois que tu maîtrises le système, tu peux faire des modifications très rapides sur des centaines de produits !
