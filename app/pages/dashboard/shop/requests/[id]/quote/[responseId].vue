<template>
  <div class="space-y-6">
    <div v-if="loading" class="rounded-3xl border border-white/10 bg-slate-950 p-10 text-sm text-slate-300">
      Loading quote document...
    </div>

    <div v-else-if="errorMessage" class="rounded-3xl border border-rose-500/30 bg-rose-500/10 p-6 text-sm text-rose-100">
      {{ errorMessage }}
    </div>

    <QuoteDocumentSheet
      v-else-if="documentModel"
      :document="documentModel"
      back-to="/dashboard/shop/requests"
      back-label="Back to requests"
    />
  </div>
</template>

<script setup lang="ts">
import { useIncomingRequests, useSentQuotes } from '~/composables/useIncomingRequests'
import { useShopStore } from '~/stores/shop'
import { buildQuoteDocument } from '~/utils/quoteDocument'

definePageMeta({ layout: 'dashboard' })

const route = useRoute()
const shopStore = useShopStore()
const sentQuotes = useSentQuotes()

const loading = ref(true)
const errorMessage = ref('')
const requestRecord = ref<Record<string, unknown> | null>(null)
const responseRecord = ref<Record<string, unknown> | null>(null)

const requestId = computed(() => Number(route.params.id))
const responseId = computed(() => Number(route.params.responseId))
const activeShopSlug = computed(() => shopStore.selectedShopSlug || shopStore.currentShop?.slug || '')
const incomingRequests = useIncomingRequests(activeShopSlug)

const documentModel = computed(() => {
  if (!requestRecord.value || !responseRecord.value) return null
  return buildQuoteDocument(requestRecord.value, responseRecord.value, 'shop', shopStore.currentShop)
})

async function ensureShopContext() {
  if (!shopStore.selectedShopSlug) {
    await shopStore.fetchMyShops()
  }
  if (!shopStore.selectedShopSlug) {
    throw new Error('No accessible shop is selected.')
  }
  if (!shopStore.currentShop || shopStore.currentShop.slug !== shopStore.selectedShopSlug) {
    await shopStore.fetchShopBySlug(shopStore.selectedShopSlug)
  }
}

async function load() {
  loading.value = true
  errorMessage.value = ''
  try {
    await ensureShopContext()
    requestRecord.value = await incomingRequests.get(requestId.value) as Record<string, unknown>
    responseRecord.value = await sentQuotes.get(responseId.value) as Record<string, unknown>
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
