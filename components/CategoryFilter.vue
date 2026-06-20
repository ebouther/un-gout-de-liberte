<template>
  <div class="mb-8">
    <h3 class="text-sm font-display text-espresso mb-5 text-center tracking-wide">Filtrer par catégorie</h3>
    <div class="flex flex-wrap justify-center gap-2">
      <button
        @click="$emit('categoryChanged', null)"
        :class="[
          'px-5 py-2 text-xs tracking-wide font-body font-medium transition-all duration-200 border',
          selectedCategory === null
            ? 'bg-gold text-white border-gold'
            : 'bg-white text-textbody border-line hover:border-gold/50'
        ]"
      >
        <span class="flex items-center">
          Tous les produits
        </span>
      </button>

      <button
        v-for="category in categories"
        :key="category"
        @click="$emit('categoryChanged', category)"
        :class="[
          'px-5 py-2 text-xs tracking-wide font-body font-medium transition-all duration-200 capitalize border',
          selectedCategory === category
            ? 'bg-gold text-white border-gold'
            : 'bg-white text-textbody border-line hover:border-gold/50'
        ]"
      >
        <span class="flex items-center gap-1.5">
          {{ formatCategoryName(category) }}
          <span class="px-1.5 py-0.5 text-[0.6rem] leading-none bg-white/20 text-inherit rounded-sm">
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
