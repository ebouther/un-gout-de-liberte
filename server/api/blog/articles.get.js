import matter from 'gray-matter'

export default defineEventHandler(async (event) => {
    try {
        // Récupérer la configuration GitHub
        const config = useRuntimeConfig()
        const githubToken = config.githubToken || process.env.GITHUB_TOKEN
        const githubRepo = config.githubRepo || process.env.GITHUB_REPO || 'ebouther/un-gout-de-liberte'

        if (!githubToken || !githubRepo) {
            console.warn('Configuration GitHub manquante pour l\'API publique')
            return {
                success: true,
                articles: []
            }
        }

        // Récupérer la liste des fichiers dans content/articles depuis GitHub
        const response = await $fetch(`https://api.github.com/repos/${githubRepo}/contents/content/articles?ref=develop`, {
            headers: {
                'Authorization': `token ${githubToken}`,
                'Accept': 'application/vnd.github.v3+json'
            }
        }).catch(() => ({ message: 'Not Found' }))

        // Si le dossier n'existe pas ou est vide
        if (response.message === 'Not Found' || !Array.isArray(response)) {
            return {
                success: true,
                articles: []
            }
        }

        // Filtrer les fichiers markdown
        const markdownFiles = response.filter(file => file.name.endsWith('.md') && file.type === 'file')

        // Récupérer le contenu de chaque fichier
        const articles = await Promise.all(
            markdownFiles.map(async (file) => {
                try {
                    const fileResponse = await $fetch(`https://api.github.com/repos/${githubRepo}/contents/${file.path}?ref=develop`, {
                        headers: {
                            'Authorization': `token ${githubToken}`,
                            'Accept': 'application/vnd.github.v3+json'
                        }
                    })

                    // Décoder le contenu base64
                    const content = Buffer.from(fileResponse.content, 'base64').toString('utf-8')
                    const { data: frontmatter, content: articleContent } = matter(content)

                    // Calculer le temps de lecture
                    const wordCount = articleContent.split(/\s+/).length
                    const readingTime = Math.ceil(wordCount / 200) || 1

                    return {
                        title: frontmatter.title || 'Sans titre',
                        slug: frontmatter.slug || file.name.replace('.md', ''),
                        date: frontmatter.date || new Date().toISOString(),
                        status: frontmatter.status || 'draft',
                        category: frontmatter.category || 'general',
                        image: frontmatter.image,
                        description: frontmatter.description || '',
                        readingTime,
                        fileName: file.name,
                        // Ne pas inclure le contenu complet pour des raisons de performance
                        excerpt: articleContent.substring(0, 200) + '...'
                    }
                } catch (error) {
                    console.error(`Erreur lors de la récupération du fichier ${file.name}:`, error)
                    return null
                }
            })
        )

        // Filtrer les articles null et ne garder que les articles publiés
        const validArticles = articles
            .filter(article => article !== null && article.status === 'published')
            .sort((a, b) => new Date(b.date) - new Date(a.date))

        return {
            success: true,
            articles: validArticles
        }

    } catch (error) {
        console.error('Erreur lors de la récupération des articles:', error)
        return {
            success: true,
            articles: []
        }
    }
})
