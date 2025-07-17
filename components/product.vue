<template>
  <Dialog :open="open" @close="$emit('close')" class="relative z-50">
    <div class="fixed inset-0 bg-black/30" aria-hidden="true" />
    
    <div class="fixed inset-0 flex w-screen items-center justify-center p-4">
      <DialogPanel 
        class="w-full max-w-7xl bg-white rounded-lg shadow-xl overflow-hidden max-h-[95vh] flex flex-col"
      >
        <!-- En-tête ultra-minimaliste avec seulement le titre -->
        <div class="flex items-center justify-between p-4 border-b border-gray-100">
          <div class="flex items-center space-x-3">
            <DialogTitle class="text-xl font-semibold text-gray-900">
              {{ product.name }}
            </DialogTitle>
            <div v-if="product.metadata?.['Label bio'] === 'Oui'" class="bg-green-100 text-green-700 text-xs font-medium px-2 py-1 rounded-full">
              Bio
            </div>
          </div>
          
          <button 
            @click="$emit('close')"
            class="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Contenu principal en 2 colonnes équilibrées -->
        <div class="flex flex-1 min-h-0">
          <!-- Image produit -->
          <div class="w-1/2">
            <div class="w-full h-full overflow-hidden">
              <img 
                :src="product.images?.[0] || product.image" 
                :alt="product.name"
                class="w-full h-full object-cover"
              />
            </div>
          </div>
          
          <!-- Informations et achat -->
          <div class="w-1/2 flex flex-col">
            <!-- Zone d'informations avec scroll si nécessaire -->
            <div class="flex-1 p-6 overflow-y-auto">
              <!-- Description -->
              <div class="mb-4">
                <h3 class="text-base font-semibold mb-2">Description</h3>
                <p class="text-gray-600 leading-relaxed text-sm">
                  {{ product.description }}
                </p>
              </div>

              <!-- Sélection des variantes (si disponibles) -->
              <div v-if="productVariants && productVariants.length > 1" class="mb-4">
                <h3 class="text-base font-semibold mb-2">Formats disponibles</h3>
                <div class="space-y-2">
                  <button
                    v-for="(variant, index) in productVariants"
                    :key="variant.id"
                    @click="selectedVariantId = variant.id"
                    :class="[
                      'w-full p-3 border rounded-lg text-left transition-all duration-200 relative',
                      selectedVariantId === variant.id
                        ? 'border-amber-500 bg-amber-50 text-amber-700 ring-2 ring-amber-200'
                        : 'border-gray-200 hover:border-amber-300 hover:shadow-sm'
                    ]"
                  >
                    <!-- Badge "Moins cher" pour la première variante -->
                    <div v-if="index === 0" class="absolute -top-1 -right-1 bg-amber-500 text-white text-xs px-1.5 py-0.5 rounded-full font-medium">
                      Moins cher
                    </div>
                    
                    <div class="flex justify-between items-center">
                      <div class="flex-1">
                        <div class="font-medium text-sm">
                          {{ variant.weight || 'Format standard' }}
                        </div>
                        <div v-if="variant.name && variant.weight && variant.name !== variant.weight" class="text-xs text-gray-500 mt-1">
                          {{ variant.name }}
                        </div>
                      </div>
                      <div class="text-right ml-3">
                        <div class="font-semibold text-sm text-amber-600">{{ formatPrice(variant.price) }}</div>
                        <div v-if="variant.price.unit_amount && variant.weight" class="text-xs text-gray-500">
                          {{ formatPricePerUnit(variant) }}
                        </div>
                      </div>
                    </div>
                  </button>
                </div>
              </div>

              <!-- Informations détaillées du produit -->
              <div class="space-y-3">
                <!-- Ingrédients -->
                <div v-if="product.metadata?.['Ingrédients']" class="border-l-4 border-green-500 pl-3">
                  <h4 class="font-medium text-gray-800 mb-1 text-sm">Ingrédients</h4>
                  <p class="text-xs text-gray-600">{{ product.metadata['Ingrédients'] }}</p>
                </div>

                <!-- Poids (seulement si pas de variantes) -->
                <div v-if="(!productVariants || productVariants.length <= 1) && (product.metadata?.['Poids net total'] || product.metadata?.['Poids net égoutté'])" class="border-l-4 border-blue-500 pl-3">
                  <h4 class="font-medium text-gray-800 mb-1 text-sm">Poids</h4>
                  <div class="text-xs text-gray-600 space-y-1">
                    <p v-if="product.metadata?.['Poids net total']">
                      <span class="font-medium">Net total :</span> {{ product.metadata['Poids net total'] }}
                    </p>
                    <p v-if="product.metadata?.['Poids net égoutté']">
                      <span class="font-medium">Net égoutté :</span> {{ product.metadata['Poids net égoutté'] }}
                    </p>
                  </div>
                </div>

                <!-- Allergènes -->
                <div v-if="product.metadata?.['Allergènes']" class="border-l-4 border-red-500 pl-3">
                  <h4 class="font-medium text-gray-800 mb-1 text-sm">⚠️ Allergènes</h4>
                  <p class="text-xs text-gray-600">{{ product.metadata['Allergènes'] }}</p>
                </div>

                <!-- Origine et certifications -->
                <div v-if="product.metadata?.['*'] || product.metadata?.['°']" class="border-l-4 border-amber-500 pl-3">
                  <h4 class="font-medium text-gray-800 mb-1 text-sm">🏷️ Certifications</h4>
                  <div class="text-xs text-gray-600 space-y-1">
                    <p v-if="product.metadata?.['*']" class="flex items-center">
                      <span class="text-green-600 mr-2">🌱</span>
                      {{ product.metadata['*'] }}
                    </p>
                    <p v-if="product.metadata?.['°']" class="flex items-center">
                      <span class="text-blue-600 mr-2">📍</span>
                      {{ product.metadata['°'] }}
                    </p>
                  </div>
                </div>

                <!-- Autres informations utiles -->
                <div v-if="hasOtherMetadata" class="border-l-4 border-gray-400 pl-3">
                  <h4 class="font-medium text-gray-800 mb-1 text-sm">ℹ️ Informations complémentaires</h4>
                  <div class="text-xs text-gray-500 space-y-1">
                    <template v-for="(value, key) in otherMetadata" :key="key">
                      <p><span class="font-medium">{{ key }} :</span> {{ value }}</p>
                    </template>
                  </div>
                </div>
              </div>
            </div>

            <!-- Zone d'achat fixe en bas -->
            <div class="border-t border-gray-200 p-6 bg-gray-50">
              <!-- Prix et Quantité sur la même ligne -->
              <div class="flex items-center justify-between mb-6">
                <!-- Prix total calculé -->
                <div class="text-left">
                  <div class="text-2xl font-bold text-amber-600">
                    {{ formatTotalPrice() }}
                  </div>
                  <div v-if="selectedVariant && selectedVariant.price.unit_amount && selectedVariant.weight" class="text-sm text-gray-500 mt-1">
                    {{ formatPricePerUnit(selectedVariant) }}
                  </div>
                </div>
                
                <!-- Quantité -->
                <div class="flex items-center space-x-3">
                  <label class="font-medium text-sm">Quantité :</label>
                  <div class="flex items-center border rounded-lg bg-white">
                    <button 
                      @click="decrementQuantity"
                      class="px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 transition-colors text-sm"
                    >
                      -
                    </button>
                    <span class="px-4 py-2 border-x text-sm font-medium">{{ quantity }}</span>
                    <button 
                      @click="incrementQuantity"
                      class="px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 transition-colors text-sm"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
              
              <!-- Bouton ajouter au panier -->
              <button
                @click="addToCart"
                :disabled="addingToCart"
                class="w-full bg-amber-600 text-white py-3 px-4 rounded-lg hover:bg-amber-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm shadow-md"
              >
                <span v-if="addingToCart">Ajout en cours...</span>
                <span v-else>Ajouter au panier</span>
              </button>
              
              <!-- Message de confirmation avec transition -->
              <Transition
                enter-active-class="transition-all duration-300 ease-out"
                enter-from-class="opacity-0 transform translate-y-2"
                enter-to-class="opacity-100 transform translate-y-0"
                leave-active-class="transition-all duration-300 ease-in"
                leave-from-class="opacity-100 transform translate-y-0"
                leave-to-class="opacity-0 transform translate-y-2"
              >
                <div v-if="showAddedMessage" class="text-green-600 font-medium text-center mt-3 text-sm">
                  ✓ Produit ajouté au panier !
                </div>
              </Transition>
            </div>
          </div>
        </div>
      </DialogPanel>
    </div>
  </Dialog>
