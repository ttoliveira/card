import { buildOgHtml, fetchCardBySlug, getCardPageUrl, resolveSiteUrl } from '../../lib/og-utils.js'

export async function handler(event) {
  const slug =
    event.queryStringParameters?.slug ||
    event.path?.replace(/^.*\/c\//, '').replace(/\/$/, '')

  if (!slug) {
    return { statusCode: 400, body: 'Slug inválido.' }
  }

  try {
    const siteUrl = resolveSiteUrl({ headers: event.headers })
    const card = await fetchCardBySlug(slug)
    const pageUrl = getCardPageUrl(siteUrl, slug)
    const html = buildOgHtml(card ?? { name: 'Cartão Virtual', slug }, pageUrl, slug, siteUrl)

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 's-maxage=3600, stale-while-revalidate',
      },
      body: html,
    }
  } catch (err) {
    return {
      statusCode: 500,
      body: err instanceof Error ? err.message : 'Erro',
    }
  }
}
