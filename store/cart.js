export const state = () => ({
  items: {},

  products: [],
  prices: [],
  loading: false
})

const fetchPrice = async (productId) => {
  return 'price_1J85CPBVac9AX8WwQyJ2r9wT' // TODO
}

export const mutations = {
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
  remove(state, { todo }) {
    state.list.splice(state.cart.indexOf(todo), 1)
  },
  toggle(todo) {
    todo.done = !todo.done
  }
}

export const actions = {
  async fetchProducts ({ commit }) {
    commit('SET_LOADING_STATUS', true)
    const { data: products } = await this.$axios.$get('https://api.stripe.com/v1/products', { headers: { 'Authorization': 'Bearer rk_test_51J84KnBVac9AX8Wws15im9jdTdzX6DyY9eu4hkIfvMt0pGeWnojrDaSOwF14yKO8AkP0XS3oBYnrlvyMDTZ2pfxD00IQGqH0sk'} })
    commit('SET_PRODUCTS', products)
    commit('SET_LOADING_STATUS', false)
  },
  async fetchPrices ({ commit }) {
    commit('SET_LOADING_STATUS', true)
    const { data: prices } = await this.$axios.$get('https://api.stripe.com/v1/prices', { headers: { 'Authorization': 'Bearer rk_test_51J84KnBVac9AX8Wws15im9jdTdzX6DyY9eu4hkIfvMt0pGeWnojrDaSOwF14yKO8AkP0XS3oBYnrlvyMDTZ2pfxD00IQGqH0sk'} })
    commit('SET_PRICES', prices)
    commit('SET_LOADING_STATUS', false)
  }
}

export const getters = {
  getProduct(state, id) {
    return state.products.find(p => p.id === id)
  }
}