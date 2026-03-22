<template>
  <div class="space-y-6">
    <DashboardPageHeader
      title="Notifications"
      subtitle="Quote requests, shop responses, and operational updates."
    >
      <template #actions>
        <UButton
          v-if="storeReady && unreadCount > 0"
          variant="soft"
          size="sm"
          :loading="markingAll"
          @click="onMarkAllRead"
        >
          Mark all as read
        </UButton>
      </template>
    </DashboardPageHeader>

    <UAlert
      v-if="storeWarning"
      color="warning"
      variant="soft"
      title="Notifications are temporarily unavailable"
      :description="storeWarning"
      icon="i-lucide-bell-off"
    />

    <CommonLoadingSpinner v-else-if="loading && !notifications.length" />

    <div v-else-if="error" class="rounded-xl border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
      <p class="text-sm text-red-700 dark:text-red-300">{{ error }}</p>
      <UButton
        variant="soft"
        color="error"
        size="sm"
        class="mt-2"
        :disabled="!storeReady"
        @click="fetchNotifications"
      >
        Try again
      </UButton>
    </div>

    <div v-else-if="notifications.length" class="space-y-3">
      <NotificationCard
        v-for="n in notifications"
        :key="n.id"
        :notification="n"
        @click="onNotificationClick(n)"
      />
    </div>

    <DashboardEmptyState
      v-else
      title="No notifications"
      :description="emptyStateDescription"
      icon="i-lucide-bell"
    />
  </div>
</template>

<script setup lang="ts">
import type { Notification } from '~/shared/types/notification'
import { useNotifications } from '~/composables/useNotifications'
import { useNotificationsStore } from '~/stores/notifications'

definePageMeta({
  layout: 'dashboard',
  middleware: 'auth',
})

const notificationsStore = typeof useNotificationsStore === 'function' ? useNotificationsStore() : null
const notificationsApi = useNotifications()

const loading = ref(true)
const error = ref<string | null>(null)
const markingAll = ref(false)

const storeReady = computed(() => Boolean(
  notificationsStore
  && typeof notificationsStore.fetchNotifications === 'function'
  && typeof notificationsStore.fetchUnreadCount === 'function'
))

const storeWarning = computed(() => {
  if (storeReady.value) return ''
  return 'The notifications store could not be initialized. The page will stay available, but live notification data is disabled until the app reloads cleanly.'
})

const notifications = computed<Notification[]>(() => {
  const list = notificationsStore?.notifications
  return Array.isArray(list) ? list : []
})

const unreadCount = computed(() => {
  const count = notificationsStore?.unreadCount
  return typeof count === 'number' ? count : 0
})

const emptyStateDescription = computed(() => {
  if (storeWarning.value) {
    return 'Notifications could not be loaded from the current app state. Reload the app after the dev server stabilizes, or continue working without notifications for now.'
  }
  return 'Quote updates, shop responses, and request changes will appear here when they are available.'
})

async function fetchNotifications() {
  if (!storeReady.value || !notificationsStore) {
    loading.value = false
    error.value = null
    return
  }

  loading.value = true
  error.value = null

  try {
    await notificationsStore.fetchNotifications()
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Failed to load notifications.'
  } finally {
    loading.value = false
  }
}

async function onNotificationClick(n: Notification) {
  if (!n?.id) return

  if (!n.is_read) {
    try {
      await notificationsApi.markRead(n.id)
      notificationsStore?.setNotificationRead?.(n.id)
    } catch {
      // Keep navigation usable even when read-state sync fails.
    }
  }

  if (n.target_url) {
    await navigateTo(n.target_url, { external: /^https?:\/\//.test(n.target_url) })
  }
}

async function onMarkAllRead() {
  if (!storeReady.value || !notificationsStore) return

  markingAll.value = true
  try {
    await notificationsApi.markAllRead()
    await notificationsStore.fetchUnreadCount()
    await fetchNotifications()
  } catch {
    // Leave the current list visible and avoid crashing the page.
  } finally {
    markingAll.value = false
  }
}

onMounted(async () => {
  await fetchNotifications()
})
</script>
