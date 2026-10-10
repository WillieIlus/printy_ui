<template>
  <div class="flex items-center justify-between border-b px-4 py-3" :style="{ borderColor: 'var(--line)' }">
    <span class="font-disp text-[13px] font-bold" style="color: var(--ink)">Notifications</span>
    <span class="font-mono2 text-[8.5px] uppercase tracking-[0.18em]" style="color: var(--sub)">
      {{ notifications.unreadCount }} unread
    </span>
  </div>

  <div v-if="notifications.loading && notifications.items.length === 0" class="space-y-2 p-4">
    <div class="h-3 animate-pulse rounded-full" style="background: var(--panel2)" />
    <div class="h-3 w-3/4 animate-pulse rounded-full" style="background: var(--panel2)" />
  </div>

  <div v-else-if="notifications.items.length === 0" class="px-4 py-10 text-center">
    <Bell :size="16" class="mx-auto opacity-50" style="color: var(--sub)" />
    <p class="mt-2 font-mono2 text-[10px] uppercase tracking-[0.14em]" style="color: var(--sub)">
      Nothing yet
    </p>
  </div>

  <div v-else class="min-h-0 flex-1 overflow-y-auto">
    <button
      v-for="n in popoverItems"
      :key="n.id"
      type="button"
      class="group relative flex w-full items-start gap-3 border-b px-4 py-3 text-left transition-colors last:border-b-0 hover:bg-[var(--panel2)]"
      :style="rowStyle(n)"
      @click="openItem(n)"
    >
      <span
        class="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full"
        :style="{ background: 'var(--panel2)', color: n.priority === 'action_required' ? 'var(--accent)' : 'var(--sub)' }"
      >
        <component :is="iconFor(n)" :size="12" />
      </span>

      <span class="min-w-0 flex-1">
        <span class="flex items-center gap-2">
          <span
            class="block truncate font-disp text-[12.5px] leading-snug"
            :style="{ color: 'var(--ink)', fontWeight: n.is_read ? 600 : 700 }"
          >
            {{ n.title || n.notification_type_display }}
          </span>
          <span
            v-if="!n.is_read"
            class="h-1.5 w-1.5 shrink-0 rounded-full"
            :style="{ background: 'var(--accent)', boxShadow: '0 0 8px var(--accent)' }"
          />
        </span>

        <span class="mt-0.5 block text-[11.5px] leading-snug" style="color: var(--sub)">
          <span class="line-clamp-2"><NotificationBody :segments="n.body" /></span>
        </span>

        <span class="mt-1.5 flex items-center gap-2">
          <span class="font-mono2 text-[8.5px] uppercase tracking-[0.14em]" style="color: var(--sub)">
            {{ relativeTime(n.created_at) }}
          </span>
          <span
            v-if="ctaLabel(n)"
            class="press-key inline-flex items-center gap-1 rounded-full px-2.5 py-1 font-mono2 text-[8.5px] font-bold uppercase tracking-[0.12em]"
            :style="{ background: 'var(--accent)', color: 'var(--accentInk)' }"
            @click.stop="openItem(n)"
          >
            {{ ctaLabel(n) }} <ArrowRight :size="9" />
          </span>
        </span>
      </span>

      <button
        v-if="!n.is_read"
        type="button"
        title="Mark as read"
        class="press-key absolute right-3 top-3 rounded-full border p-1 opacity-0 transition-opacity focus:opacity-100 group-hover:opacity-100"
        :style="{ borderColor: 'var(--line)', background: 'var(--bg)', color: 'var(--sub)' }"
        @click.stop="markReadOnly(n)"
      >
        <Check :size="10" />
      </button>
    </button>
  </div>

  <div
    v-if="notifications.items.length > 0"
    class="flex shrink-0 items-center justify-between gap-2 border-t px-2 py-2"
    :style="{ borderColor: 'var(--line)', background: 'var(--panel)' }"
  >
    <button
      type="button"
      class="press-key rounded-xl px-3 py-2 font-mono2 text-[9.5px] font-bold uppercase tracking-[0.16em]"
      :style="{ color: notifications.unreadCount > 0 ? 'var(--accent)' : 'var(--sub)' }"
      :disabled="notifications.unreadCount === 0"
      @click="notifications.markAllRead()"
    >
      Mark all read
    </button>
    <NuxtLink
      to="/notifications"
      class="press-key inline-flex items-center gap-1 rounded-xl px-3 py-2 font-mono2 text-[9.5px] font-bold uppercase tracking-[0.16em]"
      style="color: var(--ink)"
      @click="emit('close')"
    >
      View all <ArrowRight :size="11" />
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import {
  ArrowRight, BadgeCheck, Ban, Bell, Check, CircleSlash, CreditCard, FileText, ImageUp,
  Inbox, MessageSquare, Package, Printer, Send,
} from 'lucide-vue-next'
import { useNotificationsStore } from '~/stores/notifications'
import { pinActionRequired, relativeTime } from '~/shared/notification'
import type { PrintyNotification } from '~/shared/types'

const emit = defineEmits<{ close: [] }>()
const notifications = useNotificationsStore()

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

const popoverItems = computed(() => pinActionRequired(notifications.items).slice(0, 8))

function iconFor(n: PrintyNotification) {
  return ICONS[n.type] || Bell
}

function ctaLabel(n: PrintyNotification): string {
  if (!n.action_label || !(n.action_url || n.target_url)) {
    return ''
  }
  return n.action_label
}

function rowStyle(n: PrintyNotification) {
  if (!n.is_read) {
    return {
      background: 'color-mix(in srgb, var(--accent) 7%, transparent)',
      borderLeft: n.priority === 'action_required' ? '2px solid var(--accent)' : '2px solid transparent',
    }
  }
  return { borderLeft: '2px solid transparent' }
}

async function markReadOnly(n: PrintyNotification) {
  await notifications.markRead(n)
}

async function openItem(n: PrintyNotification) {
  await notifications.markRead(n)
  emit('close')
  const target = n.action_url || n.target_url
  if (target) {
    await navigateTo(target)
  }
}
</script>
