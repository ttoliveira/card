<script setup>
import { computed } from 'vue'
import { whatsAppUrl } from '../../../utils/whatsapp'

const props = defineProps({
  card: { type: Object, required: true },
  preview: { type: Boolean, default: false },
})

const servicesList = computed(() =>
  (props.card.services || '')
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean),
)

const waLink = computed(() => whatsAppUrl(props.card.whatsapp))
</script>

<template>
  <div
    class="overflow-hidden rounded-2xl shadow-lg"
    :style="{ backgroundColor: card.background_color }"
  >
    <div
      class="px-6 py-8 text-center text-white"
      :style="{
        background: `linear-gradient(135deg, ${card.primary_color}, ${card.button_color})`,
      }"
    >
      <img
        v-if="card.photo_url"
        :src="card.photo_url"
        :alt="card.name"
        class="mx-auto h-20 w-20 rounded-full border-4 border-white/30 object-cover"
      />
      <div
        v-else
        class="mx-auto flex h-20 w-20 items-center justify-center rounded-full border-4 border-white/30 bg-white/20 text-2xl font-bold"
      >
        {{ card.name?.charAt(0)?.toUpperCase() || '?' }}
      </div>
      <h1 class="mt-3 text-2xl font-bold">{{ card.name || 'Seu nome' }}</h1>
      <p v-if="card.description" class="mt-2 text-sm text-white/90">
        {{ card.description }}
      </p>
    </div>

    <div class="p-6">
      <div v-if="servicesList.length" class="mb-5">
        <h2 class="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">Serviços</h2>
        <div class="flex flex-wrap gap-2">
          <span
            v-for="service in servicesList"
            :key="service"
            class="rounded-full px-3 py-1 text-xs font-medium text-white"
            :style="{ backgroundColor: card.primary_color }"
          >
            {{ service }}
          </span>
        </div>
      </div>

      <a
        v-if="waLink && !preview"
        :href="waLink"
        target="_blank"
        rel="noopener noreferrer"
        class="flex w-full items-center justify-center gap-2 rounded-xl border-2 px-4 py-3 text-sm font-bold transition hover:opacity-90"
        :style="{ borderColor: card.button_color, color: card.button_color }"
      >
        Falar no WhatsApp
      </a>
      <span
        v-else-if="waLink && preview"
        class="flex w-full items-center justify-center gap-2 rounded-xl border-2 px-4 py-3 text-sm font-bold opacity-70"
        :style="{ borderColor: card.button_color, color: card.button_color }"
      >
        Falar no WhatsApp
      </span>

      <div
        v-if="card.instagram || card.linkedin || card.website"
        class="mt-5 grid grid-cols-3 gap-2 text-center text-xs font-medium"
      >
        <a
          v-if="card.instagram"
          :href="card.instagram.startsWith('http') ? card.instagram : `https://instagram.com/${card.instagram.replace('@', '')}`"
          target="_blank"
          rel="noopener noreferrer"
          class="rounded-lg bg-slate-100 py-2 text-slate-700 hover:bg-slate-200"
          @click.prevent="preview && $event.preventDefault()"
        >
          Instagram
        </a>
        <a
          v-if="card.linkedin"
          :href="card.linkedin.startsWith('http') ? card.linkedin : `https://linkedin.com/in/${card.linkedin}`"
          target="_blank"
          rel="noopener noreferrer"
          class="rounded-lg bg-slate-100 py-2 text-slate-700 hover:bg-slate-200"
          @click.prevent="preview && $event.preventDefault()"
        >
          LinkedIn
        </a>
        <a
          v-if="card.website"
          :href="card.website.startsWith('http') ? card.website : `https://${card.website}`"
          target="_blank"
          rel="noopener noreferrer"
          class="rounded-lg bg-slate-100 py-2 text-slate-700 hover:bg-slate-200"
          @click.prevent="preview && $event.preventDefault()"
        >
          Site
        </a>
      </div>
    </div>
  </div>
</template>
