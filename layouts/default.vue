<template>
  <div class="bg-indigo-100">
    <div class="flex justify-center">
      <div class="flex flex-col min-h-screen w-full">
        <div class="min-h-screen">
          <NavBar class="hidden md:block"/>
          <Nuxt class="flex-grow  pt-10 md:pt-0"/>
        </div>
        <BottomBar class="border-t-4 border-opacity-60 border-yellow-500 shadow-xl fixed bottom-0 w-full md:hidden"/>
        <Footer class="mb-10 md:mb-0 mt-10 " />
      </div>
    </div>
  </div>
</template>
<script>
import NavBar from '~/components/navbar'
import BottomBar from '~/components/bottombar'
import Footer from '~/components/footer'

export default {
  components: { NavBar, BottomBar, Footer }
}
</script>
<style>
@import url(https://pro.fontawesome.com/releases/v5.10.0/css/all.css);

html {
  font-family:
    'Source Sans Pro',
    -apple-system,
    BlinkMacSystemFont,
    'Segoe UI',
    Roboto,
    'Helvetica Neue',
    Arial,
    sans-serif;
  font-size: 20px;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
}

*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
}

.button--green {
  display: inline-block;
  border-radius: 4px;
  border: 1px solid #3b8070;
  color: #3b8070;
  text-decoration: none;
  padding: 10px 30px;
}

.button--green:hover {
  color: #fff;
  background-color: #3b8070;
}

.button--grey {
  display: inline-block;
  border-radius: 4px;
  border: 1px solid #35495e;
  color: #35495e;
  text-decoration: none;
  padding: 10px 30px;
  margin-left: 15px;
}

.button--grey:hover {
  color: #fff;
  background-color: #35495e;
}
</style>