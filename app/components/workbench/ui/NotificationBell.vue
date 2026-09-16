<template>
  <div class="relative">
    <button
      type="button"
      title="Notifications"
      class="press-key relative rounded-full border p-2"
      :style="{ borderColor: 'var(--line)', color: 'var(--sub)' }"
      @click.stop="toggle"
    >
      <Bell :size="13" />
      <span
        v-if="notifications.totalUnread > 0"
        class="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full px-1 font-mono2 text-[8px] font-bold"
        style="background: var(--accent); color: var(--accentInk)"
      >
        {{ notifications.totalUnread > 99 ? '99+' : notifications.totalUnread }}
      </span>
    </button>

    <Teleport to="body">
      <div v-if="open">
        <div class="fixed inset-0 z-[60]" @click="open = false" />
        <div
          class="absolute right-0 top-full z-[61] mt-2 w-[320px] overflow-hidden rounded-2xl border shadow-2xl backdrop-blur-xl"
          :style="panelStyle"
        >
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

          <div v-else-if="notifications.items.length === 0" class="px-4 py-8 text-center">
            <Bell :size="16" class="mx-auto opacity-50" style="color: var(--sub)" />
            <p class="mt-2 font-mono2 text-[10px] uppercase tracking-[0.14em]" style="color: var(--sub)">
              Nothing yet
            </p>
          </div>

          <div v-else class="max-h-[300px] overflow-y-auto">
            <button
              v-for="n in notifications.items"
              :key="n.id"
              type="button"
              class="flex w-full items-start gap-3 border-b px-4 py-3 text-left transition-colors last:border-b-0"
              :style="{ borderColor: 'var(--line)', background: n.is_read ? 'transparent' : 'color-mix(in srgb, var(--accent) 7%, transparent)' }"
              @click="openItem(n)"
            >
              <span
                class="mt-1 h-1.5 w-1.5 shrink-0 rounded-full"
                :style="{ background: n.is_read ? 'var(--line)' : 'var(--accent)', boxShadow: n.is_read ? 'none' : '0 0 8px var(--accent)' }"
              />
              <span class="min-w-0 flex-1">
                <span class="block truncate text-[12px] font-medium leading-snug" style="color: var(--ink)">
                  {{ n.message || n.notification_type_display }}
                </span>
                <span class="mt-1 block font-mono2 text-[8.5px] uppercase tracking-[0.14em]" style="color: var(--sub)">
                  {{ n.notification_type_display }} · {{ timeAgo(n.created_at) }}
                </span>
              </span>
              <span v-if="n.is_read" class="mt-0.5 shrink-0"><CheckCheck :size="11" style="color: var(--sub)" /></span>
            </button>
          </div>

          <div
            v-if="notifications.items.length > 0"
            class="border-t px-2 py-2"
            :style="{ borderColor: 'var(--line)', background: 'var(--panel)' }"
          >
            <button
              type="button"
              class="press-key w-full rounded-xl py-2 font-mono2 text-[9.5px] font-bold uppercase tracking-[0.16em]"
              :style="{ color: notifications.unreadCount > 0 ? 'var(--accent)' : 'var(--sub)' }"
              :disabled="notifications.unreadCount === 0"
              @click="notifications.markAllRead()"
            >
              Mark all read
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, ref, watch } from 'vue'
import { Bell, CheckCheck } from 'lucide-vue-next'
import { useAuthStore } from '~/stores/auth'
import { startNotificationPolling, useNotificationsStore } from '~/stores/notifications'
import { useProtoTheme } from '~/composables/useProtoTheme'
import type { PrintyNotification } from '~/shared/types'

const notifications = useNotificationsStore()
const auth = useAuthStore()
const { theme } = useProtoTheme()

const open = ref(false)

const panelStyle = {
  background: theme.value.dark ? 'rgba(19, 23, 32, 0.92)' : 'rgba(255, 252, 246, 0.95)',
  borderColor: 'var(--line)',
}

let stopPolling: (() => void) | null = null

watch(
  () => auth.isAuthenticated,
  async (authed) => {
    if (import.meta.client) {
      if (authed) {
        await notifications.fetch()
        stopPolling = startNotificationPolling()
      } else {
        open.value = false
        stopPolling?.()
        stopPolling = null
      }
    }
  },
  { immediate: true },
)

onBeforeUnmount(() => {
  stopPolling?.()
})

function toggle() {
  open.value = !open.value
  if (open.value && notifications.items.length === 0) {
    notifications.fetch()
  }
}

async function openItem(n: PrintyNotification) {
  if (!n.is_read) {
    await notifications.markRead(n)
  }
  open.value = false
  if (n.target_url) {
    await navigateTo(n.target_url)
  }
}

function timeAgo(iso: string): string {
  if (!iso) {
    return 'just now'
  }
  const then = new Date(iso).getTime()
  if (Number.isNaN(then)) {
    return 'just now'
  }
  const seconds = Math.max(0, Math.floor((Date.now() - then) / 1000))
  if (seconds < 60) {
    return 'just now'
  }
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) {
    return `${minutes}m ago`
  }
  const hours = Math.floor(minutes / 60)
  if (hours < 24) {
    return `${hours}h ago`
  }
  const days = Math.floor(hours / 24)
  return days === 1 ? 'yesterday' : `${days}d ago`
}
</script>