<template>
  <div class="mx-auto w-full max-w-[680px] px-4 pb-28 pt-10 sm:px-6">
    <div class="flex items-center gap-2 font-mono2 text-[10px] uppercase tracking-[0.22em] text-[var(--sub)]">
      <ShieldCheck :size="12" style="color: var(--accent)" /> Printy client link
    </div>

    <div v-if="loading" class="mt-10 flex items-center gap-2 text-[13px] text-[var(--sub)]" data-test="client-link-loading">
      <Loader2 :size="15" class="animate-spin" style="color: var(--accent)" /> Opening your quote…
    </div>

    <div v-else-if="notFound" class="mt-8 rounded-2xl border p-6 text-center" :style="{ borderColor: 'var(--line)', background: 'var(--panel)' }" data-test="client-link-invalid">
      <CircleDashed :size="22" class="mx-auto" style="color: var(--sub)" />
      <div class="mt-3 font-disp text-[16px] font-bold">This link is no longer valid</div>
      <p class="mt-1.5 text-[12.5px] leading-relaxed text-[var(--sub)]">
        {{ error || 'It may have expired or been replaced. Ask your print manager for a fresh link.' }}
      </p>
    </div>

    <div v-else-if="error && !payload" class="mt-8 rounded-2xl border p-6 text-center" :style="{ borderColor: 'var(--line)', background: 'var(--panel)' }">
      <CircleDashed :size="22" class="mx-auto" style="color: var(--sub)" />
      <div class="mt-3 font-disp text-[16px] font-bold">We couldn't open this link</div>
      <p class="mt-1.5 text-[12.5px] leading-relaxed text-[var(--sub)]">{{ error }}</p>
      <button class="press-key mt-4 rounded-xl border px-4 py-2.5 font-mono2 text-[10px] font-bold uppercase tracking-[0.14em]" :style="{ borderColor: 'var(--line)', color: 'var(--accent)' }" @click="load">
        Try again
      </button>
    </div>

    <template v-else-if="payload">
      <h1 class="mt-2 font-disp text-[30px] font-bold leading-tight tracking-tight sm:text-[36px]">
        Your quote{{ payload.code ? ` ${payload.code}` : '' }}
      </h1>
      <p class="mt-2 text-[13px] leading-relaxed text-[var(--sub)]">
        No account and no email needed. Viewing this link is free — we'll only ask for a code by SMS
        when you upload artwork, acknowledge a change, or pay.
      </p>

      <!-- payment status (law 10.7) -->
      <div
        v-if="paymentDisplay"
        class="mt-5 flex items-center gap-2.5 rounded-2xl border px-4 py-3"
        :style="paymentDisplay.style"
        data-test="payment-status"
      >
        <Loader2 v-if="paymentDisplay.awaiting" :size="15" class="animate-spin" />
        <CircleAlert v-else-if="paymentDisplay.failed" :size="15" />
        <CheckCheck v-else :size="15" />
        <div class="leading-tight">
          <div class="font-disp text-[14px] font-bold" data-test="payment-status-label">{{ paymentDisplay.label }}</div>
          <div class="text-[11.5px] text-[var(--sub)]">{{ paymentDisplay.detail }}</div>
        </div>
      </div>

      <!-- quote summary (buyer view) -->
      <div class="mt-5 rounded-2xl border p-4" :style="{ borderColor: 'var(--line)', background: 'var(--panel)' }" data-test="quote-summary">
        <ML>Quote summary</ML>
        <div class="mt-2.5 grid gap-x-4 gap-y-2 sm:grid-cols-2">
          <div>
            <div class="font-mono2 text-[8.5px] uppercase tracking-[0.12em] text-[var(--sub)]">Reference</div>
            <div class="text-[13px] text-[var(--ink)]">{{ payload.quote_reference || payload.code }}</div>
          </div>
          <div>
            <div class="font-mono2 text-[8.5px] uppercase tracking-[0.12em] text-[var(--sub)]">Status</div>
            <div class="text-[13px] text-[var(--ink)]" data-test="quote-status">{{ payload.status_label || payload.status }}</div>
          </div>
          <div v-if="payload.due_date">
            <div class="font-mono2 text-[8.5px] uppercase tracking-[0.12em] text-[var(--sub)]">Due date</div>
            <div class="text-[13px] text-[var(--ink)]">{{ formatDate(payload.due_date) }}</div>
          </div>
          <div v-if="payload.delivery_preference">
            <div class="font-mono2 text-[8.5px] uppercase tracking-[0.12em] text-[var(--sub)]">Delivery</div>
            <div class="text-[13px] text-[var(--ink)]">{{ payload.delivery_preference }}</div>
          </div>
        </div>

        <ul v-if="payload.timeline?.length" class="mt-3 space-y-1.5">
          <li v-for="(stage, i) in payload.timeline" :key="String(stage.key ?? i)" class="flex items-center gap-2 text-[12px]">
            <span class="h-1.5 w-1.5 shrink-0 rounded-full" style="background: var(--accent)" />
            <span class="text-[var(--ink)]">{{ stage.label || stage.key || 'Stage' }}</span>
            <span v-if="stage.status" class="text-[var(--sub)]">· {{ stage.status }}</span>
          </li>
        </ul>
      </div>

      <!-- artwork step (law 7.2) -->
      <div class="mt-4 rounded-2xl border p-4" :style="{ borderColor: 'var(--line)', background: 'var(--panel)' }" data-test="artwork-step">
        <div class="flex items-center gap-2">
          <ImageUp :size="13" style="color: var(--accent)" />
          <ML>Your artwork</ML>
          <span v-if="artworkDone" class="ml-auto inline-flex items-center gap-1 font-mono2 text-[9px] uppercase tracking-[0.12em]" style="color: #0E7A45">
            <CheckCheck :size="11" /> added
          </span>
        </div>
        <p class="mt-1.5 text-[11.5px] leading-relaxed text-[var(--sub)]">
          We can't print until your final artwork is in. Add it here and confirm it's correct.
        </p>
        <input
          ref="fileInput"
          type="file"
          class="mt-3 block w-full text-[12px] text-[var(--sub)]"
          data-test="artwork-file"
          @change="onFilePicked"
        />
        <button
          class="press-key mt-3 inline-flex items-center gap-2 rounded-xl px-4 py-2.5 font-mono2 text-[10px] font-bold uppercase tracking-[0.12em] disabled:opacity-50"
          :style="{ background: 'var(--accent)', color: 'var(--accentInk)' }"
          :disabled="busy"
          data-test="artwork-submit"
          @click="runAction('artwork')"
        >
          <Loader2 v-if="busy" :size="12" class="animate-spin" /> <ImageUp v-else :size="12" /> Send artwork
        </button>
      </div>

      <!-- acknowledgements -->
      <div class="mt-4 rounded-2xl border p-4" :style="{ borderColor: 'var(--line)', background: 'var(--panel)' }" data-test="acknowledgements">
        <ML>Confirm the details</ML>
        <p class="mt-1.5 text-[11.5px] leading-relaxed text-[var(--sub)]">
          Please confirm you've seen the current price and the expected date before paying.
        </p>
        <div class="mt-3 flex flex-wrap gap-2">
          <button
            class="press-key inline-flex items-center gap-1.5 rounded-xl border px-4 py-2.5 font-mono2 text-[10px] font-bold uppercase tracking-[0.12em] disabled:opacity-50"
            :style="priceAck ? { borderColor: '#0E7A45', color: '#0E7A45' } : { borderColor: 'var(--accent)', color: 'var(--accent)' }"
            :disabled="busy"
            data-test="price-ack"
            @click="runAction('price')"
          >
            <CheckCheck v-if="priceAck" :size="11" /> <Tag v-else :size="11" /> Price updated
          </button>
          <button
            class="press-key inline-flex items-center gap-1.5 rounded-xl border px-4 py-2.5 font-mono2 text-[10px] font-bold uppercase tracking-[0.12em] disabled:opacity-50"
            :style="dateAck ? { borderColor: '#0E7A45', color: '#0E7A45' } : { borderColor: 'var(--line)', color: 'var(--sub)' }"
            :disabled="busy"
            data-test="date-ack"
            @click="runAction('date')"
          >
            <CheckCheck v-if="dateAck" :size="11" /> <CalendarClock v-else :size="11" /> Date updated
          </button>
        </div>
      </div>

      <!-- OTP panel (law 10.4) -->
      <div v-if="otpOpen" class="mt-4 rounded-2xl border p-4" :style="{ borderColor: 'var(--accent)', background: 'var(--panel)' }" data-test="otp-panel">
        <div class="flex items-center gap-2">
          <KeyRound :size="13" style="color: var(--accent)" />
          <ML>Verify your phone</ML>
        </div>
        <p class="mt-1.5 text-[11.5px] leading-relaxed text-[var(--sub)]">
          We sent a code by SMS to the phone on this job. Enter it to continue.
        </p>
        <div class="mt-3 flex flex-wrap gap-2">
          <input
            v-model="otpCode"
            inputmode="numeric"
            autocomplete="one-time-code"
            placeholder="6-digit code"
            class="w-[170px] rounded-xl border px-3 py-2.5 font-mono2 text-[14px] tracking-[0.2em]"
            :style="fieldStyle"
            data-test="otp-code"
          />
          <button
            class="press-key inline-flex items-center gap-2 rounded-xl px-4 py-2.5 font-mono2 text-[10px] font-bold uppercase tracking-[0.12em] text-white disabled:opacity-50"
            style="background: var(--accent)"
            :disabled="busy || !otpCode.trim()"
            data-test="otp-verify"
            @click="verifyOtp"
          >
            <Loader2 v-if="busy" :size="12" class="animate-spin" /> Verify
          </button>
          <button
            class="press-key rounded-xl border px-4 py-2.5 font-mono2 text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--sub)] disabled:opacity-50"
            :style="{ borderColor: 'var(--line)' }"
            :disabled="busy"
            data-test="otp-resend"
            @click="requestOtp"
          >
            Resend code
          </button>
        </div>
        <p v-if="devCode" class="mt-2 font-mono2 text-[11px] text-[var(--sub)]" data-test="otp-devcode">Dev code: {{ devCode }}</p>
      </div>

      <p v-if="actionError" class="mt-4 rounded-xl border px-4 py-3 text-[12.5px]" :style="{ borderColor: 'rgba(200,30,68,.45)', background: 'rgba(200,30,68,.1)', color: '#C81E44' }" data-test="action-error">
        {{ actionError }}
      </p>
      <p v-if="actionNote" class="mt-4 flex items-center gap-2 rounded-xl border px-4 py-3 text-[12.5px]" :style="{ borderColor: 'rgba(14,122,69,.45)', background: 'rgba(14,122,69,.1)', color: '#0E7A45' }" data-test="action-note">
        <CheckCheck :size="13" /> {{ actionNote }}
      </p>

      <!-- pay (law 10.7) -->
      <div class="mt-5 rounded-2xl border p-4" :style="{ borderColor: 'var(--line)', background: 'var(--panel)' }" data-test="pay-section">
        <ML>Pay for your job</ML>
        <p class="mt-1.5 text-[11.5px] leading-relaxed text-[var(--sub)]">
          Every job is paid through Printy and held safely until delivery. There is no off-platform payment.
        </p>
        <ul class="mt-3 space-y-1.5">
          <li v-for="reason in payReasons" :key="reason.key" class="flex items-center gap-2 text-[12px]">
            <CheckCheck v-if="reason.done" :size="12" style="color: #0E7A45" />
            <Circle v-else :size="12" style="color: var(--sub)" />
            <span :style="{ color: reason.done ? 'var(--ink)' : 'var(--sub)' }">{{ reason.label }}</span>
          </li>
        </ul>
        <button
          class="press-key mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3 font-mono2 text-[11px] font-bold uppercase tracking-[0.14em] disabled:opacity-50"
          :style="{ background: 'var(--accent)', color: 'var(--accentInk)' }"
          :disabled="busy || !canPay"
          data-test="pay-button"
          @click="runAction('pay')"
        >
          <Loader2 v-if="busy" :size="13" class="animate-spin" /> <Smartphone v-else :size="13" /> Pay with M-Pesa
        </button>
        <p v-if="!canPay" class="mt-2 text-[11px] leading-snug text-[var(--sub)]" data-test="pay-hint">
          {{ payHint }}
        </p>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import {
  CalendarClock,
  CheckCheck,
  Circle,
  CircleAlert,
  CircleDashed,
  ImageUp,
  KeyRound,
  Loader2,
  ShieldCheck,
  Smartphone,
  Tag,
} from 'lucide-vue-next'
import { API } from '~/shared/api-paths'
import { getApiErrorMessage } from '~/shared/api'
import type {
  ClientLinkOtpRequestResult,
  ClientLinkOtpVerifyResult,
  ClientLinkPaymentResult,
  ClientLinkPayload,
  PaymentState,
} from '~/shared/types'

