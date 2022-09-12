<template>

<div class="h-full">
  <div id="carouselExampleIndicators" class="carousel slide relative" data-bs-ride="carousel">
    <div class="carousel-indicators absolute right-0 bottom-0 left-0 flex justify-center p-0 mb-4">
      <!-- <button
        type="button"
        data-bs-target="#carouselExampleIndicators"
        data-bs-slide-to="0"
        class="active"
        aria-current="true"
        aria-label="Slide 1"
      ></button>
      <button
        type="button"
        data-bs-target="#carouselExampleIndicators"
        data-bs-slide-to="1"
        aria-label="Slide 2"
      ></button> -->
    </div>

    <div class="carousel-inner relative w-full overflow-hidden object-center">
      <div class="carousel-item active float-left w-full h-96 bg-orange-300">
        <nuxt-img
          src="https://images.unsplash.com/photo-1483695028939-5bb13f8648b0?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8"
          class="block w-full h-full object-cover mx-auto"
        />
        <div
            class="absolute top-0 right-0 bottom-0 left-0 w-full h-full overflow-hidden bg-fixed"
            style="background-color: rgba(0, 0, 0, 0.6)"
          >
          <div class="flex justify-center items-center h-full">
            <div class="text-white">
              <h2 style="font-family: 'Hay Billy', sans-serif;" class="font-semibold text-4xl mb-4">Un Goût de Libertè</h2>
              <h4 class="font-semibold text-2xl">Pâtisserie Biscuiterie</h4>
              <h5 class="font-semibold text-lg mb-6">43380 CHILHAC</h5>
              <a
                class="mx-2 inline-block px-7 py-3 mb-1 border-2 border-gray-200 text-gray-200 font-medium text-sm leading-snug uppercase rounded hover:bg-black hover:bg-opacity-5 focus:outline-none focus:ring-0 transition duration-150 ease-in-out"
                href="#products"
                role="button"
                data-mdb-ripple="true"
                data-mdb-ripple-color="light"
                >Mes produits</a
              >
              <a
                class="mx-2 inline-block px-7 py-3 mb-1 border-2 border-gray-200 text-gray-200 font-medium text-sm leading-snug uppercase rounded hover:bg-black hover:bg-opacity-5 focus:outline-none focus:ring-0 transition duration-150 ease-in-out"
                href="#about"
                role="button"
                data-mdb-ripple="true"
                data-mdb-ripple-color="light"
                >A propos</a
              >
            </div>
          </div>
        </div>
      </div>
      <!-- <div class="carousel-item float-left w-full h-96 bg-orange-300">
        <nuxt-img
          src="https://images.unsplash.com/photo-1569864358642-9d1684040f43?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8bWFjYXJvbnxlbnwwfHwwfHw%3D"
          class="block w-full h-full object-cover"
        />
        <div
            class="absolute top-0 right-0 bottom-0 left-0 w-full h-full overflow-hidden bg-fixed"
            style="background-color: rgba(0, 0, 0, 0.6)"
          >
        </div>
      </div> -->
    </div>
    <!-- <button
      class="carousel-control-prev absolute top-0 bottom-0 flex items-center justify-center p-0 text-center border-0 hover:outline-none hover:no-underline focus:outline-none focus:no-underline left-0"
      type="button"
      data-bs-target="#carouselExampleIndicators"
      data-bs-slide="prev"
    >
      <span class="carousel-control-prev-icon inline-block bg-no-repeat" aria-hidden="true"></span>
      <span class="visually-hidden">Previous</span>
    </button>
    <button
      class="carousel-control-next absolute top-0 bottom-0 flex items-center justify-center p-0 text-center border-0 hover:outline-none hover:no-underline focus:outline-none focus:no-underline right-0"
      type="button"
      data-bs-target="#carouselExampleIndicators"
      data-bs-slide="next"
    >
      <span class="carousel-control-next-icon inline-block bg-no-repeat" aria-hidden="true"></span>
      <span class="visually-hidden">Next</span>
    </button> -->
  </div>
</div>



</template>

<style scoped>
  @import 'tw-elements/dist/css/index.min.css';
  @import url('http://fonts.cdnfonts.com/css/hay-billy');

  

</style>

<script setup>
</script>