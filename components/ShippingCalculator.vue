<template>
  <div class="bg-gray-50 rounded-lg p-3">
    <!-- Informations de livraison simplifiées -->
    <div class="space-y-2">
      <!-- Résumé des frais -->
      <div class="flex items-center justify-between">
        <span class="text-sm font-medium text-gray-700">Livraison Colissimo</span>
        <span class="font-bold text-amber-600">
          {{ formatShippingPrice(currentShippingCost) }}
        </span>
      </div>
      
      <div class="flex items-center justify-between text-xs">
        <span class="text-gray-600">Poids total:</span>
        <span class="text-gray-900">{{ totalWeight.toFixed(2) }} kg</span>
      </div>

      <!-- Livraison gratuite -->
      <div v-if="isFreeShipping" class="p-2 bg-green-50 border border-green-200 rounded-lg">
        <div class="flex items-center space-x-2">
          <svg class="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
          <span class="text-xs font-medium text-green-800">Livraison gratuite !</span>
        </div>
      </div>

      <!-- Progression vers livraison gratuite -->
      <div v-else-if="remainingForFreeShipping > 0 && remainingForFreeShipping <= freeShippingThreshold" class="p-2 bg-amber-50 border border-amber-200 rounded-lg">
        <div class="flex items-center justify-between mb-1">
          <span class="text-xs font-medium text-amber-800">
            Plus que {{ remainingForFreeShipping.toFixed(2) }}€ pour la livraison gratuite
          </span>
        </div>
        <div class="w-full bg-amber-200 rounded-full h-1">
          <div 
            class="bg-amber-600 h-1 rounded-full transition-all duration-300"
            :style="{ width: `${Math.min((cartTotal / freeShippingThreshold) * 100, 100)}%` }"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'

const props = defineProps({
  cartItems: {
    type: Array,
    default: () => []
  },
  cartTotal: {
    type: Number,
    default: 0
  }
})

const emit = defineEmits(['shipping-updated'])

const { 
  calculateShippingCost, 
  formatShippingPrice,
  getItemWeight,
  getFreeShippingThreshold,
  isFreeShippingEligible
} = useShipping()

// État réactif simplifié - toujours France métropolitaine, Colissimo Standard
const selectedCountry = 'FR'
const postalCode = ''
const selectedDeliveryType = 'standard'

// Calculs réactifs
const totalWeight = computed(() => {
  if (!props.cartItems || props.cartItems.length === 0) return 0
  
  return props.cartItems.reduce((total, item) => {
    const itemWeight = getItemWeight(item)
    return total + (itemWeight * item.quantity)
  }, 0)
})

const freeShippingThreshold = computed(() => {
  return getFreeShippingThreshold(selectedCountry)
})

const isFreeShipping = computed(() => {
  return isFreeShippingEligible(props.cartTotal, selectedCountry)
})

const remainingForFreeShipping = computed(() => {
  const remaining = freeShippingThreshold.value - props.cartTotal
  return remaining > 0 ? remaining : 0
})

const currentShippingCost = computed(() => {
  if (isFreeShipping.value) return 0
  
  return calculateShippingCost(
    totalWeight.value,
    selectedCountry,
    postalCode,
    selectedDeliveryType
  )
})

// Méthodes
const updateShipping = () => {
  const shippingInfo = {
    country: selectedCountry,
    postalCode: postalCode,
    deliveryType: selectedDeliveryType,
    zone: 'france-metropolitaine',
    zoneName: 'France métropolitaine',
    cost: currentShippingCost.value,
    weight: totalWeight.value,
    isFree: isFreeShipping.value
  }
  
  emit('shipping-updated', shippingInfo)
}

// Watchers
watch(() => props.cartItems, () => {
  updateShipping()
}, { deep: true })

watch(() => props.cartTotal, () => {
  updateShipping()
})

// Initialisation
updateShipping()
</script>