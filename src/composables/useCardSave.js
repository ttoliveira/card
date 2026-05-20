import { ref } from 'vue'
import { useCardStore } from '../stores/cardStore'
import { createCard, updateCard } from '../services/cardService'
import { uploadCardPhoto } from '../services/storageService'
import { saveLocalCardAuth } from '../utils/localStorage'
import { getPublicCardUrl } from '../utils/url'
import { extractLocalDigits } from '../utils/phoneMask'

/**
 * Persiste cartão (criar ou atualizar) com upload opcional de foto.
 */
export function useCardSave() {
  const store = useCardStore()
  const publicUrl = ref(null)

  async function save(isEdit = false) {
    store.error = null
    store.saving = true
    publicUrl.value = null

    try {
      if (!store.name.trim()) {
        throw new Error('Informe seu nome.')
      }
      if (extractLocalDigits(store.whatsapp).length !== 11) {
        throw new Error('Informe seu WhatsApp completo: (DD) 99999-9999')
      }

      let photoUrl = store.photoUrl

      if (isEdit && store.cardId) {
        if (store.photoFile) {
          photoUrl = await uploadCardPhoto(store.cardId, store.photoFile)
        }

        const payload = { ...store.toPayload(), photo_url: photoUrl }
        const updated = await updateCard(store.cardId, store.editKey, payload)
        store.loadFromCard(updated)
        saveLocalCardAuth({ card_id: updated.id, edit_key: updated.edit_key })
        publicUrl.value = getPublicCardUrl(updated.slug)
        return updated
      }

      const payload = store.toPayload()
      const created = await createCard(payload, null)

      if (store.photoFile) {
        photoUrl = await uploadCardPhoto(created.id, store.photoFile)
        const updated = await updateCard(created.id, created.edit_key, {
          photo_url: photoUrl,
        })
        store.loadFromCard(updated)
        saveLocalCardAuth({ card_id: updated.id, edit_key: updated.edit_key })
        publicUrl.value = getPublicCardUrl(updated.slug)
        return updated
      }

      store.loadFromCard(created)
      saveLocalCardAuth({ card_id: created.id, edit_key: created.edit_key })
      publicUrl.value = getPublicCardUrl(created.slug)
      return created
    } catch (err) {
      store.error = err instanceof Error ? err.message : 'Erro ao salvar o cartão.'
      throw err
    } finally {
      store.saving = false
    }
  }

  return { save, publicUrl }
}
