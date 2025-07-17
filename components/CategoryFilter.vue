<!-- filepath: components/CategoryFilter.vue -->
<template>
  <div class="mb-8">
    <h3 class="text-lg font-semibold text-gray-900 mb-4 text-center">Filtrer par catégorie</h3>
    <div class="flex flex-wrap justify-center gap-3">
      <button
        @click="$emit('categoryChanged', null)"
        :class="[
          'px-6 py-3 rounded-full text-sm font-medium transition-all duration-200 border-2',
          selectedCategory === null
            ? 'bg-amber-600 text-white border-amber-600 shadow-lg transform scale-105'
            : 'bg-white text-gray-700 border-gray-200 hover:border-amber-300 hover:bg-amber-50'
        ]"
      >
        <span class="flex items-center">
          <svg v-if="selectedCategory === null" class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
          </svg>
          Tous les produits
        </span>
      </button>
      
      <button
        v-for="category in categories"
        :key="category"
        @click="$emit('categoryChanged', category)"
        :class="[
          'px-6 py-3 rounded-full text-sm font-medium transition-all duration-200 capitalize border-2',
          selectedCategory === category
            ? 'bg-amber-600 text-white border-amber-600 shadow-lg transform scale-105'
            : 'bg-white text-gray-700 border-gray-200 hover:border-amber-300 hover:bg-amber-50'
        ]"
      >
        <span class="flex items-center">
          <svg v-if="selectedCategory === category" class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
          </svg>
          {{ formatCategoryName(category) }}
          <span class="ml-2 px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
            {{ getCategoryCount(category) }}
          </span>
        </span>
      </button>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  categories: {
    type: Array,
    default: () => []
  },
  selectedCategory: {
    type: String,
    default: null
  },
  products: {
    type: Array,
    default: () => []
  }
})

defineEmits(['categoryChanged'])

const formatCategoryName = (category) => {
  // Convert category names to more readable format
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

const getCategoryCount = (category) => {
  return props.products.filter(product => product?.metadata?.category === category).length
}
</script>
