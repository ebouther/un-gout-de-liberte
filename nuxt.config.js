
import { defineNuxtConfig } from 'nuxt'

export default defineNuxtConfig({
  ssr: false,
  target: 'server',

  // router: { # TODO
  //   middleware: ['auth']
  // },
  // serverMiddleware: [
  //   '~/api/stripe.js'
  // ],
  /*
  ** Headers of the page
  ** See https://nuxtjs.org/api/configuration-head
  */
  head: {
    title: 'Un Goût de Liberté',
    //titleTemplate: '%s - Un Goût de Liberté',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    ],
    htmlAttrs: {
      lang: 'fr'
    },
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ],
    // script: [{
    // }],
  },
  /*
  ** Global CSS
  */
  css: [
  ],
  /*
  ** Plugins to load before mounting the App
  ** https://nuxtjs.org/guide/plugins
  */
  // plugins: [{
  //   src: '~/plugins/vue-stripe.js', mode: 'client'
  // }, {
  //   src: '~/plugins/vuex-persist.js', mode: 'client' 
  // },
  // {
  //   src: '~/plugins/swiper.client.js', mode: 'client'
  // }],
  /*
  /*
  ** Nuxt.js dev-modules
  */
  buildModules: [
    '@nuxtjs/pwa',
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt'
  ],
  /*
  ** Nuxt.js modules
  */
  modules: [
    //'@nuxtjs/google-analytics',
    '@nuxt/image-edge',
    '@nuxtjs/sitemap',
    '@nuxtjs/robots',
    '@nuxt/content',
    '@vueuse/nuxt'
  ],
  env: {
    STRIPE_PK: process.env.STRIPE_PK,
    hostname: process.env.HOST || 'https://un-gout-de-liberte.fr'
  },
  /*
  ** Build configuration
  ** See https://nuxtjs.org/api/configuration-build/
  */
  build: {},
  googleAnalytics: {
    id: 'UA-201172251-1' 
  },
  sitemap: {
    hostname: 'https://un-gout-de-liberte.fr'
  },
  robots: {
    UserAgent: '*',
    Disallow: '/user',
    Sitemap: '/sitemap.xml'
  },
  axios: {
    baseURL: `https://${process.env.VERCEL_URL || 'un-gout-de-liberte.vercel.app'}`,
    proxy: false
  },
  pwa: {
    icon: {
      source: '~/static/logo.jpg'
    } 
  }
})
