<template>
    <div>

      <div>
        <stripe-checkout
          ref="checkoutRef"
          mode="payment"
          :pk="pk"
          :line-items="lineItems"
          :success-url="successURL"
          :cancel-url="cancelURL"
          @loading="v => loading = v"
        />
      </div>
      <div class="m-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-4">
          <div v-for="(i, id) in items" :key="id" class="border rounded-lg bg-gray-100 hover:shadow-lg">
              <div class="rounded-t-lg bg-white pt-2 pb-2">
                <img class="crop mx-auto" :src="i.images[0]">
              </div>          
              <div class="pl-4 pr-4 pb-4 pt-4 rounded-lg">
              <h4 class="mt-1 font-semibold text-base leading-tight truncate text-gray-700">{{i.name}}</h4>
              <div class="mt-1 text-sm text-gray-700">ID: {{id}}</div>
              <div class="mt-1 text-sm text-gray-700">Quantity: {{i.quantity}}</div>
              </div>
          </div>
      </div>
      <div class="flex items-center justify-center">
          <button class="text-center shadow-md rounded-md border-gray-500 border-2" @click="submit">
            <span class="m-4 font-semibold text-sm text-orange-500">
            Procéder au paiement
            </span>
          </button>
      </div>
    </div>
</template>

<script>
export default {
  data() {
    this.pk = process.env.STRIPE_PK;
    const lineItems = Object.keys(this.$store.state.cart.items).map(k => ({
      price: this.$store.state.cart.items[k].price,
      quantity: this.$store.state.cart.items[k].quantity
    }));
    return {
      lineItems,
      successURL: process.env.hostname,
      cancelURL: process.env.hostname,
    }
  },
  async asyncData({ store }) {
    return {
      items: store.state.cart.items,
    }
  },
  methods: {
    submit () {
      this.$refs.checkoutRef.redirectToCheckout();
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
