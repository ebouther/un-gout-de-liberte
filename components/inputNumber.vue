<template>
  <div class="custom-number-input h-10 w-32">
    <div class="flex flex-row h-10 w-full rounded-lg relative bg-transparent mt-1">
      <button v-on:click="count--" v-bind:disabled="count<1" class=" bg-gray-300 text-gray-600 hover:text-gray-700 hover:bg-gray-400 h-full w-20 rounded-l cursor-pointer outline-none">
        <span class="m-auto text-2xl font-thin">−</span>
      </button>
      <input class="outline-none focus:outline-none text-center w-full bg-gray-300 font-semibold text-md hover:text-black focus:text-black  md:text-basecursor-default flex items-center text-gray-700 " name="custom-input-number" v-model.number="count"></input>
      <button v-on:click="count++" class="bg-gray-300 text-gray-600 hover:text-gray-700 hover:bg-gray-400 h-full w-20 rounded-r cursor-pointer">
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
      count: {
        get() {
          return this.value
        },
        set(v) {
          console.log('VALUE ', v)
          this.$emit('input', v) 
        }
      }
    }
  }
</script>