<template>
  <div>
    <div class="max-w-screen mx-auto text-center">
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-8">
        <div v-for="p in products" :key="p.id" class="border rounded-lg bg-gray-100 shadow-lg hover:shadow-md focus:shadow-none hover:border-yellow-500 hover:border-2 flex flex-col">
          <nuxt-link :to="`/produits/${p.id}`">
              <div class=" rounded-t-lg bg-white">
                <img class="object-cover h-48 w-full rounded-t-lg" :src="imgSrc(`${p.dir}/img/small.jpg`)" :alt="p.name">
              </div>
              <div class="pl-4 pr-4 pb-4 pt-4 rounded-lg">
              <h4 class="mt-1 font-semibold text-base leading-tight truncate text-gray-700">{{p.name}}</h4>
              <div class="mt-1 text-sm text-gray-700">{{p.description}}</div>
              </div>
          </nuxt-link>
          <!-- <div class="flex items-center justify-between mx-2 mb-2 mt-auto">
				  	<span class="text-xl font-bold text-gray-900 dark:text-white">{{p.price.amount}} {{p.price.currency}}</span>
				  	<button
				  		class="text-white bg-yellow-700 hover:bg-yellow-500 focus:ring-4 focus:ring-yellow-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
              @click="addToCart(p.id)" >
              <Cart class="w-3"/>
            </button>
				  </div> -->
        </div>
      </div>
    </div>
  </div>


</template>

<style>
</style>


<script>
  import Cart from './icons/cart.vue'
  export default {
    name: 'products',
    components: { Cart },
    props: {
      categories: {
        type: Array,
        required: false
      }
    },
    data: () => ({
      products: []
    }),
    async fetch() {
      this.products = await this.$content('products', { deep: true })
      .where({
        ...(this.categories ? {categories: {$contains: this.categories}} : {})
      })
      .sortBy('name')
      .fetch()
    },
    methods: {
      imgSrc(src) {
        try {
          return require(`~/content${src}`)
        } catch (error) {
          return null
        }
      },
      addToCart(productId) {
        console.log('ADD TO CART : ', productId);
        this.$store.commit('cart/add', productId)
      }
    }
    
  }
</script>