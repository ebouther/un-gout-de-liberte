import { defineStore } from 'pinia'
// import Vue from 'vue'

export const useStore = defineStore({
  id: 'cart-store',
  state: () => {
    return {
      items: {},

      products: [],
      loading: false
    }
  },
  actions: {
    async load() {
      this.loading = true 

      //const headers = { 'Authorization': `Bearer ${process.env.STRIPE_PK}`};
      // const { data: prices } = await this.$axios.$get('https://api.stripe.com/v1/prices?active=true&limit=100', { headers })
      // const { data: products } = await this.$axios.$get('https://api.stripe.com/v1/products?active=true&limit=100', { headers })

      const products = await queryContent('products').sort('name').find()


      this.products = products;
      // Vue.set(this, 'products', products)

      this.loading = false 
    },
    async updateQuantity({ id, quantity }) {
      Vue.set(this.items, id, {...this.items[id], quantity})
    },
    async removeItem(id) {
      Vue.delete(this.items, id)
    }
  },
  getters: {
    getProduct(state, id) {
      return state.products.find(p => p.id === id)
    }
  },
})


// export const mutations = {
//   RM_ITEM(state, id) {
//     Vue.delete(state.items, id)
//   },
// 
//   SET_ITEM_QUANTITY(state, { id, quantity }) {
//     //state.items[id].quantity = quantity > 0 ? quantity : 0
//     Vue.set(state.items, id, {...state.items[id], quantity})
//   },
// 
//   // SET_PRODUCTS_WITH_PRICE(state, products) {
//   //   Vue.set(state, 'products', products)
//   // },
//   SET_PRODUCTS(state, products) {
//     Vue.set(state, 'products', products)
//   },
//   SET_LOADING_STATUS(state, status) {
//     state.loading = status
//   },
// 
//   async add(state, productId) {
//     console.log('STATE PRODUCTs : ', JSON.stringify(state.products));
//     if (!state.items[productId]) {
//       Vue.set(state.items, productId, { ...state.products.find(p => p.id === productId), quantity: 1}); //TODO:remove find - store products with
//     } else {
//       Vue.set(state.items, productId, {...state.items[productId], quantity: state.items[productId].quantity + 1 });
//     }
//   },
// }


// const findPrice = (prices, productId) => {
//   const price = prices.find(price => price.product === productId);
// 
//   return ({
//     amount: price.unit_amount / 100,
//     currency: price.currency === 'eur' ? '€' : price.currency,
//     id: price.id
//   })
// }

// export const actions = {
// 
// }
// 
// export const getters = {
//   getProduct(state, id) {
//     return state.products.find(p => p.id === id)
//   }
// }