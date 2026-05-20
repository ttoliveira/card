<script setup>
import { ref } from 'vue'

const props = defineProps({
  photoUrl: { type: String, default: null },
})

const emit = defineEmits(['select'])

const previewUrl = ref(props.photoUrl)
const error = ref(null)

function onFileChange(event) {
  error.value = null
  const file = event.target.files?.[0]
  if (!file) return

  if (!file.type.startsWith('image/')) {
    error.value = 'Selecione um arquivo de imagem.'
    return
  }

  if (file.size > 5 * 1024 * 1024) {
    error.value = 'A imagem deve ter no máximo 5 MB.'
    return
  }

  if (previewUrl.value?.startsWith('blob:')) {
    URL.revokeObjectURL(previewUrl.value)
  }

  previewUrl.value = URL.createObjectURL(file)
  emit('select', file)
}
</script>

<template>
  <div class="flex flex-col items-center gap-3">
    <label
      class="group relative flex h-28 w-28 cursor-pointer items-center justify-center overflow-hidden rounded-full border-2 border-dashed border-slate-300 bg-slate-50 transition hover:border-indigo-400"
    >
      <img
        v-if="previewUrl || photoUrl"
        :src="previewUrl || photoUrl"
        alt="Foto do cartão"
        class="h-full w-full object-cover"
      />
      <span v-else class="text-center text-xs text-slate-500">
        <span class="block text-2xl">📷</span>
        Adicionar foto
      </span>
      <input type="file" accept="image/*" class="sr-only" @change="onFileChange" />
    </label>
    <p v-if="error" class="text-xs text-red-600">{{ error }}</p>
    <p v-else class="text-xs text-slate-500">PNG ou JPG, até 5 MB</p>
  </div>
</template>
