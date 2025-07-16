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
    addItem(item) {
      // Nouvel système avec variantes : item = { id, product, price, quantity }
      if (typeof item === 'object' && item.id && item.product && item.price) {
        const itemId = item.id
        if (!this.items[itemId]) {
          this.items[itemId] = {
            id: itemId,
            product: item.product,
            price: item.price,
            quantity: item.quantity || 1,
            // Propriétés pour compatibilité backward avec le template
            name: item.product.name,
            images: item.product.images
          }
        } else {
          this.items[itemId].quantity += (item.quantity || 1)
        }
      }
      // Ancien système pour compatibilité
      else if (typeof item === 'string') {
        const productId = item
        const product = this.products.find(p => p.id === productId)
        if (product) {
          if (!this.items[productId]) {
            this.items[productId] = { 
              ...product, 
              quantity: 1,
              // Assurer que price existe
              price: product.price || product.prices?.[0]
            }
          } else {
            this.items[productId].quantity += 1
          }
        }
      }
    },
    updateQuantity({ id, quantity }) {
      // Convertir la quantité en nombre pour éviter les erreurs avec l'API
      const numQuantity = Number(quantity)
      if (numQuantity && numQuantity > 0 && numQuantity <= 99) {
        this.items[id] = {...this.items[id], quantity: numQuantity}
      }
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