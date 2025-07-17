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

    // Routes dynamiques des produits
    let productRoutes = []
    try {
      const config = useRuntimeConfig()
      const stripeSecretKey = config.stripeSecretKey || process.env.STRIPE_SECRET_KEY
      
      if (stripeSecretKey) {
        const stripe = new Stripe(stripeSecretKey)
        const { data: products } = await stripe.products.list({
          active: true,
          limit: 100
        })
        
        productRoutes = products.map(product => ({
          url: `/product/${product.id}`,
          changefreq: 'weekly',
          priority: 0.7,
          lastmod: new Date(product.updated * 1000 || product.created * 1000).toISOString().split('T')[0]
        }))
      } else {
        console.warn('Clé Stripe non trouvée, génération du sitemap sans les produits')
      }
    } catch (error) {
      console.warn('Erreur lors de la récupération des produits pour le sitemap:', error)
    }

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
