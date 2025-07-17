<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- En-tête -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Administration des Produits</h1>
        <p class="mt-2 text-gray-600">Gérez vos produits, prix et informations facilement</p>
      </div>

      <!-- Actions principales -->
      <div class="mb-6 flex flex-wrap gap-4">
        <button
          @click="showCreateForm = true"
          class="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
          </svg>
          Nouveau Produit
        </button>
        
        <button
          @click="refreshProducts"
          class="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
          </svg>
          Actualiser
        </button>

        <div class="flex-1"></div>

        <div class="relative">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Rechercher un produit..."
            class="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
          >
          <svg class="w-5 h-5 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
        </div>
      </div>

      <!-- Filtres -->
      <div class="mb-6 bg-white p-4 rounded-lg shadow">
        <div class="flex flex-wrap gap-4 items-center">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
            <select v-model="selectedCategory" class="border border-gray-300 rounded-md px-3 py-2 text-sm">
              <option value="">Toutes les catégories</option>
              <option v-for="category in categories" :key="category" :value="category">
                {{ category }}
              </option>
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Statut</label>
            <select v-model="selectedStatus" class="border border-gray-300 rounded-md px-3 py-2 text-sm">
              <option value="">Tous</option>
              <option value="active">Actifs</option>
              <option value="inactive">Inactifs</option>
            </select>
          </div>

          <div class="flex-1"></div>
          
          <div class="text-sm text-gray-600">
            {{ filteredProducts.length }} produit{{ filteredProducts.length > 1 ? 's' : '' }}
          </div>
        </div>
      </div>

      <!-- Message de statut -->
      <div v-if="statusMessage" class="mb-4 p-4 rounded-lg" 
           :class="{
             'bg-green-100 text-green-700': statusType === 'success',
             'bg-red-100 text-red-700': statusType === 'error',
             'bg-yellow-100 text-yellow-700': statusType === 'warning',
             'bg-blue-100 text-blue-700': statusType === 'info'
           }">
        <div class="flex items-center">
          <!-- Icône de succès -->
          <svg v-if="statusType === 'success'" class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
          </svg>
          <!-- Icône d'erreur -->
          <svg v-else-if="statusType === 'error'" class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path>
          </svg>
          <!-- Icône d'avertissement -->
          <svg v-else-if="statusType === 'warning'" class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
          </svg>
          <!-- Icône d'info -->
          <svg v-else class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path>
          </svg>
          
          {{ statusMessage }}
        </div>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="flex justify-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
      </div>

      <!-- Liste des produits -->
      <div v-else class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div
          v-for="product in filteredProducts"
          :key="product.id"
          class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
        >
          <!-- Image -->
          <div class="h-48 bg-gray-200 relative">
            <img
              v-if="product.images && product.images[0]"
              :src="product.images[0]"
              :alt="product.name"
              class="w-full h-full object-cover"
            >
            <div v-else class="flex items-center justify-center h-full text-gray-400">
              <svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
            </div>
            
            <!-- Badge statut -->
            <div class="absolute top-2 right-2">
              <span
                class="px-2 py-1 text-xs font-medium rounded-full"
                :class="product.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
              >
                {{ product.active ? 'Actif' : 'Inactif' }}
              </span>
            </div>
          </div>

          <!-- Contenu -->
          <div class="p-4">
            <h3 class="font-semibold text-lg text-gray-900 mb-2">{{ product.name }}</h3>
            
            <p v-if="product.description" class="text-gray-600 text-sm mb-3 line-clamp-2">
              {{ product.description }}
            </p>

            <!-- Prix -->
            <div class="mb-3">
              <div v-if="product.prices && product.prices.length > 0" class="space-y-1">
                <div v-for="price in product.prices.slice(0, 2)" :key="price.id" class="flex justify-between items-center text-sm">
                  <span class="text-gray-600">{{ price.nickname || formatPrice(price.unit_amount) }}</span>
                  <span class="font-medium">{{ formatPrice(price.unit_amount) }}</span>
                </div>
                <div v-if="product.prices.length > 2" class="text-xs text-gray-500">
                  +{{ product.prices.length - 2 }} autre{{ product.prices.length > 3 ? 's' : '' }} prix
                </div>
              </div>
              <div v-else class="text-sm text-gray-500">Aucun prix défini</div>
            </div>

            <!-- Métadonnées importantes -->
            <div class="space-y-1 text-xs text-gray-500 mb-4">
              <div v-if="product.metadata?.category" class="flex items-center gap-1">
                <span class="font-medium">Catégorie:</span>
                <span>{{ product.metadata.category }}</span>
              </div>
              <div v-if="getProductWeight(product)" class="flex items-center gap-1">
                <span class="font-medium">Poids:</span>
                <span>{{ getProductWeight(product) }}</span>
              </div>
            </div>

            <!-- Actions -->
            <div class="flex gap-2">
              <button
                @click="editProduct(product)"
                class="flex-1 bg-amber-600 hover:bg-amber-700 text-white text-sm py-2 px-3 rounded-md font-medium"
              >
                Modifier
              </button>
              
              <button
                @click="toggleProductStatus(product)"
                class="px-3 py-2 text-sm rounded-md font-medium border"
                :class="product.active 
                  ? 'border-red-300 text-red-700 hover:bg-red-50' 
                  : 'border-green-300 text-green-700 hover:bg-green-50'"
              >
                {{ product.active ? 'Désactiver' : 'Activer' }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Message si aucun produit -->
      <div v-if="!loading && filteredProducts.length === 0" class="text-center py-12">
        <svg class="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2 2v-5m16 0h-2M4 13h2m-2 0v-2a2 2 0 012-2h2m0 0V9a2 2 0 012-2h2M9 3v2m6-2v2"></path>
        </svg>
        <h3 class="text-lg font-medium text-gray-900 mb-2">Aucun produit trouvé</h3>
        <p class="text-gray-600">Essayez de modifier vos filtres ou créez un nouveau produit.</p>
      </div>
    </div>

    <!-- Modal de création/édition -->
    <AdminProductModal
      :show="showCreateForm || !!editingProduct"
      :product="editingProduct"
      @close="closeModal"
      @saved="onProductSaved"
    />
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'admin',
  middleware: 'admin-auth'
})

