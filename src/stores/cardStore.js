import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getTemplateDefaults } from '../constants/templates'
import { extractLocalDigits, formatPhoneMask, toWhatsAppDigits } from '../utils/phoneMask'

const defaultTemplate = getTemplateDefaults('minimal')

/** Estado do formulário de criação/edição com pré-visualização em tempo real. */
export const useCardStore = defineStore('card', () => {
  const name = ref('')
  const photoUrl = ref(null)
  const photoFile = ref(null)
  const whatsapp = ref('')
  const description = ref('')
  const services = ref('')
  const instagram = ref('')
  const linkedin = ref('')
  const website = ref('')
  const template = ref('minimal')
  const primaryColor = ref(defaultTemplate.primaryColor)
  const backgroundColor = ref(defaultTemplate.backgroundColor)
  const buttonColor = ref(defaultTemplate.buttonColor)
  const slug = ref(null)
  const cardId = ref(null)
  const editKey = ref(null)
  const saving = ref(false)
  const error = ref(null)

  function applyTemplate(templateId) {
    const defaults = getTemplateDefaults(templateId)
    template.value = templateId
    primaryColor.value = defaults.primaryColor
    backgroundColor.value = defaults.backgroundColor
    buttonColor.value = defaults.buttonColor
  }

  /**
   * @param {import('../services/cardService').CardPayload & { slug?: string, id?: string, edit_key?: string, photo_url?: string }} card
   */
  function loadFromCard(card) {
    name.value = card.name ?? ''
    photoUrl.value = card.photo_url ?? null
    photoFile.value = null
    whatsapp.value = formatPhoneMask(extractLocalDigits(card.whatsapp ?? ''))
    description.value = card.description ?? ''
    services.value = card.services ?? ''
    instagram.value = card.instagram ?? ''
    linkedin.value = card.linkedin ?? ''
    website.value = card.website ?? ''
    template.value = card.template ?? 'minimal'
    primaryColor.value = card.primary_color ?? defaultTemplate.primaryColor
    backgroundColor.value = card.background_color ?? defaultTemplate.backgroundColor
    buttonColor.value = card.button_color ?? defaultTemplate.buttonColor
    slug.value = card.slug ?? null
    cardId.value = card.id ?? null
    editKey.value = card.edit_key ?? null
    error.value = null
  }

  function reset() {
    name.value = ''
    photoUrl.value = null
    photoFile.value = null
    whatsapp.value = ''
    description.value = ''
    services.value = ''
    instagram.value = ''
    linkedin.value = ''
    website.value = ''
    applyTemplate('minimal')
    slug.value = null
    cardId.value = null
    editKey.value = null
    saving.value = false
    error.value = null
  }

  function toPayload() {
    return {
      template: template.value,
      primary_color: primaryColor.value,
      background_color: backgroundColor.value,
      button_color: buttonColor.value,
      photo_url: photoUrl.value,
      name: name.value.trim(),
      whatsapp: toWhatsAppDigits(whatsapp.value),
      description: description.value.trim(),
      services: services.value.trim(),
      instagram: instagram.value.trim(),
      linkedin: linkedin.value.trim(),
      website: website.value.trim(),
    }
  }

  return {
    name,
    photoUrl,
    photoFile,
    whatsapp,
    description,
    services,
    instagram,
    linkedin,
    website,
    template,
    primaryColor,
    backgroundColor,
    buttonColor,
    slug,
    cardId,
    editKey,
    saving,
    error,
    applyTemplate,
    loadFromCard,
    reset,
    toPayload,
  }
})
