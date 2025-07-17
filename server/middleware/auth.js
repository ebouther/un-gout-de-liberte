import jwt from 'jsonwebtoken'

// Middleware pour protéger les routes API admin
export default defineEventHandler(async (event) => {
    // Appliquer uniquement aux routes API admin (sauf auth)
    if (event.node.req.url?.startsWith('/api/admin/') &&
        !event.node.req.url?.startsWith('/api/admin/auth/')) {

        try {
            // Récupérer le token depuis les cookies
            const token = getCookie(event, 'admin-auth')

            if (!token) {
                throw createError({
                    statusCode: 401,
                    statusMessage: 'Token d\'authentification manquant'
                })
            }

            // Vérifier le token JWT
            const secret = process.env.JWT_SECRET || 'votre-secret-jwt-temporaire'
            const decoded = jwt.verify(token, secret)

            // Vérifier si le token n'est pas expiré
            if (decoded.exp < Date.now() / 1000) {
                throw createError({
                    statusCode: 401,
                    statusMessage: 'Token expiré'
                })
            }

            // Ajouter les informations utilisateur au contexte
            event.context.user = decoded

        } catch (error) {
            console.error('Erreur authentification API:', error)

            if (error.statusCode) {
                throw error
            }

            throw createError({
                statusCode: 401,
                statusMessage: 'Token invalide'
            })
        }
    }
})
