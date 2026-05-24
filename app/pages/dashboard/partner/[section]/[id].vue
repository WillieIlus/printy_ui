<template>
  <RoleDashboardFrame
    title="Partner Detail"
    badge="Partner"
    :name="displayName"
    :initials="initials"
    subtitle="Markup, client payment, and production dispatch"
    breadcrumb-root="Dashboard"
    :nav-items="navItems"
    support-title="Partner detail"
    support-copy="Production base price stays visible here and hidden from the client route."
    support-action="Back"
    :support-to="`/dashboard/partner/${section}`"
    @logout="auth.logout()"
  >
    <BaseAlert v-if="pageError" variant="error" title="Partner detail could not load." :message="pageError" />
    <BaseAlert v-else-if="noticeMessage" class="mb-6" :variant="noticeVariant" :message="noticeMessage" />
    <BaseAlert
      v-if="!pageError && managedJob?.id && isPaid && !artworkUploaded"
      class="mb-6"
      variant="default"
      title="Artwork missing"
      message="Client payment is confirmed, but artwork is still missing. Dispatch stays blocked until the artwork is uploaded."
    />
    <BaseAlert
      v-if="!pageError && intakeArtworkMissing"
      class="mb-6"
      variant="default"
      title="Client artwork missing"
      message="Client has not uploaded artwork yet."
    />

    <div v-if="!pageError" class="space-y-6">
      <DashboardPageHeader eyebrow="Partner Quote" :title="heroTitle" :subtitle="heroSubtitle" />

      <div class="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <DashboardSection title="Client + Job info" subtitle="Who this quote is for and what was requested.">
          <div class="grid gap-4 p-6 md:grid-cols-2">
            <div class="rounded-2xl border border-slate-200 bg-white p-4">
              <p class="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Client</p>
              <p class="mt-2 text-sm font-semibold text-slate-900">{{ clientName }}</p>
              <p class="mt-1 text-sm text-slate-500">{{ clientPhone || clientEmail || 'No contact visible' }}</p>
            </div>
            <div class="rounded-2xl border border-slate-200 bg-white p-4">
              <p class="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Date sent</p>
              <p class="mt-2 text-sm font-semibold text-slate-900">{{ sentDateLabel }}</p>
            </div>
            <div class="rounded-2xl border border-slate-200 bg-white p-4">
              <p class="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Product</p>
              <p class="mt-2 text-sm font-semibold text-slate-900">{{ productLabel }}</p>
            </div>
            <div class="rounded-2xl border border-slate-200 bg-white p-4">
              <p class="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Quantity + size</p>
              <p class="mt-2 text-sm font-semibold text-slate-900">{{ quantitySizeLabel }}</p>
            </div>
            <div class="rounded-2xl border border-slate-200 bg-white p-4 md:col-span-2">
              <p class="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Specs</p>
              <p class="mt-2 text-sm font-semibold text-slate-900">{{ specsLabel }}</p>
            </div>
            <div class="rounded-2xl border border-slate-200 bg-white p-4 md:col-span-2">
              <p class="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Turnaround</p>
              <p class="mt-2 text-sm font-semibold text-slate-900">{{ turnaroundLabel }}</p>
            </div>
          </div>
        </DashboardSection>

        <DashboardSection title="Financials + actions" subtitle="Visible to partner only.">
          <div class="space-y-5 p-6">
            <div class="rounded-3xl border border-slate-200 bg-slate-50 p-5">
              <div class="space-y-3 rounded-2xl border border-slate-200 bg-white p-5">
                <div class="flex items-center justify-between text-sm">
                  <span class="text-slate-500">Production cost</span>
                  <span class="font-semibold text-slate-900">{{ productionCostLabel }}</span>
                </div>
                <div class="flex items-center justify-between text-sm">
                  <span class="text-slate-500">Your markup</span>
                  <span class="font-semibold text-slate-900">{{ brokerMarginLabel }}</span>
                </div>
                <div class="flex items-center justify-between text-sm">
                  <span class="text-slate-500">Printy fee</span>
                  <span class="font-semibold text-slate-900">{{ platformFeeLabel }}</span>
                </div>
                <div class="border-t border-slate-200 pt-3">
                  <div class="flex items-center justify-between text-base font-bold text-slate-950">
                    <span>Client total</span>
                    <span>{{ clientTotalLabel }}</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="space-y-3">
              <div class="flex items-center gap-3" v-for="step in timelineSteps" :key="step.label">
                <div class="flex h-8 w-8 items-center justify-center rounded-full border text-sm font-bold" :class="step.done ? 'border-[#12b76a] bg-[#ecfdf3] text-[#027a48]' : 'border-slate-200 bg-white text-slate-400'">
                  {{ step.done ? '✓' : '○' }}
                </div>
                <div>
                  <p class="text-sm font-semibold text-slate-900">{{ step.label }}</p>
                  <p class="text-sm text-slate-500">{{ step.copy }}</p>
                </div>
              </div>
            </div>

            <div class="rounded-2xl border p-4" :class="actionBoxClass">
              <p class="text-sm font-semibold">{{ actionTitle }}</p>
              <p class="mt-1 text-sm">{{ actionCopy }}</p>
              <BaseButton
                v-if="showPrepareQuoteButton"
                class="mt-4"
                variant="primary"
                size="sm"
                @click="prepareQuote"
              >
                Prepare quote
              </BaseButton>
              <BaseButton
                v-if="showDispatchButton"
                class="mt-4"
                variant="primary"
                size="sm"
                :loading="dispatchLoading"
                @click="dispatchQuoteJob"
              >
                Dispatch to production
              </BaseButton>
            </div>

            <div class="rounded-2xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-900">
              Partner payout flow: the client pays Printy first, production is dispatched only after payment confirmation, and your markup settles after completion is confirmed on the managed job.
            </div>

            <div v-if="isComplete" class="rounded-2xl border border-teal-200 bg-teal-50 p-4">
              <p class="text-sm font-semibold text-teal-800">Your earnings: {{ brokerMarginLabel }} are queued for settlement after completion confirmation and payout review.</p>
            </div>
          </div>
        </DashboardSection>
      </div>
    </div>
  </RoleDashboardFrame>
