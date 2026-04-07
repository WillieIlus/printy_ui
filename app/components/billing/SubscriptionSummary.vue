<template>
  <div class="rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface)] shadow-sm overflow-hidden">
    <!-- Status banner -->
    <div
      v-if="showStatusBanner"
      class="px-5 py-3 text-sm font-medium flex items-center gap-2"
      :class="bannerClass"
    >
      <UIcon :name="bannerIcon" class="h-4 w-4 shrink-0" />
      {{ bannerMessage }}
      <button
        v-if="store.isSuspended || store.isPastDue || store.isGracePeriod"
        type="button"
        class="ml-auto shrink-0 rounded-lg px-3 py-1 text-xs font-semibold transition-colors"
        :class="store.isSuspended ? 'bg-white/20 hover:bg-white/30 text-white' : 'bg-white/20 hover:bg-white/30'"
        @click="$emit('renew')"
      >
        Renew now
      </button>
    </div>

    <div class="p-5 sm:p-6">
      <!-- Plan header -->
      <div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div class="flex items-center gap-2.5">
            <h3 class="text-xl font-bold text-[var(--p-text)]">{{ subscription?.plan?.name ?? '—' }}</h3>
            <span
              class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold"
              :class="statusBadgeClass"
            >
              {{ statusLabel }}
            </span>
          </div>
          <p class="mt-1 text-sm text-[var(--p-text-muted)]">{{ subscription?.plan?.public_tagline }}</p>
        </div>
        <div class="flex shrink-0 gap-2">
          <slot name="actions" />
        </div>
      </div>

      <!-- Key dates -->
      <div class="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
        <div class="rounded-xl border border-[var(--p-border)] bg-[var(--p-surface-sunken)] p-3">
          <p class="text-xs text-[var(--p-text-muted)]">Billing</p>
          <p class="mt-0.5 text-sm font-semibold capitalize text-[var(--p-text)]">
            {{ subscription?.billing_interval ?? '—' }}
          </p>
        </div>
        <div class="rounded-xl border border-[var(--p-border)] bg-[var(--p-surface-sunken)] p-3">
          <p class="text-xs text-[var(--p-text-muted)]">Renews</p>
          <p class="mt-0.5 text-sm font-semibold text-[var(--p-text)]">
            {{ renewsAt ?? '—' }}
          </p>
        </div>
        <div class="rounded-xl border border-[var(--p-border)] bg-[var(--p-surface-sunken)] p-3">
          <p class="text-xs text-[var(--p-text-muted)]">Auto-renew</p>
          <p
            class="mt-0.5 text-sm font-semibold"
            :class="subscription?.auto_renew_enabled ? 'text-emerald-600 dark:text-emerald-400' : 'text-[var(--p-text-muted)]'"
          >
            {{ subscription?.auto_renew_enabled ? 'On' : 'Off' }}
          </p>
        </div>
      </div>

      <!-- Linked shops -->
      <div v-if="subscription?.shops?.length" class="mt-5">
        <p class="mb-2 text-xs font-semibold uppercase tracking-wide text-[var(--p-text-muted)]">Linked shops</p>
        <div class="flex flex-wrap gap-2">
          <span
            v-for="s in subscription.shops"
            :key="s.id"
            class="inline-flex items-center gap-1.5 rounded-full border border-[var(--p-border)] bg-[var(--p-surface-sunken)] px-3 py-1 text-xs font-medium text-[var(--p-text-dim)]"
          >
            <UIcon name="i-lucide-store" class="h-3 w-3" />
            {{ s.shop_name }}
            <span v-if="s.is_primary" class="text-[var(--p-text-muted)]">(primary)</span>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useBillingStore } from '~/stores/billing'
import { useBilling } from '~/composables/useBilling'
import type { Subscription } from '~/shared/types/billing'

defineProps<{ subscription: Subscription | null }>()
defineEmits<{ (e: 'renew'): void }>()

const store = useBillingStore()
const { statusLabel: getStatusLabel, statusColor } = useBilling()

const statusLabel = computed(() => getStatusLabel(store.subscription?.status ?? ''))

const statusBadgeClass = computed(() => {
  const s = store.subscription?.status ?? ''
  if (s === 'active' || s === 'trialing')
    return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400'
  if (s === 'grace_period' || s === 'past_due')
    return 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400'
  return 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400'
})

const showStatusBanner = computed(() =>
  store.isSuspended || store.isPastDue || store.isGracePeriod || store.isOverLimit,
)

const bannerClass = computed(() => {
  if (store.isSuspended) return 'bg-red-600 text-white'
  if (store.isPastDue || store.isGracePeriod) return 'bg-amber-500 text-white'
  if (store.isOverLimit) return 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300'
  return ''
})

const bannerIcon = computed(() => {
  if (store.isSuspended) return 'i-lucide-ban'
  if (store.isOverLimit) return 'i-lucide-alert-triangle'
  return 'i-lucide-clock'
})

const bannerMessage = computed(() => {
  if (store.isSuspended) return 'Your subscription is suspended. Renew to restore access.'
  if (store.isGracePeriod) return 'Your subscription is in grace period. Renew to avoid interruption.'
  if (store.isPastDue) return 'Your renewal payment is outstanding. Please pay to continue.'
  if (store.isOverLimit) return 'You are over your plan limits. Upgrade to expand your capacity.'
  return ''
})

const renewsAt = computed(() => {
  const d = store.subscription?.renews_at
  if (!d) return null
  return new Date(d).toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' })
})
</script>
