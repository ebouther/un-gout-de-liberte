<template>
    <div class="mx-auto flex justify-center m-6" style="max-height: 70vh;">
        <div v-if="product !== null">
            <div class="h-full flex flex-col rounded-lg bg-gray-100 ">
                <div v-for="url in product.images" :key="url" class="min-w-0 min-h-0 bg-white rounded-lg  h-full w-full" >
                  <img class="min-h-0 min-w-0 rounded-t-md mx-auto h-full w-auto" :src="url" :alt="product.name">
                </div>
                <div class="w-full p-5 flex flex-col justify-between mt-auto flex-auto">
                  <div>
                      <h1 class="mt-1 font-semibold text-lg leading-tight truncate text-gray-700">{{product.name}}</h1>
                      <div class="mt-1 text-gray-600"><h2>{{product.description}}</h2></div>
                      <div class="mt-1 text-gray-600"><h2><span class="font-semibold">Prix: </span><span>{{product.price.amount}} {{product.price.currency}}</span></h2></div>
                      <div v-for="(meta, key) in product.metadata" :key="key" class="mt-1 text-gray-600">
                        <span class="font-semibold">{{key}}: </span><span>{{meta}}</span>
                      </div>
                  </div>

                  <button
                      class="mt-4 bg-white border border-gray-200 hover:shadow-lg text-gray-700 font-semibold py-2 px-4 rounded shadow"
                      @click="addToCart">
                      Ajouter au panier
                  </button>
                </div>
            </div>
        </div>
    </div>
            <!-- <div class="flex flex-col h-full  max-h-screen border-2 border-pink-600 rounded-lg bg-gray-100  ">
                <div class="border-4 border-green-800 py-auto flex-auto">
                  <img class=" mx-auto object-cover h-full max-h-full" src='http://www.sherkspear.com/wp-content/uploads/2015/04/jsfiddle.png'/> 
                </div> 
                <div class="border-4 border-green-400 py-auto flex-auto"><span>TOTO</span></div> 
            </div> -->
</template>

<script>
import { mapState, mapGetters } from 'vuex'

export default {
  auth: false,

  computed: {
    ...mapGetters({}),
    ...mapState({
      product: function (state) {
        return state.cart.products.find(p => p.id === this.$nuxt.$route.params.id)
      }
    })
  },

  async asyncData ({ store }) {
    await store.dispatch('cart/load')
  },

  methods: {
    addToCart () {
      this.$store.commit('cart/add', this.$route.params.id)
    },
  },
  head() {
    const title = `${this.product.name} - Un Goût de Liberté`;
    return {
      title: title,
      meta: [{
        hid: 'title',
        name: 'title',
        content: title,
      }, {
        hid: 'description',
        name: 'description',
        content: `${this.product.name} - Un Goût de Liberté - Pâtisserie & Biscuiterie artisanale - Justine DUMESNIL - 43380 CHILHAC | ${this.product.description}`,
      }]
    }
  }
}
</script>

<style>
</style>
