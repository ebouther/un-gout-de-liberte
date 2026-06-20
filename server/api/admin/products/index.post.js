import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SK, {
    apiVersion: '2023-10-16',
})

export default defineEventHandler(async (event) => {
    try {
        const { verifyAdmin } = await import('~/server/utils/adminAuth.js')
        verifyAdmin(event)

        const method = getMethod(event)

        if (method === 'POST') {
            // Créer un nouveau produit
            const body = await readBody(event)

            if (!body.name) {
                throw createError({
                    statusCode: 400,
                    statusMessage: 'Le nom du produit est requis'
                })
            }

            const productData = {
                name: body.name,
                description: body.description || '',
                active: body.active !== false,
                images: body.images || [],
                metadata: body.metadata || {}
            }

            const product = await stripe.products.create(productData)

            return {
                success: true,
                product: {
                    id: product.id,
                    name: product.name,
                    description: product.description,
                    active: product.active,
                    images: product.images,
                    metadata: product.metadata,
                    prices: [] // Nouveau produit sans prix pour l'instant
                }
            }
        }

        throw createError({
            statusCode: 405,
            statusMessage: 'Méthode non autorisée'
        })

    } catch (error) {
        console.error('❌ Erreur API admin/products:', error)

        if (error.statusCode) {
            throw error
        }

        throw createError({
            statusCode: 500,
            statusMessage: error.message || 'Erreur serveur'
        })
    }
})
