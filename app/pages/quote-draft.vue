<template>
  <div class="min-h-screen bg-[var(--p-surface)]">
    <main class="mx-auto max-w-7xl px-4 pb-20 pt-10 sm:px-6 lg:px-8">
      <section class="relative mb-10 overflow-hidden rounded-[2rem] bg-[var(--p-surface-container-low)] p-8 md:p-12">
        <div class="relative z-10 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div class="max-w-2xl">
            <span class="inline-flex rounded-full bg-[var(--p-primary-fixed)] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-[var(--p-on-primary-fixed-variant,theme(colors.slate.700))]">
              Quote Files
            </span>
            <h1 class="mt-6 text-4xl font-extrabold tracking-tight text-[var(--p-text)] md:text-5xl">
              Group drafts by <span class="text-[var(--p-primary)]">company</span>, keep pricing by shop
            </h1>
            <p class="mt-4 max-w-2xl text-lg leading-8 text-[var(--p-text-muted)]">
              Each company file can contain drafts from multiple shops, but every shop keeps its own price preview, recalculation, subtotal, and PDF export.
            </p>
          </div>

          <div class="flex flex-wrap gap-3">
            <UButton color="primary" @click="createNewFile">
              <UIcon name="i-lucide-folder-plus" class="mr-2 h-4 w-4" />
              New company file
            </UButton>
            <UButton v-if="activeFile" variant="soft" color="neutral" :loading="downloadingFilePdf" @click="downloadFilePdf(activeFile)">
              <UIcon :name="downloadingFilePdf ? 'i-lucide-loader-circle' : 'i-lucide-download'" class="mr-2 h-4 w-4" :class="{ 'animate-spin': downloadingFilePdf }" />
              Company PDF
            </UButton>
            <UButton v-if="activeFile" variant="soft" color="neutral" :loading="sharingFile" @click="shareFileOnWhatsApp(activeFile)">
              <UIcon :name="sharingFile ? 'i-lucide-loader-circle' : 'i-lucide-message-circle'" class="mr-2 h-4 w-4" :class="{ 'animate-spin': sharingFile }" />
              Share on WhatsApp
            </UButton>
            <UButton to="/shops" variant="soft" color="neutral">
              Browse shops
            </UButton>
          </div>
        </div>

        <div class="absolute -right-12 -top-12 h-64 w-64 rounded-full bg-[var(--p-primary)]/8 blur-3xl" />
      </section>

      <CommonLoadingSpinner v-if="loading" />

      <template v-else-if="isAuthenticated">
        <div class="grid gap-6 xl:grid-cols-[22rem_minmax(0,1fr)]">
          <aside class="space-y-4">
            <article class="rounded-[1.5rem] bg-[var(--p-surface)] p-5 shadow-sm">
              <div class="flex items-center justify-between gap-3">
                <div>
                  <p class="text-[11px] font-bold uppercase tracking-[0.16em] text-[var(--p-text-muted)]">Company Files</p>
                  <h2 class="mt-2 text-xl font-bold text-[var(--p-text)]">{{ files.length }}</h2>
                </div>
                <div class="rounded-2xl bg-[var(--p-surface-container-low)] px-4 py-3 text-right">
                  <p class="text-[11px] font-bold uppercase tracking-[0.16em] text-[var(--p-text-muted)]">Draft items</p>
                  <p class="mt-1 text-lg font-semibold text-[var(--p-text)]">{{ totalItems }}</p>
                </div>
              </div>
            </article>

            <article
              v-for="file in files"
              :key="file.id"
              class="rounded-[1.5rem] border p-5 transition-all"
              :class="file.id === selectedFileId
                ? 'border-[var(--p-primary)] bg-[var(--p-surface)] shadow-sm'
                : 'border-[var(--p-border)] bg-[var(--p-surface-container-low)]'"
            >
              <button
                type="button"
                class="w-full text-left"
                @click="selectFile(file.id)"
              >
                <div class="flex items-start justify-between gap-4">
                  <div class="min-w-0">
                    <p class="truncate text-lg font-semibold text-[var(--p-text)]">{{ file.company_name }}</p>
                    <p class="mt-1 text-sm text-[var(--p-text-muted)]">
                      {{ file.shop_count }} shop{{ file.shop_count === 1 ? '' : 's' }} · {{ file.item_count }} item{{ file.item_count === 1 ? '' : 's' }}
                    </p>
                  </div>
                  <span class="rounded-full bg-[var(--p-surface-container)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--p-text-muted)]">
                    {{ file.status }}
                  </span>
                </div>
              </button>
            </article>
          </aside>

          <section v-if="activeFile" class="space-y-6">
            <article class="rounded-[1.5rem] bg-[var(--p-surface)] p-6 shadow-sm">
              <div class="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                <div class="grid flex-1 gap-4 md:grid-cols-2">
                  <label class="block">
                    <span class="mb-2 block text-sm font-medium text-[var(--p-text)]">Company name</span>
                    <input
                      v-model="fileForm.company_name"
                      type="text"
                      class="w-full rounded-xl border border-[var(--p-border)] bg-[var(--p-surface-container-low)] px-4 py-3 text-[var(--p-text)] outline-none transition focus:border-[var(--p-primary)] focus:ring-2 focus:ring-[var(--p-primary)]/15"
                    >
                  </label>
                  <label class="block">
                    <span class="mb-2 block text-sm font-medium text-[var(--p-text)]">Contact name</span>
                    <input
                      v-model="fileForm.contact_name"
                      type="text"
                      class="w-full rounded-xl border border-[var(--p-border)] bg-[var(--p-surface-container-low)] px-4 py-3 text-[var(--p-text)] outline-none transition focus:border-[var(--p-primary)] focus:ring-2 focus:ring-[var(--p-primary)]/15"
                    >
                  </label>
                  <label class="block">
                    <span class="mb-2 block text-sm font-medium text-[var(--p-text)]">Email</span>
                    <input
                      v-model="fileForm.contact_email"
                      type="email"
                      class="w-full rounded-xl border border-[var(--p-border)] bg-[var(--p-surface-container-low)] px-4 py-3 text-[var(--p-text)] outline-none transition focus:border-[var(--p-primary)] focus:ring-2 focus:ring-[var(--p-primary)]/15"
                    >
                  </label>
                  <label class="block">
                    <span class="mb-2 block text-sm font-medium text-[var(--p-text)]">Phone</span>
                    <input
                      v-model="fileForm.contact_phone"
                      type="text"
                      class="w-full rounded-xl border border-[var(--p-border)] bg-[var(--p-surface-container-low)] px-4 py-3 text-[var(--p-text)] outline-none transition focus:border-[var(--p-primary)] focus:ring-2 focus:ring-[var(--p-primary)]/15"
                    >
                  </label>
                </div>

                <div class="flex flex-wrap gap-3">
                  <UButton color="primary" :loading="savingFile" @click="saveActiveFile">
                    Save file details
                  </UButton>
                  <UButton variant="soft" color="neutral" :loading="downloadingFilePdf" @click="downloadFilePdf(activeFile)">
                    <UIcon :name="downloadingFilePdf ? 'i-lucide-loader-circle' : 'i-lucide-download'" class="mr-2 h-4 w-4" :class="{ 'animate-spin': downloadingFilePdf }" />
                    Download company PDF
                  </UButton>
                  <UButton variant="soft" color="neutral" :loading="sharingFile" @click="shareFileOnWhatsApp(activeFile)">
                    <UIcon :name="sharingFile ? 'i-lucide-loader-circle' : 'i-lucide-message-circle'" class="mr-2 h-4 w-4" :class="{ 'animate-spin': sharingFile }" />
                    Share on WhatsApp
                  </UButton>
                </div>
              </div>
            </article>

            <article
              v-for="group in activeFile.shop_groups"
              :key="group.draft_id"
              class="rounded-[1.5rem] bg-[var(--p-surface)] p-6 shadow-sm"
            >
              <div class="flex flex-col gap-5 border-b border-[var(--p-border)] pb-5 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <div class="flex flex-wrap items-center gap-3">
                    <h2 class="text-2xl font-bold text-[var(--p-text)]">{{ group.shop_name }}</h2>
                    <span class="rounded-full bg-[var(--p-surface-container)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--p-text-muted)]">
                      {{ group.item_count }} item{{ group.item_count === 1 ? '' : 's' }}
                    </span>
                  </div>
                  <p class="mt-2 text-sm text-[var(--p-text-muted)]">
                    Pricing, recalculation, and PDF export stay scoped to this shop only.
                  </p>
                </div>

                <div class="flex flex-wrap gap-3">
                  <UButton variant="soft" color="neutral" :loading="downloadingDraftId === group.draft_id" @click="downloadShopPdf(group)">
                    <UIcon :name="downloadingDraftId === group.draft_id ? 'i-lucide-loader-circle' : 'i-lucide-download'" class="mr-2 h-4 w-4" :class="{ 'animate-spin': downloadingDraftId === group.draft_id }" />
                    Download PDF
                  </UButton>
                  <UButton
                    color="primary"
                    :disabled="!group.item_count"
                    :loading="submittingDraftId === group.draft_id"
                    @click="submitShopDraft(group)"
                  >
                    <UIcon name="i-lucide-send" class="mr-2 h-4 w-4" />
                    Submit shop draft
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
                        <h3 class="text-base font-semibold text-[var(--p-text)]">
                          {{ item.product_name || item.title || 'Draft item' }}
                        </h3>
                        <p class="mt-1 text-sm leading-6 text-[var(--p-text-muted)]">
                          {{ item.spec_text || item.special_instructions || 'Configuration saved in this shop draft.' }}
                        </p>
                        <div class="mt-3 flex flex-wrap gap-2">
                          <span class="rounded-full bg-[var(--p-surface)] px-3 py-1 text-[11px] font-medium text-[var(--p-text-muted)]">
                            Qty {{ item.quantity }}
                          </span>
                          <span v-if="item.pricing_mode" class="rounded-full bg-[var(--p-surface)] px-3 py-1 text-[11px] font-medium text-[var(--p-text-muted)]">
                            {{ item.pricing_mode }}
                          </span>
                          <span v-if="item.sides" class="rounded-full bg-[var(--p-surface)] px-3 py-1 text-[11px] font-medium text-[var(--p-text-muted)]">
                            {{ item.sides }}
                          </span>
                          <span v-if="item.color_mode" class="rounded-full bg-[var(--p-surface)] px-3 py-1 text-[11px] font-medium text-[var(--p-text-muted)]">
                            {{ item.color_mode }}
                          </span>
                        </div>
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
                    <h3 class="text-base font-semibold text-[var(--p-text)]">Shop subtotal</h3>
                    <p class="mt-3 text-2xl font-extrabold text-[var(--p-text)]">
                      {{ formatCurrency(group.subtotal, group.shop_currency) }}
                    </p>
                    <p class="mt-2 text-sm text-[var(--p-text-muted)]">
                      This subtotal only reflects drafts inside {{ group.shop_name }}.
                    </p>
                  </article>

                  <QuotesQuotePreviewPrice
                    :draft-id="group.draft_id"
                    :has-items="group.item_count > 0"
                  />
                </div>
              </div>
            </article>

            <article v-if="!activeFile.shop_groups.length" class="rounded-[1.5rem] border border-dashed border-[var(--p-border)] bg-[var(--p-surface)] p-12 text-center">
              <UIcon name="i-lucide-folder-open" class="mx-auto h-16 w-16 text-[var(--p-border)]" />
              <h3 class="mt-4 text-xl font-semibold text-[var(--p-text)]">This company file is empty</h3>
              <p class="mt-2 text-sm leading-6 text-[var(--p-text-muted)]">
                Browse a shop and add products. New shop drafts will be attached to this company file automatically.
              </p>
              <UButton to="/shops" color="primary" class="mt-6">Browse shops</UButton>
            </article>
          </section>
        </div>
      </template>

      <div v-else class="mx-auto max-w-3xl rounded-[2rem] border border-[var(--p-border)] bg-[var(--p-surface)] p-12 text-center shadow-sm">
        <UIcon name="i-lucide-shopping-cart" class="mx-auto h-16 w-16 text-[var(--p-border)]" />
        <h3 class="mt-4 text-xl font-medium text-[var(--p-text)]">Sign in to organize quote files</h3>
        <p class="mt-2 text-sm leading-6 text-[var(--p-text-muted)]">
          Company grouping and per-shop pricing are available for saved account drafts.
        </p>
        <UButton to="/login" color="primary" class="mt-6">Log in</UButton>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import type { QuoteDraftFile, QuoteDraftShopGroup } from '~/shared/types/buyer'
