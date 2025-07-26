import jwt from 'jsonwebtoken'
import matter from 'gray-matter'

export default defineEventHandler(async (event) => {
  // Vérifier l'authentification
  const config = useRuntimeConfig()
  const token = getCookie(event, 'admin-auth') || getHeader(event, 'authorization')?.replace('Bearer ', '')

  if (!token) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized'
    })
  }

  try {
    const secret = config.jwtSecret || process.env.JWT_SECRET || 'fallback-secret'
    jwt.verify(token, secret)
  } catch (error) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized'
    })
  }

  const method = getMethod(event)
  const slug = getRouterParam(event, 'slug')

  if (!slug) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Slug manquant'
    })
  }

  // Vérifier la configuration GitHub
  const githubToken = config.githubToken || process.env.GITHUB_TOKEN
  const githubRepo = config.githubRepo || process.env.GITHUB_REPO || 'ebouther/un-gout-de-liberte'

  if (!githubToken || !githubRepo) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Configuration GitHub manquante. Veuillez configurer GITHUB_TOKEN et GITHUB_REPO dans vos variables d\'environnement.'
    })
  }

  const fileName = `${slug}.md`
  const filePath = `content/articles/${fileName}`

  if (method === 'PUT') {
    // Mise à jour d'un article
    try {
      // Récupérer le fichier existant pour obtenir son SHA
      let existingFile
      console.log(`🔍 Recherche de l'article: ${filePath} sur le repo ${githubRepo}`)

      try {
        existingFile = await $fetch(`https://api.github.com/repos/${githubRepo}/contents/${filePath}?ref=develop`, {
          headers: {
            'Authorization': `token ${githubToken}`,
            'Accept': 'application/vnd.github.v3+json'
          }
        })
        console.log(`✅ Article trouvé: ${existingFile.name}`)
      } catch (error) {
        console.log(`❌ Erreur lors de la recherche:`, error.status, error.statusText)
        if (error.status === 404) {
          throw createError({
            statusCode: 404,
            statusMessage: 'Article non trouvé sur la branche develop'
          })
        }
        throw error
      }

      const body = await readBody(event)
      const { title, slug: newSlug, description, category, status, date, image, content } = body

      // Validation des données
      if (!title?.trim()) {
        throw createError({
          statusCode: 400,
          statusMessage: 'Le titre est requis'
        })
      }

      if (!newSlug?.trim()) {
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

      // Nettoyer le nouveau slug
      const cleanSlug = newSlug.trim()
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

      // Si le slug a changé, on doit supprimer l'ancien et créer le nouveau
      if (cleanSlug !== slug) {
        const newFileName = `${cleanSlug}.md`
        const newFilePath = `content/articles/${newFileName}`

        // Vérifier que le nouveau slug n'existe pas déjà
        try {
          await $fetch(`https://api.github.com/repos/${githubRepo}/contents/${newFilePath}?ref=develop`, {
            headers: {
              'Authorization': `token ${githubToken}`,
              'Accept': 'application/vnd.github.v3+json'
            }
          })

          throw createError({
            statusCode: 409,
            statusMessage: 'Un article avec ce slug existe déjà'
          })
        } catch (error) {
          if (error.status !== 404) {
            throw error
          }
        }

        // Créer le nouveau fichier
        await $fetch(`https://api.github.com/repos/${githubRepo}/contents/${newFilePath}`, {
          method: 'PUT',
          headers: {
            'Authorization': `token ${githubToken}`,
            'Accept': 'application/vnd.github.v3+json',
            'Content-Type': 'application/json'
          },
          body: {
            message: `✏️ Renommer et modifier l'article: ${slug} → ${cleanSlug}`,
            content: Buffer.from(markdownContent).toString('base64'),
            branch: 'develop'
          }
        })

        // Supprimer l'ancien fichier
        await $fetch(`https://api.github.com/repos/${githubRepo}/contents/${filePath}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `token ${githubToken}`,
            'Accept': 'application/vnd.github.v3+json',
            'Content-Type': 'application/json'
          },
          body: {
            message: `🗑️ Supprimer l'ancien article: ${slug}`,
            sha: existingFile.sha,
            branch: 'develop'
          }
        })
      } else {
        // Juste mettre à jour le fichier existant
        await $fetch(`https://api.github.com/repos/${githubRepo}/contents/${filePath}`, {
          method: 'PUT',
          headers: {
            'Authorization': `token ${githubToken}`,
            'Accept': 'application/vnd.github.v3+json',
            'Content-Type': 'application/json'
          },
          body: {
            message: `✏️ Modifier l'article: ${title}`,
            content: Buffer.from(markdownContent).toString('base64'),
            sha: existingFile.sha,
            branch: 'develop'
          }
        })
      }

      // Retourner l'article mis à jour
      const updatedArticle = {
        ...frontMatter,
        slug: cleanSlug,
        fileName: `${cleanSlug}.md`,
        content: content.trim()
      }

      return {
        success: true,
        message: 'Article mis à jour avec succès sur GitHub',
        article: updatedArticle,
        githubSync: true
      }

    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'article:', error)

      if (error.statusCode) {
        throw error
      }

      throw createError({
        statusCode: 500,
        statusMessage: `Erreur GitHub: ${error.message || 'Impossible de mettre à jour le fichier'}`
      })
    }

  } else if (method === 'DELETE') {
    // Suppression d'un article
    try {
      // Récupérer le fichier existant pour obtenir son SHA
      let existingFile
      try {
        existingFile = await $fetch(`https://api.github.com/repos/${githubRepo}/contents/${filePath}?ref=develop`, {
          headers: {
            'Authorization': `token ${githubToken}`,
            'Accept': 'application/vnd.github.v3+json'
          }
        })
      } catch (error) {
        if (error.status === 404) {
          throw createError({
            statusCode: 404,
            statusMessage: 'Article non trouvé'
          })
        }
        throw error
      }

      // Supprimer le fichier
      await $fetch(`https://api.github.com/repos/${githubRepo}/contents/${filePath}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `token ${githubToken}`,
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json'
        },
        body: {
          message: `🗑️ Supprimer l'article: ${slug}`,
          sha: existingFile.sha,
          branch: 'develop'
        }
      })

      return {
        success: true,
        message: 'Article supprimé avec succès de GitHub',
        githubSync: true
      }

    } catch (error) {
      console.error('Erreur lors de la suppression de l\'article:', error)

      if (error.statusCode) {
        throw error
      }

      throw createError({
        statusCode: 500,
        statusMessage: `Erreur GitHub: ${error.message || 'Impossible de supprimer le fichier'}`
      })
    }

  } else {
    throw createError({
      statusCode: 405,
      statusMessage: 'Method not allowed'
    })
  }
})
