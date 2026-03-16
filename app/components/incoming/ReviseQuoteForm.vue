<template>
  <form class="space-y-4" @submit.prevent="onSubmit">
    <UFormField label="Total">
      <UInput
        v-model="form.total"
        type="number"
        step="0.01"
        min="0"
        required
        :disabled="loading"
      />
    </UFormField>
    <UFormField label="Turnaround (business days)">
      <UInput
        v-model.number="form.turnaround_days"
        type="number"
        min="0"
        :disabled="loading"
      />
    </UFormField>
    <UFormField label="Note to customer">
      <UTextarea
        v-model="form.note"
        placeholder="Any message or instructions..."
        :rows="3"
        :disabled="loading"
      />
    </UFormField>
    <div class="flex gap-2">
      <UButton type="submit" color="primary" :loading="loading">
        <UIcon name="i-lucide-refresh-cw" class="w-4 h-4 mr-2" />
        Revise quote
      </UButton>
      <UButton type="button" variant="soft" :disabled="loading" @click="$emit('cancel')">
        Cancel
      </UButton>
    </div>
  </form>
</template>

<script setup lang="ts">
import type { ReviseQuotePayload } from '~/composables/useIncomingRequests'

const props = withDefaults(
  defineProps<{
    loading?: boolean
    initialTotal?: string | number | null
    initialNote?: string
    initialTurnaround?: number | null
  }>(),
  { loading: false, initialTotal: null, initialNote: '', initialTurnaround: null }
)

const emit = defineEmits<{
  submit: [payload: ReviseQuotePayload]
  cancel: []
}>()

const form = reactive({
  total: props.initialTotal != null ? String(props.initialTotal) : '',
  note: props.initialNote ?? '',
  turnaround_days: props.initialTurnaround ?? null as number | null,
})

function onSubmit() {
  const totalVal = form.total ? parseFloat(form.total) : null
  if (totalVal == null || Number.isNaN(totalVal)) return
  const payload: ReviseQuotePayload = {
    total: totalVal,
    note: form.note || undefined,
    turnaround_days: form.turnaround_days,
  }
  emit('submit', payload)
}
</script>
