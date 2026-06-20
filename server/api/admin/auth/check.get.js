export default defineEventHandler(async (event) => {
  try {
    const { verifyAdmin } = await import('~/server/utils/adminAuth.js')
    const decoded = verifyAdmin(event)
    return { authenticated: true, user: decoded }
  } catch {
    return { authenticated: false }
  }
})
