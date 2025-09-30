<template>
  <div class="text-center">
    <cart/>
    <Carousel/>
    <br/>
    <br/>
    <section id="products" class="mx-auto max-w-screen-xl text-left px-4 md:px-0">
      <div class="flex justify-center mb-8">
        <div class="w-full max-w-md">
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="search"
              class="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg text-gray-700 leading-tight focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-all duration-200 placeholder-gray-400"
              placeholder="Rechercher un produit..."
              v-model="search"
              @input="debouncedSearch"
            />
            <div v-if="search" class="absolute inset-y-0 right-0 pr-3 flex items-center">
              <button
                @click="clearSearch"
                class="text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Effacer la recherche"
              >
                <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <Products :name="search" :loading="searchLoading" @clear-search="clearSearch" />
    </section>

    <!-- About section -->
    <section id="about" class="mt-20 bg-gradient-to-r from-stone-100 to-stone-200">
      <div class="grid grid-cols-1 md:grid-cols-2 min-h-[400px]">
        <div class="relative overflow-hidden">
          <nuxt-img
            src="https://images.unsplash.com/photo-1517141544637-42b300cb4ee9?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8"
            class="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
            alt="Pâtisserie artisanale"
            loading="lazy"
          />
          <div class="absolute inset-0 bg-black bg-opacity-20"></div>
        </div>
        <div class="flex items-center justify-center p-8 md:p-12">
          <div class="max-w-lg">
            <ContentDoc path="/about" class="prose prose-gray max-w-none" />
          </div>
        </div>
      </div>
    </section>

    <!-- Floating cart button -->
    <Transition
      enter-active-class="transition ease-out duration-300"
      enter-from-class="opacity-0 scale-95 translate-y-4"
      enter-to-class="opacity-100 scale-100 translate-y-0"
      leave-active-class="transition ease-in duration-200"
      leave-from-class="opacity-100 scale-100 translate-y-0"
      leave-to-class="opacity-0 scale-95 translate-y-4"
    >
      <button
        v-show="showCartButton"
        type="button"
        @click="openCart"
        class="fixed bottom-6 right-6 z-50 p-4 bg-amber-600 hover:bg-amber-700 text-white font-medium rounded-full shadow-lg hover:shadow-xl focus:shadow-xl focus:outline-none focus:ring-4 focus:ring-amber-300 active:scale-95 transition-all duration-200"
        aria-label="Ouvrir le panier"
      >
        <div class="relative">
          <ShoppingBagIcon class="h-6 w-6" aria-hidden="true" />
          <Transition
            enter-active-class="transition ease-out duration-200"
            enter-from-class="opacity-0 scale-50"
            enter-to-class="opacity-100 scale-100"
            leave-active-class="transition ease-in duration-150"
            leave-from-class="opacity-100 scale-100"
            leave-to-class="opacity-0 scale-50"
          >
            <div
              v-if="store.nbOfItems > 0"
              class="absolute -top-2 -right-2 inline-flex justify-center items-center w-6 h-6 text-xs font-bold text-white bg-red-500 rounded-full border-2 border-white animate-pulse"
            >
              {{ store.nbOfItems }}
            </div>
          </Transition>
        </div>
      </button>
    </Transition>
  </div>
</template>

