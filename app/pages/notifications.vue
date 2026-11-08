<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import {
  ArrowRight, BadgeCheck, Ban, Bell, CircleSlash, CreditCard, FileText, ImageUp,
  Inbox, Loader2, MessageSquare, Package, Printer, Send,
} from 'lucide-vue-next'
import DesignWorkspaceSurface from '~/components/design/workspace/WorkspaceSurface.vue'
import DesignWorkspacePageHeader from '~/components/design/workspace/WorkspacePageHeader.vue'
import { useDesignComms } from '~/composables/design/useDesignComms'
import type { DesignNotice, DesignNoticeTone } from '~/composables/design/useDesignComms'
import { useAuthStore } from '~/stores/auth'
import { useNotificationsStore, type NotificationFilter } from '~/stores/notifications'
import { groupByEntity, relativeTime } from '~/shared/notification'
import type { PrintyNotification } from '~/shared/types'
import { designWorkspaceRoleFromUser } from '~/utils/design/nav'

definePageMeta({ layout: 'design-workspace', middleware: 'auth' })

const auth = useAuthStore()
const notifications = useNotificationsStore()
const comms = useDesignComms()

const sampleMode = ref(false)
const initialised = ref(false)

const tabs: { value: NotificationFilter, label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'unread', label: 'Unread' },
  { value: 'action_needed', label: 'Action needed' },
]

const ICONS: Record<string, unknown> = {
  quote_sent: FileText,
  quote_revised: FileText,
  quote_accepted: BadgeCheck,
  quote_request_submitted: Inbox,
  quote_request_sent: Send,
  shop_question_asked: MessageSquare,
  buyer_clarification_sent: MessageSquare,
  payment_confirmed: CreditCard,
  artwork_required: ImageUp,
  job_ready_to_start: Printer,
  job_status_updated: Printer,
  job_created: Package,
  request_declined: CircleSlash,
  quote_request_cancelled: Ban,
}

type NoticeRow = {
  id: string
  title: string
  body: string
  bodySegments?: PrintyNotification['body']
  timeLabel: string
  tone: DesignNoticeTone
  unread: boolean
  actionLabel?: string
  actionUrl?: string
  typeLabel: string
  priority: string
  sample: boolean
  real?: PrintyNotification
}

const role = computed(() => designWorkspaceRoleFromUser(auth.user) ?? 'client')
const sampleNotices = computed(() => comms.sampleNoticesFor(role.value))
const unreadCount = computed(() => sampleMode.value
  ? sampleNotices.value.filter((notice) => notice.unread).length
  : notifications.unreadCount)

const showLoading = computed(() => (
  !initialised.value
  || (notifications.loading && notifications.items.length === 0 && !sampleMode.value)
))

function realRow(item: PrintyNotification): NoticeRow {
  return {
    id: String(item.id),
    title: item.title || item.notification_type_display,
    body: '',
    bodySegments: item.body,
    timeLabel: relativeTime(item.created_at),
    tone: item.priority === 'action_required' ? 'brand' : 'green',
    unread: !item.is_read,
    actionLabel: item.action_label || undefined,
    actionUrl: item.action_url || item.target_url || undefined,
    typeLabel: item.notification_type_display,
    priority: item.priority,
    sample: false,
    real: item,
  }
}

function sampleRow(notice: DesignNotice): NoticeRow {
  return {
    id: notice.id,
    title: notice.title,
    body: notice.body,
    timeLabel: notice.time,
    tone: notice.tone,
    unread: notice.unread,
    actionLabel: notice.actionLabel,
    actionUrl: notice.actionUrl,
    typeLabel: 'Sample',
    priority: notice.actionLabel ? 'action_required' : 'informational',
    sample: true,
  }
}

const sampleRows = computed<NoticeRow[]>(() => {
  const rows = sampleNotices.value.map(sampleRow)
  if (notifications.filter === 'unread') return rows.filter((row) => row.unread)
  if (notifications.filter === 'action_needed') return rows.filter((row) => Boolean(row.actionLabel))
  return rows
})

const groups = computed(() => {
  if (sampleMode.value) {
    return sampleRows.value.length
      ? [{ key: 'sample', label: 'Sample activity', items: sampleRows.value }]
      : []
  }
  return groupByEntity(notifications.items).map((group) => ({
    key: group.key,
    label: group.label,
    items: group.items.map(realRow),
  }))
})

