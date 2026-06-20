export default defineEventHandler(async (event) => {
  try {
    const { verifyAdmin } = await import('~/server/utils/adminAuth.js')
    verifyAdmin(event)

    const body = await readBody(event)
    const { filename, content } = body

    if (!filename || !content) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Nom de fichier et contenu requis',
      })
    }

    const ext = filename.split('.').pop()?.toLowerCase()
    if (!['jpg', 'jpeg', 'png', 'webp', 'gif'].includes(ext)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Format non supporté (jpg, png, webp, gif seulement)',
      })
    }

    const { uploadGalleryImage } = await import('~/server/utils/gallery.js')
    const result = await uploadGalleryImage(filename, content)

    return { success: true, image: result }
  } catch (error) {
    console.error('Erreur upload galerie:', error)

    if (error.statusCode) throw error

    throw createError({
      statusCode: 500,
      statusMessage: "Erreur lors de l'upload",
    })
  }
})
