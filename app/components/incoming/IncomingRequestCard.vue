<template>
  <NuxtLink
    :to="`/dashboard/shops/${shopSlug}/incoming-requests/${request.id}`"
    class="group block rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface-raised)] p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
    :class="accentBorderClass"
  >
    <div class="flex items-start justify-between gap-3">
      <div class="min-w-0 flex-1">
        <div class="flex flex-wrap items-center gap-2">
          <span class="h-2.5 w-2.5 shrink-0 rounded-full" :class="statusDotClass" />
          <h3 class="truncate text-base font-semibold text-[var(--p-text)]">
            {{ request.customer_name || 'No customer name' }}
          </h3>
          <IncomingRequestStatusBadge :status="request.status" class="shrink-0" />
        </div>
        <p class="mt-1 text-sm text-[var(--p-text-muted)]">
          Request #{{ request.id }} | {{ relativeDate }}
        </p>
      </div>

      <span
        class="inline-flex shrink-0 items-center gap-2 rounded-xl bg-flamingo-500 px-3.5 py-2 text-sm font-semibold text-white shadow-sm transition-colors group-hover:bg-flamingo-400"
      >
        {{ actionLabel }}
        <UIcon name="i-lucide-arrow-right" class="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
      </span>
    </div>

    <div class="mt-4 grid gap-3 text-sm sm:grid-cols-2">
      <div class="min-w-0">
        <p class="text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-[var(--p-text-muted)]">Contact</p>
        <p class="mt-1 truncate text-[var(--p-text-dim)]">{{ contactLine }}</p>
      </div>
      <div class="min-w-0">
        <p class="text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-[var(--p-text-muted)]">Job</p>
        <p class="mt-1 text-[var(--p-text-dim)]">
          {{ request.items_count }} item{{ request.items_count !== 1 ? 's' : '' }}
          <template v-if="request.delivery_preference">
            | {{ deliveryLabel }}
          </template>
        </p>
      </div>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
import type { IncomingRequestList } from '~/shared/types/incomingRequest'
import { formatDate } from '~/utils/formatters'

const props = defineProps<{
  request: IncomingRequestList
  shopSlug: string
}>()

const deliveryLabel = computed(() => {
  const pref = props.request.delivery_preference
  if (pref === 'pickup') return 'Pickup'
  if (pref === 'delivery') return 'Delivery'
  return pref ?? ''
})

const actionLabel = computed(() => {
  if (props.request.status === 'submitted') return 'Review now'
  if (['closed', 'cancelled', 'expired', 'rejected'].includes(props.request.status)) return 'View history'
  return 'Continue'
})

const relativeDate = computed(() => formatDate(props.request.created_at))

const contactLine = computed(() => {
  return props.request.customer_email || props.request.customer_phone || 'No contact details'
})

const statusDotClass = computed(() => {
  if (props.request.status === 'submitted') return 'bg-flamingo-500'
  if (props.request.status === 'awaiting_client_reply') return 'bg-amber-500'
  if (props.request.status === 'quoted') return 'bg-emerald-500'
  if (['closed', 'cancelled', 'expired', 'rejected'].includes(props.request.status)) return 'bg-slate-400'
  return 'bg-slate-500'
})

const accentBorderClass = computed(() => {
  if (props.request.status === 'submitted') return 'border-l-[3px] border-l-flamingo-500'
  if (props.request.status === 'awaiting_client_reply') return 'border-l-[3px] border-l-amber-500'
  if (props.request.status === 'quoted') return 'border-l-[3px] border-l-emerald-500'
  if (['closed', 'cancelled', 'expired', 'rejected'].includes(props.request.status)) return 'border-l-[3px] border-l-slate-400'
  return 'border-l-[3px] border-l-[var(--p-border-dim)]'
})
</script>
