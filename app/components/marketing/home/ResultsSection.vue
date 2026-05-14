<!-- Purpose: Homepage managed estimate and routing experience. -->
<template>
  <section class="mx-auto max-w-6xl px-4 py-8 md:px-6 md:py-12">
    <div v-if="previewLoading" class="rounded-[2.5rem] border border-[var(--p-border)] bg-[var(--p-surface)] px-6 py-20 text-center">
      <div class="mx-auto mb-5 flex size-16 items-center justify-center rounded-full bg-[var(--p-bg-soft)]">
        <Icon name="lucide:loader-2" class="size-8 animate-spin text-[var(--p-primary)]" />
      </div>
      <h3 class="text-2xl font-bold text-[var(--p-text)]">Building your managed estimate</h3>
      <p class="mt-3 max-w-md mx-auto text-[var(--p-text-muted)]">
        We&apos;re checking the Nairobi market range, production feasibility, and the next safe production path.
      </p>
    </div>

    <div v-else-if="previewLoaded" class="space-y-8">
      <ManagedEstimateCard
        :title="hasExactMatches ? 'Estimate ready for review' : 'Estimate needs confirmation'"
        :description="hasExactMatches
          ? 'Printy is ready to move this brief forward. Final pricing still follows artwork review and production confirmation.'
          : 'Printy can move this job forward, but a few production details still need confirmation before the exact quote is issued.'"
        :range-text="rangeText"
        :route-count="preview?.matches_count || matches.length"
        :confidence="confidenceSummary"
      />

      <div class="grid gap-4 xl:grid-cols-[1.14fr_0.86fr]">
        <ProductionSummaryCard :production-preview="preview?.production_preview" :summary="productionSummary" />
        <div class="space-y-4">
          <SafePriceRange :range-text="rangeText" />
          <TurnaroundCard :value="turnaroundSummary" />
          <UploadArtworkPanel :has-artwork="Boolean(selectedFileName)" :artwork-label="selectedFileName || null" @jump-to-calculator="jumpToCalculator" />
        </div>
      </div>

      <div
        v-if="visibleWarnings.length || visibleAssumptions.length"
        class="rounded-[1.8rem] border border-amber-200 bg-amber-50 p-5"
      >
        <p class="text-[10px] font-bold uppercase tracking-[0.24em] text-amber-700">Operational warnings</p>
        <ul class="mt-3 space-y-2 text-sm leading-6 text-amber-900">
          <li v-for="warning in visibleWarnings" :key="warning">{{ warning }}</li>
          <li v-for="assumption in visibleAssumptions" :key="assumption">{{ assumption }}</li>
        </ul>
      </div>

      <div
        v-if="!matches.length"
        class="flex flex-col items-center justify-center rounded-[2rem] border-2 border-dashed border-[var(--p-border)] bg-[var(--p-surface)]/50 px-6 py-16 text-center"
      >
        <div class="mb-4 flex size-16 items-center justify-center rounded-full bg-[var(--p-bg-soft)] text-[var(--p-text-muted)]">
          <Icon name="lucide:search-x" class="size-8" />
        </div>
        <h3 class="text-xl font-bold text-[var(--p-text)]">{{ noMatchTitle }}</h3>
        <p class="mt-2 max-w-md text-sm text-[var(--p-text-muted)]">{{ noMatchDescription }}</p>
        <div v-if="preview?.warnings?.length" class="mt-4 max-w-lg rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-left text-sm text-amber-800">
          <p class="font-semibold">{{ pricingIssueDetected ? 'Backend pricing setup is incomplete' : 'Why this job could not be matched instantly' }}</p>
          <p class="mt-1">{{ preview.warnings[0] }}</p>
        </div>
      </div>

      <div v-else class="rounded-[2rem] border border-[var(--p-border)] bg-[var(--p-surface)] p-5 shadow-sm">
        <div class="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p class="text-[10px] font-bold uppercase tracking-[0.24em] text-[var(--p-primary)]">Managed options</p>
            <h3 class="mt-2 text-xl font-semibold tracking-tight text-[var(--p-text)]">Choose your turnaround path</h3>
            <p class="mt-2 max-w-2xl text-sm leading-6 text-[var(--p-text-muted)]">
              These options show the managed estimate range, likely readiness, and the next step after artwork review.
            </p>
          </div>
          <VerifiedPartnerBadge />
        </div>

        <div class="mt-5 space-y-3">
          <article
            v-for="(match, index) in matches.slice(0, 4)"
            :key="match.id"
            class="rounded-[1.6rem] border p-5 transition"
            :class="isSelected(match.id) ? 'border-[var(--p-primary)]/35 bg-[var(--p-primary)]/6 shadow-[0_16px_36px_rgba(225,53,21,0.08)]' : 'border-[var(--p-border)] bg-[var(--p-surface)]'"
          >
            <div class="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
              <div class="space-y-3">
                <div class="flex flex-wrap items-center gap-2">
                  <BaseBadge :tone="matchTone(match)" size="sm">
                    <Icon :name="matchIcon(match)" class="mr-1 size-3" />
                    {{ matchStatusLabel(match) }}
                  </BaseBadge>
                  <span class="text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--p-text-muted)]">{{ score(match.confidence_score ?? match.similarity_score) }} confidence</span>
                  <span v-if="index === 0 && isExact(match)" class="rounded-full bg-[#101828] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-white">Best match</span>
                </div>

                <div>
                  <p class="text-base font-semibold text-[var(--p-text)]">Managed production option</p>
                  <p class="mt-1 text-sm text-[var(--p-text-muted)]">Managed by Printy • {{ getMatchReadyText(match) ?? 'Ready after artwork review' }}</p>
                </div>

                <div class="flex flex-wrap gap-2">
                  <span
                    v-for="spec in getMatchedSpecs(match)"
                    :key="spec"
                    class="rounded-full border border-emerald-500/15 bg-emerald-500/6 px-3 py-1 text-xs font-semibold text-emerald-700"
                  >
                    {{ spec }}
                  </span>
                  <span
                    v-for="spec in getMissingSpecs(match)"
                    :key="spec"
                    class="rounded-full border border-amber-500/15 bg-amber-500/6 px-3 py-1 text-xs font-semibold text-amber-700"
                  >
                    Needs {{ spec }}
                  </span>
                </div>
              </div>

              <div class="grid gap-3 sm:grid-cols-2 xl:min-w-[320px]">
                <div class="rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface)] p-4">
                  <p class="text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--p-text-muted)]">Estimated total</p>
                  <p class="mt-2 text-lg font-semibold text-[var(--p-text)]">{{ money(match.total, match.currency) }}</p>
                </div>
                <div class="rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface)] p-4">
                  <p class="text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--p-text-muted)]">Production summary</p>
                  <p class="mt-2 text-sm font-semibold text-[var(--p-text)]">{{ summarizeMatch(match) }}</p>
                </div>
                <div class="sm:col-span-2 flex flex-wrap gap-2">
                  <BaseButton
                    :variant="isSelected(match.id) ? 'primary' : 'secondary'"
                    class="!rounded-xl"
                    @click="toggleMatch(match.id)"
                  >
                    {{ isSelected(match.id) ? 'Selected' : 'Use this option' }}
                  </BaseButton>
                  <BaseButton variant="ghost" class="!rounded-xl" @click="jumpToCalculator">
                    Update brief
                  </BaseButton>
                </div>
              </div>
            </div>
          </article>
        </div>
      </div>

      <WorkflowCTA
        v-if="selectedMatches.length"
        eyebrow="Next step"
        :title="`${selectedMatches.length} option${selectedMatches.length === 1 ? '' : 's'} selected`"
        description="Printy will review the brief, confirm the exact quote after artwork review, and keep the job tracked from payment to delivery."
      >
        <BaseButton variant="primary" :disabled="isSending" @click="submitSelection('send_quote_request')">
          <Icon v-if="isSending && pendingActionType === 'send_quote_request'" name="lucide:loader-2" class="mr-1.5 size-4 animate-spin" />
          Get exact quote
        </BaseButton>
        <BaseButton variant="secondary" :disabled="isSending" @click="submitSelection('ask_shop_to_confirm')">
          <Icon v-if="isSending && pendingActionType === 'ask_shop_to_confirm'" name="lucide:loader-2" class="mr-1.5 size-4 animate-spin" />
          Upload artwork
        </BaseButton>
        <BaseButton variant="outline" :disabled="isSending" @click="submitSelection('send_job_brief')">
          <Icon v-if="isSending && pendingActionType === 'send_job_brief'" name="lucide:loader-2" class="mr-1.5 size-4 animate-spin" />
          Request sample
        </BaseButton>
      </WorkflowCTA>

      <div v-if="matches.length > 3" class="rounded-[1.8rem] border border-slate-200 bg-slate-50/80 p-6 text-center">
        <h3 class="text-xl font-semibold text-slate-950">More managed options are available</h3>
        <p class="mt-2 text-sm text-slate-500">
          Printy found {{ preview?.matches_count }} verified production partners within the estimated range {{ rangeText }}. Start with the strongest options above and widen the search only if needed.
        </p>
      </div>
    </div>

    <div
      v-else-if="previewError"
      class="flex flex-col items-center justify-center rounded-[2.5rem] border border-[var(--p-error)]/30 bg-[var(--p-error-soft)] px-6 py-16 text-center"
    >
      <div class="mb-6 flex size-20 items-center justify-center rounded-full bg-white/70">
        <Icon name="lucide:octagon-alert" class="size-10 text-[var(--p-error)]" />
      </div>
      <h3 class="text-2xl font-bold text-[var(--p-text)]">We couldn&apos;t check matches. Try again.</h3>
      <p class="mt-3 max-w-md text-[var(--p-text-muted)]">
        {{ previewError }}
      </p>
      <BaseButton class="mt-6" @click="retryPreview">
        Retry
      </BaseButton>
    </div>

    <div
      v-else
      class="flex flex-col items-center justify-center rounded-[2.5rem] border-2 border-dashed border-[var(--p-border)] bg-[var(--p-bg-soft)]/30 px-6 py-20 text-center"
    >
      <div class="mb-6 flex size-20 items-center justify-center rounded-full bg-[var(--p-surface)] shadow-inner">
        <Icon name="lucide:calculator" class="size-10 text-[var(--p-border-strong)]" />
      </div>
      <h3 class="text-2xl font-bold text-[var(--p-text)]">Your managed estimate appears here</h3>
      <p class="mt-3 max-w-sm text-[var(--p-text-muted)]">
        Use the calculator above to describe your job. Printy will show an estimated market range, production summary, and the next managed actions.
      </p>
    </div>

    <div
      v-if="showGuestHandoffModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/65 px-4 py-6 backdrop-blur-sm"
    >
      <div class="w-full max-w-xl rounded-[2rem] bg-white p-6 shadow-2xl">

        <!-- Success state -->
        <template v-if="guestRequestSent">
          <div class="flex flex-col items-center gap-4 py-2 text-center">
            <div class="flex size-14 items-center justify-center rounded-full bg-green-100">
              <Icon name="lucide:check-circle-2" class="size-8 text-green-600" />
            </div>
            <div class="space-y-1">
              <h3 class="text-2xl font-bold text-slate-950">Request sent</h3>
              <p class="text-sm text-slate-600">
                Your job has been sent for quoting with
                <span v-if="sentShopNames.length" class="font-semibold">{{ sentShopNames.join(', ') }}</span>.
                Printy will confirm price and details before anything is final.
              </p>
            </div>
          </div>
          <div class="mt-6 space-y-3 rounded-2xl border border-slate-100 bg-slate-50 p-4">
            <p class="text-sm font-semibold text-slate-900">Create a password to track replies</p>
            <p class="text-xs text-slate-600">We'll attach this request to your account — no retyping needed.</p>
            <div class="flex flex-col gap-2 sm:flex-row">
              <BaseButton
                variant="primary"
                block
                @click="goToSignupAfterSend"
              >
                Create account
              </BaseButton>
              <BaseButton variant="ghost" block @click="closeGuestHandoffModal">
                Continue without account
              </BaseButton>
            </div>
          </div>
        </template>

        <!-- Contact capture form -->
        <template v-else>
          <div class="space-y-1">
            <p class="text-[10px] font-bold uppercase tracking-[0.28em] text-[var(--p-primary)]">Almost done</p>
            <h3 class="text-2xl font-bold text-slate-950">Where should Printy send updates?</h3>
            <p class="text-sm text-slate-600">
              No payment required. Printy will coordinate the exact quote before anything is final.
            </p>
          </div>

          <div class="mt-5 grid gap-4 sm:grid-cols-2">
            <label class="space-y-1 sm:col-span-2">
              <span class="text-sm font-semibold text-slate-900">Name <span class="font-normal text-slate-400">(optional)</span></span>
              <input
                v-model.trim="guestContact.name"
                type="text"
                class="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[var(--p-primary)] focus:ring-4 focus:ring-[var(--p-primary)]/10"
                placeholder="Your name"
              >
            </label>
            <label class="space-y-1">
              <span class="text-sm font-semibold text-slate-900">Phone / WhatsApp</span>
              <input
                v-model.trim="guestContact.phone"
                type="tel"
                class="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[var(--p-primary)] focus:ring-4 focus:ring-[var(--p-primary)]/10"
                :class="{ 'border-rose-400': guestHandoffError && !guestContact.phone && !guestContact.email }"
                placeholder="+254..."
              >
            </label>
            <label class="space-y-1">
              <span class="text-sm font-semibold text-slate-900">Email</span>
              <input
                v-model.trim="guestContact.email"
                type="email"
                class="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[var(--p-primary)] focus:ring-4 focus:ring-[var(--p-primary)]/10"
                :class="{ 'border-rose-400': guestHandoffError && !guestContact.phone && !guestContact.email }"
                placeholder="you@example.com"
              >
            </label>
          </div>

          <p class="mt-1 text-xs text-slate-500">Enter your phone or email — at least one is needed so Printy can send quote updates.</p>

          <p v-if="guestHandoffError" class="mt-3 text-sm text-rose-600">
            {{ guestHandoffError }}
          </p>

          <div class="mt-6 flex flex-col gap-2">
            <BaseButton variant="primary" block :loading="isSendingGuest" @click="sendGuestRequest">
              Send request
            </BaseButton>
            <BaseButton variant="secondary" block :disabled="isSendingGuest" @click="completeGuestHandoff('/auth/signup')">
              Create account instead
            </BaseButton>
            <BaseButton variant="ghost" block :disabled="isSendingGuest" @click="completeGuestHandoff('/auth/login')">
              Sign in if you already have an account
            </BaseButton>
          </div>
          <BaseButton variant="ghost" block class="mt-1 text-xs text-slate-400" :disabled="isSendingGuest" @click="closeGuestHandoffModal">
            Back to results
          </BaseButton>
        </template>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import type { CalculatorPreviewMatch } from '~/types/api/calculator'
