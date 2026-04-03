<template>
  <NuxtLink
    v-if="targetUrl"
    :to="targetUrl"
    class="flex gap-3 rounded-xl border p-4 transition-colors"
    :class="[
      notification.is_read
        ? 'border-[var(--p-border)] bg-[var(--p-surface)]'
        : 'border-flamingo-200 dark:border-flamingo-800 bg-flamingo-50/50 dark:bg-flamingo-900/10',
      'hover:border-flamingo-300 dark:hover:border-flamingo-700 cursor-pointer',
    ]"
    @click="onClick"
  >
    <div
      class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
      :class="iconBgClass"
    >
      <UIcon :name="icon" class="h-4 w-4" :class="iconColorClass" />
    </div>
    <div class="min-w-0 flex-1">
      <div class="flex items-center gap-2">
        <p class="text-sm font-medium text-[var(--p-text)] flex-1 min-w-0">
          {{ notification.message }}
        </p>
        <UBadge v-if="!notification.is_read" color="primary" variant="soft" size="xs" class="shrink-0">
          New
        </UBadge>
      </div>
      <p class="mt-0.5 text-xs text-[var(--p-text-muted)]">
        {{ formatDate(notification.created_at) }}
      </p>
    </div>
  </NuxtLink>
  <div
    v-else
    class="flex gap-3 rounded-xl border p-4"
    :class="notification.is_read
      ? 'border-[var(--p-border)] bg-[var(--p-surface)]'
      : 'border-flamingo-200 dark:border-flamingo-800 bg-flamingo-50/50 dark:bg-flamingo-900/10'"
  >
    <div
      class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
      :class="iconBgClass"
    >
      <UIcon :name="icon" class="h-4 w-4" :class="iconColorClass" />
    </div>
    <div class="min-w-0 flex-1">
      <div class="flex items-center gap-2">
        <p class="text-sm font-medium text-[var(--p-text)] flex-1 min-w-0">
          {{ notification.message }}
        </p>
        <UBadge v-if="!notification.is_read" color="primary" variant="soft" size="xs" class="shrink-0">
          New
        </UBadge>
      </div>
      <p class="mt-0.5 text-xs text-[var(--p-text-muted)]">
        {{ formatDate(notification.created_at) }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Notification, NotificationType } from '~/shared/types/notification'
import { formatDate } from '~/utils/formatters'

const props = defineProps<{
  notification: Notification
}>()

const emit = defineEmits<{
  click: []
}>()

const targetUrl = computed(() => props.notification.target_url || null)

const typeConfig: Record<
  NotificationType,
  { icon: string; iconBgClass: string; iconColorClass: string }
> = {
  quote_request_submitted: {
    icon: 'i-lucide-file-plus',
    iconBgClass: 'bg-flamingo-100 dark:bg-flamingo-900/30',
    iconColorClass: 'text-flamingo-600 dark:text-flamingo-400',
  },
  shop_quote_sent: {
    icon: 'i-lucide-send',
    iconBgClass: 'bg-emerald-100 dark:bg-emerald-900/30',
    iconColorClass: 'text-emerald-600 dark:text-emerald-400',
  },
  shop_quote_revised: {
    icon: 'i-lucide-refresh-cw',
    iconBgClass: 'bg-amber-100 dark:bg-amber-900/30',
    iconColorClass: 'text-amber-600 dark:text-amber-400',
  },
  shop_quote_accepted: {
    icon: 'i-lucide-check-circle',
    iconBgClass: 'bg-green-100 dark:bg-green-900/30',
    iconColorClass: 'text-green-600 dark:text-green-400',
  },
  request_declined: {
    icon: 'i-lucide-x-circle',
    iconBgClass: 'bg-red-100 dark:bg-red-900/30',
    iconColorClass: 'text-red-600 dark:text-red-400',
  },
  quote_request_cancelled: {
    icon: 'i-lucide-x-circle',
    iconBgClass: 'bg-neutral-100 dark:bg-neutral-800',
    iconColorClass: 'text-neutral-600 dark:text-neutral-400',
  },
  job_status_updated: {
    icon: 'i-lucide-briefcase',
    iconBgClass: 'bg-purple-100 dark:bg-purple-900/30',
    iconColorClass: 'text-purple-600 dark:text-purple-400',
  },
}

const config = computed(
  () => typeConfig[props.notification.notification_type] ?? {
    icon: 'i-lucide-bell',
    iconBgClass: 'bg-neutral-100 dark:bg-neutral-800',
    iconColorClass: 'text-neutral-600 dark:text-neutral-400',
  }
)

const icon = computed(() => config.value.icon)
const iconBgClass = computed(() => config.value.iconBgClass)
const iconColorClass = computed(() => config.value.iconColorClass)

function onClick() {
  emit('click')
}
</script>
