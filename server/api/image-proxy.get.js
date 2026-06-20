export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const url = query.url

  if (!url || typeof url !== 'string') {
    throw createError({ statusCode: 400, statusMessage: 'Missing url parameter' })
  }

  if (!url.startsWith('https://files.stripe.com/')) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid image source' })
  }

  try {
    const response = await $fetch.raw(url)

    const contentType = response.headers.get('content-type') || 'image/jpeg'

    setResponseHeader(event, 'Content-Type', contentType)
    setResponseHeader(event, 'Cache-Control', 'public, max-age=86400, immutable')
    setResponseHeader(event, 'Access-Control-Allow-Origin', '*')

    return response._data
  } catch (error) {
    console.error('Image proxy error:', error)
    throw createError({ statusCode: 502, statusMessage: 'Failed to fetch image' })
  }
})
