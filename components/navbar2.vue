<template>
  <div class="bg-white border-b border-line">
    <header class="relative bg-white">
      <nav aria-label="Top" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="h-16 flex items-center justify-between">
          <div class="flex items-center gap-8">
            <NuxtLink to="/" class="flex-shrink-0">
              <img class="h-12 w-auto" src="/logo.png" alt="Un Goût de Liberté" />
            </NuxtLink>

            <div class="hidden md:flex items-center gap-6">
              <NuxtLink
                to="/"
                exact-active-class="text-gold"
                class="text-textbody hover:text-gold transition-colors text-sm font-medium"
              >
                Accueil
              </NuxtLink>
              <NuxtLink
                to="/blog"
                active-class="text-gold"
                class="text-textbody hover:text-gold transition-colors text-sm font-medium"
              >
                Blog
              </NuxtLink>
              <NuxtLink
                to="/contact"
                exact-active-class="text-gold"
                class="text-textbody hover:text-gold transition-colors text-sm font-medium"
              >
                Contact
              </NuxtLink>
            </div>
          </div>

          <button @click="openCart" class="group -m-2 p-2 flex items-center flex-shrink-0">
            <div class="flex flex-col text-textbody group-hover:text-gold transition-colors">
              <div class="mx-auto relative">
                <ShoppingBagIcon class="flex-shrink-0 h-8 w-8" aria-hidden="true" />
                <div
                  v-if="cart.nbOfItems > 0"
                  class="inline-flex absolute top-0 -right-4 justify-center items-center w-6 h-6 text-xs font-bold text-white bg-red-500 rounded-full border-2 border-white"
                >
                  {{ cart.nbOfItems }}
                </div>
              </div>
              <span class="font-semibold text-sm">Panier</span>
            </div>
          </button>
        </div>
      </nav>
    </header>
  </div>
</template>

<script>
import { ShoppingBagIcon } from 'heroicons-vue3/outline'
import { useStore } from '~/store/cart'

export default {
  components: {
    ShoppingBagIcon,
  },
  setup() {
    const cart = useStore()

    return {
      cart,
      openCart: cart.open,
    }
  },
}
</script>
