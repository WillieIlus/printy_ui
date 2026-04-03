<template>
  <form class="space-y-4" @submit.prevent="onSubmit">
    <UFormField label="Total (optional — computed from items if blank)">
      <UInput
        v-model="form.total"
        type="number"
        step="0.01"
        min="0"
        placeholder="Leave blank to auto-calculate"
        :disabled="loading"
      />
    </UFormField>
    <UFormField label="Turnaround (working hours)">
      <UInput
        v-model.number="form.turnaround_hours"
        type="number"
        min="0"
        placeholder="e.g. 6"
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
        <UIcon name="i-lucide-send" class="w-4 h-4 mr-2" />
        Send quote
      </UButton>
      <UButton type="button" variant="soft" :disabled="loading" @click="$emit('cancel')">
        Cancel
      </UButton>
    </div>
  </form>
</template>

<script setup lang="ts">
import type { SendQuotePayload } from '~/composables/useIncomingRequests'

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
  submit: [payload: SendQuotePayload]
  cancel: []
}>()

const form = reactive({
  total: props.initialTotal != null ? String(props.initialTotal) : '',
  note: props.initialNote ?? '',
  turnaround_hours: props.initialTurnaround ?? null as number | null,
})

function onSubmit() {
  const payload: SendQuotePayload = {
    note: form.note || undefined,
    turnaround_hours: form.turnaround_hours,
  }
  if (form.total && !Number.isNaN(parseFloat(form.total))) {
    payload.total = parseFloat(form.total)
  }
  emit('submit', payload)
}
</script>
