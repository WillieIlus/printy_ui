<template>
  <DesignWorkspaceSurface>
    <div class="flex flex-col gap-8">
      <DesignWorkspacePageHeader
        index="MS"
        kicker="Messages"
        title="Inbox"
        subtitle="Questions, quotes and proofs in one thread."
        :description="`${store.mode === 'shop' ? 'Shop' : 'Client'} conversations stay here with the full context, so nobody has to repeat themselves.`"
      >
        <template #actions>
          <span v-if="usingSample" class="rounded-full border border-brand/35 bg-mint px-2.5 py-1.5 font-mono text-[10px] font-semibold tracking-[0.1em] text-brand-deep uppercase">
            Sample inbox
          </span>
          <button
            v-if="canSwitchMode"
            type="button"
            class="inline-flex items-center gap-2 rounded-xl border border-line-strong bg-card px-3.5 py-2 font-mono text-[10px] font-semibold tracking-[0.1em] text-ink-2 uppercase transition-colors hover:border-brand hover:text-brand"
            @click="switchMode"
          >
            <Repeat :size="12" /> View {{ store.mode === 'shop' ? 'client' : 'shop' }} inbox
          </button>
          <button
            type="button"
            class="inline-flex items-center gap-2 rounded-xl bg-brand px-3.5 py-2 font-mono text-[10px] font-semibold tracking-[0.1em] text-white uppercase shadow-brand transition-colors hover:bg-brand-deep disabled:opacity-50"
            :disabled="unreadCount === 0"
            @click="markAllRead"
          >
            <CheckCheck :size="12" /> Mark all read
          </button>
        </template>
      </DesignWorkspacePageHeader>

      <DesignLoading v-if="showLoading" label="Loading your inbox…" />

      <DesignAlert v-else-if="store.error" tone="error">
        <p class="max-w-[52ch] leading-relaxed">{{ store.error }}</p>
        <template #actions>
          <button
            type="button"
            class="inline-flex items-center gap-2 rounded-xl bg-brand px-4 py-2 font-mono text-[10px] font-semibold tracking-[0.1em] text-white uppercase shadow-brand transition-colors hover:bg-brand-deep"
            @click="retry"
          >
            <RefreshCw :size="12" /> Try again
          </button>
        </template>
      </DesignAlert>

      <template v-else>
        <div
          v-if="usingSample"
          class="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-brand/30 bg-mint/60 px-4 py-3"
        >
          <p class="text-[13px] leading-relaxed text-brand-deep">
            Your live inbox is empty, so these design sample conversations are shown. They never replace or change real messages.
          </p>
          <NuxtLink to="/app/messages" class="font-mono text-[10px] font-semibold tracking-[0.1em] text-brand uppercase">
            Refresh live inbox
          </NuxtLink>
        </div>

        <div class="grid items-start gap-4 lg:grid-cols-[minmax(0,360px)_1fr]">
          <div class="flex flex-col gap-2">
            <button
              v-for="thread in threads"
              :key="thread.key"
              type="button"
              class="w-full rounded-xl border p-4 text-left transition-colors"
              :class="thread.key === selectedKey ? 'border-brand bg-card shadow-card' : 'border-line bg-card hover:border-line-strong'"
              @click="selectThread(thread)"
            >
              <div class="flex items-center gap-2">
                <span v-if="thread.unread" class="h-2 w-2 shrink-0 rounded-full bg-brand" />
                <span class="truncate text-[13px] font-semibold text-ink">{{ thread.subject }}</span>
                <span class="ml-auto shrink-0 font-mono text-[9px] tracking-[0.08em] text-ink-3 uppercase">
                  {{ thread.timeLabel }}
                </span>
              </div>
              <div class="mt-1 truncate text-[11.5px] text-ink-2">{{ thread.preview }}</div>
              <div class="mt-1.5 flex items-center gap-2 font-mono text-[9px] tracking-[0.1em] text-ink-3 uppercase">
                <span>{{ thread.name }} · {{ thread.roleLabel }}</span>
                <span v-if="thread.attachments.length" class="inline-flex items-center gap-1 text-brand">
                  <Paperclip :size="10" /> {{ thread.attachments.length }}
                </span>
              </div>
            </button>
          </div>

          <div
            v-if="activeThread"
            class="rounded-2xl border border-line bg-card p-5 shadow-card lg:sticky lg:top-24 lg:self-start"
          >
            <div class="flex flex-wrap items-start justify-between gap-3">
              <div class="min-w-0">
                <h2 class="text-[18px] font-bold tracking-tight text-ink">{{ activeThread.subject }}</h2>
                <div class="mt-1 font-mono text-[9.5px] tracking-[0.1em] text-ink-3 uppercase">
                  {{ activeThread.name }} · {{ activeThread.roleLabel }} · {{ activeThread.timeLabel }}
                </div>
              </div>
              <span
                v-if="activeThread.sample"
                class="rounded-full border border-brand/35 bg-mint px-2.5 py-1 font-mono text-[9px] font-semibold tracking-[0.1em] text-brand-deep uppercase"
              >
                Sample
              </span>
              <span
                v-else-if="activeThread.typeLabel"
                class="rounded-full border border-line-strong bg-paper-2 px-2.5 py-1 font-mono text-[9px] tracking-[0.1em] text-ink-2 uppercase"
              >
                {{ activeThread.typeLabel }}
              </span>
            </div>

            <p class="mt-4 whitespace-pre-line text-[13px] leading-relaxed text-ink-2">{{ activeThread.body }}</p>

            <div v-if="activeThread.attachments.length" class="mt-4 space-y-1.5">
              <p class="font-mono text-[10px] font-semibold tracking-[0.14em] text-ink-3 uppercase">Attachments</p>
              <div
                v-for="attachment in activeThread.attachments"
                :key="attachment.id"
                class="flex items-center gap-2 rounded-lg bg-paper-2 px-3 py-2 text-[12px] text-ink-2"
              >
                <Paperclip :size="12" class="text-brand" /> {{ attachment.name }}
              </div>
            </div>

            <NuxtLink
              v-if="activeThread.actionUrl"
              :to="activeThread.actionUrl"
              class="mt-5 inline-flex items-center gap-2 rounded-xl bg-brand px-4 py-2.5 font-mono text-[10px] font-semibold tracking-[0.1em] text-white uppercase shadow-brand transition-colors hover:bg-brand-deep"
            >
              {{ activeThread.actionLabel || 'Open context' }} <ArrowRight :size="12" />
            </NuxtLink>
          </div>

          <div
            v-else
            class="hidden items-center justify-center rounded-2xl border border-line bg-card py-16 text-ink-3 lg:flex"
          >
            <span class="font-mono text-[10px] tracking-[0.16em] uppercase">Select a message</span>
          </div>
        </div>
      </template>

      <NuxtLink
        :to="backRoute"
        class="inline-flex w-fit items-center gap-1.5 font-mono text-[10px] font-semibold tracking-[0.14em] text-ink-3 uppercase transition-colors hover:text-brand"
      >
        <ArrowLeft :size="12" /> Back to dashboard
      </NuxtLink>
    </div>
  </DesignWorkspaceSurface>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import {
  ArrowLeft, ArrowRight, CheckCheck, Paperclip, RefreshCw, Repeat,
} from 'lucide-vue-next'
import DesignWorkspaceSurface from '~/components/design/workspace/WorkspaceSurface.vue'
import DesignWorkspacePageHeader from '~/components/design/workspace/WorkspacePageHeader.vue'
import DesignAlert from '~/components/design/ui/Alert.vue'
import DesignLoading from '~/components/design/ui/Loading.vue'
import { useDesignComms } from '~/composables/design/useDesignComms'
import { useAuthStore } from '~/stores/auth'
import { useMessagesStore, startMessagePolling, type InboxMode } from '~/stores/messages'
import type { InboxMessage } from '~/shared/types'
import { designWorkspaceRoleFromUser } from '~/utils/design/nav'

