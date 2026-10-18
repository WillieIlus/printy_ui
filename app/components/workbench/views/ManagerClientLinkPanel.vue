<template>
  <div class="rounded-2xl border p-4" :style="{ borderColor: 'var(--line)', background: 'var(--panel)' }" data-test="client-link-panel">
    <div class="flex flex-wrap items-center justify-between gap-2">
      <div class="flex items-center gap-2">
        <Link2 :size="13" style="color: var(--accent)" />
        <ML>Client link</ML>
      </div>
      <div class="flex items-center gap-2">
        <span
          class="rounded-full px-2.5 py-1 font-mono2 text-[9px] uppercase tracking-[0.12em]"
          :style="statusStyle"
          data-test="client-link-status"
        >
          {{ statusLabel }}
        </span>
        <button
          class="press-key inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono2 text-[9px] uppercase tracking-[0.12em] disabled:opacity-50"
          :style="{ borderColor: 'var(--line)', color: 'var(--sub)' }"
          :disabled="loading"
          data-test="client-link-refresh"
          @click="refresh"
        >
          <RefreshCw :size="10" :class="{ 'animate-spin': loading }" /> refresh
        </button>
      </div>
    </div>

    <p class="mt-1.5 text-[11.5px] leading-relaxed text-[var(--sub)]">
      One signed, single-job link the client opens with no account. It expires automatically and
      can be revoked. Sending again replaces the old link.
    </p>

    <div v-if="status" class="mt-3 space-y-1.5 rounded-xl px-3 py-2.5" :style="{ background: 'var(--panel2)' }">
      <div class="flex items-center justify-between gap-3 text-[11.5px]">
        <span class="font-mono2 text-[9px] uppercase tracking-[0.12em] text-[var(--sub)]">Delivery</span>
        <span class="text-[var(--ink)]" data-test="client-link-delivery">{{ deliveryLabel }}</span>
      </div>
      <div v-if="status.expires_at" class="flex items-center justify-between gap-3 text-[11.5px]">
        <span class="font-mono2 text-[9px] uppercase tracking-[0.12em] text-[var(--sub)]">Expires</span>
        <span class="text-[var(--ink)]" data-test="client-link-expiry">{{ formatDate(status.expires_at) }}</span>
      </div>
      <div v-if="status.has_link" class="flex items-center justify-between gap-3 text-[11.5px]">
        <span class="font-mono2 text-[9px] uppercase tracking-[0.12em] text-[var(--sub)]">Opened</span>
        <span class="text-[var(--ink)]" data-test="client-link-views">
          {{ status.view_count }} {{ status.view_count === 1 ? 'time' : 'times' }}
          <template v-if="status.viewed_at"> · {{ formatDateTime(status.viewed_at) }}</template>
        </span>
      </div>
    </div>

    <div v-if="status?.url" class="mt-3 flex flex-wrap gap-2">
      <input :value="status.url" readonly class="min-w-[200px] flex-1 rounded-xl border px-3 py-2.5 text-[12px]" :style="fieldStyle" data-test="client-link-url" />
      <button
        class="press-key inline-flex items-center gap-1.5 rounded-xl px-3 py-2.5 font-mono2 text-[9.5px] font-bold uppercase tracking-[0.12em] text-white"
        :style="{ background: 'var(--accent)' }"
        @click="copyUrl(String(status.url))"
      >
        <Check v-if="copied" :size="11" /> <Copy v-else :size="11" />
        {{ copied ? 'Copied' : 'Copy' }}
      </button>
    </div>

    <p v-if="error" class="mt-3 rounded-xl px-3 py-2 text-[12px]" :style="{ background: 'rgba(200,30,68,.1)', color: '#C81E44' }" data-test="client-link-error">
      {{ error }}
    </p>
    <p v-if="note" class="mt-3 rounded-xl px-3 py-2 text-[12px]" :style="{ background: 'rgba(14,122,69,.1)', color: '#0E7A45' }" data-test="client-link-note">
      {{ note }}
    </p>

    <div class="mt-3 flex flex-wrap gap-2">
      <button
        class="press-key inline-flex items-center gap-2 rounded-xl px-4 py-2.5 font-mono2 text-[10px] font-bold uppercase tracking-[0.12em] disabled:opacity-50"
        :style="{ background: 'var(--accent)', color: 'var(--accentInk)' }"
        :disabled="busy"
        data-test="client-link-send"
        @click="sendOrResend"
      >
        <Loader2 v-if="busy" :size="12" class="animate-spin" /> <Send v-else :size="12" />
        {{ hasLink ? 'Resend link' : 'Send client link' }}
      </button>
      <button
        v-if="status?.is_active && status.link_id"
        class="press-key inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 font-mono2 text-[10px] font-bold uppercase tracking-[0.12em] disabled:opacity-50"
        :style="{ borderColor: 'rgba(200,30,68,.5)', color: '#C81E44' }"
        :disabled="busy"
        data-test="client-link-revoke"
        @click="revoke"
      >
        <Ban :size="12" /> Revoke
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { Ban, Link2, Loader2, RefreshCw } from 'lucide-vue-next'
import { useManagerStore } from '~/stores/manager'
import type { ClientLinkStatus, ManagerClientLinkStatus } from '~/shared/types'

