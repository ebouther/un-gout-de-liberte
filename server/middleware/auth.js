export default defineEventHandler(async (event) => {
    if (event.node.req.url?.startsWith('/api/admin/') &&
        !event.node.req.url?.startsWith('/api/admin/auth/')) {
        const token = getCookie(event, 'admin-auth')
        if (!token) {
            throw createError({
                statusCode: 401,
                statusMessage: 'Token d\'authentification manquant'
            })
        }
        try {
            const config = useRuntimeConfig()
            const secret = config.jwtSecret || process.env.JWT_SECRET || 'fallback-secret'
            jwt.verify(token, secret)
        } catch (error) {
            throw createError({
                statusCode: 401,
                statusMessage: 'Token d\'authentification invalide'
            })
        }

    }
})
