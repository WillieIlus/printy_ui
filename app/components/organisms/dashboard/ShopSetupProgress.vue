<!-- Purpose: Shop onboarding checklist with circular progress indicator. -->
<template>
  <div class="rounded-[var(--radius-lg)] border border-[var(--p-border)] bg-[var(--p-surface)] p-5">
    <div class="mb-4 flex items-center justify-between">
      <div>
        <h3 class="text-sm font-semibold text-[var(--p-text)]">Set up your shop</h3>
        <p class="text-xs text-[var(--p-text-muted)]">{{ doneCount }} of {{ steps.length }} complete</p>
      </div>

      <!-- Circular progress -->
      <div class="relative size-12">
        <svg class="size-12 -rotate-90" viewBox="0 0 40 40">
          <circle cx="20" cy="20" r="16" fill="none" stroke="var(--p-border)" stroke-width="3.5" />
          <circle
            cx="20" cy="20" r="16" fill="none"
            stroke="var(--p-accent-strong)"
            stroke-width="3.5"
            stroke-dasharray="100.5"
            :stroke-dashoffset="100.5 - (100.5 * doneCount / steps.length)"
            stroke-linecap="round"
          />
        </svg>
        <span class="absolute inset-0 flex items-center justify-center text-xs font-bold text-primary-600 dark:text-primary-400">
          {{ Math.round(doneCount / steps.length * 100) }}%
        </span>
      </div>
    </div>

    <ul class="space-y-1.5">
      <li
        v-for="step in steps"
        :key="step.id"
        class="flex items-center gap-3 rounded-[var(--radius-sm)] px-2 py-1.5"
      >
        <Icon
          :name="step.done ? 'lucide:check-circle-2' : 'lucide:circle'"
          :class="['size-5 shrink-0', step.done ? 'text-green-500' : 'text-[var(--p-border)]']"
        />
        <span
          :class="[
            'flex-1 text-sm',
            step.done ? 'text-[var(--p-text-muted)] line-through opacity-60' : 'text-[var(--p-text)]',
          ]"
        >
          {{ step.label }}
        </span>
        <NuxtLink
          v-if="!step.done"
          :to="step.href"
          class="text-xs text-primary-600 hover:underline dark:text-primary-400"
        >
          Start →
        </NuxtLink>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
interface SetupStep {
  id: string
  label: string
  done: boolean
  href: string
}

const props = withDefaults(defineProps<{
  steps?: SetupStep[]
}>(), {
  steps: () => [
    { id: 'profile',  label: 'Complete shop profile',  done: false, href: '/dashboard/shop/setup/profile' },
    { id: 'products', label: 'Add your first product', done: false, href: '/dashboard/shop/setup/products' },
    { id: 'pricing',  label: 'Set up pricing rules',   done: false, href: '/dashboard/shop/setup/pricing' },
    { id: 'location', label: 'Add your location',      done: false, href: '/dashboard/shop/setup/location' },
    { id: 'bank',     label: 'Add payment details',    done: false, href: '/dashboard/shop/setup/billing' },
  ],
})

const doneCount = computed(() => props.steps.filter(s => s.done).length)
</script>
