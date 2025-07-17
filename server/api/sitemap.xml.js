import Stripe from 'stripe'

export default defineEventHandler(async (event) => {
    try {
        // Routes statiques
        const staticRoutes = [
            {
                url: '/',
                changefreq: 'weekly',
                priority: 1.0,
                lastmod: new Date().toISOString().split('T')[0]
            },
            {
                url: '/contact',
                changefreq: 'monthly',
                priority: 0.8,
                lastmod: new Date().toISOString().split('T')[0]
            },
            {
                url: '/cgv',
                changefreq: 'yearly',
                priority: 0.3,
                lastmod: new Date().toISOString().split('T')[0]
            }
        ]

        // Routes dynamiques des produits - supprimées car nous utilisons des modals
        let productRoutes = []
        // Note: Les produits sont maintenant affichés via modal popup, 
        // donc pas besoin de routes individuelles dans le sitemap

        // Générer le XML
        const allRoutes = [...staticRoutes, ...productRoutes]
        const hostname = 'https://un-gout-de-liberte.fr'

        let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`

        allRoutes.forEach(route => {
            sitemap += `  <url>
    <loc>${hostname}${route.url}</loc>
    <lastmod>${route.lastmod}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>
`
        })

        sitemap += `</urlset>`

        // Définir les en-têtes appropriés
        setHeader(event, 'Content-Type', 'application/xml')
        setHeader(event, 'Cache-Control', 'max-age=3600') // Cache pendant 1 heure

        return sitemap

    } catch (error) {
        throw createError({
            statusCode: 500,
            statusMessage: 'Erreur lors de la génération du sitemap'
        })
    }
})
