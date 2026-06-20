<template>
  <div>
    <cart/>

    <!-- Split Hero -->
    <section class="flex flex-col md:flex-row min-h-[85vh]">
      <div class="w-full md:w-[55%] bg-cream flex items-center justify-center px-6 md:px-12 lg:px-16 py-20 md:py-0">
        <div class="max-w-lg w-full">
          <span class="inline-block text-[0.65rem] tracking-[0.25em] uppercase text-sage font-body font-medium mb-6">
            Pâtisserie &amp; Biscuiterie artisanale
          </span>
          <h1 class="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl leading-[1.08] -tracking-[0.03em] text-espresso">
            <span class="block">Un Goût</span>
            <span class="block text-gold mt-1">de Liberté</span>
          </h1>
          <p class="mt-5 text-textbody/80 text-base sm:text-lg font-body max-w-md leading-relaxed">
            Artisan pâtissier à Chilhac, Haute-Loire. Confitures, biscuits, biscottes et gourmandises faits maison.
          </p>
          <div class="mt-8 flex flex-wrap gap-4">
            <a
              href="#products"
              class="inline-flex items-center px-6 py-3 bg-gold text-white text-sm font-body font-medium tracking-wide rounded-none hover:bg-gold-dark transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
            >
              Nos produits
              <svg class="ml-2 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </a>
            <a
              href="#about"
              class="inline-flex items-center px-6 py-3 border border-line text-espresso text-sm font-body font-medium tracking-wide rounded-none hover:border-espresso/30 transition-colors"
            >
              Notre histoire
            </a>
          </div>
        </div>
      </div>
      <div class="w-full md:w-[45%] min-h-[50vh] md:min-h-0 relative overflow-hidden">
        <img
          src="/images/hero.jpg"
          class="w-full h-full absolute inset-0 object-cover"
          alt="Pâtisserie artisanale"
          loading="eager"
        />
      </div>
    </section>

    <!-- Pull Quote -->
    <section class="bg-cream border-t border-line">
      <div class="max-w-3xl mx-auto px-6 py-20 md:py-28 text-center">
        <div class="w-8 h-px bg-gold/40 mx-auto mb-10"></div>
        <blockquote class="font-display text-2xl md:text-3xl lg:text-4xl leading-[1.3] text-espresso font-light italic">
          «&nbsp;Passionnée de pâtisserie depuis mon enfance, je concrétise aujourd'hui la réalisation d'un rêve en faisant le choix de vivre de ma passion.&nbsp;»
        </blockquote>
        <cite class="block mt-6 not-italic text-sm tracking-wide text-textbody font-body">
          — Justine DUMESNIL, artisan pâtissier
        </cite>
        <div class="w-8 h-px bg-gold/40 mx-auto mt-10"></div>
      </div>
    </section>

    <!-- Gallery Section -->
    <section class="bg-white border-t border-line">
      <div class="max-w-screen-xl mx-auto px-4 md:px-6 py-16 md:py-20">
        <div class="mb-10 text-center">
          <span class="inline-block text-[0.65rem] tracking-[0.25em] uppercase text-sage font-body font-medium mb-3">Notre savoir-faire</span>
          <h2 class="font-display text-3xl md:text-4xl text-espresso">Créations</h2>
          <p class="mt-3 text-textbody font-body max-w-md mx-auto">Quelques-unes de nos réalisations artisanales.</p>
        </div>
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <div
            v-for="(photo, idx) in galleryPhotos"
            :key="idx"
            class="overflow-hidden border border-line/40 hover:border-gold/40 transition-colors"
          >
            <img
              :src="'/images/creations/' + photo"
              :alt="'Création pâtissière — ' + (idx + 1)"
              class="w-full h-48 md:h-56 lg:h-64 object-cover hover:scale-105 transition-transform duration-700"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>

    <!-- Products Section -->
    <section id="products" class="mx-auto max-w-screen-xl px-4 md:px-6 py-16 md:py-20">
      <div class="mb-10 text-center">
        <span class="inline-block text-[0.65rem] tracking-[0.25em] uppercase text-sage font-body font-medium mb-3">Nos créations</span>
        <h2 class="font-display text-3xl md:text-4xl text-espresso">Nos produits</h2>
        <p class="mt-3 text-textbody font-body max-w-md mx-auto">Confitures, biscuits, biscottes, fruits au sirop, macarons, caramels et bien plus encore.</p>
      </div>

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
              class="w-full pl-10 pr-4 py-3 border border-line rounded-none text-espresso leading-tight focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/30 transition-all duration-200 placeholder-gray-400 font-body text-sm bg-white"
              placeholder="Rechercher un produit..."
              v-model="search"
              @input="debouncedSearch"
            />
            <div v-if="search" class="absolute inset-y-0 right-0 pr-3 flex items-center">
              <button
                @click="clearSearch"
                class="text-gray-400 hover:text-espresso transition-colors"
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

    <!-- About Section -->
    <section id="about" class="bg-cream">
      <div class="max-w-screen-xl mx-auto">
        <div class="grid grid-cols-1 md:grid-cols-2">
          <div class="relative overflow-hidden min-h-[300px] md:min-h-[500px]">
            <img
              src="/images/about.jpg"
              class="w-full h-full object-cover"
              alt="Création pâtissière artisanale"
              loading="lazy"
            />
          </div>
          <div class="flex items-center justify-center p-8 md:p-12 lg:p-16">
            <div class="max-w-lg">
              <span class="inline-block text-[0.65rem] tracking-[0.25em] uppercase text-sage font-body font-medium mb-3">Notre histoire</span>
              <h2 class="font-display text-3xl md:text-4xl text-espresso mb-6">Qui suis-je ?</h2>
              <div class="prose prose-gray max-w-none font-body text-sm leading-relaxed">
                <ContentDoc path="/about" />
              </div>
            </div>
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
        v-show="showCartButton && !store.isOpen && !cartClosing"
        type="button"
        @click="openCart"
        class="fixed bottom-6 right-6 z-50 p-4 bg-gold hover:bg-gold-dark text-white font-medium rounded-full shadow-lg hover:shadow-xl focus:shadow-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 active:scale-95 transition-all duration-200"
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
              class="absolute -top-2 -right-2 inline-flex justify-center items-center w-6 h-6 text-xs font-bold text-white bg-red-500 rounded-full border-2 border-white"
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
  import { ShoppingBagIcon } from 'heroicons-vue3/outline'
  import { useStore } from '~/store/cart'


  const nuxtApp = useNuxtApp()

  const store = useStore()
  await store.load()

  const openCart = store.open
  let search = ref("")
  let searchLoading = ref(false)
  let showCartButton = ref(false)
  const cartClosing = ref(false)

  watch(() => store.isOpen, (isOpen) => {
    if (!isOpen) {
      cartClosing.value = true
      setTimeout(() => { cartClosing.value = false }, 700)
    }
  })

  const galleryPhotos = ref([])

  onMounted(async () => {
    try {
      const data = await $fetch('/api/gallery')
      if (data?.images?.length) {
        galleryPhotos.value = data.images.map((img) => img.filename)
      }
    } catch {
      // fallback silencieux — la galerie reste vide
    }
  })

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

  const title = ref('Un Goût de Liberté')
  const description = ref('Découvrez notre pâtisserie artisanale à Chilhac (43380). Confitures maison, biscuits traditionnels, biscottes et produits d\'apéritif. Livraison disponible !')

  // Données structurées pour les produits
  const productsStructuredData = computed(() => {
    const products = store.products || []

    if (!products.length) {
      return {}
    }

    const itemListElements = products
      .filter(product => product.active !== false && product.prices?.length > 0)
      .map((product, index) => {
        const priceValidUntil = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]

        const offers = product.prices?.map(price => ({
          "@type": "Offer",
          "price": (price.unit_amount / 100).toFixed(2),
          "priceCurrency": "EUR",
          "priceValidUntil": priceValidUntil,
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
            "offerCount": offers.length,
            "lowPrice": Math.min(...offers.map(o => parseFloat(o.price))).toFixed(2),
            "highPrice": Math.max(...offers.map(o => parseFloat(o.price))).toFixed(2),
            "priceCurrency": "EUR"
          } : offers[0],
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
    titleTemplate: '%s',
    meta: [
      { name: 'description', content: description },
      { name: 'keywords', content: 'pâtisserie artisanale, biscuiterie, CHILHAC, Haute-Loire, confiture, biscuits, biscottes, fait maison, Justine DUMESNIL' },
      { property: 'og:title', content: title },
      { property: 'og:description', content: 'Pâtisserie artisanale à Chilhac. Confitures, biscuits et gourmandises faits maison avec amour.' },
      { property: 'og:type', content: 'website' },
      { property: 'og:url', content: 'https://un-gout-de-liberte.fr' },
      { property: 'og:image', content: 'https://un-gout-de-liberte.fr/images/hero.jpg' },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: title },
      { name: 'twitter:description', content: 'Pâtisserie artisanale à Chilhac. Confitures, biscuits et gourmandises faits maison.' },
      { name: 'twitter:image', content: 'https://un-gout-de-liberte.fr/images/hero.jpg' }
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

useSeoMeta({
  title: 'Un Goût de Liberté',
  description: 'Découvrez notre pâtisserie artisanale à Chilhac (43380). Confitures maison, biscuits traditionnels, biscottes et produits d\'apéritif. Livraison disponible dans toute la France !',
  ogTitle: 'Un Goût de Liberté - Pâtisserie Artisanale à Chilhac',
  ogDescription: 'Pâtisserie artisanale à Chilhac. Confitures, biscuits et gourmandises faits maison avec amour par Justine DUMESNIL.',
  ogUrl: 'https://un-gout-de-liberte.fr',
  ogImage: 'https://un-gout-de-liberte.fr/images/hero.jpg',
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
