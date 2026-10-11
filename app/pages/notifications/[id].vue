<template>
  <div class="mx-auto max-w-[720px] px-4 py-8 sm:px-6">
    <NuxtLink
      to="/notifications"
      class="press-key inline-flex items-center gap-1.5 font-mono2 text-[9.5px] uppercase tracking-[0.16em] text-[var(--sub)] hover:text-[var(--accent)]"
    >
      <ArrowLeft :size="11" /> Back to notifications
    </NuxtLink>

    <div v-if="loading" class="mt-6 space-y-4">
      <div class="h-7 w-2/3 animate-pulse rounded-full" style="background: var(--panel)" />
      <div class="h-4 w-1/2 animate-pulse rounded-full" style="background: var(--panel)" />
      <div class="h-16 animate-pulse rounded-2xl" style="background: var(--panel)" />
    </div>

    <div v-else-if="error" class="mt-6 rounded-2xl border px-5 py-5 text-[13px]" style="border-color: rgba(251,77,109,.4); background: rgba(251,77,109,.08); color: #B4243F">
      {{ error }}
    </div>

    <article v-else-if="notification" class="mt-6 overflow-hidden rounded-3xl border" :style="{ borderColor: 'var(--line)', background: 'var(--panel)' }">
      <div class="flex flex-wrap items-start justify-between gap-4 p-6">
        <div class="min-w-0 flex-1">
          <div class="flex items-center gap-2">
            <span
              class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
              :style="{ background: 'var(--panel2)', color: notification.priority === 'action_required' ? 'var(--accent)' : 'var(--sub)' }"
            >
              <component :is="iconFor(notification)" :size="14" />
            </span>
            <div class="min-w-0">
              <div class="flex items-center gap-2">
                <h1 class="truncate font-disp text-[20px] font-bold leading-tight tracking-tight" style="color: var(--ink)">
                  {{ notification.title || notification.notification_type_display }}
                </h1>
                <span
                  v-if="!notification.is_read"
                  class="h-1.5 w-1.5 shrink-0 rounded-full"
                  :style="{ background: 'var(--accent)', boxShadow: '0 0 8px var(--accent)' }"
                />
              </div>
              <div class="mt-1 flex flex-wrap items-center gap-2 font-mono2 text-[8.5px] uppercase tracking-[0.16em]" style="color: var(--sub)">
                <span>{{ notification.notification_type_display }}</span>
                <span>•</span>
                <span>{{ relativeTime(notification.created_at) }}</span>
                <span v-if="notification.priority === 'action_required'">• action required</span>
              </div>
            </div>
          </div>

          <div class="mt-5 text-[14px] leading-relaxed" style="color: var(--sub)">
            <NotificationBody :segments="notification.body" />
          </div>

          <div v-if="notification.actor_email || notification.entity" class="mt-5 grid gap-3 rounded-2xl border p-4 text-[12.5px]" :style="{ borderColor: 'var(--line)', background: 'var(--panel2)' }">
            <div v-if="notification.actor_email" class="flex items-center justify-between gap-3">
              <span style="color: var(--sub)">From</span>
              <span class="truncate font-mono2 text-[9.5px] uppercase tracking-[0.12em]" style="color: var(--ink)">{{ notification.actor_email }}</span>
            </div>
            <div v-if="notification.entity" class="flex items-center justify-between gap-3">
              <span style="color: var(--sub)">Item</span>
              <span class="font-mono2 text-[9.5px] uppercase tracking-[0.12em]" style="color: var(--ink)">
                {{ notification.entity.type }} #{{ notification.entity.id }}
              </span>
            </div>
          </div>

          <div v-if="notification.action_label && (notification.action_url || notification.target_url)" class="mt-6 flex flex-wrap items-center gap-3">
            <button
              type="button"
              class="press-key inline-flex items-center gap-1.5 rounded-full px-5 py-2.5 font-mono2 text-[10px] font-bold uppercase tracking-[0.14em]"
              :style="{ background: 'var(--accent)', color: 'var(--accentInk)' }"
              @click="openAction"
            >
              {{ notification.action_label }} <ArrowRight :size="12" />
            </button>
            <NuxtLink
              v-if="(notification.action_url || notification.target_url) && (notification.action_url || notification.target_url) !== $route.fullPath"
              :to="notification.action_url || notification.target_url"
              class="press-key inline-flex items-center gap-1.5 rounded-full border px-4 py-2.5 font-mono2 text-[10px] uppercase tracking-[0.14em]"
              :style="{ borderColor: 'var(--line)', color: 'var(--sub)' }"
            >
              Open in context
            </NuxtLink>
          </div>
        </div>
      </div>
    </article>
  </div>
</template>

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
import { useApi } from '~/composables/useApi'
import { API } from '~/shared/api-paths'
import { relativeTime } from '~/shared/notification'
import type { PrintyNotification } from '~/shared/types'
import { useNotificationsStore } from '~/stores/notifications'

definePageMeta({ middleware: 'auth' })

const route = useRoute()
const id = computed(() => route.params.id as string)

const { api } = useApi()
const notifications = useNotificationsStore()

const notification = ref<PrintyNotification | null>(null)
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

function iconFor(n: PrintyNotification) {
  return ICONS[n.type] || Bell
}

async function fetchNotification() {
  loading.value = true
  error.value = ''
  try {
    const res = await api<PrintyNotification>(`${API.notifications.list.replace(/\/$/, '')}/${id.value}/`)
    notification.value = res
    if (!notification.value.is_read) {
      await notifications.markRead(notification.value)
    }
  } catch (e) {
    error.value = 'We could not load this notification.'
  } finally {
    loading.value = false
  }
}

async function openAction() {
  if (!notification.value) return
  const target = notification.value.action_url || notification.value.target_url
  if (target) {
    await navigateTo(target)
  }
}

onMounted(fetchNotification)
</script>
