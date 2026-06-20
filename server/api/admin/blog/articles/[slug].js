import matter from 'gray-matter'

export default defineEventHandler(async (event) => {
  const { verifyAdmin } = await import('~/server/utils/adminAuth.js')
  verifyAdmin(event)

  const config = useRuntimeConfig()
  const branch = config.githubBranch || 'develop'
  const method = getMethod(event)
  const slug = getRouterParam(event, 'slug')

  if (!slug) {
    throw createError({ statusCode: 400, statusMessage: 'Slug manquant' })
  }

  const githubToken = config.githubToken || process.env.GITHUB_TOKEN
  const githubRepo = config.githubRepo || process.env.GITHUB_REPO

  if (!githubToken || !githubRepo) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Configuration GitHub manquante'
    })
  }

  const fileName = `${slug}.md`
  const filePath = `content/articles/${fileName}`

  if (method === 'PUT') {
    try {
      let existingFile
      try {
        existingFile = await $fetch(`https://api.github.com/repos/${githubRepo}/contents/${filePath}?ref=${branch}`, {
          headers: {
            'Authorization': `token ${githubToken}`,
            'Accept': 'application/vnd.github.v3+json'
          }
        })
      } catch (error) {
        if (error.status === 404) {
          throw createError({ statusCode: 404, statusMessage: 'Article non trouvé' })
        }
        throw error
      }

      const body = await readBody(event)
      const { title, slug: newSlug, description, category, status, date, image, content } = body

      if (!title?.trim()) throw createError({ statusCode: 400, statusMessage: 'Le titre est requis' })
      if (!newSlug?.trim()) throw createError({ statusCode: 400, statusMessage: 'Le slug est requis' })
      if (!description?.trim()) throw createError({ statusCode: 400, statusMessage: 'La description est requise' })
      if (!content?.trim()) throw createError({ statusCode: 400, statusMessage: 'Le contenu est requis' })

      const cleanSlug = newSlug.trim()
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '')

      const frontMatter = {
        title: title.trim(),
        description: description.trim(),
        category: category?.trim() || 'general',
        status: status || 'draft',
        date: date ? new Date(date).toISOString() : new Date().toISOString(),
        slug: cleanSlug,
        readingTime: Math.ceil(content.trim().split(/\s+/).length / 200)
      }

      if (image?.trim()) frontMatter.image = image.trim()

      const markdownContent = matter.stringify(content.trim(), frontMatter)

      if (cleanSlug !== slug) {
        const newFilePath = `content/articles/${cleanSlug}.md`

        try {
          await $fetch(`https://api.github.com/repos/${githubRepo}/contents/${newFilePath}?ref=${branch}`, {
            headers: {
              'Authorization': `token ${githubToken}`,
              'Accept': 'application/vnd.github.v3+json'
            }
          })
          throw createError({ statusCode: 409, statusMessage: 'Un article avec ce slug existe déjà' })
        } catch (error) {
          if (error.status !== 404) throw error
        }

        await $fetch(`https://api.github.com/repos/${githubRepo}/contents/${newFilePath}`, {
          method: 'PUT',
          headers: {
            'Authorization': `token ${githubToken}`,
            'Accept': 'application/vnd.github.v3+json',
            'Content-Type': 'application/json'
          },
          body: {
            message: `content(blog): rename article "${slug}" to "${cleanSlug}"`,
            content: Buffer.from(markdownContent).toString('base64'),
            branch
          }
        })

        await $fetch(`https://api.github.com/repos/${githubRepo}/contents/${filePath}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `token ${githubToken}`,
            'Accept': 'application/vnd.github.v3+json',
            'Content-Type': 'application/json'
          },
          body: {
            message: `content(blog): remove old article "${slug}"`,
            sha: existingFile.sha,
            branch
          }
        })
      } else {
        await $fetch(`https://api.github.com/repos/${githubRepo}/contents/${filePath}`, {
          method: 'PUT',
          headers: {
            'Authorization': `token ${githubToken}`,
            'Accept': 'application/vnd.github.v3+json',
            'Content-Type': 'application/json'
          },
          body: {
            message: `content(blog): update article "${cleanSlug}"`,
            content: Buffer.from(markdownContent).toString('base64'),
            sha: existingFile.sha,
            branch
          }
        })
      }

      const updatedArticle = { ...frontMatter, slug: cleanSlug, fileName: `${cleanSlug}.md`, content: content.trim() }

      return { success: true, message: 'Article mis à jour avec succès', article: updatedArticle, githubSync: true }
    } catch (error) {
      if (error.statusCode) throw error
      throw createError({ statusCode: 500, statusMessage: `Erreur: ${error.message || 'Impossible de mettre à jour le fichier'}` })
    }
  }

  if (method === 'DELETE') {
    try {
      let existingFile
      try {
        existingFile = await $fetch(`https://api.github.com/repos/${githubRepo}/contents/${filePath}?ref=${branch}`, {
          headers: {
            'Authorization': `token ${githubToken}`,
            'Accept': 'application/vnd.github.v3+json'
          }
        })
      } catch (error) {
        if (error.status === 404) throw createError({ statusCode: 404, statusMessage: 'Article non trouvé' })
        throw error
      }

      await $fetch(`https://api.github.com/repos/${githubRepo}/contents/${filePath}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `token ${githubToken}`,
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json'
        },
        body: {
          message: `content(blog): remove article "${slug}"`,
          sha: existingFile.sha,
          branch
        }
      })

      return { success: true, message: 'Article supprimé', githubSync: true }
    } catch (error) {
      if (error.statusCode) throw error
      throw createError({ statusCode: 500, statusMessage: `Erreur: ${error.message || 'Impossible de supprimer le fichier'}` })
    }
  }

  throw createError({ statusCode: 405, statusMessage: 'Method not allowed' })
})
