<template>
    <div class="mx-auto flex justify-center m-6" style="max-height: 70vh;">
        <div v-if="product !== null">
            <div class="max-w-screen-xl h-full grid grid-flow-row md:grid-flow-col rounded-lg bg-gray-100 ">
                <div class="min-w-0 min-h-0 bg-white rounded-lg  h-full w-full" >
                  <img class="w-full object-cover min-h-0 min-w-0 rounded-t-md md:rounded-l-md md:rounded-r-none mx-auto h-full" :src="imgSrc(`${dirname(product._path)}/img/small.jpg`)" :alt="product.name">
                </div>
                <div class="w-full h-full p-5 flex flex-col justify-between mt-auto flex-auto">
                  <div>
                      <h1 class="font-bold text-xl leading-tight truncate text-gray-700">{{product.name}}</h1>
                      <div class="text-gray-600"><h2>{{product.description}}</h2></div>
                      <hr class="my-5 border-yellow-400" />
                      <div class="text-gray-600">
                        <span class="font-semibold">Ingrédients : </span><span>{{product.ingredients}}</span>
                        <br/>
                        <span class="font-semibold">* : </span><span>Produits issus de l'agriculture biologique.</span>
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
                        @click="addToCart(product.id)">
                        Ajouter au panier
                    </button>
                  </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useStore } from '~/store/cart'

const route = useRoute()
const router = useRouter()
const cart = useStore()

await cart.load(); // TODO rm

console.log('PARAM', route.params.id)
const product = await getProduct();

console.log('PRODUCt', product)

async function getProduct () {
  return queryContent('products')
  .where({
   _id: route.params.id
  })
  .sort('name')
  .findOne()
}

function dirname(p) {
  // return path.dirname(p)
  return p.substr(0, p.lastIndexOf("/"));
}
function imgSrc(src) {
  const imgs = import.meta.globEager('/content/**/*.{png,jpg}');
  console.log('SRC :', imgs)
  console.log('SRC :', src)
  console.log('SRC :', imgs[`/content${src}`])

  return imgs[`/content${src}`].default
}
function addToCart(productId) { 
  console.log('CART : ', cart)
  cart.addItem(productId);
  console.log('PRODUCTS : ', cart.products)
  console.log('ITEMS : ', cart.items)
  // this.$store.commit('cart/add', productId)
  router.push({ path: "/panier" })
}

// import { mapState, mapGetters } from 'vuex'

// export default {
  // auth: false,

  // data: () => ({
    // product: null
  // }),
  // async fetch() {
    // const product = await this.getProduct();
    // console.log('PRODUCT : ', product)
    // return {
      // product
    // }
  // },

  // //computed: {
  // //  ...mapGetters({}),
  // //  ...mapState({
  // //    product: function (state) {
  // //      return state.cart.products.find(p => p.td === this.$nuxt.$route.params.id)
  // //    }
  // //  })
  // //},

  // // async asyncData ({ store }) {
  // //   await store.dispatch('cart/load')
  // // },

  // methods: {
    // async getProduct() {
      // return queryContent('products')
      // .where({
        // _id: this.$route.params.id
      // })
      // .sort('name')
      // .find()
    // },
    // imgSrc(src) {
      // try {
        // return require(`~/content${src}`)
      // } catch (error) {
        // return null
      // }
    // },
    // addToCart () {
      // this.$store.commit('cart/add', this.$route.params.id)
      // this.$router.push('/panier')
    // },
  // },
  // head() {
    // const title = `${this.product.name} - Un Goût de Liberté`;
    // return {
      // title: title,
      // meta: [{
        // hid: 'title',
        // name: 'title',
        // content: title,
      // }, {
        // hid: 'description',
        // name: 'description',
        // content: `${this.product.name} - Un Goût de Liberté - Pâtisserie & Biscuiterie artisanale - Justine DUMESNIL - 43380 CHILHAC | ${this.product.description}`,
      // }]
    // }
  // }
// }
</script>

<style>
</style>