</template>

<script setup lang="ts">
import BaseAlert from '~/components/base/BaseAlert.vue'
import BaseButton from '~/components/base/BaseButton.vue'
import DashboardPageHeader from '~/components/dashboard/DashboardPageHeader.vue'
import DashboardSection from '~/components/dashboard/DashboardSection.vue'
import RoleDashboardFrame from '~/components/dashboard/RoleDashboardFrame.vue'
import { dispatchPartnerJob, getPartnerQuoteDetail } from '~/services/partner'
import { getApiErrorMessage } from '~/shared/api'

definePageMeta({ layout: false, middleware: 'auth' })

const auth = useAuthStore()
if (!auth.canAccessPartnerDashboard) {
  await navigateTo(auth.homeRoute)
}

const route = useRoute()
const section = computed(() => String(route.params.section || 'quotes'))
const id = computed(() => String(route.params.id || ''))
const displayName = computed(() => auth.user?.name || auth.user?.email || 'Partner')
const initials = computed(() => displayName.value.split(' ').map(part => part[0]).join('').slice(0, 2).toUpperCase() || 'PT')
const navItems = computed(() => [
  { label: 'Quotes', to: '/dashboard/partner/quotes', active: section.value === 'quotes' },
  { label: 'Jobs', to: '/dashboard/partner/jobs', active: section.value === 'jobs' },
])

const pageError = ref('')
const dispatchLoading = ref(false)
const noticeMessage = ref('')
const noticeVariant = ref<'success' | 'default' | 'error'>('success')
const quoteDetail = ref<Record<string, any> | null>(null)

async function loadDetail() {
  pageError.value = ''
  try {
    const payload = await getPartnerQuoteDetail(id.value)
    quoteDetail.value = payload?.quote || null
  } catch (error: unknown) {
    pageError.value = getApiErrorMessage(error, 'Partner detail is unavailable right now.')
  }
}

await loadDetail()

