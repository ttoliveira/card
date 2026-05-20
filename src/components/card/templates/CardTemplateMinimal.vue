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
    class="overflow-hidden rounded-2xl border border-slate-200 shadow-sm"
    :style="{ backgroundColor: card.background_color }"
  >
    <div class="p-6 text-center">
      <img
        v-if="card.photo_url"
        :src="card.photo_url"
        :alt="card.name"
        class="mx-auto h-24 w-24 rounded-full object-cover ring-4 ring-white shadow-md"
      />
      <div
        v-else
        class="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-slate-100 text-3xl font-semibold text-slate-400"
      >
        {{ card.name?.charAt(0)?.toUpperCase() || '?' }}
      </div>

      <h1 class="mt-4 text-xl font-bold" :style="{ color: card.primary_color }">
        {{ card.name || 'Seu nome' }}
      </h1>

      <p v-if="card.description" class="mt-2 text-sm leading-relaxed text-slate-600">
        {{ card.description }}
      </p>

      <ul v-if="servicesList.length" class="mt-4 space-y-1 text-left text-sm text-slate-700">
        <li v-for="service in servicesList" :key="service" class="flex items-start gap-2">
          <span class="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full" :style="{ backgroundColor: card.primary_color }" />
          {{ service }}
        </li>
      </ul>

      <div class="mt-6 flex flex-wrap justify-center gap-2">
        <a
          v-if="waLink && !preview"
          :href="waLink"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90"
          :style="{ backgroundColor: card.button_color }"
        >
          WhatsApp
        </a>
        <span
          v-else-if="waLink && preview"
          class="inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-white opacity-80"
          :style="{ backgroundColor: card.button_color }"
        >
          WhatsApp
        </span>
      </div>

      <div v-if="card.instagram || card.linkedin || card.website" class="mt-4 flex justify-center gap-3">
        <a
          v-if="card.instagram"
          :href="card.instagram.startsWith('http') ? card.instagram : `https://instagram.com/${card.instagram.replace('@', '')}`"
          target="_blank"
          rel="noopener noreferrer"
          class="text-xs font-medium underline-offset-2 hover:underline"
          :style="{ color: card.primary_color }"
          @click.prevent="preview && $event.preventDefault()"
        >
          Instagram
        </a>
        <a
          v-if="card.linkedin"
          :href="card.linkedin.startsWith('http') ? card.linkedin : `https://linkedin.com/in/${card.linkedin}`"
          target="_blank"
          rel="noopener noreferrer"
          class="text-xs font-medium underline-offset-2 hover:underline"
          :style="{ color: card.primary_color }"
          @click.prevent="preview && $event.preventDefault()"
        >
          LinkedIn
        </a>
        <a
          v-if="card.website"
          :href="card.website.startsWith('http') ? card.website : `https://${card.website}`"
          target="_blank"
          rel="noopener noreferrer"
          class="text-xs font-medium underline-offset-2 hover:underline"
          :style="{ color: card.primary_color }"
          @click.prevent="preview && $event.preventDefault()"
        >
          Site
        </a>
      </div>
    </div>
  </div>
</template>
