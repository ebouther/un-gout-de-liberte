<template>
  <div>
    <div class="text-center pb-10">
      <div class="font-bold text-3xl font-mono text-gray-700">
        <span class="text-orange-500"> Un Goût</span> <span class="text-gray-800">de  Liberté</span>
      </div>
      <br/>
      <br/>
      <div class="text-orange-500 font-medium text-2xl text-grey-800 font-mono">
        <span class="">Pâtisserie</span>
        <br/>
        <span class="">Biscuiterie artisanale</span>
      </div>
      <br />
      <br />
      <div class=" text-gray-800">
        <span class="">Rue des Remparts</span>
        <br />
        <span>43380 CHILHAC</span>
      </div>
      <br />
      <br />
      <div class="text-gray-800 font-mono">
        <span class="">Pâtisserie sur commande au gré des saisons et de vos envies</span>
      </div>
    </div>
    <div class="m-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-4">
        <div v-for="p in products" :key="p.id" class="border rounded-lg bg-gray-100 hover:shadow-lg">
        <nuxt-link :to="`/products/${p.id}`">
            <div class="rounded-t-lg bg-white pt-2 pb-2">
              <img class="mx-auto" :src="p.images[0]">
            </div>          
            <div class="pl-4 pr-4 pb-4 pt-4 rounded-lg">
            <h4 class="mt-1 font-semibold text-base leading-tight truncate text-gray-700">{{p.title}}</h4>
            <div class="mt-1 text-sm text-gray-700">{{p.description}}</div>
            </div>
        </nuxt-link>
        </div>
    </div>
  </div>
</template>

<script>
import cart from '../components/icons/cart.vue'
export default {
  components: { cart },
  async asyncData({ store }) {
    await store.dispatch('cart/fetchProducts')
    await store.dispatch('cart/fetchPrices')
    return { products: store.state.cart.products }
  },
}
</script>

<style>
.crop {
  width: 180px;
  height: 180px;
}
</style>
