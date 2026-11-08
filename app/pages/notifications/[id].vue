<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Ban,
  Bell,
  CircleSlash,
  CreditCard,
  FileText,
  ImageUp,
  Inbox,
  MessageSquare,
  Package,
  Printer,
  Send,
} from 'lucide-vue-next'
import DesignWorkspaceSurface from '~/components/design/workspace/WorkspaceSurface.vue'
import DesignAlert from '~/components/design/ui/Alert.vue'
import DesignLoading from '~/components/design/ui/Loading.vue'
import { useDesignComms } from '~/composables/design/useDesignComms'
import type { DesignNotice, DesignNoticeTone } from '~/composables/design/useDesignComms'
import { useApi } from '~/composables/useApi'
import { API } from '~/shared/api-paths'
import { relativeTime } from '~/shared/notification'
import type { PrintyNotification } from '~/shared/types'
import { useNotificationsStore } from '~/stores/notifications'

definePageMeta({ layout: 'design-workspace', middleware: 'auth' })

type DetailView = {
  id: string
  title: string
  body: string
  bodySegments?: PrintyNotification['body']
  typeLabel: string
  timeLabel: string
  priority: string
  actorEmail: string
  entity: { type: string; id: number | string } | null
  actionLabel?: string
  actionUrl?: string
  unread: boolean
  sample: boolean
  tone: DesignNoticeTone
}

const route = useRoute()
const id = computed(() => String(route.params.id ?? ''))

const { api } = useApi()
const notifications = useNotificationsStore()
const comms = useDesignComms()

const detail = ref<DetailView | null>(null)
const loading = ref(false)
const error = ref('')

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

function realDetail(notification: PrintyNotification): DetailView {
  return {
    id: String(notification.id),
    title: notification.title || notification.notification_type_display,
    body: '',
    bodySegments: notification.body,
    typeLabel: notification.notification_type_display,
    timeLabel: relativeTime(notification.created_at),
    priority: notification.priority,
    actorEmail: notification.actor_email || '',
    entity: notification.entity ?? null,
    actionLabel: notification.action_label || undefined,
    actionUrl: notification.action_url || notification.target_url || undefined,
    unread: !notification.is_read,
    sample: false,
    tone: notification.priority === 'action_required' ? 'brand' : 'green',
  }
}

function sampleDetail(notice: DesignNotice): DetailView {
  return {
    id: notice.id,
    title: notice.title,
    body: notice.body,
    typeLabel: 'Sample notification',
    timeLabel: notice.time,
    priority: notice.actionLabel ? 'action_required' : 'informational',
    actorEmail: '',
    entity: null,
    actionLabel: notice.actionLabel,
    actionUrl: notice.actionUrl,
    unread: notice.unread,
    sample: true,
    tone: notice.tone,
  }
}

function iconFor(value: DetailView | null) {
  if (!value || value.sample) return Bell
  const key = Object.keys(ICONS).find((type) => value.typeLabel.toLowerCase().includes(type.split('_')[0] ?? ''))
  return (key ? ICONS[key] : undefined) || Bell
}

function tonePillClass(tone: DesignNoticeTone): string {
  if (tone === 'green') return 'border-green/40 bg-green-soft text-green'
  if (tone === 'amber') return 'border-amber/45 bg-amber-soft text-amber'
  return 'border-brand/35 bg-mint text-brand-deep'
}

async function markSampleRead(notification: DesignNotice) {
  if (notification.unread) {
    comms.markSampleRead(notification.id)
  }
}

async function fetchNotification() {
  loading.value = true
  error.value = ''
  detail.value = null

  if (id.value.startsWith('sample-')) {
    const notice = comms.findSampleNotice(id.value)
    if (notice) {
      detail.value = sampleDetail(notice)
      await markSampleRead(notice)
    } else {
      error.value = 'We could not load this notification.'
    }
    loading.value = false
    return
  }

  try {
    const res = await api<PrintyNotification>(`${API.notifications.list.replace(/\/$/, '')}/${id.value}/`)
    detail.value = realDetail(res)
    if (!res.is_read) {
      await notifications.markRead(res)
    }
  } catch {
    error.value = 'We could not load this notification.'
  } finally {
    loading.value = false
  }
}

async function openAction() {
  if (!detail.value?.actionUrl) return
  if (detail.value.sample) {
    comms.markSampleRead(detail.value.id)
  }
  await navigateTo(detail.value.actionUrl)
}

onMounted(fetchNotification)
</script>

