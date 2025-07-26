export default defineEventHandler(async (event) => {
    try {
        const slug = getRouterParam(event, 'slug')

        if (!slug) {
            throw createError({
                statusCode: 400,
                statusMessage: 'Slug manquant'
            })
        }

        const config = useRuntimeConfig()
        const token = config.githubToken || process.env.GITHUB_TOKEN
        const repo = config.githubRepo || process.env.GITHUB_REPO || 'ebouther/un-gout-de-liberte'

        console.log('DEBUG: config.githubToken =', token ? 'SET' : 'NOT_SET')
        console.log('DEBUG: process.env.GITHUB_TOKEN =', process.env.GITHUB_TOKEN ? 'SET' : 'NOT_SET')
        console.log('DEBUG: repo =', repo)

        if (!token) {
            throw createError({
                statusCode: 500,
                statusMessage: 'Token GitHub non configuré'
            })
        }

        // Récupérer le fichier article depuis GitHub
        const filename = `${slug}.md`
        const response = await $fetch(`https://api.github.com/repos/${repo}/contents/content/articles/${filename}`, {
            headers: {
                'Authorization': `token ${token}`,
                'Accept': 'application/vnd.github.v3+json',
                'User-Agent': 'un-gout-de-liberte'
            },
            query: {
                ref: 'develop'
            }
        })

        if (!response || !response.content) {
            throw createError({
                statusCode: 404,
                statusMessage: 'Article non trouvé'
            })
        }

        // Décoder le contenu base64
        const content = Buffer.from(response.content, 'base64').toString('utf-8')

        // Parser le front matter et le contenu avec gray-matter
        const matter = await import('gray-matter').then(m => m.default)
        const { data: frontMatter, content: articleContent } = matter(content)

        // Vérifier que l'article est publié
        if (frontMatter.status !== 'published') {
            throw createError({
                statusCode: 404,
                statusMessage: 'Article non trouvé'
            })
        }

        // Calculer le temps de lecture estimé (environ 200 mots par minute)
        const wordCount = articleContent.split(/\s+/).length
        const readingTime = Math.ceil(wordCount / 200)

        // Retourner l'article complet avec métadonnées
        return {
            slug,
            title: frontMatter.title || 'Sans titre',
            description: frontMatter.description || '',
            content: articleContent,
            date: frontMatter.date || new Date().toISOString(),
            category: frontMatter.category || 'général',
            image: frontMatter.image || null,
            status: frontMatter.status,
            readingTime
        }

    } catch (error) {
        console.error('Erreur lors de la récupération de l\'article:', error)

        if (error.statusCode === 404) {
            throw createError({
                statusCode: 404,
                statusMessage: 'Article non trouvé'
            })
        }

        throw createError({
            statusCode: 500,
            statusMessage: 'Erreur serveur lors de la récupération de l\'article'
        })
    }
})
