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
 * @param {string} url
 * @returns {boolean}
 */
function isLocalhostUrl(url) {
  try {
    const { hostname } = new URL(url)
    return hostname === 'localhost' || hostname === '127.0.0.1'
  } catch {
    return false
  }
}

/**
 * URL base do app no navegador (ignora VITE_APP_URL se for localhost em produção).
 * @returns {string}
 */
export function getAppBaseUrl() {
  const envUrl = import.meta.env.VITE_APP_URL?.trim()

  if (envUrl && !isLocalhostUrl(envUrl)) {
    return envUrl.replace(/\/$/, '')
  }

  if (typeof window !== 'undefined') {
    const origin = window.location.origin
    const base = import.meta.env.BASE_URL.replace(/\/$/, '')
    return `${origin}${base}`.replace(/\/$/, '')
  }

  return envUrl?.replace(/\/$/, '') ?? ''
}

/**
 * Monta URL pública do cartão.
 * @param {string} slug
 * @returns {string}
 */
export function getPublicCardUrl(slug) {
  const base = getAppBaseUrl()
  if (!base) {
    throw new Error('Link do cartão indisponível.')
  }
  return ensureHttpsUrl(`${base}/c/${slug}`)
}