const props = defineProps<{ token: string }>()

const { publicApi } = useApi()

type ActionKind = 'artwork' | 'price' | 'date' | 'pay'

const payload = ref<ClientLinkPayload | null>(null)
const loading = ref(false)
const notFound = ref(false)
const error = ref('')

const busy = ref(false)
const actionError = ref('')
const actionNote = ref('')

const otpOpen = ref(false)
const otpCode = ref('')
const otpToken = ref('')
const devCode = ref('')
const pendingAction = ref<ActionKind | null>(null)

const priceAck = ref(false)
const dateAck = ref(false)
const artworkDone = ref(false)
const paymentAttempted = ref(false)

const fieldStyle = { borderColor: 'var(--line)', background: 'var(--panel2)', color: 'var(--ink)' }
const fileInput = ref<HTMLInputElement | null>(null)
const pickedFile = ref<File | null>(null)

/* Law 10.7 — a sent STK push is "Awaiting confirmation"; only a verified
   provider confirmation may be shown as "Paid". The backend now sends the
   canonical `payment_state`; these tones render it. The legacy `payment_status`
   values are kept as a fallback for old payloads. */
const PAID_TONE = { borderColor: 'rgba(14,122,69,.45)', background: 'rgba(14,122,69,.1)', color: '#0E7A45' }
const AWAITING_TONE = { borderColor: 'rgba(214,158,46,.45)', background: 'rgba(214,158,46,.1)', color: '#8A6100' }
const FAILED_TONE = { borderColor: 'rgba(200,56,56,.45)', background: 'rgba(200,56,56,.1)', color: '#A02020' }

