import Stripe from 'stripe'
import { defineEventHandler, getMethod, createError, setHeader } from 'h3'

const stripe = new Stripe(process.env.STRIPE_SK, {
  apiVersion: '2023-10-16',
})

// Simple in-memory cache (use Redis in production)
let productsCache = null
let cacheTimestamp = 0
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

export default defineEventHandler(async (event) => {
  try {
    // Security: Only allow GET requests
    if (getMethod(event) !== 'GET') {
      throw createError({
        statusCode: 405,
        statusMessage: 'Method not allowed'
      })
    }

    // Check cache first
    const now = Date.now()
    if (productsCache && (now - cacheTimestamp) < CACHE_DURATION) {
      // Set cache headers
      setHeader(event, 'Cache-Control', 'public, max-age=300') // 5 minutes
      return productsCache
    }

    const { data: products } = await stripe.products.list({
      limit: 100,
      active: true,
      expand: ['data.default_price']
    })

    const { data: prices } = await stripe.prices.list({
      limit: 100,
      active: true
    })

    const result = products
      .filter(p => p.active && !p.metadata?.hidden) // Hide products with hidden metadata
      .map(p => ({
        id: p.id,
        name: p.name,
        description: p.description,
        images: p.images,
        metadata: p.metadata,
        price: prices.find(price => price.product === p.id)
      }))
      .filter(p => p.price) // Only return products with valid prices

    // Update cache
    productsCache = result
    cacheTimestamp = now

    // Set security and cache headers
    setHeader(event, 'Cache-Control', 'public, max-age=300')
    setHeader(event, 'X-Content-Type-Options', 'nosniff')

    return result
  } catch (error) {
    console.error('Products API error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch products'
    })
  }
})