import Vue from 'vue'

export const state = () => ({
  items: {},

  products: [],
  prices: [],
  loading: false
})

export const mutations = {
  RM_ITEM(state, id) {
    Vue.delete(state.items, id)
  },
  SET_ITEM_QUANTITY(state, { id, quantity }) {
    state.items[id].quantity = quantity
    //const item = state.items[id]
    //Vue.set(state.items, id, { ...item, quantity })
  },

  SET_PRICES(state, prices) {
    state.prices = prices
  },
  SET_PRODUCTS(state, products) {
    state.products = products
  },
  SET_LOADING_STATUS(state, status) {
    state.loading = status
  },

  async add(state, productId) {
    if (!state.items[productId]) {
      const product = state.products.find(p => p.id === productId);
      const { id: price } = state.prices.find(p => p.product === productId);
      if (!product || !price) throw new Error('Error with product id: ', productId)
      state.items[productId] = { ...product, quantity: 1, price};
    } else {
      state.items[productId].quantity += 1;
    }
  },
}

export const actions = {
  async getItems ({ commit }) {

  },
  async fetchProducts ({ commit }) {
    commit('SET_LOADING_STATUS', true)
    const { data: products } = await this.$axios.$get('https://api.stripe.com/v1/products?active=true', { headers: { 'Authorization': 'Bearer rk_test_51J84KnBVac9AX8Wws15im9jdTdzX6DyY9eu4hkIfvMt0pGeWnojrDaSOwF14yKO8AkP0XS3oBYnrlvyMDTZ2pfxD00IQGqH0sk'} })
    commit('SET_PRODUCTS', products)
    commit('SET_LOADING_STATUS', false)
  },
  async fetchPrices ({ commit }) {
    commit('SET_LOADING_STATUS', true)
    const { data: prices } = await this.$axios.$get('https://api.stripe.com/v1/prices?active=true', { headers: { 'Authorization': 'Bearer rk_test_51J84KnBVac9AX8Wws15im9jdTdzX6DyY9eu4hkIfvMt0pGeWnojrDaSOwF14yKO8AkP0XS3oBYnrlvyMDTZ2pfxD00IQGqH0sk'} })
    commit('SET_PRICES', prices)
    commit('SET_LOADING_STATUS', false)
  },
  async updateQuantity({ commit }, { id, quantity }) {
    commit('SET_ITEM_QUANTITY', { id, quantity });
  },
  async removeItem({ commit }, id) {
    commit('RM_ITEM', id);
  }
}

export const getters = {
  getProduct(state, id) {
    return state.products.find(p => p.id === id)
  }
}