<template>
  <TransitionRoot appear :show="!!product" as="template">
    <Dialog as="div" @close="$emit('close')" class="relative z-10">
      <TransitionChild
        as="template"
        enter="d// Computed pour l'image à afficher (supprimé car remplacé par une fonction)

const formatPrice = (price) => {t"
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
              class="w-full max-w-5xl transform overflow-hidden rounded-2xl bg-white shadow-2xl transition-all"
            >
              <div class="relative">
                <!-- Close button -->
                <button
                  @click="$emit('close')"
                  class="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/80 hover:bg-white shadow-lg transition-all duration-200"
                  aria-label="Fermer"
                >
                  <svg class="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>

                <div v-if="product" class="grid grid-cols-1 lg:grid-cols-2">
                  <!-- Image section -->
                  <div class="relative bg-gray-50 aspect-square lg:aspect-auto">
                    <nuxt-img
                      class="w-full h-full object-cover"
                      :src="getDisplayImage()"
                      :alt="product.name"
                      loading="eager"
                    />
                  </div>

                  <!-- Content section -->
                  <div class="p-8 flex flex-col">
                    <div class="flex-1">
                      <h1 class="text-3xl font-bold text-gray-900 mb-4">{{ product.name }}</h1>
                      <p class="text-lg text-gray-600 mb-6">{{ product.description }}</p>

                      <!-- Product details -->
                      <div class="space-y-4 mb-8">
                        <div v-if="product.metadata?.Ingrédients" class="border-l-4 border-amber-400 pl-4">
                          <h3 class="font-semibold text-gray-900 mb-1">Ingrédients</h3>
                          <p class="text-gray-700">{{ product.metadata.Ingrédients }}</p>
                        </div>

                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                          <div v-if="displayWeight">
                            <span class="font-semibold text-gray-900">Poids:</span>
                            <span class="text-gray-700 ml-1">{{ displayWeight }}</span>
                          </div>
                          <div v-if="product.metadata?.Allergènes">
                            <span class="font-semibold text-gray-900">Allergènes:</span>
                            <span class="text-gray-700 ml-1">{{ product.metadata.Allergènes }}</span>
                          </div>
                        </div>

                        <div class="text-sm text-gray-500 space-y-1">
                          <p><span class="font-medium">*</span> Produits issus de l'agriculture biologique</p>
                          <p><span class="font-medium">°</span> Produits locaux</p>
                        </div>
                      </div>
                    </div>

                    <!-- Price and add to cart -->
                    <div class="border-t pt-6">
                      <!-- Product variants selection -->
                      <ProductVariants 
                        v-if="product.prices && product.prices.length > 1"
                        :product="product"
                        :selected-price-id="selectedPriceId"
                        @price-selected="onPriceSelected"
                        class="mb-6"
                      />
                      
                      <div class="flex items-center justify-between mb-6">
                        <div class="text-3xl font-bold text-amber-600">
                          {{ formatPrice(selectedPrice || props.product?.prices?.[0] || props.product?.price) }}
                        </div>
                        <div v-if="selectedPrice?.metadata?.weight" class="text-lg text-gray-600">
                          {{ selectedPrice.metadata.weight }}
                        </div>
                      </div>

                      <button
                        @click="addToCart()"
                        :disabled="!canAddToCart"
                        :class="[
                          'w-full font-semibold py-4 px-6 rounded-lg transition-all duration-200 focus:outline-none focus:ring-4',
                          canAddToCart 
                            ? 'bg-amber-600 hover:bg-amber-700 text-white focus:ring-amber-300 hover:shadow-lg' 
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        ]"
                      >
                        <span v-if="canAddToCart">Ajouter au panier</span>
                        <span v-else>Sélectionnez un format</span>
                      </button>
                    </div>
                  </div>
                </div>
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
import ProductVariants from './ProductVariants.vue'

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

// État pour la gestion des variantes
const selectedPriceId = ref(null)

// Computed pour le prix sélectionné
const selectedPrice = computed(() => {
  if (!selectedPriceId.value || !props.product?.prices) return null
  return props.product.prices.find(price => price.id === selectedPriceId.value)
})

// Computed pour vérifier si on peut ajouter au panier
const canAddToCart = computed(() => {
  if (!props.product) return false
  
  // Si pas de variantes, toujours possible
  if (!props.product.prices || props.product.prices.length <= 1) return true
  
  // Si variantes, il faut avoir sélectionné un prix
  return !!selectedPriceId.value
})

// Computed pour le poids à afficher
const displayWeight = computed(() => {
  // Priorité 1: poids du prix sélectionné
  if (selectedPrice.value?.metadata?.weight) {
    return selectedPrice.value.metadata.weight
  }
  
  // Priorité 2: poids du premier prix disponible
  if (props.product?.prices?.[0]?.metadata?.weight) {
    return props.product.prices[0].metadata.weight
  }
  
  // Priorité 3: poids du prix par défaut (backward compatibility)
  if (props.product?.price?.metadata?.weight) {
    return props.product.price.metadata.weight
  }
  
  // Priorité 4: fallback sur les métadonnées du produit
  if (props.product?.metadata?.['Poids']) {
    return props.product.metadata['Poids']
  }
  
  // Priorité 5: "Poids net total" du produit
  if (props.product?.metadata?.['Poids net total']) {
    return props.product.metadata['Poids net total']
  }
  
  return null
})

// Computed pour l'image à afficher (supprimé car remplacé par une fonction)
const displayImage = computed(() => {
  // Si une variante est sélectionnée et qu'elle a des images spécifiques
  if (selectedPrice.value?.metadata?.variant_images) {
    try {
      const variantImages = JSON.parse(selectedPrice.value.metadata.variant_images)
      if (variantImages.length > 0) {
        return variantImages[0]
      }
    } catch (e) {
      console.warn('Erreur parsing variant_images:', e)
    }
  }
  
  // Fallback sur l'image du produit
  return props.product?.images?.[0]
})

// Sélectionner automatiquement le premier prix si une seule option
watch(() => props.product, (newProduct) => {
  if (!newProduct?.prices || newProduct.prices.length === 0) {
    selectedPriceId.value = null
  } else if (newProduct.prices.length === 1) {
    selectedPriceId.value = newProduct.prices[0].id
  } else {
    selectedPriceId.value = null
  }
}, { immediate: true })

// Gérer la sélection d'un prix
const onPriceSelected = (price) => {
  selectedPriceId.value = price.id
}

const formatPrice = (price) => {
  if (!price) return ''
  const amount = price.unit_amount / 100
  const currency = price.currency === 'eur' ? '€' : price.currency.toUpperCase()
  return `${amount.toFixed(2)} ${currency}`
}

function addToCart() {
  if (!canAddToCart.value) return
  
  const priceToAdd = selectedPrice.value || props.product?.prices?.[0] || props.product?.price
  if (!priceToAdd) {
    console.error('No price available for cart')
    return
  }
  
  cart.addItem({
    id: priceToAdd.id,
    product: props.product,
    price: priceToAdd,
    quantity: 1
  })
  
  emit('close')
}

// Fonction pour obtenir l'image à afficher
function getDisplayImage() {
  // Si une variante est sélectionnée et qu'elle a des images spécifiques
  if (selectedPrice.value?.metadata?.variant_images) {
    try {
      const variantImages = JSON.parse(selectedPrice.value.metadata.variant_images)
      if (variantImages.length > 0) {
        return variantImages[0]
      }
    } catch (e) {
      console.warn('Erreur parsing variant_images:', e)
    }
  }
  
  // Fallback sur l'image du produit
  return props.product?.images?.[0]
}

</script>