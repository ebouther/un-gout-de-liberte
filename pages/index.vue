<template>
  <div class="text-center">
    <cart/>
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