import { API } from '~/shared/api-paths'
import { useAuthStore } from '~/stores/auth'
import { useCalculatorStore } from '~/stores/calculator'
import { useCalculatorDraftRecoveryStore } from '~/stores/calculatorDraftRecovery'
import { usePendingActionStore } from '~/stores/pendingAction'
import { useQuoteRequestBlast } from '~/composables/useQuoteRequestBlast'
import { buildVisibilitySafePricingSnapshot, getMatchReadyText } from '~/utils/pricingVisibility'
import ManagedEstimateCard from '~/components/marketing/home/ManagedEstimateCard.vue'
import ProductionSummaryCard from '~/components/marketing/home/ProductionSummaryCard.vue'
import SafePriceRange from '~/components/marketing/home/SafePriceRange.vue'
import TurnaroundCard from '~/components/marketing/home/TurnaroundCard.vue'
import UploadArtworkPanel from '~/components/marketing/home/UploadArtworkPanel.vue'
import VerifiedPartnerBadge from '~/components/marketing/home/VerifiedPartnerBadge.vue'
import WorkflowCTA from '~/components/marketing/home/WorkflowCTA.vue'
import BaseButton from '~/components/ui/BaseButton.vue'
import BaseBadge from '~/components/ui/BaseBadge.vue'
import { summarizeProductionPreview, summarizeTurnaround } from '~/utils/workflowUi'

