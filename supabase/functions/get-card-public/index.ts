import { handleCors, jsonResponse, errorResponse } from '../_shared/cors.ts'
import { createAdminClient } from '../_shared/supabase.ts'
import { PUBLIC_FIELDS } from '../_shared/card.ts'

Deno.serve(async (req) => {
  const cors = handleCors(req)
  if (cors) return cors

  try {
    let slug = ''

    if (req.method === 'GET') {
      const url = new URL(req.url)
      slug = url.searchParams.get('slug') ?? ''
    } else if (req.method === 'POST') {
      const body = await req.json()
      slug = String(body.slug ?? '').trim()
    } else {
      return errorResponse('Método não permitido.', 405)
    }

    if (!slug) return errorResponse('slug é obrigatório.')

    const supabase = createAdminClient()
    const { data, error } = await supabase
      .from('virtual_cards')
      .select(PUBLIC_FIELDS)
      .eq('slug', slug)
      .maybeSingle()

    if (error) return errorResponse(error.message, 500)

    return jsonResponse({ data })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erro ao buscar cartão.'
    return errorResponse(message, 400)
  }
})
