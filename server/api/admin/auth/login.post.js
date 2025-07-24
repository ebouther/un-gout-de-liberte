import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { password } = body

    console.log('🔍 LOGIN API appelée avec:', { passwordLength: password?.length })

    if (!password) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Mot de passe requis'
      })
    }

    // Récupérer la configuration runtime
    const config = useRuntimeConfig()
    const adminPassword = config.adminPassword || process.env.ADMIN_PASSWORD

    console.log('=== DEBUG LOGIN ===')
    console.log('Mot de passe reçu:', password)
    console.log('Mot de passe attendu:', adminPassword)
    console.log('Config disponible:', !!config.adminPassword)
    console.log('JWT Secret disponible:', !!config.jwtSecret)
    console.log('==================')

    if (!adminPassword) {
      console.error('ADMIN_PASSWORD non configuré')
      throw createError({
        statusCode: 500,
        statusMessage: 'Configuration serveur incorrecte'
      })
    }

    // Vérifier le mot de passe
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
      console.log('❌ Mot de passe incorrect')
      throw createError({
        statusCode: 401,
        statusMessage: 'Mot de passe incorrect'
      })
    }

    // Créer un token JWT
    const secret = config.jwtSecret || process.env.JWT_SECRET || 'fallback-secret'
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

    console.log('✅ Token généré, définition du cookie')

    // Définir le cookie sécurisé
    setCookie(event, 'admin-auth', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 // 24 heures
    })

    console.log('🎉 Connexion réussie')

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
