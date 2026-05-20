<script setup>
import { RouterLink } from 'vue-router'
import { getLocalCardAuth } from '../../utils/localStorage'

defineProps({
  showEdit: { type: Boolean, default: true },
})

const hasCard = !!getLocalCardAuth()
</script>

<template>
  <header class="sticky top-0 z-20 border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
    <div class="mx-auto flex h-14 max-w-lg items-center justify-between px-4">
      <RouterLink to="/" class="text-lg font-bold tracking-tight text-slate-900">
        Cartão<span class="text-indigo-600">Virtual</span>
      </RouterLink>
      <nav class="flex items-center gap-2 text-sm">
        <RouterLink
          v-if="hasCard && showEdit"
          to="/editar"
          class="rounded-lg px-3 py-1.5 font-medium text-slate-600 hover:bg-slate-100"
        >
          Editar
        </RouterLink>
        <RouterLink
          to="/criar"
          class="rounded-lg bg-indigo-600 px-3 py-1.5 font-medium text-white hover:bg-indigo-700"
        >
          {{ hasCard ? 'Novo' : 'Criar' }}
        </RouterLink>
      </nav>
    </div>
  </header>
</template>
