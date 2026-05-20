import { handleCors, jsonResponse, errorResponse } from '../_shared/cors.ts'
import { createAdminClient } from '../_shared/supabase.ts'

Deno.serve(async (req) => {
  const cors = handleCors(req)
  if (cors) return cors

  if (req.method !== 'POST') {
    return errorResponse('Método não permitido.', 405)
  }

  try {
    const body = await req.json()
    const cardId = String(body.card_id ?? '').trim()
    const editKey = String(body.edit_key ?? '').trim()

    if (!cardId || !editKey) {
      return errorResponse('card_id e edit_key são obrigatórios.')
    }

    const supabase = createAdminClient()
    const { data, error } = await supabase
      .from('virtual_cards')
      .select('*')
      .eq('id', cardId)
      .eq('edit_key', editKey)
      .maybeSingle()

    if (error) return errorResponse(error.message, 500)
    if (!data) {
      return errorResponse('Cartão não encontrado neste dispositivo.', 404)
    }

    return jsonResponse({ data })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erro ao carregar cartão.'
    return errorResponse(message, 400)
  }
})
