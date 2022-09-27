<template>
  <div class="text-center">
    <cart/>
    <Carousel/>
    <br/>
    <br/>
    <section id="products" class="mx-auto max-w-screen-xl text-left px-4 md:px-0">
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
    </section>

    <!-- About section -->
    <section id="about" class="mt-20 bg-stone-200">
      <div class="grid grid-flow-col">
        <nuxt-img
          src="https://images.unsplash.com/photo-1517141544637-42b300cb4ee9?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8"
          class="w-full h-full object-cover mx-auto hidden md:block"
        />
        <div class="text-center">
            <div class="block whitespace-pre-line text-gray-700 text-justify">
              <ContentDoc path="/about" class="m-8"/>
            </div>
        </div>
      </div>
    </section>

    <!-- Back to top btn -->
    <button
      type="button"
      @click="openCart"
      class="inline-block p-3 bg-gray-100 text-gray-700 font-medium text-xs leading-tight uppercase rounded-md shadow-md hover:scale-110 hover:text-gray-500 hover:shadow-lg focus:shadow-lg focus:outline-none focus:ring-0 active:shadow-lg transition duration-150 ease-in-out hidden bottom-5 right-5 fixed"
      id="btn-back-to-top"
    >
      <div class="m-auto">
        <ShoppingBagIcon class="flex-shrink-0 h-8 w-8 " aria-hidden="true"></ShoppingBagIcon>
        <div v-if="store.nbOfItems > 0" class="inline-flex absolute -top-1 -right-2 justify-center items-center w-6 h-6 text-xs font-bold text-white bg-red-500 rounded-full border-2 border-white dark:border-gray-900">{{store.nbOfItems}}</div>
      </div>
    </button>
  </div>
</template>

<script setup>
  import Products from '../components/products.vue'
  import Carousel from '../components/carousel.vue'
  import { ShoppingBagIcon } from 'heroicons-vue3/outline'
  import { mapState } from 'pinia'
  import { useStore } from '~/store/cart'


  const nuxtApp = useNuxtApp()
  
  const store = useStore()
  await store.load()

  const openCart =  store.open

  let search = ref("")


  const title = ref('Un Goût de Liberté - Pâtisserie & Biscuiterie artisanale à CHILHAC')
  const description = ref('Pâtisserie & Biscuiterie artisanale - 43380 CHILHAC - Justine DUMESNIL - Pâtisserie sur commande au gré des saisons et de vos envies.')

  useHead({
    title,
    meta: [{
      name: 'description',
      content: description
    }],
    htmlAttrs: {
      lang: 'fr'
    }
  })


  nuxtApp.hook('page:finish', () => {

    let backToTopBtn = document.getElementById('btn-back-to-top');

    window.onscroll = function () {
      scrollFunction();
    };

    function scrollFunction() {
      if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        backToTopBtn.style.display = 'block';
      } else {
        backToTopBtn.style.display = 'none';
      }
    }

    // backToTopBtn.addEventListener('click', backToTop);


    function backToTop() {
      document.body.scrollTop = 0;
      document.documentElement.scrollTop = 0;
    }

  })
</script>
