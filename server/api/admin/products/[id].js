import Stripe from 'stripe'
import jwt from 'jsonwebtoken'

const stripe = new Stripe(process.env.STRIPE_SK, {
    apiVersion: '2023-10-16',
})

export default defineEventHandler(async (event) => {
    try {
        // Vérification de l'authentification
        const token = getCookie(event, 'admin-auth')
        if (!token) {
            throw createError({
                statusCode: 401,
                statusMessage: 'Non autorisé'
            })
        }

        const config = useRuntimeConfig()
        const secret = config.jwtSecret || process.env.JWT_SECRET || 'fallback-secret'

        try {
            jwt.verify(token, secret)
        } catch {
            throw createError({
                statusCode: 401,
                statusMessage: 'Token invalide'
            })
        }

        const productId = getRouterParam(event, 'id')
        const method = getMethod(event)

        if (method === 'PUT') {
            // Modifier un produit existant
            const body = await readBody(event)

            const updateData = {}

            if (body.name) updateData.name = body.name
            if (body.description !== undefined) updateData.description = body.description
            if (body.active !== undefined) updateData.active = body.active
            if (body.images) updateData.images = body.images
            if (body.metadata) updateData.metadata = body.metadata

            const product = await stripe.products.update(productId, updateData)

            // Récupérer les prix associés pour la réponse complète
            const { data: prices } = await stripe.prices.list({
                product: productId,
                active: true
            })

            return {
                success: true,
                product: {
                    id: product.id,
                    name: product.name,
                    description: product.description,
                    active: product.active,
                    images: product.images,
                    metadata: product.metadata,
                    prices: prices.map(price => ({ ...price }))
                }
            }
        }

        if (method === 'PATCH') {
            // Modification partielle (par exemple juste le statut actif)
            const body = await readBody(event)

            const updateData = {}
            if (body.active !== undefined) updateData.active = body.active

            const product = await stripe.products.update(productId, updateData)

            return {
                success: true,
                product: {
                    id: product.id,
                    active: product.active
                }
            }
        }

        throw createError({
            statusCode: 405,
            statusMessage: 'Méthode non autorisée'
        })

    } catch (error) {
        console.error('❌ Erreur API admin/products/[id]:', error)

        if (error.statusCode) {
            throw error
        }

        throw createError({
            statusCode: 500,
            statusMessage: error.message || 'Erreur serveur'
        })
    }
})
