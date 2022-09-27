import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SK, {
  apiVersion: '2020-08-27',
});



export default defineEventHandler(async (event) => {

  const { data: products } = await stripe.products.list({limit: 100, active: true})
  const { data: prices } = await stripe.prices.list({limit: 100, active: true });

  return products.map(p => ({...p, price: prices.find(price => price.product === p.id)} ))
})