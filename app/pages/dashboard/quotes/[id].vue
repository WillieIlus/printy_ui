<template>
  <div class="space-y-6">
    <DashboardPageHeader
      :title="`Quote #${id}`"
      :subtitle="quote?.shop_name"
    >
      <template #actions>
        <UButton variant="soft" size="sm" to="/dashboard/quotes">Back</UButton>
      </template>
    </DashboardPageHeader>

    <CommonLoadingSpinner v-if="loading && !quote" />
    <div v-else-if="error" class="rounded-xl border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 p-4">
      <p class="text-sm text-red-700 dark:text-red-300">{{ error }}</p>
    </div>
    <template v-else-if="quote">
      <!-- Summary card -->
      <div class="rounded-xl border border-[var(--p-border)] bg-[var(--p-surface)] p-6 grid gap-6 sm:grid-cols-2">
        <div>
          <h3 class="text-sm font-medium text-[var(--p-text-muted)]">Customer</h3>
          <p class="mt-1 font-medium text-[var(--p-text)]">{{ quote.customer_name || '—' }}</p>
          <p class="text-sm text-[var(--p-text-dim)]">{{ quote.customer_email || '—' }}</p>
          <p class="text-sm text-[var(--p-text-dim)]">{{ quote.customer_phone || '—' }}</p>
        </div>
        <div>
          <h3 class="text-sm font-medium text-[var(--p-text-muted)]">Status</h3>
          <UBadge :color="statusColor(quote.status)" variant="soft" class="mt-1">{{ quote.status }}</UBadge>
          <p class="mt-3 text-2xl font-bold text-[var(--p-text)]">
            {{ quote.total ? formatKES(quote.total) : '—' }}
          </p>
        </div>
      </div>

      <!-- Items -->
      <div>
        <h2 class="text-lg font-semibold text-[var(--p-text)] mb-4">Items</h2>
        <div v-if="quote.items?.length" class="space-y-4">
          <div
            v-for="item in quote.items"
            :key="item.id"
            class="rounded-xl border border-[var(--p-border)] bg-[var(--p-surface)] p-4"
          >
            <div class="flex justify-between items-start">
              <div>
                <p class="font-medium text-[var(--p-text)]">{{ item.product_name || item.title || 'Item' }}</p>
                <p class="text-sm text-[var(--p-text-muted)]">{{ item.quantity }} pcs × {{ item.unit_price ? formatKES(item.unit_price) : '—' }}</p>
              </div>
              <p class="font-semibold text-[var(--p-text)]">{{ item.line_total ? formatKES(item.line_total) : '—' }}</p>
            </div>
          </div>
        </div>
        <p v-else class="text-sm text-[var(--p-text-muted)]">No items yet.</p>

        <!-- Add item form (DRAFT only) -->
        <div v-if="quote.status === 'DRAFT' && shopSlug" class="mt-6">
          <DashboardQuotesQuoteItemAddForm
            v-if="showAddForm"
            :shop-slug="shopSlug"
            :loading="addingItem"
            @submit="onAddItem"
            @cancel="showAddForm = false"
          />
          <UButton v-else variant="soft" color="primary" @click="showAddForm = true">
            <UIcon name="i-lucide-plus" class="w-4 h-4 mr-2" />
            Add item
          </UButton>
        </div>
      </div>

      <!-- Send via WhatsApp -->
      <div
        v-if="quote.items?.length && canShowWhatsAppSection"
        class="rounded-xl border border-[var(--p-border)] bg-[var(--p-surface)] p-4 space-y-4"
      >
        <h3 class="text-sm font-medium text-[var(--p-text-muted)]">Send via WhatsApp</h3>

        <!-- Message preview (read-only) -->
        <div class="rounded-lg border border-[var(--p-border)] bg-[var(--p-surface-sunken)] p-3">
          <p
            v-if="displayMessage"
            class="text-sm text-[var(--p-text)] whitespace-pre-wrap font-mono"
          >
            {{ displayMessage }}
          </p>
          <p v-else-if="loadingPreview" class="text-sm text-[var(--p-text-muted)]">Loading message…</p>
          <p v-else-if="previewError" class="text-sm text-red-600 dark:text-red-400">{{ previewError }}</p>
          <p v-else class="text-sm text-[var(--p-text-muted)]">No message to display.</p>
        </div>

        <!-- Actions -->
        <div class="flex flex-wrap gap-2">
          <UButton
            variant="soft"
            size="sm"
            :loading="loadingPreview"
            :disabled="loadingPreview"
            @click="onCopyMessage"
          >
            <UIcon name="i-lucide-copy" class="w-4 h-4 mr-2" />
            Copy WhatsApp Message
          </UButton>
          <UButton
            variant="soft"
            size="sm"
            :disabled="!displayMessage || loadingPreview"
            @click="onOpenWhatsApp"
          >
            <UIcon name="i-lucide-message-circle" class="w-4 h-4 mr-2" />
            Open WhatsApp
          </UButton>
          <UButton
            v-if="quote.status === 'DRAFT' || quote.status === 'PRICED'"
            color="primary"
            size="sm"
            :loading="sending"
            @click="onMarkAsSent"
          >
            <UIcon name="i-lucide-send" class="w-4 h-4 mr-2" />
            Mark as Sent
          </UButton>
        </div>

        <p v-if="quote.status === 'SENT' && quote.sent_at" class="text-xs text-[var(--p-text-muted)]">
          Sent {{ formatDate(quote.sent_at) }}
        </p>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import type { StaffQuote, StaffQuoteItem, StaffQuoteStatus } from '~/shared/types'
