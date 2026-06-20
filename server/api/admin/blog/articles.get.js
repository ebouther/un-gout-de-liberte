import matter from 'gray-matter'

export default defineEventHandler(async (event) => {
  const { verifyAdmin } = await import('~/server/utils/adminAuth.js')
  verifyAdmin(event)

  const config = useRuntimeConfig()

  try {
    const branch = config.githubBranch || 'develop'
    const githubToken = config.githubToken || process.env.GITHUB_TOKEN
    const githubRepo = config.githubRepo || process.env.GITHUB_REPO || 'ebouther/un-gout-de-liberte'

    if (!githubToken || !githubRepo) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Configuration GitHub manquante'
      })
    }

    const response = await $fetch(`https://api.github.com/repos/${githubRepo}/contents/content/articles?ref=${branch}`, {
      headers: {
        'Authorization': `token ${githubToken}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    }).catch(() => ({ message: 'Not Found' }))

    if (response.message === 'Not Found' || !Array.isArray(response)) {
      return { success: true, articles: [] }
    }

    const markdownFiles = response.filter(file => file.name.endsWith('.md') && file.type === 'file')

    const articles = await Promise.all(
      markdownFiles.map(async (file) => {
        try {
          const fileResponse = await $fetch(`https://api.github.com/repos/${githubRepo}/contents/${file.path}?ref=${branch}`, {
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
            _path: `/blog/${file.name.replace('.md', '')}`,
            title: frontmatter.title || 'Sans titre',
            slug: frontmatter.slug || file.name.replace('.md', ''),
            date: frontmatter.date || new Date().toISOString(),
            status: frontmatter.status || 'draft',
            category: frontmatter.category || 'general',
            image: frontmatter.image,
            description: frontmatter.description || '',
            readingTime,
            fileName: file.name,
            sha: fileResponse.sha,
            content: articleContent
          }
        } catch {
          return null
        }
      })
    )

    // Filtrer les articles null (en cas d'erreur) et trier par date
    const validArticles = articles.filter(article => article !== null)
    const sortedArticles = validArticles.sort((a, b) => new Date(b.date) - new Date(a.date))

    return {
      success: true,
      articles: sortedArticles
    }

  } catch {
    throw createError({ statusCode: 500, statusMessage: 'Erreur lors de la récupération des articles' })
  }
})
