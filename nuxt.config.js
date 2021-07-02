export default {
  /*
  ** Nuxt rendering mode
  ** See https://nuxtjs.org/api/configuration-mode
  */
  mode: 'spa',
  /*
  ** Nuxt target
  ** See https://nuxtjs.org/api/configuration-target
  */
  target: 'static',
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
      {
        hid: 'title',
        name: 'title',
        content: 'Un Goût de Liberté'
      },
      {
        hid: 'description',
        name: 'description',
        content: process.env.npm_package_description
      }
    ],
    htmlAttrs: {
      lang: 'fr'
    },
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ],
    script: [
    ]
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
  plugins: [{
    src: '~/plugins/vue-stripe.js', ssr: false
  }, {
    src: '~/plugins/vuex-persist.js', ssr: false
  }],
  /*
  ** Auto import components
  ** See https://nuxtjs.org/api/configuration-components
  */
  components: true,
  /*
  ** Nuxt.js dev-modules
  */
  buildModules: [
    // Doc: https://github.com/nuxt-community/nuxt-tailwindcss
    '@nuxtjs/tailwindcss',
  ],
  /*
  ** Nuxt.js modules
  */
  modules: [
    '@nuxtjs/axios',
    '@nuxtjs/google-analytics',
    '@nuxtjs/sitemap',
    '@nuxtjs/robots'
  ],
  env: {
    STRIPE_PK: process.env.STRIPE_PK || 'pk_test_51J84KnBVac9AX8Ww3v0D3d3ZY9KwfOykIlePV5fNI35U2M8UcoPHuvlmZQK81DIbwm3XhNGZRIKufXWtQyWgNZNc00cPuHKVTf',
    hostname: 'https://un-gout-de-liberte.fr'
  },
  /*
  ** Build configuration
  ** See https://nuxtjs.org/api/configuration-build/
  */
  build: {
  },
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
  }
}
