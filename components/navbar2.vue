<template>
  <div class="bg-white">
    <header class="relative bg-white">
      <nav aria-label="Top" class="max-w-7xl mx-auto px-6 lg:px-8">
        <div class="border-b border-gray-200 px-4 pb-0">
          <div class="h-16 flex items-center justify-between">
            <!-- Logo -->
            <div class="flex-1 flex">
              <a href="/">
                <img class="h-12 w-auto" src="~/assets/logo.png" alt="" />
              </a>
            </div>

            <!-- <div class="hidden flex-1 sm:flex items-center justify-center px-2 lg:ml-6 lg:justify-end">
              <div class="max-w-lg w-full lg:max-w-xs">
                <label for="search" class="sr-only">Rechercher</label>
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <SearchIcon class="h-5 w-5 text-gray-400" aria-hidden="true" />
                  </div>
                  <input id="search" name="search" class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-amber-500 focus:border-amber-500 sm:text-sm" placeholder="Rechercher" type="search" />
                </div>
              </div>
            </div> -->
            

            <div class="flex-1 flex items-center justify-end">
              <!-- Cart -->
              <div class="ml-4 flow-root lg:ml-8">
                <button @click="openCart" class="group -m-2 p-2 flex items-center relative">
                    <ShoppingBagIcon class="flex-shrink-0 h-8 w-8 text-gray-400 group-hover:text-gray-500" aria-hidden="true" />
                    <!-- <span class="ml-2 text-md font-medium text-gray-700 group-hover:text-gray-800">{{nbOfItems}}</span> -->
                    <div v-if="cart.nbOfItems > 0" class="inline-flex absolute top-0 -right-2 justify-center items-center w-6 h-6 text-xs font-bold text-white bg-red-500 rounded-full border-2 border-white dark:border-gray-900">{{cart.nbOfItems}}</div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  </div>
</template>

<script>
import { Popover, PopoverButton, PopoverGroup, PopoverPanel } from '@headlessui/vue'
import { SearchIcon, ShoppingBagIcon } from '@heroicons/vue/outline'

import { useStore } from '~/store/cart'

const navigation = {
  categories: [
    {
      name: 'Women',
      clothing: [
        [
          { name: 'Tops', href: '#' },
          { name: 'Dresses', href: '#' },
          { name: 'Pants', href: '#' },
          { name: 'Denim', href: '#' },
          { name: 'Sweaters', href: '#' },
          { name: 'T-Shirts', href: '#' },
        ],
        [
          { name: 'Jackets', href: '#' },
          { name: 'Activewear', href: '#' },
          { name: 'Shorts', href: '#' },
          { name: 'Swimwear', href: '#' },
          { name: 'Browse All', href: '#' },
        ],
      ],
      accessories: [
        { name: 'Shoes', href: '#' },
        { name: 'Jewelry', href: '#' },
        { name: 'Handbags', href: '#' },
        { name: 'Socks', href: '#' },
        { name: 'Hats', href: '#' },
        { name: 'Browse All', href: '#' },
      ],
      categories: [
        { name: 'New Arrivals', href: '#' },
        { name: 'Sale', href: '#' },
        { name: 'Basic Tees', href: '#' },
        { name: 'Artwork Tees', href: '#' },
      ],
    },
    {
      name: 'Men',
      clothing: [
        [
          { name: 'Dress Shirts', href: '#' },
          { name: 'Pants', href: '#' },
          { name: 'Jackets', href: '#' },
          { name: 'T-Shirts', href: '#' },
          { name: 'Jeans', href: '#' },
          { name: 'Hoodies', href: '#' },
        ],
        [
          { name: 'Vests', href: '#' },
          { name: 'Kilts', href: '#' },
          { name: 'Outdoors', href: '#' },
          { name: 'Capes', href: '#' },
          { name: 'Browse All', href: '#' },
        ],
      ],
      accessories: [
        { name: 'Watches', href: '#' },
        { name: 'Boots', href: '#' },
        { name: 'Fanny Packs', href: '#' },
        { name: 'Sunglasses', href: '#' },
        { name: 'Browse All', href: '#' },
      ],
      categories: [
        { name: 'Just Added', href: '#' },
        { name: 'Clearance', href: '#' },
        { name: 'Graphic Tees', href: '#' },
      ],
    },
  ],
  other: [
    { name: 'Company', href: '#' },
    { name: 'Stores', href: '#' },
  ],
}

export default {
  components: {
    Popover,
    PopoverButton,
    PopoverGroup,
    PopoverPanel,
    SearchIcon,
    ShoppingBagIcon,
  },
  setup() {
    const cart = useStore()

    return {
      cart,
      navigation,
      openCart: cart.open,
    }
  },
}
</script>