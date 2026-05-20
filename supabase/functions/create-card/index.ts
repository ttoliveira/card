import { handleCors, jsonResponse, errorResponse } from '../_shared/cors.ts'
import { createAdminClient } from '../_shared/supabase.ts'
import {
  generateEditKey,
  generateId,
  generateSlug,
  sanitizePayload,
} from '../_shared/card.ts'

Deno.serve(async (req) => {
  const cors = handleCors(req)
  if (cors) return cors

  if (req.method !== 'POST') {
    return errorResponse('Método não permitido.', 405)
  }

  try {
    const body = await req.json()
    const payload = sanitizePayload(body)

    const supabase = createAdminClient()
    const row = {
      id: generateId(),
      edit_key: generateEditKey(),
      slug: generateSlug(),
      ...payload,
      updated_at: new Date().toISOString(),
    }

    const { data, error } = await supabase
      .from('virtual_cards')
      .insert(row)
      .select()
      .single()

    if (error) return errorResponse(error.message, 500)

    return jsonResponse({ data })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erro ao criar cartão.'
    return errorResponse(message, 400)
  }
})
