const PUBLIC_FIELDS = 'name,description,photo_url,slug,template'

/**
 * @param {string} value
 */
export function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

/**
 * @param {string} siteUrl
 * @param {string} slug
 */
export function getCardPageUrl(siteUrl, slug) {
  const base = (siteUrl ?? '').replace(/\/$/, '')
  return `${base}/c/${slug}`
}

/**
 * @param {string} slug
 */
export async function fetchCardBySlug(slug) {
  const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL
  const supabaseKey =
    process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Supabase não configurado no servidor.')
  }

  const url = new URL(`${supabaseUrl}/rest/v1/virtual_cards`)
  url.searchParams.set('slug', `eq.${slug}`)
  url.searchParams.set('select', PUBLIC_FIELDS)
  url.searchParams.set('limit', '1')

  const res = await fetch(url.toString(), {
    headers: {
      apikey: supabaseKey,
      Authorization: `Bearer ${supabaseKey}`,
    },
  })

  if (!res.ok) {
    throw new Error(`Erro ao buscar cartão: ${res.status}`)
  }

  const rows = await res.json()
  return rows?.[0] ?? null
}

/**
 * @param {{ name?: string, description?: string, photo_url?: string, slug?: string }} card
 * @param {string} pageUrl
 * @param {string} slug
 * @param {string} siteUrl
 */
export function buildOgHtml(card, pageUrl, slug, siteUrl) {
  const title = escapeHtml(card?.name || 'Cartão Virtual')
  const description = escapeHtml(
    card?.description?.trim() ||
      'Confira meu cartão virtual com contato, serviços e redes sociais.',
  )
  const image = escapeHtml(
    card?.photo_url || `${siteUrl.replace(/\/$/, '')}/og-default.svg`,
  )
  const url = escapeHtml(pageUrl)
  const redirect = `/c/${slug}`

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
  <meta name="description" content="${description}" />
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="Cartão Virtual" />
  <meta property="og:title" content="${title}" />
  <meta property="og:description" content="${description}" />
  <meta property="og:url" content="${url}" />
  <meta property="og:image" content="${image}" />
  <meta property="og:image:alt" content="${title}" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${title}" />
  <meta name="twitter:description" content="${description}" />
  <meta name="twitter:image" content="${image}" />
  <meta http-equiv="refresh" content="0;url=${redirect}" />
  <link rel="canonical" href="${url}" />
</head>
<body>
  <p>Redirecionando para <a href="${redirect}">${title}</a>...</p>
  <script>location.replace(${JSON.stringify(redirect)})</script>
</body>
</html>`
}

/**
 * @param {import('http').IncomingMessage | { headers?: Record<string, string | string[] | undefined> }} req
 */
export function resolveSiteUrl(req) {
  const envUrl = process.env.VITE_APP_URL || process.env.URL || process.env.DEPLOY_PRIME_URL
  if (envUrl) return envUrl.replace(/\/$/, '')

  const host = req?.headers?.['x-forwarded-host'] || req?.headers?.host
  const proto = req?.headers?.['x-forwarded-proto'] || 'https'
  if (host) return `${proto}://${host}`.replace(/\/$/, '')

  return 'http://localhost:5173'
}
