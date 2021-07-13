<template>
  <div>
    <div class="max-w-screen-lg mx-auto text-center">
      <h1 class="font-bold text-3xl font-mono text-yellow-500">Mes réalisations</h1>
      <br/>
      <div class="m-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-4">
        <div v-for="p in products" :key="p.id" class="border rounded-lg bg-gray-100 shadow-lg hover:shadow-md focus:shadow-none hover:border-yellow-500 hover:border-8">
          <nuxt-link :to="`/produits/${p.id}`">
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
import cart from '~/components/icons/cart.vue'
import { mapState, mapGetters } from 'vuex'

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
    const title = 'Mes Produits';
    return {
      title,
      meta: [{
        hid: 'title',
        name: 'title',
        content: `${title} - Un Goût de Liberté - CHILHAC`,
      }, {
        hid: 'description',
        name: 'description',
        content: `${title} - Un Goût de Liberté - Pâtisserie & Biscuiterie artisanale - 43380 CHILHAC - Justine DUMESNIL - Pâtisserie sur commande au gré des saisons et de vos envies.`,
      }]
    }
  }
}
</script>