<template>
    <div class="px-5 lg:max-w-screen-lg mx-auto">
      <div class="text-center mb-2">
        <h1 class="font-bold text-3xl font-mono text-yellow-500">Réalisations</h1>
        <br/>
        <div class="block whitespace-pre-line text-gray-700 text-justify">
          <h2 class="text-xl font-bold font-mono">Mes réalisations</h2>
          <br/>
          <div v-for="(article, id) in articles" :key="id" class="grid grid-cols-1 divide-y">
            <div class="border">
              {{article.title}}
              <br>
              {{article.description}}
            </div>
            <nuxt-content :document="article" class="border" />
            <br>
            <br>
            <br>
            <br>
          </div>
        </div>
    </div>
  </div>
</template>

<script>
export default {
  head() {
    const title = `Réalisations - Pâtisseries & Biscuits - Un Goût de Liberté`;
    return {
      title: title,
      meta: [{
        hid: 'title',
        name: 'title',
        content: title,
      }, {
        hid: 'description',
        name: 'description',
        content: `Réalisations - Un Goût de Liberté - Vente en Ligne de Pâtisseries et Biscuits artisanaux faits à CHILHAC (43380) par Justine DUMESNIL`,
      }]
    }
  },
  async asyncData({$content}) {
    const articles = await $content('articles').sortBy('date').fetch()
    console.log(articles);

    return {
      articles
    }
  }
}
</script>

<style>
.crop {
  width: 180px;
  height: 180px;
}
</style>
