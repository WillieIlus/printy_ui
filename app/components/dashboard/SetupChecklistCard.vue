<template>
  <div v-if="status && !isSetupComplete" class="rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface)] p-6 shadow-sm">
    <div class="flex items-center gap-3 mb-4">
      <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
        <UIcon name="i-lucide-list-checks" class="h-5 w-5" />
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
        :to="step.ctaTo"
        class="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors"
        :class="rowClass(step.state)"
      >
        <UIcon :name="stepIcon(step.state)" class="h-5 w-5 shrink-0" />
        <span class="flex-1">{{ step.label }}</span>
        <span class="text-[11px] uppercase tracking-[0.14em]">{{ step.ctaLabel }}</span>
      </NuxtLink>
    </div>

    <UButton v-if="!isSetupComplete" color="primary" class="mt-4 w-full" :to="nextRoute">
      Continue Setup
    </UButton>
  </div>
</template>

<script setup lang="ts">
import { useSetupStatus } from '~/composables/useSetupStatus'
import { useSetupChecklist } from '~/composables/useSetupChecklist'

const { status, isSetupComplete, nextRoute } = useSetupStatus()
const { items: steps } = useSetupChecklist()

const totalCount = computed(() => steps.value.length)
const completedCount = computed(() => steps.value.filter(s => s.done).length)
const progressPercent = computed(() => totalCount.value ? (completedCount.value / totalCount.value) * 100 : 0)

function rowClass(state: 'complete' | 'current' | 'blocked') {
  if (state === 'complete') return 'bg-emerald-500/8 text-emerald-400'
  if (state === 'current') return 'bg-amber-400/10 text-amber-300 ring-1 ring-amber-400/30'
  return 'text-[var(--p-text-muted)]'
}

function stepIcon(state: 'complete' | 'current' | 'blocked') {
  if (state === 'complete') return 'i-lucide-check-circle'
  if (state === 'current') return 'i-lucide-sparkles'
  return 'i-lucide-lock'
}
</script>
