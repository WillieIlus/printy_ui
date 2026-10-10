<template>
  <div class="mx-auto max-w-[860px] px-4 py-8 sm:px-6">
    <div class="flex flex-wrap items-center justify-between gap-3">
      <div>
        <h1 class="font-disp text-[24px] font-bold tracking-tight" style="color: var(--ink)">Notifications</h1>
        <p class="mt-1 font-mono2 text-[10px] uppercase tracking-[0.16em]" style="color: var(--sub)">
          {{ notifications.unreadCount }} unread · one job, one timeline
        </p>
      </div>
      <button
        type="button"
        class="press-key rounded-full border px-4 py-2 font-mono2 text-[9.5px] font-bold uppercase tracking-[0.14em]"
        :style="{ borderColor: 'var(--line)', color: notifications.unreadCount > 0 ? 'var(--accent)' : 'var(--sub)' }"
        :disabled="notifications.unreadCount === 0"
        @click="notifications.markAllRead()"
      >
        Mark all read
      </button>
    </div>

    <div class="mt-6 flex items-center gap-1 rounded-full border p-1" :style="{ borderColor: 'var(--line)', background: 'var(--panel)' }">
      <button
        v-for="tab in tabs"
        :key="tab.value"
        type="button"
        class="press-key flex-1 rounded-full px-3 py-2 font-mono2 text-[9.5px] font-bold uppercase tracking-[0.14em] transition-colors"
        :style="tabStyle(tab.value)"
        @click="notifications.fetchFeed(tab.value)"
      >
        {{ tab.label }}
      </button>
    </div>

    <div v-if="notifications.loading && notifications.items.length === 0" class="mt-6 space-y-3">
      <div v-for="i in 4" :key="i" class="h-16 animate-pulse rounded-2xl" style="background: var(--panel)" />
    </div>

    <div v-else-if="notifications.items.length === 0" class="mt-10 rounded-2xl border px-6 py-12 text-center" :style="{ borderColor: 'var(--line)', background: 'var(--panel)' }">
      <Bell :size="20" class="mx-auto opacity-50" style="color: var(--sub)" />
      <p class="mt-3 font-disp text-[14px] font-semibold" style="color: var(--ink)">Nothing here yet</p>
      <p class="mt-1 text-[12px]" style="color: var(--sub)">
        {{ notifications.filter === 'all' ? "You're all caught up." : 'No notifications match this filter.' }}
      </p>
    </div>

    <div v-else class="mt-6 space-y-6">
      <section v-for="group in groups" :key="group.key">
        <div class="mb-2 flex items-center gap-2 px-1">
          <span class="font-mono2 text-[9px] font-bold uppercase tracking-[0.18em]" style="color: var(--sub)">
            {{ group.label }}
          </span>
          <span class="h-px flex-1" :style="{ background: 'var(--line)' }" />
        </div>

        <div class="overflow-hidden rounded-2xl border" :style="{ borderColor: 'var(--line)', background: 'var(--panel)' }">
          <article
            v-for="n in group.items"
            :key="n.id"
            class="group relative flex items-start gap-3 border-b px-4 py-3.5 last:border-b-0"
            :style="rowStyle(n)"
          >
            <span
              class="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full"
              :style="{ background: 'var(--panel2)', color: n.priority === 'action_required' ? 'var(--accent)' : 'var(--sub)' }"
            >
              <component :is="iconFor(n)" :size="13" />
            </span>

            <div class="min-w-0 flex-1">
              <div class="flex items-center gap-2">
                <span
                  class="font-disp text-[13.5px] leading-snug"
                  :style="{ color: 'var(--ink)', fontWeight: n.is_read ? 600 : 700 }"
                >
                  {{ n.title || n.notification_type_display }}
                </span>
                <span
                  v-if="!n.is_read"
                  class="h-1.5 w-1.5 shrink-0 rounded-full"
                  :style="{ background: 'var(--accent)', boxShadow: '0 0 8px var(--accent)' }"
                />
              </div>

              <p class="mt-1 text-[12.5px] leading-relaxed" style="color: var(--sub)">
                <NotificationBody :segments="n.body" />
              </p>

              <div class="mt-2 flex flex-wrap items-center gap-3">
                <span class="font-mono2 text-[8.5px] uppercase tracking-[0.14em]" style="color: var(--sub)">
                  {{ relativeTime(n.created_at) }}
                </span>
                <button
                  v-if="n.action_label && (n.action_url || n.target_url)"
                  type="button"
                  class="press-key inline-flex items-center gap-1 rounded-full px-3 py-1.5 font-mono2 text-[9px] font-bold uppercase tracking-[0.12em]"
                  :style="{ background: 'var(--accent)', color: 'var(--accentInk)' }"
                  @click="openItem(n)"
                >
                  {{ n.action_label }} <ArrowRight :size="10" />
                </button>
                <button
                  v-if="!n.is_read"
                  type="button"
                  class="press-key font-mono2 text-[9px] font-bold uppercase tracking-[0.12em] opacity-0 transition-opacity focus:opacity-100 group-hover:opacity-100"
                  style="color: var(--sub)"
                  @click="notifications.markRead(n)"
                >
                  Mark read
                </button>
              </div>
            </div>
          </article>
        </div>
      </section>

      <div v-if="notifications.hasMore" class="pt-2 text-center">
        <button
          type="button"
          class="press-key rounded-full border px-5 py-2.5 font-mono2 text-[9.5px] font-bold uppercase tracking-[0.14em]"
          :style="{ borderColor: 'var(--line)', color: 'var(--sub)' }"
          :disabled="notifications.loadingMore"
          @click="notifications.loadMore()"
        >
          {{ notifications.loadingMore ? 'Loading…' : 'Load more' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import {
  ArrowRight, BadgeCheck, Ban, Bell, CircleSlash, CreditCard, FileText, ImageUp,
  Inbox, MessageSquare, Package, Printer, Send,
} from 'lucide-vue-next'
import { useNotificationsStore, type NotificationFilter } from '~/stores/notifications'
import { groupByEntity, relativeTime } from '~/shared/notification'
import type { PrintyNotification } from '~/shared/types'

definePageMeta({ middleware: 'auth' })

const notifications = useNotificationsStore()

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

const groups = computed(() => groupByEntity(notifications.items))

onMounted(() => {
  notifications.fetchFeed(notifications.filter)
})

function iconFor(n: PrintyNotification) {
  return ICONS[n.type] || Bell
}

function tabStyle(value: NotificationFilter) {
  if (notifications.filter === value) {
    return { background: 'var(--accent)', color: 'var(--accentInk)' }
  }
  return { color: 'var(--sub)' }
}

function rowStyle(n: PrintyNotification) {
  if (!n.is_read) {
    return {
      background: 'color-mix(in srgb, var(--accent) 6%, transparent)',
      borderLeft: n.priority === 'action_required' ? '2px solid var(--accent)' : '2px solid transparent',
    }
  }
  return { borderLeft: '2px solid transparent' }
}

async function openItem(n: PrintyNotification) {
  await notifications.markRead(n)
  const target = n.action_url || n.target_url
  if (target) {
    await navigateTo(target)
  }
}
</script>