import {
  createQuoteDraftFile,
  downloadQuoteDraftFilePdf,
  downloadQuoteDraftPdf,
  listQuoteDraftFiles,
  previewQuoteDraftFileWhatsapp,
  requestQuote,
  updateQuoteDraftFile,
} from '~/services/quoteDraft'
import { formatCurrency } from '~/utils/formatters'
import { useAuthStore } from '~/stores/auth'
import { useQuoteDraftStore } from '~/stores/quoteDraft'
import { getWhatsAppShareUrl } from '~/utils/quoteMessage'

definePageMeta({ layout: 'default' })

const route = useRoute()
const toast = useToast()
const authStore = useAuthStore()
const quoteDraftStore = useQuoteDraftStore()
const api = useApi()

const isAuthenticated = computed(() => authStore.isAuthenticated)
const loading = ref(false)
const savingFile = ref(false)
const submittingDraftId = ref<number | null>(null)
const downloadingFilePdf = ref(false)
const downloadingDraftId = ref<number | null>(null)
const sharingFile = ref(false)
const files = ref<QuoteDraftFile[]>([])
const selectedFileId = ref<number | null>(null)

const fileForm = reactive({
  company_name: '',
  contact_name: '',
  contact_email: '',
  contact_phone: '',
})

const activeFile = computed(() => files.value.find((file) => file.id === selectedFileId.value) ?? null)
const totalItems = computed(() => files.value.reduce((sum, file) => sum + file.item_count, 0))

