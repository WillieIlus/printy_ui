<!-- Purpose: Homepage result cards with anonymous handoff and real quote-request actions. -->
<template>
  <section class="mx-auto max-w-6xl px-4 py-8 md:px-6 md:py-12">
    <div v-if="previewLoading" class="rounded-[2.5rem] border border-[var(--p-border)] bg-[var(--p-surface)] px-6 py-20 text-center">
      <div class="mx-auto mb-5 flex size-16 items-center justify-center rounded-full bg-[var(--p-bg-soft)]">
        <Icon name="lucide:loader-2" class="size-8 animate-spin text-[var(--p-primary)]" />
      </div>
      <h3 class="text-2xl font-bold text-[var(--p-text)]">Checking live shop matches</h3>
      <p class="mt-3 max-w-md mx-auto text-[var(--p-text-muted)]">
        We&apos;re pricing the job, checking available shops, and preparing the next best options.
      </p>
    </div>

    <div v-else-if="previewLoaded" class="space-y-8">
      <div class="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div class="space-y-1">
          <p class="text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--p-primary)]">
            {{ hasExactMatches ? 'Direct matches found' : 'Available options' }}
          </p>
          <h2 class="text-2xl font-bold tracking-tight text-[var(--p-text)] md:text-3xl">
            {{ hasExactMatches ? 'Shops that can print this' : 'Best available matches' }}
          </h2>
          <p class="max-w-2xl text-sm text-[var(--p-text-muted)]">
            {{
              hasExactMatches
                ? 'Select one or more shops, then send a real quote request into the dashboard flow.'
                : 'These shops can handle most of the job, but some specs still need confirmation before final pricing.'
            }}
          </p>
        </div>
        <div
          v-if="preview?.matches_count"
          class="inline-flex items-center gap-2 rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface)] px-4 py-2.5 text-sm font-bold text-[var(--p-text)] shadow-sm"
        >
          <span class="flex size-5 items-center justify-center rounded-full bg-[var(--p-primary)]/10 text-[10px] text-[var(--p-primary)]">
            {{ preview.matches_count }}
          </span>
          <span>Matching shop{{ preview.matches_count === 1 ? '' : 's' }}</span>
        </div>
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

      <div v-else class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <article
          v-for="(match, index) in matches.slice(0, 6)"
          :key="match.id"
          class="group relative flex flex-col overflow-hidden rounded-[2rem] border border-[var(--p-border)] bg-[var(--p-surface)] transition-all hover:border-[var(--p-primary)]/30 hover:shadow-xl"
          :class="{
            'ring-2 ring-[var(--p-primary)]/20': index === 0 && isExact(match),
            'border-[var(--p-primary)] shadow-lg': isSelected(match.id),
          }"
        >
          <div class="flex items-center justify-between border-b border-[var(--p-border)] bg-[var(--p-bg-soft)]/50 px-5 py-3">
            <BaseBadge :tone="matchTone(match)" size="sm">
              <Icon :name="matchIcon(match)" class="mr-1 size-3" />
              {{ matchStatusLabel(match) }}
            </BaseBadge>
            <span class="text-[10px] font-bold uppercase tracking-widest text-[var(--p-text-muted)]">
              {{ score(match.confidence_score ?? match.similarity_score) }} Match
            </span>
          </div>

          <div class="flex flex-1 flex-col p-6">
            <div class="mb-6 flex items-start justify-between gap-3">
              <div>
                <h3 class="text-xl font-bold text-[var(--p-text)] transition-colors group-hover:text-[var(--p-primary)]">{{ match.name }}</h3>
                <p class="mt-1 flex items-center gap-1 text-xs font-medium text-[var(--p-text-muted)]">
                  <Icon name="lucide:map-pin" class="size-3" />
                  Kenya-wide delivery
                </p>
              </div>
              <button
                type="button"
                class="inline-flex size-6 items-center justify-center rounded-full border transition"
                :class="isSelected(match.id)
                  ? 'border-[var(--p-primary)] bg-[var(--p-primary)] text-white'
                  : 'border-[var(--p-border)] bg-white text-transparent hover:border-[var(--p-primary)]'"
                :aria-pressed="isSelected(match.id)"
                @click="toggleMatch(match.id)"
              >
                <Icon name="lucide:check" class="size-4" />
              </button>
            </div>

            <div class="mb-6 grid grid-cols-2 gap-3">
              <div class="rounded-2xl border border-[var(--p-border)] bg-[var(--p-bg-soft)] p-3">
                <p class="text-[9px] font-bold uppercase tracking-wider text-[var(--p-text-muted)]">Estimated Price</p>
                <p class="mt-0.5 text-lg font-bold text-[var(--p-text)]">{{ money(match.total, match.currency) }}</p>
              </div>
              <div class="rounded-2xl border border-[var(--p-border)] bg-[var(--p-bg-soft)] p-3">
                <p class="text-[9px] font-bold uppercase tracking-wider text-[var(--p-text-muted)]">Turnaround</p>
                <p class="mt-0.5 truncate text-sm font-bold text-[var(--p-text)]">
                  {{ match.preview?.human_ready_text ?? match.human_ready_text ?? 'On request' }}
                </p>
              </div>
            </div>

            <div class="mb-8 flex-1 space-y-4">
              <div class="space-y-2">
                <p class="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-green-600 dark:text-green-400">
                  <Icon name="lucide:check-circle-2" class="size-3" />
                  <span>Can handle</span>
                </p>
                <div class="flex flex-wrap gap-1.5">
                  <span
                    v-for="spec in getMatchedSpecs(match)"
                    :key="spec"
                    class="rounded-lg border border-green-500/10 bg-green-500/5 px-2 py-1 text-[11px] font-medium text-green-700 dark:text-green-300"
                  >
                    {{ spec }}
                  </span>
                </div>
              </div>

              <div v-if="getMissingSpecs(match).length" class="space-y-2">
                <p class="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-amber-600 dark:text-amber-400">
                  <Icon name="lucide:help-circle" class="size-3" />
                  <span>Needs confirmation</span>
                </p>
                <div class="flex flex-wrap gap-1.5">
                  <span
                    v-for="spec in getMissingSpecs(match)"
                    :key="spec"
                    class="rounded-lg border border-amber-500/10 bg-amber-500/5 px-2 py-1 text-[11px] font-medium text-amber-700 dark:text-amber-300"
                  >
                    {{ spec }}
                  </span>
                </div>
              </div>

              <p v-if="!getMatchedSpecs(match).length && !getMissingSpecs(match).length" class="text-xs italic text-[var(--p-text-muted)]">
                {{ match.reason ?? 'This shop may need to confirm some details before final pricing.' }}
              </p>
            </div>

            <div class="mt-auto flex flex-col gap-2">
              <BaseButton
                :variant="isSelected(match.id) ? 'primary' : 'secondary'"
                block
                class="!rounded-xl !py-3 text-xs font-bold uppercase tracking-wider"
                @click="toggleMatch(match.id)"
              >
                {{ isSelected(match.id) ? 'Selected for request' : 'Select shop' }}
              </BaseButton>
              <BaseButton
                :to="`/shops/${match.slug}`"
                variant="ghost"
                block
                class="!rounded-xl !py-3 text-xs font-bold uppercase tracking-wider"
              >
                View shop
              </BaseButton>
            </div>
          </div>
        </article>
      </div>

      <div
        v-if="selectedMatches.length"
        class="rounded-[2rem] border border-[var(--p-border)] bg-[var(--p-surface)] p-6 shadow-sm"
      >
        <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div class="space-y-1">
            <p class="text-[10px] font-bold uppercase tracking-[0.28em] text-[var(--p-primary)]">Ready to send</p>
            <h3 class="text-xl font-bold text-[var(--p-text)]">
              {{ selectedMatches.length }} shop{{ selectedMatches.length === 1 ? '' : 's' }} selected
            </h3>
            <p class="text-sm text-[var(--p-text-muted)]">
              Printy will create a real quote request for each selected shop and place it in both dashboards.
            </p>
          </div>
          <div class="flex flex-wrap gap-2">
            <BaseButton variant="primary" :disabled="isSending" @click="submitSelection('send_quote_request')">
              <Icon v-if="isSending && pendingActionType === 'send_quote_request'" name="lucide:loader-2" class="mr-1.5 size-4 animate-spin" />
              Send quote request
            </BaseButton>
            <BaseButton variant="secondary" :disabled="isSending" @click="submitSelection('ask_shop_to_confirm')">
              <Icon v-if="isSending && pendingActionType === 'ask_shop_to_confirm'" name="lucide:loader-2" class="mr-1.5 size-4 animate-spin" />
              Ask shop to confirm
            </BaseButton>
            <BaseButton variant="outline" :disabled="isSending" @click="submitSelection('send_job_brief')">
              <Icon v-if="isSending && pendingActionType === 'send_job_brief'" name="lucide:loader-2" class="mr-1.5 size-4 animate-spin" />
              Send job brief
            </BaseButton>
          </div>
        </div>
      </div>

      <div v-if="matches.length > 3" class="rounded-[2rem] border border-[var(--p-border)] bg-[var(--p-surface-dark)] p-8 text-center text-[var(--p-text-on-dark)]">
        <h3 class="text-xl font-bold">Want to see more shops?</h3>
        <p class="mt-2 text-sm text-[var(--p-text-on-dark-muted)]">
          Total of {{ preview?.matches_count }} shops found with prices ranging from {{ rangeText }}.
        </p>
        <BaseButton variant="primary" class="mt-6 !px-10" to="/shops">
          Browse all shops
        </BaseButton>
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
      <h3 class="text-2xl font-bold text-[var(--p-text)]">Instant results appear here</h3>
      <p class="mt-3 max-w-sm text-[var(--p-text-muted)]">
        Use the calculator above to describe your job. We&apos;ll find matching shops across Kenya instantly.
      </p>
    </div>

    <div
      v-if="showGuestHandoffModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/65 px-4 py-6 backdrop-blur-sm"
    >
      <div class="w-full max-w-xl rounded-[2rem] bg-white p-6 shadow-2xl">
        <div class="space-y-2">
          <p class="text-[10px] font-bold uppercase tracking-[0.28em] text-[var(--p-primary)]">Almost done</p>
          <h3 class="text-2xl font-bold text-slate-950">Almost done — where should shops send the confirmed price?</h3>
          <p class="text-sm text-slate-600">
            No payment. Shops confirm before anything is final.
          </p>
          <p class="text-sm text-slate-600">
            We&apos;ll save your job so you don&apos;t retype it.
          </p>
          <p class="text-sm text-slate-600">
            Create an account later to track replies.
          </p>
        </div>

        <div class="mt-5 grid gap-4 sm:grid-cols-2">
          <label class="space-y-1 sm:col-span-2">
            <span class="text-sm font-semibold text-slate-900">Name</span>
            <input
              v-model.trim="guestContact.name"
              type="text"
              class="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[var(--p-primary)] focus:ring-4 focus:ring-[var(--p-primary)]/10"
              placeholder="Optional"
            >
          </label>
          <label class="space-y-1">
            <span class="text-sm font-semibold text-slate-900">Phone / WhatsApp</span>
            <input
              v-model.trim="guestContact.phone"
              type="tel"
              class="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[var(--p-primary)] focus:ring-4 focus:ring-[var(--p-primary)]/10"
              placeholder="+254..."
            >
          </label>
          <label class="space-y-1">
            <span class="text-sm font-semibold text-slate-900">Email</span>
            <input
              v-model.trim="guestContact.email"
              type="email"
              class="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[var(--p-primary)] focus:ring-4 focus:ring-[var(--p-primary)]/10"
              placeholder="you@example.com"
            >
          </label>
        </div>

        <p v-if="guestHandoffError" class="mt-3 text-sm text-rose-600">
          {{ guestHandoffError }}
        </p>

        <div class="mt-6 flex flex-col gap-3 sm:flex-row">
          <BaseButton variant="primary" block :disabled="isSending" @click="completeGuestHandoff('/auth/signup')">
            Continue with signup
          </BaseButton>
          <BaseButton variant="secondary" block :disabled="isSending" @click="completeGuestHandoff('/auth/login')">
            Continue with login
          </BaseButton>
        </div>
        <BaseButton variant="ghost" block class="mt-2" :disabled="isSending" @click="closeGuestHandoffModal">
          Back
        </BaseButton>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import type { CalculatorPreviewMatch } from '~/types/api/calculator'
