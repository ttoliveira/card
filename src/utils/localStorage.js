const STORAGE_KEY = 'virtual_card_auth'

/**
 * @typedef {{ card_id: string, edit_key: string }} CardAuth
 */

/**
 * @returns {CardAuth | null}
 */
export function getLocalCardAuth() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (!parsed?.card_id || !parsed?.edit_key) return null
    return parsed
  } catch {
    return null
  }
}

/**
 * @param {CardAuth} auth
 */
export function saveLocalCardAuth(auth) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(auth))
}

export function clearLocalCardAuth() {
  localStorage.removeItem(STORAGE_KEY)
}
