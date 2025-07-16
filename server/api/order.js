import Stripe from 'stripe'
import { defineEventHandler, createError, getRequestIP, readBody, getMethod } from 'h3'

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

    const session = await stripe.checkout.sessions.create({
      success_url: 'https://un-gout-de-liberte.fr/?success=true&session_id={CHECKOUT_SESSION_ID}',
      cancel_url: 'https://un-gout-de-liberte.fr/?canceled=true',
      payment_method_types: ['card'],
      line_items: validItems,
      shipping_options: [{ shipping_rate: await shippingRate(validItems) }],
      shipping_address_collection: {
        allowed_countries: ['FR']
      },
      mode: 'payment',
      metadata: {
        source: 'website',
        ip: clientIP,
        timestamp: new Date().toISOString()
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



const shippingRates = [
  { weightR: [0, 249],     packagingWeight: 100,  id: 'shr_1JGPjtBVac9AX8WwYtnO1LfD' },
  { weightR: [250, 499],   packagingWeight: 150,  id: 'shr_1JGPjcBVac9AX8WwPtJhv3Qn' },
  { weightR: [500, 749],   packagingWeight: 300,  id: 'shr_1JGPjBBVac9AX8WwzQB9jFYT' },
  { weightR: [750, 999],   packagingWeight: 400,  id: 'shr_1JGPisBVac9AX8WwsrJuCKpt' },
  { weightR: [1000, 1999], packagingWeight: 600,  id: 'shr_1JGPi4BVac9AX8WwJbSkiWVa' },
  { weightR: [2000, 4999], packagingWeight: 800,  id: 'shr_1JGPhdBVac9AX8WwenIXJNic' },
  { weightR: [5000, 9999], packagingWeight: 1000, id: 'shr_1JGPgVBVac9AX8Ww3MJP3aVC' }
];


const fetchItemWeight = async (priceId, quantity) => {
  try {
    const { product } = await stripe.prices.retrieve(priceId);
    const productData = await stripe.products.retrieve(product);

    // Check if metadata exists and has the 'Poids' field
    if (!productData.metadata || !productData.metadata['Poids']) {
      console.warn(`Product ${product} missing weight metadata, using default weight`);
      return 100 * quantity; // Default weight in grams
    }

    const weightMeta = productData.metadata['Poids'];

    // Check if weightMeta is a string before calling split
    if (typeof weightMeta !== 'string') {
      console.warn(`Product ${product} has invalid weight metadata format`);
      return 100 * quantity; // Default weight in grams
    }

    const weight = Number(weightMeta.split('g')[0].trim());

    if (isNaN(weight) || weight <= 0) {
      console.warn(`Product ${product} has invalid weight value: ${weightMeta}`);
      return 100 * quantity; // Default weight in grams
    }

    if (isNaN(quantity) || quantity <= 0) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid item quantity'
      });
    }

    return weight * quantity;
  } catch (error) {
    console.error('Error fetching item weight:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to calculate item weight'
    });
  }
}



const shippingRate = async (items) => {

  const totalWeight = (await Promise.all(
    items.map(i => fetchItemWeight(i.price, Number(i.quantity)))
  )).reduce((acc, val) => acc + val);


  console.log('[-] TOTAL WEIGHT', totalWeight)

  if (totalWeight > 9999) throw new Error('Too many items') // TODO: front side error


  const { id: shippingRate } = shippingRates.find(
    (s) => s.weightR[0] <= totalWeight && totalWeight <= s.weightR[1]
  );

  if (!shippingRate) throw new Error('Failed to calculate shipping rate')

  return shippingRate;
}