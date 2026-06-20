export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const branch = config.githubBranch || 'develop'
  const slug = getRouterParam(event, 'slug')

  if (!slug) {
    throw createError({ statusCode: 400, statusMessage: 'Slug manquant' })
  }

  const token = config.githubToken || process.env.GITHUB_TOKEN
  const repo = config.githubRepo || process.env.GITHUB_REPO

  if (!token) {
    throw createError({ statusCode: 500, statusMessage: 'Token GitHub non configuré' })
  }

  setHeader(event, 'Cache-Control', 'public, max-age=300, s-maxage=600')

  const filename = `${slug}.md`

  try {
    const response = await $fetch(`https://api.github.com/repos/${repo}/contents/content/articles/${filename}`, {
      headers: {
        'Authorization': `token ${token}`,
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'un-gout-de-liberte'
      },
      query: { ref: branch }
    })

    if (!response || !response.content) {
      throw createError({ statusCode: 404, statusMessage: 'Article non trouvé' })
    }

    const content = Buffer.from(response.content, 'base64').toString('utf-8')
    const matter = await import('gray-matter').then(m => m.default)
    const { data: frontMatter, content: articleContent } = matter(content)

    if (frontMatter.status !== 'published') {
      throw createError({ statusCode: 404, statusMessage: 'Article non trouvé' })
    }

    const wordCount = articleContent.split(/\s+/).length
    const readingTime = Math.ceil(wordCount / 200)

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
    const status = error.statusCode || error.status
    if (status === 404) {
      throw createError({ statusCode: 404, statusMessage: 'Article non trouvé' })
    }
    throw createError({ statusCode: 500, statusMessage: 'Erreur serveur lors de la récupération de l\'article' })
  }
})
