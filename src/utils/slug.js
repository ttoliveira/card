const SLUG_CHARS = 'abcdefghijklmnopqrstuvwxyz0123456789'
const SLUG_LENGTH = 8

/**
 * Gera um slug curto e legível para URLs públicas.
 * @returns {string}
 */
export function generateSlug() {
  const bytes = crypto.getRandomValues(new Uint8Array(SLUG_LENGTH))
  return Array.from(bytes, (b) => SLUG_CHARS[b % SLUG_CHARS.length]).join('')
}