/* Only the canonical `paid` state, or the legacy confirmed job status, is paid. */
const CONFIRMED = new Set(['paid', 'confirmed', 'complete', 'completed', 'success'])
const ATTEMPT_STATES = new Set(['awaiting_confirmation', 'paid', 'failed', 'cancelled', 'timed_out'])

function isConfirmed(value: unknown): boolean {
  return CONFIRMED.has(String(value ?? '').trim().toLowerCase())
}

function normaliseState(value: unknown): string {
  return String(value ?? '').trim().toLowerCase()
}

const paymentDisplay = computed(() => {
  const state = normaliseState(payload.value?.payment_state)
  const knownState = state && state !== 'not_started'
  if (state === 'paid' || (!knownState && isConfirmed(payload.value?.payment_status))) {
    return {
      label: payload.value?.payment_state_label || 'Paid',
      detail: 'Your payment is confirmed and held in Printy custody.',
      awaiting: false,
      failed: false,
      style: PAID_TONE,
    }
  }
  if (state === 'failed') {
    return {
      label: payload.value?.payment_state_label || 'Payment failed',
      detail: 'M-Pesa did not complete this payment. You can try again.',
      awaiting: false,
      failed: true,
      style: FAILED_TONE,
    }
  }
  if (state === 'cancelled') {
    return {
      label: payload.value?.payment_state_label || 'Payment cancelled',
      detail: 'This payment attempt was cancelled. You can start a new one.',
      awaiting: false,
      failed: true,
      style: FAILED_TONE,
    }
  }
  if (state === 'timed_out') {
    return {
      label: payload.value?.payment_state_label || 'Payment timed out',
      detail: 'M-Pesa did not confirm this payment in time. You can try again.',
      awaiting: false,
      failed: true,
      style: FAILED_TONE,
    }
  }
  if (state === 'awaiting_confirmation' || (!knownState && paymentAttempted.value)) {
    return {
      label: payload.value?.payment_state_label || 'Awaiting confirmation',
      detail: "We're waiting for M-Pesa to confirm your payment. This page updates once it does.",
      awaiting: true,
      failed: false,
      style: AWAITING_TONE,
    }
  }
  return null
})

