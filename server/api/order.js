import Stripe from 'stripe'
import { defineEventHandler, createError, getRequestIP, readBody, getMethod } from 'h3'
import { 
  calculateOrderWeight, 
  calculateShippingCost, 
  isFreeShippingEligible,
  createShippingRate
} from '../utils/shipping.js'

const stripe = new Stripe(process.env.STRIPE_SK, {
  apiVersion: '2023-10-16',
})

// Rate limiting store (in production, use Redis or database)
const rateLimitStore = new Map()

const validateRequestBody = (items) => {
  if (!items || !Array.isArray(items) || items.length === 0) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid request: items array is required'
    })
  }

  if (items.length > 50) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Too many items in cart (max 50)'
    })
  }

  items.forEach((item, index) => {
    if (!item.price || typeof item.price !== 'string') {
      throw createError({
        statusCode: 400,
        statusMessage: `Invalid price for item ${index + 1}`
      })
    }
    if (!item.quantity || typeof item.quantity !== 'number' || item.quantity < 1 || item.quantity > 99) {
      throw createError({
        statusCode: 400,
        statusMessage: `Invalid quantity for item ${index + 1} (must be 1-99)`
      })
    }
  })
}

const checkRateLimit = (clientIP) => {
  const now = Date.now()
  const windowMs = 15 * 60 * 1000 // 15 minutes
  const maxRequests = 10

  if (!rateLimitStore.has(clientIP)) {
    rateLimitStore.set(clientIP, { count: 1, resetTime: now + windowMs })
    return true
  }

  const record = rateLimitStore.get(clientIP)
  if (now > record.resetTime) {
    rateLimitStore.set(clientIP, { count: 1, resetTime: now + windowMs })
    return true
  }

  if (record.count >= maxRequests) {
    throw createError({
      statusCode: 429,
      statusMessage: 'Too many requests. Please try again later.'
    })
  }

  record.count++
  return true
}

export default defineEventHandler(async (event) => {
  try {
    // Security: Check request method
    if (getMethod(event) !== 'POST') {
      throw createError({
        statusCode: 405,
        statusMessage: 'Method not allowed'
      })
    }

    // Security: Rate limiting
    const clientIP = getRequestIP(event) || 'unknown'
    checkRateLimit(clientIP)

    // Security: Validate request body
    const { items } = await readBody(event)
    validateRequestBody(items)

    // Security: Verify items exist in Stripe
    const validItems = []
    for (const item of items) {
      try {
        const price = await stripe.prices.retrieve(item.price)
        if (!price.active) {
          throw createError({
            statusCode: 400,
            statusMessage: `Price ${item.price} is not active`
          })
        }
        validItems.push(item)
      } catch (stripeError) {
        throw createError({
          statusCode: 400,
          statusMessage: `Invalid price ID: ${item.price}`
        })
      }
    }

    // Calculer le poids total et les frais de livraison
    const totalWeight = await calculateOrderWeight(validItems, stripe)
    
    // Calculer le total du panier en récupérant les prix réels depuis Stripe
    let cartTotal = 0
    for (const item of validItems) {
      const priceData = await stripe.prices.retrieve(item.price)
      cartTotal += (priceData.unit_amount / 100) * item.quantity
    }

    // Vérifier l'éligibilité à la livraison gratuite
    const freeShipping = isFreeShippingEligible(cartTotal)
    const shippingCost = freeShipping ? 0 : calculateShippingCost(totalWeight)

    // Créer le shipping rate dynamique
    const shippingRate = await createShippingRate(
      shippingCost,
      freeShipping ? 'Livraison gratuite' : `Colissimo Standard (${totalWeight.toFixed(2)} kg)`,
      stripe
    )

    const session = await stripe.checkout.sessions.create({
      success_url: 'https://un-gout-de-liberte.fr/?success=true&session_id={CHECKOUT_SESSION_ID}',
      cancel_url: 'https://un-gout-de-liberte.fr/?canceled=true',
      payment_method_types: ['card'],
      line_items: validItems,
      shipping_options: [{ 
        shipping_rate: shippingRate.id 
      }],
      shipping_address_collection: {
        allowed_countries: ['FR']
      },
      mode: 'payment',
      metadata: {
        source: 'website',
        ip: clientIP,
        timestamp: new Date().toISOString(),
        total_weight: totalWeight.toString(),
        shipping_cost: shippingCost.toString(),
        free_shipping: freeShipping.toString()
      },
      expires_at: Math.floor(Date.now() / 1000) + (30 * 60), // 30 minutes
    })

    return {
      url: session.url,
      id: session.id
    }
  } catch (error) {
    console.error('Order creation error:', error)

    // Don't expose internal errors to client
    if (error.statusCode) {
      throw error // Re-throw our custom errors
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error'
    })
  }
})