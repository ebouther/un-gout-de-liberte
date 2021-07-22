<template>
    <div class="max-w-screen-lg mx-auto">
      <div class="text-center mb-2">
        <h1 class="font-bold text-3xl font-mono text-yellow-500">Mon Panier</h1>
        <br/>
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
              <div class="rounded-t-lg bg-white">
                <img class="object-cover h-48 w-full rounded-t-lg" :src="i.images[0]" :alt="i.name">
              </div>          
              <div class="pl-4 pr-4 pb-4 pt-4 rounded-lg">
                <h4 class="mt-1 font-semibold text-base leading-tight truncate text-gray-700">{{i.name}}</h4>
                <div  class="mt-1 text-sm text-gray-700"><span>{{i.description}}</span></div>
              </div>
              <div class="border bg-yellow-100 w-full mt-auto flex justify-between text-sm text-gray-700">
                <!-- <InputNumber v-bind:value="lookupItemQuantity(id)" v-on:input="q => updateItems(id, q)" /> -->
                <div class="inline-flex">
                  <label class=" ml-2 self-center" for="quantity">Quantité:</label>
                  <input id="quantity" class="mx-2 my-4 w-16 e text-center rounded-md shadow-outline font-semibold text-md hover:text-black focus:text-black  md:text-basecursor-default flex items-center text-gray-700 "
                  name="custom-input-number" v-bind:value="lookupItemQuantity(id)" v-on:input="updateItems(id, $event.target.value)" type="number"/>
                </div>
                <button v-on:click="removeItem(id)" class="m-2 bg-red-600 rounded-md p-3">X</button>
              </div>
              <!-- <InputNumber v-model="i.quantity"/> -->
          </div>
      </div>
    </div>
</template>

<script>
import InputNumber from '~/components/inputNumber'
import { mapState, mapGetters } from 'vuex'

export default {
  components: {
    InputNumber
  },
  async asyncData() {

  },

  computed: {
    ...mapGetters({}),
    ...mapState({
      items: (state) => state.cart.items,
      totalPrice: (state) => {
        if (!Object.keys(state.cart.items).length) return 0;

        return Object.values(state.cart.items)
                .reduce((acc, i) => acc + i.price.amount * i.quantity, 0);
      },
    }),
  },

  mounted() {

  },

  methods: {
    lookupItemQuantity (productId) {
      const q = this.$store.state.cart.items[productId].quantity
      console.log('LOOKUP ', q)
      return q
    },
    updateItems (productId, q) {
      console.log('UPDATE', q)
      this.$store.dispatch('cart/updateQuantity', {
        id: productId,
        quantity: q 
      })
    },
    removeItem (productId) {
      this.$store.dispatch('cart/removeItem', productId)
    },
    async submit () {
      //this.$refs.checkoutRef.redirectToCheckout();
      const res = await this.$axios.$post('/api/order', {
        items: Object.keys(this.$store.state.cart.items).map(k => ({
          price: this.$store.state.cart.items[k].price.id,
          quantity: this.$store.state.cart.items[k].quantity
        }))
      });

      console.log('RES : ', res);

      window.location.href = res.url;
    },
  },
  head() {
    const title = `Mon Panier`;
    return {
      title,
      meta: [{
        hid: 'title',
        name: 'title',
        content: `${title} - Pâtisseries & Biscuits - Un Goût de Liberté`,
      }, {
        hid: 'description',
        name: 'description',
        content: `Mon Panier - Un Goût de Liberté - Vente en Ligne de Pâtisseries et Biscuits artisanaux faits à CHILHAC (43380) par Justine DUMESNIL`,
      }]
    }
  }
}
</script>

<style>
.crop {
  width: 180px;
  height: 180px;
}
</style>
