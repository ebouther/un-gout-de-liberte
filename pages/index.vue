<template>
  <div class="text-center">
    <cart/>
    <!-- <div class="hidden md:block font-bold text-5xl font-mono text-gray-700">
      <h1><span class="text-yellow-500"> Un Goût</span> <span class="text-gray-800">de  Liberté</span> </h1>
    </div>
    <div class="md:grid md:grid-cols-2 items-center md:pt-14 lg: xl:space-x-10 xl:mx-48">
      <div class="mx-auto self-center px-3 max-w-md">
        <nuxt-img class="rounded-lg border-gray-700 border-4" src="logo.jpg" alt="logo">
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
    <Carousel/>
    <br/>
    <br/>
    <div id="products" class="mx-auto max-w-screen-xl text-left px-4 md:px-0">
      <div class="flex justify-center">
        <div class="mb-3 xl:w-96">
          <input
          type="search"
          class="
            w-full 
            px-3
            py-1.5
            border rounded
           text-gray-700 leading-tight
            focus:outline-none focus:border-yellow-600
            "
            placeholder="Rechercher un produit"
            v-model="search" />
        </div>
      </div>
      <br>
      <Products :name="search" />
    </div>
  </div>
</template>

<script setup>
  import Products from '../components/products.vue'
  import Carousel from '../components/carousel.vue'
  import { mapState } from 'pinia'
  import { useStore } from '~/store/cart'
  
  const store = useStore()
  await store.load()

  let search = ref("")

  definePageMeta({
    title: 'Accueil'
  })

  useHead({
    title: 'Accueil',
    meta: [{
      hid: 'title',
      name: 'title',
      content: 'Pâtisserie - Un Goût de Liberté - CHILHAC',
    }, {
      hid: 'description',
      name: 'description',
      content: 'Un Goût de Liberté - Pâtisserie & Biscuiterie artisanale - 43380 CHILHAC - Justine DUMESNIL - Pâtisserie sur commande au gré des saisons et de vos envies.',
    }]
  })
</script>