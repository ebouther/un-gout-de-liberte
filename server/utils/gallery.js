import fs from 'fs'
import path from 'path'

const GALLERY_DIR = 'public/images/creations'
const MANIFEST_PATH = 'content/gallery.json'
const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.gif']

function isImage(filename) {
  const ext = path.extname(filename).toLowerCase()
  return ALLOWED_EXTENSIONS.includes(ext)
}

async function listLocal(dir) {
  if (!fs.existsSync(dir)) return []
  return fs.readdirSync(dir)
    .filter((f) => isImage(f))
    .map((f) => ({ filename: f, url: `/images/creations/${f}` }))
}

async function listGitHub(token, repo, branch) {
  try {
    const response = await $fetch(
      `https://api.github.com/repos/${repo}/contents/${GALLERY_DIR}?ref=${branch}`,
      {
        headers: {
          Authorization: `token ${token}`,
          Accept: 'application/vnd.github.v3+json',
        },
      }
    )
    if (!Array.isArray(response)) return []
    return response
      .filter((f) => f.type === 'file' && isImage(f.name))
      .map((f) => ({
        filename: f.name,
        url: `/images/creations/${f.name}`,
        size: f.size,
        sha: f.sha,
      }))
  } catch (error) {
    if (error.status === 404) return []
    return []
  }
}

async function readManifestLocal() {
  const p = path.join(process.cwd(), MANIFEST_PATH)
  if (!fs.existsSync(p)) return []
  try {
    const data = JSON.parse(fs.readFileSync(p, 'utf-8'))
    return data.order || []
  } catch {
    return []
  }
}

async function writeManifestLocal(order) {
  const p = path.join(process.cwd(), MANIFEST_PATH)
  const dir = path.dirname(p)
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
  fs.writeFileSync(p, JSON.stringify({ order }, null, 2), 'utf-8')
}

async function readManifestGitHub(token, repo, branch) {
  try {
    const response = await $fetch(
      `https://api.github.com/repos/${repo}/contents/${MANIFEST_PATH}?ref=${branch}`,
      {
        headers: { Authorization: `token ${token}`, Accept: 'application/vnd.github.v3+json' },
      }
    )
    const content = Buffer.from(response.content, 'base64').toString('utf-8')
    const data = JSON.parse(content)
    return { order: data.order || [], sha: response.sha }
  } catch {
    return { order: [], sha: null }
  }
}

async function writeManifestGitHub(order, token, repo, branch) {
  const existing = await readManifestGitHub(token, repo, branch)
  await $fetch(
    `https://api.github.com/repos/${repo}/contents/${MANIFEST_PATH}`,
    {
      method: 'PUT',
      headers: { Authorization: `token ${token}`, Accept: 'application/vnd.github.v3+json' },
      body: {
        message: 'content(gallery): update order',
        content: Buffer.from(JSON.stringify({ order }, null, 2)).toString('base64'),
        sha: existing.sha || undefined,
        branch,
      },
    }
  )
}

function sortByManifest(images, manifestOrder) {
  const orderMap = new Map(manifestOrder.map((name, i) => [name, i]))
  return [...images].sort((a, b) => {
    const ai = orderMap.has(a.filename) ? orderMap.get(a.filename) : Infinity
    const bi = orderMap.has(b.filename) ? orderMap.get(b.filename) : Infinity
    return ai - bi
  })
}

export async function listGalleryImages() {
  const config = useRuntimeConfig()
  const branch = config.githubBranch || 'develop'
  const token = config.githubToken || process.env.GITHUB_TOKEN
  const repo = config.githubRepo || process.env.GITHUB_REPO || 'ebouther/un-gout-de-liberte'
  const dir = path.join(process.cwd(), GALLERY_DIR)

  let images = []
  let manifestOrder = []

  if (process.env.NODE_ENV === 'development') {
    images = await listLocal(dir)
    if (token && repo) {
      const github = await listGitHub(token, repo, branch)
      const localNames = new Set(images.map((f) => f.filename))
      const onlyOnGitHub = github.filter((f) => !localNames.has(f.filename))
      images = [...images, ...onlyOnGitHub]
    }
    manifestOrder = await readManifestLocal()
  } else {
    if (!token || !repo) return []
    images = await listGitHub(token, repo, branch)
    const manifest = await readManifestGitHub(token, repo, branch)
    manifestOrder = manifest.order
  }

  return sortByManifest(images, manifestOrder)
}

