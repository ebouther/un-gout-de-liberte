<template>
    <div class="max-w-screen-lg mx-auto">
      <div class="text-center mb-2">
        <!-- <h1 class="font-bold text-3xl font-mono text-yellow-500">Mon Panier</h1>
        <br/> -->
        <h2 class="font-bold text-xl font-mono  text-gray-700"><span>Total: {{totalPrice}} €</span></h2>
        <span class="text-gray-500">* frais de transport non-inclus</span>
      </div>
      <br>
      <div class="flex items-center justify-center">
          <button class="bg-yellow-500 text-center shadow-md hover:shadow-none hover:border-black rounded-md border-gray-500 border-2" @click="submit">
            <span class="text-lg m-4 font-semibold text-black">
            Procéder au paiement
            </span>
          </button>
      </div>
      <br>
      <!-- <div v-if="!items || !items.length" class="text-center"><br/><span class="text-gray-700">Le panier est vide.</span></div> -->
      <div class="m-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-4">
          <div v-for="(i, id) in items" :key="id" class="overflow-hidden flex flex-col border rounded-lg bg-gray-100">
              <div class="py-4 rounded-lg text-center">
                <h4 class="mt-1 font-semibold text-base leading-tight truncate text-gray-700">{{i.name}}</h4>
                <div v-if="i.description" class="mt-1 text-sm text-gray-700"><span>{{i.description}}</span></div>
              </div>
              <div class="bg-white mt-auto">
                <img class="object-cover h-48 w-full" :src="imgSrc(`${dirname(i._path)}/img/small.jpg`)" :alt="i.name">
              </div>          
              <div class="grid grid-cols-3 grid-flow-col">
                <span class="mx-auto inline-flex items-center text-2xl" >{{(i.price.amount * i.quantity).toFixed(2)}} {{i.price.currency}}</span>
                <InputNumber class="m-auto border p-0" v-bind:value="i.quantity" v-on:input="q => updateItems(id, q)" />
                <button v-on:click="removeItem(id)" class="m-2 rounded-md p-3 bg-gray-50">Supprimer</button>

              </div>
              <!-- <div class="border-t w-full mt-auto flex flex-row justify-between text-sm text-gray-700">
                <span class="mx-auto inline-flex items-center text-2xl" >{{(i.price.amount * i.quantity).toFixed(2)}} {{i.price.currency}}</span>
                <InputNumber class="m-auto border p-0" v-bind:value="i.quantity" v-on:input="q => updateItems(id, q)" />
                <button v-on:click="removeItem(id)" class="m-2 bg-red-600 rounded-md p-3">X</button>
              </div> -->
              <!-- <InputNumber v-model="i.quantity"/> -->
          </div>
      </div>
    </div>
</template>

<script setup>
import InputNumber from '~/components/inputNumber'
import { useStore } from '~/store/cart'

const cart = useStore()

const items = cart.items
console.log('ITEMS : ', items)

const totalPrice = computed(() => {
  if (!Object.keys(cart.items).length) return 0;

  return Object.values(cart.items)
          .reduce((acc, i) => acc + i.price.amount * i.quantity, 0)
          .toFixed(2);
})

function updateItems (productId, q) {

  if (q === '' || Number(q) === NaN) return;

  if (q <= 0) {
    return this.removeItem(productId)
  }

  cart.updateQuantity({
    id: productId,
    quantity: q 
  })
}
function removeItem (productId) {
  cart.removeItem(productId)
}

function imgSrc(src) {
  const imgs = import.meta.globEager('/content/**/*.{png,jpg}');

  return imgs[`/content${src}`].default
}
function dirname(p) {
  // return path.dirname(p)
  return p.substr(0, p.lastIndexOf("/"));
}
async function submit() {
  const res = await $fetch('/api/order', {
    method: 'POST',
    body: {
      items: Object.keys(cart.items).map(k => ({
        price: cart.items[k].price.id,
        quantity: cart.items[k].quantity
      }))
    }
  });

  console.log('RES : ', res);

  window.location.href = res.url;
}

//export default {
//  components: {
//    InputNumber
//  },
//  async asyncData() {
//
//  },
//
//  data: () => ({
//    items: [],
//    totalPrice: []
//  }),
//
//  //computed: {
//  //  ...mapGetters({}),
//  //  ...mapState({
//  //    items: (state) => state.cart.items,
//  //    totalPrice: (state) => {
//  //      if (!Object.keys(state.cart.items).length) return 0;
//
//  //      return Object.values(state.cart.items)
//  //              .reduce((acc, i) => acc + i.price.amount * i.quantity, 0)
//  //              .toFixed(2);
//  //    },
//  //  }),
//  //},
//
//  mounted() {
//
//  },
//
//  methods: {


//    async submit () {
//      //this.$refs.checkoutRef.redirectToCheckout();
//      const res = await this.$axios.$post('/api/order', {
//        items: Object.keys(this.$store.state.cart.items).map(k => ({
//          price: this.$store.state.cart.items[k].price.id,
//          quantity: this.$store.state.cart.items[k].quantity
//        }))
//      });
//
//      console.log('RES : ', res);
//
//      window.location.href = res.url;
//    },
//    imgSrc(src) {
//      const imgs = import.meta.globEager('/content/**/*.{png,jpg}');
//
//      return imgs[`/content${src}`].default
//    },
//  },
//  head() {
//    const title = `Mon Panier`;
//    return {
//      title,
//      meta: [{
//        hid: 'title',
//        name: 'title',
//        content: `${title} - Pâtisseries & Biscuits - Un Goût de Liberté`,
//      }, {
//        hid: 'description',
//        name: 'description',
//        content: `Mon Panier - Un Goût de Liberté - Vente en Ligne de Pâtisseries et Biscuits artisanaux faits à CHILHAC (43380) par Justine DUMESNIL`,
//      }]
//    }
//  }
//}
</script>

<style>
.crop {
  width: 180px;
  height: 180px;
}
</style>