type RequestActionType = 'send_quote_request' | 'ask_shop_to_confirm' | 'send_job_brief'

type GuestContactState = {
  name: string
  phone: string
  email: string
}

const authStore = useAuthStore()
const pendingActionStore = usePendingActionStore()
const store = useCalculatorStore()
const draftRecoveryStore = useCalculatorDraftRecoveryStore()
const { preview, previewLoaded, previewLoading, previewError, selectedProduct, form, selectedShopIds } = storeToRefs(store)
const { activeServerDraftId, requestNotes, selectedFileName, artworkRefs } = storeToRefs(draftRecoveryStore)
const { saveAndSend } = useQuoteRequestBlast()

const matches = computed(() => preview.value?.matches ?? [])
const hasExactMatches = computed(() => matches.value.some(match => isExact(match)))
const selectedMatches = computed(() => matches.value.filter(match => selectedShopIds.value.includes(match.id)))

const isSending = ref(false)
const isSendingGuest = ref(false)
const pendingActionType = ref<RequestActionType | null>(null)
const showGuestHandoffModal = ref(false)
const guestHandoffError = ref('')
const guestRequestSent = ref(false)
const sentShopNames = ref<string[]>([])
const queuedAnonymousAction = ref<RequestActionType | null>(null)
const guestContact = reactive<GuestContactState>({
  name: '',
  phone: '',
  email: '',
})

