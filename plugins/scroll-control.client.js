export default defineNuxtPlugin((nuxtApp) => {
    if (process.client) {
        nuxtApp.$router.beforeEach((to, from, next) => {
            // Si on va vers une page produit, forcer le scroll en haut
            if (to.path.startsWith('/product/')) {
                // Nettoyer les positions sauvegardées
                sessionStorage.removeItem('homepage-scroll')
                sessionStorage.removeItem('from-product-page')

                // Forcer le scroll en haut immédiatement
                window.scrollTo(0, 0)

                // Double vérification après navigation
                setTimeout(() => {
                    window.scrollTo(0, 0)
                }, 0)
            }
            next()
        })

        nuxtApp.$router.afterEach((to, from) => {
            // Après la navigation vers une page produit
            if (to.path.startsWith('/product/')) {
                // Triple vérification avec plusieurs timings
                setTimeout(() => window.scrollTo(0, 0), 0)
                setTimeout(() => window.scrollTo(0, 0), 50)
                setTimeout(() => window.scrollTo(0, 0), 100)
            }
        })
    }
})
