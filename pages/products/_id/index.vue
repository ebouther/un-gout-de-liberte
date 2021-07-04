<template>
    <div class="flex justify-center m-6">
        <div v-if="this.product !== null">
            <div class="flex flex-col items-center border rounded-lg bg-gray-100">
                <div v-for="url in product.images" class="w-full bg-white rounded-lg flex justify-center">
                  <img class="rounded-t-md" :src="url" :alt="product.name" width="375">
                </div>
                <div class="w-full p-5 flex flex-col justify-between">
                  <div>
                      <h1 class="mt-1 font-semibold text-lg leading-tight truncate text-gray-700">{{product.name}}</h1>
                      <div class="mt-1 text-gray-600"><h2>{{product.description}}</h2></div>
                  </div>

                  <button
                      class="mt-4 bg-white border border-gray-200 d hover:shadow-lg text-gray-700 font-semibold py-2 px-4 rounded shadow"
                      @click="addToCart">
                      Ajouter au panier
                  </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
  auth: false,
  async asyncData({ store, route }) {
    await store.dispatch('cart/fetchProducts')
    await store.dispatch('cart/fetchPrices')
    return { product: store.state.cart.products.find(p => p.id === route.params.id) }
  },
  methods: {
    addToCart () {
      this.$store.commit('cart/add', this.$route.params.id)
    },
  },
  head() {
    const title = `${this.product.name} - Un Goût de Liberté - Un Goût de Liberté - Pâtisserie & Biscuiterie artisanale`;
    return {
      title: title,
      meta: [{
        hid: 'title',
        name: 'title',
        content: title,
      }, {
        hid: 'description',
        name: 'description',
        content: `${this.product.name} - Un Goût de Liberté - Pâtisserie & Biscuiterie artisanale - 43380 CHILHAC`,
      }]
    }
  }
}
</script>

<style>
</style>
