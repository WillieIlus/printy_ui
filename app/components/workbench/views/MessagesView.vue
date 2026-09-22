<template>
  <div class="mx-auto w-full max-w-[1080px] px-4 pb-28 pt-8 sm:px-6">
    <!-- header -->
    <div class="flex flex-wrap items-start justify-between gap-4">
      <div>
        <NuxtLink
          :to="backRoute"
          class="mb-3 inline-flex items-center gap-1.5 font-mono2 text-[10px] uppercase tracking-[0.16em] text-[var(--sub)] transition-colors hover:text-[var(--accent)]"
        >
          <ArrowLeft :size="12" /> Back to dashboard
        </NuxtLink>
        <div class="flex items-center gap-2 font-mono2 text-[10px] uppercase tracking-[0.22em] text-[var(--sub)]">
          <Inbox :size="12" style="color: var(--accent)" /> {{ store.mode === 'shop' ? 'Shop' : 'Client' }} inbox
        </div>
        <h1 class="mt-2 font-disp text-[30px] font-bold leading-tight tracking-tight sm:text-[38px]">
          Messages<span class="block text-[var(--sub)]">Questions, quotes and proofs in one thread.</span>
        </h1>
      </div>

      <div class="flex items-center gap-2">
        <button
          v-if="canSwitchMode"
          @click="switchMode"
          class="press-key inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 font-mono2 text-[10px] font-semibold uppercase tracking-[0.12em]"
          :style="{ borderColor: 'var(--line)', color: 'var(--sub)' }"
        >
          <Repeat :size="12" /> View {{ store.mode === 'shop' ? 'client' : 'shop' }} inbox
        </button>
        <button
          @click="store.markAllRead()"
          :disabled="store.unreadCount === 0"
          class="press-key inline-flex items-center gap-2 rounded-xl px-4 py-2.5 font-mono2 text-[10px] font-semibold uppercase tracking-[0.12em] disabled:opacity-50"
          :style="{ background: 'var(--accent)', color: 'var(--accentInk)' }"
        >
          <CheckCheck :size="12" /> Mark all read
        </button>
      </div>
    </div>

    <!-- loading / error -->
    <div v-if="store.loading && !store.hasMessages" class="mt-16 flex flex-col items-center gap-3 text-[var(--sub)]">
      <Loader2 :size="22" class="animate-spin" :style="{ color: 'var(--accent)' }" />
      <span class="font-mono2 text-[10px] uppercase tracking-[0.18em]">Loading your inbox…</span>
    </div>
    <div
      v-else-if="store.error"
      class="mt-16 flex flex-col items-center gap-3 rounded-2xl border p-8 text-center"
      :style="{ borderColor: 'var(--line)', background: 'var(--panel)' }"
    >
      <AlertTriangle :size="22" style="color: #C81E44" />
      <p class="max-w-[44ch] text-[13px] leading-relaxed text-[var(--sub)]">{{ store.error }}</p>
      <button
        @click="store.fetch()"
        class="press-key mt-1 inline-flex items-center gap-2 rounded-xl px-4 py-2 font-mono2 text-[10px] font-semibold uppercase tracking-[0.14em]"
        :style="{ background: 'var(--accent)', color: 'var(--accentInk)' }"
      >
        <RefreshCw :size="12" /> Try again
      </button>
    </div>

    <!-- empty -->
    <div
      v-else-if="!store.hasMessages"
      class="mt-16 flex flex-col items-center gap-3 rounded-2xl border p-10 text-center"
      :style="{ borderColor: 'var(--line)', background: 'var(--panel)' }"
    >
      <Inbox :size="26" style="color: var(--sub)" />
      <p class="font-disp text-[15px] font-bold">No messages yet</p>
      <p class="max-w-[46ch] text-[12.5px] leading-relaxed text-[var(--sub)]">
        Questions and quote updates from your {{ store.mode === 'shop' ? 'clients' : 'print partners' }} will land here.
      </p>
    </div>

    <!-- inbox -->
    <div v-else class="mt-6 grid gap-4 lg:grid-cols-[minmax(0,360px)_1fr]">
      <div class="space-y-2">
        <button
          v-for="message in store.items"
          :key="message.id"
          @click="select(message)"
          class="press-key w-full rounded-2xl border p-3.5 text-left transition-colors"
          :style="{
            borderColor: selected?.id === message.id ? 'var(--accent)' : 'var(--line)',
            background: 'var(--panel)',
          }"
        >
          <div class="flex items-center gap-2">
            <span
              v-if="!message.read_at"
              class="h-2 w-2 shrink-0 rounded-full"
              style="background: var(--accent)"
            />
            <span class="truncate text-[13px] font-semibold">{{ message.subject || 'Message' }}</span>
            <span class="ml-auto shrink-0 font-mono2 text-[9px] uppercase tracking-[0.1em] text-[var(--sub)]">
              {{ when(message) }}
            </span>
          </div>
          <div class="mt-1 truncate text-[11.5px] text-[var(--sub)]">{{ message.snippet }}</div>
          <div class="mt-1.5 flex items-center gap-2 font-mono2 text-[9px] uppercase tracking-[0.1em] text-[var(--sub)]">
            <span>{{ counterparty(message) }}</span>
            <span v-if="message.has_attachment" class="inline-flex items-center gap-1" style="color: var(--accent)">
              <Paperclip :size="10" /> {{ message.attachments_summary.length }}
            </span>
          </div>
        </button>
      </div>

      <div
        v-if="selected"
        class="rounded-3xl border p-5 lg:sticky lg:top-24 lg:self-start"
        :style="{ borderColor: 'var(--line)', background: 'var(--panel)' }"
      >
        <div class="flex items-start justify-between gap-3">
          <div>
            <h2 class="font-disp text-[18px] font-bold tracking-tight">{{ selected.subject || 'Message' }}</h2>
            <div class="mt-1 font-mono2 text-[9.5px] uppercase tracking-[0.12em] text-[var(--sub)]">
              {{ counterparty(selected) }} · {{ when(selected) }}
            </div>
          </div>
          <span
            class="rounded-full px-2.5 py-1 font-mono2 text-[9px] uppercase tracking-[0.1em]"
            :style="{ background: 'var(--panel2)', color: 'var(--sub)' }"
          >
            {{ selected.message_type || 'message' }}
          </span>
        </div>

        <p class="mt-4 whitespace-pre-line text-[13px] leading-relaxed">{{ selected.body }}</p>

        <div v-if="selected.attachments_summary.length" class="mt-4 space-y-1.5">
          <ML>Attachments</ML>
          <div
            v-for="att in selected.attachments_summary"
            :key="att.id"
            class="flex items-center gap-2 rounded-lg px-3 py-2 text-[12px]"
            :style="{ background: 'var(--panel2)' }"
          >
            <Paperclip :size="12" style="color: var(--accent)" /> {{ att.name }}
          </div>
        </div>

        <NuxtLink
          v-if="selected.action_url"
          :to="selected.action_url"
          class="press-key mt-5 inline-flex items-center gap-2 rounded-xl px-4 py-2.5 font-mono2 text-[10px] font-semibold uppercase tracking-[0.12em]"
          :style="{ background: 'var(--accent)', color: 'var(--accentInk)' }"
        >
          Open quote <ArrowRight :size="12" />
        </NuxtLink>
      </div>

      <div
        v-else
        class="hidden items-center justify-center rounded-3xl border text-[var(--sub)] lg:flex"
        :style="{ borderColor: 'var(--line)', background: 'var(--panel)' }"
      >
        <span class="font-mono2 text-[10px] uppercase tracking-[0.16em]">Select a message</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import {
  AlertTriangle, ArrowLeft, ArrowRight, CheckCheck, Inbox, Loader2, Paperclip, RefreshCw, Repeat,
} from 'lucide-vue-next'
import { useAuthStore } from '~/stores/auth'
import { useMessagesStore, startMessagePolling, type InboxMode } from '~/stores/messages'
import type { InboxMessage } from '~/shared/types'

