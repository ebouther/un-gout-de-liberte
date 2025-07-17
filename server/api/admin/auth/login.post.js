import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

export default defineEventHandler(async (event) => {
    try {
        const body = await readBody(event)
        const { password } = body

        if (!password) {
            throw createError({
                statusCode: 400,
                statusMessage: 'Mot de passe requis'
            })
        }

        // Récupérer le mot de passe admin depuis les variables d'environnement
        const adminPassword = process.env.ADMIN_PASSWORD

        console.log('=== DEBUG LOGIN ===')
        console.log('Mot de passe reçu:', password)
        console.log('Mot de passe attendu:', adminPassword)
        console.log('Longueur reçue:', password.length)
        console.log('Longueur attendue:', adminPassword?.length)
        console.log('==================')

        if (!adminPassword) {
            console.error('ADMIN_PASSWORD non configuré dans les variables d\'environnement')
            throw createError({
                statusCode: 500,
                statusMessage: 'Configuration serveur incorrecte'
            })
        }

        // Vérifier le mot de passe
        // Si le mot de passe dans .env est déjà hashé, utiliser bcrypt.compare
        // Sinon, comparaison directe (à changer en production)
        let isValid = false

        if (adminPassword.startsWith('$2a$') || adminPassword.startsWith('$2b$')) {
            // Mot de passe hashé avec bcrypt
            isValid = await bcrypt.compare(password, adminPassword)
        } else {
            // Comparaison directe (pour le développement uniquement)
            isValid = password === adminPassword
            console.log('Comparaison directe, résultat:', isValid)
        }

        if (!isValid) {
            throw createError({
                statusCode: 401,
                statusMessage: 'Mot de passe incorrect'
            })
        }

        // Créer un token JWT
        const secret = process.env.JWT_SECRET || 'votre-secret-jwt-temporaire'
        const token = jwt.sign(
            {
                role: 'admin',
                loginTime: Date.now()
            },
            secret,
            {
                expiresIn: '24h' // Token valide 24h
            }
        )

        // Définir le cookie sécurisé
        setCookie(event, 'admin-auth', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 60 * 60 * 24 // 24 heures
        })

        return {
            success: true,
            message: 'Connexion réussie'
        }

    } catch (error) {
        console.error('Erreur lors de la connexion:', error)

        if (error.statusCode) {
            throw error
        }

        throw createError({
            statusCode: 500,
            statusMessage: 'Erreur interne du serveur'
        })
    }
})