import { formatKES, formatDate } from '~/utils/formatters'
import { getWhatsAppShareUrl } from '~/utils/quoteMessage'

definePageMeta({
  layout: 'dashboard',
  middleware: 'auth',
})

const route = useRoute()
const id = computed(() => Number(route.params.id))
const staffQuotes = useStaffQuotes()
const sellerStore = useSellerStore()
const notification = useNotification()

const quote = ref<StaffQuote | null>(null)
const loading = ref(false)
const error = ref<string | null>(null)
const sending = ref(false)
const addingItem = ref(false)
const showAddForm = ref(false)
const previewMessage = ref<string>('')
const loadingPreview = ref(false)
const previewError = ref<string | null>(null)

const shopSlug = computed(() => {
  if (!quote.value) return ''
  return quote.value.shop_slug ?? sellerStore.getShop(quote.value.shop)?.slug ?? ''
})

const canShowWhatsAppSection = computed(() => {
  if (!quote.value) return false
  return ['DRAFT', 'PRICED', 'SENT'].includes(quote.value.status)
})

const displayMessage = computed(() => {
  if (!quote.value) return ''
  if (quote.value.status === 'SENT' && quote.value.whatsapp_message) {
    return quote.value.whatsapp_message
  }
  return previewMessage.value
})

function statusColor(s: StaffQuoteStatus): 'neutral' | 'warning' | 'success' | 'error' {
  const m: Record<string, 'neutral' | 'warning' | 'success' | 'error'> = {
    DRAFT: 'neutral',
    SENT: 'warning',
    ACCEPTED: 'success',
    EXPIRED: 'error',
  }
  return m[s] ?? 'neutral'
}

async function fetchPreview() {
  if (!quote.value || quote.value.status === 'SENT') return
  loadingPreview.value = true
  previewError.value = null
  try {
    const { message } = await staffQuotes.whatsappPreview(id.value)
    previewMessage.value = message
  } catch (e) {
    previewError.value = e instanceof Error ? e.message : 'Failed to load preview'
    previewMessage.value = ''
  } finally {
    loadingPreview.value = false
  }
}

async function onCopyMessage() {
  let msg = displayMessage.value
  if (!msg) {
    await fetchPreview()
    msg = previewMessage.value
  }
  if (!msg) {
    notification.error('No message to copy')
    return
  }
  try {
    await copyToClipboard(msg)
    notification.success('Message copied to clipboard')
  } catch {
    notification.error('Could not copy. Try Open WhatsApp instead.')
  }
}

async function copyToClipboard(text: string): Promise<void> {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text)
  } else {
    throw new Error('Clipboard not available')
  }
}

function onOpenWhatsApp() {
  const msg = displayMessage.value
  if (!msg) return
  const phone = quote.value?.customer_phone
  const url = getWhatsAppShareUrl(msg, phone)
  window.open(url, '_blank', 'noopener,noreferrer')
}

async function onMarkAsSent() {
  sending.value = true
  try {
    quote.value = await staffQuotes.send(id.value)
    notification.success('Quote marked as sent')
  } catch (e) {
    notification.error(e instanceof Error ? e.message : 'Failed to send')
  } finally {
    sending.value = false
  }
}

async function fetchQuote() {
  loading.value = true
  error.value = null
  try {
    quote.value = await staffQuotes.get(id.value)
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Failed to load quote'
    quote.value = null
  } finally {
    loading.value = false
  }
}

async function onAddItem(payload: import('~/composables/useStaffQuotes').StaffQuoteItemPayload) {
  addingItem.value = true
  try {
    await staffQuotes.addItem(id.value, payload)
    notification.success('Item added')
    showAddForm.value = false
    await fetchQuote()
  } catch (e) {
    notification.error(e instanceof Error ? e.message : 'Failed to add item')
  } finally {
    addingItem.value = false
  }
}

watch(
  () => quote.value,
  (q) => {
    if (q?.items?.length && (q.status === 'DRAFT' || q.status === 'PRICED')) {
      fetchPreview()
    }
  },
  { immediate: true }
)

onMounted(async () => {
  sellerStore.fetchShops()
  await fetchQuote()
})
</script>
