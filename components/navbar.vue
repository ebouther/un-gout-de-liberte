<template>
<div class="font-mono">
  <div class="text-gray-700 bg-white border-b-2 border-yellow-500 border-opacity-50">
    <div class="flex flex-row w-screen justify-between items-center">
      <div></div>
      <div class="">
        <!-- <a href="/" class="text-lg font-semibold tracking-wide text-gray-800 uppercase rounded-lg focus:outline-none focus:shadow-outline"><span class="text-yellow-500">Un Goût</span> de Liberté</a> -->
        <a href="/" class="text-lg font-semibold tracking-wider text-gray-800 uppercase rounded-lg focus:outline-none focus:shadow-outline">
          <nuxt-img class="w-36 h-36 rounded-lg border-gray-500" src="/assets/logo.jpg" fixed alt="logo"/>  
        </a>
      </div>
      <div class="mx-5 h-28 my-auto border border-slate-100"></div>
      <div class="flex flex-col justify-between text-center">
        <div class="my-3">
          <h1><a href="/" class="text-xl font-bold tracking-wide text-gray-800 uppercase rounded-lg focus:outline-none focus:shadow-outline"><span class="text-yellow-500">Un Goût</span> de Liberté</a></h1>
          <span class="text-gray-600 font-semibold text-sm">43380 CHILHAC</span>
          <br/>
          <span class="text-lg uppercase text-yellow-900 tracking-tight">Pâtisserie Biscuiterie Artisanale</span>
          <!-- <br/> -->
          <!-- <span>Pâtisserie sur commande au gré des saisons et de vos envies</span> -->
        </div>
        <hr class="mx-5"/>
        <nav class="hidden md:grid grid-flow-col grid-cols-4 md:pb-0 md:justify-center md:flex-row md:align-middle my-2">
          <a class="px-2 py-1 text-sm font-semibold bg-transparent rounded-lg dark-mode:bg-gray-700 dark-mode:hover:bg-gray-600 dark-mode:focus:bg-gray-600 dark-mode:focus:text-white dark-mode:hover:text-white dark-mode:text-gray-200 md:mt-0 hover:text-gray-900 focus:text-gray-900 hover:bg-gray-200 focus:bg-gray-200 focus:outline-none focus:shadow-outline" href="/">Accueil</a>
          <a class="px-2 py-1 text-sm font-semibold bg-transparent rounded-lg dark-mode:bg-transparent dark-mode:hover:bg-gray-600 dark-mode:focus:bg-gray-600 dark-mode:focus:text-white dark-mode:hover:text-white dark-mode:text-gray-200 md:mt-0 md:ml-4 hover:text-gray-900 focus:text-gray-900 hover:bg-gray-200 focus:bg-gray-200 focus:outline-none focus:shadow-outline" href="/produits">Produits</a>
          <a class="px-2 py-1 text-sm font-semibold bg-transparent rounded-lg dark-mode:bg-transparent dark-mode:hover:bg-gray-600 dark-mode:focus:bg-gray-600 dark-mode:focus:text-white dark-mode:hover:text-white dark-mode:text-gray-200 md:mt-0 md:ml-4 hover:text-gray-900 focus:text-gray-900 hover:bg-gray-200 focus:bg-gray-200 focus:outline-none focus:shadow-outline" href="/panier">Panier</a>
          <a class="px-2 py-1 text-sm font-semibold bg-transparent rounded-lg dark-mode:bg-gray-700 dark-mode:hover:bg-gray-600 dark-mode:focus:bg-gray-600 dark-mode:focus:text-white dark-mode:hover:text-white dark-mode:text-gray-200 md:mt-0 hover:text-gray-900 focus:text-gray-900 hover:bg-gray-200 focus:bg-gray-200 focus:outline-none focus:shadow-outline" href="/presentation">À propos</a>
        </nav>
      </div>
      <div class="mx-5 h-28 my-auto border border-slate-100"></div>
      <div class="">
        <!-- <a href="/" class="text-lg font-semibold tracking-wide text-gray-800 uppercase rounded-lg focus:outline-none focus:shadow-outline"><span class="text-yellow-500">Un Goût</span> de Liberté</a> -->
        <a href="/" class="text-lg font-semibold tracking-wide text-gray-800 uppercase rounded-lg focus:outline-none focus:shadow-outline">
          <nuxt-img class="w-36 h-36 rounded-lg border-gray-500" src="/assets/logo.jpg" fixed alt="logo"/>  
        </a>
      </div>
      <div></div>
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
export default {
  components: {}
}
</script>