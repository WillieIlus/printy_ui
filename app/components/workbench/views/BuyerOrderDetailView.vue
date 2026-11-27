<script setup lang="ts">
import DesignBuyerSurface from '~/components/design/buyer/BuyerSurface.vue'
import DesignBuyerPageHeader from '~/components/design/buyer/BuyerPageHeader.vue'
import DesignBuyerSection from '~/components/design/buyer/BuyerSection.vue'
import DesignCard from '~/components/design/ui/Card.vue'
import DesignAlert from '~/components/design/ui/Alert.vue'
import DesignLoading from '~/components/design/ui/Loading.vue'
import DesignEmptyNote from '~/components/design/ui/EmptyNote.vue'
import QuoteResponsesPanel from '~/components/workbench/QuoteResponsesPanel.vue'
import { API } from '~/shared/api-paths'
import { getApiErrorMessage } from '~/shared/api'

const props = defineProps<{ orderId: number }>()

interface RequestItem {
  id: number
  product_name: string
  title: string
  spec_text: string
  quantity: number | null
}
interface RequestFile {
  id: number
  name: string
  download_url: string
}
interface RequestArtwork {
  state: 'missing' | 'uploaded' | 'with_manager'
  files: RequestFile[]
  review?: { state?: string; note?: string }
  approved?: boolean
  payment_block_reason?: string | null
}
interface RequestDetail {
  id: number
  request_reference: string
  status_label: string
  customer_name?: string
  assigned_manager?: { display_name?: string } | null
  manager_selection_mode?: string
  items?: RequestItem[]
  artwork?: RequestArtwork
  managed_job?: { id: number; code?: string; status: string } | null
}

const { api } = useApi()
const request = ref<RequestDetail | null>(null)
const loading = ref(true)
const error = ref('')
const artworkBusy = ref(false)
const artworkError = ref('')
const artworkNotice = ref('')
const selectedArtwork = ref<File | null>(null)
const artworkManagerHold = ref(false)

const artwork = computed(() => request.value?.artwork ?? null)
const managerName = computed(() => request.value?.assigned_manager?.display_name || 'your manager')

async function load() {
  if (!props.orderId) {
    error.value = 'That order link is missing a valid reference.'
    loading.value = false
    return
  }
  loading.value = true
  error.value = ''
  try {
    request.value = await api<RequestDetail>(API.client.request(props.orderId))
  } catch (caught) {
    error.value = getApiErrorMessage(caught, "We couldn't open that order.")
  } finally {
    loading.value = false
  }
}

async function refreshArtwork() {
  if (!props.orderId) return
  const payload = await api<RequestArtwork>(API.quoteRequests.artwork(props.orderId))
  if (request.value) request.value.artwork = payload
}

function onArtworkPicked(file: File) {
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
    return
  }
  if (file.size > 50 * 1024 * 1024) {
    artworkError.value = 'Artwork cannot exceed 50MB.'
    selectedArtwork.value = null
    return
  }
  selectedArtwork.value = file
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
    await api(API.quoteRequests.attachments(props.orderId), { method: 'POST', body: form })
    selectedArtwork.value = null
    artworkManagerHold.value = false
    await refreshArtwork()
    artworkNotice.value = 'Artwork received. Your manager can review it now.'
  } catch (caught) {
    artworkError.value = getApiErrorMessage(caught, 'We could not upload that artwork.')
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
    await api(API.quoteRequests.artwork(props.orderId), {
      method: 'POST',
      body: { state: 'with_manager' },
    })
    artworkManagerHold.value = false
    await refreshArtwork()
    artworkNotice.value = 'Noted. Your manager will confirm they hold the artwork.'
  } catch (caught) {
    artworkError.value = getApiErrorMessage(caught, 'We could not save that.')
  } finally {
    artworkBusy.value = false
  }
}

function submitArtwork() {
  if (artworkManagerHold.value && !selectedArtwork.value) {
    void declareArtworkWithManager()
    return
  }
  void uploadArtwork()
}

onMounted(load)
watch(() => props.orderId, load)
</script>

