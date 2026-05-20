import { toWhatsAppDigits } from './phoneMask'

const STORAGE_KEY = 'whatsapp_share_history'
const MAX_ITEMS = 50

/**
 * @typedef {{ phone: string, sentAt: string }} ShareHistoryEntry
 */

/**
 * @returns {ShareHistoryEntry[]} mais recente primeiro
 */
export function getShareHistory() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const list = JSON.parse(raw)
    if (!Array.isArray(list)) return []
    return list
      .filter((item) => item?.phone && item?.sentAt)
      .sort((a, b) => new Date(b.sentAt) - new Date(a.sentAt))
  } catch {
    return []
  }
}

/**
 * Registra envio e move o número para o topo do histórico.
 * @param {string} phone
 */
export function addToShareHistory(phone) {
  let digits
  try {
    digits = toWhatsAppDigits(phone)
  } catch {
    return
  }

  const list = getShareHistory().filter((item) => item.phone !== digits)
  list.unshift({ phone: digits, sentAt: new Date().toISOString() })
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list.slice(0, MAX_ITEMS)))
}
