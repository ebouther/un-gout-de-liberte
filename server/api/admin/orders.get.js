import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SK, {
  apiVersion: '2023-10-16',
})

const STATUS_MAP = {
  paid: { paymentStatus: 'paid' },
  open: { sessionStatus: 'open' },
  expired: { sessionStatus: 'expired' },
  all: {},
}

export default defineEventHandler(async (event) => {
  try {
    const { verifyAdmin } = await import('~/server/utils/adminAuth.js')
    verifyAdmin(event)

    const query = getQuery(event)
    const filter = STATUS_MAP[query.status] || STATUS_MAP.paid
    const limit = Math.min(parseInt(query.limit) || 100, 100)

    const sessions = await stripe.checkout.sessions.list({
      limit,
      status: filter.sessionStatus || undefined,
      expand: ['data.customer_details'],
    })

    let data = sessions.data.map((session) => {
      const details = session.customer_details || {}
      return {
        id: session.id,
        shortId: session.id.slice(0, 14) + '…',
        created: session.created,
        date: new Date(session.created * 1000).toISOString(),
        customer: {
          name: details.name || '',
          email: details.email || '',
        },
        amountTotal: session.amount_total,
        currency: session.currency,
        paymentStatus: session.payment_status,
        status: session.status,
        metadata: session.metadata || {},
        shippingCost: session.shipping_cost?.amount_subtotal || null,
      }
    })

    if (filter.paymentStatus) {
      data = data.filter((o) => o.paymentStatus === filter.paymentStatus)
    }

    return {
      success: true,
      orders: data,
      total: data.length,
    }
  } catch (error) {
    console.error('Erreur lors du chargement des commandes:', error)

    if (error.statusCode) {
      throw error
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Erreur lors du chargement des commandes',
    })
  }
})
