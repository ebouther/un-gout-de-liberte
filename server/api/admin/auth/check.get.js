import jwt from 'jsonwebtoken'

export default defineEventHandler(async (event) => {
  try {
    const token = getCookie(event, 'admin-auth')
    if (!token) {
      return { authenticated: false }
    }
    const config = useRuntimeConfig()
    const secret = config.jwtSecret || process.env.JWT_SECRET || 'fallback-secret'
    const decoded = jwt.verify(token, secret)
    if (decoded.exp < Date.now() / 1000) {
      return { authenticated: false }
    }
    return { authenticated: true, user: decoded }

  } catch (error) {
    return { authenticated: false }
  }
})