const rangeText = computed(() => {
  const currency = preview.value?.currency ?? 'KES'
  if (preview.value?.min_price && preview.value?.max_price) {
    if (preview.value.min_price === preview.value.max_price) return `${currency} ${preview.value.min_price}`
    return `${currency} ${preview.value.min_price} to ${currency} ${preview.value.max_price}`
  }
  return 'on request'
})

const confidenceSummary = computed(() => {
  const scores = matches.value
    .map(match => Number(match.confidence_score ?? match.similarity_score ?? 0))
    .filter(score => Number.isFinite(score) && score > 0)
  if (!scores.length) return 'Pending review'
  const average = Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length)
  if (average >= 90) return 'High confidence'
  if (average >= 75) return 'Good confidence'
  return 'Needs review'
})

const productionSummary = computed(() => {
  const previewSummary = preview.value?.summary?.trim()
  if (previewSummary) return previewSummary
  const productionPreview = preview.value?.production_preview
  if (productionPreview?.sheets_required && productionPreview?.pieces_per_sheet) {
    return `${productionPreview.sheets_required} sheets estimated at ${productionPreview.pieces_per_sheet} pieces per sheet.`
  }
  return 'Managed by Printy. Exact quote follows after artwork review and production confirmation.'
})

const turnaroundSummary = computed<string>(() => summarizeTurnaround(matches.value, preview.value) || 'Exact turnaround follows artwork review.')

