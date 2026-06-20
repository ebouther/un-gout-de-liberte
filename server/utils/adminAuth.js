import jwt from 'jsonwebtoken'

export function verifyAdmin(event) {
  const config = useRuntimeConfig()
  const secret = config.jwtSecret

  if (!secret) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Configuration JWT manquante'
    })
  }

  const token = getCookie(event, 'admin-auth')
  if (!token) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Token d\'authentification manquant'
    })
  }

  try {
    return jwt.verify(token, secret)
  } catch {
    throw createError({
      statusCode: 401,
      statusMessage: 'Token d\'authentification invalide'
    })
  }
}
