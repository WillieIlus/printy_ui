<template>
  <div
    v-if="open"
    class="fixed inset-0 z-[80] flex items-end justify-center bg-black/60 p-0 backdrop-blur-sm sm:items-center sm:p-4"
    @click="state === 'paid' ? emit('close') : undefined"
  >
    <div
      class="w-full max-w-[420px] overflow-hidden rounded-t-3xl border sm:rounded-3xl"
      :style="{ borderColor: 'var(--line)', background: 'var(--panel)' }"
      @click.stop
    >
      <!-- header -->
      <div
        class="flex items-start justify-between gap-3 p-5"
        :style="{ background: 'color-mix(in srgb, var(--accent) 8%, transparent)' }"
      >
        <div class="flex items-center gap-3">
          <span class="flex h-10 w-10 items-center justify-center rounded-2xl" :style="{ background: 'var(--accent)' }">
            <Smartphone :size="18" style="color: var(--accentInk)" />
          </span>
          <div>
            <div class="font-disp text-[16px] font-bold leading-tight">Lipa na M-Pesa</div>
            <div class="font-mono2 text-[9px] uppercase tracking-[0.16em] text-[var(--sub)]">STK push · {{ reference }}</div>
          </div>
        </div>
        <button v-if="state !== 'paid'" class="rounded-full p-1.5 hover:bg-[var(--panel2)]" style="color: var(--sub)" @click="emit('close')">
          <X :size="16" />
        </button>
      </div>

      <!-- amount -->
      <div class="border-b px-5 py-4 text-center" :style="{ borderColor: 'var(--line)' }">
        <ML>Amount to pay</ML>
        <div class="mt-1 font-disp text-[34px] font-bold leading-none" style="color: var(--accent)">{{ ksh(amount) }}</div>
        <div class="mt-2 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-mono2 text-[9px] uppercase tracking-[0.12em]" :style="{ background: 'var(--panel2)', color: 'var(--sub)' }">
          <Lock :size="9" /> held in custody until delivery
        </div>
      </div>

      <div class="p-5">
        <!-- phone entry -->
        <div v-if="!state">
          <ML>M-Pesa phone number</ML>
          <div class="mt-2 flex items-center gap-2.5 rounded-xl border px-3.5 py-3 focus-within:border-[var(--accent)]" :style="{ borderColor: 'var(--line)' }">
            <Phone :size="15" style="color: var(--sub)" class="shrink-0" />
            <input
              v-model="phone"
              autofocus
              inputmode="tel"
              placeholder="0712 345 678"
              class="w-full bg-transparent font-mono2 text-[15px] tracking-[0.04em] outline-none placeholder:text-[var(--sub)] placeholder:opacity-60"
              @keydown.enter="push"
            />
          </div>
          <p class="mt-2 text-[11px] leading-relaxed text-[var(--sub)]">
            We accept <span class="font-mono2">07…</span>, <span class="font-mono2">2547…</span> or <span class="font-mono2">+2547…</span>. You'll get a prompt on your phone — no PIN is entered on this site.
          </p>

          <button
            class="press-key mt-4 flex w-full items-center justify-center gap-2 rounded-2xl py-3.5 font-mono2 text-[12px] font-bold uppercase tracking-[0.16em] disabled:opacity-40"
            :style="{ background: 'var(--accent)', color: 'var(--accentInk)' }"
            :disabled="!valid"
            @click="push"
          >
            <Zap :size="15" /> Send M-Pesa request
          </button>
        </div>

        <!-- state machine -->
        <div v-else class="text-center">
          <div class="mx-auto flex h-14 w-14 items-center justify-center rounded-full" :style="{ background: `${STATE_META[state].color}1F` }">
            <Loader2 v-if="state === 'initiated' || state === 'pending'" :size="24" class="animate-spin" :style="{ color: STATE_META[state].color }" />
            <Check v-else-if="state === 'paid'" :size="26" :stroke-width="3" :style="{ color: STATE_META[state].color }" />
            <X v-else :size="24" :stroke-width="3" :style="{ color: STATE_META[state].color }" />
          </div>

          <div class="mt-3 font-disp text-[19px] font-bold" :style="{ color: STATE_META[state].color }">
            {{ STATE_META[state].label }}
          </div>
          <p class="mx-auto mt-1.5 max-w-[34ch] text-[12.5px] leading-relaxed text-[var(--sub)]">
            {{ state === 'error' ? errorNote : STATE_META[state].note }}
          </p>

          <div v-if="state === 'pending'">
            <div class="mt-4 flex items-center justify-center gap-2 font-mono2 text-[10px] uppercase tracking-[0.14em] text-[var(--sub)]">
              <RefreshCw :size="11" class="animate-spin" /> waiting for callback · {{ seconds }}s
            </div>
            <div class="mt-1 font-mono2 text-[9px] uppercase tracking-[0.1em] text-[var(--sub)] opacity-70">
              to {{ normalizeMsisdn(phone) }}
            </div>
          </div>

          <div v-if="receipt" class="mt-4 rounded-xl px-3 py-2.5 font-mono2 text-[10.5px] tracking-[0.06em]" :style="{ background: 'var(--panel2)' }">
            receipt <span class="font-semibold" style="color: var(--accent)">{{ receipt }}</span>
          </div>

          <button
            v-if="state === 'failed' || state === 'cancelled' || state === 'error'"
            class="press-key mt-4 w-full rounded-2xl py-3 font-mono2 text-[11px] font-bold uppercase tracking-[0.14em]"
            :style="{ background: 'var(--accent)', color: 'var(--accentInk)' }"
            @click="retry"
          >
            Try again
          </button>
        </div>

        <div class="mt-5 flex items-start gap-2 border-t pt-4" :style="{ borderColor: 'var(--line)' }">
          <ShieldCheck :size="13" class="mt-0.5 shrink-0" style="color: var(--accent)" />
          <p class="text-[10.5px] leading-relaxed text-[var(--sub)]">
            Printy never marks a job paid from the prompt alone — only Safaricom's confirmation does.
            Your money stays in custody until you confirm delivery.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import {
  Check, Loader2, Lock, Phone, RefreshCw, ShieldCheck, Smartphone, X, Zap,
} from 'lucide-vue-next'
import { useMpesaStore } from '~/stores/mpesa'

