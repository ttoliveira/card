import { createClient, SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1'

const TABLE = 'virtual_cards'
const BUCKET = 'card-photos'

export { TABLE, BUCKET }

export function createAdminClient(): SupabaseClient {
  const url = Deno.env.get('SUPABASE_URL')
  const key = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
  if (!url || !key) {
    throw new Error('Variáveis SUPABASE_URL ou SUPABASE_SERVICE_ROLE_KEY ausentes.')
  }
  return createClient(url, key, { auth: { persistSession: false } })
}
