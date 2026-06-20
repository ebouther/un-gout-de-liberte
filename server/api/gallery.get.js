export default defineEventHandler(async () => {
  try {
    const { listGalleryImages } = await import('~/server/utils/gallery.js')
    const images = await listGalleryImages()
    return { success: true, images }
  } catch (error) {
    console.error('Erreur galerie:', error)
    return { success: true, images: [] }
  }
})
