<template>
    <div class="max-w-screen-lg mx-auto">
      <div class="text-center mb-2">
        <!-- <h1 class="font-bold text-3xl font-mono text-yellow-500">Condition Générale de Vente</h1> -->
        <br/>
        <div class="block whitespace-pre-line text-left text-gray-700">
          <ContentDoc />
        </div>
    </div>
  </div>
</template>

<script>
export default {
  head() {
    const title = `Condition Générale de Vente - Un Goût de Liberté`;
    return {
      title: title,
      meta: [{
        hid: 'title',
        name: 'title',
        content: title,
      }, {
        hid: 'description',
        name: 'description',
        content: `Condition Générale de Vente - Un Goût de Liberté - Vente en Ligne de Pâtisseries et Biscuits artisanaux faits à CHILHAC (43380) par Justine DUMESNIL`,
      }]
    }
  }
}
</script>