import matter from 'gray-matter'
import jwt from 'jsonwebtoken'

export default defineEventHandler(async (event) => {
  // Vérifier l'authentification
  const config = useRuntimeConfig()
  const token = getCookie(event, 'admin-auth') || getHeader(event, 'authorization')?.replace('Bearer ', '')

  console.log('🔍 DEBUG articles.post.js')
  console.log('Token reçu:', token ? 'PRÉSENT' : 'ABSENT')
  console.log('JWT Secret disponible:', !!config.jwtSecret)

  if (!token) {
    console.log('❌ Aucun token trouvé')
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized'
    })
  }

  try {
    const secret = config.jwtSecret || process.env.JWT_SECRET || 'fallback-secret'
    jwt.verify(token, secret)
    console.log('✅ Token validé avec succès')
  } catch (error) {
    console.log('❌ Erreur validation token:', error.message)
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized'
    })
  }

  if (getMethod(event) !== 'POST') {
    throw createError({
      statusCode: 405,
      statusMessage: 'Method not allowed'
    })
  }

  try {
    const body = await readBody(event)

    // Validation des données
    const { title, slug, description, category, status, date, image, content } = body

    if (!title?.trim()) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Le titre est requis'
      })
    }

    if (!slug?.trim()) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Le slug est requis'
      })
    }

    if (!description?.trim()) {
      throw createError({
        statusCode: 400,
        statusMessage: 'La description est requise'
      })
    }

    if (!content?.trim()) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Le contenu est requis'
      })
    }

    // Nettoyer le slug
    const cleanSlug = slug.trim()
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')

    // Préparer le contenu markdown avec front matter
    const frontMatter = {
      title: title.trim(),
      description: description.trim(),
      category: category?.trim() || 'general',
      status: status || 'draft',
      date: date ? new Date(date).toISOString() : new Date().toISOString(),
      slug: cleanSlug,
      readingTime: Math.ceil(content.trim().split(/\s+/).length / 200)
    }

    if (image?.trim()) {
      frontMatter.image = image.trim()
    }

    const markdownContent = matter.stringify(content.trim(), frontMatter)

    // Utiliser uniquement l'API GitHub pour tous les environnements
    const githubToken = config.githubToken || process.env.GITHUB_TOKEN
    const githubRepo = config.githubRepo || process.env.GITHUB_REPO || 'ebouther/un-gout-de-liberte'

    if (!githubToken || !githubRepo) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Configuration GitHub manquante. Veuillez configurer GITHUB_TOKEN et GITHUB_REPO dans vos variables d\'environnement.'
      })
    }

    const fileName = `${cleanSlug}.md`
    const filePath = `content/articles/${fileName}`

    // Vérifier si le fichier existe déjà
    try {
      const checkResponse = await $fetch(`https://api.github.com/repos/${githubRepo}/contents/${filePath}`, {
        headers: {
          'Authorization': `token ${githubToken}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      })

      if (checkResponse) {
        throw createError({
          statusCode: 409,
          statusMessage: 'Un article avec ce slug existe déjà'
        })
      }
    } catch (error) {
      // Si le fichier n'existe pas, c'est ce qu'on veut
      if (error.status !== 404) {
        console.error('Erreur lors de la vérification GitHub:', error)
        throw createError({
          statusCode: 500,
          statusMessage: 'Erreur lors de la vérification sur GitHub'
        })
      }
    }

    // Créer le fichier via l'API GitHub
    try {
      const createResponse = await $fetch(`https://api.github.com/repos/${githubRepo}/contents/${filePath}`, {
        method: 'PUT',
        headers: {
          'Authorization': `token ${githubToken}`,
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json'
        },
        body: {
          message: `content(blog): add new article "${cleanSlug}"`,
          content: Buffer.from(markdownContent).toString('base64'),
          branch: 'develop'
        }
      })

      if (!createResponse.content) {
        throw createError({
          statusCode: 500,
          statusMessage: 'Erreur lors de la création du fichier sur GitHub'
        })
      }
    } catch (error) {
      console.error('Erreur lors de la création sur GitHub:', error)
      throw createError({
        statusCode: 500,
        statusMessage: `Erreur GitHub: ${error.message || 'Impossible de créer le fichier'}`
      })
    }

    // Retourner l'article créé
    const createdArticle = {
      ...frontMatter,
      slug: cleanSlug,
      fileName: `${cleanSlug}.md`,
      content: content.trim()
    }

    return {
      success: true,
      message: 'Article créé avec succès sur GitHub',
      article: createdArticle,
      githubSync: true
    }

  } catch (error) {
    console.error('Erreur lors de la création de l\'article:', error)

    if (error.statusCode) {
      throw error
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Erreur lors de la création de l\'article'
    })
  }
})