watch(activeFile, (file) => {
  fileForm.company_name = file?.company_name ?? ''
  fileForm.contact_name = file?.contact_name ?? ''
  fileForm.contact_email = file?.contact_email ?? ''
  fileForm.contact_phone = file?.contact_phone ?? ''
  quoteDraftStore.selectFile(file?.id ?? null)
}, { immediate: true })

onMounted(async () => {
  if (!isAuthenticated.value) return
  await loadFiles()
  await attachShopDraftFromRoute()
})

async function loadFiles() {
  loading.value = true
  try {
    files.value = await listQuoteDraftFiles(api)
    const routeFileId = Number(route.query.file)
    const preferredId = Number.isFinite(routeFileId) && routeFileId > 0
      ? routeFileId
      : quoteDraftStore.currentFileId
    selectedFileId.value = files.value.find((file) => file.id === preferredId)?.id ?? files.value[0]?.id ?? null
  } catch (err) {
    toast.add({ title: 'Error', description: err instanceof Error ? err.message : 'Failed to load quote files', color: 'error' })
  } finally {
    loading.value = false
  }
}

async function createNewFile() {
  try {
    const created = await createQuoteDraftFile({ company_name: `Untitled Company ${files.value.length + 1}` }, api)
    files.value = [created, ...files.value]
    selectedFileId.value = created.id
    quoteDraftStore.selectFile(created.id)
    toast.add({ title: 'Company file created', description: 'New drafts can now be grouped into this file.' })
  } catch (err) {
    toast.add({ title: 'Error', description: err instanceof Error ? err.message : 'Could not create quote file', color: 'error' })
  }
}

