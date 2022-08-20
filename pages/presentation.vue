<template>
    <div class="px-5 lg:max-w-screen-lg mx-auto">
      <div class="text-center mb-2">
        <div class="block whitespace-pre-line text-gray-700 text-justify">
          <ContentDoc path="/about" />
        </div>
    </div>
  </div>
</template>

<script>
export default {
  head() {
    const title = `Présentation - Pâtisseries & Biscuits - Un Goût de Liberté`;
    return {
      title: title,
      meta: [{
        hid: 'title',
        name: 'title',
        content: title,
      }, {
        hid: 'description',
        name: 'description',
        content: `Présentation - Un Goût de Liberté - Vente en Ligne de Pâtisseries et Biscuits artisanaux faits à CHILHAC (43380) par Justine DUMESNIL`,
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
