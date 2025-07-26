<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- En-tête -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Administration</h1>
        <p class="mt-2 text-gray-600">Gérez vos produits, articles et contenus</p>
      </div>

      <!-- Navigation par onglets -->
      <div class="mb-8">
        <nav class="flex space-x-8">
          <button
            @click="activeTab = 'products'"
            :class="{
              'border-amber-500 text-amber-600': activeTab === 'products',
              'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300': activeTab !== 'products'
            }"
            class="whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm flex items-center gap-2"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10"></path>
            </svg>
            Produits
          </button>
          <button
            @click="activeTab = 'blog'"
            :class="{
              'border-amber-500 text-amber-600': activeTab === 'blog',
              'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300': activeTab !== 'blog'
            }"
            class="whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm flex items-center gap-2"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
            </svg>
            Blog
          </button>
        </nav>
      </div>
      
      <!-- Contenu de l'onglet Produits -->
      <div v-if="activeTab === 'products'">
        <!-- Buttons container -->
        <div class="flex flex-wrap gap-4 items-center mb-6">
          <button
            @click="createNewProduct"
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

          <!-- Search -->
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

        <!-- Filters -->
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
            
            <div class="flex-1"></div>
            
            <div class="text-sm text-gray-600">
              {{ filteredProducts.length }} produit{{ filteredProducts.length > 1 ? 's' : '' }}
            </div>
          </div>
        </div>

        <!-- Status Message -->
        <div v-if="statusMessage" class="mb-4 p-4 rounded-lg" 
             :class="{
               'bg-green-100 text-green-700': statusType === 'success',
               'bg-red-100 text-red-700': statusType === 'error',
               'bg-yellow-100 text-yellow-700': statusType === 'warning',
               'bg-blue-100 text-blue-700': statusType === 'info'
             }">
          {{ statusMessage }}
        </div>

        <!-- Loading -->
        <div v-if="loading" class="flex justify-center py-12">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
        </div>

        <!-- Product List -->
        <div v-else-if="filteredProducts.length > 0" class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
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

            <!-- Content -->
            <div class="p-4">
              <h3 class="font-semibold text-lg text-gray-900 mb-2">{{ product.name }}</h3>
              
              <p v-if="product.description" class="text-gray-600 text-sm mb-3 line-clamp-2">
                {{ product.description }}
              </p>

              <!-- Prix -->
              <div class="mb-3">
                <div v-if="product.prices && product.prices.length > 0" class="space-y-1">
                  <div v-for="price in product.prices.slice(0, 2)" :key="price.id" class="flex justify-between items-center text-sm">
                    <span class="text-gray-600">
                      <template v-if="price.nickname">{{ price.nickname }} – </template>{{ formatPrice(price.unit_amount) }}
                    </span>
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

        <!-- No Products Message -->
        <div v-else-if="filteredProducts.length === 0" class="text-center py-12">
          <svg class="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2 2v-5m16 0h-2M4 13h2m-2 0v-2a2 2 0 012-2h2m0 0V9a2 2 0 012-2h2M9 3v2m6-2v2"></path>
          </svg>
          <h3 class="text-lg font-medium text-gray-900 mb-2">Aucun produit trouvé</h3>
          <p class="text-gray-600">
            {{ products.length === 0 ? 
              'Aucun produit chargé depuis Stripe. Vérifiez votre configuration.' : 
              'Essayez de modifier vos filtres ou créez un nouveau produit.' 
            }}
          </p>
        </div>
      </div>

      <!-- Contenu de l'onglet Blog -->
      <div v-if="activeTab === 'blog'">
        <div class="bg-white rounded-lg shadow">
          <div class="px-6 py-4 border-b border-gray-200">
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-medium text-gray-900">Articles du Blog</h3>
              <button
                @click="createNewArticle"
                class="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                </svg>
                Nouvel Article
              </button>
            </div>
          </div>
          
          <div class="p-6">
            <!-- Loading -->
            <div v-if="blogLoading" class="text-center py-12">
              <svg class="animate-spin -ml-1 mr-3 h-8 w-8 text-amber-600 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <p class="text-gray-600 mt-2">Chargement des articles...</p>
            </div>

            <!-- Liste des articles -->
            <div v-else-if="articles.length > 0" class="space-y-4">
              <div
                v-for="article in articles"
                :key="article.slug"
                class="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
              >
                <div class="flex items-start justify-between">
                  <div class="flex-1">
                    <h4 class="text-lg font-medium text-gray-900 mb-2">{{ article.title }}</h4>
                    <p class="text-gray-600 text-sm mb-3">{{ article.summary }}</p>
                    <div class="flex items-center gap-4 text-sm text-gray-500">
                      <span class="flex items-center gap-1">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                        </svg>
                        {{ new Date(article.date).toLocaleDateString('fr-FR') }}
                      </span>
                      <span class="flex items-center gap-1">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 713 12V7a4 4 0 014-4z"></path>
                        </svg>
                        {{ article.category }}
                      </span>
                      <span class="flex items-center gap-1">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        {{ article.readingTime }} min
                      </span>
                    </div>
                  </div>
                  <div class="flex items-center gap-2">
                    <span 
                      :class="{
                        'bg-green-100 text-green-800': article.status === 'published',
                        'bg-yellow-100 text-yellow-800': article.status === 'draft'
                      }"
                      class="px-2 py-1 rounded-full text-xs font-medium"
                    >
                      {{ article.status === 'published' ? 'Publié' : 'Brouillon' }}
                    </span>
                    <button 
                      @click="editArticle(article)"
                      class="text-amber-600 hover:text-amber-700 p-1 rounded"
                      title="Modifier l'article"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Message aucun article -->
            <div v-else class="text-center py-12">
              <svg class="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
              </svg>
              <h3 class="text-lg font-medium text-gray-900 mb-2">Aucun article pour le moment</h3>
              <p class="text-gray-600 mb-4">
                Créez votre premier article de blog pour partager vos actualités, recettes et événements.
              </p>
              <button
                @click="createNewArticle"
                class="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg font-medium"
              >
                Créer mon premier article
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal de création/édition produit -->
      <AdminProductModal
        :show="showCreateForm || !!editingProduct"
        :product="editingProduct"
        @close="closeModal"
        @saved="onProductSaved"
      />

      <!-- Modal de création/édition article -->
      <AdminArticleModal
        :show="showArticleForm || !!editingArticle"
        :article="editingArticle"
        @close="closeModal"
        @saved="onArticleSaved"
      />
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'admin'
})