function selectFile(fileId: number) {
  selectedFileId.value = fileId
}

async function saveActiveFile() {
  if (!activeFile.value) return
  savingFile.value = true
  try {
    const updated = await updateQuoteDraftFile(activeFile.value.id, {
      company_name: fileForm.company_name,
      contact_name: fileForm.contact_name,
      contact_email: fileForm.contact_email,
      contact_phone: fileForm.contact_phone,
    }, api)
    files.value = files.value.map((file) => file.id === updated.id ? updated : file)
    toast.add({ title: 'Company file updated', description: 'Drafts in this file will reuse these customer details.' })
  } catch (err) {
    toast.add({ title: 'Error', description: err instanceof Error ? err.message : 'Could not save file', color: 'error' })
  } finally {
    savingFile.value = false
  }
}

async function attachShopDraftFromRoute() {
  const shopSlug = typeof route.query.shop === 'string' ? route.query.shop : ''
  if (!shopSlug || !isAuthenticated.value) return

  if (!selectedFileId.value) {
    await createNewFile()
  }
  if (!selectedFileId.value) return

  try {
    await quoteDraftStore.loadDraftForContext(shopSlug, selectedFileId.value)
    await loadFiles()
  } catch (err) {
    toast.add({ title: 'Error', description: err instanceof Error ? err.message : 'Could not attach this shop to the current file', color: 'error' })
  }
}

