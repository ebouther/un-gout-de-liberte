import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

export default defineEventHandler(async (event) => {
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

    // Vérifier que le slug n'existe pas déjà
    const articlesDir = path.join(process.cwd(), 'content/articles')
    const fileName = `${cleanSlug}.md`
    const filePath = path.join(articlesDir, fileName)
    
    if (fs.existsSync(filePath)) {
      throw createError({
        statusCode: 409,
        statusMessage: 'Un article avec ce slug existe déjà'
      })
    }

    // Préparer le contenu markdown avec front matter
    const frontMatter = {
      title: title.trim(),
      description: description.trim(),
      category: category?.trim() || 'general',
      status: status || 'draft',
      date: date ? new Date(date).toISOString() : new Date().toISOString(),
      slug: cleanSlug,
      readingTime: Math.ceil(content.trim().split(/\s+/).length / 200) // ~200 mots par minute
    }

    if (image?.trim()) {
      frontMatter.image = image.trim()
    }

    const markdownContent = matter.stringify(content.trim(), frontMatter)

    // Créer le répertoire s'il n'existe pas
    if (!fs.existsSync(articlesDir)) {
      fs.mkdirSync(articlesDir, { recursive: true })
    }

    // Écrire le fichier
    fs.writeFileSync(filePath, markdownContent, 'utf8')

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
      article: createdArticle
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