const payReasons = computed(() => [
  { key: 'otp', label: 'Verify your phone with the code we sent', done: Boolean(otpToken.value) },
  { key: 'artwork', label: 'Add your artwork (law 7.2)', done: artworkDone.value },
  { key: 'price', label: "Confirm you've seen the updated price (law 7.1)", done: priceAck.value },
  { key: 'date', label: "Confirm you've seen the updated date", done: dateAck.value },
])

const canPay = computed(() => payReasons.value.every((r) => r.done))
const payHint = computed(() => {
  const next = payReasons.value.find((r) => !r.done)
  return next ? `Still needed: ${next.label.replace(/\(law [\d.]+\)/, '').trim().toLowerCase()}.` : ''
})

async function load() {
  loading.value = true
  notFound.value = false
  error.value = ''
  try {
    const data = await publicApi<ClientLinkPayload>(API.clientPortal.link(props.token), { auth: false })
    payload.value = data
    if (ATTEMPT_STATES.has(normaliseState(data?.payment_state)) || isConfirmed(data?.payment_status)) {
      paymentAttempted.value = true
    }
  } catch (e: any) {
    if (e?.statusCode === 404 || e?.statusCode === 410) {
      notFound.value = true
      error.value = e?.data?.detail || ''
    } else {
      error.value = getApiErrorMessage(e, 'The client link service could not be reached right now.')
    }
  } finally {
    loading.value = false
  }
}

