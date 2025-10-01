<template>
  <div>
    <!-- Category filters -->
    <CategoryFilter 
      :categories="availableCategories"
      :selected-category="selectedCategory"
      :products="cart.products || []"
      @category-changed="selectedCategory = $event"
    />

    <!-- Product statistics -->
    <ProductStats
      :filtered-count="filteredProducts.length"
      :total-count="(cart.products || []).length"
      :selected-category="selectedCategory"
      :search-term="props.name"
      @clear-filters="clearAllFilters"
    />

    <!-- Loading skeleton -->
    <div v-if="loading" class="max-w-screen mx-auto text-center">
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-8">
        <div v-for="n in 6" :key="n" class="animate-pulse">
          <div class="rounded-lg bg-gray-200 aspect-square mb-4"></div>
          <div class="h-4 bg-gray-200 rounded mb-2"></div>
          <div class="h-3 bg-gray-200 rounded w-3/4"></div>
        </div>
      </div>
    </div>

    <!-- Products grid -->
    <div v-else-if="filteredProducts && filteredProducts.length > 0" class="max-w-screen mx-auto text-center">
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-8">
        <article
          v-for="product in filteredProducts"
          :key="product.id || Math.random()"
          class="group rounded-xl bg-white shadow-md hover:shadow-xl border border-gray-100 hover:border-amber-200 flex flex-col transition-all duration-300 hover:-translate-y-1 cursor-pointer"
          @click="openProductModal(product)"
        >
          <!-- Lien SEO-friendly vers la page produit - remplacé par modal -->
          <div class="w-full h-full flex flex-col">
            <div class="relative rounded-t-xl bg-gray-50 overflow-hidden aspect-square">
              <nuxt-img
                v-if="product.images && product.images[0]"
                class="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                :src="product.images[0]"
                :alt="product.name || 'Product'"
                loading="lazy"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              <!-- Category badge -->
              <div v-if="product.metadata?.category" class="absolute top-3 left-3">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 shadow-sm">
                  {{ formatCategoryName(product.metadata.category) }}
                </span>
              </div>
            </div>
            <div class="p-6 flex-1 flex flex-col justify-between">
              <div>
                <h3 class="font-semibold text-lg leading-tight text-gray-900 mb-2 group-hover:text-amber-700 transition-colors">
                  {{ product.name || 'Produit' }}
                </h3>
                <p class="text-sm text-gray-600 line-clamp-2">
                  {{ product.description || '' }}
                </p>
              </div>
              <div class="mt-4 flex items-center justify-between">
                <div class="text-xl font-bold text-amber-600">
                  {{ getCheapestPrice(product) }}
                  <span v-if="hasMultiplePrices(product)" class="text-sm font-normal text-gray-500 ml-1">
                    à partir de
                  </span>
                </div>
                <div class="flex items-center text-amber-600 group-hover:text-amber-700 transition-colors">
                  <span class="text-sm font-medium mr-1">Voir</span>
                  <svg class="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </article>
      </div>
    </div>

    <!-- Empty state -->
    <div v-else class="text-center py-12">
      <div class="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        <svg class="w-12 h-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
      <h3 class="text-lg font-medium text-gray-900 mb-2">Aucun produit trouvé</h3>
      <p class="text-gray-500">Essayez une autre recherche ou parcourez tous nos produits.</p>
    </div>

    <!-- Modal produit -->
    <Product 
      :open="!!selectedProduct"
      :product="selectedProduct" 
      @close="closeProductModal" 
    />
  </div>
</template>

<script setup>
import { useStore } from '~/store/cart'

const cart = useStore()
const selectedProduct = ref(null)
const selectedCategory = ref(null)

// Simple props definition
const props = defineProps({
  name: String,
  loading: Boolean
})

// Computed property for available categories
const availableCategories = computed(() => {
  const allProducts = cart.products || []
  const categories = new Set()
  
  allProducts.forEach(product => {
    if (product?.metadata?.category) {
      categories.add(product.metadata.category)
    }
  })
  
  return Array.from(categories).sort()
})

// Computed property for filtered products
const filteredProducts = computed(() => {
  const allProducts = cart.products || []

  let filtered = allProducts

  // Filter by search term
  if (props.name && props.name.trim() !== '') {
    const searchTerm = props.name.toLowerCase().trim()
    filtered = filtered.filter(product => {
      if (!product) return false

      const nameMatch = product.name?.toLowerCase().includes(searchTerm)
      const descMatch = product.description?.toLowerCase().includes(searchTerm)
      const categoryMatch = product.metadata?.category?.toLowerCase().includes(searchTerm)

      return nameMatch || descMatch || categoryMatch
    })
  }

  // Filter by category
  if (selectedCategory.value) {
    filtered = filtered.filter(product => {
      return product?.metadata?.category === selectedCategory.value
    })
  }

  return filtered
})

const formatPrice = (price) => {
  if (!price?.unit_amount) return ''
  const amount = price.unit_amount / 100
  const currency = price.currency === 'eur' ? '€' : price.currency?.toUpperCase() || ''
  return `${amount.toFixed(2)} ${currency}`
}

// Fonction pour obtenir le prix le moins cher d'un produit
const getCheapestPrice = (product) => {
  // Si le produit a plusieurs prix (variantes)
  if (product.prices && product.prices.length > 1) {
    const cheapestPrice = product.prices.reduce((min, current) => {
      return current.unit_amount < min.unit_amount ? current : min
    })
    return formatPrice(cheapestPrice)
  }
  
  // Sinon, utiliser le prix unique ou le premier prix disponible
  const price = product.price || product.prices?.[0]
  return formatPrice(price)
}

// Fonction pour vérifier s'il y a plusieurs prix
const hasMultiplePrices = (product) => {
  return product.prices && product.prices.length > 1
}

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

function openProductModal(product) {
  selectedProduct.value = product
}

function closeProductModal() {
  selectedProduct.value = null
}

function clearAllFilters() {
  selectedCategory.value = null
  // Emit event to parent to clear search as well
  emit('clearSearch')
}

// Define emits
const emit = defineEmits(['clearSearch'])
</script>