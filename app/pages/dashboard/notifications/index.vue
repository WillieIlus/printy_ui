<template>
  <div class="space-y-6">
    <DashboardPageHeader
      title="Notifications"
      subtitle="Quote requests, shop responses, and updates."
    >
      <template #actions>
        <UButton
          v-if="unreadCount > 0"
          variant="soft"
          size="sm"
          :loading="markingAll"
          @click="onMarkAllRead"
        >
          Mark all as read
        </UButton>
      </template>
    </DashboardPageHeader>

    <CommonLoadingSpinner v-if="loading && !notifications.length" />
    <div v-else-if="error" class="rounded-xl border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 p-4">
      <p class="text-sm text-red-700 dark:text-red-300">{{ error }}</p>
      <UButton variant="soft" color="error" size="sm" class="mt-2" @click="fetchNotifications">
        Try again
      </UButton>
    </div>
    <div v-else-if="notificationsStore.notifications.length" class="space-y-3">
      <NotificationCard
        v-for="n in notificationsStore.notifications"
        :key="n.id"
        :notification="n"
        @click="onNotificationClick(n)"
      />
    </div>
    <DashboardEmptyState
      v-else
      title="No notifications"
      description="Quote updates, shop responses, and request changes will appear here."
      icon="i-lucide-bell"
    />
  </div>
</template>

<script setup lang="ts">
import type { Notification } from '~/shared/types/notification'

definePageMeta({
  layout: 'dashboard',
  middleware: 'auth',
})

const notificationsStore = useNotificationsStore()
const { list, markRead, markAllRead } = useNotifications()

const loading = ref(true)
const error = ref<string | null>(null)
const markingAll = ref(false)

const unreadCount = computed(() => notificationsStore.unreadCount)

async function fetchNotifications() {
  loading.value = true
  error.value = null
  try {
    await notificationsStore.fetchNotifications()
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Failed to load notifications'
  } finally {
    loading.value = false
  }
}

async function onNotificationClick(n: Notification) {
  if (!n.is_read && n.target_url) {
    try {
      await markRead(n.id)
      notificationsStore.setNotificationRead(n.id)
    } catch {
      // Navigate anyway
    }
  }
}

async function onMarkAllRead() {
  markingAll.value = true
  try {
    await markAllRead()
    await notificationsStore.fetchUnreadCount()
    await fetchNotifications()
  } catch {
    // ignore
  } finally {
    markingAll.value = false
  }
}

onMounted(() => fetchNotifications())
</script>
