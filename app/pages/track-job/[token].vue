<script setup lang="ts">
import { printyStatusDot, printyStatusVariant } from '~/constants/design'
import { getApiErrorMessage } from '~/shared/api'
import { fetchTrackedJob } from '~/services/jobs'

definePageMeta({ layout: 'track' })

const route = useRoute()
const token = computed(() => String(route.params.token || ''))
const copied = ref(false)

const { data: job, pending, error } = await useAsyncData<Record<string, any> | null>(
  `public-job-${token.value}`,
  () => fetchTrackedJob(token.value),
)

const isManagedJob = computed(() => job.value?.track_type === 'managed_job')
const managedStatusLabel = computed(() => String(job.value?.job_status || 'In progress'))
const managedEstimatedReadyLabel = computed(() => formatDeadline(job.value?.estimated_ready))
const managedPartnerName = computed(() => String(job.value?.partner_name || 'Printy support'))
const managedPartnerContact = computed(() => String(job.value?.partner_contact || ''))
const managedProofPreviewUrl = computed(() => String(job.value?.proof_preview_url || ''))

const errorMessage = computed(() => {
  if (!error.value) {
    return ''
  }
  return getApiErrorMessage(error.value, 'Printy could not load this tracking token.')
})

const safeSpecs = computed<Record<string, any>>(() => {
  const value = job.value?.specs
  return value && typeof value === 'object' ? value : {}
})

const normalizedStatus = computed(() => String(job.value?.status || '').toLowerCase())
const stageIndex = computed(() => {
  const status = normalizedStatus.value
  const specs = safeSpecs.value
  if (status.includes('closed') || status.includes('complete') || specs.completed || specs.completed_at) return 7
  if (status.includes('ready') || specs.ready_for_pickup || specs.pickup_ready || specs.ready_at) return 6
  if (status.includes('finish') || specs.finishing || specs.finish || specs.lamination) return 5
  if (status.includes('claim') || status.includes('production') || specs.in_production || specs.printing_started) return 4
  if (specs.artwork_received || specs.artwork || specs.file_name || specs.file_url || specs.uploaded_artwork) return 3
  if (specs.payment_confirmed || specs.amount_paid || specs.payment_method || specs.payment_status) return 2
  return 1
})

const timelineBase = [
  { key: 'quote_approved', label: 'Quote approved' },
  { key: 'payment_confirmed', label: 'Payment confirmed' },
  { key: 'artwork_received', label: 'Artwork received' },
  { key: 'in_production', label: 'In production' },
  { key: 'finishing', label: 'Finishing' },
  { key: 'ready_for_pickup', label: 'Ready for pickup' },
  { key: 'completed', label: 'Completed' },
]

const timelineSteps = computed(() => timelineBase.map((step, index) => ({
  ...step,
  labelLines: step.label.split(' '),
  state: index + 1 < stageIndex.value ? 'complete' : index + 1 === stageIndex.value ? 'active' : 'pending',
})))

const progressFillWidth = computed(() => {
  const percent = Math.max(0, Math.min(100, ((stageIndex.value - 1) / (timelineBase.length - 1)) * 100))
  return `calc(${percent}% - 30px)`
})

const jobReference = computed(() => {
  const id = job.value?.id ? `#${job.value.id}` : token.value
  return `Job ${id}`
})

const jobTitle = computed(() => String(job.value?.title || 'Tracked print job'))
const heroStatusLabel = computed(() => stageIndex.value >= 7 ? 'Completed' : timelineBase[stageIndex.value - 1]?.label || (job.value?.status_label || 'In progress'))
const expectedReadyLabel = computed(() => formatDeadline(job.value?.deadline))
const scheduleState = computed(() => job.value?.deadline ? 'On schedule' : 'Awaiting schedule')

const statusBadgeClass = computed(() => {
  return printyStatusVariant(heroStatusLabel.value)
})

const statusDotClass = computed(() => {
  return printyStatusDot(heroStatusLabel.value)
})

const detailRows = computed(() => [
  { label: 'Product', value: specValue(['product', 'product_name', 'item', 'service'], jobTitle.value) },
  { label: 'Quantity', value: quantityLabel.value },
  { label: 'Paper stock', value: specValue(['paper_stock', 'paper', 'stock', 'material'], 'Not shared publicly') },
  { label: 'Print', value: specValue(['print', 'print_type', 'sides', 'colour_mode'], 'Not shared publicly') },
  { label: 'Finish', value: finishLabel.value },
  { label: 'Size', value: specValue(['size', 'dimensions'], 'Custom') },
])

const quantityLabel = computed(() => {
  const quantity = safeSpecs.value.quantity || safeSpecs.value.qty
  if (!quantity) return 'Not shared publicly'
  return `${quantity} ${Number(quantity) === 1 ? 'unit' : 'units'}`
})

const finishLabel = computed(() => {
  const value = specValue(['finish', 'finishing', 'lamination'], '')
  if (value) return value
  if (Array.isArray(job.value?.finishing_capabilities) && job.value?.finishing_capabilities.length) {
    return job.value.finishing_capabilities.map((item: string) => startCase(item)).join(', ')
  }
  return 'No finishing shared'
})

const artworkBannerTitle = computed(() => stageIndex.value >= 3 ? 'Artwork received' : 'Artwork pending')
const artworkBannerText = computed(() => stageIndex.value >= 3
  ? `Tracking token ${token.value} is linked to artwork-related job specifications.`
  : 'No artwork milestone has been exposed on this public token yet.')