type ThreadView = {
  key: string
  id: string
  name: string
  roleLabel: string
  subject: string
  preview: string
  timeLabel: string
  unread: boolean
  body: string
  attachments: { id: string; name: string }[]
  actionLabel?: string
  actionUrl?: string
  typeLabel: string
  sample: boolean
  real?: InboxMessage
}

const auth = useAuthStore()
const store = useMessagesStore()
const comms = useDesignComms()

const selectedKey = ref('')
const started = ref(false)
let stopPolling: (() => void) | null = null

const role = computed(() => designWorkspaceRoleFromUser(auth.user) ?? 'client')
const canSwitchMode = computed(() => auth.canAccessProductionDashboard && auth.canAccessClientDashboard)
const backRoute = computed(() => {
  if (store.mode === 'shop') return '/app/printer'
  if (auth.dashboardRole === 'partner') return '/app/manager'
  if (auth.dashboardRole === 'super_admin') return '/app/admin'
  return '/app/buyer'
})

const showLoading = computed(() => !started.value || (store.loading && !store.hasMessages))
const usingSample = computed(() => (
  started.value
  && !store.loading
  && !store.error
  && !store.hasMessages
))

function initialMode(): InboxMode {
  return auth.dashboardRole === 'production' ? 'shop' : 'client'
}