const props = defineProps<{ quoteRequestId: number }>()

const m = useManagerStore()

const status = ref<ManagerClientLinkStatus | null>(null)
const loading = ref(false)
const busy = ref(false)
const error = ref('')
const note = ref('')
const copied = ref('')

const LABELS: Record<ClientLinkStatus, string> = {
  none: 'No link yet',
  sent: 'Sent',
  viewed: 'Viewed',
  expired: 'Expired',
  revoked: 'Revoked',
  replaced: 'Replaced',
}

const STYLES: Record<ClientLinkStatus, { background: string; color: string }> = {
  none: { background: 'var(--panel2)', color: 'var(--sub)' },
  sent: { background: 'rgba(47,191,113,.14)', color: '#0E7A45' },
  viewed: { background: 'rgba(47,191,113,.2)', color: '#0E7A45' },
  expired: { background: 'rgba(214,158,46,.16)', color: '#8A6100' },
  revoked: { background: 'rgba(200,30,68,.12)', color: '#C81E44' },
  replaced: { background: 'var(--panel2)', color: 'var(--sub)' },
}

const current = computed<ClientLinkStatus>(() => status.value?.status ?? 'none')
const statusLabel = computed(() => LABELS[current.value])
const statusStyle = computed(() => STYLES[current.value])
const hasLink = computed(() => Boolean(status.value?.has_link))

const deliveryLabel = computed(() => {
  const delivery = status.value?.delivery
  if (!delivery) return '—'
  if (delivery.status === 'skipped_opt_out') return 'Skipped (client opted out)'
  const channel = delivery.channel ? ` via ${delivery.channel}` : ''
  return `${delivery.status}${channel}`
})

async function refresh() {
  if (!props.quoteRequestId) return
  loading.value = true
  try {
    status.value = await m.fetchClientLinkStatus(props.quoteRequestId)
  } finally {
    loading.value = false
  }
}

async function sendOrResend() {
  error.value = ''
  note.value = ''
  busy.value = true
  try {
    const result = await m.createClientLink(props.quoteRequestId)
    if (!result) {
      error.value = m.error || "We couldn't create the client link."
      return
    }
    note.value = status.value?.has_link ? 'New link sent — the previous one no longer works.' : 'Client link sent.'
    await refresh()
  } finally {
    busy.value = false
  }
}

async function revoke() {
  const linkId = status.value?.link_id
  if (!linkId) return
  error.value = ''
  note.value = ''
  busy.value = true
  try {
    const result = await m.revokeClientLink(linkId)
    if (!result) {
      error.value = m.error || "We couldn't revoke the client link."
      return
    }
    note.value = 'Link revoked — the client can no longer open it.'
    await refresh()
  } finally {
    busy.value = false
  }
}

async function copyUrl(url: string) {
  if (!url) return
  try {
    await navigator.clipboard.writeText(url)
    copied.value = url
  } catch {
    error.value = 'Copy failed — select the link and copy it manually.'
  }
}

function formatDate(value: string | null): string {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })
}

function formatDateTime(value: string | null): string {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleString(undefined, { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
}

watch(() => props.quoteRequestId, refresh, { immediate: true })

const fieldStyle = { borderColor: 'var(--line)', background: 'var(--panel2)', color: 'var(--ink)' }
</script>
