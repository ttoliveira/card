<script setup>
import { computed, ref } from 'vue'
import { shareViaWhatsApp } from '../../utils/whatsapp'
import { addToShareHistory, getShareHistory } from '../../utils/shareHistory'
import { formatPhoneDisplay, formatPhoneMask, extractLocalDigits } from '../../utils/phoneMask'

const props = defineProps({
  publicUrl: { type: String, required: true },
})

const copied = ref(false)
const recipientPhone = ref('')
const phoneError = ref(null)
const shareHint = ref(null)
const history = ref(getShareHistory())

const hasHistory = computed(() => history.value.length > 0)

function refreshHistory() {
  history.value = getShareHistory()
}

function formatSentAt(iso) {
  const date = new Date(iso)
  return date.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function onRecipientInput(event) {
  recipientPhone.value = formatPhoneMask(event.target.value)
  phoneError.value = null
}

function selectFromHistory(phone) {
  recipientPhone.value = formatPhoneMask(extractLocalDigits(phone))
  phoneError.value = null
}

async function copyLink() {
  try {
    await navigator.clipboard.writeText(props.publicUrl)
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 2000)
  } catch {
    copied.value = false
  }
}

async function sendToWhatsApp() {
  phoneError.value = null
  shareHint.value = null
  try {
    const { copied } = await shareViaWhatsApp(props.publicUrl, recipientPhone.value)
    addToShareHistory(recipientPhone.value)
    refreshHistory()
    shareHint.value = copied
      ? 'Link copiado! A URL está no início da mensagem — após enviar, o destinatário verá o preview do cartão.'
      : 'Envie a mensagem para o destinatário ver o preview do cartão com foto e descrição.'
  } catch (err) {
    phoneError.value = err instanceof Error ? err.message : 'Número inválido.'
  }
}
</script>

<template>
  <div class="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
    <h2 class="text-lg font-bold text-emerald-900">Cartão criado!</h2>
    <p class="mt-1 text-sm text-emerald-800">Compartilhe seu link público:</p>

    <div class="mt-3 flex gap-2">
      <input
        :value="publicUrl"
        readonly
        class="min-w-0 flex-1 rounded-lg border border-emerald-200 bg-white px-3 py-2 text-xs text-slate-700"
      />
      <button
        type="button"
        class="shrink-0 rounded-lg bg-white px-3 py-2 text-xs font-medium text-slate-700 ring-1 ring-emerald-200 hover:bg-emerald-100"
        @click="copyLink"
      >
        {{ copied ? 'Copiado!' : 'Copiar' }}
      </button>
    </div>

    <div class="mt-5 rounded-xl border border-emerald-200/80 bg-white p-4">
      <label class="block text-sm font-medium text-slate-700">
        Enviar para qual WhatsApp?
      </label>
      <p class="mt-0.5 text-xs text-slate-500">DDI +55 já incluído — digite DDD e número</p>

      <div class="mt-2 flex overflow-hidden rounded-lg border border-slate-300 focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/20">
        <span
          class="flex items-center border-r border-slate-200 bg-slate-50 px-3 text-sm font-medium text-slate-600"
        >
          +55
        </span>
        <input
          :value="recipientPhone"
          type="tel"
          inputmode="numeric"
          placeholder="(11) 99999-9999"
          class="min-w-0 flex-1 px-4 py-3 text-sm outline-none"
          @input="onRecipientInput"
          @keyup.enter="sendToWhatsApp"
        />
      </div>
      <p v-if="phoneError" class="mt-2 text-xs text-red-600">{{ phoneError }}</p>
      <p v-else-if="shareHint" class="mt-2 text-xs text-emerald-700">{{ shareHint }}</p>

      <button
        type="button"
        class="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] px-4 py-3 text-sm font-semibold text-white hover:bg-[#20bd5a]"
        @click="sendToWhatsApp"
      >
        Compartilhar no WhatsApp
      </button>
    </div>

    <section v-if="hasHistory" class="mt-4">
      <h3 class="text-xs font-semibold uppercase tracking-wider text-emerald-800">
        Enviados recentemente
      </h3>
      <ul class="mt-2 max-h-48 space-y-1 overflow-y-auto">
        <li v-for="item in history" :key="`${item.phone}-${item.sentAt}`">
          <button
            type="button"
            class="flex w-full items-center justify-between gap-2 rounded-lg bg-white/80 px-3 py-2.5 text-left text-sm transition hover:bg-white"
            @click="selectFromHistory(item.phone)"
          >
            <span class="font-medium text-slate-800">{{ formatPhoneDisplay(item.phone) }}</span>
            <span class="shrink-0 text-xs text-slate-500">{{ formatSentAt(item.sentAt) }}</span>
          </button>
        </li>
      </ul>
      <p class="mt-2 text-xs text-emerald-700/80">Toque em um número para reutilizar.</p>
    </section>
  </div>
</template>
