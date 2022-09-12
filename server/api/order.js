//import bodyParser from 'body-parser'
import Stripe from 'stripe';
//import cors from 'cors'

const stripe = new Stripe(process.env.STRIPE_SK, {
  apiVersion: '2020-08-27',
});



//app.use(cors());
//app.use(bodyParser.json())

export default defineEventHandler(async (event) => {
  const { items } = await useBody(event)

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

  //res
  //  .status(200)
  //  .json(session) // stripe checkout link
  //  .end()
  console.log('SESSION ', session)

  return session
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