import { useAuthStore } from '~/stores/auth'
import { useCalculatorStore } from '~/stores/calculator'
import { useCalculatorDraftRecoveryStore } from '~/stores/calculatorDraftRecovery'
import { useQuoteRequestBlast } from '~/composables/useQuoteRequestBlast'
import BaseButton from '~/components/ui/BaseButton.vue'
import BaseBadge from '~/components/ui/BaseBadge.vue'

type RequestActionType = 'send_quote_request' | 'ask_shop_to_confirm' | 'send_job_brief'

type GuestContactState = {
  name: string
  phone: string
  email: string
}

const authStore = useAuthStore()
const store = useCalculatorStore()
const draftRecoveryStore = useCalculatorDraftRecoveryStore()
const { preview, previewLoaded, previewLoading, previewError, selectedProduct, form, selectedShopIds } = storeToRefs(store)
const { activeServerDraftId, requestNotes, selectedFileName, artworkRefs } = storeToRefs(draftRecoveryStore)
const { saveAndSend } = useQuoteRequestBlast()

const matches = computed(() => preview.value?.matches ?? [])
const hasExactMatches = computed(() => matches.value.some(match => isExact(match)))
const selectedMatches = computed(() => matches.value.filter(match => selectedShopIds.value.includes(match.id)))

