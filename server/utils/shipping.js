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
 * Lève une erreur si le format n'est pas reconnu
 */
const parseWeight = (weightStr) => {
    if (!weightStr) {
        throw new Error('Chaîne de poids vide ou non définie')
    }

    const str = weightStr.toString().toLowerCase()

    // Recherche de patterns comme "250g", "1kg", "1.5 kg", etc.
    const kgMatch = str.match(/(\d+(?:[.,]\d+)?)\s*kg/)
    if (kgMatch) {
        const weight = parseFloat(kgMatch[1].replace(',', '.'))
        if (isNaN(weight) || weight <= 0) {
            throw new Error(`Poids invalide en kg: "${weightStr}" (valeur parsée: ${weight})`)
        }
        return weight
    }

    const gMatch = str.match(/(\d+(?:[.,]\d+)?)\s*g/)
    if (gMatch) {
        const weightInGrams = parseFloat(gMatch[1].replace(',', '.'))
        if (isNaN(weightInGrams) || weightInGrams <= 0) {
            throw new Error(`Poids invalide en grammes: "${weightStr}" (valeur parsée: ${weightInGrams}g)`)
        }
        return weightInGrams / 1000
    }

    // Si aucun pattern n'est reconnu
    throw new Error(`Format de poids non reconnu: "${weightStr}". Formats acceptés: "250g", "1kg", "1.5 kg", etc.`)
}

/**
 * Extrait le poids depuis le nickname/lookup_key du prix
 * Lève une erreur si aucun poids valide n'est trouvé
 */
const parseWeightFromPriceInfo = (price) => {
    // Vérifier nickname (nom affiché du prix)
    if (price.nickname) {
        try {
            return parseWeight(price.nickname)
        } catch (error) {
            // Continue vers lookup_key si nickname échoue
        }
    }

    // Vérifier lookup_key 
    if (price.lookup_key) {
        try {
            return parseWeight(price.lookup_key)
        } catch (error) {
            // Continue si lookup_key échoue aussi
        }
    }

    throw new Error(`Aucun poids trouvé dans nickname "${price.nickname}" ou lookup_key "${price.lookup_key}"`)
}

/**
 * Calcule le poids d'un article depuis ses métadonnées
 * Priorité: price.metadata.weight > autres métadonnées > nom du produit
 * Lève une erreur si aucun poids valide n'est trouvé
 */
const getItemWeight = async (priceId, stripe) => {
    try {
        // Récupérer les informations du prix
        const price = await stripe.prices.retrieve(priceId)

        // 1. Vérifier d'abord price.metadata.weight (PRIORITÉ ABSOLUE)
        if (price.metadata?.weight) {
            const weight = parseWeight(price.metadata.weight)
            if (weight < 0.01) { // moins de 10g
                throw new Error(`Poids trop faible pour le prix ${priceId}: ${weight}kg (minimum 10g requis)`)
            }
            return weight
        }

        // 2. Vérifier autres métadonnées du prix (pour compatibilité)
        if (price.metadata) {
            const possibleKeys = ['Poids', 'Poids net total', 'poids', 'Weight']
            for (const key of possibleKeys) {
                const weightStr = price.metadata[key]
                if (weightStr) {
                    const weight = parseWeight(weightStr)
                    if (weight < 0.01) {
                        throw new Error(`Poids trop faible pour le prix ${priceId}: ${weight}kg (minimum 10g requis)`)
                    }
                    return weight
                }
            }
        }

        // 3. Extraire depuis nickname/lookup_key du prix
        try {
            const weight = parseWeightFromPriceInfo(price)
            if (weight < 0.01) {
                throw new Error(`Poids trop faible pour le prix ${priceId}: ${weight}kg (minimum 10g requis)`)
            }
            return weight
        } catch (error) {
            // Continue vers le produit
        }

        // 4. Si pas trouvé dans le prix, vérifier le produit (fallback)
        if (price.product) {
            const product = await stripe.products.retrieve(price.product)

            if (product.metadata) {
                const possibleKeys = ['Poids', 'Poids net total', 'poids', 'weight', 'Weight']
                for (const key of possibleKeys) {
                    const weightStr = product.metadata[key]
                    if (weightStr) {
                        const weight = parseWeight(weightStr)
                        if (weight < 0.01) {
                            throw new Error(`Poids trop faible pour le produit ${product.id}: ${weight}kg (minimum 10g requis)`)
                        }
                        return weight
                    }
                }
            }

            // 5. Fallback : extraction depuis le nom du produit
            if (product.name) {
                try {
                    const weight = parseWeight(product.name)
                    if (weight < 0.01) {
                        throw new Error(`Poids trop faible pour le produit ${product.id}: ${weight}kg (minimum 10g requis)`)
                    }
                    return weight
                } catch (error) {
                    // Le nom du produit ne contient pas de poids valide
                }
            }
        }

        // Aucun poids trouvé nulle part
        throw new Error(`Aucun poids trouvé pour le prix ${priceId}. Le poids doit être défini dans price.metadata.weight`)

    } catch (error) {
        // Si c'est déjà notre erreur, la propager
        if (error.message.includes('Aucun poids trouvé') || error.message.includes('Poids trop faible')) {
            throw error
        }
        // Autres erreurs (API Stripe, etc.)
        throw new Error(`Erreur lors de la récupération du poids pour ${priceId}: ${error.message}`)
    }
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
