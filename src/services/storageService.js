import { supabase, STORAGE_BUCKET } from './supabase'

/**
 * Upload da foto direto no Supabase Storage (policies no setup.sql).
 * @param {string} cardId
 * @param {File} file
 * @returns {Promise<string>}
 */
export async function uploadCardPhoto(cardId, file) {
  const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg'
  const path = `${cardId}/${Date.now()}.${ext}`

  const { error: uploadError } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(path, file, { upsert: true, contentType: file.type })

  if (uploadError) {
    throw new Error(`Falha no upload da foto: ${uploadError.message}`)
  }

  const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(path)
  return data.publicUrl
}