const visibleWarnings = computed(() => (preview.value?.warnings ?? []).slice(0, 2))
const visibleAssumptions = computed(() => (preview.value?.assumptions ?? []).slice(0, 1))

const pricingIssueDetected = computed(() =>
  (preview.value?.warnings ?? []).some(w => /pricing|rule|setup|configured|missing/i.test(String(w))),
)

const noMatchTitle = computed(() => {
  if ((preview.value?.missing_fields?.length ?? 0) > 0) return 'Add quantity/size to continue.'
  if (pricingIssueDetected.value) return 'Pricing rules are missing for this job'
  if ((preview.value?.warnings?.length ?? 0) > 0) return 'No exact match yet. We found the closest options.'
  return 'No production route matched yet'
})

const noMatchDescription = computed(() => {
  if ((preview.value?.missing_fields?.length ?? 0) > 0) {
    return preview.value?.summary || 'Add quantity/size to continue.'
  }
  if (pricingIssueDetected.value) {
    return 'Some production details need confirmation before final pricing.'
  }
  if ((preview.value?.warnings?.length ?? 0) > 0) {
    return 'Some specs need confirmation before Printy can lock the exact quote. Adjust the brief or try a nearby option.'
  }
  return 'Some specs are too unique for instant pricing. Adjust the calculator or send the brief for artwork review.'
})

