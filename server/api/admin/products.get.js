import Stripe from 'stripe'
import { stripeRetry, getStripeLimiter } from '~/server/utils/stripe-retry.js'

const stripe = new Stripe(process.env.STRIPE_SK || process.env.STRIPE_SECRET_KEY)

export default defineEventHandler(async (event) => {
    try {
        const rateLimiter = getStripeLimiter(stripe)

        // Récupérer tous les produits avec retry automatique
        const products = await rateLimiter.execute(() =>
            stripe.products.list({
                limit: 100,
                active: true
            })
        )

        console.log(`📦 Récupération des prix pour ${products.data.length} produits...`)

        // Pour chaque produit, récupérer ses prix avec rate limiting
        const productsWithPrices = []

        for (const product of products.data) {
            try {
                const prices = await rateLimiter.execute(() =>
                    stripe.prices.list({
                        product: product.id,
                        limit: 100
                    })
                )

                productsWithPrices.push({
                    ...product,
                    prices: prices.data
                })

                // Log de progression
                if (productsWithPrices.length % 10 === 0) {
                    console.log(`✅ Traité ${productsWithPrices.length}/${products.data.length} produits`)
                }

            } catch (error) {
                console.warn(`⚠️ Erreur pour le produit ${product.id}:`, error.message)
                // Ajouter le produit sans prix plutôt que d'échouer complètement
                productsWithPrices.push({
                    ...product,
                    prices: []
                })
            }
        }

        console.log(`✅ Récupération terminée : ${productsWithPrices.length} produits`)

        return {
            success: true,
            data: productsWithPrices
        }
    } catch (error) {
        console.error('Erreur lors de la récupération des produits:', error)

        // Message d'erreur spécifique pour les rate limits
        if (error.type === 'StripeError' && error.code === 'rate_limit') {
            throw createError({
                statusCode: 429,
                statusMessage: 'Trop de requêtes à Stripe. Veuillez patienter quelques secondes et réessayer.'
            })
        }

        throw createError({
            statusCode: 500,
            statusMessage: 'Erreur lors de la récupération des produits: ' + (error.message || 'Erreur inconnue')
        })
    }
})
