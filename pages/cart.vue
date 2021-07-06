<template>
    <div class="max-w-screen-lg mx-auto">
      <div class="text-center mb-2">
        <h1 class="font-bold text-3xl font-mono text-orange-500">Panier</h1>
      </div>
      <!-- <div v-if="!items || !items.length" class="text-center"><br/><span class="text-gray-700">Le panier est vide.</span></div> -->
      <div class="m-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-4">
          <div v-for="(i, id) in items" :key="id" class="border rounded-lg bg-gray-100">
              <div class="rounded-t-lg bg-white">
                <img class="object-cover h-48 w-full rounded-t-lg" :src="i.images[0]" :alt="i.name">
              </div>          
              <div class="pl-4 pr-4 pb-4 pt-4 rounded-lg">
                <h4 class="mt-1 font-semibold text-base leading-tight truncate text-gray-700">{{i.name}}</h4>
                <div  class="mt-1 text-sm text-gray-700"><span>{{i.description}}</span></div>
                <div class="flex justify-between mt-1 text-sm text-gray-700">
                  <!-- <InputNumber v-bind:value="lookupItemQuantity(id)" v-on:input="q => updateItems(id, q)" /> -->
                  <label class="self-center" for="quantity">Quantity:</label>
                  <input id="quantity" class="outline-none focus:outline-none text-center w-full bg-gray-300 font-semibold text-md hover:text-black focus:text-black  md:text-basecursor-default flex items-center text-gray-700 "
                  name="custom-input-number" v-bind:value="lookupItemQuantity(id)" v-on:input="updateItems(id, $event.target.value)"> </input>
                  <button v-on:click="removeItem(id)" class="bg-red-600 rounded-full p-3">X</button>
                </div>
                <!-- <InputNumber v-model="i.quantity"/> -->
              </div>
          </div>
      </div>
      <div class="flex items-center justify-center">
          <button class="text-center shadow-md hover:shadow-none hover:border-orange-500 rounded-md border-gray-500 border-2" @click="submit">
            <span class="m-4 font-semibold text-sm text-orange-500">
            Procéder au paiement
            </span>
          </button>
      </div>
    </div>
</template>

<script>
import InputNumber from './../components/inputNumber'
//import { mapMutations } from 'vuex'

export default {
  components: {
    InputNumber
  },
  async asyncData({ env }) {
    //this.$auth.loginWith('social')

    return {
      quantity: 42,
      successURL: env.hostname,
      cancelURL: env.hostname,
      pk: env.STRIPE_PK
    }
  },
  computed: {
    items() {
      return this.$store.state.cart.items
    }
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
          price: this.$store.state.cart.items[k].price,
          quantity: this.$store.state.cart.items[k].quantity
        }))
      });

      console.log('RES : ', res);

      window.location.href = res.url;
    },
  },
  head() {
    const title = `Commande - Pâtisseries & Biscuits - Un Goût de Liberté`;
    return {
      title: title,
      meta: [{
        hid: 'title',
        name: 'title',
        content: title,
      }, {
        hid: 'description',
        name: 'description',
        content: `Passer Commande - Un Goût de Liberté - Vente en Ligne de Pâtisseries et Biscuits artisanaux faits à CHILHAC (43380) par Justine DUMESNIL`,
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
