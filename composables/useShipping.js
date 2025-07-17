/**
 * Composable pour gérer les frais de livraison Colissimo
 * Tarifs officiels La Poste 2025
 */

export const useShipping = () => {
  
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

  // Tarifs Colissimo Outre-mer Zone OM1 (Guadeloupe, Martinique, Guyane, La Réunion, Mayotte, etc.)
  const colissimoOM1Rates = [
    { maxWeight: 0.5, price: 12.65 },
    { maxWeight: 1, price: 20.00 },
    { maxWeight: 2, price: 27.25 },
    { maxWeight: 5, price: 40.95 },
    { maxWeight: 10, price: 65.60 },
    { maxWeight: 15, price: 137.05 },
    { maxWeight: 30, price: 150.55 }
  ]

  // Tarifs Colissimo Europe
  const colissimoEuropeRates = [
    { maxWeight: 0.5, price: 14.85 },
    { maxWeight: 1, price: 18.45 },
    { maxWeight: 2, price: 20.90 },
    { maxWeight: 5, price: 26.80 },
    { maxWeight: 10, price: 44.20 },
    { maxWeight: 15, price: 64.80 },
    { maxWeight: 30, price: 84.00 }
  ]

  // Tarifs Colissimo International Monde Zone B
  const colissimoWorldBRates = [
    { maxWeight: 0.5, price: 22.70 },
    { maxWeight: 1, price: 27.10 },
    { maxWeight: 2, price: 29.65 },
    { maxWeight: 5, price: 38.00 },
    { maxWeight: 10, price: 63.00 },
    { maxWeight: 15, price: 85.50 },
    { maxWeight: 20, price: 104.50 }
  ]

  // Zones géographiques
  const shippingZones = {
    'france-metropolitaine': {
      name: 'France métropolitaine',
      countries: ['FR'],
      postalCodes: /^[0-9]{5}$/,
      excludePostalCodes: /^(97|98)/, // Exclut l'outre-mer
      rates: colissimoFranceRates
    },
    'outre-mer-om1': {
      name: 'Outre-mer français (OM1)',
      countries: ['GP', 'MQ', 'GF', 'RE', 'YT', 'PM', 'MF', 'BL'],
      postalCodes: /^(97|98)[0-9]{3}$/,
      rates: colissimoOM1Rates
    },
    'europe': {
      name: 'Europe',
      countries: [
        'DE', 'AT', 'BE', 'BG', 'HR', 'CY', 'DK', 'ES', 'EE', 'FI',
        'GR', 'HU', 'IE', 'IT', 'LV', 'LT', 'LU', 'MT', 'NL', 'PL',
        'PT', 'RO', 'SK', 'SI', 'SE', 'CZ', 'CH', 'NO', 'IS', 'LI',
        'SM', 'VA', 'MC', 'AD'
      ],
      rates: colissimoEuropeRates
    },
    'monde': {
      name: 'Reste du monde',
      countries: [], // Par défaut pour tous les autres pays
      rates: colissimoWorldBRates
    }
  }

  /**
   * Détermine la zone d'expédition en fonction du code postal français
   */
  const getShippingZone = (countryCode = 'FR', postalCode = '') => {
    // Nous ne gérons que la France
    if (countryCode !== 'FR') {
      console.warn('Seule la France est supportée pour la livraison')
      return 'france-metropolitaine'
    }

    // Vérification code postal outre-mer français
    if (postalCode && postalCode.match(/^(97|98)[0-9]{3}$/)) {
      return 'outre-mer-om1'
    }

    // Par défaut : France métropolitaine
    return 'france-metropolitaine'
  }

  /**
   * Calcule les frais de livraison en fonction du poids et de la zone française
   */
  const calculateShippingCost = (weightKg, countryCode = 'FR', postalCode = '', deliveryType = 'standard') => {
    if (weightKg <= 0) return 0

    const zone = getShippingZone(countryCode, postalCode)
    
    // France métropolitaine - choix entre standard et access
    if (zone === 'france-metropolitaine') {
      const rate = colissimoFranceRates.find(r => weightKg <= r.maxWeight)
      if (!rate) return 0
      
      if (deliveryType === 'access' && rate.access !== null) {
        return rate.access
      }
      return rate.standard
    }

    // Outre-mer français (OM1)
    if (zone === 'outre-mer-om1') {
      const rate = colissimoOM1Rates.find(r => weightKg <= r.maxWeight)
      return rate ? rate.price : 0
    }

    // Par défaut
    return 0
  }

  /**
   * Calcule les frais de livraison pour un panier entier
   */
  const calculateCartShipping = (cartItems, countryCode = 'FR', postalCode = '', deliveryType = 'standard') => {
    if (!cartItems || cartItems.length === 0) return 0

    // Calcul du poids total du panier
    let totalWeight = 0
    
    for (const item of cartItems) {
      const itemWeight = getItemWeight(item)
      totalWeight += itemWeight * item.quantity
    }
    
    return calculateShippingCost(totalWeight, countryCode, postalCode, deliveryType)
  }

  /**
   * Extrait le poids d'un article (en kg)
   */
  const getItemWeight = (item) => {
    // Si c'est un objet variant avec price
    if (item.price && item.price.metadata) {
      // Chercher dans toutes les clés possibles
      const possibleKeys = ['Poids', 'Poids net total', 'poids', 'weight', 'Weight']
      for (const key of possibleKeys) {
        const weightStr = item.price.metadata[key]
        if (weightStr) {
          return parseWeight(weightStr)
        }
      }
    }

    // Si c'est un produit avec metadata
    if (item.product && item.product.metadata) {
      const possibleKeys = ['Poids', 'Poids net total', 'poids', 'weight', 'Weight']
      for (const key of possibleKeys) {
        const weightStr = item.product.metadata[key]
        if (weightStr) {
          return parseWeight(weightStr)
        }
      }
    }

    // Chercher directement dans les métadonnées de l'item
    if (item.metadata) {
      const possibleKeys = ['Poids', 'Poids net total', 'poids', 'weight', 'Weight']
      for (const key of possibleKeys) {
        const weightStr = item.metadata[key]
        if (weightStr) {
          return parseWeight(weightStr)
        }
      }
    }

    // Fallback : extraction depuis le nom du produit
    if (item.product && item.product.name) {
      return parseWeightFromName(item.product.name)
    }

    // Fallback : extraction depuis le nom de l'item
    if (item.name) {
      return parseWeightFromName(item.name)
    }

    // Poids par défaut si aucune information
    return 0.5
  }

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
   * Extrait le poids depuis le nom du produit
   */
  const parseWeightFromName = (productName) => {
    if (!productName) return 0.5
    return parseWeight(productName)
  }

  /**
   * Formate le prix d'expédition
   */
  const formatShippingPrice = (price) => {
    if (price === 0) return 'Gratuit'
    return `${price.toFixed(2)} €`
  }

  /**
   * Obtient les options de livraison disponibles pour la France
   */
  const getDeliveryOptions = (countryCode = 'FR', postalCode = '') => {
    const zone = getShippingZone(countryCode, postalCode)
    
    const options = [
      {
        id: 'standard',
        name: 'Colissimo Standard',
        description: 'Livraison à domicile en 2-3 jours ouvrés',
        available: true
      }
    ]

    // Option Colissimo Access disponible uniquement en France métropolitaine
    if (zone === 'france-metropolitaine') {
      options.push({
        id: 'access',
        name: 'Colissimo Access',
        description: 'Livraison en point relais (plus économique)',
        available: true
      })
    }

    return options
  }

  /**
   * Vérifie si la livraison gratuite est possible
   */
  const getFreeShippingThreshold = (countryCode = 'FR') => {
    // Seuil de livraison gratuite configurable
    const thresholds = {
      'FR': 50, // 50€ pour la France
      'default': 100 // 100€ pour les autres pays
    }

    return thresholds[countryCode] || thresholds.default
  }

  /**
   * Calcule si la livraison gratuite s'applique
   */
  const isFreeShippingEligible = (cartTotal, countryCode = 'FR') => {
    const threshold = getFreeShippingThreshold(countryCode)
    return cartTotal >= threshold
  }

  return {
    // Fonctions principales
    calculateShippingCost,
    calculateCartShipping,
    getShippingZone,
    getDeliveryOptions,
    
    // Utilitaires
    getItemWeight,
    parseWeight,
    parseWeightFromName,
    formatShippingPrice,
    
    // Livraison gratuite
    getFreeShippingThreshold,
    isFreeShippingEligible,
    
    // Données
    shippingZones,
    colissimoFranceRates
  }
}
