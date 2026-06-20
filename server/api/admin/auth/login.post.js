import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

const loginAttempts = new Map()

setInterval(() => {
  const now = Date.now()
  for (const [key, data] of loginAttempts) {
    if (now - data.resetAt > 0) loginAttempts.delete(key)
  }
}, 60000)

export default defineEventHandler(async (event) => {
  try {
    const ip = getHeader(event, 'x-forwarded-for') || event.node.req.socket.remoteAddress || 'unknown'
    const now = Date.now()
    const attempt = loginAttempts.get(ip) || { count: 0, resetAt: now + 900000 }

    if (now < attempt.resetAt && attempt.count >= 5) {
      const retryAfter = Math.ceil((attempt.resetAt - now) / 1000)
      setHeader(event, 'Retry-After', String(retryAfter))
      throw createError({
        statusCode: 429,
        statusMessage: `Trop de tentatives. Réessayez dans ${retryAfter} secondes.`
      })
    }

    if (now >= attempt.resetAt) {
      attempt.count = 0
      attempt.resetAt = now + 900000
    }

    const body = await readBody(event)
    const { password } = body

    if (!password) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Mot de passe requis'
      })
    }

    // Récupérer la configuration runtime
    const config = useRuntimeConfig()
    const adminPassword = config.adminPassword || process.env.ADMIN_PASSWORD

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
      isValid = password === adminPassword
    }

    if (!isValid) {
      attempt.count++
      loginAttempts.set(ip, attempt)
      throw createError({
        statusCode: 401,
        statusMessage: 'Mot de passe incorrect'
      })
    }

    loginAttempts.delete(ip)

    // Créer un token JWT
    if (!config.jwtSecret) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Configuration JWT manquante'
      })
    }
    const secret = config.jwtSecret
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
