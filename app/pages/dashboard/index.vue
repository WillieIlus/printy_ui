<template>
  <div class="space-y-6">
    <DashboardPageHeader
      title="Overview"
      subtitle="A calmer admin workspace. Pick a section from the left and work there."
    >
      <div class="mt-2 flex flex-wrap gap-2">
        <UBadge color="neutral" variant="soft">{{ selectedShop ? selectedShop.name : 'No shop selected' }}</UBadge>
        <UBadge
          :color="setupStatus?.next_step === 'done' ? 'success' : 'warning'"
          variant="soft"
        >
          {{ setupStatus?.next_step === 'done' ? 'Setup complete' : 'Setup in progress' }}
        </UBadge>
      </div>
    </DashboardPageHeader>

    <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <article
        v-for="metric in metrics"
        :key="metric.label"
        class="rounded-3xl border border-[var(--p-border)] bg-[var(--p-surface)] p-5 shadow-sm"
      >
        <div class="flex items-center justify-between gap-3">
          <div>
            <p class="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--p-text-muted)]">{{ metric.label }}</p>
            <p class="mt-3 text-3xl font-semibold text-[var(--p-text)]">{{ metric.value }}</p>
          </div>
          <span class="flex h-11 w-11 items-center justify-center rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface-sunken)]">
            <UIcon :name="metric.icon" class="h-5 w-5" />
          </span>
        </div>
        <p class="mt-3 text-sm leading-6 text-[var(--p-text-muted)]">{{ metric.note }}</p>
      </article>
    </div>

    <div class="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
      <section class="rounded-3xl border border-[var(--p-border)] bg-[var(--p-surface)] p-6 shadow-sm">
        <div class="flex items-start justify-between gap-4">
          <div>
            <p class="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--p-text-muted)]">Next Up</p>
            <h2 class="mt-2 text-2xl font-semibold text-[var(--p-text)]">Setup Guide</h2>
            <p class="mt-2 max-w-2xl text-sm leading-6 text-[var(--p-text-muted)]">
              Essential setup is centralized here so you no longer need to hunt across cards, shortcuts, and modal entry points.
            </p>
          </div>
          <UButton to="/dashboard/setup-guide" color="primary" variant="soft">
            Open guide
          </UButton>
        </div>

        <div class="mt-6 space-y-3">
          <NuxtLink
            v-for="item in checklistItems"
            :key="item.label"
            :to="item.to"
            class="flex items-center justify-between gap-4 rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface-sunken)] px-4 py-4 transition hover:border-orange-300 dark:hover:border-orange-700"
          >
            <div class="flex min-w-0 items-start gap-3">
              <span class="mt-0.5 flex h-10 w-10 items-center justify-center rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface)]">
                <UIcon :name="item.icon" class="h-4 w-4" />
              </span>
              <div class="min-w-0">
                <p class="text-sm font-medium text-[var(--p-text)]">{{ item.label }}</p>
                <p class="mt-1 text-sm text-[var(--p-text-muted)]">{{ item.description }}</p>
              </div>
            </div>
            <UBadge :color="item.state === 'complete' ? 'success' : item.state === 'required' ? 'warning' : 'neutral'" variant="soft">
              {{ item.state === 'complete' ? 'Complete' : item.state === 'required' ? 'Required' : 'Missing' }}
            </UBadge>
          </NuxtLink>
        </div>
      </section>

      <section class="rounded-3xl border border-[var(--p-border)] bg-[var(--p-surface)] p-6 shadow-sm">
        <p class="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--p-text-muted)]">Readiness</p>
        <h2 class="mt-2 text-2xl font-semibold text-[var(--p-text)]">Setup Progress</h2>
        <p class="mt-2 text-sm leading-6 text-[var(--p-text-muted)]">
          {{ summary }}
        </p>

        <div class="mt-5">
          <div class="h-2 overflow-hidden rounded-full bg-[var(--p-surface-sunken)]">
            <div class="h-full rounded-full bg-orange-500 transition-all" :style="{ width: `${progressPercent}%` }" />
          </div>
        </div>

        <div class="mt-5 rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface-sunken)] p-4">
          <p class="text-sm font-medium text-[var(--p-text)]">
            {{ nextRequiredItem ? `${nextRequiredItem.label} is the next required setup step.` : 'Core setup is complete.' }}
          </p>
          <p class="mt-1 text-sm leading-6 text-[var(--p-text-muted)]">
            {{ nextRequiredItem ? nextRequiredItem.description : 'You can now manage day-to-day admin work without essential setup gaps.' }}
          </p>
          <UButton v-if="nextRequiredItem" :to="nextRequiredItem.to" color="primary" variant="soft" class="mt-4">
            Open next step
          </UButton>
        </div>

        <div class="mt-6 grid gap-3">
          <div
            v-for="item in checklistItems"
            :key="item.key"
            class="rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface-sunken)] px-4 py-4"
          >
            <div class="flex items-start justify-between gap-3">
              <div class="flex items-start gap-3">
                <span class="flex h-10 w-10 items-center justify-center rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface)]">
                  <UIcon :name="item.icon" class="h-4 w-4" />
                </span>
                <div>
                  <p class="text-sm font-medium text-[var(--p-text)]">{{ item.label }}</p>
                  <p class="mt-1 text-sm leading-6 text-[var(--p-text-muted)]">{{ item.description }}</p>
                </div>
              </div>
              <UBadge :color="item.state === 'complete' ? 'success' : item.state === 'required' ? 'warning' : 'neutral'" variant="soft" size="xs">
                {{ item.state === 'complete' ? 'Complete' : item.state === 'required' ? 'Required' : 'Missing' }}
              </UBadge>
            </div>
            <div class="mt-3">
              <UButton v-if="item.state !== 'complete'" :to="item.to" variant="soft" color="primary" size="sm">
                Open section
              </UButton>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useSetupStatus } from '~/composables/useSetupStatus'
import { useAdminWorkspace } from '~/composables/useAdminWorkspace'
import { useSetupChecklist } from '~/composables/useSetupChecklist'

definePageMeta({
  layout: 'dashboard',
  middleware: ['auth', 'setup-guard'],
})

const { status: setupStatus } = useSetupStatus()
const { selectedShop } = useAdminWorkspace()
const {
  items: checklistItems,
  summary,
  progressPercent,
  nextRequiredItem,
} = useSetupChecklist()

const metrics = computed(() => [
  {
    label: 'Shop',
    value: selectedShop.value ? '1 active' : '0',
    note: selectedShop.value ? 'You are working inside one shop workspace at a time.' : 'Create a shop to begin setup.',
    icon: 'i-lucide-store',
  },
  {
    label: 'Machines',
    value: setupStatus.value?.has_machines ? 'Ready' : 'Missing',
    note: 'Machine setup controls equipment-aware pricing and product routing.',
    icon: 'i-lucide-printer',
  },
  {
    label: 'Pricing',
    value: setupStatus.value?.has_pricing ? 'Ready' : 'Missing',
    note: 'Pricing lives in its own section instead of being repeated elsewhere.',
    icon: 'i-lucide-banknote',
  },
  {
    label: 'Products',
    value: setupStatus.value?.has_published_products ? 'Ready' : 'Missing',
    note: 'Products remain contextual to the product page and publish flow.',
    icon: 'i-lucide-package',
  },
])
</script>
