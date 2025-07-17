export default defineNuxtRouteMiddleware((to) => {
    // Vérifier si l'utilisateur est déjà connecté
    return $fetch('/api/admin/auth/check')
        .then((response) => {
            if (response.authenticated) {
                // Rediriger vers l'admin si déjà connecté
                return navigateTo('/admin')
            }
            // Continuer vers la page de login si non connecté
        })
        .catch(() => {
            // En cas d'erreur, continuer vers la page de login
        })
})
