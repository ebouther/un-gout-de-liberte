<template>
  <Dialog :open="open" @close="$emit('close')" class="relative z-50">
    <div class="fixed inset-0 bg-black/30" aria-hidden="true" />
    
    <!-- Desktop Layout -->
    <div class="fixed inset-0 hidden md:flex w-screen items-center justify-center p-4">
      <DialogPanel 
        class="w-full max-w-7xl bg-white rounded-lg shadow-xl overflow-hidden max-h-[95vh] flex flex-col"
      >
        <!-- Desktop Header -->
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

        <!-- Desktop Content - 2 columns -->
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

    <!-- Mobile Layout - Full Screen -->
    <div class="fixed inset-0 md:hidden">
      <DialogPanel class="w-full h-full bg-white flex flex-col">
        <!-- Mobile Header - Sticky -->
        <div class="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
          <div class="flex items-center justify-between p-4">
            <button 
              @click="$emit('close')"
              class="flex items-center text-amber-600 hover:text-amber-700 transition-colors"
            >
              <svg class="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span class="text-sm font-medium">Retour</span>
            </button>
            
            <div v-if="product.metadata?.['Label bio'] === 'Oui'" class="bg-green-100 text-green-700 text-xs font-medium px-2 py-1 rounded-full">
              Bio
            </div>
          </div>
        </div>

        <!-- Mobile Content - Scrollable -->
        <div class="flex-1 overflow-y-auto">
          <!-- Image produit - Grande sur mobile -->
          <div class="relative bg-gray-50">
            <div class="aspect-square w-full">
              <img 
                :src="product.images?.[0] || product.image" 
                :alt="product.name"
                class="w-full h-full object-cover"
              />
            </div>
          </div>

          <!-- Contenu mobile -->
          <div class="p-4 space-y-6">
            <!-- Titre et prix principal -->
            <div class="space-y-2">
              <h1 class="text-2xl font-bold text-gray-900 leading-tight">
                {{ product.name }}
              </h1>
              
              <!-- Prix principal visible -->
              <div class="text-3xl font-bold text-amber-600">
                {{ formatTotalPrice() }}
              </div>
              
              <div v-if="selectedVariant && selectedVariant.price.unit_amount && selectedVariant.weight" class="text-sm text-gray-500 mt-1">
                {{ formatPricePerUnit(selectedVariant) }}
              </div>
            </div>

            <!-- Description -->
            <div class="space-y-2">
              <h3 class="text-lg font-semibold text-gray-900">Description</h3>
              <p class="text-gray-600 leading-relaxed">
                {{ product.description }}
              </p>
            </div>

            <!-- Sélection des variantes - Mobile optimisé -->
            <div v-if="productVariants && productVariants.length > 1" class="space-y-3">
              <h3 class="text-lg font-semibold text-gray-900">Choisir un format</h3>
              <div class="space-y-2">
                <button
                  v-for="(variant, index) in productVariants"
                  :key="variant.id"
                  @click="selectedVariantId = variant.id"
                  :class="[
                    'w-full p-4 border-2 rounded-xl text-left transition-all duration-200 relative',
                    selectedVariantId === variant.id
                      ? 'border-amber-500 bg-amber-50 shadow-md'
                      : 'border-gray-200 hover:border-gray-300'
                  ]"
                >
                  <div class="flex justify-between items-center">
                    <div class="space-y-1">
                      <div class="font-medium text-gray-900">
                        {{ variant.weight || `Format ${index + 1}` }}
                      </div>
                      <div class="text-2xl font-bold text-amber-600">
                        {{ formatPrice(variant.price) }}
                      </div>
                      <div class="text-sm text-gray-500">
                        {{ formatPricePerUnit(variant) }}
                      </div>
                    </div>
                    
                    <!-- Indicateur de sélection -->
                    <div v-if="selectedVariantId === variant.id" 
                         class="w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center">
                      <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                      </svg>
                    </div>
                  </div>
                </button>
              </div>
            </div>

            <!-- Informations produit détaillées - Accordéon mobile -->
            <div class="space-y-4">
              <!-- Ingrédients -->
              <div v-if="product.metadata?.['Ingrédients']" class="bg-gray-50 rounded-lg p-4">
                <h4 class="font-medium text-gray-900 mb-2 flex items-center">
                  <span class="text-green-500 mr-2">🌿</span>
                  Ingrédients
                </h4>
                <p class="text-sm text-gray-600 leading-relaxed">{{ product.metadata['Ingrédients'] }}</p>
              </div>

              <!-- Poids -->
              <div v-if="(!productVariants || productVariants.length <= 1) && (product.metadata?.['Poids net total'] || product.metadata?.['Poids net égoutté'])" 
                   class="bg-gray-50 rounded-lg p-4">
                <h4 class="font-medium text-gray-900 mb-2 flex items-center">
                  <span class="text-blue-500 mr-2">⚖️</span>
                  Poids
                </h4>
                <div class="text-sm text-gray-600 space-y-1">
                  <p v-if="product.metadata?.['Poids net total']">
                    <span class="font-medium">Poids total :</span> {{ product.metadata['Poids net total'] }}
                  </p>
                  <p v-if="product.metadata?.['Poids net égoutté']">
                    <span class="font-medium">Poids égoutté :</span> {{ product.metadata['Poids net égoutté'] }}
                  </p>
                </div>
              </div>

              <!-- Allergènes -->
              <div v-if="product.metadata?.['Allergènes']" class="bg-yellow-50 rounded-lg p-4">
                <h4 class="font-medium text-gray-900 mb-2 flex items-center">
                  <span class="text-yellow-500 mr-2">⚠️</span>
                  Allergènes
                </h4>
                <p class="text-sm text-gray-600">{{ product.metadata['Allergènes'] }}</p>
              </div>

              <!-- Certifications -->
              <div v-if="product.metadata?.['*'] || product.metadata?.['°']" class="bg-amber-50 rounded-lg p-4">
                <h4 class="font-medium text-gray-900 mb-2 flex items-center">
                  <span class="text-amber-500 mr-2">🏷️</span>
                  Certifications
                </h4>
                <div class="text-sm text-gray-600 space-y-1">
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

              <!-- Autres informations -->
              <div v-if="hasOtherMetadata" class="bg-gray-50 rounded-lg p-4">
                <h4 class="font-medium text-gray-900 mb-2 flex items-center">
                  <span class="text-gray-500 mr-2">ℹ️</span>
                  Informations complémentaires
                </h4>
                <div class="text-sm text-gray-600 space-y-1">
                  <div v-for="(value, key) in otherMetadata" :key="key">
                    <span class="font-medium">{{ key }} :</span> {{ value }}
                  </div>
                </div>
              </div>
            </div>

            <!-- Espacement pour le footer fixe -->
            <div class="h-24"></div>
          </div>
        </div>

        <!-- Footer mobile fixe -->
        <div class="sticky bottom-0 bg-white border-t border-gray-200 p-4 shadow-lg">
          <!-- Quantité et prix -->
          <div class="flex items-center justify-between mb-4">
            <!-- Quantité compacte -->
            <div class="flex items-center space-x-3">
              <span class="font-medium text-sm text-gray-700">Quantité</span>
              <div class="flex items-center border border-gray-300 rounded-lg bg-white">
                <button 
                  @click="decrementQuantity"
                  class="px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 transition-colors"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
                  </svg>
                </button>
                <span class="px-4 py-2 border-x font-medium min-w-[3rem] text-center">{{ quantity }}</span>
                <button 
                  @click="incrementQuantity"
                  class="px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 transition-colors"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                  </svg>
                </button>
              </div>
            </div>

            <!-- Prix total -->
            <div class="text-right">
              <div class="text-xl font-bold text-amber-600">
                {{ formatTotalPrice() }}
              </div>
            </div>
          </div>
          
          <!-- Bouton ajouter au panier -->
          <button
            @click="addToCart"
            :disabled="addingToCart"
            class="w-full bg-amber-600 text-white py-4 px-6 rounded-xl hover:bg-amber-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-lg shadow-lg active:transform active:scale-[0.98]"
          >
            <span v-if="addingToCart" class="flex items-center justify-center">
              <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Ajout en cours...
            </span>
            <span v-else class="flex items-center justify-center">
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 2.5M7 13l2.5 2.5" />
              </svg>
              Ajouter au panier
            </span>
          </button>
          
          <!-- Message de confirmation -->
          <Transition
            enter-active-class="transition-all duration-300 ease-out"
            enter-from-class="opacity-0 transform translate-y-2"
            enter-to-class="opacity-100 transform translate-y-0"
            leave-active-class="transition-all duration-300 ease-in"
            leave-from-class="opacity-100 transform translate-y-0"
            leave-to-class="opacity-0 transform translate-y-2"
          >
            <div v-if="showAddedMessage" class="text-green-600 font-medium text-center mt-3 flex items-center justify-center">
              <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
              </svg>
              Produit ajouté au panier !
            </div>
          </Transition>
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
    price: currentPrice,
    image: props.product.images?.[0] || props.product.image,
    variant: selectedVariant.value || null
  }

  addItem(productToAdd, quantity.value)
  addingToCart.value = false
  showAddedMessage.value = true

  setTimeout(() => {
    emit('close')
  }, 1000)
}
</script>