const artworkBannerClass = computed(() => stageIndex.value >= 3 ? 'bg-[#f6fef9] border border-[#abefc6]' : 'bg-[#fff4ed] border border-[#fed7b5]')
const artworkIconWrapClass = computed(() => stageIndex.value >= 3 ? 'bg-[#dcfae6]' : 'bg-[#fff4ed]')
const artworkIconClass = computed(() => stageIndex.value >= 3 ? 'text-[#027a48]' : 'text-[#c4471a]')
const artworkTitleClass = computed(() => stageIndex.value >= 3 ? 'text-[#027a48]' : 'text-[#c4471a]')
const artworkFileName = computed(() => String(safeSpecs.value.file_name || safeSpecs.value.artwork_name || safeSpecs.value.upload_name || `${slugify(jobTitle.value)}.pdf`))
const artworkFileMeta = computed(() => {
  const type = safeSpecs.value.file_type || 'PDF'
  const size = safeSpecs.value.file_size || 'Secure file'
  return `${type} · ${size} · ${stageIndex.value >= 3 ? 'Print-ready' : 'Awaiting review'}`
})

const proofStatusTitle = computed(() => stageIndex.value >= 4 ? 'Proof approved' : 'Proof pending')
const proofStatusText = computed(() => stageIndex.value >= 4
  ? 'This job has moved beyond proofing into active production.'
  : 'Sign in to view proof discussions or approval history.')
const proofBannerClass = computed(() => stageIndex.value >= 4 ? 'bg-[#f6fef9] border border-[#abefc6]' : 'bg-[#fff4ed] border border-[#fed7b5]')
const proofIconWrapClass = computed(() => stageIndex.value >= 4 ? 'bg-[#dcfae6]' : 'bg-[#fff4ed]')
const proofIconClass = computed(() => stageIndex.value >= 4 ? 'text-[#027a48]' : 'text-[#c4471a]')
const proofTitleClass = computed(() => stageIndex.value >= 4 ? 'text-[#027a48]' : 'text-[#c4471a]')

const paymentTitle = computed(() => paymentConfirmed.value ? 'Payment confirmed' : 'Payment pending')
const paymentSubtitle = computed(() => paymentConfirmed.value ? 'Received and verified by Printy' : 'No public payment confirmation is available on this token')
const paymentConfirmed = computed(() => Boolean(safeSpecs.value.payment_confirmed || safeSpecs.value.amount_paid || safeSpecs.value.payment_method || stageIndex.value >= 2))
const paymentBannerClass = computed(() => paymentConfirmed.value ? 'bg-[#f6fef9] border border-[#abefc6]' : 'bg-[#fff4ed] border border-[#fed7b5]')
const paymentIconWrapClass = computed(() => paymentConfirmed.value ? 'bg-[#dcfae6]' : 'bg-[#fff4ed]')
const paymentIconClass = computed(() => paymentConfirmed.value ? 'text-[#027a48]' : 'text-[#c4471a]')
const paymentTitleClass = computed(() => paymentConfirmed.value ? 'text-[#027a48]' : 'text-[#c4471a]')

const paymentRows = computed(() => [
  { label: 'Amount paid', value: specValue(['amount_paid', 'total', 'amount'], 'Sign in to view'), emphasis: true },
  { label: 'Payment method', value: specValue(['payment_method', 'payment_channel'], 'Not shared publicly') },
  { label: 'Reference', value: specValue(['receipt', 'receipt_number', 'transaction_reference'], maskToken(token.value)) },
  { label: 'Paid on', value: specValue(['paid_on', 'payment_date'], 'Not shared publicly') },
])

const deliveryModeLabel = computed(() => specValue(['delivery_mode', 'pickup_mode', 'fulfillment_mode'], 'Secure fulfillment'))
const deliveryRows = computed(() => [
  { label: 'Delivery mode', value: deliveryModeLabel.value, isBadge: false, isCode: false },
  { label: 'Pickup status', value: deliveryStatus.value, isBadge: true, isCode: false },
  { label: 'Tracking token', value: token.value, isBadge: false, isCode: true },
  { label: 'Ready from', value: expectedReadyLabel.value, isBadge: false, isCode: false },
  { label: 'Collection point', value: job.value?.location || 'Shared after sign-in', isBadge: false, isCode: false },
])
const deliveryStatus = computed(() => {
  if (stageIndex.value >= 7) return 'Collected'
  if (stageIndex.value >= 6) return 'Ready for pickup'
  if (stageIndex.value >= 4) return 'In progress'
  return 'Waiting for update'
})

async function copyToken() {
  if (!import.meta.client || !navigator?.clipboard) {
    return
  }
  await navigator.clipboard.writeText(token.value)
  copied.value = true
  setTimeout(() => {
    copied.value = false
  }, 1500)
}

function specValue(keys: string[], fallback: string) {
  for (const key of keys) {
    const value = safeSpecs.value[key]
    if (value !== undefined && value !== null && value !== '') {
      return Array.isArray(value) ? value.join(', ') : String(value)
    }
  }
  return fallback
}

function formatDeadline(value?: string) {
  if (!value) return 'To be confirmed'
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(value))
}

function startCase(value: string) {
  return String(value)
    .replace(/[_-]/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase())
}

function slugify(value: string) {
  return String(value || 'job-file')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'job-file'
}

function maskToken(value: string) {
  if (!value) return 'Not available'
  if (value.length <= 8) return value
  return `${value.slice(0, 4)}...${value.slice(-4)}`
}
</script>

<template>
  <main class="min-h-screen bg-slate-50 px-6 py-8">
    <section class="mx-auto max-w-5xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <p class="text-sm font-semibold uppercase tracking-[0.2em] text-[#e13515]">Track job</p>
      <h1 class="mt-3 text-2xl font-bold text-slate-900">Job tracking</h1>
      <p class="mt-2 text-sm text-slate-600">Your job status and next steps render from this secure tracking route.</p>
    </section>
  </main>
</template>
