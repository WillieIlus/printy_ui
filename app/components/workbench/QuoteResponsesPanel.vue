<template>
  <section class="mt-6">
    <div class="flex flex-wrap items-center justify-between gap-2">
      <div class="flex items-center gap-2 font-mono2 text-[10px] uppercase tracking-[0.2em] text-[var(--sub)]">
        <HandCoins :size="12" style="color: var(--accent)" /> Offers from your print partner
      </div>
      <span v-if="store.pending.length" class="rounded-full px-2.5 py-1 font-mono2 text-[9px] font-semibold uppercase tracking-[0.12em]" :style="{ background: 'color-mix(in srgb, var(--accent) 14%, transparent)', color: 'var(--accent)' }">
        {{ store.pending.length }} awaiting you
      </span>
    </div>

    <div v-if="store.loading && !store.hasResponses" class="mt-3 flex items-center gap-2 text-[12.5px] text-[var(--sub)]">
      <Loader2 :size="14" class="animate-spin" :style="{ color: 'var(--accent)' }" /> Loading offers…
    </div>

    <div v-else-if="store.hasResponses" class="mt-3 space-y-3">
      <article
        v-for="response in store.items"
        :key="response.id"
        class="overflow-hidden rounded-2xl border"
        :style="{ borderColor: 'var(--line)', background: 'var(--panel)' }"
      >
        <div class="flex flex-wrap items-center justify-between gap-2 px-4 py-2.5" :style="{ background: 'var(--panel2)' }">
          <div class="flex items-center gap-2">
            <span class="font-mono2 text-[10.5px] font-semibold uppercase tracking-[0.12em]">Offer #{{ response.id }}</span>
            <span class="rounded-full px-2 py-[2px] font-mono2 text-[8.5px] font-semibold uppercase tracking-[0.1em]" :style="statusStyle(response.status)">
              {{ statusLabel(response.status) }}
            </span>
          </div>
          <span v-if="response.price" class="font-disp text-[17px] font-bold" :style="{ color: 'var(--accent)' }">
            {{ currency(response.currency) }}{{ response.price }}
          </span>
        </div>

        <div class="p-4">
          <div class="flex flex-wrap gap-4 font-mono2 text-[9.5px] uppercase tracking-[0.12em] text-[var(--sub)]">
            <span v-if="response.turnaround_days">Turnaround {{ response.turnaround_days }}d</span>
            <span v-else-if="response.turnaround_hours">Turnaround {{ response.turnaround_hours }}h</span>
            <span v-if="response.unread_count" class="inline-flex items-center gap-1" style="color: var(--accent)">
              <Mail :size="10" /> {{ response.unread_count }} new
            </span>
          </div>
          <p v-if="response.latest_message" class="mt-2 text-[12.5px] leading-relaxed text-[var(--sub)]">{{ response.latest_message }}</p>

          <div v-if="canRespond(response)" class="mt-3 flex flex-wrap gap-2">
            <button class="press-key inline-flex items-center gap-1.5 rounded-xl px-4 py-2.5 font-mono2 text-[10.5px] font-semibold uppercase tracking-[0.12em] disabled:opacity-60" :style="{ background: 'var(--accent)', color: 'var(--accentInk)' }" :disabled="store.actingId === response.id" @click="confirmAccept(response)">
              <CheckCheck :size="13" /> Accept
            </button>
            <button class="press-key inline-flex items-center gap-1.5 rounded-xl border px-4 py-2.5 font-mono2 text-[10.5px] font-semibold uppercase tracking-[0.12em]" :style="{ borderColor: 'var(--line)' }" @click="openReply(response)">
              <MessageSquare :size="13" /> Ask a question
            </button>
            <button class="press-key inline-flex items-center gap-1.5 rounded-xl border px-4 py-2.5 font-mono2 text-[10.5px] font-semibold uppercase tracking-[0.12em]" :style="{ borderColor: 'var(--line)', color: '#B4243F' }" @click="openReject(response)">
              <X :size="13" /> Decline
            </button>
          </div>

          <!-- reply form -->
          <div v-if="replyFor === response.id" class="mt-3 rounded-xl border p-3" :style="{ borderColor: 'var(--line)' }">
            <ML>Your message</ML>
            <select v-model="replyType" class="mt-1.5 w-full rounded-lg border bg-transparent px-2.5 py-2 text-[12.5px]" :style="{ borderColor: 'var(--line)' }">
              <option value="client_question">Question</option>
              <option value="client_counter_offer">Counter offer</option>
              <option value="client_change_request">Change request</option>
              <option value="client_file_update">File update</option>
            </select>
            <textarea v-model="replyText" rows="3" class="mt-2 w-full rounded-lg border bg-transparent px-2.5 py-2 text-[12.5px]" :style="{ borderColor: 'var(--line)' }" placeholder="Type your message…" />
            <div class="mt-2 flex items-center gap-2">
              <button class="press-key rounded-xl px-4 py-2 font-mono2 text-[10px] font-semibold uppercase tracking-[0.12em] disabled:opacity-60" :style="{ background: 'var(--accent)', color: 'var(--accentInk)' }" :disabled="!replyText.trim() || store.actingId === response.id" @click="sendReply(response)">
                Send
              </button>
              <button class="font-mono2 text-[10px] uppercase tracking-[0.12em] text-[var(--sub)]" @click="replyFor = null">Cancel</button>
            </div>
          </div>

          <!-- reject form -->
          <div v-if="rejectFor === response.id" class="mt-3 rounded-xl border p-3" :style="{ borderColor: 'var(--line)' }">
            <ML>Why are you declining?</ML>
            <input v-model="rejectReason" class="mt-1.5 w-full rounded-lg border bg-transparent px-2.5 py-2 text-[12.5px]" :style="{ borderColor: 'var(--line)' }" placeholder="e.g. Budget too high" />
            <div class="mt-2 flex items-center gap-2">
              <button class="press-key rounded-xl px-4 py-2 font-mono2 text-[10px] font-semibold uppercase tracking-[0.12em] text-white disabled:opacity-60" style="background: #B4243F" :disabled="!rejectReason.trim() || store.actingId === response.id" @click="sendReject(response)">
                Decline offer
              </button>
              <button class="font-mono2 text-[10px] uppercase tracking-[0.12em] text-[var(--sub)]" @click="rejectFor = null">Cancel</button>
            </div>
          </div>

          <div v-if="messageFor === response.id" class="mt-2 text-[12px] text-[var(--sub)]">{{ message }}</div>
          <div v-if="errorFor === response.id" class="mt-2 text-[12px]" style="color: #B4243F">{{ error }}</div>
        </div>
      </article>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { CheckCheck, HandCoins, Loader2, Mail, MessageSquare, X } from 'lucide-vue-next'