</template>

<script setup>
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/vue'
import { ref, computed, watch, Transition } from 'vue'

// Import du composable pour le panier
const { addItem } = useCart()

const props = defineProps({
  open: Boolean,
  product: Object
})

const emit = defineEmits(['close'])

const quantity = ref(1)
const selectedVariantId = ref(null)
const addingToCart = ref(false)
const showAddedMessage = ref(false)

// Réinitialiser quand on ouvre/ferme la modale
watch(() => props.open, (newVal) => {
  if (newVal) {
    quantity.value = 1
    selectedVariantId.value = productVariants.value?.[0]?.id || null
    showAddedMessage.value = false
  }
})

// Variantes du produit (si plusieurs prix disponibles)
const productVariants = computed(() => {
  if (!props.product?.prices || props.product.prices.length <= 1) return []
  
  // Créer les variantes avec les informations extraites
  const variants = props.product.prices.map((price, index) => {
    // Extraire le poids des métadonnées du prix
    let weight = price.metadata?.weight || price.metadata?.poids || ''
    
    // Si pas de poids dans les métadonnées, essayer d'extraire du nickname
    if (!weight && price.nickname) {
      const weightMatch = price.nickname.match(/(\d+\s*(?:g|kg|ml|l))/i)
      if (weightMatch) {
        weight = weightMatch[1]
      } else {
        weight = price.nickname
      }
    }
    
    // Nom d'affichage - ne pas afficher "Format X"
    let displayName = ''
    if (price.nickname && price.nickname !== weight) {
      displayName = price.nickname.replace(weight, '').trim()
    }
    
    return {
      id: price.id || index,
      name: displayName,
      weight: weight,
      price: price,
      sortPrice: price.unit_amount || 0
    }
  })
  
  // Trier par prix croissant (moins cher en premier)
  return variants.sort((a, b) => a.sortPrice - b.sortPrice)
})