const latestResponse = computed(() => quoteDetail.value?.latest_response || {})
const pricing = computed(() => latestResponse.value?.response_snapshot?.customer_pricing || {})
const requestSnapshot = computed(() => quoteDetail.value?.request_snapshot || {})
const requestDetails = computed(() => requestSnapshot.value?.request_details || {})
const requestInputs = computed(() => requestSnapshot.value?.calculator_inputs || {})
const managedJob = computed(() => quoteDetail.value?.managed_job || null)
const paymentStatus = computed(() => String(managedJob.value?.payment_status || '').toLowerCase())
const assignmentStatus = computed(() => String(managedJob.value?.assignment_status || '').toLowerCase())
const jobStatus = computed(() => String(managedJob.value?.status || '').toLowerCase())
const isPaid = computed(() => ['confirmed', 'release_ready', 'paid'].includes(paymentStatus.value))
const isDispatched = computed(() => Boolean(managedJob.value?.dispatched_at) || ['assignment_pending', 'assigned', 'accepted'].includes(assignmentStatus.value))
const isComplete = computed(() => ['completed', 'delivered'].includes(jobStatus.value))
const artworkUploaded = computed(() => Boolean(managedJob.value?.artwork_uploaded))
const intakeArtworkMissing = computed(() => {
  if (managedJob.value?.id) {
    return false
  }
  return !String(requestDetails.value?.artwork_reference || '').trim()
})

const heroTitle = computed(() => quoteTitleFromSnapshot() || quoteDetail.value?.reference || quoteDetail.value?.request_reference || `Quote ${id.value}`)
const heroSubtitle = computed(() => latestResponse.value?.shop_name || 'Partner-managed quote detail')
const clientName = computed(() => quoteDetail.value?.client_name || quoteDetail.value?.customer_name || 'Client')
const clientEmail = computed(() => quoteDetail.value?.client_email || '')
const clientPhone = computed(() => quoteDetail.value?.client_phone || '')
const sentDateLabel = computed(() => formatDate(quoteDetail.value?.latest_response?.sent_at || quoteDetail.value?.created_at))
const productLabel = computed(() => requestSnapshot.value?.product_label || requestSnapshot.value?.product_type || requestInputs.value?.product_type || 'Partner quote')
const quantitySizeLabel = computed(() => {
  const quantityValue = requestSnapshot.value?.quantity || requestInputs.value?.quantity
  const quantity = quantityValue ? `${Number(quantityValue).toLocaleString('en-KE')} qty` : 'Qty pending'
  const size = requestSnapshot.value?.finished_size || requestSnapshot.value?.size_label || requestInputs.value?.finished_size || 'Size pending'
  return `${quantity} · ${size}`
})
const specsLabel = computed(() => {
  const parts = [
    requestSnapshot.value?.print_sides || requestSnapshot.value?.print_sides_label || requestInputs.value?.print_sides,
    requestSnapshot.value?.color_mode || requestSnapshot.value?.color_mode_label || requestInputs.value?.color_mode,
    requestSnapshot.value?.paper_stock || requestSnapshot.value?.paper_label || requestInputs.value?.paper_stock,
    requestSnapshot.value?.lamination || requestSnapshot.value?.lamination_label || requestInputs.value?.lamination,
  ].filter(Boolean)
  return parts.length ? parts.join(' · ') : 'Specs pending'
})
const turnaroundLabel = computed(() => latestResponse.value?.turnaround_label || 'Turnaround not provided')
const productionCostLabel = computed(() => formatMoney(pricing.value?.production_base_price || latestResponse.value?.total || 0))
const brokerMarginLabel = computed(() => formatMoney(pricing.value?.broker_margin_amount || 0))
const platformFeeLabel = computed(() => formatMoney(pricing.value?.platform_service_amount || 0))
const clientTotalLabel = computed(() => formatMoney(pricing.value?.final_client_price || latestResponse.value?.total || 0))

