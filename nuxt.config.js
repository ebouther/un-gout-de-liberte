// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: true,
  target: 'server',
  devtools: { enabled: true },

  modules: ['@nuxtjs/tailwindcss', '@pinia/nuxt', '@nuxt/content', '@vueuse/nuxt', '@nuxt/image'],
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
    Disallow: '/user',
    // Sitemap: '/sitemap.xml'
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
      theme_color: '#f59e0b',
      lang: 'fr'
    },
    manifest: {
      name: 'Un Goût de Liberté - Pâtisserie artisanale',
      short_name: 'Un Goût de Liberté',
      description: 'Pâtisserie & Biscuiterie artisanale à CHILHAC',
      theme_color: '#f59e0b',
      background_color: '#ffffff',
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