type PayState = 'initiated' | 'pending' | 'paid' | 'failed' | 'cancelled' | 'needs_review' | 'error'

const STATE_META: Record<PayState, { label: string; color: string; note: string }> = {
  initiated: { label: 'Initiating', color: '#B45309', note: 'Preparing the request for Safaricom' },
  pending: { label: 'Check your phone', color: '#B45309', note: 'An M-Pesa prompt has been sent. Enter your PIN to authorise.' },
  paid: { label: 'Payment confirmed', color: '#0E7A45', note: 'Funds are now held in Printy Custody.' },
  failed: { label: 'Payment failed', color: '#EF4444', note: 'M-Pesa could not complete this transaction.' },
  cancelled: { label: 'Cancelled', color: '#EF4444', note: 'The request was cancelled or timed out.' },
  needs_review: { label: 'Needs review', color: '#C81E44', note: "The amount received didn't match the quote. Printy ops is checking." },
  error: { label: "Couldn't reach M-Pesa", color: '#EF4444', note: 'No money was taken. Please try again.' },
}

function normalizeMsisdn(raw: string): string {
  const digits = (raw || '').replace(/\D/g, '')
  const national = digits.startsWith('254') ? digits.slice(3) : digits.startsWith('0') ? digits.slice(1) : digits
  return national.length === 9 ? `254${national}` : ''
}

const props = defineProps<{
  open: boolean
  amount: number
  reference: string
  managedJobId?: number | null
}>()

const emit = defineEmits<{
  close: []
  paid: []
}>()

const mpesa = useMpesaStore()

const state = computed(() => mpesa.phase)
const seconds = computed(() => mpesa.seconds)
const receipt = computed(() => mpesa.receipt)
const errorNote = computed(() => mpesa.errorMessage || STATE_META.error.note)

const phone = ref('')
let paidFired = false

watch(
  () => props.open,
  (open) => {
    if (open) {
      mpesa.reset()
      paidFired = false
      phone.value = ''
    } else {
      mpesa.stop()
    }
  },
)

watch(
  () => mpesa.phase,
  (phase) => {
    if (phase === 'pending') {
      mpesa.startTicker()
      mpesa.startPolling()
    } else if (phase === 'initiated' || phase == null) {
      mpesa.stop()
    }
    if (phase === 'paid' && !paidFired) {
      paidFired = true
      emit('paid')
    }
  },
)

onBeforeUnmount(() => {
  mpesa.stop()
})

const valid = computed(() => normalizeMsisdn(phone.value) !== '')

const push = () => {
  if (!valid.value) return
  void mpesa.initiate(normalizeMsisdn(phone.value), props.amount, props.managedJobId ?? null)
}

const retry = () => {
  mpesa.reset()
}

const ksh = (n: number) => 'KSh ' + n.toLocaleString('en-KE', { minimumFractionDigits: 2 })
</script>