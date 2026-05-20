/** @typedef {'minimal' | 'dark' | 'business'} CardTemplate */

export const TEMPLATES = [
  {
    id: 'minimal',
    label: 'Minimalista',
    description: 'Limpo e elegante',
    primaryColor: '#0f172a',
    backgroundColor: '#ffffff',
    buttonColor: '#0f172a',
  },
  {
    id: 'dark',
    label: 'Dark moderno',
    description: 'Visual escuro e atual',
    primaryColor: '#38bdf8',
    backgroundColor: '#0f172a',
    buttonColor: '#38bdf8',
  },
  {
    id: 'business',
    label: 'Empresarial colorido',
    description: 'Profissional com destaque',
    primaryColor: '#4f46e5',
    backgroundColor: '#f8fafc',
    buttonColor: '#4f46e5',
  },
]

/**
 * @param {CardTemplate} templateId
 */
export function getTemplateDefaults(templateId) {
  return TEMPLATES.find((t) => t.id === templateId) ?? TEMPLATES[0]
}
