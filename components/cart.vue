<template>
  <TransitionRoot as="template" :show="cart.isOpen">
    <Dialog as="div" class="fixed inset-0 overflow-hidden z-10" @close="close">
      <div class="absolute inset-0 overflow-hidden">
        <TransitionChild as="template" enter="ease-in-out duration-500" enter-from="opacity-0" enter-to="opacity-100" leave="ease-in-out duration-500" leave-from="opacity-100" leave-to="opacity-0">
          <DialogOverlay class="absolute inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </TransitionChild>

        <div class="fixed inset-y-0 right-0 pl-10 max-w-full flex">
          <TransitionChild as="template" enter="transform transition ease-in-out duration-500 sm:duration-700" enter-from="translate-x-full" enter-to="translate-x-0" leave="transform transition ease-in-out duration-500 sm:duration-700" leave-from="translate-x-0" leave-to="translate-x-full">
            <div class="w-screen max-w-md">
              <div class="h-full flex flex-col bg-white shadow-xl overflow-y-scroll">
                <div class="flex-1 py-6 overflow-y-auto px-4 sm:px-6">
                  <div class="flex items-start justify-between">
                    <DialogTitle class="text-lg font-medium text-gray-900"> Mon Panier </DialogTitle>
                    <div class="ml-3 h-7 flex items-center">
                      <button type="button" class="-m-2 p-2 text-gray-400 hover:text-gray-500" @click="close">
                        <XIcon class="h-6 w-6" aria-hidden="true" />
                      </button>
                    </div>
                  </div>

                    <div class="mt-8">
                      <div v-if="Object.keys(cart.items).length === 0" class="text-center py-12">
                        <p class="text-gray-500 font-body">Votre panier est vide.</p>
                        <button type="button" class="mt-4 text-gold font-medium hover:text-gold-dark text-sm font-body" @click="close">
                          Continuer mes achats &rarr;
                        </button>
                      </div>
                      <div class="flow-root">
                        <ul v-if="Object.keys(cart.items).length > 0" role="list" class="-my-6 divide-y divide-gray-200">
                        <li v-for="product in products" :key="product.id" class="py-6 flex">
                          <div class="flex-shrink-0 w-24 h-24 border border-gray-200 rounded-md overflow-hidden">
                            <nuxt-img :src="(product.product?.images || product.images)?.[0]" class="w-full h-full object-center object-cover" alt="" />
                          </div>

                          <div class="ml-4 flex-1 flex flex-col">
                            <div>
                              <div class="flex justify-between text-base font-medium text-gray-900">
                                <h3>
                                  <a :href="product.href">
                                    {{ product.product?.name || product.name }}
                                  </a>
                                </h3>
                                <p class="ml-4">
                                  {{ formatPrice(product) }}
                                </p>
                              </div>
                              <p v-if="product.price?.metadata?.weight" class="mt-1 text-sm text-gray-500">
                                {{ product.price.metadata.weight }}
                              </p>
                            </div>
                            <div class="flex-1 flex items-end justify-between text-sm">
                              <!-- <p class="text-gray-500">Qté {{ product.quantity }}</p> -->
                              <select :value="product.quantity" @input="updateQuantity({id: product.id, quantity: $event.target.value})"  :id="`quantity-${product.id}`" :name="`quantity-${product.id}`" class="block max-w-full border border-line py-1.5 text-base leading-5 font-medium text-gray-700 text-left focus:outline-none focus:ring-1 focus:ring-gold focus:border-gold sm:text-sm font-body">
                                <option v-for="n in 99" :key="n" :value="n">{{ n }}</option>
                              </select>

                              <div class="flex">
                                <button @click="removeItem(product.id)" type="button" class="font-medium text-gold hover:text-gold-dark">Supprimer</button>
                              </div>
                            </div>
                          </div>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div class="border-t border-gray-200 py-6 px-4 sm:px-6">
                  <div class="flex justify-between text-base font-medium text-gray-900">
                    <p>Sous-total</p>
                    <p>{{ totalPrice }} €</p>
                  </div>
                  <div v-if="Object.keys(cart.items).length > 0" class="flex justify-between text-sm text-gray-600 mt-2">
                    <p>Frais de livraison ({{ totalWeight < 1 ? (totalWeight * 1000).toFixed(0) + 'g' : totalWeight.toFixed(2) + 'kg' }})</p>
                    <p>{{ shippingCost.toFixed(2) }} €</p>
                  </div>
                  <div class="flex justify-between text-lg font-bold text-gray-900 mt-3 pt-3 border-t border-gray-200">
                    <p>Total</p>
                    <p>{{ totalWithShipping }} €</p>
                  </div>
                  <p class="mt-0.5 text-sm text-gray-500">Livraison Colissimo en France métropolitaine.</p>

                  <div class="mt-6">
                    <button 
                      @click="submit" 
                      :disabled="!isValidOrder || checkoutLoading"
                      class="w-full flex justify-center items-center px-6 py-3 text-base font-medium text-white bg-gold hover:bg-gold-dark disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-body"
                    >
                      <span v-if="checkoutLoading" class="flex items-center">
                        <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Préparation...
                      </span>
                      <span v-else-if="!isValidOrder">Panier vide</span>
                      <span v-else>Finaliser l'achat</span>
                    </button>
                    <div v-if="checkoutError" class="mt-3 text-sm text-red-600 text-center font-body">
                      {{ checkoutError }}
                    </div>
                  </div>

                  <div class="mt-6 flex justify-center text-sm text-center text-gray-500">
                    <p>
                      ou <button type="button" class="text-gold font-medium hover:text-gold-dark" @click="close">Continuer mes achats<span aria-hidden="true"> &rarr;</span></button>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script>
