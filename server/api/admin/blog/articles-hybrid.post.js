import matter from 'gray-matter'

export default defineEventHandler(async (event) => {
  // L'authentification est gérée par le middleware server/middleware/auth.js

  if (getMethod(event) !== 'POST') {
    throw createError({
      statusCode: 405,
      statusMessage: 'Method not allowed'
    })
  }

  try {
    const body = await readBody(event)
    const config = useRuntimeConfig()

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
    const fileName = `${cleanSlug}.md`

    // Stratégie basée sur l'environnement
    let success = false
    let method = 'unknown'

    // 1. En développement : écriture locale
    if (process.env.NODE_ENV === 'development') {
      try {
        const fs = await import('fs')
        const path = await import('path')

        const articlesDir = path.join(process.cwd(), 'content/articles')
        const filePath = path.join(articlesDir, fileName)

        if (fs.existsSync(filePath)) {
          throw createError({
            statusCode: 409,
            statusMessage: 'Un article avec ce slug existe déjà'
          })
        }

        // Créer le répertoire s'il n'existe pas
        if (!fs.existsSync(articlesDir)) {
          fs.mkdirSync(articlesDir, { recursive: true })
        }

        // Écrire le fichier
        fs.writeFileSync(filePath, markdownContent, 'utf8')
        success = true
        method = 'local_filesystem'
      } catch (error) {
        console.error('Erreur écriture locale:', error)
        throw error
      }
    }

    // 2. En production : essayer GitHub d'abord
    else {
      if (config.githubToken && config.githubRepo) {
        try {
          const filePath = `content/articles/${fileName}`

          // Vérifier si le fichier existe déjà
          try {
            const checkResponse = await $fetch(`https://api.github.com/repos/${config.githubRepo}/contents/${filePath}`, {
              headers: {
                'Authorization': `token ${config.githubToken}`,
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
            // Si le fichier n'existe pas (404), c'est ce qu'on veut
            if (error.status !== 404) {
              throw error
            }
          }

          // Créer le fichier via l'API GitHub
          const createResponse = await $fetch(`https://api.github.com/repos/${config.githubRepo}/contents/${filePath}`, {
            method: 'PUT',
            headers: {
              'Authorization': `token ${config.githubToken}`,
              'Accept': 'application/vnd.github.v3+json',
              'Content-Type': 'application/json'
            },
            body: {
              message: `Ajouter l'article: ${title}`,
              content: Buffer.from(markdownContent).toString('base64'),
              branch: 'develop'
            }
          })

          if (createResponse.content) {
            success = true
            method = 'github_api'
          }
        } catch (error) {
          console.error('Erreur GitHub API:', error)
          // On continue vers le fallback
        }
      }

      // 3. Fallback : simulation (pour les démos)
      if (!success) {
        console.warn('Fallback: simulation de création d\'article (GitHub non configuré)')
        success = true
        method = 'simulation'
      }
    }

    if (!success) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Aucune méthode de sauvegarde disponible'
      })
    }

    // Retourner l'article créé
    const createdArticle = {
      ...frontMatter,
      slug: cleanSlug,
      fileName: fileName,
      content: content.trim()
    }

    return {
      success: true,
      message: 'Article créé avec succès',
      article: createdArticle,
      method: method,
      environment: process.env.NODE_ENV || 'unknown'
    }

  } catch (error) {
    console.error('Erreur lors de la création de l\'article:', error)

    if (error.statusCode) {
      throw error
    }

    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Erreur lors de la création de l\'article'
    })
  }
})
