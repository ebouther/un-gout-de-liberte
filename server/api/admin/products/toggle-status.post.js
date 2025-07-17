import Stripe from 'stripe'
import { stripeRetry, getStripeLimiter } from '~/server/utils/stripe-retry.js'

const stripe = new Stripe(process.env.STRIPE_SK || process.env.STRIPE_SECRET_KEY)

export default defineEventHandler(async (event) => {
    try {
        const body = await readBody(event)
        const { productId, active } = body

        if (!productId || typeof active !== 'boolean') {
            throw createError({
                statusCode: 400,
                statusMessage: 'Paramètres manquants ou invalides'
            })
        }

        const rateLimiter = getStripeLimiter(stripe)

        // Mettre à jour le statut du produit avec retry
        const product = await rateLimiter.execute(() =>
            stripe.products.update(productId, {
                active: active
            })
        )

        console.log(`✅ Statut du produit ${productId} mis à jour: ${active ? 'actif' : 'inactif'}`)

        return {
            success: true,
            data: product
        }
    } catch (error) {
        console.error('Erreur lors de la mise à jour du statut:', error)

        // Gestion spécifique des rate limits
        if (error.type === 'StripeError' && error.code === 'rate_limit') {
            throw createError({
                statusCode: 429,
                statusMessage: 'Trop de requêtes à Stripe. Veuillez patienter et réessayer.'
            })
        }

        throw createError({
            statusCode: 500,
            statusMessage: 'Erreur lors de la mise à jour du statut: ' + (error.message || 'Erreur inconnue')
        })
    }
})
