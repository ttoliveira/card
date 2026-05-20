/**
 * Garante URL absoluta com https (WhatsApp só linka URLs completas).
 * @param {string} url
 * @returns {string}
 */
export function ensureHttpsUrl(url) {
  const trimmed = (url ?? '').trim()
  if (!trimmed) {
    throw new Error('Link do cartão indisponível.')
  }
  if (/^https:\/\//i.test(trimmed)) return trimmed
  if (/^http:\/\//i.test(trimmed)) return trimmed.replace(/^http:\/\//i, 'https://')
  return `https://${trimmed.replace(/^\/+/, '')}`
}

/**
 * Monta URL pública do cartão.
 * @param {string} slug
 * @returns {string}
 */
export function getPublicCardUrl(slug) {
  if (import.meta.env.VITE_APP_URL?.trim()) {
    return ensureHttpsUrl(`${import.meta.env.VITE_APP_URL.replace(/\/$/, '')}/c/${slug}`)
  }

  const url = new URL(`c/${slug}`, window.location.origin + import.meta.env.BASE_URL)
  return ensureHttpsUrl(url.href)
}
