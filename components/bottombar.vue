<template>
  <div class="bg-white shadow-lg rounded-t-2xl">
    <div class="flex">
      <div class="flex-1 group">
        <a href="/" class="flex items-end justify-center text-center mx-auto pt-2 w-full text-gray-400 group-hover:text-gray-600">
          <span class="block px-1 pt-1 pb-1">
            <Home class="text-2xl pt-1 mb-1 block"/>
            <!-- <span class="block text-xs pb-2">Accueil</span> -->
            <span class="block w-5 mx-auto h-1 group-hover:bg-yellow-500 rounded-full"></span>
          </span>
        </a>
      </div>
      <div class="flex-1 group">
        <a href="/presentation" class="flex items-end justify-center text-center mx-auto pt-2 w-full text-gray-400 group-hover:text-gray-600">
          <span class="block px-1 pt-1 pb-1">
            <About class="text-2xl pt-1 mb-1 block"/>
            <!-- <span class="block text-xs pb-2">Présentation</span> -->
            <span class="block w-5 mx-auto h-1 group-hover:bg-yellow-500 rounded-full"></span>
          </span>
        </a>
      </div>
      <div class="flex-1 group">
        <a href="/produits" class="flex items-end justify-center text-center mx-auto pt-2 w-full text-gray-400 group-hover:text-gray-600">
          <span class="block px-1 pt-1 pb-1">
            <Biscuit class="text-2xl pt-1 mb-1 block"/>
            <!-- <span class="block text-xs pb-2">Réalisations</span> -->
            <span class="block w-5 mx-auto h-1 group-hover:bg-yellow-500 rounded-full"></span>
          </span>
        </a>
      </div>
      <div class="flex-1 group">
        <a href="/panier" class="flex items-end justify-center text-center mx-auto pt-2 w-full text-gray-400 group-hover:text-gray-600">
          <span class="block px-1 pt-1 pb-1 relative">
            <Cart class="text-2xl pt-1 mb-1 block"/>

            <!-- <span class="block text-xs pb-2">Panier</span> -->
            <span class="block w-5 mx-auto h-1 group-hover:bg-yellow-500 rounded-full"></span>
            <div v-if="cart.nbOfItems > 0" class="inline-flex absolute -top-1 -right-2 justify-center items-center w-6 h-6 text-xs font-bold text-white bg-red-500 rounded-full border-2 border-white dark:border-gray-900">{{cart.nbOfItems}}</div>
          </span>
        </a>
      </div>
    </div>
  </div>
</template>

<style>
</style>

<script setup>
import Home from "./icons/home.vue"
import About from "./icons/about.vue"
import Biscuit from "./icons/biscuit.vue"
import Cart from "./icons/cart.vue"

import { useStore } from '~/store/cart'
const cart = useStore()

// 
// export default {
    // components: {
      // Home,
      // About,
      // Biscuit,
      // Cart,
    // }
// }
</script>