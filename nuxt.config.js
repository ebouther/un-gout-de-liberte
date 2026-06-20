import { config } from 'dotenv'
config()

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-24',
  ssr: true,
  target: 'server',
  devtools: { enabled: true },

  app: {
    head: {
      title: 'Un Goût de Liberté - Pâtisserie Artisanale à Chilhac',
      titleTemplate: '%s | Un Goût de Liberté',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Pâtisserie artisanale à Chilhac (43380). Confitures maison, biscuits traditionnels, biscottes et produits d\'apéritif. Commandez en ligne !' },
        { name: 'keywords', content: 'pâtisserie, artisanal, Chilhac, confiture, biscuits, biscottes, Haute-Loire, fait maison, Justine DUMESNIL' },
        { name: 'author', content: 'Un Goût de Liberté - Justine DUMESNIL' },
        { name: 'robots', content: 'index, follow' },
        { name: 'googlebot', content: 'index, follow' },
        { name: 'language', content: 'French' },
        { name: 'geo.region', content: 'FR-43' },
        { name: 'geo.placename', content: 'CHILHAC' },
        { name: 'geo.position', content: '45.1167;3.4333' },
        { name: 'ICBM', content: '45.1167, 3.4333' },

        // Open Graph (Facebook, WhatsApp)
        { property: 'og:type', content: 'business.business' },
        { property: 'og:title', content: 'Un Goût de Liberté - Pâtisserie Artisanale à Chilhac' },
        { property: 'og:description', content: 'Pâtisserie artisanale à Chilhac. Confitures, biscuits et gourmandises faits maison avec amour.' },
        { property: 'og:url', content: 'https://un-gout-de-liberte.fr' },
        { property: 'og:site_name', content: 'Un Goût de Liberté' },
        { property: 'og:image', content: 'https://un-gout-de-liberte.fr/logo.png' },
        { property: 'og:image:width', content: '1200' },
        { property: 'og:image:height', content: '630' },
        { property: 'og:locale', content: 'fr_FR' },
        { property: 'business:contact_data:street_address', content: '43380 CHILHAC' },
        { property: 'business:contact_data:locality', content: 'CHILHAC' },
        { property: 'business:contact_data:region', content: 'Haute-Loire' },
        { property: 'business:contact_data:postal_code', content: '43380' },
        { property: 'business:contact_data:country_name', content: 'France' },

        // Twitter Card
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: 'Un Goût de Liberté - Pâtisserie Artisanale' },
        { name: 'twitter:description', content: 'Pâtisserie artisanale à Chilhac. Confitures, biscuits et gourmandises faits maison.' },
        { name: 'twitter:image', content: 'https://un-gout-de-liberte.fr/logo.png' }
      ], link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'canonical', href: 'https://un-gout-de-liberte.fr' },
        { rel: 'manifest', href: '/manifest.json' },
        { rel: 'apple-touch-icon', href: '/logo.png' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: true },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300..900;1,9..144,300..900&family=Sora:wght@300..700&display=swap' }
      ],
      script: [
        {
          type: 'application/ld+json',
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Bakery",
            "name": "Un Goût de Liberté",
            "description": "Pâtisserie & Biscuiterie artisanale à CHILHAC",
            "url": "https://un-gout-de-liberte.fr",
            "logo": "https://un-gout-de-liberte.fr/logo.png",
            "image": "https://un-gout-de-liberte.fr/logo.png",
            "address": {
              "@type": "PostalAddress",
              "streetAddress": "Le Bourg",
              "addressLocality": "CHILHAC",
              "postalCode": "43380",
              "addressRegion": "Haute-Loire",
              "addressCountry": "FR"
            },
            "telephone": "+33-6-50-71-66-01",
            "email": "ungoutdeliberte@protonmail.com",
            "geo": {
              "@type": "GeoCoordinates",
              "latitude": 45.1167,
              "longitude": 3.4333
            },
            "priceRange": "€€",
            "servesCuisine": "French",
            "founder": {
              "@type": "Person",
              "name": "Justine DUMESNIL"
            },
            "areaServed": {
              "@type": "Place",
              "name": "Haute-Loire, Auvergne-Rhône-Alpes"
            },
            "hasOfferCatalog": {
              "@type": "OfferCatalog",
              "name": "Produits de pâtisserie",
              "itemListElement": [
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Product",
                    "name": "Pâtisseries artisanales",
                    "offers": {
                      "@type": "AggregateOffer",
                      "priceCurrency": "EUR",
                      "lowPrice": "2.90",
                      "highPrice": "6.50",
                      "offerCount": "25",
                      "availability": "https://schema.org/InStock",
                      "url": "https://un-gout-de-liberte.fr"
                    }
                  }
                },
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Product",
                    "name": "Biscuiterie artisanale",
                    "offers": {
                      "@type": "AggregateOffer",
                      "priceCurrency": "EUR",
                      "lowPrice": "2.90",
                      "highPrice": "6.45",
                      "offerCount": "21",
                      "availability": "https://schema.org/InStock",
                      "url": "https://un-gout-de-liberte.fr"
                    }
                  }
                }
              ]
            },
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.8",
              "reviewCount": "54",
              "bestRating": "5",
              "worstRating": "1"
            },
            "openingHoursSpecification": [
              {
                "@type": "OpeningHoursSpecification",
                "dayOfWeek": ["Saturday", "Wednesday"],
                "opens": "14:00",
                "closes": "17:00"
              },
              {
                "@type": "OpeningHoursSpecification",
                "dayOfWeek": ["Tuesday", "Thursday", "Friday"],
                "opens": "11:00",
                "closes": "12:30"
              },
              {
                "@type": "OpeningHoursSpecification",
                "dayOfWeek": ["Tuesday", "Thursday", "Friday"],
                "opens": "14:00",
                "closes": "17:00"
              }
            ],
            "paymentAccepted": "Cash, Credit Card",
            "currenciesAccepted": "EUR"
          })
        }
      ]
    }
  },

  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    '@nuxt/image-edge',
    '@nuxtjs/robots',
    '@nuxt/content',
    '@vueuse/nuxt',
    '@nuxtjs/sitemap'
  ],

  runtimeConfig: {
    // Variables côté serveur uniquement
    stripeSecretKey: process.env.STRIPE_SK,
    adminPassword: process.env.ADMIN_PASSWORD,
    jwtSecret: process.env.JWT_SECRET,
    githubToken: process.env.GITHUB_TOKEN,
    githubRepo: process.env.GITHUB_REPO || 'ebouther/un-gout-de-liberte',
    githubBranch: process.env.GITHUB_BRANCH || 'develop',
    public: {
      // Variables accessibles côté client
      stripePk: process.env.STRIPE_PK,
      hostname: process.env.HOST || 'https://un-gout-de-liberte.fr'
    }
  },

  env: {
    STRIPE_PK: process.env.STRIPE_PK,
    hostname: process.env.HOST || 'https://un-gout-de-liberte.fr'
  },
  /*
  ** Build configuration
  ** See https://nuxtjs.org/api/configuration-build/
  */
  build: {
    postcss: {
      postcssOptions: {
        plugins: {
          tailwindcss: {},
          autoprefixer: {},
        },
      },
    },
  },
  robots: {
    UserAgent: '*',
    Disallow: '/admin',
    Allow: '/',
    Sitemap: 'https://un-gout-de-liberte.fr/sitemap.xml'
  },
  sitemap: {
    hostname: 'https://un-gout-de-liberte.fr',
    gzip: true,
    routes: async () => {
      // Routes statiques importantes avec priorités
      const staticRoutes = [
        {
          url: '/',
          changefreq: 'weekly',
          priority: 1.0,
          lastmod: new Date().toISOString()
        },
        {
          url: '/contact',
          changefreq: 'monthly',
          priority: 0.8,
          lastmod: new Date().toISOString()
        },
        {
          url: '/cgv',
          changefreq: 'yearly',
          priority: 0.3,
          lastmod: new Date().toISOString()
        }
      ]

      // Routes dynamiques des produits
      let routes = [...staticRoutes]

      try {
        const Stripe = (await import('stripe')).default
        const stripe = new Stripe(process.env.STRIPE_SK)

        const { data: products } = await stripe.products.list({
          active: true,
          limit: 100
        })

        const productRoutes = products.map(product => ({
          url: `/product/${product.id}`,
          changefreq: 'weekly',
          priority: 0.7,
          lastmod: new Date(product.updated * 1000 || product.created * 1000 || Date.now()).toISOString()
        }))

        routes = [...routes, ...productRoutes]
      } catch {
        // Products unavailable during build
      }

      // Routes dynamiques des articles de blog
      try {
        const githubToken = process.env.GITHUB_TOKEN
        const githubRepo = process.env.GITHUB_REPO || 'ebouther/un-gout-de-liberte'
        const branch = process.env.GITHUB_BRANCH || 'develop'

        if (githubToken && githubRepo) {
          const articles = await $fetch(`https://api.github.com/repos/${githubRepo}/contents/content/articles?ref=${branch}`, {
            headers: {
              'Authorization': `token ${githubToken}`,
              'Accept': 'application/vnd.github.v3+json'
            }
          })

          if (Array.isArray(articles)) {
            const blogRoutes = articles
              .filter(f => f.name.endsWith('.md'))
              .map(f => ({
                url: `/blog/${f.name.replace('.md', '')}`,
                changefreq: 'weekly',
                priority: 0.6
              }))

            routes = [...routes, ...blogRoutes]
          }
        }
      } catch {
        // Blog articles unavailable during build
      }

      return routes
    },
    defaults: {
      changefreq: 'monthly',
      priority: 0.5,
      lastmod: new Date().toISOString()
    }
  },
  axios: {
    baseURL: `https://${process.env.VERCEL_URL || 'un-gout-de-liberte.vercel.app'}`,
    proxy: false
  },
  pwa: {
    icon: {
      source: '~/static/logo.jpg',
      fileName: 'logo.jpg'
    },
    meta: {
      name: 'Un Goût de Liberté',
      author: 'Un Goût de Liberté',
      description: 'Pâtisserie & Biscuiterie artisanale à CHILHAC',
      theme_color: '#F4EFE8',
      lang: 'fr'
    },
    manifest: {
      name: 'Un Goût de Liberté - Pâtisserie artisanale',
      short_name: 'Un Goût de Liberté',
      description: 'Pâtisserie & Biscuiterie artisanale à CHILHAC',
      theme_color: '#F4EFE8',
      background_color: '#F4EFE8',
      display: 'standalone',
      orientation: 'portrait',
      start_url: '/',
      lang: 'fr'
    },
    workbox: {
      runtimeCaching: [
        {
          urlPattern: 'https://images.unsplash.com/.*',
          handler: 'CacheFirst',
          options: {
            cacheName: 'unsplash-images',
            expiration: {
              maxEntries: 50,
              maxAgeSeconds: 60 * 60 * 24 * 30 // 30 days
            }
          }
        },
        {
          urlPattern: '/api/.*',
          handler: 'NetworkFirst',
          options: {
            cacheName: 'api-cache',
            expiration: {
              maxAgeSeconds: 60 * 60 // 1 hour
            }
          }
        }
      ]
    }
  },
  vite: {
    ssr: {
      noExternal: [
        '@headlessui/vue',
        '@heroicons/vue',
        'heroicons-vue3'
      ]
    }
  }
})
