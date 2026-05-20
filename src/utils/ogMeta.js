/**
 * Atualiza meta tags Open Graph no cliente (navegador).
 * @param {{ name?: string, description?: string, photo_url?: string, slug?: string }} card
 * @param {string} pageUrl
 */
export function applyCardOgMeta(card, pageUrl) {
  const title = card.name || 'Cartão Virtual'
  const description =
    card.description?.trim() ||
    'Confira meu cartão virtual com contato, serviços e redes sociais.'
  const image = card.photo_url || `${window.location.origin}/og-default.svg`

  document.title = `${title} | Cartão Virtual`

  setMeta('description', description, false)
  setMeta('og:type', 'website')
  setMeta('og:site_name', 'Cartão Virtual')
  setMeta('og:title', title)
  setMeta('og:description', description)
  setMeta('og:url', pageUrl)
  setMeta('og:image', image)
  setMeta('twitter:card', 'summary_large_image')
  setMeta('twitter:title', title)
  setMeta('twitter:description', description)
  setMeta('twitter:image', image)
}

/**
 * @param {string} key
 * @param {string} content
 * @param {boolean} property
 */
function setMeta(key, content, property = true) {
  const attr = property ? 'property' : 'name'
  let el = document.querySelector(`meta[${attr}="${key}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}
