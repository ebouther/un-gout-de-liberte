<template>
  <div>
    <NuxtLayout>
      <NuxtPage/>
    </NuxtLayout>
  </div>
</template>

<style>
html {
  @apply scroll-smooth
}
</style>

<script setup>
import './assets/css/tailwind.css'

// Configuration SEO globale
useHead({
  htmlAttrs: {
    lang: 'fr'
  },
  meta: [
    { name: 'robots', content: 'index, follow' },
    { name: 'googlebot', content: 'index, follow' },
    { name: 'format-detection', content: 'telephone=no' }
  ]
})
</script>