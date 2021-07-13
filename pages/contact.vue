<template>
    <div class="max-w-screen-lg mx-auto">
      <div class="text-center mb-2">
        <h1 class="font-bold text-3xl font-mono text-yellow-500">Me Contacter</h1>
        <br/>
        <div class="block whitespace-pre-line text-left text-gray-700">
          <span class=""> Par email : </span>
          <a href="mailto:justine@un-gout-de-liberte.fr">justine@un-gout-de-liberte.fr</a>
        </div>
    </div>
  </div>
</template>

<script>
export default {
  head() {
    const title = `Me Contacter - Pâtisseries & Biscuits - Un Goût de Liberté`;
    return {
      title: title,
      meta: [{
        hid: 'title',
        name: 'title',
        content: title,
      }, {
        hid: 'description',
        name: 'description',
        content: `Me Contacter - Un Goût de Liberté - Vente en Ligne de Pâtisseries et Biscuits artisanaux faits à CHILHAC (43380) par Justine DUMESNIL`,
      }]
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