export async function getGalleryOrder() {
  const config = useRuntimeConfig()
  const branch = config.githubBranch || 'develop'
  const token = config.githubToken || process.env.GITHUB_TOKEN
  const repo = config.githubRepo || process.env.GITHUB_REPO || 'ebouther/un-gout-de-liberte'

  if (process.env.NODE_ENV === 'development') {
    return readManifestLocal()
  }
  if (!token || !repo) return []
  const manifest = await readManifestGitHub(token, repo, branch)
  return manifest.order
}

export async function setGalleryOrder(order) {
  if (!Array.isArray(order)) throw new Error('L\'ordre doit être un tableau')

  const config = useRuntimeConfig()
  const branch = config.githubBranch || 'develop'
  const token = config.githubToken || process.env.GITHUB_TOKEN
  const repo = config.githubRepo || process.env.GITHUB_REPO || 'ebouther/un-gout-de-liberte'

  if (process.env.NODE_ENV === 'development') {
    await writeManifestLocal(order)
    return
  }
  if (!token || !repo) throw new Error('Configuration GitHub manquante')
  await writeManifestGitHub(order, token, repo, branch)
}

async function appendToManifest(filename) {
  const order = await getGalleryOrder()
  if (!order.includes(filename)) {
    await setGalleryOrder([...order, filename])
  }
}

async function removeFromManifest(filename) {
  const order = await getGalleryOrder()
  const filtered = order.filter((f) => f !== filename)
  if (filtered.length !== order.length) {
    await setGalleryOrder(filtered)
  }
}

export async function uploadGalleryImage(filename, base64Content) {
  const dir = path.join(process.cwd(), GALLERY_DIR)

  if (process.env.NODE_ENV === 'development') {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
    const buffer = Buffer.from(base64Content, 'base64')
    fs.writeFileSync(path.join(dir, filename), buffer)
    await appendToManifest(filename)
    return { filename, url: `/images/creations/${filename}` }
  }

  const config = useRuntimeConfig()
  const branch = config.githubBranch || 'develop'
  const token = config.githubToken || process.env.GITHUB_TOKEN
  const repo = config.githubRepo || process.env.GITHUB_REPO || 'ebouther/un-gout-de-liberte'

  if (!token || !repo) {
    throw new Error('Configuration GitHub manquante')
  }

  const filePath = `${GALLERY_DIR}/${filename}`

  const response = await $fetch(
    `https://api.github.com/repos/${repo}/contents/${filePath}`,
    {
      method: 'PUT',
      headers: {
        Authorization: `token ${token}`,
        Accept: 'application/vnd.github.v3+json',
      },
      body: {
        message: `content(gallery): add photo ${filename}`,
        content: base64Content,
        branch,
      },
    }
  )

  await appendToManifest(filename)

  return {
    filename,
    url: `/images/creations/${filename}`,
    sha: response.content?.sha,
  }
}

async function deleteFromGitHub(filename, token, repo, branch) {
  const repoPath = `${GALLERY_DIR}/${filename}`
  try {
    const existing = await $fetch(
      `https://api.github.com/repos/${repo}/contents/${repoPath}?ref=${branch}`,
      {
        headers: {
          Authorization: `token ${token}`,
          Accept: 'application/vnd.github.v3+json',
        },
      }
    )
    await $fetch(
      `https://api.github.com/repos/${repo}/contents/${repoPath}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `token ${token}`,
          Accept: 'application/vnd.github.v3+json',
        },
        body: {
          message: `content(gallery): remove photo ${filename}`,
          sha: existing.sha,
          branch,
        },
      }
    )
  } catch (error) {
    if (error.status !== 404) throw error
  }
}

export async function deleteGalleryImage(filename) {
  const dir = path.join(process.cwd(), GALLERY_DIR)
  const filePath = path.join(dir, filename)

  const config = useRuntimeConfig()
  const branch = config.githubBranch || 'develop'
  const token = config.githubToken || process.env.GITHUB_TOKEN
  const repo = config.githubRepo || process.env.GITHUB_REPO || 'ebouther/un-gout-de-liberte'

  if (fs.existsSync(filePath)) fs.unlinkSync(filePath)

  if (token && repo) {
    await deleteFromGitHub(filename, token, repo, branch)
  }

  await removeFromManifest(filename)
}
