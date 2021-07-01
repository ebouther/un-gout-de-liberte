<template>
  <div class="flex justify-between ml-6 mr-6 mt-4">
    <nuxt-link to="/">
      <Home />
      <span class="ml-3 font-semibold text-sm text-indigo-500"></span>
    </nuxt-link>

    <nuxt-link to="/cart" class="flex items-center">
        <Cart />
        <span class="ml-3 font-semibold text-sm text-indigo-500"></span>
    </nuxt-link>
  </div>
</template>
<script>
import Cart from "./icons/cart.vue"
import Home from "./icons/home.vue"

export default {
    components: {
      Cart,
      Home 
    }
}
</script>

<style>
  .emoji {
    font-size: 30px;
  }
</style>
