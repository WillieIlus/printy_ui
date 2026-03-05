<template>
  <div class="col-span-12 space-y-6">
    <DashboardPageHeader
      :title="`Quote #${id}`"
      :subtitle="slug"
    >
      <template #actions>
        <UButton
          variant="outline"
          size="sm"
          :loading="shareLoading"
          :disabled="shareLoading"
          @click="handleShare"
        >
          <UIcon name="i-lucide-share-2" class="w-4 h-4 mr-1" />
          Share
        </UButton>
        <UButton :to="`/dashboard/shops/${slug}/quotes`" variant="soft" size="sm">Back</UButton>
      </template>
    </DashboardPageHeader>

    <DashboardSkeletonState v-if="quoteStore.loading" variant="block" />
    <template v-else-if="quoteStore.currentQuote">
      <div class="col-span-12 grid gap-6 lg:grid-cols-2">
        <DashboardSectionCard title="Details">
          <div class="space-y-2">
            <p><span class="text-gray-500 dark:text-gray-400">Customer:</span> {{ quoteStore.currentQuote.customer_name }}</p>
            <p><span class="text-gray-500 dark:text-gray-400">Email:</span> {{ quoteStore.currentQuote.customer_email }}</p>
            <p><span class="text-gray-500 dark:text-gray-400">Status:</span> <UBadge :color="statusColor" variant="soft" size="sm">{{ quoteStore.currentQuote.status }}</UBadge></p>
            <p class="font-semibold text-gray-900 dark:text-white">Total: {{ quoteStore.currentQuote.total }}</p>
            <div v-if="quoteStore.currentQuote.notes" class="pt-2 border-t border-gray-200 dark:border-gray-700">
              <p class="text-sm text-gray-500 dark:text-gray-400 mb-1">Notes</p>
              <EditorRichTextDisplay :html="quoteStore.currentQuote.notes" />
            </div>
          </div>
        </DashboardSectionCard>
        <QuotesQuoteCalculator :totals="totals" />
      </div>
      <div class="col-span-12">
        <QuotesQuoteItemList :items="quoteItems" />
      </div>

      <!-- Share modal -->
      <QuotesQuoteShareModal
        v-model:open="shareModalOpen"
        :share-url="shareResult?.share_url ?? ''"
        :whatsapp-text="conciseWhatsAppText"
      />
    </template>
  </div>
</template>

<script setup lang="ts">
import { API } from '~/shared/api-paths'
import { useQuoteStore } from '~/stores/quote'

definePageMeta({
  layout: 'dashboard',
  middleware: ['auth', 'shop-owner'],
})

const route = useRoute()
const quoteStore = useQuoteStore()
const slug = computed(() => route.params.slug as string)
const id = computed(() => Number(route.params.id))
const statusColor = computed((): 'neutral' | 'warning' | 'success' | 'error' => {
  const m: Record<string, 'neutral' | 'warning' | 'success' | 'error'> = { draft: 'neutral', pending: 'warning', approved: 'success', rejected: 'error', completed: 'success' }
  return m[quoteStore.currentQuote?.status ?? ''] ?? 'neutral'
})
const totals = ref<{ subtotal: string; tax: string; total: string } | null>(null)

const quoteItems = computed(() => quoteStore.currentQuote?.items ?? [])

const shareLoading = ref(false)
const shareModalOpen = ref(false)
const shareResult = ref<{ share_url: string; whatsapp_text: string } | null>(null)
const toast = useToast()

/** Build concise summary: Title + Specs + Price + Link */
const conciseWhatsAppText = computed(() => {
  const q = quoteStore.currentQuote
  const url = shareResult.value?.share_url
  if (!q || !url) return ''
  const lines: string[] = []
  lines.push(`*Quote for ${q.customer_name}*`)
  lines.push('')
  for (const item of q.items ?? []) {
    const name = (item as { product_name?: string; title?: string; name?: string }).product_name
      ?? (item as { product_name?: string; title?: string; name?: string }).title
      ?? (item as { product_name?: string; title?: string; name?: string }).name
      ?? 'Item'
    const spec = item.spec_text || (item.chosen_width_mm && item.chosen_height_mm ? `${item.chosen_width_mm}×${item.chosen_height_mm}mm` : '') || item.pricing_mode || ''
    const qty = item.quantity ?? 1
    const total = item.line_total ?? ''
    lines.push(`• ${name} × ${qty}${spec ? ` (${spec})` : ''}${total ? ` = ${total}` : ''}`)
  }
  lines.push('')
  if (q.total) lines.push(`*Total: ${q.total}*`)
  lines.push('')
  lines.push(`View: ${url}`)
  return lines.join('\n')
})

async function handleShare() {
  if (!id.value) return
  shareLoading.value = true
  shareResult.value = null
  try {
    const { $api } = useNuxtApp()
    const data = await $api<{ share_url: string; whatsapp_text: string }>(
      API.staffQuoteShare(id.value),
      { method: 'POST' }
    )
    shareResult.value = data
    shareModalOpen.value = true
  } catch (err: unknown) {
    const status = typeof err === 'object' && err !== null && 'statusCode' in err
      ? (err as { statusCode?: number }).statusCode
      : undefined
    const msg = err instanceof Error ? err.message : ''
    toast.add({
      title: 'Could not create share link',
      description: status === 403
        ? 'Share requires staff access. Contact your admin.'
        : msg || 'Please try again or contact support if the problem persists.',
      color: 'error',
    })
  } finally {
    shareLoading.value = false
  }
}

onMounted(async () => {
  await quoteStore.fetchQuote(slug.value, id.value)
  if (quoteStore.currentQuote && (!quoteStore.currentQuote.items?.length)) {
    await quoteStore.fetchQuoteItems(slug.value, id.value)
    if (quoteStore.currentQuote) quoteStore.currentQuote.items = [...quoteStore.quoteItems]
  }
  try {
    totals.value = await quoteStore.calculateQuote(slug.value, id.value)
  } catch {
    totals.value = quoteStore.currentQuote
      ? { subtotal: quoteStore.currentQuote.subtotal, tax: quoteStore.currentQuote.tax, total: quoteStore.currentQuote.total }
      : null
  }
})
</script>
