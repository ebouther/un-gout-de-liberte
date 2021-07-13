<template>
  <div class="md:pt-8 text-center">
    <div class="hidden md:block font-bold text-5xl font-mono text-gray-700">
      <h1><span class="text-yellow-500"> Un Goût</span> <span class="text-gray-800">de  Liberté</span> </h1>
    </div>
    <div class="md:grid md:grid-cols-2 items-center md:pt-14 lg: xl:space-x-10 xl:mx-48">
      <div class="mx-auto self-center px-3 max-w-md">
        <img class="rounded-lg border-gray-700 border-4" src="logo.png" alt="logo">
      </div>
      <div class="p-4 self-center">
        <div class="text-3xl font-light font-mono text-gray-700">
          <span class="hidden md:block"> Justine Dumesnil</span>
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
</template>

<script>
import cart from '../components/icons/cart.vue'
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
    const title = 'Accueil';
    return {
      title,
      meta: [{
        hid: 'title',
        name: 'title',
        content: 'Pâtisserie - Un Goût de Liberté - CHILHAC',
      }, {
        hid: 'description',
        name: 'description',
        content: 'Un Goût de Liberté - Pâtisserie & Biscuiterie artisanale - 43380 CHILHAC - Justine DUMESNIL - Pâtisserie sur commande au gré des saisons et de vos envies.',
      }]
    }
  }
}
</script>