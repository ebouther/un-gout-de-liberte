import matter from 'gray-matter'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const branch = config.githubBranch || 'develop'
  const githubToken = config.githubToken || process.env.GITHUB_TOKEN
  const githubRepo = config.githubRepo || process.env.GITHUB_REPO

  setHeader(event, 'Cache-Control', 'public, max-age=300, s-maxage=600')

  if (!githubToken || !githubRepo) {
    return { success: true, articles: [] }
  }

  try {
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

          const content = Buffer.from(fileResponse.content, 'base64').toString('utf-8')
          const { data: frontmatter, content: articleContent } = matter(content)

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
            excerpt: articleContent.substring(0, 200) + '...'
          }
        } catch {
          return null
        }
      })
    )

    const validArticles = articles
      .filter(article => article !== null && article.status === 'published')
      .sort((a, b) => new Date(b.date) - new Date(a.date))

    return { success: true, articles: validArticles }
  } catch {
    return { success: true, articles: [] }
  }
})
