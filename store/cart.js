import { defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'


export const useStore = defineStore({
  id: 'cart-store',
  state: () => ({
    isOpen: false,
    items: useStorage('items', {}),
    products: useStorage('products', []),
    loading: false
  }),
  actions: {
    open() {
      this.isOpen = true
    },
    close() {
      this.isOpen = false 
    },
    async load() {
      this.loading = true 

      const { data: products } = await useFetch('/api/products')

      this.products = products;

      this.loading = false 
    },
    addItem(id) {
      if (!this.items[id]) {
        this.items[id] = { ...this.products.find(p => p.id === id), quantity: 1}
      } else {
        this.items[id] = {...this.items[id], quantity: this.items[id].quantity + 1 }
      }
    },
    updateQuantity({ id, quantity }) {
      this.items[id] = {...this.items[id], quantity}
    },
    removeItem(id) {
      delete this.items[id]
    }
  },
  getters: {
    nbOfItems: (state) => Object.keys(state.items).reduce(
      (acc, curr) => acc + Number(state.items[curr].quantity)
    , 0),
    getProduct(state, id) {
      return state.products.find(p => p.id === id)
    }
  },
})