import { useClientResponsesStore } from '~/stores/responses'
import { getApiErrorMessage } from '~/shared/api'
import type { ClientQuoteResponse, ClientReplyType } from '~/shared/types'

const store = useClientResponsesStore()

const replyFor = ref<number | null>(null)
const rejectFor = ref<number | null>(null)
const messageFor = ref<number | null>(null)
const errorFor = ref<number | null>(null)
const replyText = ref('')
const replyType = ref<ClientReplyType>('client_question')
const rejectReason = ref('')
const message = ref('')
const error = ref('')

const STATUS_LABELS: Record<string, string> = {
  sent: 'Offer received',
  revised: 'Revised offer',
  modified: 'Updated offer',
  accepted: 'Accepted',
  rejected: 'Declined',
  expired: 'Expired',
}

function statusLabel(status: string) {
  return STATUS_LABELS[status] ?? status
}

function statusStyle(status: string) {
  const accepted = status === 'accepted'
  return {
    background: accepted ? 'rgba(47,191,113,.14)' : 'color-mix(in srgb, var(--accent) 13%, transparent)',
    color: accepted ? '#1E8E52' : 'var(--accent)',
  }
}

function currency(code: string) {
  return code === 'KES' || !code ? 'KSh ' : `${code} `
}

function canRespond(response: ClientQuoteResponse) {
  return ['sent', 'revised', 'modified'].includes(response.status)
}

function resetForms() {
  replyFor.value = null
  rejectFor.value = null
  messageFor.value = null
  errorFor.value = null
  replyText.value = ''
  rejectReason.value = ''
  message.value = ''
  error.value = ''
}

function openReply(response: ClientQuoteResponse) {
  resetForms()
  replyFor.value = response.id
}

function openReject(response: ClientQuoteResponse) {
  resetForms()
  rejectFor.value = response.id
}

async function confirmAccept(response: ClientQuoteResponse) {
  resetForms()
  try {
    await store.accept(response)
    messageFor.value = response.id
    message.value = 'Offer accepted — your payment step is ready.'
  } catch (e) {
    errorFor.value = response.id
    error.value = getApiErrorMessage(e, 'This offer could not be accepted.')
  }
}

async function sendReply(response: ClientQuoteResponse) {
  errorFor.value = null
  try {
    await store.reply(response, { message_type: replyType.value, message: replyText.value.trim() })
    replyFor.value = null
    replyText.value = ''
    messageFor.value = response.id
    message.value = 'Message sent.'
  } catch (e) {
    errorFor.value = response.id
    error.value = getApiErrorMessage(e, 'Your message could not be sent.')
  }
}

async function sendReject(response: ClientQuoteResponse) {
  errorFor.value = null
  try {
    await store.reject(response, rejectReason.value.trim())
    rejectFor.value = null
    rejectReason.value = ''
    messageFor.value = response.id
    message.value = 'Offer declined.'
  } catch (e) {
    errorFor.value = response.id
    error.value = getApiErrorMessage(e, 'This offer could not be declined.')
  }
}

onMounted(() => {
  store.fetch()
})
</script>
