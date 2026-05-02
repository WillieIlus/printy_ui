<template>
  <div class="space-y-6">
    <div v-if="loading" class="rounded-3xl border border-[var(--p-border)] bg-[var(--p-surface)] p-10 text-sm text-[var(--p-text-muted)]">
      Loading quote document...
    </div>

    <div v-else-if="errorMessage" class="rounded-3xl border border-[var(--p-error)]/30 bg-[var(--p-error-soft)] p-6 text-sm text-[var(--p-error)]">
      {{ errorMessage }}
    </div>

    <QuoteDocumentSheet
      v-else-if="documentModel"
      :document="documentModel"
      :back-to="`/dashboard/client/requests/${requestId}`"
      back-label="Back to request"
    />
  </div>
</template>

<script setup lang="ts">
import { API } from '~/shared/api-paths'
import { useQuoteRequests } from '~/composables/useQuoteRequests'
import { buildQuoteDocument } from '~/utils/quoteDocument'

definePageMeta({ layout: 'dashboard' })

const route = useRoute()
const { $api } = useNuxtApp()
const quoteRequests = useQuoteRequests()

const loading = ref(true)
const errorMessage = ref('')
const requestRecord = ref<Record<string, unknown> | null>(null)
const responseRecord = ref<Record<string, unknown> | null>(null)

const requestId = computed(() => Number(route.params.id))
const responseId = computed(() => Number(route.params.responseId))

const documentModel = computed(() => {
  if (!requestRecord.value || !responseRecord.value) return null
  return buildQuoteDocument(requestRecord.value, responseRecord.value, 'client')
})

async function load() {
  loading.value = true
  errorMessage.value = ''
  try {
    requestRecord.value = await quoteRequests.get(requestId.value) as Record<string, unknown>
    const responses = await $api<Record<string, unknown>[] | { results?: Record<string, unknown>[] }>(API.quoteRequestResponses(requestId.value))
    const list = Array.isArray(responses) ? responses : (responses.results ?? [])
    responseRecord.value = list.find((entry: Record<string, unknown>) => Number(entry.id) === responseId.value) ?? null
    if (!responseRecord.value) {
      throw new Error('This quote could not be found for your request.')
    }
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'Failed to load quote document.'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  void load()
})
</script>
