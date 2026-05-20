import { handleCors, jsonResponse, errorResponse } from '../_shared/cors.ts'
import { BUCKET, createAdminClient } from '../_shared/supabase.ts'
import { verifyEditKey } from '../_shared/card.ts'

const MAX_BYTES = 5 * 1024 * 1024
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']

Deno.serve(async (req) => {
  const cors = handleCors(req)
  if (cors) return cors

  if (req.method !== 'POST') {
    return errorResponse('Método não permitido.', 405)
  }

  try {
    const form = await req.formData()
    const cardId = String(form.get('card_id') ?? '').trim()
    const editKey = String(form.get('edit_key') ?? '').trim()
    const file = form.get('file')

    if (!cardId || !editKey) {
      return errorResponse('card_id e edit_key são obrigatórios.')
    }

    if (!(file instanceof File)) {
      return errorResponse('Arquivo de imagem é obrigatório.')
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return errorResponse('Use JPG, PNG ou WebP.')
    }

    if (file.size > MAX_BYTES) {
      return errorResponse('Imagem deve ter no máximo 5 MB.')
    }

    const supabase = createAdminClient()
    await verifyEditKey(supabase, cardId, editKey)

    const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg'
    const path = `${cardId}/${Date.now()}.${ext}`

    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(path, file, { upsert: true, contentType: file.type })

    if (uploadError) return errorResponse(uploadError.message, 500)

    const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(path)
    const photoUrl = urlData.publicUrl

    const { data, error } = await supabase
      .from('virtual_cards')
      .update({ photo_url: photoUrl, updated_at: new Date().toISOString() })
      .eq('id', cardId)
      .eq('edit_key', editKey)
      .select()
      .single()

    if (error) return errorResponse(error.message, 500)

    return jsonResponse({ data: { photo_url: photoUrl, card: data } })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erro no upload.'
    return errorResponse(message, 400)
  }
})