const auth = useAuthStore()
const store = useMessagesStore()

const selected = ref<InboxMessage | null>(null)
let stopPolling: (() => void) | null = null

const canSwitchMode = computed(() => auth.canAccessProductionDashboard && auth.canAccessClientDashboard)

function initialMode(): InboxMode {
  return auth.dashboardRole === 'production' ? 'shop' : 'client'
}

const backRoute = computed(() => (store.mode === 'shop' ? '/app/printer' : '/app/buyer'))

function counterparty(message: InboxMessage) {
  if (store.mode === 'shop') return message.client_name || 'Client'
  return message.shop_name || 'Print partner'
}

function when(message: InboxMessage) {
  const raw = message.sent_at || message.created_at
  if (!raw) return ''
  const date = new Date(raw)
  if (Number.isNaN(date.getTime())) return ''
  return date.toLocaleDateString(undefined, { day: 'numeric', month: 'short' })
}

async function select(message: InboxMessage) {
  selected.value = message
  await store.markRead(message)
}

async function switchMode() {
  const next: InboxMode = store.mode === 'shop' ? 'client' : 'shop'
  selected.value = null
  await store.fetch(next)
}

onMounted(async () => {
  await store.fetch(initialMode())
  stopPolling = startMessagePolling(store)
})

onBeforeUnmount(() => {
  stopPolling?.()
})
</script>