const isSending = ref(false)
const pendingActionType = ref<RequestActionType | null>(null)
const showGuestHandoffModal = ref(false)
const guestHandoffError = ref('')
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

const pricingIssueDetected = computed(() =>
  (preview.value?.warnings ?? []).some(w => /pricing|rule|setup|configured|missing/i.test(String(w))),
)

const noMatchTitle = computed(() => {
  if ((preview.value?.missing_fields?.length ?? 0) > 0) return 'Add quantity/size to continue.'
  if (pricingIssueDetected.value) return 'Pricing rules are missing for this job'
  if ((preview.value?.warnings?.length ?? 0) > 0) return 'No exact match yet. We found the closest options.'
  return 'No shops matched yet'
})

const noMatchDescription = computed(() => {
  if ((preview.value?.missing_fields?.length ?? 0) > 0) {
    return preview.value?.summary || 'Add quantity/size to continue.'
  }
  if (pricingIssueDetected.value) {
    return 'Some shops need confirmation before final pricing.'
  }
  if ((preview.value?.warnings?.length ?? 0) > 0) {
    return 'Some specs need confirmation before a shop can price this accurately. Adjust the calculator or try a nearby option.'
  }
  return 'Some specs are too unique for instant pricing. Adjust the calculator or send the brief after selecting a compatible shop.'
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
  if (actionType === 'ask_shop_to_confirm') return 'Ask shop to confirm'
  if (actionType === 'send_job_brief') return 'Send job brief'
  return 'Send quote request'
}

function buildPricingSnapshot() {
  return {
    source: 'homepage_calculator',
    currency: preview.value?.currency ?? 'KES',
    min_price: preview.value?.min_price ?? null,
    max_price: preview.value?.max_price ?? null,
    total: preview.value?.total ?? null,
    summary: preview.value?.summary ?? '',
    warnings: preview.value?.warnings ?? [],
    assumptions: preview.value?.assumptions ?? [],
    price_mode: preview.value?.price_mode ?? null,
    production_preview: preview.value?.production_preview ?? null,
    pricing_preview: preview.value?.pricing_breakdown ?? null,
    selected_shops: selectedMatches.value.map(match => ({
      id: match.id,
      slug: match.slug,
      name: match.name,
      total: match.total ?? null,
      currency: match.currency ?? preview.value?.currency ?? 'KES',
      confidence_score: match.confidence_score ?? match.similarity_score ?? null,
      exact_match: isExact(match),
      matched_specs: getMatchedSpecs(match),
      needs_confirmation: getMissingSpecs(match),
      turnaround_label: match.turnaround_label ?? null,
      human_ready_text: match.preview?.human_ready_text ?? match.human_ready_text ?? null,
      preview: match.preview ?? null,
      selection: match.selection ?? null,
    })),
  }
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
  queuedAnonymousAction.value = null
}

async function completeGuestHandoff(authPath: '/auth/login' | '/auth/signup') {
  if (!queuedAnonymousAction.value) return

  const hasPhone = Boolean(guestContact.phone.trim())
  const hasEmail = Boolean(guestContact.email.trim())
  if (authPath === '/auth/signup' && !hasPhone && !hasEmail) {
    guestHandoffError.value = 'Enter a phone / WhatsApp number or an email so shops know where to reply.'
    return
  }

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
  const previewRecord = match.preview as Record<string, unknown> | null | undefined
  const matchedSpecs = previewRecord?.matched_specs
  if (Array.isArray(matchedSpecs)) return matchedSpecs.map(String)

  const specs: string[] = []
  if (selectedProduct.value?.label) specs.push(selectedProduct.value.label)
  if (form.value.quantity) specs.push(`${Number(form.value.quantity).toLocaleString()} units`)
  if (previewRecord?.matched_stock) specs.push('Paper matched')
  return specs.slice(0, 3)
}

function getMissingSpecs(match: CalculatorPreviewMatch): string[] {
  const previewRecord = match.preview as Record<string, unknown> | null | undefined
  const missingSpecs = previewRecord?.missing_specs
  if (Array.isArray(missingSpecs)) return missingSpecs.map(String)
  if (isExact(match)) return []

  const missing: string[] = []
  if (!previewRecord?.matched_stock) missing.push('Confirm paper')
  if (form.value.lamination && form.value.lamination !== 'NONE' && !previewRecord?.lamination_priced) {
    missing.push('Confirm lamination')
  }
  return missing
}

async function retryPreview() {
  await store.fetchPreview()
}
</script>
