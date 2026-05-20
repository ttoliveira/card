import { extractLocalDigits, toWhatsAppDigits } from './phoneMask'
import { ensureHttpsUrl } from './url'

/**
 * Normaliza número para link wa.me (55 + DDD + número).
 * @param {string} phone
 * @returns {string}
 */
export function normalizeWhatsApp(phone) {
  const local = extractLocalDigits(phone)
  if (!local) return ''
  if (local.length === 11) return `55${local}`
  return (phone ?? '').replace(/\D/g, '')
}

/**
 * @param {string} phone
 * @returns {string}
 */
export function whatsAppUrl(phone) {
  const digits = normalizeWhatsApp(phone)
  if (!digits) return ''
  return `https://wa.me/${digits}`
}

/**
 * Mensagem otimizada: URL isolada em linha própria (melhor detecção no WhatsApp).
 * @param {string} publicUrl
 * @returns {string}
 */
export function buildShareMessage(publicUrl) {
  const url = ensureHttpsUrl(publicUrl)
  return `${url}\n\nOlá! Segue o link do meu cartão virtual 👆`
}

/**
 * Abre WhatsApp e copia o link (fallback se o texto pré-preenchido não linkar).
 * @param {string} publicUrl
 * @param {string} recipientPhone
 * @returns {Promise<{ url: string, copied: boolean }>}
 */
export async function shareViaWhatsApp(publicUrl, recipientPhone) {
  const digits = toWhatsAppDigits(recipientPhone)
  const url = ensureHttpsUrl(publicUrl)
  const message = buildShareMessage(url)

  let copied = false
  try {
    await navigator.clipboard.writeText(url)
    copied = true
  } catch {
    copied = false
  }

  const text = encodeURIComponent(message)
  window.open(`https://wa.me/${digits}?text=${text}`, '_blank', 'noopener,noreferrer')

  return { url, copied }
}
