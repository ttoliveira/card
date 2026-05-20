/**
 * Gera chave secreta para edição sem login.
 * @returns {string}
 */
export function generateEditKey() {
  return crypto.randomUUID().replace(/-/g, '') + crypto.randomUUID().replace(/-/g, '')
}
