<template>
  <div class="text-center">
    <!-- <div class="hidden md:block font-bold text-5xl font-mono text-gray-700">
      <h1><span class="text-yellow-500"> Un Goût</span> <span class="text-gray-800">de  Liberté</span> </h1>
    </div>
    <div class="md:grid md:grid-cols-2 items-center md:pt-14 lg: xl:space-x-10 xl:mx-48">
      <div class="mx-auto self-center px-3 max-w-md">
        <img class="rounded-lg border-gray-700 border-4" src="logo.jpg" alt="logo">
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
    <br /> -->
    <div class="h-78">
      <!-- <Carousel/> -->
    </div>
    <br/>
    <br/>
    <br/>
    <div class="mx-auto max-w-screen-lg text-left auto-cols-auto">
        <span class="text-gray-700 text-xl font-semibold ">Epicerie Sucrée</span>
        <!-- <a href="/produits?categories=salty">Tout afficher</a> -->
        <br/>
      <Products :categories="['sweet']"/> 
    </div>
    <br />
    <br/>
    <div class="mx-auto max-w-screen-lg text-left">
        <span class="text-gray-700 text-xl font-semibold ">Epicerie Salée</span>
        <!-- <a href="/produits?categories=salty">Tout afficher</a> -->
        <br/>
      <Products :categories="['salty']"/> 
    </div>
  </div>
</template>

<script>
import cart from '../components/icons/cart.vue'
import Products from '../components/products.vue'
import Carousel from '../components/carousel.vue'
import { mapState } from 'pinia'
import { useStore } from '~/store/cart'

export default defineComponent({
  // auth: false,
  // components: { cart, Products, Carousel },
  // // data: () => ({
  // //   products: []
  // // }),
  // // computed: {
  // //   ...mapState({
  // //     products: function (state) {
  // //       return state.cart.products
  // //     }
  // //   })
  // // },

  // // async asyncData ({ $pinia }) {
  // //   //await store.dispatch('cart/load')
  // //   const store = useStore($pinia)
  // //   await store.load()
  // //   console.log('STORE : ', store);
  // //   return ({
  // //     products: store.products
  // //   })
  // // },

  // head() {
  //   const title = 'Accueil';
  //   return {
  //     title,
  //     meta: [{
  //       hid: 'title',
  //       name: 'title',
  //       content: 'Pâtisserie - Un Goût de Liberté - CHILHAC',
  //     }, {
  //       hid: 'description',
  //       name: 'description',
  //       content: 'Un Goût de Liberté - Pâtisserie & Biscuiterie artisanale - 43380 CHILHAC - Justine DUMESNIL - Pâtisserie sur commande au gré des saisons et de vos envies.',
  //     }]
  //   }
  // }
})
</script>