// Authentication check
onMounted(async () => {
  if (process.client) {
    await new Promise(resolve => setTimeout(resolve, 500))
    const token = useCookie('admin-auth')
    try {
      const response = await $fetch('/api/admin/auth/check')
      if (!response.authenticated) {
        await navigateTo('/admin/login')
        return
      }
      await loadProducts()
    } catch (error) {
      console.error('Auth check failed:', error)
      await navigateTo('/admin/login')
      return
    }
  }
})

// État réactif
const activeTab = ref('products')
const products = ref([])
const articles = ref([])
const loading = ref(true)
const blogLoading = ref(false)
const showCreateForm = ref(false)
const showArticleForm = ref(false)
const editingProduct = ref(null)
const editingArticle = ref(null)
const searchQuery = ref('')
const selectedCategory = ref('')
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

  return filtered
})

// Fonctions
const loadProducts = async () => {
  try {
    loading.value = true
    const data = await $fetch('/api/products')
    
    // L'API renvoie directement un tableau de produits
    products.value = Array.isArray(data) ? data : []
  } catch (error) {
    console.error('Erreur lors du chargement des produits:', error)
    showStatus('Erreur lors du chargement des produits', 'error')
    products.value = []
  } finally {
    loading.value = false
  }
}

const refreshProducts = async () => {
  await loadProducts()
  showStatus('Produits actualisés', 'success')
}

const createNewProduct = () => {
  editingProduct.value = null
  showCreateForm.value = true
}

const createNewArticle = () => {
  editingArticle.value = null
  showArticleForm.value = true
}

const loadArticles = async () => {
  try {
    blogLoading.value = true
    const response = await $fetch('/api/admin/blog/articles')
    articles.value = response.articles || []
  } catch (error) {
    console.error('Erreur lors du chargement des articles:', error)
    showStatus('Erreur lors du chargement des articles', 'error')
    articles.value = []
  } finally {
    blogLoading.value = false
  }
}

// Surveiller le changement d'onglet pour charger les données
watch(activeTab, (newTab) => {
  if (newTab === 'blog' && articles.value.length === 0) {
    loadArticles()
  }
})

const editProduct = (product) => {
  editingProduct.value = product
  showCreateForm.value = true
}

const closeModal = () => {
  showCreateForm.value = false
  showArticleForm.value = false
  editingProduct.value = null
  editingArticle.value = null
}

const editArticle = (article) => {
  editingArticle.value = article
  showArticleForm.value = true
}

const onArticleSaved = (savedArticle) => {
  if (savedArticle === null) {
    // Suppression : recharger la liste
    loadArticles()
    showStatus('Article supprimé avec succès', 'success')
  } else if (editingArticle.value) {
    // Mode édition : mettre à jour l'article dans la liste
    const index = articles.value.findIndex(a => a.slug === editingArticle.value.slug)
    if (index !== -1) {
      articles.value[index] = { ...savedArticle }
    }
    showStatus('Article modifié avec succès', 'success')
  } else {
    // Mode création : ajouter le nouvel article à la liste
    articles.value.unshift(savedArticle)
    showStatus('Article créé avec succès', 'success')
  }
  
  closeModal()
}

const onProductSaved = (savedProduct) => {
  if (!savedProduct || !savedProduct.id) {
    console.error('Produit sauvegardé invalide:', savedProduct)
    showStatus('Erreur: produit invalide reçu', 'error')
    return
  }

  if (editingProduct.value) {
    // Mode édition : mettre à jour le produit dans la liste
    const index = products.value.findIndex(p => p.id === savedProduct.id)
    if (index !== -1) {
      products.value[index] = { ...savedProduct }
      showStatus('Produit modifié avec succès', 'success')
    }
  } else {
    // Mode création : ajouter le nouveau produit à la liste
    products.value.unshift(savedProduct)
    showStatus('Produit créé avec succès', 'success')
  }
  
  closeModal()
}

const toggleProductStatus = async (product) => {
  try {
    const response = await $fetch(`/api/admin/products/${product.id}`, {
      method: 'PATCH',
      body: {
        active: !product.active
      }
    })
    
    if (response.success) {
      // Mettre à jour localement
      product.active = !product.active
      showStatus(`Produit ${product.active ? 'activé' : 'désactivé'}`, 'success')
    } else {
      showStatus('Erreur lors de la modification du statut', 'error')
    }
  } catch (error) {
    console.error('Erreur lors de la modification du statut:', error)
    showStatus('Erreur lors de la modification du statut', 'error')
  }
}

const formatPrice = (amount) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR'
  }).format(amount / 100)
}

const showStatus = (message, type = 'success', duration = 3000) => {
  statusMessage.value = message
  statusType.value = type
  setTimeout(() => {
    statusMessage.value = ''
  }, duration)
}
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
