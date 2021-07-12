<template>
  <!-- <div class="bg-gray-100 p-5">
    <div class="w-full grid justify-items-start  mx-6 my-4 border border-red-500">
      <nuxt-link to="/" class="flex items-center">
        <Home class="transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-125"/>
        <span class="hidden md:block font-semibold text-sm text-grey-700">Un Goût de Liberté</span>
      </nuxt-link>

      <div class="inline-flex">
        <nuxt-link to="/presentation" class="flex items-center">Qui suis-je ?</nuxt-link>
        <nuxt-link to="/produits" class="flex items-center">Mes Produits</nuxt-link>
      </div>

      <nuxt-link to="/panier" class="justify-self-end flex items-center border border-green-700">
          <Cart class="transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-125"/>
          <span class="font-semibold text-sm text-orange-700">Mon Panier</span>
      </nuxt-link>
    </div>
  </div> -->
<div class="mb-5">
  <!-- <script src="https://cdn.jsdelivr.net/gh/alpinejs/alpine@v2.x.x/dist/alpine.min.js" defer></script> -->
  <div class="w-full text-gray-700 bg-white dark-mode:text-gray-200 dark-mode:bg-gray-800">
    <div x-data="{ open: false }" class="flex flex-col max-w-screen-xl px-4 mx-auto md:items-center md:justify-between md:flex-row md:px-6 lg:px-8">
      <div class="p-4 flex flex-row items-center justify-between">
        <a href="/" class="text-lg font-semibold tracking-widest text-gray-900 uppercase rounded-lg dark-mode:text-white focus:outline-none focus:shadow-outline">Un Goût de Liberté</a>
        <button class="md:hidden rounded-lg focus:outline-none focus:shadow-outline" @click="open = !open">
          <svg fill="currentColor" viewBox="0 0 20 20" class="w-6 h-6">
            <path x-show="!open" fill-rule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM9 15a1 1 0 011-1h6a1 1 0 110 2h-6a1 1 0 01-1-1z" clip-rule="evenodd"></path>
            <!-- <path x-show="open" fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path> -->
          </svg>
        </button>

        <!-- <div class="opacity-0 invisible dropdown-menu transition-all duration-300 transform origin-top-right -translate-y-2 scale-95">
          <div class="absolute right-0 w-56 mt-2 origin-top-right bg-white border border-gray-200 divide-y divide-gray-100 rounded-md shadow-lg outline-none" aria-labelledby="headlessui-menu-button-1" id="headlessui-menu-items-117" role="menu">
            <div class="px-4 py-3">         
              <p class="text-sm leading-5">Signed in as</p>
              <p class="text-sm font-medium leading-5 text-gray-900 truncate">tom@example.com</p>
            </div>
            <div class="py-1">
              <a href="javascript:void(0)" tabindex="0" class="text-gray-700 flex justify-between w-full px-4 py-2 text-sm leading-5 text-left"  role="menuitem" >Account settings</a>
              <a href="javascript:void(0)" tabindex="1" class="text-gray-700 flex justify-between w-full px-4 py-2 text-sm leading-5 text-left"  role="menuitem" >Support</a>
              <span role="menuitem" tabindex="-1" class="flex justify-between w-full px-4 py-2 text-sm leading-5 text-left text-gray-700 cursor-not-allowed opacity-50" aria-disabled="true">New feature (soon)</span>
              <a href="javascript:void(0)" tabindex="2" class="text-gray-700 flex justify-between w-full px-4 py-2 text-sm leading-5 text-left" role="menuitem" >License</a></div>
            <div class="py-1">
              <a href="javascript:void(0)" tabindex="3" class="text-gray-700 flex justify-between w-full px-4 py-2 text-sm leading-5 text-left"  role="menuitem" >Sign out</a></div>
          </div>
        </div> -->

      </div>
      <nav class="flex-col flex-grow pb-4 md:pb-0 hidden md:flex md:justify-end md:flex-row">
        <a class="px-4 py-2 mt-2 text-sm font-semibold text-gray-900 rounded-lg dark-mode:bg-gray-700 dark-mode:hover:bg-gray-600 dark-mode:focus:bg-gray-600 dark-mode:focus:text-white dark-mode:hover:text-white dark-mode:text-gray-200 md:mt-0 hover:text-gray-900 focus:text-gray-900 hover:bg-gray-200 focus:bg-gray-200 focus:outline-none focus:shadow-outline" href="presentation">Présentation</a>
        <a class="px-4 py-2 mt-2 text-sm font-semibold bg-transparent rounded-lg dark-mode:bg-transparent dark-mode:hover:bg-gray-600 dark-mode:focus:bg-gray-600 dark-mode:focus:text-white dark-mode:hover:text-white dark-mode:text-gray-200 md:mt-0 md:ml-4 hover:text-gray-900 focus:text-gray-900 hover:bg-gray-200 focus:bg-gray-200 focus:outline-none focus:shadow-outline" href="produits">Produits</a>
        <a class="px-4 py-2 mt-2 text-sm font-semibold bg-transparent rounded-lg dark-mode:bg-transparent dark-mode:hover:bg-gray-600 dark-mode:focus:bg-gray-600 dark-mode:focus:text-white dark-mode:hover:text-white dark-mode:text-gray-200 md:mt-0 md:ml-4 hover:text-gray-900 focus:text-gray-900 hover:bg-gray-200 focus:bg-gray-200 focus:outline-none focus:shadow-outline" href="panier">Panier</a>
      </nav>
    </div>
  </div>
</div>
</template>

<style>
  .dropdown:focus-within .dropdown-menu {
    opacity:1;
    transform: translate(0) scale(1);
    visibility: visible;
  }  
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

<style>
  .emoji {
    font-size: 30px;
  }
</style>