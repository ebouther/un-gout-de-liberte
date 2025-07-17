<!-- filepath: components/ProductStats.vue -->
<template>
  <div class="mb-6 text-center">
    <div class="inline-flex items-center space-x-4 bg-white rounded-lg shadow-sm border border-gray-200 px-6 py-3">
      <div class="flex items-center space-x-2">
        <svg class="w-5 h-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
        </svg>
        <span class="text-sm text-gray-600">
          {{ filteredCount }} produit{{ filteredCount > 1 ? 's' : '' }}
          <span v-if="totalCount !== filteredCount" class="text-gray-400">
            sur {{ totalCount }}
          </span>
        </span>
      </div>
      
      <div v-if="selectedCategory" class="flex items-center space-x-2">
        <span class="text-sm text-gray-500">dans</span>
        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
          {{ selectedCategory }}
        </span>
      </div>
      
      <div v-if="searchTerm" class="flex items-center space-x-2">
        <span class="text-sm text-gray-500">pour</span>
        <span class="font-medium text-gray-700">"{{ searchTerm }}"</span>
      </div>
      
      <button
        v-if="selectedCategory || searchTerm"
        @click="$emit('clearFilters')"
        class="text-xs text-amber-600 hover:text-amber-700 font-medium transition-colors"
      >
        Tout effacer
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  filteredCount: {
    type: Number,
    required: true
  },
  totalCount: {
    type: Number,
    required: true
  },
  selectedCategory: {
    type: String,
    default: null
  },
  searchTerm: {
    type: String,
    default: ''
  }
})

defineEmits(['clearFilters'])
</script>
