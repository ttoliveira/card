<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import AppHeader from '../components/layout/AppHeader.vue'
import CardForm from '../components/form/CardForm.vue'
import CardPreview from '../components/card/CardPreview.vue'
import SharePanel from '../components/share/SharePanel.vue'
import { useCardStore } from '../stores/cardStore'
import { useCardSave } from '../composables/useCardSave'

const store = useCardStore()
const { saving, error } = storeToRefs(store)
const { save, publicUrl } = useCardSave()
const saved = ref(false)

const photoPreview = ref(store.photoUrl)

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

onMounted(() => {
  store.reset()
})

async function onSubmit() {
  saved.value = false
  try {
    await save(false)
    saved.value = true
    window.scrollTo({ top: 0, behavior: 'smooth' })
  } catch {
    /* erro exibido no store */
  }
}
</script>

<template>
  <div class="min-h-dvh pb-24">
    <AppHeader />

    <main class="mx-auto max-w-lg px-4 py-6">
      <h1 class="text-xl font-bold text-slate-900">Criar cartão virtual</h1>
      <p class="mt-1 text-sm text-slate-600">Pré-visualize enquanto preenche.</p>

      <SharePanel v-if="saved && publicUrl" class="mt-6" :public-url="publicUrl" />

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
            {{ saving ? 'Salvando...' : 'Publicar cartão' }}
          </button>
        </section>

        <section class="mt-8 lg:mt-0">
          <p class="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
            Pré-visualização
          </p>
          <CardPreview :card="previewCard" :preview="true" />
        </section>
      </div>
    </main>
  </div>
</template>