import { ref, computed, reactive } from 'vue'
import { Dialog, DialogOverlay, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'
import { XIcon } from 'heroicons-vue3/outline'

import { useStore } from '~/store/cart'
import { useShipping } from '~/composables/useShipping'

export default {
  components: {
    Dialog,
    DialogOverlay,
    DialogTitle,
    TransitionChild,
    TransitionRoot,
    XIcon,
  },
  setup() {
    const cart = useStore()
    const { calculateCartShipping, getItemWeight } = useShipping()
    const products = computed(() => Object.values(cart.items))

    const open = cart.open

    const totalPrice = computed(() => {
      if (!Object.keys(cart.items).length) return 0;

      return Object.values(cart.items)
              .reduce((acc, i) => acc + i.price.unit_amount / 100 * i.quantity, 0)
              .toFixed(2);
    })

    const shippingCost = computed(() => {
      if (!Object.keys(cart.items).length) return 0;
      
      const items = Object.values(cart.items)
      return calculateCartShipping(items, 'FR', '', 'standard')
    })

    const totalWeight = computed(() => {
      if (!Object.keys(cart.items).length) return 0;
      
      const items = Object.values(cart.items)
      let weight = 0
      for (const item of items) {
        const itemWeight = getItemWeight(item)
        weight += itemWeight * item.quantity
      }
      return weight
    })

    const totalWithShipping = computed(() => {
      const subtotal = parseFloat(totalPrice.value) || 0
      const shipping = parseFloat(shippingCost.value) || 0
      return (subtotal + shipping).toFixed(2)
    })

    const isValidOrder = computed(() => {
      return Object.keys(cart.items).length > 0
    })

    const checkoutLoading = ref(false)
    const checkoutError = ref('')

    async function submit() {
      if (Object.keys(cart.items).length === 0) return

      checkoutLoading.value = true
      checkoutError.value = ''

      try {
        const res = await $fetch('/api/order', {
          method: 'POST',
          body: {
            items: Object.keys(cart.items).map(k => ({
              price: cart.items[k].price.id,
              quantity: Number(cart.items[k].quantity)
            }))
          }
        })

        if (res.url) {
          window.location.href = res.url
        } else {
          throw new Error('No checkout URL received')
        }
      } catch (error) {
        console.error('Checkout error:', error)
        checkoutError.value = 'Une erreur est survenue lors de la préparation de votre commande. Veuillez réessayer.'
      } finally {
        checkoutLoading.value = false
      }
    }

    function formatPrice(product) {
      // Cas 1: Structure moderne avec price.unit_amount
      if (product?.price?.unit_amount) {
        const amount = product.price.unit_amount / 100
        const currency = product.price.currency === 'eur' ? '€' : product.price.currency?.toUpperCase() || ''
        return `${amount.toFixed(2)} ${currency}`
      }
      
      // Cas 2: Ancien format avec price direct (nombre)
      if (typeof product?.price === 'number') {
        return `${product.price.toFixed(2)} €`
      }
      
      // Cas 3: Produit avec variantPrice
      if (product?.variantPrice) {
        if (typeof product.variantPrice === 'number') {
          return `${product.variantPrice.toFixed(2)} €`
        }
        if (product.variantPrice.unit_amount) {
          const amount = product.variantPrice.unit_amount / 100
          return `${amount.toFixed(2)} €`
        }
      }
      
      // Cas 4: Ancien format où le prix est stocké différemment
      if (product?.unit_amount) {
        const amount = product.unit_amount / 100
        return `${amount.toFixed(2)} €`
      }
      
      // Si aucun prix trouvé, chercher dans les métadonnées ou autres propriétés
      return 'Prix indisponible'
    }

    return {
      cart,
      products,
      isOpen: reactive(cart.isOpen),
      removeItem: cart.removeItem,
      updateQuantity: cart.updateQuantity,
      totalPrice,
      shippingCost,
      totalWeight,
      totalWithShipping,
      isValidOrder,
      checkoutLoading,
      checkoutError,
      formatPrice,
      open: cart.open,
      close: cart.close,
      submit
    }
  },
}
</script>