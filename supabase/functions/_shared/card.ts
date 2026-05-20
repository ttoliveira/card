const SLUG_CHARS = 'abcdefghijklmnopqrstuvwxyz0123456789'
const SLUG_LENGTH = 8
const MAX_NAME = 120
const MAX_TEXT = 500

export const PUBLIC_FIELDS =
  'id, slug, template, primary_color, background_color, button_color, photo_url, name, whatsapp, description, services, instagram, linkedin, website'

export function generateSlug(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(SLUG_LENGTH))
  return Array.from(bytes, (b) => SLUG_CHARS[b % SLUG_CHARS.length]).join('')
}

export function generateEditKey(): string {
  return crypto.randomUUID().replace(/-/g, '') +
    crypto.randomUUID().replace(/-/g, '')
}

export function generateId(): string {
  return crypto.randomUUID()
}

export function sanitizePayload(raw: Record<string, unknown>) {
  const name = String(raw.name ?? '').trim()
  if (!name || name.length > MAX_NAME) {
    throw new Error('Nome é obrigatório (máx. 120 caracteres).')
  }

  const whatsapp = String(raw.whatsapp ?? '').replace(/\D/g, '')
  if (!whatsapp || whatsapp.length < 10) {
    throw new Error('WhatsApp inválido.')
  }

  const trim = (v: unknown, max = MAX_TEXT) =>
    String(v ?? '').trim().slice(0, max)

  const template = ['minimal', 'dark', 'business'].includes(String(raw.template))
    ? String(raw.template)
    : 'minimal'

  return {
    template,
    primary_color: String(raw.primary_color ?? '#0f172a').slice(0, 20),
    background_color: String(raw.background_color ?? '#ffffff').slice(0, 20),
    button_color: String(raw.button_color ?? '#0f172a').slice(0, 20),
    photo_url: raw.photo_url ? String(raw.photo_url).slice(0, 2048) : null,
    name,
    whatsapp,
    description: trim(raw.description),
    services: trim(raw.services, 2000),
    instagram: trim(raw.instagram, 256),
    linkedin: trim(raw.linkedin, 256),
    website: trim(raw.website, 256),
  }
}

export async function verifyEditKey(
  supabase: ReturnType<typeof import('./supabase.ts').createAdminClient>,
  cardId: string,
  editKey: string,
) {
  const { data, error } = await supabase
    .from('virtual_cards')
    .select('id, edit_key')
    .eq('id', cardId)
    .maybeSingle()

  if (error) throw new Error(error.message)
  if (!data || data.edit_key !== editKey) {
    throw new Error('Cartão não encontrado ou chave de edição inválida.')
  }
}
