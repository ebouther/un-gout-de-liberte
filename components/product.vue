<template>
  <TransitionRoot appear :show="!!product" as="template">
    <Dialog as="div" @close="$emit('close')" class="relative z-10">
      <TransitionChild
        as="template"
        enter="duration-300 ease-out"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="duration-200 ease-in"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-black bg-opacity-25" />
      </TransitionChild>

      <div class="fixed inset-0 overflow-y-auto">
        <div
          class="flex min-h-full items-center justify-center p-4 text-center"
        >
          <TransitionChild
            as="template"
            enter="duration-300 ease-out"
            enter-from="opacity-0 scale-95"
            enter-to="opacity-100 scale-100"
            leave="duration-200 ease-in"
            leave-from="opacity-100 scale-100"
            leave-to="opacity-0 scale-95"
          >
            <DialogPanel
              class="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all"
            >

            <div class="mx-auto flex justify-center" style="max-height: 70vh;">
                <div v-if="product !== null">
                    <div class="max-w-screen-xl h-full grid grid-flow-row md:grid-flow-col rounded-lg bg-gray-100 ">
                        <div class="min-w-0 min-h-0 bg-white rounded-lg  h-full w-full" >
                          <nuxt-img class="w-full object-cover min-h-0 min-w-0 rounded-t-md md:rounded-l-md md:rounded-r-none mx-auto h-full" :src="product.images?.[0]" />
                        </div>
                        <div class="w-full h-full p-5 flex flex-col justify-between mt-auto flex-auto">
                          <div>
                              <h1 class="font-bold text-xl leading-tight truncate text-gray-700">{{product.name}}</h1>
                              <div class="text-gray-600"><h2>{{product.description}}</h2></div>
                              <hr class="my-5 border-yellow-400" />
                              <div class="text-gray-600">
                                <!-- {{product}} -->
                                <span class="font-semibold">Ingrédients : </span><span>{{product.metadata?.Ingrédients}}</span>
                                <br/>
                                <span class="font-semibold">* : </span><span>Produits issus de l'agriculture biologique.</span>
                                <br />
                                <span class="font-semibold">° : </span><span>Produits locaux.</span>
                                <br />
                                <span v-if="product.metadata?.Allergènes" class="font-semibold">Allergènes : </span><span>{{product.metadata?.Allergènes}}</span>
                                <br />
                                <span class="font-semibold">Poids : </span><span>{{product.metadata.Poids}}</span>
                              </div>
                          </div>
                          <hr class="my-5 border-yellow-400" />
                          <div class="flex flex-row justify-between text-gray-700">
                            <span class="mx-8 inline-flex items-center text-2xl font-bold">{{product.price.unit_amount / 100}} {{product.price.currency === 'eur' ? '€' : product.price.currency}}</span>
                            <button
                                class="grow bg-white border border-gray-200 hover:shadow-none hover:border-yellow-500 font-semibold py-2 px-4 shadow-md rounded"
                                @click="addToCart(product.id)">
                                Ajouter au panier
                            </button>
                          </div>
                        </div>
                    </div>
                </div>
            </div>


              <div class="mt-4">
                <button type="button" class="text-amber-600 font-medium hover:text-amber-500" @click="$emit('close')"><span aria-hidden="true">&larr; </span>Retour</button>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>
<script setup>
import { useStore } from '~/store/cart'

import { XIcon } from 'heroicons-vue3/outline'

import {
  TransitionRoot,
  TransitionChild,
  Dialog,
  DialogPanel,
  DialogTitle,
} from '@headlessui/vue'

const props = defineProps(['product'])
const emit = defineEmits(['close'])

const cart = useStore()

function dirname(p) {
  // return path.dirname(p)
  return p.substr(0, p.lastIndexOf("/"));
}
function imgSrc(src) {
  const imgs = import.meta.globEager('/content/**/*.{png,jpg}');

  return imgs[`/content${src}`].default
}

function addToCart(productId) { 
  cart.addItem(productId)
  emit('close')
}

</script>