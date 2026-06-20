export default defineEventHandler(async (event) => {
    if (event.node.req.url?.startsWith('/api/admin/') &&
        !event.node.req.url?.startsWith('/api/admin/auth/')) {
        const { verifyAdmin } = await import('~/server/utils/adminAuth.js')
        verifyAdmin(event)
    }
})
