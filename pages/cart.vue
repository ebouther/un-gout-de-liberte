<template>
    <div>
      <div class="text-center mb-2">
        <h1 class="font-bold text-3xl font-mono text-orange-500">Panier</h1>
      </div>
      <div class="m-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-4">
          <div v-for="(i, id) in items" :key="id" class="border rounded-lg bg-gray-100">
              <div class="rounded-t-lg bg-white">
                <img class="object-cover h-48 w-full rounded-t-lg" :src="i.images[0]" :alt="i.name">
              </div>          
              <div class="pl-4 pr-4 pb-4 pt-4 rounded-lg">
                <h4 class="mt-1 font-semibold text-base leading-tight truncate text-gray-700">{{i.name}}</h4>
                <div  class="mt-1 text-sm text-gray-700"><span>{{i.description}}</span></div>
                <div class="flex justify-between mt-1 text-sm text-gray-700">
                  <InputNumber v-bind:value="lookupItemQuantity(id)" v-on:input="q => updateItems(id, q)" />
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
      <div>
        <!-- <stripe-checkout
          ref="checkoutRef"
          mode="payment"
          :pk="pk"
          :line-items="lineItems"
          :success-url="successURL"
          :cancel-url="cancelURL"
          @loading="v => loading = v"
        /> -->
      </div>
    </div>
</template>

<script>
import InputNumber from './../components/inputNumber'

export default {
  components: {
    InputNumber
  },
  async asyncData({store, env}) {
    //await store.dispatch('cart/fetchProducts')
    //await store.dispatch('cart/fetchPrices')

    //this.$auth.loginWith('social')

    const lineItems = Object.keys(store.state.cart.items).map(k => ({
      price: store.state.cart.items[k].price,
      quantity: store.state.cart.items[k].quantity
    }));

    return {
     items: store.state.cart.items,
      lineItems,
      successURL: env.hostname,
      cancelURL: env.hostname,
      pk: env.STRIPE_PK
    }
  },
  methods: {
    lookupItemQuantity (productId) {
      const q = this.$store.state.cart.items[productId].quantity
      console.log('GET ', q)
      return q
    },
    updateItems (productId, q) {
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
      const res = await this.$axios.$post('/api/order', { items: this.lineItems });
      console.log('RES : ', res);

      window.location.href = res.url;
    },
  },
}
</script>

<style>
.crop {
  width: 180px;
  height: 180px;
}
</style>
