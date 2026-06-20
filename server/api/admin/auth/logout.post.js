export default defineEventHandler(async (event) => {
    try {
        const { verifyAdmin } = await import('~/server/utils/adminAuth.js')
        verifyAdmin(event)

        deleteCookie(event, 'admin-auth')

        return {
            success: true,
            message: 'Déconnexion réussie'
        }

    } catch (error) {
        console.error('Erreur lors de la déconnexion:', error)

        if (error.statusCode) {
            throw error
        }

        throw createError({
            statusCode: 500,
            statusMessage: 'Erreur lors de la déconnexion'
        })
    }
})