<template>
  <DesignBuyerSurface>
    <div class="mx-auto flex w-full max-w-[1080px] flex-col gap-6 pb-40">
      <DesignLoading v-if="loading" label="Opening your order…" />
      <DesignAlert v-else-if="error" tone="error" title="We couldn't open that order">{{ error }}</DesignAlert>

      <template v-else-if="request">
        <DesignBuyerPageHeader
          index="OR"
          kicker="Buyer desk"
          title="Your order"
          :description="`${request.request_reference} · ${request.status_label}`"
        >
          <template #actions>
            <NuxtLink
              to="/app/buyer"
              class="inline-flex h-10 items-center rounded-xl border border-line-strong bg-card px-4 text-sm font-semibold text-ink transition-colors hover:border-brand hover:text-brand"
            >
              Back to my quotes
            </NuxtLink>
          </template>
        </DesignBuyerPageHeader>

        <DesignCard data-test="buyer-request-detail" class="p-5">
          <div class="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p class="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-3">{{ request.request_reference }}</p>
              <h2 class="mt-1 text-xl font-bold tracking-tight">{{ request.items?.[0]?.product_name || request.items?.[0]?.title || 'Print job' }}</h2>
              <p class="mt-1 text-[12.5px] text-ink-2">With {{ managerName }}</p>
              <p class="mt-0.5 font-mono text-[10px] tracking-[0.08em] text-ink-3 uppercase">
                {{ request.manager_selection_mode === 'client_selected' ? 'You chose your manager' : 'Printy matched your manager' }}
              </p>
            </div>
            <span class="rounded-full bg-mint px-3 py-1 font-mono text-[9.5px] font-semibold uppercase tracking-[0.1em] text-brand-deep">{{ request.status_label }}</span>
          </div>
          <div v-if="request.items?.length" class="mt-4 grid gap-2 sm:grid-cols-2">
            <div v-for="item in request.items" :key="item.id" class="rounded-xl border border-line bg-paper-2 px-3.5 py-2.5">
              <p class="text-[13px] font-semibold">{{ item.product_name || item.title }}</p>
              <p class="mt-0.5 text-[11.5px] text-ink-2">{{ item.spec_text }}<span v-if="item.quantity"> · {{ item.quantity }}</span></p>
            </div>
          </div>
        </DesignCard>

        <DesignBuyerSection id="artwork" index="01" title="Artwork" hint="Your manager reviews the current file before payment opens.">
          <DesignCard class="p-5">
            <div v-if="artwork?.state === 'uploaded' && artwork.files.length" class="space-y-2">
              <p class="font-mono text-[9.5px] font-semibold uppercase tracking-[0.14em] text-brand-deep">Artwork received</p>
              <a
                v-for="file in artwork.files"
                :key="file.id"
                :href="file.download_url"
                target="_blank"
                rel="noopener"
                class="flex items-center justify-between gap-3 rounded-xl border border-line bg-paper-2 px-4 py-3 transition-colors hover:border-brand"
              >
                <span class="truncate text-[13px] font-semibold">{{ file.name }}</span>
                <span class="shrink-0 font-mono text-[9.5px] font-bold uppercase tracking-[0.1em] text-brand-deep">Download</span>
              </a>
            </div>
            <p v-if="artwork?.state === 'uploaded'" class="mt-3 rounded-xl border border-line bg-paper-2 px-4 py-3 text-[12.5px] leading-relaxed text-ink-2">
              <template v-if="artwork.approved">Artwork approved. You can continue to payment.</template>
              <template v-else-if="artwork.review?.state === 'changes_requested'">Your manager requested changes. {{ artwork.review?.note }}</template>
              <template v-else>Waiting for {{ managerName }} to approve the current artwork. Replacing the file resets this approval.</template>
            </p>
            <p v-else-if="artwork?.state === 'with_manager'" class="rounded-xl border border-line bg-paper-2 px-4 py-3 text-[12.5px] leading-relaxed text-ink-2">
              You told us your manager already holds the artwork. They will confirm it before payment opens.
            </p>
            <p v-else class="rounded-xl border border-line bg-paper-2 px-4 py-3 text-[12.5px] leading-relaxed text-ink-2">
              Add your artwork to continue. PDF, JPG, PNG, AI or EPS up to 50MB.
            </p>

            <div v-if="artwork?.state !== 'with_manager'" class="mt-4">
              <DesignArtworkUpload
                :file-name="selectedArtwork?.name ?? null"
                :busy="artworkBusy"
                :manager-hold="artworkManagerHold"
                manager-hold-label="My manager already has the artwork"
                submit-label="Submit artwork"
                :error="artworkError"
                :notice="artworkNotice"
                @pick="onArtworkPicked"
                @clear="selectedArtwork = null"
                @update:manager-hold="artworkManagerHold = $event"
                @submit="submitArtwork"
              />
            </div>
          </DesignCard>
        </DesignBuyerSection>

        <DesignBuyerSection id="quote" index="02" title="Quote" hint="Accept your quote to protect your payment and start production.">
          <QuoteResponsesPanel :request-id="request.id" />
          <DesignEmptyNote
            v-if="!request.managed_job"
            icon="ReceiptText"
            title="Waiting for your manager's quote"
            hint="The quote appears here as soon as your manager sends it."
            class="mt-4"
          />
          <DesignCard v-else class="mt-4 p-5">
            <div class="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p class="text-sm font-bold">Job {{ request.managed_job.code || request.managed_job.id }}</p>
                <p class="mt-0.5 text-[12px] text-ink-2">Payment is protected by Printy until you confirm delivery.</p>
              </div>
              <NuxtLink :to="`/app/buyer/jobs/${request.managed_job.id}`" class="inline-flex items-center rounded-xl bg-brand px-4 py-2.5 text-xs font-bold text-white hover:bg-brand-deep">
                Track production
              </NuxtLink>
            </div>
          </DesignCard>
        </DesignBuyerSection>
      </template>
    </div>
  </DesignBuyerSurface>
</template>
