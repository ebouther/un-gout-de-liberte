<template>
  <div v-if="product.prices && product.prices.length > 1" class="mb-4">
    <h4 class="text-sm font-medium text-gray-700 mb-2">Choisir le format :</h4>
    <div class="grid grid-cols-1 gap-2">
      <button
        v-for="price in sortedPrices"
        :key="price.id"
        @click="$emit('priceSelected', price)"
        :class="[
          'flex items-center justify-between p-3 border-2 rounded-lg transition-all duration-200',
          selectedPriceId === price.id 
            ? 'border-amber-500 bg-amber-50 shadow-md' 
            : 'border-gray-200 hover:border-amber-300 hover:bg-amber-25'
        ]"
      >
        <div class="flex items-center space-x-3">
          <!-- Weight/size indicator -->
          <div class="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100">
            <svg class="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5a2 2 0 012-2h4a2 2 0 012 2v0H8v0z" />
            </svg>
          </div>
          
          <div class="text-left">
            <div class="font-medium text-gray-900">
              {{ getWeightFromPrice(price) }}
            </div>
            <div class="text-xs text-gray-500">
              {{ getUnitPriceText(price) }}
            </div>
          </div>
        </div>
        
        <div class="text-right">
          <div class="font-bold text-amber-600">
            {{ formatPrice(price) }}
          </div>
          <div v-if="showSavings(price)" class="text-xs text-green-600 font-medium">
            {{ getSavingsText(price) }}
          </div>
        </div>
        
        <!-- Selected indicator -->
        <div v-if="selectedPriceId === price.id" class="absolute top-2 right-2">
          <div class="w-5 h-5 bg-amber-500 rounded-full flex items-center justify-center">
            <svg class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
            </svg>
          </div>
        </div>
      </button>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  product: {
    type: Object,
    required: true
  },
  selectedPriceId: {
    type: String,
    default: null
  }
})

defineEmits(['priceSelected'])

// Sort prices by weight/amount (ascending)
const sortedPrices = computed(() => {
  if (!props.product.prices) return []
  
  return [...props.product.prices].sort((a, b) => {
    const weightA = getWeightValue(a)
    const weightB = getWeightValue(b)
    return weightA - weightB
  })
})

const getWeightFromPrice = (price) => {
  // Priorité 1: métadonnées du prix (nouveau système)
  if (price.metadata?.weight) {
    return price.metadata.weight
  }
  
  // Priorité 2: métadonnées du prix avec clé 'Poids'
  if (price.metadata?.['Poids']) {
    return price.metadata['Poids']
  }
  
  // Priorité 3: métadonnées du produit 'Poids' (fallback)
  if (props.product.metadata?.['Poids']) {
    return props.product.metadata['Poids']
  }
  
  // Priorité 4: métadonnées du produit 'Poids net total' (fallback)
  if (props.product.metadata?.['Poids net total']) {
    return props.product.metadata['Poids net total']
  }
  
  // Priorité 5: extraction depuis le nom du produit
  const name = props.product.name || ''
  const weightMatch = name.match(/(\d+(?:\.\d+)?)\s*(g|kg|ml|l|cl)/i)
  if (weightMatch) {
    return `${weightMatch[1]}${weightMatch[2].toLowerCase()}`
  }
  
  // Fallback basé sur le prix
  const amount = price.unit_amount / 100
  if (amount < 10) return '250g'
  if (amount < 20) return '500g'
  return '1kg'
}

const getWeightValue = (price) => {
  const weight = getWeightFromPrice(price)
  const match = weight.match(/(\d+(?:\.\d+)?)\s*(g|kg|ml|l|cl)/i)
  if (!match) return price.unit_amount
  
  let value = parseFloat(match[1])
  const unit = match[2].toLowerCase()
  
  // Convert to grams for comparison
  if (unit === 'kg') value *= 1000
  if (unit === 'l') value *= 1000
  if (unit === 'cl') value *= 10
  
  return value
}

const formatPrice = (price) => {
  if (!price?.unit_amount) return ''
  const amount = price.unit_amount / 100
  const currency = price.currency === 'eur' ? '€' : price.currency?.toUpperCase() || ''
  return `${amount.toFixed(2)} ${currency}`
}

const getUnitPriceText = (price) => {
  const weight = getWeightValue(price)
  const amount = price.unit_amount / 100
  const pricePerGram = amount / weight * 100 // Price per 100g
  return `${pricePerGram.toFixed(2)}€/100g`
}

const showSavings = (price) => {
  if (sortedPrices.value.length < 2) return false
  const smallestPrice = sortedPrices.value[0]
  if (price.id === smallestPrice.id) return false
  
  const currentUnitPrice = price.unit_amount / getWeightValue(price)
  const smallestUnitPrice = smallestPrice.unit_amount / getWeightValue(smallestPrice)
  
  return currentUnitPrice < smallestUnitPrice
}

const getSavingsText = (price) => {
  const smallestPrice = sortedPrices.value[0]
  const currentUnitPrice = price.unit_amount / getWeightValue(price)
  const smallestUnitPrice = smallestPrice.unit_amount / getWeightValue(smallestPrice)
  
  const savings = ((smallestUnitPrice - currentUnitPrice) / smallestUnitPrice * 100)
  return `Économie ${savings.toFixed(0)}%`
}
</script>

<style scoped>
.relative {
  position: relative;
}

.absolute {
  position: absolute;
}
</style>