// Variante sélectionnée
const selectedVariant = computed(() => {
  if (!productVariants.value.length || !selectedVariantId.value) return null
  return productVariants.value.find(v => v.id === selectedVariantId.value)
})

const formatPrice = (priceObj) => {
  if (!priceObj?.unit_amount) return ''
  const amount = priceObj.unit_amount / 100
  const currency = priceObj.currency === 'eur' ? '€' : priceObj.currency?.toUpperCase() || ''
  return `${amount.toFixed(2)} ${currency}`
}

const formatPricePerUnit = (variant) => {
  if (!variant.weight || !variant.price?.unit_amount) return ''
  
  // Nettoyer et extraire le nombre et l'unité du poids
  const cleanWeight = variant.weight.toString().toLowerCase().replace(/\s+/g, '')
  const weightMatch = cleanWeight.match(/(\d+(?:\.\d+)?)\s*(g|kg|ml|l|grammes?|kilogrammes?)/i)
  
  if (!weightMatch) return ''
  
  const weightValue = parseFloat(weightMatch[1])
  const weightUnit = weightMatch[2].toLowerCase()
  
  // Convertir en grammes pour le calcul
  let weightInGrams = weightValue
  if (weightUnit.startsWith('kg') || weightUnit.startsWith('kilogramme')) {
    weightInGrams = weightValue * 1000
  } else if (weightUnit === 'l') {
    weightInGrams = weightValue * 1000 // Approximation 1L = 1000g
  } else if (weightUnit === 'ml') {
    weightInGrams = weightValue // Approximation 1ml = 1g
  }
  
  if (weightInGrams <= 0) return ''
  
  const priceIn100g = (variant.price.unit_amount / 100) * (100 / weightInGrams)
  return `${priceIn100g.toFixed(2)}€/100g`
}

const formatProductPrice = (product) => {
  if (selectedVariant.value) {
    return formatPrice(selectedVariant.value.price)
  }
  const price = product?.prices?.[0] || product?.price
  return formatPrice(price)
}

// Calcul du prix total en fonction de la quantité
const formatTotalPrice = () => {
  const unitPrice = selectedVariant.value?.price || props.product?.prices?.[0] || props.product?.price
  const priceValue = unitPrice?.unit_amount ? unitPrice.unit_amount / 100 : unitPrice
  const total = priceValue * quantity.value
  return `${total.toFixed(2)}€`
}

// Métadonnées filtrées pour afficher uniquement les informations utiles
const displayedMetadataKeys = ['Ingrédients', 'Poids net total', 'Poids net égoutté', 'Allergènes', '*', '°']

const otherMetadata = computed(() => {
  if (!props.product?.metadata) return {}
  
  const filtered = {}
  Object.entries(props.product.metadata).forEach(([key, value]) => {
    // Exclure les clés techniques et celles déjà affichées
    if (!displayedMetadataKeys.includes(key) && 
        !['category', 'category_color', 'deprecated', 'has_variants', 'migration_date', 'replaced_by', 'updated_at', 'variant_type'].includes(key) &&
        value && 
        typeof value === 'string') {
      filtered[key] = value
    }
  })
  
  return filtered
})

const hasOtherMetadata = computed(() => {
  return Object.keys(otherMetadata.value).length > 0
})

const incrementQuantity = () => {
  quantity.value++
}

const decrementQuantity = () => {
  if (quantity.value > 1) {
    quantity.value--
  }
}

const addToCart = async () => {
  if (addingToCart.value) return
  
  addingToCart.value = true
  
  const currentPrice = selectedVariant.value?.price || props.product?.prices?.[0] || props.product?.price
  
  const productToAdd = {
    id: props.product.id,
    name: props.product.name,
    price: currentPrice?.unit_amount ? currentPrice.unit_amount / 100 : currentPrice,
    image: props.product.images?.[0] || props.product.image,
    variant: selectedVariant.value || null
  }
  
  // Ajouter le produit au panier immédiatement
  addItem(productToAdd, quantity.value)
  addingToCart.value = false
  showAddedMessage.value = true
  
  // Fermer la modale après un court délai pour voir le message
  setTimeout(() => {
    emit('close')
  }, 1000)
}
</script>