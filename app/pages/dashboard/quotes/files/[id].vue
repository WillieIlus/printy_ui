<template>
  <div class="space-y-6">
    <DashboardPageHeader
      :title="activeFile?.customer_name || activeFile?.company_name || `Quote File #${fileId}`"
      subtitle="One customer/company file with shop-specific quote sections."
    >
      <template #actions>
        <UButton variant="soft" size="sm" to="/dashboard/quotes">Back</UButton>
      </template>
    </DashboardPageHeader>

    <CommonLoadingSpinner v-if="loading && !activeFile" />
    <div v-else-if="error" class="rounded-xl border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
      <p class="text-sm text-red-700 dark:text-red-300">{{ error }}</p>
    </div>
    <template v-else-if="activeFile">
      <div class="rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface)] p-6">
        <div class="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div class="grid flex-1 gap-4 md:grid-cols-2">
            <label class="block">
              <span class="mb-2 block text-sm font-medium text-[var(--p-text)]">Company / customer</span>
              <input v-model="fileForm.company_name" type="text" class="w-full rounded-xl border border-[var(--p-border)] bg-[var(--p-surface-container-low)] px-4 py-3 text-[var(--p-text)] outline-none transition focus:border-[var(--p-primary)] focus:ring-2 focus:ring-[var(--p-primary)]/15">
            </label>
            <label class="block">
              <span class="mb-2 block text-sm font-medium text-[var(--p-text)]">Contact name</span>
              <input v-model="fileForm.contact_name" type="text" class="w-full rounded-xl border border-[var(--p-border)] bg-[var(--p-surface-container-low)] px-4 py-3 text-[var(--p-text)] outline-none transition focus:border-[var(--p-primary)] focus:ring-2 focus:ring-[var(--p-primary)]/15">
            </label>
            <label class="block">
              <span class="mb-2 block text-sm font-medium text-[var(--p-text)]">Email</span>
              <input v-model="fileForm.contact_email" type="email" class="w-full rounded-xl border border-[var(--p-border)] bg-[var(--p-surface-container-low)] px-4 py-3 text-[var(--p-text)] outline-none transition focus:border-[var(--p-primary)] focus:ring-2 focus:ring-[var(--p-primary)]/15">
            </label>
            <label class="block">
              <span class="mb-2 block text-sm font-medium text-[var(--p-text)]">Phone</span>
              <input v-model="fileForm.contact_phone" type="text" class="w-full rounded-xl border border-[var(--p-border)] bg-[var(--p-surface-container-low)] px-4 py-3 text-[var(--p-text)] outline-none transition focus:border-[var(--p-primary)] focus:ring-2 focus:ring-[var(--p-primary)]/15">
            </label>
          </div>

          <div class="flex flex-wrap gap-3">
            <UButton color="primary" :loading="savingFile" @click="saveFile">Save</UButton>
            <UButton variant="soft" color="neutral" @click="downloadPdf">
              <UIcon name="i-lucide-download" class="mr-2 h-4 w-4" />
              Download PDF
            </UButton>
            <UButton variant="soft" color="neutral" :loading="loadingShare" @click="shareOnWhatsApp">
              <UIcon name="i-lucide-message-circle" class="mr-2 h-4 w-4" />
              Share on WhatsApp
            </UButton>
          </div>
        </div>
      </div>

      <div v-if="activeFile.shop_groups.length" class="space-y-6">
        <article
          v-for="group in activeFile.shop_groups"
          :key="`${group.shop_slug}-${group.draft_id}`"
          class="rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface)] p-6"
        >
          <div class="flex flex-col gap-4 border-b border-[var(--p-border)] pb-5 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <div class="flex flex-wrap items-center gap-3">
                <h2 class="text-2xl font-semibold text-[var(--p-text)]">{{ group.shop_name }}</h2>
                <UBadge :color="statusColor(group.status)" variant="soft">{{ statusLabel(group.status) }}</UBadge>
              </div>
              <p class="mt-2 text-sm text-[var(--p-text-muted)]">
                {{ group.item_count }} item{{ group.item_count === 1 ? '' : 's' }} in this shop section.
              </p>
              <p v-if="group.latest_sent_quote?.turnaround_days" class="mt-1 text-sm text-[var(--p-text-muted)]">
                Turnaround: {{ group.latest_sent_quote.turnaround_days }} business day(s)
              </p>
            </div>

            <div class="flex flex-wrap gap-3">
              <UButton variant="soft" color="neutral" @click="downloadShopPdf(group)">
                <UIcon name="i-lucide-download" class="mr-2 h-4 w-4" />
                Shop PDF
              </UButton>
              <UButton
                v-if="group.can_submit"
                color="primary"
                :loading="submittingDraftId === group.draft_id"
                @click="submitGroup(group)"
              >
                <UIcon name="i-lucide-send" class="mr-2 h-4 w-4" />
                Submit
              </UButton>
            </div>
          </div>

          <div class="mt-5 grid gap-6 xl:grid-cols-[minmax(0,1fr)_20rem]">
            <div class="space-y-4">
              <article
                v-for="item in group.items"
                :key="item.id"
                class="rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface-container-low)] p-4"
              >
                <div class="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div class="min-w-0">
                    <h3 class="text-base font-semibold text-[var(--p-text)]">{{ item.product_name || item.title || 'Quote item' }}</h3>
                    <p class="mt-1 text-sm leading-6 text-[var(--p-text-muted)]">
                      {{ item.spec_text || item.special_instructions || 'Saved configuration for this shop section.' }}
                    </p>
                  </div>
                  <div class="text-left md:text-right">
                    <p class="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--p-text-muted)]">Line total</p>
                    <p class="mt-1 text-lg font-bold text-[var(--p-text)]">
                      {{ item.line_total ? formatCurrency(item.line_total, group.shop_currency) : 'Pending' }}
                    </p>
                  </div>
                </div>
              </article>
            </div>

            <div class="space-y-4">
              <article class="rounded-2xl bg-[var(--p-surface-container-low)] p-5">
                <h3 class="text-base font-semibold text-[var(--p-text)]">Shop total</h3>
                <p class="mt-3 text-2xl font-extrabold text-[var(--p-text)]">
                  {{ formatCurrency(group.latest_sent_quote?.total || group.total || group.subtotal, group.shop_currency) }}
                </p>
                <p class="mt-2 text-sm text-[var(--p-text-muted)]">
                  Recalculation stays scoped to {{ group.shop_name }}.
                </p>
              </article>

              <QuotesQuotePreviewPrice
                v-if="group.can_recalculate"
                :draft-id="group.draft_id"
                :has-items="group.item_count > 0"
              />
            </div>
          </div>
        </article>
      </div>

      <DashboardEmptyState
        v-else
        title="No shop sections yet"
        description="Attach a shop to this quote file to start adding shop-specific quote items."
        icon="i-lucide-store"
      >
        <UButton to="/shops" color="primary">Browse shops</UButton>
      </DashboardEmptyState>
    </template>
  </div>
