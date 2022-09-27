<template>
  <div>
    <product :product="selectedProduct" @close="selectedProduct = null"/>
    <div class="max-w-screen mx-auto text-center">
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-8">
        <div v-for="p in products" :key="p.id" class="rounded-lg bg-gray-100 shadow-lg hover:shadow-none hover:border-yellow-500 border-2 border-transparent flex flex-col   transition duration-150 ease-in-out hover:scale-110">
          <!-- <nuxt-link :to="`/produits/${p._id}`"> -->
          <button @click="openProduct(p)">
              <div class=" rounded-t-lg bg-white">
                <!-- <nuxt-img class="object-cover h-48 w-full rounded-t-lg" :src="imgSrc(`${dirname(p._path)}/img/small.jpg`)" :alt="p.name"> -->
                <nuxt-img v-if="p.images?.[0]" class="object-cover h-48 w-full rounded-t-lg" :src="p.images[0]" :alt="p.name" />
              </div>
              <div class="pl-4 pr-4 pb-4 pt-4 rounded-lg">
              <h4 class="mt-1 font-semibold text-base leading-tight truncate text-gray-700">{{p.name}}</h4>
              <div class="mt-1 text-sm text-gray-700">{{p.description}}</div>
              </div>
          </button>
          <!-- </nuxt-link> -->
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

<script setup>
  import { useStore } from '~/store/cart'
  const cart = useStore()

  let selectedProduct = ref('')

  let products = ref(cart.products)

  const props = defineProps({
    categories: {
      type: Array,
      required: false
    },
    name: {
      type: String,
      required: false
    }
  })

  // async function getProducts () {
  //    return queryContent('products')
  //    .where({
  //      ...(props.name && props.name != "" ? {name: {$contains: props.name }} : {}),
  //      ...(props.categories ? {categories: {$contains: props.categories}} : {})
  //    })
  //    .sort('name')
  //    .find()
  // }
  // function dirname(p) {
  //   // return path.dirname(p)
  //   return p.substr(0, p.lastIndexOf("/"));
  // }
  // function imgSrc(src) {
  //   const imgs = import.meta.globEager('/content/**/*.{png,jpg}');

  //   return imgs[`/content${src}`].default
  // }
  function addToCart(productId) {
    this.$store.commit('cart/add', productId)
  }

  function openProduct(product) {
    selectedProduct.value = product

  }

  watch(() => props.name, async (value, oldV) => {
    console.log('WATCHED')
    products.value = cart.products.filter(p => p.name.toLowerCase().includes(value.toLowerCase()))
  });

 
</script >