export default defineEventHandler(async (event) => {
  try {
    const { verifyAdmin } = await import('~/server/utils/adminAuth.js')
    verifyAdmin(event)

    const body = await readBody(event)
    const { order } = body

    if (!Array.isArray(order)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Le champ "order" doit être un tableau de noms de fichiers',
      })
    }

    const { setGalleryOrder } = await import('~/server/utils/gallery.js')
    await setGalleryOrder(order)

    return { success: true }
  } catch (error) {
    console.error('Erreur mise à jour ordre galerie:', error)

    if (error.statusCode) throw error

    throw createError({
      statusCode: 500,
      statusMessage: 'Erreur lors de la mise à jour de l\'ordre',
    })
  }
})
