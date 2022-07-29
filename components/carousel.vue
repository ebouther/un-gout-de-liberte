<template>

<div>

    <div class="h-72 w-full swiper" ref="swiper">
      <div class="swiper-wrapper">
        <div class="swiper-slide">
          <img class="" src="slide3.jpg" alt="logo">
        </div>
        <div class="swiper-slide">
          <img class="" src="slide1.jpg" alt="logo">
        </div>
        <div class="swiper-slide">
          <img class="" src="slide2.jpg" alt="logo">
        </div>
      </div>
      <!-- <div class="swiper-button-next swiper-button-white"></div>
      <div class="swiper-button-prev"></div>
      <div class="swiper-pagination"></div> -->
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

<script>
  import Swiper from 'swiper/swiper-bundle.min';
  import 'swiper/swiper-bundle.min.css';
  import 'swiper/swiper.min.css';


  export default {
    name: 'carousel',
    components: { },
    props: [],
    async fetch() { },
    asyncData() {
      console.log('SWIPER', Swiper);
    },
    async mounted() {
     await this.$nextTick();

      const sw = new Swiper(this.$refs.swiper, {
        autoHeight: false,
        spaceBetween: 30,
        centeredSlides: true,
        autoplay: {
          delay: 5000,
          disableOnInteraction: false,
        },
        //pagination: {
        //  el: ".swiper-pagination",
        //  clickable: true,
        //},
        //navigation: {
        //  nextEl: ".swiper-button-next",
        //  prevEl: ".swiper-button-prev",
        //},
      });
      console.log('SWIPER : ', sw);
    },
    methods: {
      imgSrc(src) {
        try {
          return require(`~/content${src}`)
        } catch (error) {
          return null
        }
      },
    }
    
  }
</script>