import express from 'express'
import bodyParser from 'body-parser'
import Stripe from 'stripe';
import cors from 'cors'

const stripe = new Stripe(process.env.STRIPE_SK, {
  apiVersion: '2020-08-27',
});


const app = express()

app.use(cors());
app.use(bodyParser.json())


const calculateShippingRate = (items) => {
  // const totalWeight = ;
  return 'shr_1J8SaLBVac9AX8WwJI0RJCJy'; // TODO
}


app.post('/api/order', async (req, res) => {
  const { items } = req.body

  if (!items || !items.length) return res.status(400).end()

  const session = await stripe.checkout.sessions.create({
    success_url: 'https://un-gout-de-liberte.fr/',
    cancel_url: 'https://un-gout-de-liberte.fr/',
    payment_method_types: ['card'],
    line_items: items,
    shipping_rates: [ calculateShippingRate() ],
    shipping_address_collection: {
      allowed_countries: ['FR']
    },
    mode: 'payment',
  });

  res
    .status(200)
    .json(session) // stripe checkout link
    .end()
})

export default app