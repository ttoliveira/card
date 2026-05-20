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
    class="overflow-hidden rounded-2xl shadow-xl"
    :style="{ backgroundColor: card.background_color }"
  >
    <div
      class="h-2"
      :style="{ background: `linear-gradient(90deg, ${card.button_color}, ${card.primary_color})` }"
    />
    <div class="p-6">
      <div class="flex items-center gap-4">
        <img
          v-if="card.photo_url"
          :src="card.photo_url"
          :alt="card.name"
          class="h-20 w-20 shrink-0 rounded-2xl object-cover"
        />
        <div
          v-else
          class="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-slate-800 text-2xl font-bold text-slate-500"
        >
          {{ card.name?.charAt(0)?.toUpperCase() || '?' }}
        </div>
        <div class="min-w-0 text-left">
          <h1 class="truncate text-xl font-bold text-white">
            {{ card.name || 'Seu nome' }}
          </h1>
          <p v-if="card.description" class="mt-1 line-clamp-2 text-sm text-slate-400">
            {{ card.description }}
          </p>
        </div>
      </div>

      <ul v-if="servicesList.length" class="mt-5 space-y-2">
        <li
          v-for="service in servicesList"
          :key="service"
          class="rounded-lg bg-slate-800/80 px-3 py-2 text-sm text-slate-300"
        >
          {{ service }}
        </li>
      </ul>

      <a
        v-if="waLink && !preview"
        :href="waLink"
        target="_blank"
        rel="noopener noreferrer"
        class="mt-6 flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-slate-900 transition hover:opacity-90"
        :style="{ backgroundColor: card.button_color }"
      >
        Chamar no WhatsApp
      </a>
      <span
        v-else-if="waLink && preview"
        class="mt-6 flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-slate-900 opacity-80"
        :style="{ backgroundColor: card.button_color }"
      >
        Chamar no WhatsApp
      </span>

      <div v-if="card.instagram || card.linkedin || card.website" class="mt-4 flex gap-4">
        <a
          v-if="card.instagram"
          :href="card.instagram.startsWith('http') ? card.instagram : `https://instagram.com/${card.instagram.replace('@', '')}`"
          target="_blank"
          rel="noopener noreferrer"
          class="text-sm text-slate-400 hover:text-white"
          @click.prevent="preview && $event.preventDefault()"
        >
          Instagram
        </a>
        <a
          v-if="card.linkedin"
          :href="card.linkedin.startsWith('http') ? card.linkedin : `https://linkedin.com/in/${card.linkedin}`"
          target="_blank"
          rel="noopener noreferrer"
          class="text-sm text-slate-400 hover:text-white"
          @click.prevent="preview && $event.preventDefault()"
        >
          LinkedIn
        </a>
        <a
          v-if="card.website"
          :href="card.website.startsWith('http') ? card.website : `https://${card.website}`"
          target="_blank"
          rel="noopener noreferrer"
          class="text-sm text-slate-400 hover:text-white"
          @click.prevent="preview && $event.preventDefault()"
        >
          Website
        </a>
      </div>
    </div>
  </div>
</template>
