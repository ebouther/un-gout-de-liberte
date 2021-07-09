<template>
  <div>
    <div class="md:pt-8 text-center">
      <div class="hidden md:block font-bold text-5xl font-mono text-gray-700">
        <h1> <span class="text-yellow-500"> Un Goût</span> <span class="text-gray-800">de  Liberté</span> </h1>
      </div>
      <div class="md:grid md:grid-cols-2 items-center md:pt-4 lg: xl:space-x-10 xl:mx-48">
        <div class="mx-auto self-center px-3 max-w-md">
          <img class="rounded-lg border-gray-700 border-4" src="logo.png" alt="logo">
          <!-- <div class="h-32 w-32 border-gray-800 border-4"></div> -->
        </div>
        <div class="p-4 self-center">
          <!-- <div class="font-bold text-3xl font-mono text-gray-700">
            <h1>
            <span class="text-yellow-500"> Un Goût</span> <span class="text-gray-800">de  Liberté</span>
            </h1>
          </div> -->
          <div class="text-3xl font-light font-mono text-gray-700">
            <h1>
            <span class="hidden md:block"> Justine Dumesnil</span>
            </h1>
          </div>
          <br/>
          <br/>
          <div class="text-yellow-500 font-semibold text-2xl text-grey-800 font-mono">
            <h2>
              <span class="">Pâtisserie</span>
              <br/>
              <span class="md:whitespace-no-wrap">Biscuiterie artisanale</span>
            </h2>
          </div>
          <br />
          <br />
          <div class=" text-gray-800 text-xl font-semibold ">
            <h3>
            <span class="">Rue des Remparts</span>
            <br />
            <span>43380 CHILHAC</span>
            </h3>
          </div>
          <br />
          <br />
          <div class="text-gray-800 font-mono text-lg font-light">
            <span class="">Pâtisserie sur commande au gré des saisons et de vos envies</span>
          </div>
        </div>
      </div>
    </div>

    <div class="max-w-screen-lg mx-auto">
      <div class="m-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-4">
        <div v-for="p in products" :key="p.id" class="border rounded-lg bg-gray-100 shadow-lg hover:shadow-md focus:shadow-none hover:border-yellow-500 hover:border-8">
          <nuxt-link :to="`/products/${p.id}`">
              <div class=" rounded-t-lg bg-white">
                <img class="object-cover h-48 w-full rounded-t-lg" :src="p.images[0]" :alt="p.name">
              </div>          
              <div class="pl-4 pr-4 pb-4 pt-4 rounded-lg">
              <h4 class="mt-1 font-semibold text-base leading-tight truncate text-gray-700">{{p.name}}</h4>
              <div class="mt-1 text-sm text-gray-700">{{p.description}}</div>
              </div>
          </nuxt-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import cart from '../components/icons/cart.vue'
import { mapState, mapGetters } from 'vuex'
/*
pages:
  - Accueil
  - Réalisations
  - Contact
*/
export default {
  auth: false,
  components: { cart },

  computed: {
    ...mapGetters({}),
    ...mapState({
      products: function (state) {
        return state.cart.products
      }
    })
  },

  async asyncData ({ store }) {
    await store.dispatch('cart/load')
  },

  head() {
    return {
      title: 'Un Goût de Liberté - Pâtisserie & Biscuiterie artisanale - 43380 CHILHAC ',
      meta: [{
        hid: 'title',
        name: 'title',
        content: 'Un Goût de Liberté',
      }]
    }
  }
}
</script>

<style>
.crop {
  width: 180px;
  height: 180px;
}
</style>
