<template>
  <div class="custom-number-input h-10 w-32">
    <div class="flex flex-row h-10 w-full rounded-lg relative bg-transparent">
      <button v-on:click.prevent="decrement" v-bind:disabled="value<=0" class=" bg-gray-100 text-gray-600 hover:text-gray-700 hover:bg-gray-400 h-full w-20 rounded-l cursor-pointer outline-none">
        <span class="m-auto text-2xl font-thin">−</span>
      </button>
      <input class="outline-none focus:outline-none text-center w-full font-semibold text-xl hover:text-black focus:text-black  md:text-basecursor-default flex items-center text-gray-700 " name="custom-input-number" v-model.number="input"/>
      <button v-on:click.prevent="increment" class="bg-gray-100 text-gray-600 hover:text-gray-700 hover:bg-gray-400 h-full w-20 rounded-r cursor-pointer">
        <span class="m-auto text-2xl font-thin">+</span>
      </button>
    </div>
  </div>


</template>

<style>
  input[type='number']::-webkit-inner-spin-button,
  input[type='number']::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  .custom-number-input input:focus {
    outline: none !important;
  }

  .custom-number-input button:focus {
    outline: none !important;
  }
</style>


<script>
  export default {
    name: 'inputNumber',
    props: ['value'],
    computed: {
      input: {
        get() {
          return this.value
        },
        set(v) {
          this.$emit('input', v)
        }
      }
    },
    methods: {
      increment() {
        this.$emit('input', this.value + 1)
      },
      decrement() {
        this.$emit('input', this.value - 1)
      }
    }
  }
</script>