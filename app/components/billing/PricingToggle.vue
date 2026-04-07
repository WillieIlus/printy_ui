<template>
  <div class="flex flex-col items-center gap-3">
    <div class="inline-flex items-center rounded-full border border-[var(--p-border)] bg-[var(--p-surface)] p-1 shadow-sm">
      <button
        type="button"
        class="rounded-full px-5 py-2 text-sm font-semibold transition-all"
        :class="modelValue === 'monthly'
          ? 'bg-[var(--color-primary-600)] text-white shadow-sm'
          : 'text-[var(--p-text-muted)] hover:text-[var(--p-text)]'"
        @click="$emit('update:modelValue', 'monthly')"
      >
        Monthly
      </button>
      <button
        type="button"
        class="rounded-full px-5 py-2 text-sm font-semibold transition-all"
        :class="modelValue === 'annual'
          ? 'bg-[var(--color-primary-600)] text-white shadow-sm'
          : 'text-[var(--p-text-muted)] hover:text-[var(--p-text)]'"
        @click="$emit('update:modelValue', 'annual')"
      >
        Annual
      </button>
    </div>
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <span
        v-if="modelValue === 'annual'"
        class="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400"
      >
        <UIcon name="i-lucide-tag" class="h-3.5 w-3.5" />
        Save ~2 months with annual billing
      </span>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import type { BillingInterval } from '~/shared/types/billing'

defineProps<{ modelValue: BillingInterval }>()
defineEmits<{ (e: 'update:modelValue', val: BillingInterval): void }>()
</script>
