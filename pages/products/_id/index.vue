<template>
    <div class="flex justify-center m-6">
        <div v-if="product !== null">
            <div class="md:max-w-screen-md lg:max-w-screen-lg flex flex-col items-center border rounded-lg bg-gray-100">
                <div v-for="url in product.images" :key="url" class="bg-white rounded-lg flex justify-center">
                  <img class="rounded-t-md" :src="url" :alt="product.name">
                </div>
                <div class="w-full p-5 flex flex-col justify-between">
                  <div>
                      <h1 class="mt-1 font-semibold text-lg leading-tight truncate text-gray-700">{{product.name}}</h1>
                      <div class="mt-1 text-gray-600"><h2>{{product.description}}</h2></div>
                      <div v-for="(meta, key) in product.metadata" :key="key" class="mt-1 text-gray-600">
                        <span class="font-semibold">{{key}}: </span><span>{{meta}}</span>
                      </div>
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
    const title = `${this.product.name} - Pâtisseries & Biscuits - Un Goût de Liberté`;
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
