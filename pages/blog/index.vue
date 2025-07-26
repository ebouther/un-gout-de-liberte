<template>
  <div>
    <!-- Header du blog -->
    <section class="bg-gradient-to-r from-amber-50 to-orange-50 py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center">
          <h1 class="text-4xl font-bold text-gray-900 mb-4">
            Notre Blog
          </h1>
          <p class="text-lg text-gray-600 max-w-2xl mx-auto">
            Découvrez nos recettes, conseils et actualités autour de la pâtisserie artisanale
          </p>
        </div>
      </div>
    </section>

    <!-- Liste des articles -->
    <section class="py-12">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Filtres -->
        <div class="mb-8 flex flex-wrap gap-4 justify-center">
          <button 
            @click="selectedCategory = 'all'"
            :class="[
              'px-4 py-2 rounded-full text-sm font-medium transition-colors',
              selectedCategory === 'all' 
                ? 'bg-amber-500 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            ]"
          >
            Tous les articles
          </button>
          <button 
            v-for="category in categories"
            :key="category"
            @click="selectedCategory = category"
            :class="[
              'px-4 py-2 rounded-full text-sm font-medium transition-colors capitalize',
              selectedCategory === category 
                ? 'bg-amber-500 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            ]"
          >
            {{ category }}
          </button>
        </div>

        <!-- Articles -->
        <div v-if="pending" class="text-center py-12">
          <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500"></div>
          <p class="mt-2 text-gray-600">Chargement des articles...</p>
        </div>

        <div v-else-if="error" class="text-center py-12">
          <p class="text-red-600">Erreur lors du chargement des articles</p>
        </div>

        <div v-else-if="filteredArticles.length === 0" class="text-center py-12">
          <p class="text-gray-600">Aucun article trouvé</p>
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <article 
            v-for="article in filteredArticles" 
            :key="article.slug"
            class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
          >
            <!-- Image de l'article -->
            <div class="aspect-w-16 aspect-h-9">
              <img 
                v-if="article.image"
                :src="article.image" 
                :alt="article.title"
                class="w-full h-48 object-cover"
              >
              <div 
                v-else
                class="w-full h-48 bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center"
              >
                <svg class="w-12 h-12 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                </svg>
              </div>
            </div>

            <!-- Contenu de l'article -->
            <div class="p-6">
              <!-- Métadonnées -->
              <div class="flex items-center justify-between text-sm text-gray-500 mb-3">
                <span class="bg-amber-100 text-amber-800 px-2 py-1 rounded-full text-xs font-medium capitalize">
                  {{ article.category }}
                </span>
                <div class="flex items-center space-x-4">
                  <span>{{ formatDate(article.date) }}</span>
                  <span>{{ article.readingTime }} min</span>
                </div>
              </div>

              <!-- Titre -->
              <h2 class="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                {{ article.title }}
              </h2>

              <!-- Description -->
              <p class="text-gray-600 mb-4 line-clamp-3">
                {{ article.description }}
              </p>

              <!-- Lien vers l'article -->
              <NuxtLink 
                :to="`/blog/${article.slug}`"
                class="inline-flex items-center text-amber-600 hover:text-amber-700 font-medium"
              >
                Lire la suite
                <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                </svg>
              </NuxtLink>
            </div>
          </article>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
// Métadonnées de la page
useHead({
  title: 'Blog - Un Goût de Liberté',
  meta: [
    { name: 'description', content: 'Découvrez nos recettes, conseils et actualités autour de la pâtisserie artisanale' }
  ]
})

// État réactif
const selectedCategory = ref('all')

// Récupérer les articles depuis l'API publique
const { data: articlesData, pending, error } = await useFetch('/api/blog/articles', {
  default: () => ({ articles: [] })
})

const articles = computed(() => {
  console.log('Articles data:', articlesData.value)
  return articlesData.value?.articles || []
})

// Filtrer les articles publiés uniquement
const publishedArticles = computed(() => {
  const filtered = articles.value.filter(article => article.status === 'published')
  console.log('Published articles:', filtered)
  return filtered
})

// Obtenir les catégories uniques
const categories = computed(() => {
  const cats = [...new Set(publishedArticles.value.map(article => article.category))]
  return cats.filter(cat => cat && cat !== 'general')
})

// Filtrer les articles par catégorie
const filteredArticles = computed(() => {
  if (selectedCategory.value === 'all') {
    return publishedArticles.value
  }
  return publishedArticles.value.filter(article => article.category === selectedCategory.value)
})

// Formater la date
const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
