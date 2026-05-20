<script setup>
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import CardPreview from '../components/card/CardPreview.vue'
import { getCardBySlug } from '../services/cardService'
import { getPublicCardUrl } from '../utils/url'
import { applyCardOgMeta } from '../utils/ogMeta'

const route = useRoute()
const card = ref(null)
const loading = ref(true)
const error = ref(null)

onMounted(async () => {
  try {
    const data = await getCardBySlug(route.params.slug)
    if (!data) {
      error.value = 'Cartão não encontrado.'
      return
    }
    card.value = data
    applyCardOgMeta(data, getPublicCardUrl(data.slug))
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Erro ao carregar cartão.'
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="min-h-dvh" :style="card ? { backgroundColor: card.background_color } : {}">
    <main class="mx-auto flex min-h-dvh max-w-md flex-col justify-center px-4 py-8">
      <p v-if="loading" class="text-center text-sm text-slate-500">Carregando cartão...</p>
      <p v-else-if="error" class="rounded-xl bg-white p-6 text-center text-sm text-red-600 shadow">
        {{ error }}
      </p>
      <CardPreview v-else-if="card" :card="card" :preview="false" />
    </main>
  </div>
</template>