function iconFor(row: NoticeRow) {
  if (row.sample || !row.real) return Bell
  return ICONS[row.real.type] || Bell
}

function toneDotClass(tone: DesignNoticeTone): string {
  if (tone === 'green') return 'bg-green'
  if (tone === 'amber') return 'bg-amber'
  return 'bg-brand'
}

function tabStyle(value: NotificationFilter) {
  if (notifications.filter === value) {
    return { background: 'var(--color-brand)', color: '#ffffff' }
  }
  return { color: 'var(--color-ink-2)' }
}

async function load(filter: NotificationFilter) {
  initialised.value = true
  await notifications.fetchFeed(filter)
  if (notifications.items.length > 0) {
    sampleMode.value = false
  } else if (filter === 'all' && !notifications.error) {
    sampleMode.value = true
  }
}

async function markAllRead() {
  if (sampleMode.value) {
    comms.markAllSamplesRead(role.value)
    return
  }
  await notifications.markAllRead()
}

async function markRead(row: NoticeRow) {
  if (!row.unread) return
  if (row.sample) {
    comms.markSampleRead(row.id)
    return
  }
  if (row.real) await notifications.markRead(row.real)
}

async function openItem(row: NoticeRow) {
  await markRead(row)
  if (row.actionUrl) {
    await navigateTo(row.actionUrl)
  }
}

onMounted(() => load('all'))
</script>

