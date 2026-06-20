import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SK || process.env.STRIPE_SECRET_KEY)

export default defineEventHandler(async (event) => {
    try {
        console.time('Load products and prices (2 queries)')

        // 1. Charger tous les produits (avec le prix principal)
        const productsRes = await stripe.products.list({
            limit: 100,
            active: true,
            expand: ['data.default_price']
        })
        const products = productsRes.data

        // 2. Charger tous les prix (jusqu'à 100 par page) - ADMIN voit tout
        const pricesRes = await stripe.prices.list({
            limit: 100
            // Pas de filtre active: true pour l'admin
        })
        const prices = pricesRes.data

        // 3. Mapping local : associer les prix aux produits
        const pricesByProduct = {}
        for (const price of prices) {
            if (!pricesByProduct[price.product]) pricesByProduct[price.product] = []
            pricesByProduct[price.product].push(price)
        }

        const productsWithPrices = products.map(product => ({
            ...product,
            prices: pricesByProduct[product.id] || [],
            default_price: product.default_price || null
        }))

        console.timeEnd('Load products and prices (2 queries)')
        console.log(`✅ Récupération terminée : ${productsWithPrices.length} produits, ${prices.length} prix`)

        return {
            success: true,
            data: productsWithPrices
        }
    } catch (error) {
        console.error('Erreur lors de la récupération des produits:', error)
        throw createError({
            statusCode: 500,
            statusMessage: 'Erreur lors de la récupération des produits: ' + (error.message || 'Erreur inconnue')
        })
    }
})
