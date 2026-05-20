<script setup>
import { computed } from 'vue'
import CardTemplateMinimal from './templates/CardTemplateMinimal.vue'
import CardTemplateDark from './templates/CardTemplateDark.vue'
import CardTemplateBusiness from './templates/CardTemplateBusiness.vue'

const props = defineProps({
  card: { type: Object, required: true },
  preview: { type: Boolean, default: true },
})

const templateComponent = computed(() => {
  const map = {
    minimal: CardTemplateMinimal,
    dark: CardTemplateDark,
    business: CardTemplateBusiness,
  }
  return map[props.card.template] ?? CardTemplateMinimal
})
</script>

<template>
  <component :is="templateComponent" :card="card" :preview="preview" />
</template>
