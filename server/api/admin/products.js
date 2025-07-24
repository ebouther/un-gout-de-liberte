import Stripe from 'stripe'
import { defineEventHandler, getMethod, createError } from 'h3'

export default defineEventHandler(async (event) => {
  try {
    // Vérification d'authentification
    const config = useRuntimeConfig()
    const stripe = new Stripe(config.stripeSk || process.env.STRIPE_SK, {
      apiVersion: '2023-10-16',
    })

    if (getMethod(event) !== 'GET') {
      throw createError({
        statusCode: 405,
        statusMessage: 'Method not allowed'
      })
    }

    console.time('Fetch all products and prices')
    
    // Charger TOUS les produits et prix en parallèle avec pagination optimisée (sans rate limiting)
    const [allProducts, allPrices] = await Promise.all([
      // Charger tous les produits avec toutes les métadatas
      (async () => {
        const products = []
        let hasMore = true
        let startingAfter = null
        while (hasMore) {
          const params = {
            limit: 100,
            active: true,
            expand: ['data.default_price', 'data.metadata']
          }
          if (startingAfter) {
            params.starting_after = startingAfter
          }
          const result = await stripe.products.list(params)
          products.push(...result.data)
          hasMore = result.has_more
          if (hasMore && result.data.length > 0) {
            startingAfter = result.data[result.data.length - 1].id
          }
        }
        return products
      })(),
      // Charger tous les prix avec toutes les métadatas
      (async () => {
        const prices = []
        let hasMore = true
        let startingAfter = null
        while (hasMore) {
          const params = {
            limit: 100,
            active: true,
            expand: ['data.product', 'data.metadata']
          }
          if (startingAfter) {
            params.starting_after = startingAfter
          }
          const result = await stripe.prices.list(params)
          prices.push(...result.data)
          hasMore = result.has_more
          if (hasMore && result.data.length > 0) {
            startingAfter = result.data[result.data.length - 1].id
          }
        }
        return prices
      })()
    ])

    console.timeEnd('Fetch all products and prices')
    console.log(`Chargé ${allProducts.length} produits et ${allPrices.length} prix`)

    // Mapper les données optimisé
    const productsMap = new Map()
    
    // Grouper les prix par produit
    const pricesByProduct = new Map()
    allPrices.forEach(price => {
      if (!pricesByProduct.has(price.product)) {
        pricesByProduct.set(price.product, [])
      }
      pricesByProduct.get(price.product).push(price)
    })

    // Construire le résultat final
    const result = allProducts
      .filter(p => p.active && !p.metadata?.hidden)
      .map(product => {
        const productPrices = (pricesByProduct.get(product.id) || []).map(price => {
          // Si le prix n'a pas de métadata ou que la métadata est vide, copier celle du produit
          if (!price.metadata || Object.keys(price.metadata).length === 0) {
            price.metadata = product.metadata || {}
          }
          // Sinon, garder la métadata du prix telle quelle
          return price
        })
        return {
          id: product.id,
          name: product.name,
          description: product.description,
          images: product.images,
          metadata: product.metadata,
          created: product.created,
          updated: product.updated,
          active: product.active,
          default_price: product.default_price,
          prices: productPrices
        }
      })
      .filter(p => p.prices.length > 0)

    return {
      success: true,
      data: result,
      total: result.length,
      timestamp: new Date().toISOString()
    }

  } catch (error) {
    console.error('Admin products API error:', error)
    
    if (error.code === 'rate_limit') {
      throw createError({
        statusCode: 429,
        statusMessage: 'Rate limit exceeded. Please try again later.'
      })
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch products'
    })
  }
})