</template>

<script setup lang="ts">
import type { QuoteDraftFile, QuoteDraftShopGroup } from '~/shared/types/buyer'
import {
  downloadQuoteDraftFilePdf,
  downloadQuoteDraftPdf,
  getQuoteDraftFile,
  previewQuoteDraftFileWhatsapp,
  requestQuote,
  updateQuoteDraftFile,
} from '~/services/quoteDraft'
import { formatCurrency } from '~/utils/formatters'
import { getWhatsAppShareUrl } from '~/utils/quoteMessage'

definePageMeta({
  layout: 'dashboard',
  middleware: 'auth',
})

const route = useRoute()
const api = useApi()
const notification = useNotification()
const fileId = computed(() => Number(route.params.id))

const activeFile = ref<QuoteDraftFile | null>(null)
const loading = ref(false)
const error = ref<string | null>(null)
const savingFile = ref(false)
const loadingShare = ref(false)
const submittingDraftId = ref<number | null>(null)

const fileForm = reactive({
  company_name: '',
  contact_name: '',
  contact_email: '',
  contact_phone: '',
})

watch(activeFile, (file) => {
  fileForm.company_name = file?.company_name ?? ''
  fileForm.contact_name = file?.contact_name ?? ''
  fileForm.contact_email = file?.contact_email ?? ''
  fileForm.contact_phone = file?.contact_phone ?? ''
}, { immediate: true })

function statusLabel(status: string) {
  return status.charAt(0).toUpperCase() + status.slice(1)
}

function statusColor(status: string): 'neutral' | 'warning' | 'success' | 'error' {
  if (status === 'accepted') return 'success'
  if (status === 'quoted' || status === 'submitted' || status === 'viewed') return 'warning'
  if (status === 'cancelled' || status === 'closed') return 'error'
  return 'neutral'
}

async function loadFile() {
  if (!Number.isFinite(fileId.value)) return
  loading.value = true
  error.value = null
  try {
    activeFile.value = await getQuoteDraftFile(fileId.value, api, 'dashboard')
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to load quote file'
    activeFile.value = null
  } finally {
    loading.value = false
  }
}

async function saveFile() {
  if (!activeFile.value) return
  savingFile.value = true
  try {
    activeFile.value = await updateQuoteDraftFile(activeFile.value.id, {
      company_name: fileForm.company_name,
      contact_name: fileForm.contact_name,
      contact_email: fileForm.contact_email,
      contact_phone: fileForm.contact_phone,
    }, api)
    await loadFile()
    notification.success('Quote file updated')
  } catch (err) {
    notification.error(err instanceof Error ? err.message : 'Could not save quote file')
  } finally {
    savingFile.value = false
  }
}

async function downloadPdf() {
  if (!activeFile.value) return
  try {
    const blob = await downloadQuoteDraftFilePdf(activeFile.value.id, api, 'dashboard')
    triggerBlobDownload(blob, `quote-file-${activeFile.value.id}.pdf`)
  } catch (err) {
    notification.error(err instanceof Error ? err.message : 'Could not download PDF')
  }
}

async function shareOnWhatsApp() {
  if (!activeFile.value) return
  loadingShare.value = true
  try {
    const { message } = await previewQuoteDraftFileWhatsapp(activeFile.value.id, api)
    window.open(getWhatsAppShareUrl(message, activeFile.value.contact_phone), '_blank', 'noopener,noreferrer')
  } catch (err) {
    notification.error(err instanceof Error ? err.message : 'Could not prepare WhatsApp message')
  } finally {
    loadingShare.value = false
  }
}

async function submitGroup(group: QuoteDraftShopGroup) {
  submittingDraftId.value = group.draft_id
  try {
    await requestQuote(group.draft_id, api)
    await loadFile()
    notification.success(`${group.shop_name} draft submitted`)
  } catch (err) {
    notification.error(err instanceof Error ? err.message : 'Could not submit shop draft')
  } finally {
    submittingDraftId.value = null
  }
}

async function downloadShopPdf(group: QuoteDraftShopGroup) {
  try {
    const blob = await downloadQuoteDraftPdf(group.draft_id, api)
    triggerBlobDownload(blob, `${group.shop_slug}-quote-section.pdf`)
  } catch (err) {
    notification.error(err instanceof Error ? err.message : 'Could not download shop PDF')
  }
}

function triggerBlobDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  anchor.click()
  URL.revokeObjectURL(url)
}

onMounted(() => {
  void loadFile()
})
</script>
