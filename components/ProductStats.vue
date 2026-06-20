<template>
  <div class="mb-6 text-center">
    <div class="inline-flex items-center space-x-4 bg-white border border-line px-6 py-3">
      <div class="flex items-center space-x-2">
        <svg class="w-5 h-5 text-gold/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
        </svg>
        <span class="text-sm text-textbody font-body">
          {{ filteredCount }} produit{{ filteredCount > 1 ? 's' : '' }}
          <span v-if="totalCount !== filteredCount" class="text-gray-400">
            sur {{ totalCount }}
          </span>
        </span>
      </div>

      <div v-if="selectedCategory" class="flex items-center space-x-2">
        <span class="text-sm text-textbody/70">dans</span>
        <span class="inline-flex items-center px-2.5 py-0.5 text-xs font-medium bg-cream text-sage border border-line">
          {{ formatCategoryName(selectedCategory) }}
        </span>
      </div>

      <div v-if="searchTerm" class="flex items-center space-x-2">
        <span class="text-sm text-textbody/70">pour</span>
        <span class="font-medium text-espresso text-sm">"{{ searchTerm }}"</span>
      </div>

      <button
        v-if="selectedCategory || searchTerm"
        @click="$emit('clearFilters')"
        class="text-xs text-gold hover:text-gold-dark font-medium transition-colors"
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

const formatCategoryName = (category) => {
  const categoryMap = {
    'confitures': 'Confitures',
    'fruits-sirop': 'Fruits au sirop',
    'biscuits-sucres': 'Biscuits sucrés',
    'aperitifs': 'Apéritifs',
    'biscottes': 'Biscottes',
    'macarons': 'Macarons',
    'confits-chutneys': 'Confits & Chutneys',
    'sirops': 'Sirops',
    'caramels': 'Caramels',
    'autres': 'Autres'
  }
  return categoryMap[category.toLowerCase()] || category.charAt(0).toUpperCase() + category.slice(1)
}
</script>
