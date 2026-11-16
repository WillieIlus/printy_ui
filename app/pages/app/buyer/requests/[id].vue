<script setup lang="ts">
/**
 * Client request detail.
 *
 * The page a buyer lands on immediately after choosing a manager and creating
 * an account. It reads the request the server actually created — never a
 * fabricated reference — and shows the live status, the selected specs, the
 * manager's offers and the next real action.
 */
import { computed, onMounted, ref } from 'vue'
import { ArrowLeft, ArrowRight, CheckCircle2, Clock3, FileText, Loader2, Package, Paperclip, ShieldCheck, Upload, UserRound } from 'lucide-vue-next'
import DesignBuyerSurface from '~/components/design/buyer/BuyerSurface.vue'
import DesignBuyerPageHeader from '~/components/design/buyer/BuyerPageHeader.vue'
import DesignBuyerSection from '~/components/design/buyer/BuyerSection.vue'
import DesignAlert from '~/components/design/ui/Alert.vue'
import DesignCard from '~/components/design/ui/Card.vue'
import DesignEmptyNote from '~/components/design/ui/EmptyNote.vue'
import DesignLoading from '~/components/design/ui/Loading.vue'
import DesignStat from '~/components/design/ui/Stat.vue'
import QuoteResponsesPanel from '~/components/workbench/QuoteResponsesPanel.vue'
import { API } from '~/shared/api-paths'
import { getApiErrorMessage } from '~/shared/api'
import { useApi } from '~/composables/useApi'

definePageMeta({
  layout: 'design-workspace',
  middleware: 'proto-role',
  breadcrumb: [
    { label: 'My orders', to: '/app/buyer' },
    { label: 'Request', to: '' },
  ],
})

useHead({
  title: 'Quote request',
  meta: [{ name: 'robots', content: 'noindex' }],
})

interface RequestItem {
  id: number
  item_type: string
  product_name: string
  title: string
  spec_text: string
  quantity: number | null
  chosen_width_mm: number | null
  chosen_height_mm: number | null
  sides: string
  color_mode: string
  special_instructions: string
  finishing_summary: string
}

interface RequestResponse {
  id: number
  status: string
  status_label: string
  total: string | number | null
  quote_reference?: string
}

interface RequestArtworkFile {
  id: number
  name: string
  download_url: string
  created_at?: string
}

interface RequestArtwork {
  state: 'missing' | 'uploaded' | 'with_manager'
  reference: string
  files: RequestArtworkFile[]
  declared_at?: string | null
  message?: string
}

interface RequestDetail {
  id: number
  request_reference: string
  code?: string | null
  tracking_url?: string | null
  status: string
  status_label: string
  request_snapshot?: Record<string, unknown> | null
  customer_name?: string
  assigned_manager?: { display_name?: string; short_title?: string } | null
  manager_selection_mode?: string
  delivery_preference?: string
  delivery_address?: string
  delivery_location?: string
  notes?: string
  created_at: string
  updated_at: string
  items?: RequestItem[]
  responses?: RequestResponse[]
  artwork?: RequestArtwork
  managed_job?: {
    id: number
    status: string
    payment_status: string
    assignment_status: string
    client_total: string | null
    tracking_token: string | null
  } | null
}

const route = useRoute()
const { api } = useApi()

const requestId = computed(() => {
  const raw = route.params.id
  const value = Array.isArray(raw) ? raw[0] : raw
  return /^\d+$/.test(String(value ?? '')) ? Number(value) : 0
})

const request = ref<RequestDetail | null>(null)
const loading = ref(true)
const error = ref('')

const managerName = computed(() =>
  request.value?.assigned_manager?.display_name
  || request.value?.assigned_manager?.short_title
  || 'Printy',
)

const responses = computed(() => request.value?.responses ?? [])
const hasOffers = computed(() => responses.value.length > 0)

