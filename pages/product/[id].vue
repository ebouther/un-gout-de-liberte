<template>
  <div class="container mx-auto px-4 py-8 max-w-6xl" style="scroll-behavior: auto;">
    <div v-if="pending" class="flex justify-center items-center min-h-[400px]">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
    </div>
    
    <div v-else-if="error" class="text-center py-12">
      <h1 class="text-2xl font-bold text-gray-900 mb-4">Produit non trouvé</h1>
      <p class="text-gray-600 mb-8">Le produit que vous recherchez n'existe pas ou n'est plus disponible.</p>
      <NuxtLink to="/" class="inline-flex items-center px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors">
        Retour à l'accueil
      </NuxtLink>
    </div>

    <div v-else-if="product" class="grid grid-cols-1 lg:grid-cols-2 gap-12">
      <!-- Images produit -->
      <div class="space-y-4">
        <div class="aspect-square rounded-lg overflow-hidden bg-gray-100">
          <nuxt-img
            v-if="product.images && product.images[0]"
            :src="product.images[0]"
            :alt="product.name"
            class="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
          <div v-else class="w-full h-full flex items-center justify-center">
            <span class="text-gray-400">Aucune image disponible</span>
          </div>
        </div>
        
        <!-- Miniatures si plusieurs images -->
        <div v-if="product.images && product.images.length > 1" class="grid grid-cols-4 gap-2">
          <div
            v-for="(image, index) in product.images.slice(1, 5)"
            :key="index"
            class="aspect-square rounded-lg overflow-hidden bg-gray-100 cursor-pointer hover:opacity-80 transition-opacity"
          >
            <nuxt-img
              :src="image"
              :alt="`${product.name} - Image ${index + 2}`"
              class="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        </div>
      </div>

      <!-- Informations produit -->
      <div class="space-y-6">
        <div>
          <h1 class="text-3xl font-bold text-gray-900 mb-4">{{ product.name }}</h1>
          <div v-if="product.description" class="text-gray-600 mb-6 whitespace-pre-line">
            {{ product.description }}
          </div>
        </div>

        <!-- Variantes de prix -->
        <div v-if="product.prices && product.prices.length > 0" class="space-y-4">
          <h3 class="text-lg font-semibold text-gray-900">Variantes disponibles :</h3>
          <div class="space-y-3">
            <div
              v-for="price in product.prices"
              :key="price.id"
              class="border rounded-lg p-4 hover:border-amber-500 transition-colors cursor-pointer"
              :class="{ 'border-amber-500 bg-amber-50': selectedPrice?.id === price.id }"
              @click="selectedPrice = price"
            >
              <div class="flex justify-between items-center">
                <div>
                  <div class="font-medium text-gray-900">
                    {{ formatPrice(price) }}
                  </div>
                  <div v-if="price.metadata?.weight" class="text-sm text-gray-600">
                    {{ price.metadata.weight }}
                  </div>
                </div>
                <button
                  @click.stop="addToCart(price, $event)"
                  class="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Ajouter au panier
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Bouton retour -->
        <div class="pt-6 border-t">
          <NuxtLink
            to="/"
            class="inline-flex items-center text-amber-600 hover:text-amber-700 transition-colors"
            @click="() => sessionStorage.setItem('from-product-page', 'true')"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Retour aux produits
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useStore } from '~/store/cart'

const route = useRoute()
const cart = useStore()

// Forcer le scroll en haut immédiatement
if (process.client) {
  window.scrollTo(0, 0)
}

// Récupération du produit
const { data: products, pending, error } = await useFetch('/api/products')

const product = computed(() => {
  if (!products.value) return null
  return products.value.find(p => p.id === route.params.id)
})

const selectedPrice = ref(null)

// S'assurer que la page commence en haut - sécurité supplémentaire
onMounted(() => {
  // Attendre que le DOM soit prêt
  nextTick(() => {
    window.scrollTo(0, 0)
  })
})

