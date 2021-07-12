<template>
<div class="px-7 bg-white shadow-lg rounded-2xl">
  <div class="flex">
      <div class="flex-1 group">
          <a href="/" class="flex items-end justify-center text-center mx-auto px-4 pt-2 w-full text-gray-400 group-hover:text-indigo-500">
              <span class="block px-1 pt-1 pb-1">
                  <i class="far fa-home text-2xl pt-1 mb-1 block"></i>
                  <span class="block text-xs pb-2">Accueil</span>
                  <span class="block w-5 mx-auto h-1 group-hover:bg-indigo-500 rounded-full"></span>
              </span>
          </a>
      </div>
      <div class="flex-1 group">
          <a href="presentation" class="flex items-end justify-center text-center mx-auto px-4 pt-2 w-full text-gray-400 group-hover:text-indigo-500">
              <span class="block px-1 pt-1 pb-1">
                  <i class="far fa-address-card text-2xl pt-1 mb-1 block"></i>
                  <span class="block text-xs pb-2">Présentation</span>
                  <span class="block w-5 mx-auto h-1 group-hover:bg-indigo-500 rounded-full"></span>
              </span>
          </a>
      </div>
      <div class="flex-1 group">
          <a href="produits" class="flex items-end justify-center text-center mx-auto px-4 pt-2 w-full text-gray-400 group-hover:text-indigo-500">
              <span class="block px-1 pt-1 pb-1">
                  <i class="far fa-cookie text-2xl pt-1 mb-1 block"></i>
                  <span class="block text-xs pb-2">Réalisations</span>
                  <span class="block w-5 mx-auto h-1 group-hover:bg-indigo-500 rounded-full"></span>
              </span>
          </a>
      </div>
      <div class="flex-1 group">
          <a href="panier" class="flex items-end justify-center text-center mx-auto px-4 pt-2 w-full text-gray-400 group-hover:text-indigo-500">
              <span class="block px-1 pt-1 pb-1">
                  <i class="far fa-shopping-cart text-2xl pt-1 mb-1 block"></i>
                  <span class="block text-xs pb-2">Panier</span>
                  <span class="block w-5 mx-auto h-1 group-hover:bg-indigo-500 rounded-full"></span>
              </span>
          </a>
      </div>
    </div>
  </div>
</template>

<style>
</style>

<script>
import Cart from "./icons/cart.vue"
import Home from "./icons/home.vue"

export default {
    components: {
      Cart,
      Home 
    }
}
</script>