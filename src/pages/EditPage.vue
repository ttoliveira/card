<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import AppHeader from '../components/layout/AppHeader.vue'
import CardForm from '../components/form/CardForm.vue'
import CardPreview from '../components/card/CardPreview.vue'
import SharePanel from '../components/share/SharePanel.vue'
import { useCardStore } from '../stores/cardStore'
import { useCardSave } from '../composables/useCardSave'
import { getCardForEdit } from '../services/cardService'
import { getLocalCardAuth } from '../utils/localStorage'
import { getPublicCardUrl } from '../utils/url'

const store = useCardStore()
const { saving, error } = storeToRefs(store)
const { save, publicUrl } = useCardSave()
const loading = ref(true)
const loadError = ref(null)

const photoPreview = ref(null)

watch(
  () => [store.photoUrl, store.photoFile],
  ([url, file]) => {
    if (photoPreview.value?.startsWith('blob:')) {
      URL.revokeObjectURL(photoPreview.value)
    }
    if (file) {
      photoPreview.value = URL.createObjectURL(file)
    } else {
      photoPreview.value = url
    }
  },
  { immediate: true },
)

const previewCard = computed(() => ({
  template: store.template,
  primary_color: store.primaryColor,
  background_color: store.backgroundColor,
  button_color: store.buttonColor,
  photo_url: photoPreview.value,
  name: store.name,
  whatsapp: store.whatsapp,
  description: store.description,
  services: store.services,
  instagram: store.instagram,
  linkedin: store.linkedin,
  website: store.website,
}))

const shareUrl = computed(() => publicUrl.value || (store.slug ? getPublicCardUrl(store.slug) : null))

onMounted(async () => {
  const auth = getLocalCardAuth()
  if (!auth) {
    loadError.value = 'Nenhum cartão encontrado neste dispositivo.'
    loading.value = false
    return
  }

  try {
    const card = await getCardForEdit(auth.card_id, auth.edit_key)
    store.loadFromCard(card)
    store.cardId = card.id
    store.editKey = card.edit_key
  } catch (err) {
    loadError.value = err instanceof Error ? err.message : 'Erro ao carregar.'
  } finally {
    loading.value = false
  }
})

async function onSubmit() {
  try {
    await save(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  } catch {
    /* erro no store */
  }
}
</script>

<template>
  <div class="min-h-dvh pb-24">
    <AppHeader />

    <main class="mx-auto max-w-lg px-4 py-6">
      <h1 class="text-xl font-bold text-slate-900">Editar cartão</h1>
      <p class="mt-1 text-sm text-slate-600">Alterações refletem na página pública.</p>

      <p v-if="loading" class="mt-8 text-sm text-slate-500">Carregando...</p>
      <p v-else-if="loadError" class="mt-8 text-sm text-red-600">{{ loadError }}</p>

      <template v-else>
        <SharePanel v-if="shareUrl" class="mt-6" :public-url="shareUrl" />

        <div class="mt-6 lg:grid lg:grid-cols-2 lg:gap-8">
          <section>
            <CardForm />
            <p v-if="error" class="mt-3 text-sm text-red-600">{{ error }}</p>
            <button
              type="button"
              class="mt-6 w-full rounded-xl bg-indigo-600 px-4 py-3.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-60"
              :disabled="saving"
              @click="onSubmit"
            >
              {{ saving ? 'Salvando...' : 'Salvar alterações' }}
            </button>
          </section>

          <section class="mt-8 lg:mt-0">
            <p class="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
              Pré-visualização
            </p>
            <CardPreview :card="previewCard" :preview="true" />
          </section>
        </div>
      </template>
    </main>
  </div>
</template>
