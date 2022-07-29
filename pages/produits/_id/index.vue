<template>
    <div class="mx-auto flex justify-center m-6" style="max-height: 70vh;">
        <div v-if="product !== null">
            <div class="max-w-screen-xl h-full grid grid-flow-row md:grid-flow-col rounded-lg bg-gray-100 ">
                <div class="min-w-0 min-h-0 bg-white rounded-lg  h-full w-full" >
                  <img class="w-full object-cover min-h-0 min-w-0 rounded-t-md md:rounded-l-md md:rounded-r-none mx-auto h-full" :src="imgSrc(`${product.dir}/img/small.jpg`)" :alt="product.name">
                </div>
                <div class="w-full h-full p-5 flex flex-col justify-between mt-auto flex-auto">
                  <div>
                      <h1 class="font-bold text-xl leading-tight truncate text-gray-700">{{product.name}}</h1>
                      <div class="text-gray-600"><h2>{{product.description}}</h2></div>
                      <hr class="my-5 border-yellow-400" />
                      <div class="text-gray-600">
                        <span class="font-semibold">Ingrédients : </span><span>{{product.ingredients}}</span>
                        <br/>
                        <span class="font-semibold">* : </span><span>Produits issus de l’agriculture biologique.</span>
                        <br />
                        <span class="font-semibold">° : </span><span>Produits locaux.</span>
                        <br />
                        <span class="font-semibold">Allergènes : </span><span>{{product.allergens}}</span>
                        <br />
                        <span class="font-semibold">Poids : </span><span>{{product.weight}} g</span>
                      </div>
                  </div>
                  <hr class="my-5 border-yellow-400" />
                  <div class="flex flex-row justify-between text-gray-700">
                    <span class="mx-8 inline-flex items-center text-2xl font-bold">{{product.price.amount}} {{product.price.currency}}</span>
                    <button
                        class="grow bg-white border border-gray-200 hover:shadow-none hover:border-yellow-500 font-semibold py-2 px-4 shadow-md rounded"
                        @click="addToCart">
                        Ajouter au panier
                    </button>
                  </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
// import { mapState, mapGetters } from 'vuex'

export default {
  auth: false,

  data: () => ({
    products: []
  }),

  //computed: {
  //  ...mapGetters({}),
  //  ...mapState({
  //    product: function (state) {
  //      return state.cart.products.find(p => p.id === this.$nuxt.$route.params.id)
  //    }
  //  })
  //},

  // async asyncData ({ store }) {
  //   await store.dispatch('cart/load')
  // },

  methods: {
    imgSrc(src) {
      try {
        return require(`~/content${src}`)
      } catch (error) {
        return null
      }
    },
    addToCart () {
      this.$store.commit('cart/add', this.$route.params.id)
      this.$router.push('/panier')
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
