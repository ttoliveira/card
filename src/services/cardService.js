import { supabase } from './supabase'
import { generateEditKey } from '../utils/editKey'
import { generateSlug } from '../utils/slug'

const TABLE = 'virtual_cards'

/**
 * @typedef {Object} CardPayload
 * @property {string} template
 * @property {string} primary_color
 * @property {string} background_color
 * @property {string} button_color
 * @property {string | null} photo_url
 * @property {string} name
 * @property {string} whatsapp
 * @property {string} description
 * @property {string} services
 * @property {string} instagram
 * @property {string} linkedin
 * @property {string} website
 */

/**
 * @param {CardPayload} payload
 * @param {string} [photoUrl]
 */
export async function createCard(payload, photoUrl = null) {
  const row = {
    id: crypto.randomUUID(),
    edit_key: generateEditKey(),
    slug: generateSlug(),
    ...payload,
    photo_url: photoUrl ?? payload.photo_url ?? null,
    updated_at: new Date().toISOString(),
  }

  const { data, error } = await supabase.from(TABLE).insert(row).select().single()

  if (error) {
    throw new Error(`Não foi possível criar o cartão: ${error.message}`)
  }

  return data
}

/**
 * @param {string} id
 * @param {string} editKey
 * @param {Partial<CardPayload>} payload
 */
export async function updateCard(id, editKey, payload) {
  const { data, error } = await supabase
    .from(TABLE)
    .update({ ...payload, updated_at: new Date().toISOString() })
    .eq('id', id)
    .eq('edit_key', editKey)
    .select()
    .single()

  if (error) {
    throw new Error(`Não foi possível atualizar o cartão: ${error.message}`)
  }

  if (!data) {
    throw new Error('Cartão não encontrado ou chave de edição inválida.')
  }

  return data
}

/**
 * @param {string} slug
 */
export async function getCardBySlug(slug) {
  const { data, error } = await supabase
    .from(TABLE)
    .select(
      'id, slug, template, primary_color, background_color, button_color, photo_url, name, whatsapp, description, services, instagram, linkedin, website',
    )
    .eq('slug', slug)
    .maybeSingle()

  if (error) {
    throw new Error(`Erro ao carregar cartão: ${error.message}`)
  }

  return data
}

/**
 * @param {string} id
 * @param {string} editKey
 */
export async function getCardForEdit(id, editKey) {
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .eq('id', id)
    .eq('edit_key', editKey)
    .maybeSingle()

  if (error) {
    throw new Error(`Erro ao carregar cartão: ${error.message}`)
  }

  if (!data) {
    throw new Error('Cartão não encontrado neste dispositivo.')
  }

  return data
}
