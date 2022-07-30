<template>

<div class="h-full">
  <div id="carouselExampleIndicators" class="carousel carousel-dark carousel-fade relative" data-bs-ride="carousel">
    <div class="carousel-indicators absolute right-0 bottom-0 left-0 flex justify-center p-0 mb-4">
      <button
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
      ></button>
      <button
        type="button"
        data-bs-target="#carouselExampleIndicators"
        data-bs-slide-to="2"
        aria-label="Slide 3"
      ></button>
    </div>
    <div class="carousel-inner relative w-full overflow-hidden h-72">
      <div class="carousel-item active float-left w-full">
        <img
          src="https://mdbcdn.b-cdn.net/img/new/slides/043.webp"
          class="block w-full"
          alt="Wild Landscape"
        />
      </div>
      <div class="carousel-item float-left w-full">
        <img
          src="~/assets/slide2.jpg"
          class="block w-full"
          alt="Camera"
        />
      </div>
      <div class="carousel-item float-left w-full">
        <img
          src="~/assets/slide1.jpg"
          class="block w-full"
          alt="Exotic Fruits"
        />
      </div>
    </div>
    <button
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
    </button>
  </div>
  </div>



</template>

<style>

      .swiper-slide {
        text-align: center;
        font-size: 18px;
        background: #fff;

        /* Center slide text vertically */
        display: -webkit-box;
        display: -ms-flexbox;
        display: -webkit-flex;
        display: flex;
        -webkit-box-pack: center;
        -ms-flex-pack: center;
        -webkit-justify-content: center;
        justify-content: center;
        -webkit-box-align: center;
        -ms-flex-align: center;
        -webkit-align-items: center;
        align-items: center;
      }

      .swiper-slide img {
        display: block;
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
</style>

<script setup>
  import { Navigation, Pagination, Autoplay } from "swiper"
  import { Swiper, SwiperSlide } from 'swiper/vue'

  import "swiper/css"
  import "swiper/css/navigation"
  import "swiper/css/pagination"


  let engine;

  //export default defineComponent({
  //  name: 'carousel',
  //  components: { Swiper, SwiperSlide },
  //  props: [],
  //  async fetch() { },
  //  async setup() {
  //    return {
  //      modules: [Navigation, Pagination]
  //    };
  //  },
      console.log('=========== SETUP')
    onMounted(() => {
      console.log('=========== MOUNTED')
      console.log(document.cookie)

      Swiper.use([Pagination, Autoplay, Navigation])

      const swiperOptions = {
        spaceBetween: 30,
        loop: true,
        loopFillGroupWithBlank: true,
        autoHeight: false,
        width: 600,
        autoplay: true,
        centeredSlides: true,
        enabled: true,
        observeSlideChildren: true,
        pagination: {
          el: ".swiper-pagination",
          clickable: true,
        },
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        },
      }

      nextTick(() => {
        engine = new Swiper('.swiper', swiperOptions);
      });
    })

    onBeforeUnmount(() => {
      engine?.destroy?.();
    })
    // async mounted() {
    //   //await this.$nextTick();

    //   console.log('===> REF', this.$refs.swiper)
    //   const sw = new Swiper(this.$refs.swiper, {
    //     autoHeight: false,
    //     spaceBetween: 30,
    //     centeredSlides: true,
    //     autoplay: {
    //       delay: 5000,
    //       disableOnInteraction: false,
    //     },
    //     //pagination: {
    //     //  el: ".swiper-pagination",
    //     //  clickable: true,
    //     //},
    //     //navigation: {
    //     //  nextEl: ".swiper-button-next",
    //     //  prevEl: ".swiper-button-prev",
    //     //},
    //   });
    //   console.log('SWIPER : ', sw);
    // },
  //   methods: {
  //   
  // })
</script>