const timelineSteps = computed(() => [
  { label: 'Quote sent', copy: sentDateLabel.value, done: Boolean(latestResponse.value?.sent_at) },
  { label: 'Client accepted', copy: managedJob.value?.id ? 'Quote converted into a managed job.' : 'Waiting for client acceptance.', done: Boolean(managedJob.value?.id) },
  { label: 'Payment received', copy: isPaid.value ? 'Client payment is confirmed.' : 'Payment not confirmed yet.', done: isPaid.value },
  { label: 'Dispatched to production', copy: isDispatched.value ? 'Production assignment is underway.' : 'Dispatch available after payment.', done: isDispatched.value },
  { label: 'Complete', copy: isComplete.value ? 'Production marked the job complete.' : 'Still in progress.', done: isComplete.value },
])

const showDispatchButton = computed(() => Boolean(managedJob.value?.id) && isPaid.value && artworkUploaded.value && !isDispatched.value)
const showPrepareQuoteButton = computed(() => !latestResponse.value?.id && !managedJob.value?.id && section.value === 'quotes')
const actionBoxClass = computed(() => {
  if (isComplete.value) return 'border-teal-200 bg-teal-50 text-teal-800'
  if (isDispatched.value) return 'border-blue-200 bg-blue-50 text-blue-800'
  if (isPaid.value && !artworkUploaded.value) return 'border-amber-200 bg-amber-50 text-amber-800'
  if (isPaid.value) return 'border-green-200 bg-green-50 text-green-800'
  if (managedJob.value?.id) return 'border-amber-200 bg-amber-50 text-amber-800'
  return 'border-slate-200 bg-slate-50 text-slate-700'
})
const actionTitle = computed(() => {
  if (isComplete.value) return 'Job complete'
  if (isDispatched.value) return 'Job is being printed'
  if (isPaid.value && !artworkUploaded.value) return 'Client paid, waiting for artwork'
  if (isPaid.value) return `Client has paid ${clientTotalLabel.value}`
  if (managedJob.value?.id) return 'Client accepted - awaiting payment'
  return 'Waiting for client to accept'
})
const actionCopy = computed(() => {
  if (isComplete.value) return 'Production has completed the job. Settlement follows the confirmed completion state.'
  if (isDispatched.value) return 'Production has the assignment. Your markup remains protected until the job closes out.'
  if (isPaid.value && !artworkUploaded.value) return 'Dispatch is blocked until the client uploads artwork.'
  if (isPaid.value) return 'Client payment is confirmed, so dispatch is available now.'
  if (managedJob.value?.id) return 'The client accepted the quote. Dispatch unlocks after payment confirmation.'
  return 'No production action is available yet.'
})

async function dispatchQuoteJob() {
  if (!managedJob.value?.id) {
    return
  }
  dispatchLoading.value = true
  try {
    await dispatchPartnerJob(managedJob.value.id)
    noticeVariant.value = 'success'
    noticeMessage.value = "Job sent to production. You'll be notified when it's ready."
    await loadDetail()
  } catch (error: unknown) {
    noticeVariant.value = 'error'
    noticeMessage.value = getApiErrorMessage(error, 'Dispatch failed.')
  } finally {
    dispatchLoading.value = false
  }
}

async function prepareQuote() {
  await navigateTo(`/dashboard/partner/quotes?prepare=${id.value}`)
}

function quoteTitleFromSnapshot() {
  const product = requestSnapshot.value?.product_label || requestSnapshot.value?.product_type || requestInputs.value?.product_type
  const quantity = requestSnapshot.value?.quantity || requestInputs.value?.quantity
  if (!product) {
    return ''
  }
  return `${formatLabel(product)}${quantity ? ` x${Number(quantity).toLocaleString('en-KE')}` : ''}`
}

function formatMoney(value: number | string | null | undefined) {
  const amount = Number(value || 0)
  if (!Number.isFinite(amount) || amount <= 0) {
    return 'KES 0.00'
  }
  return `KES ${amount.toLocaleString('en-KE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

function formatDate(value: unknown) {
  if (!value) {
    return 'Not sent yet'
  }
  const date = new Date(String(value))
  if (Number.isNaN(date.getTime())) {
    return 'Not sent yet'
  }
  return new Intl.DateTimeFormat('en-KE', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date)
}

function formatLabel(value: unknown) {
  return String(value || '')
    .replace(/[_-]+/g, ' ')
    .replace(/\b\w/g, char => char.toUpperCase())
}
</script>
