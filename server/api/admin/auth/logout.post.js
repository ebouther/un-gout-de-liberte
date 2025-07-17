export default defineEventHandler(async (event) => {
    try {
        // Supprimer le cookie d'authentification
        deleteCookie(event, 'admin-auth')

        return {
            success: true,
            message: 'Déconnexion réussie'
        }

    } catch (error) {
        console.error('Erreur lors de la déconnexion:', error)

        throw createError({
            statusCode: 500,
            statusMessage: 'Erreur lors de la déconnexion'
        })
    }
})