const managerDeclined = computed(() => {
  if (!request.value) return false
  const snapshot = request.value.request_snapshot
  const declined = snapshot && typeof snapshot === 'object'
    ? Boolean((snapshot as Record<string, unknown>).manager_declined)
    : false
  return request.value.status === 'rejected' || declined
})

const rematchLink = computed(() => {
  if (!request.value) return '/app/buyer?tab=quote'
  return `/app/buyer?tab=quote&rematch=${request.value.id}`
})

const specs = computed(() => {
  const items = request.value?.items ?? []
  if (items.length) {
    return items.map((item) => ({
      key: item.id,
      title: item.product_name || item.title || 'Print job',
      detail: [
        item.spec_text,
        item.quantity ? `${item.quantity.toLocaleString('en-KE')} pcs` : '',
        item.finishing_summary && item.finishing_summary !== 'None' ? item.finishing_summary : '',
      ].filter(Boolean).join(' · '),
    }))
  }
  return []
})

function formatDate(value: string | null | undefined) {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  return date.toLocaleString('en-KE', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

async function load() {
  if (!requestId.value) {
    error.value = 'This request could not be found.'
    loading.value = false
    return
  }
  loading.value = true
  error.value = ''
  try {
    request.value = await api<RequestDetail>(API.client.request(requestId.value))
  } catch (e) {
    error.value = getApiErrorMessage(e, 'We could not load this request.')
  } finally {
    loading.value = false
  }
}

const artworkInput = ref<HTMLInputElement | null>(null)
const selectedArtwork = ref<File | null>(null)
const artworkBusy = ref(false)
const artworkError = ref('')
const artworkNotice = ref('')

const artwork = computed<RequestArtwork | null>(() => request.value?.artwork ?? null)

function pickArtwork() {
  artworkInput.value?.click()
}

function onArtworkPicked(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0] ?? null
  artworkError.value = ''
  artworkNotice.value = ''
  if (!file) {
    selectedArtwork.value = null
    return
  }
  const extension = file.name.split('.').pop()?.toLowerCase() ?? ''
  if (!['pdf', 'jpg', 'jpeg', 'png', 'ai', 'eps'].includes(extension)) {
    artworkError.value = 'Use a PDF, JPG, PNG, AI or EPS file.'
    selectedArtwork.value = null
    input.value = ''
    return
  }
  if (file.size > 50 * 1024 * 1024) {
    artworkError.value = 'Artwork cannot exceed 50MB.'
    selectedArtwork.value = null
    input.value = ''
    return
  }
  selectedArtwork.value = file
}

async function refreshArtwork() {
  if (!requestId.value) return
  const payload = await api<RequestArtwork>(API.quoteRequests.artwork(requestId.value))
  if (request.value) {
    request.value.artwork = payload
  }
}

async function uploadArtwork() {
  if (!selectedArtwork.value || artworkBusy.value) return
  artworkBusy.value = true
  artworkError.value = ''
  artworkNotice.value = ''
  try {
    const form = new FormData()
    form.append('file', selectedArtwork.value)
    form.append('name', selectedArtwork.value.name)
    await api(API.quoteRequests.attachments(requestId.value), { method: 'POST', body: form })
    selectedArtwork.value = null
    if (artworkInput.value) artworkInput.value.value = ''
    await refreshArtwork()
    artworkNotice.value = 'Artwork received. Your manager can see it with this request.'
  } catch (e) {
    artworkError.value = getApiErrorMessage(e, 'We could not upload that artwork.')
  } finally {
    artworkBusy.value = false
  }
}

async function declareArtworkWithManager() {
  if (artworkBusy.value) return
  artworkBusy.value = true
  artworkError.value = ''
  artworkNotice.value = ''
  try {
    await api(API.quoteRequests.artwork(requestId.value), {
      method: 'POST',
      body: { state: 'with_manager' },
    })
    await refreshArtwork()
    artworkNotice.value = 'Noted. Your manager will confirm they hold the artwork.'
  } catch (e) {
    artworkError.value = getApiErrorMessage(e, 'We could not save that.')
  } finally {
    artworkBusy.value = false
  }
}

onMounted(load)
</script>

<template>
  <DesignBuyerSurface>
    <div class="mx-auto flex w-full max-w-[1180px] flex-col gap-8 pt-2">
      <NuxtLink
        to="/app/buyer"
        class="inline-flex w-fit items-center gap-1.5 font-mono text-[10.5px] font-semibold uppercase tracking-[0.14em] text-ink-3 transition-colors hover:text-brand"
      >
        <ArrowLeft :size="13" /> Back to my orders
      </NuxtLink>

      <DesignLoading v-if="loading" label="Loading your request…" />

      <DesignAlert v-else-if="error" tone="error" title="Request unavailable">
        {{ error }}
        <NuxtLink to="/app/buyer" class="mt-2 inline-flex items-center gap-1 font-semibold text-brand-deep">
          Return to my orders <ArrowRight :size="12" />
        </NuxtLink>
      </DesignAlert>

      <template v-else-if="request">
        <DesignBuyerPageHeader
          index="RQ"
          kicker="Quote request"
          :title="request.request_reference"
          :description="`Sent to ${managerName}. This page tracks the exact request you created, from quote to delivery.`"
        >
          <template #actions>
            <span
              data-test="request-status"
              class="rounded-full bg-mint px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-brand-deep"
            >{{ request.status_label }}</span>
          </template>
        </DesignBuyerPageHeader>

        <div data-test="buyer-request-detail" class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <DesignCard class="p-5">
            <DesignStat label="Status" :value="request.status_label" tone="brand" hint="live from Printy" />
          </DesignCard>
          <DesignCard class="p-5">
            <DesignStat label="Print Manager" :value="managerName" hint="assigned to this request" />
          </DesignCard>
          <DesignCard class="p-5">
            <DesignStat label="Request code" :value="request.code || request.request_reference" hint="safe to share for tracking" />
          </DesignCard>
          <DesignCard class="p-5">
            <DesignStat label="Created" :value="formatDate(request.created_at)" hint="your local time" />
          </DesignCard>
        </div>

        <DesignBuyerSection
          id="request"
          index="01"
          title="What you asked for"
          hint="The specifications your manager is quoting against."
        >
          <DesignCard v-if="specs.length" class="overflow-hidden">
            <div class="divide-y divide-line">
              <div v-for="spec in specs" :key="spec.key" class="flex items-start gap-3 px-5 py-4">
                <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-mint">
                  <FileText :size="16" class="text-brand-deep" />
                </div>
                <div class="min-w-0">
                  <div class="text-sm font-bold text-ink">{{ spec.title }}</div>
                  <p class="mt-0.5 text-[12px] leading-relaxed text-ink-2">{{ spec.detail }}</p>
                </div>
              </div>
            </div>
          </DesignCard>
          <DesignEmptyNote
            v-else
            icon="ReceiptText"
            title="Specifications are with your manager"
            hint="Your manager can already see the job details in their workspace."
          />

          <div class="mt-4 grid gap-3 sm:grid-cols-2">
            <div class="rounded-2xl border border-line bg-card p-4">
              <div class="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.14em] text-ink-3">
                <UserRound :size="13" class="text-brand" /> Selection
              </div>
              <p class="mt-2 text-[13px] font-semibold text-ink">
                {{ request.manager_selection_mode === 'client_selected' ? 'You chose your manager' : 'Printy matched your manager' }}
              </p>
            </div>
            <div class="rounded-2xl border border-line bg-card p-4">
              <div class="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.14em] text-ink-3">
                <Clock3 :size="13" class="text-brand" /> Last update
              </div>
              <p class="mt-2 text-[13px] font-semibold text-ink">{{ formatDate(request.updated_at) }}</p>
            </div>
          </div>

          <p v-if="request.delivery_preference || request.delivery_address || request.delivery_location" class="mt-3 text-[12px] leading-relaxed text-ink-2">
            Delivery: {{ [request.delivery_preference, request.delivery_location, request.delivery_address].filter(Boolean).join(' · ') }}
          </p>
        </DesignBuyerSection>

        <DesignBuyerSection
          id="artwork"
          index="02"
          title="Artwork"
          hint="Send your print-ready file, or tell your manager it is already with them."
        >
          <DesignCard class="p-5">
            <div v-if="artwork?.state === 'uploaded' && artwork.files.length" class="space-y-2">
              <div class="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.14em] text-brand-deep">
                <CheckCircle2 :size="13" /> Artwork received
              </div>
              <div
                v-for="file in artwork.files"
                :key="file.id"
                class="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-line bg-paper-2 px-4 py-3"
              >
                <div class="flex min-w-0 items-center gap-2">
                  <Paperclip :size="14" class="shrink-0 text-brand" />
                  <span class="truncate text-[13px] font-semibold text-ink">{{ file.name }}</span>
                </div>
                <a
                  :href="file.download_url"
                  target="_blank"
                  rel="noopener"
                  class="inline-flex items-center gap-1 text-[11.5px] font-bold text-brand-deep hover:underline"
                >
                  Download
                </a>
              </div>
            </div>

            <div v-else-if="artwork?.state === 'with_manager'" class="flex items-start gap-3">
              <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-mint">
                <CheckCircle2 :size="16" class="text-brand-deep" />
              </div>
              <div>
                <div class="text-sm font-bold text-ink">Your manager already has the artwork</div>
                <p class="mt-0.5 text-[12px] leading-relaxed text-ink-2">
                  You told Printy your manager or printer holds the file. They will confirm it before production starts.
                </p>
              </div>
            </div>

            <div v-else class="flex items-start gap-3">
              <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-mint">
                <Upload :size="16" class="text-brand-deep" />
              </div>
              <div>
                <div class="text-sm font-bold text-ink">Add your artwork now</div>
                <p class="mt-0.5 text-[12px] leading-relaxed text-ink-2">
                  PDF, JPG, PNG, AI or EPS up to 50MB. You can replace it until you accept a quote.
                </p>
              </div>
            </div>

            <div class="mt-4 flex flex-wrap items-center gap-2">
              <input
                ref="artworkInput"
                type="file"
                accept=".pdf,.jpg,.jpeg,.png,.ai,.eps"
                class="hidden"
                data-test="artwork-input"
                @change="onArtworkPicked"
              >
              <button
                type="button"
                class="inline-flex items-center gap-1.5 rounded-xl border border-line-strong bg-card px-4 py-2.5 text-[12px] font-bold text-ink transition-colors hover:border-brand hover:text-brand"
                data-test="artwork-pick"
                @click="pickArtwork"
              >
                <Paperclip :size="13" /> Choose file
              </button>
              <button
                type="button"
                class="inline-flex items-center gap-1.5 rounded-xl bg-brand px-4 py-2.5 text-[12px] font-bold text-white transition-colors hover:bg-brand-deep disabled:cursor-not-allowed disabled:opacity-50"
                data-test="artwork-upload"
                :disabled="!selectedArtwork || artworkBusy"
                @click="uploadArtwork"
              >
                <Loader2 v-if="artworkBusy" :size="13" class="animate-spin" />
                <Upload v-else :size="13" />
                {{ selectedArtwork ? `Upload ${selectedArtwork.name}` : 'Upload artwork' }}
              </button>
              <button
                type="button"
                class="inline-flex items-center gap-1.5 rounded-xl border border-line-strong bg-card px-4 py-2.5 text-[12px] font-bold text-ink-2 transition-colors hover:border-brand hover:text-brand disabled:cursor-not-allowed disabled:opacity-50"
                data-test="artwork-with-manager"
                :disabled="artworkBusy || artwork?.state === 'with_manager'"
                @click="declareArtworkWithManager"
              >
                <UserRound :size="13" /> My manager already has it
              </button>
            </div>

            <p v-if="artworkError" class="mt-3 text-[12px] font-semibold text-red">{{ artworkError }}</p>
            <p v-else-if="artworkNotice" class="mt-3 text-[12px] font-semibold text-brand-deep">{{ artworkNotice }}</p>
          </DesignCard>
        </DesignBuyerSection>

        <DesignBuyerSection
          id="offers"
          index="03"
          title="Offers"
          hint="Accept an offer to start escrow and move this request into production."
        >
          <QuoteResponsesPanel :request-id="request.id" />
          <DesignEmptyNote
            v-if="!hasOffers && !managerDeclined"
            icon="ReceiptText"
            title="Waiting for your manager's quote"
            hint="Your manager is preparing the price. Refresh this page to see the offer as soon as it lands."
            class="mt-4"
          />
        </DesignBuyerSection>

        <DesignBuyerSection
          id="next"
          index="04"
          title="Next step"
          hint="Only real actions that move this job forward."
        >
          <DesignCard v-if="managerDeclined" class="p-5" data-test="buyer-request-declined">
            <div class="flex flex-wrap items-center justify-between gap-4">
              <div class="flex items-start gap-3">
                <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-soft">
                  <Clock3 :size="18" class="text-amber" />
                </div>
                <div>
                  <div class="text-sm font-bold text-ink">This manager couldn't take this request</div>
                  <p class="mt-0.5 max-w-[62ch] text-[12px] leading-relaxed text-ink-2">
                    Nothing was charged. Your specs are saved, so you can pick another verified manager
                    and send the same job as a fresh request.
                  </p>
                </div>
              </div>
              <NuxtLink
                :to="rematchLink"
                class="inline-flex items-center gap-1.5 rounded-xl bg-brand px-4 py-2.5 text-xs font-bold text-white transition-colors hover:bg-brand-deep"
                data-test="buyer-request-rematch"
              >
                Choose another manager <ArrowRight :size="13" />
              </NuxtLink>
            </div>
          </DesignCard>

          <DesignCard v-else-if="request.managed_job" class="p-5">
            <div class="flex flex-wrap items-center justify-between gap-4">
              <div class="flex items-start gap-3">
                <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-mint">
                  <Package :size="18" class="text-brand-deep" />
                </div>
                <div>
                  <div class="text-sm font-bold text-ink">Job {{ request.code }}</div>
                  <p class="mt-0.5 text-[12px] text-ink-2">
                    {{ request.managed_job.status }} · payment {{ request.managed_job.payment_status }}
                  </p>
                </div>
              </div>
              <NuxtLink
                :to="`/app/buyer/jobs/${request.managed_job.id}`"
                class="inline-flex items-center gap-1.5 rounded-xl bg-brand px-4 py-2.5 text-xs font-bold text-white transition-colors hover:bg-brand-deep"
              >
                Track production <ArrowRight :size="13" />
              </NuxtLink>
            </div>
          </DesignCard>

          <div v-else class="rounded-2xl border border-line bg-card p-5">
            <div class="flex items-start gap-3">
              <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-mint">
                <ShieldCheck :size="18" class="text-brand-deep" />
              </div>
              <div>
                <div class="text-sm font-bold text-ink">
                  {{ hasOffers ? 'Review the offer above' : 'Your manager is preparing the price' }}
                </div>
                <p class="mt-1 max-w-[68ch] text-[12px] leading-relaxed text-ink-2">
                  {{ hasOffers
                    ? 'Accept the offer to open escrow. Once payment is confirmed, Printy assigns the press and this page links straight to live production.'
                    : 'No payment is taken until you accept an offer. When the quote arrives it appears above with the price and ready date.' }}
                </p>
              </div>
            </div>
          </div>

          <NuxtLink
            to="/app/buyer"
            class="mt-4 inline-flex items-center gap-1.5 text-[12px] font-semibold text-brand-deep"
          >
            All my requests and orders <ArrowRight :size="12" />
          </NuxtLink>
        </DesignBuyerSection>
      </template>
    </div>
  </DesignBuyerSurface>
</template>