async function submitShopDraft(group: QuoteDraftShopGroup) {
  submittingDraftId.value = group.draft_id
  try {
    await requestQuote(group.draft_id, api)
    await loadFiles()
    toast.add({ title: 'Shop draft submitted', description: `${group.shop_name} will now receive this request.` })
  } catch (err) {
    toast.add({ title: 'Error', description: err instanceof Error ? err.message : 'Could not submit shop draft', color: 'error' })
  } finally {
    submittingDraftId.value = null
  }
}

async function downloadShopPdf(group: QuoteDraftShopGroup) {
  downloadingDraftId.value = group.draft_id
  try {
    const blob = await downloadQuoteDraftPdf(group.draft_id)
    triggerBlobDownload(blob, `${group.shop_slug}-quote-draft.pdf`)
  } catch (err) {
    toast.add({ title: 'Error', description: err instanceof Error ? err.message : 'Could not download shop PDF', color: 'error' })
  } finally {
    downloadingDraftId.value = null
  }
}

async function downloadFilePdf(file: QuoteDraftFile) {
  downloadingFilePdf.value = true
  try {
    const blob = await downloadQuoteDraftFilePdf(file.id, api)
    triggerBlobDownload(blob, `quote-file-${file.id}.pdf`)
  } catch (err) {
    toast.add({ title: 'Error', description: err instanceof Error ? err.message : 'Could not download company PDF', color: 'error' })
  } finally {
    downloadingFilePdf.value = false
  }
}

async function shareFileOnWhatsApp(file: QuoteDraftFile) {
  sharingFile.value = true
  try {
    const preview = await previewQuoteDraftFileWhatsapp(file.id, api)
    window.open(getWhatsAppShareUrl(preview.message, file.contact_phone), '_blank', 'noopener,noreferrer')
  } catch (err) {
    toast.add({ title: 'Error', description: err instanceof Error ? err.message : 'Could not prepare WhatsApp share', color: 'error' })
  } finally {
    sharingFile.value = false
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
</script>