// État réactif
const products = ref([])
const loading = ref(true)
const showCreateForm = ref(false)
const editingProduct = ref(null)
const searchQuery = ref('')
const selectedCategory = ref('')
const selectedStatus = ref('')
const statusMessage = ref('')
const statusType = ref('success')

// Computed
const categories = computed(() => {
  const cats = new Set()
  products.value.forEach(product => {
    if (product.metadata?.category) {
      cats.add(product.metadata.category)
    }
  })
  return Array.from(cats).sort()
})

const filteredProducts = computed(() => {
  let filtered = products.value

  // Filtre par recherche
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(product => 
      product.name.toLowerCase().includes(query) ||
      (product.description && product.description.toLowerCase().includes(query))
    )
  }

  // Filtre par catégorie
  if (selectedCategory.value) {
    filtered = filtered.filter(product => 
      product.metadata?.category === selectedCategory.value
    )
  }

  // Filtre par statut
  if (selectedStatus.value) {
    const isActive = selectedStatus.value === 'active'
    filtered = filtered.filter(product => product.active === isActive)
  }

  return filtered
})

// Méthodes
const loadProducts = async () => {
  try {
    loading.value = true
    showStatus('Chargement des produits...', 'info')
    
    const { data } = await $fetch('/api/admin/products')
    products.value = data || []
    
    showStatus(`${products.value.length} produits chargés`, 'success')
  } catch (error) {
    if (error.statusCode === 429) {
      showStatus('Trop de requêtes. Nouvelle tentative dans 5 secondes...', 'warning')
      // Retry automatique après 5 secondes
      setTimeout(() => {
        loadProducts()
      }, 5000)
    } else {
      showStatus('Erreur lors du chargement des produits', 'error')
      console.error('Erreur:', error)
    }
  } finally {
    loading.value = false
  }
}

const refreshProducts = () => {
  showStatus('Actualisation...', 'info')
  loadProducts()
}

const editProduct = (product) => {
  editingProduct.value = product
}

const closeModal = () => {
  showCreateForm.value = false
  editingProduct.value = null
}

const onProductSaved = () => {
  closeModal()
  loadProducts()
  showStatus('Produit sauvegardé avec succès', 'success')
}

const toggleProductStatus = async (product) => {
  try {
    const newStatus = !product.active
    showStatus(`${newStatus ? 'Activation' : 'Désactivation'} en cours...`, 'info')
    
    await $fetch('/api/admin/products/toggle-status', {
      method: 'POST',
      body: {
        productId: product.id,
        active: newStatus
      }
    })
    
    product.active = newStatus
    showStatus(
      `Produit ${newStatus ? 'activé' : 'désactivé'} avec succès`, 
      'success'
    )
  } catch (error) {
    if (error.statusCode === 429) {
      showStatus('Trop de requêtes. Veuillez patienter...', 'warning')
      // Retry automatique après 3 secondes
      setTimeout(() => {
        toggleProductStatus(product)
      }, 3000)
    } else {
      showStatus('Erreur lors de la modification du statut', 'error')
      console.error('Erreur:', error)
    }
  }
}

const formatPrice = (amountCents) => {
  if (!amountCents) return '0,00 €'
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR'
  }).format(amountCents / 100)
}

const getProductWeight = (product) => {
  // Chercher le poids dans les prix d'abord
  if (product.prices && product.prices.length > 0) {
    for (const price of product.prices) {
      if (price.metadata?.weight) {
        return price.metadata.weight
      }
    }
  }
  
  // Puis dans les métadonnées du produit
  return product.metadata?.Poids || product.metadata?.weight || null
}

const showStatus = (message, type = 'success') => {
  statusMessage.value = message
  statusType.value = type
  
  // Durée d'affichage selon le type
  const duration = {
    'success': 3000,
    'error': 7000,
    'warning': 5000,
    'info': 2000
  }[type] || 5000
  
  setTimeout(() => {
    statusMessage.value = ''
  }, duration)
}

// Chargement initial
onMounted(() => {
  loadProducts()
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
