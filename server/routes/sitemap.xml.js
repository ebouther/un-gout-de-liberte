export default defineEventHandler(async (event) => {
  // Redirection vers l'API sitemap dynamique
  return sendRedirect(event, '/api/sitemap.xml', 301)
})
