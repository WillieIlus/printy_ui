<template>
  <div v-if="status && !isSetupComplete" class="rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface)] p-6 shadow-sm">
    <div class="flex items-center gap-3 mb-4">
      <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 dark:bg-amber-900/30">
        <UIcon name="i-lucide-list-checks" class="h-5 w-5 text-amber-600 dark:text-amber-400" />
      </div>
      <div>
        <h3 class="font-semibold text-[var(--p-text)]">Setup Checklist</h3>
        <p class="text-xs text-[var(--p-text-muted)]">{{ completedCount }}/{{ totalCount }} completed</p>
      </div>
    </div>

    <!-- Progress bar -->
    <div class="h-2 rounded-full bg-gray-200 dark:bg-gray-700 mb-4 overflow-hidden">
      <div class="h-full rounded-full bg-flamingo-500 transition-all duration-500" :style="{ width: `${progressPercent}%` }" />
    </div>

    <!-- Steps list -->
    <div class="space-y-2">
      <NuxtLink
        v-for="step in steps"
        :key="step.key"
        :to="step.route"
        class="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors"
        :class="step.done
          ? 'text-green-600 dark:text-green-400'
          : step.current
            ? 'bg-amber-50 dark:bg-amber-900/10 text-amber-700 dark:text-amber-300 font-medium'
            : 'text-[var(--p-text-muted)]'"
      >
        <UIcon
          :name="step.done ? 'i-lucide-check-circle' : step.current ? 'i-lucide-circle-dot' : 'i-lucide-circle'"
          class="h-5 w-5 shrink-0"
        />
        <span class="flex-1">{{ step.label }}</span>
        <UIcon v-if="step.current" name="i-lucide-arrow-right" class="h-4 w-4 shrink-0" />
      </NuxtLink>
    </div>

    <UButton v-if="!isSetupComplete" color="primary" class="mt-4 w-full" :to="nextRoute">
      {{ status.next_step === 'done' ? 'View Dashboard' : 'Continue Setup' }}
    </UButton>
  </div>
</template>

<script setup lang="ts">
import { useSetupStatus } from '~/composables/useSetupStatus'

const { status, isSetupComplete, nextRoute, STEP_ROUTES } = useSetupStatus()

interface Step { key: string; label: string; done: boolean; current: boolean; route: string }

const steps = computed<Step[]>(() => {
  const s = status.value
  if (!s) return []
  const next = s.next_step
  return [
    { key: 'shop', label: '1. Create your shop', done: s.has_shop, current: next === 'shop', route: STEP_ROUTES.shop },
    { key: 'papers', label: '2. Add paper stock', done: s.has_papers, current: next === 'papers' || next === 'machines', route: STEP_ROUTES.papers },
    { key: 'pricing', label: '3. Set up pricing', done: s.has_pricing, current: next === 'pricing', route: STEP_ROUTES.pricing },
    { key: 'products', label: '4. Publish a product', done: s.has_published_products, current: next === 'products', route: STEP_ROUTES.products },
  ]
})

const totalCount = computed(() => steps.value.length)
const completedCount = computed(() => steps.value.filter(s => s.done).length)
const progressPercent = computed(() => totalCount.value ? (completedCount.value / totalCount.value) * 100 : 0)
</script>