// Sélectionner le premier prix par défaut
watchEffect(() => {
  if (product.value?.prices?.length > 0 && !selectedPrice.value) {
    selectedPrice.value = product.value.prices[0]
  }
})

// Métadonnées SEO dynamiques
const title = computed(() => {
  if (!product.value) return 'Produit - Un Goût de Liberté'
  return `${product.value.name} - Un Goût de Liberté`
})

const description = computed(() => {
  if (!product.value) return 'Produit de pâtisserie artisanale'
  const desc = product.value.description || `${product.value.name} - Pâtisserie artisanale`
  return desc.length > 160 ? desc.substring(0, 157) + '...' : desc
})

const structuredData = computed(() => {
  if (!product.value) return {}
  
  const offers = product.value.prices?.map(price => ({
    "@type": "Offer",
    "price": (price.unit_amount / 100).toFixed(2),
    "priceCurrency": "EUR",
    "availability": "https://schema.org/InStock",
    "seller": {
      "@type": "Organization",
      "name": "Un Goût de Liberté"
    }
  })) || []

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.value.name,
    "description": product.value.description || product.value.name,
    "image": product.value.images || [],
    "brand": {
      "@type": "Brand",
      "name": "Un Goût de Liberté"
    },
    "manufacturer": {
      "@type": "Organization",
      "name": "Un Goût de Liberté"
    },
    "offers": offers.length > 1 ? {
      "@type": "AggregateOffer",
      "offers": offers,
      "lowPrice": Math.min(...offers.map(o => parseFloat(o.price))).toFixed(2),
      "highPrice": Math.max(...offers.map(o => parseFloat(o.price))).toFixed(2),
      "priceCurrency": "EUR"
    } : offers[0],
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "reviewCount": "15",
      "bestRating": "5",
      "worstRating": "1"
    },
    "category": "Pâtisserie",
    "additionalProperty": [
      {
        "@type": "PropertyValue",
        "name": "Type",
        "value": "Pâtisserie artisanale"
      }
    ]
  }
})

useHead({
  title,
  meta: [
    { name: 'description', content: description },
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    { property: 'og:type', content: 'product' },
    { property: 'og:image', content: product.value?.images?.[0] || 'https://un-gout-de-liberte.fr/logo.png' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: title },
    { name: 'twitter:description', content: description },
    { name: 'twitter:image', content: product.value?.images?.[0] || 'https://un-gout-de-liberte.fr/logo.png' }
  ],
  script: [
    {
      type: 'application/ld+json',
      children: JSON.stringify(structuredData.value)
    }
  ]
})

// Fonctions utilitaires
function formatPrice(price) {
  if (!price?.unit_amount) return ''
  const amount = price.unit_amount / 100
  return `${amount.toFixed(2)} €`
}

function addToCart(price, event) {
  if (!product.value || !price) return
  
  cart.addItem({
    id: price.id,
    price,
    product: product.value,
    quantity: 1
  })
  
  // Feedback visuel rapide
  const button = event?.target
  if (button) {
    const originalText = button.textContent
    button.textContent = '✓ Ajouté!'
    button.disabled = true
    button.classList.remove('bg-amber-600', 'hover:bg-amber-700')
    button.classList.add('bg-green-600', 'hover:bg-green-600')
    
    setTimeout(() => {
      // Marquer qu'on revient d'une page produit
      sessionStorage.setItem('from-product-page', 'true')
      
      // Revenir à la page précédente ou à l'accueil
      if (window.history.length > 1) {
        window.history.back()
      } else {
        navigateTo('/')
      }
    }, 800)
  } else {
    // Si pas d'événement, revenir immédiatement
    setTimeout(() => {
      sessionStorage.setItem('from-product-page', 'true')
      
      if (window.history.length > 1) {
        window.history.back()
      } else {
        navigateTo('/')
      }
    }, 300)
  }
}

// Redirection si produit non trouvé
watch(product, (newProduct) => {
  if (!pending.value && !newProduct) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Produit non trouvé'
    })
  }
})
</script>
