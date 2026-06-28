<template>
  <UiCard class="space-y-5">
    <div>
      <p class="text-sm font-semibold uppercase tracking-[0.18em] text-primary-600">For shops</p>
      <h2 class="mt-3 text-2xl font-black text-slate-950">Preview market-ready rate logic before you build a full print stack.</h2>
    </div>
    <form class="grid gap-4 md:grid-cols-2" @submit.prevent="$emit('submit')">
      <UiInput v-model="quantityValue" type="number" min="1" label="Quantity" />
      <UiTextarea v-model="notesValue" label="Shop notes" />
      <div class="md:col-span-2">
        <UiButton type="submit" :loading="loading">Preview rate card output</UiButton>
      </div>
    </form>
  </UiCard>
</template>

<script setup lang="ts">
import UiButton from '~/components/ui/UiButton.vue'
import UiCard from '~/components/ui/UiCard.vue'
import UiInput from '~/components/ui/UiInput.vue'
import UiTextarea from '~/components/ui/UiTextarea.vue'

const quantityValue = defineModel<number>('quantity', { required: true })
const notesValue = defineModel<string>('notes', { required: true })

defineProps<{
  loading?: boolean
}>()

defineEmits<{
  submit: []
}>()
</script>
