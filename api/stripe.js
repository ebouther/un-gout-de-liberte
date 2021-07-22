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


const shippingRates = [
  { weightR: [5000, 9999], packagingWeight: 1000, id: 'shr_1JFMyDBVac9AX8WwdlsE8toV' },
  { weightR: [2000, 4999], packagingWeight: 800,  id: 'shr_1JFMxHBVac9AX8WwniJEI5l6' },
  { weightR: [1000, 1999], packagingWeight: 600,  id: 'shr_1JFMwxBVac9AX8WwXTQw4D1a' },
  { weightR: [750, 999],   packagingWeight: 400,  id: 'shr_1JFMwcBVac9AX8WwHZpU4khT' },
  { weightR: [500, 749],   packagingWeight: 300,  id: 'shr_1JFMvnBVac9AX8WwvVQtdm9L' },
  { weightR: [250, 499],   packagingWeight: 150,  id: 'shr_1JFMueBVac9AX8WwIX7mlVJW' },
  { weightR: [0, 249],     packagingWeight: 100,  id: 'shr_1JFMsIBVac9AX8WwsSDXCFmw' }
];


const fetchItemWeight = async (priceId, quantity) => {
  const { product } = await stripe.prices.retrieve(priceId);
  const { metadata : { 'Poids': weightMeta } } = await stripe.products.retrieve(product)

  const weight = Number(weightMeta.split('g')[0].trim())

  if (weight === NaN || weight <= 0) throw new Error('Invalid weight ("Poids") metadata');
  if (quantity === NaN || quantity <= 0) throw new Error('Invalid item quantity (NaN)');

  return weight * quantity;
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


app.post('/api/order', async (req, res) => {
  const { items } = req.body

  if (!items || !items.length) return res.status(400).end()

  const session = await stripe.checkout.sessions.create({
    success_url: 'https://un-gout-de-liberte.fr/',
    cancel_url: 'https://un-gout-de-liberte.fr/',
    payment_method_types: ['card'],
    line_items: items,
    shipping_rates: [ await shippingRate(items) ],
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