<template>
  <div>
    <!-- Article non trouvé -->
    <div v-if="error" class="min-h-screen flex items-center justify-center">
      <div class="text-center">
        <h1 class="text-4xl font-bold text-gray-900 mb-4">Article non trouvé</h1>
        <p class="text-gray-600 mb-8">L'article que vous cherchez n'existe pas ou a été supprimé.</p>
        <NuxtLink 
          to="/blog" 
          class="inline-flex items-center px-6 py-3 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors"
        >
          Retour au blog
        </NuxtLink>
      </div>
    </div>

    <!-- Chargement -->
    <div v-else-if="pending" class="min-h-screen flex items-center justify-center">
      <div class="text-center">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500"></div>
        <p class="mt-2 text-gray-600">Chargement de l'article...</p>
      </div>
    </div>

    <!-- Article -->
    <div v-else-if="article">
      <!-- Header de l'article -->
      <section class="bg-gradient-to-r from-amber-50 to-orange-50 py-16">
        <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <!-- Breadcrumb -->
          <nav class="mb-8">
            <ol class="flex items-center space-x-2 text-sm text-gray-600">
              <li><NuxtLink to="/" class="hover:text-amber-600">Accueil</NuxtLink></li>
              <li class="flex items-center">
                <svg class="w-4 h-4 mx-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"/>
                </svg>
                <NuxtLink to="/blog" class="hover:text-amber-600">Blog</NuxtLink>
              </li>
              <li class="flex items-center">
                <svg class="w-4 h-4 mx-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"/>
                </svg>
                <span class="text-gray-900">{{ article.title }}</span>
              </li>
            </ol>
          </nav>

          <!-- Métadonnées -->
          <div class="flex items-center space-x-4 text-sm text-gray-600 mb-6">
            <span class="bg-amber-100 text-amber-800 px-3 py-1 rounded-full font-medium capitalize">
              {{ article.category }}
            </span>
            <span>{{ formatDate(article.date) }}</span>
            <span>{{ article.readingTime }} min de lecture</span>
          </div>

          <!-- Titre -->
          <h1 class="text-4xl font-bold text-gray-900 mb-6">
            {{ article.title }}
          </h1>

          <!-- Description -->
          <p class="text-xl text-gray-600 leading-relaxed">
            {{ article.description }}
          </p>
        </div>
      </section>

      <!-- Image de l'article -->
      <section v-if="article.image" class="py-8">
        <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <img 
            :src="article.image" 
            :alt="article.title"
            class="w-full h-64 md:h-96 object-cover rounded-lg shadow-lg"
          >
        </div>
      </section>

      <!-- Contenu de l'article -->
      <section class="py-12">
        <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="prose prose-lg prose-amber max-w-none">
            <div v-html="articleContent"></div>
          </div>
        </div>
      </section>

      <!-- Navigation vers d'autres articles -->
      <section class="bg-gray-50 py-12">
        <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="text-center mb-8">
            <h2 class="text-2xl font-bold text-gray-900">Autres articles</h2>
          </div>
          
          <div class="flex justify-center">
            <NuxtLink 
              to="/blog" 
              class="inline-flex items-center px-6 py-3 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors"
            >
              Voir tous les articles
              <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
              </svg>
            </NuxtLink>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { marked } from 'marked'

// Récupérer le slug depuis la route
const route = useRoute()
const slug = route.params.slug

// Récupérer l'article depuis l'API
const { data: article, pending, error } = await useFetch(`/api/blog/articles/${slug}`, {
  server: true,
  default: () => null
})

// Métadonnées dynamiques de la page
if (article) {
  useHead({
    title: `${article.title} - Un Goût de Liberté`,
    meta: [
      { name: 'description', content: article.description },
      { property: 'og:title', content: article.title },
      { property: 'og:description', content: article.description },
      { property: 'og:image', content: article.image || '/logo.png' },
      { property: 'og:type', content: 'article' }
    ]
  })
}

// Convertir le markdown en HTML
const articleContent = computed(() => {
  if (!article?.content) return ''
  return marked(article.content)
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

// Redirection si l'article n'existe pas
if (!article && !pending) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Article non trouvé'
  })
}
</script>

<style scoped>
/* Styles pour le contenu markdown */
:deep(.prose) {
  @apply text-gray-800;
}

:deep(.prose h1) {
  @apply text-3xl font-bold text-gray-900 mt-8 mb-4;
}

:deep(.prose h2) {
  @apply text-2xl font-bold text-gray-900 mt-6 mb-3;
}

:deep(.prose h3) {
  @apply text-xl font-bold text-gray-900 mt-4 mb-2;
}

:deep(.prose p) {
  @apply mb-4 leading-relaxed;
}

:deep(.prose ul) {
  @apply list-disc list-inside mb-4;
}

:deep(.prose ol) {
  @apply list-decimal list-inside mb-4;
}

:deep(.prose li) {
  @apply mb-1;
}

:deep(.prose a) {
  @apply text-amber-600 hover:text-amber-700 underline;
}

:deep(.prose blockquote) {
  @apply border-l-4 border-amber-200 pl-4 italic text-gray-700 mb-4;
}

:deep(.prose code) {
  @apply bg-gray-100 px-2 py-1 rounded text-sm font-mono;
}

:deep(.prose pre) {
  @apply bg-gray-100 p-4 rounded overflow-x-auto mb-4;
}
</style>