function isExact(match: CalculatorPreviewMatch): boolean {
  const matchRecord = match as unknown as Record<string, unknown>
  if (matchRecord.exact_match !== undefined) {
    return Boolean(matchRecord.exact_match)
  }
  return (match.confidence_score ?? 0) >= 95
}

function isSelected(shopId: number): boolean {
  return selectedShopIds.value.includes(shopId)
}

function toggleMatch(shopId: number) {
  store.toggleShop(shopId)
}

function actionLabel(actionType: RequestActionType): string {
  if (actionType === 'ask_shop_to_confirm') return 'Upload artwork'
  if (actionType === 'send_job_brief') return 'Request sample'
  return 'Get exact quote'
}

function buildPricingSnapshot() {
  return buildVisibilitySafePricingSnapshot({
    preview: preview.value,
    selectedMatches: selectedMatches.value,
    isExact,
    getMatchedSpecs,
    getMissingSpecs,
  })
}

function buildRequestDetailsSnapshot(actionType: RequestActionType) {
  return {
    source: 'homepage_calculator',
    action_type: actionType,
    action_label: actionLabel(actionType),
    selected_shop_ids: selectedMatches.value.map(match => match.id),
    matched_shop_count: selectedMatches.value.length,
    guest_contact: {
      name: guestContact.name || null,
      phone: guestContact.phone || null,
      email: guestContact.email || null,
    },
    customer_name: guestContact.name || undefined,
    customer_phone: guestContact.phone || undefined,
    customer_email: guestContact.email || undefined,
    notes: requestNotes.value || undefined,
    artwork_file_name: selectedFileName.value || undefined,
  }
}

async function submitSelection(actionType: RequestActionType) {
  if (!selectedMatches.value.length || !preview.value) return

  if (!authStore.isAuthenticated) {
    queuedAnonymousAction.value = actionType
    guestHandoffError.value = ''
    showGuestHandoffModal.value = true
    return
  }

  await sendSelection(actionType)
}

async function sendSelection(actionType: RequestActionType, authPath?: '/auth/login' | '/auth/signup') {
  isSending.value = true
  pendingActionType.value = actionType
  try {
    await saveAndSend({
      title: `${selectedProduct.value?.label || 'Print job'} - ${Number(form.value.quantity || 1).toLocaleString()} pcs`,
      existingDraftId: activeServerDraftId.value,
      calculatorInputsSnapshot: {
        ...form.value,
        product_type: selectedProduct.value?.key ?? form.value.product_type ?? null,
      },
      pricingSnapshot: buildPricingSnapshot(),
      customProductSnapshot: {
        custom_notes: requestNotes.value || null,
        artwork_file_name: selectedFileName.value,
        artwork_refs: artworkRefs.value,
      },
      requestDetailsSnapshot: buildRequestDetailsSnapshot(actionType),
      selectedShopIds: selectedMatches.value.map(match => match.id),
      loginRedirectPath: '/',
      successRedirectPath: selectedMatches.value.length === 1 ? undefined : '/dashboard/client/requests',
      authPath,
    })
  } catch (err) {
    console.error('Failed to create quote requests:', err)
  } finally {
    isSending.value = false
    pendingActionType.value = null
  }
}

function closeGuestHandoffModal() {
  showGuestHandoffModal.value = false
  guestHandoffError.value = ''
  guestRequestSent.value = false
  sentShopNames.value = []
  queuedAnonymousAction.value = null
}

