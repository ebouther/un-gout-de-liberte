export default defineNuxtRouteMiddleware((to) => {
    // Vérifier si l'utilisateur tente d'accéder à une route admin
    if (to.path.startsWith('/admin') && to.path !== '/admin/login') {

        // Vérifier la session côté serveur
        return $fetch('/api/admin/auth/check')
            .then((response) => {
                if (!response.authenticated) {
                    // Rediriger vers la page de login si non authentifié
                    return navigateTo('/admin/login')
                }
                // Continuer si authentifié
            })
            .catch(() => {
                // En cas d'erreur, rediriger vers login
                return navigateTo('/admin/login')
            })
    }
})