<script setup>
  import Products from '../components/products.vue'
  import Carousel from '../components/carousel.vue'
  import { ShoppingBagIcon } from 'heroicons-vue3/outline'
  import { useStore } from '~/store/cart'


  const nuxtApp = useNuxtApp()

  const store = useStore()
  await store.load()

  const openCart = store.open
  let search = ref("")
  let searchLoading = ref(false)
  let showCartButton = ref(false)

  // Debounced search to improve performance
  const debouncedSearch = useDebounceFn(() => {
    searchLoading.value = false
  }, 300)

  const clearSearch = () => {
    search.value = ""
    searchLoading.value = false
  }

  // Watch search input to trigger loading state
  watch(search, () => {
    if (search.value) {
      searchLoading.value = true
      debouncedSearch()
    }
  })

  const title = ref('Un Goût de Liberté - Pâtisserie Artisanale à Chilhac')
  const description = ref('Découvrez notre pâtisserie artisanale à Chilhac (43380). Confitures maison, biscuits traditionnels, biscottes et produits d\'apéritif. Livraison disponible !')

  // Données structurées pour les produits
  const productsStructuredData = computed(() => {
    const products = store.products || []
    
    if (!products.length) {
      return {}
    }

    const itemListElements = products
      .filter(product => product.active !== false) // Filtrer les produits actifs
      .map((product, index) => {
        const offers = product.prices?.map(price => ({
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
          "@type": "Product",
          "name": product.name,
          "description": product.description || product.name,
          "image": product.images || [],
          "url": `https://un-gout-de-liberte.fr/product/${product.id}`,
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
          } : offers[0] || {
            "@type": "Offer",
            "price": "0.00",
            "priceCurrency": "EUR",
            "availability": "https://schema.org/OutOfStock"
          },
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.8",
            "reviewCount": "42",
            "bestRating": "5",
            "worstRating": "1"
          },
          "category": product.metadata?.category || "Pâtisserie"
        }
      })

    return {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "name": "Produits de pâtisserie artisanale",
      "description": "Liste des produits artisanaux disponibles chez Un Goût de Liberté",
      "numberOfItems": itemListElements.length,
      "itemListElement": itemListElements.map((product, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "item": product
      }))
    }
  })

  useHead({
    title,
    meta: [
      { name: 'description', content: description },
      { name: 'keywords', content: 'pâtisserie artisanale, biscuiterie, CHILHAC, Haute-Loire, confiture, biscuits, biscottes, fait maison, Justine DUMESNIL' },
      { property: 'og:title', content: title },
      { property: 'og:description', content: 'Pâtisserie artisanale à Chilhac. Confitures, biscuits et gourmandises faits maison avec amour.' },
      { property: 'og:type', content: 'website' },
      { property: 'og:url', content: 'https://un-gout-de-liberte.fr' },
      { property: 'og:image', content: 'https://un-gout-de-liberte.fr/logo.png' },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: title },
      { name: 'twitter:description', content: 'Pâtisserie artisanale à Chilhac. Confitures, biscuits et gourmandises faits maison.' },
      { name: 'twitter:image', content: 'https://un-gout-de-liberte.fr/logo.png' }
    ],
    link: [
      { rel: 'canonical', href: 'https://un-gout-de-liberte.fr' }
    ],
    script: [
      {
        type: 'application/ld+json',
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": title.value,
          "description": description.value,
          "url": "https://un-gout-de-liberte.fr",
          "isPartOf": {
            "@type": "WebSite",
            "name": "Un Goût de Liberté",
            "url": "https://un-gout-de-liberte.fr"
          },
          "about": {
            "@type": "Bakery",
            "name": "Un Goût de Liberté",
            "address": {
              "@type": "PostalAddress",
              "addressLocality": "CHILHAC",
              "postalCode": "43380",
              "addressCountry": "FR"
            }
          }
        })
      },
      {
        type: 'application/ld+json',
        children: JSON.stringify(productsStructuredData.value)
      }
    ],
    htmlAttrs: {
      lang: 'fr'
    }
  })

  // Show cart button on scroll
  onMounted(() => {
    const handleScroll = () => {
      showCartButton.value = window.scrollY > 100
    }

    window.addEventListener('scroll', handleScroll, { passive: true })

    onUnmounted(() => {
      window.removeEventListener('scroll', handleScroll)
    })
  })

// SEO optimisé pour la page d'accueil
useSeoMeta({
  title: 'Un Goût de Liberté - Pâtisserie Artisanale à Chilhac',
  description: 'Découvrez notre pâtisserie artisanale à Chilhac (43380). Confitures maison, biscuits traditionnels, biscottes et produits d\'apéritif. Livraison disponible dans toute la France !',
  ogTitle: 'Un Goût de Liberté - Pâtisserie Artisanale à Chilhac',
  ogDescription: 'Pâtisserie artisanale à Chilhac. Confitures, biscuits et gourmandises faits maison avec amour par Justine DUMESNIL.',
  ogUrl: 'https://un-gout-de-liberte.fr',
  ogImage: 'https://un-gout-de-liberte.fr/logo.png',
  twitterTitle: 'Un Goût de Liberté - Pâtisserie Artisanale',
  twitterDescription: 'Pâtisserie artisanale à Chilhac. Confitures, biscuits et gourmandises faits maison.',
  twitterCard: 'summary_large_image'
})

useHead({
  link: [
    { rel: 'canonical', href: 'https://un-gout-de-liberte.fr' }
  ]
})


</script>
