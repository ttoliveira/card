<script setup>
import { storeToRefs } from 'pinia'
import { useCardStore } from '../../stores/cardStore'
import { TEMPLATES } from '../../constants/templates'
import PhotoUpload from './PhotoUpload.vue'
import { formatPhoneMask } from '../../utils/phoneMask'

const store = useCardStore()
const {
  name,
  whatsapp,
  description,
  services,
  instagram,
  linkedin,
  website,
  template,
  primaryColor,
  backgroundColor,
  buttonColor,
  photoUrl,
} = storeToRefs(store)

function onPhotoSelect(file) {
  store.photoFile = file
}

function selectTemplate(id) {
  store.applyTemplate(id)
}

function onWhatsAppInput(event) {
  whatsapp.value = formatPhoneMask(event.target.value)
}
</script>

<template>
  <form class="space-y-5" @submit.prevent>
    <PhotoUpload :photo-url="photoUrl" @select="onPhotoSelect" />

    <div>
      <label class="mb-1 block text-sm font-medium text-slate-700">Nome *</label>
      <input
        v-model="name"
        type="text"
        required
        maxlength="120"
        placeholder="Ex: Maria Silva"
        class="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
      />
    </div>

    <div>
      <label class="mb-1 block text-sm font-medium text-slate-700">WhatsApp *</label>
      <div
        class="flex overflow-hidden rounded-xl border border-slate-300 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20"
      >
        <span
          class="flex items-center border-r border-slate-200 bg-slate-50 px-3 text-sm font-medium text-slate-600"
        >
          +55
        </span>
        <input
          :value="whatsapp"
          type="tel"
          inputmode="numeric"
          required
          placeholder="(11) 99999-9999"
          class="min-w-0 flex-1 px-4 py-3 text-sm outline-none"
          @input="onWhatsAppInput"
        />
      </div>
      <p class="mt-1 text-xs text-slate-500">DDI +55 já incluído</p>
    </div>

    <div>
      <label class="mb-1 block text-sm font-medium text-slate-700">Descrição</label>
      <textarea
        v-model="description"
        rows="3"
        maxlength="500"
        placeholder="Uma frase sobre você ou seu negócio"
        class="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
      />
    </div>

    <div>
      <label class="mb-1 block text-sm font-medium text-slate-700">Serviços</label>
      <textarea
        v-model="services"
        rows="4"
        placeholder="Um serviço por linha&#10;Ex: Consultoria&#10;Design"
        class="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
      />
    </div>

    <div class="grid gap-4 sm:grid-cols-2">
      <div>
        <label class="mb-1 block text-sm font-medium text-slate-700">Instagram</label>
        <input
          v-model="instagram"
          type="text"
          placeholder="@usuario ou URL"
          class="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
        />
      </div>
      <div>
        <label class="mb-1 block text-sm font-medium text-slate-700">LinkedIn</label>
        <input
          v-model="linkedin"
          type="text"
          placeholder="URL ou usuário"
          class="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
        />
      </div>
    </div>

    <div>
      <label class="mb-1 block text-sm font-medium text-slate-700">Website</label>
      <input
        v-model="website"
        type="url"
        placeholder="https://seusite.com"
        class="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
      />
    </div>

    <fieldset>
      <legend class="mb-2 text-sm font-medium text-slate-700">Modelo do cartão</legend>
      <div class="grid gap-2">
        <button
          v-for="tpl in TEMPLATES"
          :key="tpl.id"
          type="button"
          class="rounded-xl border px-4 py-3 text-left text-sm transition"
          :class="
            template === tpl.id
              ? 'border-indigo-500 bg-indigo-50 ring-2 ring-indigo-500/20'
              : 'border-slate-200 bg-white hover:border-slate-300'
          "
          @click="selectTemplate(tpl.id)"
        >
          <span class="font-semibold text-slate-900">{{ tpl.label }}</span>
          <span class="mt-0.5 block text-xs text-slate-500">{{ tpl.description }}</span>
        </button>
      </div>
    </fieldset>

    <fieldset>
      <legend class="mb-2 text-sm font-medium text-slate-700">Cores do tema</legend>
      <div class="grid grid-cols-3 gap-3">
        <label class="text-xs text-slate-600">
          Principal
          <input v-model="primaryColor" type="color" class="mt-1 h-10 w-full cursor-pointer rounded-lg border border-slate-200" />
        </label>
        <label class="text-xs text-slate-600">
          Fundo
          <input v-model="backgroundColor" type="color" class="mt-1 h-10 w-full cursor-pointer rounded-lg border border-slate-200" />
        </label>
        <label class="text-xs text-slate-600">
          Botão
          <input v-model="buttonColor" type="color" class="mt-1 h-10 w-full cursor-pointer rounded-lg border border-slate-200" />
        </label>
      </div>
    </fieldset>
  </form>
</template>
