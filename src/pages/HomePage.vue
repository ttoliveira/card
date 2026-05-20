<script setup>
import { RouterLink } from 'vue-router'
import AppHeader from '../components/layout/AppHeader.vue'
import { getLocalCardAuth } from '../utils/localStorage'

const auth = getLocalCardAuth()
</script>

<template>
  <div class="min-h-dvh">
    <AppHeader :show-edit="false" />

    <main class="mx-auto max-w-lg px-4 py-10">
      <section class="text-center">
        <h1 class="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          Seu cartão virtual em menos de 1 minuto
        </h1>
        <p class="mt-4 text-slate-600">
          Crie um mini site pessoal com foto, serviços e WhatsApp. Compartilhe o link direto — sem
          cadastro.
        </p>

        <div class="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <RouterLink
            to="/criar"
            class="rounded-xl bg-indigo-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/25 hover:bg-indigo-700"
          >
            Criar meu cartão
          </RouterLink>
          <RouterLink
            v-if="auth"
            to="/editar"
            class="rounded-xl border border-slate-300 bg-white px-6 py-3.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Editar meu cartão
          </RouterLink>
        </div>
      </section>

      <section class="mt-14 grid gap-4 text-left">
        <div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <span class="text-2xl">⚡</span>
          <h2 class="mt-2 font-semibold text-slate-900">Rápido e simples</h2>
          <p class="mt-1 text-sm text-slate-600">Preencha, visualize em tempo real e publique.</p>
        </div>
        <div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <span class="text-2xl">📱</span>
          <h2 class="mt-2 font-semibold text-slate-900">Mobile first</h2>
          <p class="mt-1 text-sm text-slate-600">Experiência otimizada para celular e WhatsApp.</p>
        </div>
        <div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <span class="text-2xl">🔗</span>
          <h2 class="mt-2 font-semibold text-slate-900">Link único</h2>
          <p class="mt-1 text-sm text-slate-600">Compartilhe com uma URL curta e profissional.</p>
        </div>
      </section>
    </main>
  </div>
</template>
