const BR_COUNTRY_CODE = '55'
const LOCAL_LENGTH = 11

/**
 * Extrai DDD + número (11 dígitos), removendo o 55 se o usuário digitar.
 * @param {string} value
 * @returns {string}
 */
export function extractLocalDigits(value) {
  let digits = (value ?? '').replace(/\D/g, '')
  if (digits.startsWith(BR_COUNTRY_CODE)) {
    digits = digits.slice(2)
  }
  return digits.slice(0, LOCAL_LENGTH)
}

/**
 * Formata como (99) 99999-9999
 * @param {string} value dígitos locais ou valor mascarado
 * @returns {string}
 */
export function formatPhoneMask(value) {
  const d = extractLocalDigits(value)
  if (!d.length) return ''
  if (d.length <= 2) return `(${d}`
  if (d.length <= 7) return `(${d.slice(0, 2)}) ${d.slice(2)}`
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`
}

/**
 * Número completo para wa.me: 55 + 11 dígitos locais.
 * @param {string} value
 * @returns {string}
 */
export function toWhatsAppDigits(value) {
  const local = extractLocalDigits(value)
  if (local.length !== LOCAL_LENGTH) {
    throw new Error('Informe o número completo: (DD) 99999-9999')
  }
  return `${BR_COUNTRY_CODE}${local}`
}

/**
 * Exibição com +55 e máscara.
 * @param {string} stored número salvo (com ou sem 55)
 * @returns {string}
 */
export function formatPhoneDisplay(stored) {
  const local = extractLocalDigits(stored)
  if (!local) return ''
  return `+55 ${formatPhoneMask(local)}`
}