<template>
  <DesignWorkspaceSurface>
    <div class="flex flex-col gap-5">
      <NuxtLink
        to="/notifications"
        class="inline-flex w-fit items-center gap-1.5 font-mono text-[9.5px] font-semibold tracking-[0.14em] text-ink-3 uppercase transition-colors hover:text-brand"
      >
        <ArrowLeft :size="11" /> Back to notifications
      </NuxtLink>

      <DesignLoading v-if="loading" variant="skeleton" :rows="3" label="Loading notification…" />

      <DesignAlert v-else-if="error" tone="error">
        {{ error }}
      </DesignAlert>

      <article
        v-else-if="detail"
        class="overflow-hidden rounded-2xl border border-line bg-card shadow-card"
      >
        <div class="flex flex-wrap items-start justify-between gap-4 p-6">
          <div class="min-w-0 flex-1">
            <div class="flex items-start gap-3">
              <span class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-paper-2">
                <component :is="iconFor(detail)" :size="15" class="text-ink-2" />
              </span>
              <div class="min-w-0">
                <div class="flex flex-wrap items-center gap-2">
                  <h1 class="text-xl font-bold leading-tight tracking-tight text-ink">
                    {{ detail.title }}
                  </h1>
                  <span
                    v-if="detail.sample"
                    class="rounded-full border border-brand/35 bg-mint px-2.5 py-0.5 font-mono text-[8.5px] font-semibold tracking-[0.1em] text-brand-deep uppercase"
                  >
                    Sample
                  </span>
                  <span v-if="detail.unread" class="h-1.5 w-1.5 shrink-0 rounded-full bg-brand shadow-[0_0_8px_var(--color-brand)]" />
                </div>
                <div class="mt-1.5 flex flex-wrap items-center gap-2 font-mono text-[8.5px] tracking-[0.14em] text-ink-3 uppercase">
                  <span>{{ detail.typeLabel }}</span>
                  <span>·</span>
                  <span>{{ detail.timeLabel }}</span>
                  <span v-if="detail.priority === 'action_required'">· action required</span>
                </div>
              </div>
            </div>

            <div class="mt-5 text-[14px] leading-relaxed text-ink-2">
              <NotificationBody v-if="detail.bodySegments" :segments="detail.bodySegments" />
              <p v-else class="whitespace-pre-line">{{ detail.body }}</p>
            </div>

            <div
              v-if="detail.actorEmail || detail.entity"
              class="mt-5 grid gap-3 rounded-xl border border-line bg-paper-2 p-4 text-[12.5px]"
            >
              <div v-if="detail.actorEmail" class="flex items-center justify-between gap-3">
                <span class="text-ink-3">From</span>
                <span class="truncate font-mono text-[9.5px] tracking-[0.1em] text-ink uppercase">{{ detail.actorEmail }}</span>
              </div>
              <div v-if="detail.entity" class="flex items-center justify-between gap-3">
                <span class="text-ink-3">Item</span>
                <span class="font-mono text-[9.5px] tracking-[0.1em] text-ink uppercase">
                  {{ detail.entity.type }} #{{ detail.entity.id }}
                </span>
              </div>
            </div>

            <div v-if="detail.actionLabel && detail.actionUrl" class="mt-6 flex flex-wrap items-center gap-3">
              <button
                type="button"
                class="inline-flex items-center gap-1.5 rounded-xl bg-brand px-5 py-2.5 font-mono text-[10px] font-bold tracking-[0.12em] text-white uppercase shadow-brand transition-colors hover:bg-brand-deep"
                @click="openAction"
              >
                {{ detail.actionLabel }} <ArrowRight :size="12" />
              </button>
              <NuxtLink
                v-if="detail.actionUrl !== route.fullPath"
                :to="detail.actionUrl"
                class="inline-flex items-center gap-1.5 rounded-xl border border-line-strong px-4 py-2.5 font-mono text-[10px] tracking-[0.12em] text-ink-2 uppercase transition-colors hover:border-brand hover:text-brand"
              >
                Open in context
              </NuxtLink>
            </div>
          </div>

          <span
            class="rounded-full border px-2.5 py-1 font-mono text-[9.5px] font-semibold tracking-[0.08em] uppercase"
            :class="tonePillClass(detail.tone)"
          >
            {{ detail.sample ? 'Sample' : detail.priority === 'action_required' ? 'Action needed' : 'Update' }}
          </span>
        </div>
      </article>
    </div>
  </DesignWorkspaceSurface>
</template>
