<template>
  <div class="space-y-6">
    <DashboardPageHeader
      title="Setup Guide"
      subtitle="Essential setup is centralized here so missing requirements are obvious and calm."
    />

    <section class="rounded-3xl border border-[var(--p-border)] bg-[var(--p-surface)] p-6 shadow-sm">
      <div class="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p class="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--p-text-muted)]">Shop Readiness</p>
          <h2 class="mt-2 text-2xl font-semibold text-[var(--p-text)]">{{ selectedShop ? selectedShop.name : 'No shop selected' }}</h2>
          <p class="mt-2 max-w-2xl text-sm leading-6 text-[var(--p-text-muted)]">
            Finish the missing essentials in order. Each link opens the page that owns the action.
          </p>
          <p class="mt-3 text-sm font-medium text-[var(--p-text)]">{{ summary }}</p>
        </div>
        <div class="flex flex-col items-start gap-3">
          <UBadge :color="nextRequiredItem ? 'warning' : 'success'" variant="soft" size="lg">
            {{ nextRequiredItem ? 'Needs setup' : 'Ready to quote' }}
          </UBadge>
          <UButton v-if="setupStatus?.next_url" :to="setupStatus.next_url" variant="soft" color="primary">
            Open backend next step
          </UButton>
        </div>
      </div>

      <div class="mt-5">
        <div class="h-2 overflow-hidden rounded-full bg-[var(--p-surface-sunken)]">
          <div class="h-full rounded-full bg-orange-500 transition-all" :style="{ width: `${progressPercent}%` }" />
        </div>
      </div>

      <div class="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <NuxtLink
          v-for="card in guideItems"
          :key="card.label"
          :to="card.to"
          class="rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface-sunken)] p-4 transition hover:border-orange-300 dark:hover:border-orange-700"
        >
          <div class="flex items-start justify-between gap-3">
            <span class="flex h-10 w-10 items-center justify-center rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface)]">
              <UIcon :name="card.icon" class="h-4 w-4" />
            </span>
            <UBadge :color="card.state === 'complete' ? 'success' : card.state === 'required' ? 'warning' : 'neutral'" variant="soft" size="xs">
              {{ card.state === 'complete' ? 'Complete' : card.state === 'required' ? 'Required' : 'Missing' }}
            </UBadge>
          </div>
          <h3 class="mt-4 text-sm font-semibold text-[var(--p-text)]">{{ card.label }}</h3>
          <p class="mt-2 text-sm leading-6 text-[var(--p-text-muted)]">{{ card.description }}</p>
          <UButton :to="card.to" variant="soft" color="primary" class="mt-4 w-full justify-center">
            {{ card.state === 'complete' ? 'Review' : card.state === 'required' ? 'Complete now' : 'Open section' }}
          </UButton>
        </NuxtLink>
      </div>
    </section>

    <section class="rounded-3xl border border-[var(--p-border)] bg-[var(--p-surface)] p-6 shadow-sm">
      <p class="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--p-text-muted)]">Guidance</p>
      <h2 class="mt-2 text-2xl font-semibold text-[var(--p-text)]">How this workspace now works</h2>
      <div class="mt-4 grid gap-3 md:grid-cols-3">
        <div class="rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface-sunken)] p-4">
          <p class="text-sm font-medium text-[var(--p-text)]">One master navigation</p>
          <p class="mt-2 text-sm leading-6 text-[var(--p-text-muted)]">The left sidebar is the source of truth. Sections are no longer duplicated in multiple overview cards.</p>
        </div>
        <div class="rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface-sunken)] p-4">
          <p class="text-sm font-medium text-[var(--p-text)]">Contextual actions</p>
          <p class="mt-2 text-sm leading-6 text-[var(--p-text-muted)]">Create and edit actions live inside the relevant page instead of being repeated across unrelated screens.</p>
        </div>
        <div class="rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface-sunken)] p-4">
          <p class="text-sm font-medium text-[var(--p-text)]">Stable pages over large modals</p>
          <p class="mt-2 text-sm leading-6 text-[var(--p-text-muted)]">Long forms now use page or side-panel layouts, while small confirmations can remain lightweight.</p>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { useAdminWorkspace } from '~/composables/useAdminWorkspace'
import { useSetupChecklist } from '~/composables/useSetupChecklist'
import { useSetupStatus } from '~/composables/useSetupStatus'
import { useShopStore } from '~/stores/shop'

definePageMeta({
  layout: 'dashboard',
  middleware: ['auth'],
})

const shopStore = useShopStore()
const { status: setupStatus, refresh } = useSetupStatus()
const { selectedShop } = useAdminWorkspace()
const {
  items: guideItems,
  summary,
  progressPercent,
  nextRequiredItem,
} = useSetupChecklist()

onMounted(async () => {
  await shopStore.fetchMyShops()
  await shopStore.ensureActiveShop()
  await refresh(shopStore.selectedShopSlug)
})
</script>
