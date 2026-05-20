import { buildOgHtml, fetchCardBySlug, getCardPageUrl, resolveSiteUrl } from '../../lib/og-utils.js'

/**
 * HTML com Open Graph para preview no WhatsApp (crawlers).
 * @param {import('@vercel/node').VercelRequest} req
 * @param {import('@vercel/node').VercelResponse} res
 */
export default async function handler(req, res) {
  const slug = req.query.slug

  if (!slug || typeof slug !== 'string') {
    return res.status(400).send('Slug inválido.')
  }

  try {
    const siteUrl = resolveSiteUrl(req)
    const card = await fetchCardBySlug(slug)
    const pageUrl = getCardPageUrl(siteUrl, slug)
    const html = buildOgHtml(card ?? { name: 'Cartão Virtual', slug }, pageUrl, slug, siteUrl)

    res.setHeader('Content-Type', 'text/html; charset=utf-8')
    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate')
    return res.status(200).send(html)
  } catch (err) {
    return res.status(500).send(err instanceof Error ? err.message : 'Erro')
  }
}
