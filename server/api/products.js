import Stripe from 'stripe'
import { defineEventHandler, getMethod, createError, setHeader, getRequestHost, getRequestProtocol } from 'h3'

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
      setHeader(event, 'Cache-Control', 'public, max-age=300')
      return mapImages(productsCache, event)
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
      .filter(p => p.active && !p.metadata?.hidden)
      .map(p => {
        const productPrices = prices.filter(price => price.product === p.id)
        const mainPrice = productPrices[0] || null
        return {
          id: p.id,
          name: p.name,
          description: p.description,
          images: p.images,
          metadata: p.metadata,
          active: p.active,
          price: mainPrice ? { ...mainPrice } : null,
          prices: productPrices.map(price => ({ ...price }))
        }
      })
      .filter(p => p.prices.length > 0)

    productsCache = result
    cacheTimestamp = now

    setHeader(event, 'Cache-Control', 'public, max-age=300')
    setHeader(event, 'X-Content-Type-Options', 'nosniff')

    return mapImages(result, event)
  } catch (error) {
    console.error('Products API error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch products'
    })
  }
})

function mapImages(products, event) {
  const host = getRequestHost(event)
  const protocol = getRequestProtocol(event)
  const isStripeFile = (url) => url && url.startsWith('https://files.stripe.com/')

  return products.map(p => ({
    ...p,
    images: p.images.map(img =>
      isStripeFile(img)
        ? `${protocol}://${host}/api/image-proxy?url=${encodeURIComponent(img)}`
        : img
    )
  }))
}