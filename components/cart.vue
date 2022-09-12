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
                    <div class="flow-root">
                      <ul role="list" class="-my-6 divide-y divide-gray-200">
                        <li v-for="product in products" :key="product.id" class="py-6 flex">
                          <div class="flex-shrink-0 w-24 h-24 border border-gray-200 rounded-md overflow-hidden">
                            <nuxt-img :src="product.images?.[0]" class="w-full h-full object-center object-cover" />
                          </div>

                          <div class="ml-4 flex-1 flex flex-col">
                            <div>
                              <div class="flex justify-between text-base font-medium text-gray-900">
                                <h3>
                                  <a :href="product.href">
                                    {{ product.name }}
                                  </a>
                                </h3>
                                <p class="ml-4">
                                  {{product.price.unit_amount / 100}} {{product.price.currency === 'eur' ? '€' : product.price.currency}}
                                </p>
                              </div>
                              <p class="mt-1 text-sm text-gray-500">
                                {{ product.color }}
                              </p>
                            </div>
                            <div class="flex-1 flex items-end justify-between text-sm">
                              <!-- <p class="text-gray-500">Qté {{ product.quantity }}</p> -->
                              <select :value="product.quantity" @input="updateQuantity({id: product.id, quantity: $event.target.value})"  :id="`quantity-${product.id}`" :name="`quantity-${product.id}`" class="block max-w-full rounded-md bg-white border-gray-300 py-1.5 text-base leading-5 font-medium text-gray-700 text-left shadow-sm focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500 sm:text-sm">
                                <option value="1">1</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                                <option value="4">4</option>
                                <option value="5">5</option>
                                <option value="6">6</option>
                                <option value="7">7</option>
                                <option value="8">8</option>
                                <option value="9">9</option>
                              </select>

                              <div class="flex">
                                <button @click="removeItem(product.id)" type="button" class="font-medium text-amber-600 hover:text-amber-500">Supprimer</button>
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
                    <p>Total</p>
                    <p>{{totalPrice}} €</p>
                  </div>
                  <p class="mt-0.5 text-sm text-gray-500">Frais de livraison calculés lors du passage à l'achat.</p>
                  <div class="mt-6">
                    <button @click="submit" class=" w-full flex justify-center items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-amber-600 hover:bg-amber-700">Finaliser l'achat</button>
                  </div>
                  <div class="mt-6 flex justify-center text-sm text-center text-gray-500">
                    <p>
                      ou <button type="button" class="text-amber-600 font-medium hover:text-amber-500" @click="close">Continuer mes achats<span aria-hidden="true"> &rarr;</span></button>
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
import { ref } from 'vue'
import { Dialog, DialogOverlay, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'
import { XIcon } from '@heroicons/vue/outline'

import { useStore } from '~/store/cart'

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
    const products = cart.items;

    const open = cart.open

    const totalPrice = computed(() => {
      if (!Object.keys(cart.items).length) return 0;

      return Object.values(cart.items)
              .reduce((acc, i) => acc + i.price.unit_amount / 100 * i.quantity, 0)
              .toFixed(2);
    })

    async function submit() {
      console.log('SUBMIT')
      const res = await $fetch('/api/order', {
        method: 'POST',
        body: {
          items: Object.keys(cart.items).map(k => ({
            price: cart.items[k].price.id,
            quantity: cart.items[k].quantity
          }))
        }
      });

      window.location.href = res.url;
    }


    function imgSrc(src) {
      const imgs = import.meta.globEager('/content/**/*.{png,jpg}');

      return imgs[`/content${src}`].default
    }
    function dirname(p) {
      // return path.dirname(p)
      return p.substr(0, p.lastIndexOf("/"));
    }

    return {
      cart,
      products,
      isOpen: reactive(cart.isOpen),
      removeItem: cart.removeItem,
      updateQuantity: cart.updateQuantity,
      totalPrice,
      imgSrc,
      dirname,
      open: cart.open,
      close: cart.close,
      submit
    }
  },
}
</script>