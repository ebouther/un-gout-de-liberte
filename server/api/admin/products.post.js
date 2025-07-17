import Stripe from 'stripe'
import { stripeRetry, getStripeLimiter } from '~/server/utils/stripe-retry.js'

const stripe = new Stripe(process.env.STRIPE_SK || process.env.STRIPE_SECRET_KEY)

export default defineEventHandler(async (event) => {
    try {
        const body = await readBody(event)
        const { name, description, active, images, metadata, prices } = body

        // Validation des données de base
        if (!name || !Array.isArray(prices) || prices.length === 0) {
            throw createError({
                statusCode: 400,
                statusMessage: 'Nom du produit et au moins un prix requis'
            })
        }

        // Valider les prix
        for (const price of prices) {
            if (!price.unit_amount || price.unit_amount <= 0) {
                throw createError({
                    statusCode: 400,
                    statusMessage: 'Tous les prix doivent être supérieurs à 0'
                })
            }
            if (!price.weight) {
                throw createError({
                    statusCode: 400,
                    statusMessage: 'Le poids est requis pour chaque prix'
                })
            }
        }

        const rateLimiter = getStripeLimiter(stripe)

        // Créer le produit Stripe avec retry
        const product = await rateLimiter.execute(() =>
            stripe.products.create({
                name,
                description: description || undefined,
                active: active ?? true,
                images: images?.filter(img => img.trim()) || [],
                metadata: {
                    ...metadata,
                    created_by: 'admin_interface',
                    created_at: new Date().toISOString()
                }
            })
        )

        console.log(`✅ Produit créé: ${product.id}`)

        // Créer les prix associés avec rate limiting
        const createdPrices = []

        for (const priceData of prices) {
            try {
                const price = await rateLimiter.execute(() =>
                    stripe.prices.create({
                        unit_amount: Math.round(priceData.unit_amount), // Déjà en centimes
                        currency: 'eur',
                        product: product.id,
                        nickname: priceData.nickname || undefined,
                        active: priceData.active ?? true,
                        metadata: {
                            weight: priceData.weight,
                            created_by: 'admin_interface'
                        }
                    })
                )

                createdPrices.push(price)
                console.log(`✅ Prix créé: ${price.id} (${priceData.nickname || 'sans nom'})`)

            } catch (error) {
                console.error(`❌ Erreur lors de la création du prix ${priceData.nickname}:`, error.message)

                // Si un prix échoue, on continue avec les autres
                // mais on log l'erreur pour investigation
                if (error.type === 'StripeError' && error.code === 'rate_limit') {
                    // Pour les rate limits, on re-lance l'erreur
                    throw error
                }
            }
        }

        return {
            success: true,
            data: {
                product,
                prices: createdPrices
            }
        }
    } catch (error) {
        console.error('Erreur lors de la création du produit:', error)

        // Gestion spécifique des rate limits
        if (error.type === 'StripeError' && error.code === 'rate_limit') {
            throw createError({
                statusCode: 429,
                statusMessage: 'Trop de requêtes à Stripe. Veuillez patienter et réessayer.'
            })
        }

        // Gestion des erreurs Stripe spécifiques
        if (error.type === 'StripeCardError') {
            throw createError({
                statusCode: 400,
                statusMessage: 'Erreur de validation Stripe: ' + error.message
            })
        }

        throw createError({
            statusCode: 500,
            statusMessage: 'Erreur lors de la création du produit: ' + (error.message || 'Erreur inconnue')
        })
    }
})