<template>
  <DesignWorkspaceSurface>
    <div class="flex flex-col gap-7">
      <DesignWorkspacePageHeader
        index="NT"
        kicker="Notifications"
        title="Notifications"
        subtitle="One job, one timeline."
        :description="`${unreadCount} unread. Every alert links back to the job, quote or payout it belongs to.`"
      >
        <template #actions>
          <span v-if="sampleMode" class="rounded-full border border-brand/35 bg-mint px-2.5 py-1.5 font-mono text-[10px] font-semibold tracking-[0.1em] text-brand-deep uppercase">
            Sample feed
          </span>
          <button
            type="button"
            class="inline-flex items-center gap-2 rounded-xl border border-line-strong bg-card px-3.5 py-2 font-mono text-[10px] font-semibold tracking-[0.1em] uppercase transition-colors hover:border-brand hover:text-brand disabled:opacity-50"
            :class="unreadCount > 0 ? 'text-brand' : 'text-ink-3'"
            :disabled="unreadCount === 0"
            @click="markAllRead"
          >
            Mark all read
          </button>
        </template>
      </DesignWorkspacePageHeader>

      <div class="flex items-center gap-1 self-start rounded-full border border-line bg-card p-1">
        <button
          v-for="tab in tabs"
          :key="tab.value"
          type="button"
          class="rounded-full px-4 py-2 font-mono text-[9.5px] font-bold tracking-[0.12em] uppercase transition-colors"
          :style="tabStyle(tab.value)"
          @click="load(tab.value)"
        >
          {{ tab.label }}
        </button>
      </div>

      <div
        v-if="sampleMode && !showLoading"
        class="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-brand/30 bg-mint/60 px-4 py-3"
      >
        <p class="text-[13px] leading-relaxed text-brand-deep">
          Your live feed is empty, so these design sample notices are shown. Real notifications always take over the moment they arrive.
        </p>
        <NuxtLink to="/notifications" class="font-mono text-[10px] font-semibold tracking-[0.1em] text-brand uppercase">
          Refresh live feed
        </NuxtLink>
      </div>

      <div v-if="showLoading" class="flex flex-col gap-3">
        <div v-for="i in 4" :key="i" class="h-20 animate-pulse rounded-2xl border border-line bg-card" />
      </div>

      <div
        v-else-if="notifications.error && !sampleMode"
        class="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-red/35 bg-red-soft px-5 py-4"
      >
        <p class="text-[13px] text-red">{{ notifications.error }}</p>
        <button
          type="button"
          class="inline-flex items-center gap-1.5 rounded-xl border border-red/40 px-3 py-1.5 font-mono text-[9.5px] font-bold tracking-[0.1em] text-red uppercase"
          @click="load(notifications.filter)"
        >
          <Loader2 v-if="notifications.loading" :size="12" class="animate-spin" />
          Try again
        </button>
      </div>

      <div
        v-else-if="groups.length === 0"
        class="flex flex-col items-center rounded-2xl border border-line bg-card px-6 py-14 text-center"
      >
        <Bell :size="22" class="text-ink-3" />
        <p class="mt-3 text-sm font-bold text-ink">Nothing here yet</p>
        <p class="mt-1 text-[12.5px] text-ink-2">
          {{ notifications.filter === 'all' ? "You're all caught up." : 'No notifications match this filter.' }}
        </p>
      </div>

      <div v-else class="flex flex-col gap-6">
        <section v-for="group in groups" :key="group.key">
          <div class="mb-2 flex items-center gap-2 px-1">
            <span class="font-mono text-[9.5px] font-bold tracking-[0.16em] text-ink-3 uppercase">
              {{ group.label }}
            </span>
            <span class="h-px flex-1 bg-line" />
          </div>

          <div class="overflow-hidden rounded-2xl border border-line bg-card">
            <article
              v-for="row in group.items"
              :key="row.id"
              class="group relative flex items-start gap-3 border-b border-line px-4 py-4 last:border-b-0"
              :class="row.unread ? 'border-l-2 border-l-brand bg-mint/30' : 'border-l-2 border-l-transparent'"
            >
              <span class="relative mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-paper-2">
                <component :is="iconFor(row)" :size="14" class="text-ink-2" />
                <span class="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full" :class="toneDotClass(row.tone)" />
              </span>

              <div class="min-w-0 flex-1">
                <div class="flex flex-wrap items-center gap-2">
                  <span class="text-[13.5px] leading-snug" :class="row.unread ? 'font-bold text-ink' : 'font-semibold text-ink'">
                    {{ row.title }}
                  </span>
                  <span v-if="row.sample" class="rounded-full border border-brand/35 bg-mint px-2 py-0.5 font-mono text-[8.5px] font-semibold tracking-[0.1em] text-brand-deep uppercase">
                    Sample
                  </span>
                  <span v-if="row.unread" class="h-1.5 w-1.5 shrink-0 rounded-full bg-brand shadow-[0_0_8px_var(--color-brand)]" />
                </div>

                <p class="mt-1 text-[12.5px] leading-relaxed text-ink-2">
                  <NotificationBody v-if="row.bodySegments" :segments="row.bodySegments" />
                  <template v-else>{{ row.body }}</template>
                </p>

                <div class="mt-2.5 flex flex-wrap items-center gap-3">
                  <span class="font-mono text-[8.5px] tracking-[0.12em] text-ink-3 uppercase">
                    {{ row.timeLabel }} · {{ row.typeLabel }}
                  </span>
                  <button
                    v-if="row.actionLabel && row.actionUrl"
                    type="button"
                    class="inline-flex items-center gap-1 rounded-full bg-brand px-3 py-1.5 font-mono text-[9px] font-bold tracking-[0.1em] text-white uppercase shadow-brand transition-colors hover:bg-brand-deep"
                    @click="openItem(row)"
                  >
                    {{ row.actionLabel }} <ArrowRight :size="10" />
                  </button>
                  <NuxtLink
                    :to="`/notifications/${row.id}`"
                    class="font-mono text-[9px] font-bold tracking-[0.1em] text-ink-3 uppercase transition-colors hover:text-brand"
                  >
                    View details
                  </NuxtLink>
                  <button
                    v-if="row.unread"
                    type="button"
                    class="font-mono text-[9px] font-bold tracking-[0.1em] text-ink-3 uppercase opacity-0 transition-opacity hover:text-brand focus:opacity-100 group-hover:opacity-100"
                    @click="markRead(row)"
                  >
                    Mark read
                  </button>
                </div>
              </div>
            </article>
          </div>
        </section>

        <div v-if="!sampleMode && notifications.hasMore" class="pt-1 text-center">
          <button
            type="button"
            class="rounded-full border border-line-strong px-5 py-2.5 font-mono text-[9.5px] font-bold tracking-[0.12em] text-ink-2 uppercase transition-colors hover:border-brand hover:text-brand disabled:opacity-50"
            :disabled="notifications.loadingMore"
            @click="notifications.loadMore()"
          >
            {{ notifications.loadingMore ? 'Loading…' : 'Load more' }}
          </button>
        </div>
      </div>
    </div>
  </DesignWorkspaceSurface>
</template>