function counterparty(message: InboxMessage): string {
  if (store.mode === 'shop') return message.client_name || 'Client'
  return message.shop_name || 'Print partner'
}

function when(message: InboxMessage): string {
  const raw = message.sent_at || message.created_at
  if (!raw) return ''
  const date = new Date(raw)
  if (Number.isNaN(date.getTime())) return ''
  return date.toLocaleDateString(undefined, { day: 'numeric', month: 'short' })
}

const threads = computed<ThreadView[]>(() => {
  if (usingSample.value) {
    return comms.sampleThreadsFor(role.value).map((thread) => ({
      key: thread.id,
      id: thread.id,
      name: thread.name,
      roleLabel: thread.role,
      subject: thread.subject,
      preview: thread.preview,
      timeLabel: thread.time,
      unread: thread.unread,
      body: thread.body,
      attachments: thread.attachments.map((name, index) => ({ id: `${thread.id}-${index}`, name })),
      actionLabel: thread.actionLabel,
      actionUrl: thread.actionUrl,
      typeLabel: '',
      sample: true,
    }))
  }

  return store.items.map((message) => ({
    key: `real-${message.id}`,
    id: String(message.id),
    name: counterparty(message),
    roleLabel: store.mode === 'shop' ? 'Client' : 'Print partner',
    subject: message.subject || 'Message',
    preview: message.snippet,
    timeLabel: when(message),
    unread: !message.read_at,
    body: message.body,
    attachments: message.attachments_summary.map((attachment) => ({
      id: String(attachment.id),
      name: attachment.name,
    })),
    actionLabel: 'Open quote',
    actionUrl: message.action_url || undefined,
    typeLabel: message.message_type || 'message',
    sample: false,
    real: message,
  }))
})

const activeThread = computed(() => threads.value.find((thread) => thread.key === selectedKey.value) ?? null)
const unreadCount = computed(() => usingSample.value
  ? threads.value.filter((thread) => thread.unread).length
  : store.unreadCount)

async function selectThread(thread: ThreadView) {
  selectedKey.value = thread.key
  if (thread.sample) {
    comms.markSampleRead(thread.id)
    return
  }
  if (thread.real) {
    await store.markRead(thread.real)
  }
}

async function markAllRead() {
  if (usingSample.value) {
    comms.markAllSamplesRead(role.value)
    return
  }
  await store.markAllRead()
}

async function switchMode() {
  const next: InboxMode = store.mode === 'shop' ? 'client' : 'shop'
  selectedKey.value = ''
  started.value = true
  await store.fetch(next)
}

async function retry() {
  started.value = true
  await store.fetch()
}

async function loadInbox() {
  started.value = true
  await store.fetch(initialMode())
  if (usingSample.value) {
    const first = threads.value[0]
    if (first) selectedKey.value = first.key
  }
}

onMounted(async () => {
  await loadInbox()
  stopPolling = startMessagePolling(store)
})

onBeforeUnmount(() => {
  stopPolling?.()
})
</script>
