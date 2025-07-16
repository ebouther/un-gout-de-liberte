<!-- filepath: components/CategoryDebug.vue -->
<template>
  <div v-if="showDebug" class="bg-gray-50 border rounded-lg p-4 mb-6">
    <div class="flex items-center justify-between mb-3">
      <h4 class="text-sm font-medium text-gray-700">Debug - Catégories détectées</h4>
      <button 
        @click="showDebug = false"
        class="text-gray-400 hover:text-gray-600"
      >
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
    
    <div class="space-y-2">
      <div class="text-xs text-gray-600">
        Produits avec catégories : {{ productsWithCategories.length }} / {{ totalProducts }}
      </div>
      
      <div class="flex flex-wrap gap-1">
        <span 
          v-for="(count, category) in categoryCounts" 
          :key="category"
          class="inline-flex items-center px-2 py-1 rounded text-xs bg-blue-100 text-blue-800"
        >
          {{ category }} ({{ count }})
        </span>
      </div>
      
      <details class="mt-2">
        <summary class="text-xs text-gray-500 cursor-pointer hover:text-gray-700">
          Produits sans catégorie ({{ productsWithoutCategories.length }})
        </summary>
        <div class="mt-1 text-xs text-gray-600">
          <div v-for="product in productsWithoutCategories" :key="product.id" class="truncate">
            • {{ product.name }}
          </div>
        </div>
      </details>
    </div>
  </div>
  
  <button 
    v-else
    @click="showDebug = true"
    class="text-xs text-gray-400 hover:text-gray-600 mb-4"
  >
    🔧 Debug catégories
  </button>
</template>

<script setup>
const props = defineProps({
  products: {
    type: Array,
    default: () => []
  }
})

const showDebug = ref(false)

const productsWithCategories = computed(() => {
  return props.products.filter(product => product?.metadata?.category)
})

const productsWithoutCategories = computed(() => {
  return props.products.filter(product => !product?.metadata?.category)
})

const totalProducts = computed(() => props.products.length)

const categoryCounts = computed(() => {
  const counts = {}
  props.products.forEach(product => {
    const category = product?.metadata?.category
    if (category) {
      counts[category] = (counts[category] || 0) + 1
    }
  })
  return counts
})
</script>
