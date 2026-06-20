<template>
  <div>
    <div v-if="error" class="min-h-screen bg-cream flex items-center justify-center">
      <div class="text-center max-w-lg mx-auto px-4">
        <h1 class="text-4xl font-bold text-espresso mb-4 font-display">Article non trouvé</h1>
        <p class="text-textbody mb-8">L'article que vous cherchez n'existe pas ou a été supprimé.</p>
        <NuxtLink
          to="/blog"
          class="inline-flex items-center px-6 py-3 bg-gold text-white rounded-lg hover:bg-gold-dark transition-colors"
        >
          Retour au blog
        </NuxtLink>
      </div>
    </div>

    <div v-else-if="pending" class="min-h-screen bg-cream flex items-center justify-center">
      <div class="text-center">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gold"></div>
        <p class="mt-2 text-textbody">Chargement de l'article...</p>
      </div>
    </div>

    <div v-else-if="article">
      <section class="bg-cream py-16">
        <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav class="mb-8">
            <ol class="flex items-center space-x-2 text-sm text-textbody">
              <li><NuxtLink to="/" class="hover:text-gold transition-colors">Accueil</NuxtLink></li>
              <li class="flex items-center">
                <svg class="w-4 h-4 mx-2 text-line" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"/>
                </svg>
                <NuxtLink to="/blog" class="hover:text-gold transition-colors">Blog</NuxtLink>
              </li>
              <li class="flex items-center">
                <svg class="w-4 h-4 mx-2 text-line" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"/>
                </svg>
                <span class="text-espresso font-medium">{{ article.title }}</span>
              </li>
            </ol>
          </nav>

          <div class="flex items-center gap-4 text-sm text-textbody mb-6">
            <span class="bg-gold/10 text-gold px-3 py-1 rounded-full font-medium capitalize">{{ article.category }}</span>
            <span>{{ formatDate(article.date) }}</span>
            <span>{{ article.readingTime }} min de lecture</span>
          </div>

          <h1 class="text-4xl font-bold text-espresso mb-6 font-display">{{ article.title }}</h1>

          <p class="text-xl text-textbody leading-relaxed">{{ article.description }}</p>
        </div>
      </section>

      <section v-if="article.image" class="py-8">
        <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <nuxt-img
            :src="article.image"
            :alt="article.title"
            class="w-full h-64 md:h-96 object-cover rounded-lg shadow-lg"
            loading="lazy"
          />
        </div>
      </section>

      <section class="py-12">
        <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="prose prose-lg max-w-none" v-html="articleContent"></div>
        </div>
      </section>

      <section class="bg-cream py-12">
        <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="text-center mb-8">
            <h2 class="text-2xl font-bold text-espresso mb-8 font-display">Autres articles</h2>
          </div>

          <div class="flex justify-center">
            <NuxtLink
              to="/blog"
              class="inline-flex items-center px-6 py-3 bg-gold text-white rounded-lg hover:bg-gold-dark transition-colors"
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

const route = useRoute()

const { data: article, pending, error } = await useFetch(`/api/blog/articles/${route.params.slug}`, {
  server: true,
  default: () => null
})

const pageTitle = computed(() => article.value?.title ? `${article.value.title} - Un Goût de Liberté` : 'Blog')
const pageDesc = computed(() => article.value?.description || '')
const pageImage = computed(() => article.value?.image || '/logo.png')
const canonicalUrl = computed(() => article.value?.slug ? `https://un-gout-de-liberte.fr/blog/${article.value.slug}` : 'https://un-gout-de-liberte.fr/blog')
const jsonLd = computed(() => {
  if (!article.value) return []
  return [{
    type: 'application/ld+json',
    innerHTML: JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: article.value.title,
      description: article.value.description,
      image: article.value.image,
      datePublished: article.value.date,
      author: { '@type': 'Person', 'name': 'Justine DUMESNIL' },
      publisher: {
        '@type': 'Organization',
        'name': 'Un Goût de Liberté',
        'logo': { '@type': 'ImageObject', 'url': 'https://un-gout-de-liberte.fr/logo.png' }
      },
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': `https://un-gout-de-liberte.fr/blog/${article.value.slug}`
      }
    })
  }]
})

useHead({
  title: pageTitle,
  meta: [
    { name: 'description', content: pageDesc },
    { property: 'og:title', content: pageTitle },
    { property: 'og:description', content: pageDesc },
    { property: 'og:image', content: pageImage },
    { property: 'og:type', content: 'article' }
  ],
  link: [
    { rel: 'canonical', href: canonicalUrl }
  ],
  script: jsonLd
})

function sanitizeHtml(html) {
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/on\w+\s*=\s*"[^"]*"/gi, '')
    .replace(/on\w+\s*=\s*'[^']*'/gi, '')
    .replace(/href\s*=\s*"javascript:[^"]*"/gi, 'href="#"')
    .replace(/href\s*=\s*'javascript:[^']*'/gi, "href='#'")
}

function parseMarkdownBasic(content) {
  if (!content) return ''
  return content
    .split('\n\n')
    .map(paragraph => {
      if (paragraph.startsWith('# ')) return `<h1>${paragraph.substring(2)}</h1>`
      if (paragraph.startsWith('## ')) return `<h2>${paragraph.substring(3)}</h2>`
      if (paragraph.startsWith('### ')) return `<h3>${paragraph.substring(4)}</h3>`
      if (paragraph.includes('\n- ')) {
        const items = paragraph.split('\n- ').filter(item => item.trim())
        const listItems = items.map(item => `<li>${item.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>').replace(/\*(.+?)\*/g, '<em>$1</em>')}</li>`).join('')
        return `<ul>${listItems}</ul>`
      }
      if (paragraph.trim()) {
        const formatted = paragraph
          .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
          .replace(/\*(.+?)\*/g, '<em>$1</em>')
          .replace(/---/g, '<hr>')
        return `<p>${formatted}</p>`
      }
      return ''
    })
    .filter(block => block)
    .join('')
}

const articleContent = computed(() => {
  if (!article.value?.content) return ''
  try {
    const html = marked.parse(article.value.content)
    return sanitizeHtml(html)
  } catch {
    return sanitizeHtml(parseMarkdownBasic(article.value.content))
  }
})

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
:deep(.prose) {
  @apply text-textbody;
}
:deep(.prose h1) {
  @apply text-3xl font-bold text-espresso mt-8 mb-4 font-display;
}
:deep(.prose h2) {
  @apply text-2xl font-bold text-espresso mt-6 mb-3 font-display;
}
:deep(.prose h3) {
  @apply text-xl font-bold text-espresso mt-4 mb-2;
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
  @apply text-gold hover:text-gold-dark underline;
}
:deep(.prose blockquote) {
  @apply border-l-4 border-line pl-4 italic text-textbody mb-4;
}
:deep(.prose code) {
  @apply bg-cream px-2 py-1 rounded text-sm font-mono text-espresso;
}
:deep(.prose pre) {
  @apply bg-cream p-4 rounded overflow-x-auto mb-4;
}
:deep(.prose hr) {
  @apply border-line my-8;
}
:deep(.prose img) {
  @apply rounded-lg shadow-md;
}
</style>
