# Système de Frais de Livraison Colissimo

## Vue d'ensemble

Ce système intègre les tarifs officiels de Colissimo 2025 de La Poste française pour calculer automatiquement les frais de livraison en fonction du poids des produits. **Livraison uniquement en France** (métropolitaine et outre-mer).

## Fonctionnalités

### 📦 Calcul automatique des frais
- **Tarifs officiels 2025** : Intégration complète des grilles tarifaires La Poste
- **Calcul par poids** : Extraction automatique du poids depuis les métadonnées Stripe
- **Zones françaises** : Support France métropolitaine et Outre-mer français uniquement

### 🚚 Options de livraison
- **Colissimo Standard** : Livraison domicile 2-3 jours (France entière)
- **Colissimo Access** : Livraison point relais (France métropolitaine uniquement, plus économique)

### 🆓 Livraison gratuite
- **Seuil configuré** : 50€ minimum de commande
- **Calcul automatique** : Progression vers la livraison gratuite
- **Indicateur visuel** : Barre de progression dans le panier

## Tarifs Colissimo France Métropolitaine 2025

| Poids     | Standard | Access    |
|-----------|----------|-----------|
| Jusqu'à 250g | 5,25 €   | 4,55 €    |
| Jusqu'à 500g | 7,35 €   | 6,65 €    |
| Jusqu'à 750g | 8,65 €   | 7,95 €    |
| Jusqu'à 1 kg | 9,40 €   | 8,70 €    |
| Jusqu'à 2 kg | 10,70 €  | 10,00 €   |
| Jusqu'à 5 kg | 16,60 €  | 15,90 €   |
| Jusqu'à 10 kg| 24,20 €  | N/A       |
| Jusqu'à 15 kg| 30,55 €  | N/A       |
| Jusqu'à 30 kg| 37,85 €  | N/A       |

## Fichiers créés/modifiés

### Nouveaux composables
- `composables/useShipping.js` : Logique métier côté client
- `server/utils/shipping.js` : Utilitaires côté serveur

### Nouveaux composants
- `components/ShippingCalculator.vue` : Interface de calcul des frais

### Fichiers modifiés
- `components/cart.vue` : Intégration du calculateur dans le panier
- `server/api/order.js` : Calcul des frais côté serveur pour Stripe

## Utilisation

### Côté client
```javascript
import { useShipping } from '~/composables/useShipping'

const { calculateShippingCost, formatShippingPrice } = useShipping()

// Calculer les frais pour 1kg vers la France
const cost = calculateShippingCost(1, 'FR', '', 'standard')
console.log(formatShippingPrice(cost)) // "9,40 €"
```

### Côté serveur
```javascript
import { calculateOrderWeight, calculateShippingCost } from '../utils/shipping.js'

// Dans l'API order.js
const totalWeight = await calculateOrderWeight(items, stripe)
const shippingCost = calculateShippingCost(totalWeight)
```

## Configuration

### Variables d'environnement
- `STRIPE_PK` : Clé publique Stripe
- `STRIPE_SK` : Clé secrète Stripe

### Métadonnées produits
Le système extrait le poids depuis :
1. Métadonnées du prix (`Poids` ou `Poids net total`)
2. Métadonnées du produit (fallback)
3. Nom du produit (parsing automatique)

Formats supportés : `250g`, `1kg`, `1.5 kg`, `2,5kg`

## Zones de livraison

1. **France métropolitaine** : Codes postaux 00000-96999 (sauf Outre-mer)
2. **Outre-mer français** : Codes postaux 97xxx, 98xxx + territoires spécifiques
3. **Europe** : Union européenne + Suisse, Norvège, etc.
4. **Monde** : Tous les autres pays

## Tests

Fichier de test disponible : `scripts/test-shipping.js`

```bash
node scripts/test-shipping.js
```

## Intégration Stripe

Le système crée automatiquement des `shipping_rates` dynamiques dans Stripe avec :
- Prix exact selon le poids
- Description descriptive
- Estimations de livraison
- Métadonnées de suivi
