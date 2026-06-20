export default defineEventHandler(async (event) => {
  try {
    const { verifyAdmin } = await import('~/server/utils/adminAuth.js')
    verifyAdmin(event)

    const filename = getRouterParam(event, 'filename')

    if (!filename) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Nom de fichier requis',
      })
    }

    const { deleteGalleryImage } = await import('~/server/utils/gallery.js')
    await deleteGalleryImage(filename)

    return { success: true }
  } catch (error) {
    console.error('Erreur suppression galerie:', error)

    if (error.statusCode) throw error

    throw createError({
      statusCode: 500,
      statusMessage: 'Erreur lors de la suppression',
    })
  }
})
