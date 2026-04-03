<template>
  <div class="space-y-6">
    <DashboardPageHeader
      title="Setup Guide"
      subtitle="Follow one guided onboarding path from shop setup through quote-ready products."
    />

    <section class="rounded-3xl border border-[var(--p-border)] bg-[var(--p-surface)] p-6 shadow-sm">
      <div class="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p class="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--p-text-muted)]">Shop Readiness</p>
          <h2 class="mt-2 text-2xl font-semibold text-[var(--p-text)]">{{ selectedShop ? selectedShop.name : 'No shop selected' }}</h2>
          <p class="mt-2 max-w-2xl text-sm leading-6 text-[var(--p-text-muted)]">
            Complete one step at a time. Finished sections stay reviewable, the current required step stands out, and later sections stay intentionally gated.
          </p>
          <p class="mt-3 text-sm font-medium text-[var(--p-text)]">{{ summary }}</p>
        </div>
        <div class="flex flex-col items-start gap-3">
          <UBadge :color="nextRequiredItem ? 'warning' : 'success'" variant="soft" size="lg" :class="nextRequiredItem ? 'setup-current-badge' : ''">
            {{ nextRequiredItem ? `Next: ${nextRequiredItem.label}` : 'Ready to quote' }}
          </UBadge>
          <UButton v-if="nextRoute" :to="nextRoute" variant="soft" color="primary">
            {{ nextRequiredItem ? 'Complete now' : 'Review workspace' }}
          </UButton>
        </div>
      </div>

      <div class="mt-5">
        <div class="h-2 overflow-hidden rounded-full bg-[var(--p-surface-sunken)]">
          <div class="h-full rounded-full bg-emerald-500 transition-all" :style="{ width: `${progressPercent}%` }" />
        </div>
      </div>

      <div class="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <article
          v-for="card in guideItems"
          :key="card.label"
          class="rounded-2xl border p-4 transition"
          :class="cardClass(card)"
        >
          <div class="flex items-start justify-between gap-3">
            <span class="flex h-10 w-10 items-center justify-center rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface)]">
              <UIcon :name="card.icon" class="h-4 w-4" />
            </span>
            <UBadge :color="badgeColor(card.state)" variant="soft" size="xs" :class="card.state === 'current' ? 'setup-current-badge' : ''">
              {{ badgeLabel(card.state) }}
            </UBadge>
          </div>
          <h3 class="mt-4 text-sm font-semibold text-[var(--p-text)]">{{ card.label }}</h3>
          <p class="mt-2 text-sm leading-6 text-[var(--p-text-muted)]">{{ card.description }}</p>
          <p class="mt-3 flex items-center gap-2 text-xs text-[var(--p-text-muted)]">
            <UIcon :name="card.state === 'blocked' ? 'i-lucide-lock' : card.state === 'complete' ? 'i-lucide-check-circle-2' : 'i-lucide-sparkles'" class="h-3.5 w-3.5 shrink-0" />
            <span>{{ card.helper }}</span>
          </p>
          <UButton :to="card.ctaTo" :variant="card.state === 'current' ? 'solid' : 'soft'" :color="card.state === 'complete' ? 'success' : card.state === 'current' ? 'warning' : 'neutral'" class="mt-4 w-full justify-center">
            {{ card.ctaLabel }}
          </UButton>
        </article>
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
const { refresh, nextRoute } = useSetupStatus()
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

function badgeColor(state: 'complete' | 'current' | 'blocked') {
  if (state === 'complete') return 'success'
  if (state === 'current') return 'warning'
  return 'neutral'
}

function badgeLabel(state: 'complete' | 'current' | 'blocked') {
  if (state === 'complete') return 'Complete'
  if (state === 'current') return 'Current step'
  return 'Blocked'
}

function cardClass(card: typeof guideItems.value[number]) {
  if (card.state === 'complete') {
    return 'border-emerald-300/45 bg-[color:color-mix(in_oklab,var(--p-surface)_88%,rgb(16_185_129)_8%)]'
  }

  if (card.state === 'current') {
    return 'setup-current-card border-amber-300/70 bg-[color:color-mix(in_oklab,var(--p-surface)_84%,rgb(245_158_11)_12%)] shadow-[0_14px_34px_rgba(245,158,11,0.08)]'
  }

  return `border-[color:color-mix(in_oklab,var(--p-border)_88%,transparent)] bg-[color:color-mix(in_oklab,var(--p-surface-sunken)_92%,transparent)] opacity-90 before:hidden`
}
</script>

<style scoped>
@keyframes setup-glow {
  0%, 100% {
    box-shadow: 0 0 0 0 rgba(245, 158, 11, 0.16);
  }

  50% {
    box-shadow: 0 0 0 10px rgba(245, 158, 11, 0);
  }
}

.setup-current-card {
  animation: setup-glow 2.4s ease-in-out infinite;
}

.setup-current-badge {
  animation: setup-glow 2.4s ease-in-out infinite;
}
</style>
