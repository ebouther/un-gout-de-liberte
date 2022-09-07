<template>
  <div>
    <div class="max-w-screen-xl mx-auto text-center mt-5">
      <!-- <h1 class="font-bold text-3xl font-mono text-yellow-500">Mes réalisations</h1>
      <br/> -->

      <div class="flex justify-center">
        <div class="mb-3 xl:w-96">
          <input
            type="search"
            class="
              form-control
              block
              w-full
              px-3
              py-1.5
              text-base
              font-normal
              text-gray-700
              bg-white bg-clip-padding
              border border-solid border-gray-300
              rounded
              transition
              ease-in-out
              m-0
              focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
            placeholder="Rechercher un produit"
            v-model="search"
          />
        </div>
      </div>
      <br>
      <Products :name="search" />
    </div>
  </div>
</template>

<script setup>
  //const title = 'Mes Produits';
  let search = ref("")

  const onSearchChange = (value) => {
    search.value = value
  }

  definePageMeta({
    title: 'Mes Produits'
  })


 
  // useHead({
  //     title: 'Mes Produits',
  //     meta: [{
  //       hid: 'title',
  //       name: 'title',
  //       content: `Mes Produits - Un Goût de Liberté - CHILHAC`,
  //     }, {
  //       hid: 'description',
  //       name: 'description',
  //       content: `Mes Produits - Un Goût de Liberté - Pâtisserie & Biscuiterie artisanale - 43380 CHILHAC - Justine DUMESNIL - Pâtisserie sur commande au gré des saisons et de vos envies.`,
  //     }]
  // });
// }
</script>