async function sendGuestRequest() {
  const hasPhone = Boolean(guestContact.phone.trim())
  const hasEmail = Boolean(guestContact.email.trim())
  if (!hasPhone && !hasEmail) {
    guestHandoffError.value = 'Enter a phone / WhatsApp number or email so shops know where to reply.'
    return
  }

  if (!selectedMatches.value.length || !preview.value) return

  guestHandoffError.value = ''
  isSendingGuest.value = true

  const config = useRuntimeConfig()
  const apiBase = (config.public.apiBase as string).replace(/\/$/, '')

  try {
    const result = await $fetch<Array<{ id: number; shop_name: string; request_reference: string }>>(
      `${apiBase}${API.guestQuoteRequestSend()}`,
      {
        method: 'POST',
        body: {
          shop_ids: selectedMatches.value.map(m => m.id),
          customer_name: guestContact.name || null,
          customer_email: guestContact.email || null,
          customer_phone: guestContact.phone || null,
          notes: requestNotes.value || null,
          request_details_snapshot: buildRequestDetailsSnapshot(queuedAnonymousAction.value ?? 'send_quote_request'),
        },
      },
    )
    sentShopNames.value = result.map(r => r.shop_name)
    guestRequestSent.value = true
  } catch (err: unknown) {
    const detail = (err as { data?: { detail?: string } })?.data?.detail
    guestHandoffError.value = detail ?? "We couldn't send the request. Your job details are still saved."
  } finally {
    isSendingGuest.value = false
  }
}

function goToSignupAfterSend() {
  pendingActionStore.setAction({
    name: 'saveAndSend',
    payload: {
      requestDetailsSnapshot: buildRequestDetailsSnapshot(queuedAnonymousAction.value ?? 'send_quote_request'),
      customer_name: guestContact.name,
      customer_email: guestContact.email,
      customer_phone: guestContact.phone,
    },
    redirectPath: '/quote-draft',
  })
  closeGuestHandoffModal()
  navigateTo({ path: '/auth/signup', query: { role: 'client', redirect: '/quote-draft' } })
}

async function completeGuestHandoff(authPath: '/auth/login' | '/auth/signup') {
  if (!queuedAnonymousAction.value) return
  guestHandoffError.value = ''
  showGuestHandoffModal.value = false
  await sendSelection(queuedAnonymousAction.value, authPath)
}

function matchStatusLabel(match: CalculatorPreviewMatch): string {
  if (isExact(match)) return 'Exact match'
  if ((match.confidence_score ?? 0) >= 80) return 'Close match'
  if (!match.total || match.total === '0') return 'Manual quote'
  return 'Needs confirmation'
}

function matchTone(match: CalculatorPreviewMatch): 'success' | 'warning' | 'info' | 'neutral' {
  if (isExact(match)) return 'success'
  if ((match.confidence_score ?? 0) >= 80) return 'info'
  if (!match.total || match.total === '0') return 'neutral'
  return 'warning'
}

function matchIcon(match: CalculatorPreviewMatch): string {
  if (isExact(match)) return 'lucide:check-circle-2'
  if ((match.confidence_score ?? 0) >= 80) return 'lucide:thumbs-up'
  return 'lucide:alert-circle'
}

function money(total?: string | null, currency?: string | null): string {
  if (!total || total === '0') return 'On request'
  return `${currency ?? 'KES'} ${Number(total).toLocaleString()}`
}

function score(value?: number | null): string {
  if (value == null) return '0%'
  return `${Math.round(value)}%`
}

function getMatchedSpecs(match: CalculatorPreviewMatch): string[] {
  if (Array.isArray(match.matched_specs)) return match.matched_specs.map(String)

  const specs: string[] = []
  if (selectedProduct.value?.label) specs.push(selectedProduct.value.label)
  if (form.value.quantity) specs.push(`${Number(form.value.quantity).toLocaleString()} units`)
  return specs.slice(0, 3)
}

function getMissingSpecs(match: CalculatorPreviewMatch): string[] {
  if (Array.isArray(match.needs_confirmation)) return match.needs_confirmation.map(String)
  if (isExact(match)) return []

  return ['Confirm paper']
}

function summarizeMatch(match: CalculatorPreviewMatch) {
  return summarizeProductionPreview(match.production_preview, match.reason ?? 'Managed review required.')
}

function jumpToCalculator() {
  document.getElementById('managed-calculator')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

async function retryPreview() {
  await store.fetchPreview()
}
</script>
