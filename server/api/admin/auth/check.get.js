import jwt from 'jsonwebtoken'

export default defineEventHandler(async (event) => {
    try {
        // Récupérer le token depuis les cookies
        const token = getCookie(event, 'admin-auth')

        if (!token) {
            return {
                authenticated: false,
                message: 'Aucun token trouvé'
            }
        }

        // Vérifier le token JWT
        const secret = process.env.JWT_SECRET || 'votre-secret-jwt-temporaire'
        const decoded = jwt.verify(token, secret)

        // Vérifier si le token n'est pas expiré
        if (decoded.exp < Date.now() / 1000) {
            return {
                authenticated: false,
                message: 'Token expiré'
            }
        }

        return {
            authenticated: true,
            user: decoded
        }

    } catch (error) {
        console.error('Erreur vérification auth:', error)
        return {
            authenticated: false,
            message: 'Token invalide'
        }
    }
})