function onFilePicked(event: Event) {
  const target = event.target as HTMLInputElement
  pickedFile.value = target.files?.[0] ?? null
}

/* Law 10.4 — an OTP is prompted before any action that needs identity.
   Viewing the link (load) needs none. */
async function runAction(kind: ActionKind) {
  if (!otpToken.value) {
    pendingAction.value = kind
    await requestOtp()
    return
  }
  await execute(kind)
}

async function requestOtp() {
  otpOpen.value = true
  actionError.value = ''
  try {
    const data = await publicApi<ClientLinkOtpRequestResult>(API.clientPortal.otpRequest(props.token), {
      auth: false,
      method: 'POST',
      body: {},
    })
    devCode.value = data?.code ? String(data.code) : ''
  } catch (e: any) {
    if (e?.statusCode === 404 || e?.statusCode === 410) {
      notFound.value = true
      return
    }
    actionError.value = getApiErrorMessage(e, 'We could not send a code right now.')
  }
}

async function verifyOtp() {
  if (!otpCode.value.trim()) return
  const code = otpCode.value.trim()
  busy.value = true
  actionError.value = ''
  try {
    const data = await publicApi<ClientLinkOtpVerifyResult>(API.clientPortal.otpVerify(props.token), {
      auth: false,
      method: 'POST',
      body: { code },
    })
    otpToken.value = data.otp_token
    otpOpen.value = false
    otpCode.value = ''
    devCode.value = ''
    const next = pendingAction.value
    pendingAction.value = null
    if (next) await execute(next)
  } catch (e: any) {
    actionError.value = getApiErrorMessage(e, 'That code was not accepted. Check it and try again.')
  } finally {
    busy.value = false
  }
}

function authOptions() {
  return otpToken.value
    ? { auth: false as const, headers: { 'X-Printy-Otp': otpToken.value } }
    : { auth: false as const }
}

async function execute(kind: ActionKind) {
  busy.value = true
  actionError.value = ''
  actionNote.value = ''
  try {
    if (kind === 'artwork') await submitArtwork()
    else if (kind === 'price') await acknowledge('price')
    else if (kind === 'date') await acknowledge('date')
    else await pay()
  } catch (e: any) {
    if (e?.statusCode === 403) {
      otpToken.value = ''
      pendingAction.value = kind
      await requestOtp()
      actionError.value = 'Your verification expired. Enter the new code to continue.'
    } else {
      actionError.value = getApiErrorMessage(e, 'We could not complete that step. Please try again.')
    }
  } finally {
    busy.value = false
  }
}

async function submitArtwork() {
  const options = authOptions()
  if (pickedFile.value) {
    const form = new FormData()
    form.append('file', pickedFile.value)
    await publicApi(API.clientPortal.artwork(props.token), { ...options, method: 'POST', body: form })
  } else {
    await publicApi(API.clientPortal.artwork(props.token), { ...options, method: 'POST', body: {} })
  }
  artworkDone.value = true
  actionNote.value = 'Artwork received — thank you.'
}

async function acknowledge(kind: 'price' | 'date') {
  await publicApi(API.clientPortal.acknowledge(props.token), {
    ...authOptions(),
    method: 'POST',
    body: { acknowledge: kind },
  })
  if (kind === 'price') priceAck.value = true
  else dateAck.value = true
  actionNote.value = kind === 'price'
    ? "Thanks — we've noted you saw the updated price."
    : "Thanks — we've noted you saw the updated date."
}

async function pay() {
  const result = await publicApi<ClientLinkPaymentResult>(API.clientPortal.payment(props.token), {
    ...authOptions(),
    method: 'POST',
    body: {},
  })
  paymentAttempted.value = true
  const state = normaliseState(result?.state) as PaymentState | ''
  const confirmed = state ? state === 'paid' : isConfirmed(result?.status)
  if (payload.value) {
    payload.value = { ...payload.value, payment_state: state || (confirmed ? 'paid' : 'awaiting_confirmation') }
  }
  actionNote.value = confirmed
    ? 'Payment confirmed.'
    : 'Payment started — awaiting confirmation from M-Pesa.'
}

function formatDate(value: string): string {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })
}

onMounted(load)
</script>
