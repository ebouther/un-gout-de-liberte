/**
 * Utilitaires pour les frais de livraison côté serveur
 */

// Tarifs Colissimo France métropolitaine 2025
const colissimoFranceRates = [
  { maxWeight: 0.25, standard: 5.25, access: 4.55 },
  { maxWeight: 0.5, standard: 7.35, access: 6.65 },
  { maxWeight: 0.75, standard: 8.65, access: 7.95 },
  { maxWeight: 1, standard: 9.40, access: 8.70 },
  { maxWeight: 2, standard: 10.70, access: 10.00 },
  { maxWeight: 5, standard: 16.60, access: 15.90 },
  { maxWeight: 10, standard: 24.20, access: null },
  { maxWeight: 15, standard: 30.55, access: null },
  { maxWeight: 30, standard: 37.85, access: null }
]

/**
 * Parse une chaîne de poids en kg
 */
const parseWeight = (weightStr) => {
  if (!weightStr) return 0.5

  const str = weightStr.toString().toLowerCase()
  
  // Recherche de patterns comme "250g", "1kg", "1.5 kg", etc.
  const kgMatch = str.match(/(\d+(?:[.,]\d+)?)\s*kg/)
  if (kgMatch) {
    return parseFloat(kgMatch[1].replace(',', '.'))
  }

  const gMatch = str.match(/(\d+(?:[.,]\d+)?)\s*g/)
  if (gMatch) {
    return parseFloat(gMatch[1].replace(',', '.')) / 1000
  }

  return 0.5
}

/**
 * Extrait le poids depuis le nickname/lookup_key du prix
 */
const parseWeightFromPriceInfo = (price) => {
  // Vérifier nickname (nom affiché du prix)
  if (price.nickname) {
    const weight = parseWeight(price.nickname)
    if (weight !== 0.5) return weight // Si on a trouvé un poids valide
  }
  
  // Vérifier lookup_key 
  if (price.lookup_key) {
    const weight = parseWeight(price.lookup_key)
    if (weight !== 0.5) return weight
  }
  
  return null
}

/**
 * Calcule le poids d'un article depuis ses métadonnées ou son nom
 */
const getItemWeight = async (priceId, stripe) => {
  try {
    // Récupérer les informations du prix
    const price = await stripe.prices.retrieve(priceId)
    
    // 1. Vérifier d'abord les métadonnées du prix (PRIORITÉ pour les variantes)
    if (price.metadata) {
      const possibleKeys = ['Poids', 'Poids net total', 'poids', 'weight', 'Weight']
      for (const key of possibleKeys) {
        const weightStr = price.metadata[key]
        if (weightStr) {
          return parseWeight(weightStr)
        }
      }
    }

    // 2. Extraire depuis nickname/lookup_key du prix
    const weightFromPriceInfo = parseWeightFromPriceInfo(price)
    if (weightFromPriceInfo) {
      return weightFromPriceInfo
    }

    // 3. Si pas trouvé dans le prix, vérifier le produit (fallback)
    if (price.product) {
      const product = await stripe.products.retrieve(price.product)
      
      if (product.metadata) {
        const possibleKeys = ['Poids', 'Poids net total', 'poids', 'weight', 'Weight']
        for (const key of possibleKeys) {
          const weightStr = product.metadata[key]
          if (weightStr) {
            return parseWeight(weightStr)
          }
        }
      }

      // 4. Fallback : extraction depuis le nom du produit
      if (product.name) {
        return parseWeight(product.name)
      }
    }
  } catch (error) {
    console.warn(`Erreur lors de la récupération du poids pour ${priceId}:`, error.message)
  }

  // Poids par défaut
  return 0.5
}

/**
 * Calcule le poids total d'une commande
 */
const calculateOrderWeight = async (items, stripe) => {
  let totalWeight = 0

  for (const item of items) {
    const itemWeight = await getItemWeight(item.price, stripe)
    totalWeight += itemWeight * item.quantity
  }

  return totalWeight
}

/**
 * Calcule les frais de livraison pour la France métropolitaine
 */
const calculateShippingCost = (weightKg, deliveryType = 'standard') => {
  if (weightKg <= 0) return 0

  const rate = colissimoFranceRates.find(r => weightKg <= r.maxWeight)
  if (!rate) return 0

  if (deliveryType === 'access' && rate.access !== null) {
    return rate.access
  }
  
  return rate.standard
}

/**
 * Vérifie si la livraison gratuite s'applique
 */
const isFreeShippingEligible = (cartTotal, threshold = 50) => {
  return cartTotal >= threshold
}

/**
 * Crée un shipping rate Stripe dynamique
 */
const createShippingRate = async (cost, displayName, stripe) => {
  try {
    // Convertir en centimes pour Stripe
    const unitAmount = Math.round(cost * 100)
    
    if (unitAmount === 0) {
      // Créer un taux de livraison gratuite
      return await stripe.shippingRates.create({
        display_name: 'Livraison gratuite',
        type: 'fixed_amount',
        fixed_amount: {
          amount: 0,
          currency: 'eur',
        },
        delivery_estimate: {
          minimum: {
            unit: 'business_day',
            value: 2,
          },
          maximum: {
            unit: 'business_day',
            value: 3,
          },
        },
      })
    }

    return await stripe.shippingRates.create({
      display_name: displayName || 'Colissimo Standard',
      type: 'fixed_amount',
      fixed_amount: {
        amount: unitAmount,
        currency: 'eur',
      },
      delivery_estimate: {
        minimum: {
          unit: 'business_day',
          value: 2,
        },
        maximum: {
          unit: 'business_day',
          value: 3,
        },
      },
    })
  } catch (error) {
    console.error('Erreur lors de la création du shipping rate:', error)
    throw error
  }
}

export {
  colissimoFranceRates,
  parseWeight,
  getItemWeight,
  calculateOrderWeight,
  calculateShippingCost,
  isFreeShippingEligible,
  createShippingRate
}
