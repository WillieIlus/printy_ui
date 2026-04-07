<template>
  <div
    class="relative flex flex-col rounded-2xl border transition-shadow duration-200"
    :class="[
      highlighted
        ? 'border-[var(--color-primary-600)] shadow-xl shadow-[var(--color-primary-600)]/10 dark:border-flamingo-500/70'
        : 'border-[var(--p-border)] shadow-sm hover:shadow-md',
      'bg-[var(--p-surface)]'
    ]"
  >
    <!-- Popular badge -->
    <div v-if="highlighted" class="absolute -top-3.5 left-1/2 -translate-x-1/2">
      <span class="inline-flex items-center gap-1.5 rounded-full bg-[var(--color-primary-600)] px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-white shadow-md">
        <UIcon name="i-lucide-star" class="h-3.5 w-3.5" />
        Most Popular
      </span>
    </div>

    <div class="flex flex-col gap-0 p-6" :class="highlighted ? 'pt-8' : ''">
      <!-- Header -->
      <div class="mb-5">
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-bold text-[var(--p-text)]">{{ plan.name }}</h3>
          <span
            v-if="plan.shops_limit === 1"
            class="inline-flex items-center gap-1 rounded-full bg-[var(--p-surface-sunken)] px-2.5 py-1 text-[11px] font-semibold text-[var(--p-text-dim)]"
          >
            <UIcon name="i-lucide-store" class="h-3 w-3" />
            1 shop
          </span>
          <span
            v-else-if="plan.shops_limit !== null"
            class="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold"
            :class="highlighted
              ? 'bg-[var(--color-primary-600)]/12 text-[var(--color-primary-600)]'
              : 'bg-[var(--p-surface-sunken)] text-[var(--p-text-dim)]'"
          >
            <UIcon name="i-lucide-store" class="h-3 w-3" />
            {{ plan.shops_limit === 5 ? 'Up to 5 shops' : `${plan.shops_limit} shops` }}
          </span>
        </div>
        <p class="mt-1.5 text-sm text-[var(--p-text-muted)]">{{ plan.public_tagline }}</p>
      </div>

      <!-- Price -->
      <div class="mb-6 border-b border-[var(--p-border-dim)] pb-6">
        <div class="flex items-end gap-1.5">
          <span class="text-4xl font-extrabold tracking-tight text-[var(--p-text)]">
            {{ priceDisplay }}
          </span>
          <span v-if="priceSuffix" class="mb-1 text-sm font-medium text-[var(--p-text-muted)]">{{ priceSuffix }}</span>
        </div>
        <p v-if="annualNote" class="mt-1 text-xs text-[var(--p-text-muted)]">{{ annualNote }}</p>
      </div>

      <!-- Benefits -->
      <ul class="mb-6 flex flex-col gap-2.5">
        <li
          v-for="benefit in plan.benefits"
          :key="benefit"
          class="flex items-start gap-2.5 text-sm text-[var(--p-text-dim)]"
        >
          <UIcon
            name="i-lucide-check"
            class="mt-0.5 h-4 w-4 shrink-0 text-emerald-500"
          />
          <span>{{ benefit }}</span>
        </li>
      </ul>

      <!-- CTA -->
      <div class="mt-auto">
        <button
          type="button"
          class="w-full rounded-xl px-5 py-3 text-sm font-bold transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
          :class="ctaClass"
          :disabled="disabled || isCurrent"
          @click="$emit('select', plan)"
        >
          <span v-if="isCurrent" class="flex items-center justify-center gap-2">
            <UIcon name="i-lucide-check-circle-2" class="h-4 w-4" />
            Current plan
          </span>
          <span v-else>{{ ctaLabel }}</span>
        </button>

        <p v-if="plan.code === 'FREE'" class="mt-2 text-center text-xs text-[var(--p-text-muted)]">
          No credit card required
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Plan, BillingInterval } from '~/shared/types/billing'
import { useBilling } from '~/composables/useBilling'

const props = defineProps<{
  plan: Plan
  interval: BillingInterval
  isCurrent?: boolean
  disabled?: boolean
}>()

defineEmits<{ (e: 'select', plan: Plan): void }>()

const { planPrice, planPriceSuffix } = useBilling()

const highlighted = computed(() => props.plan.code === 'BIASHARA_PLUS')

const priceDisplay = computed(() => planPrice(props.plan, props.interval))
const priceSuffix = computed(() => planPriceSuffix(props.plan, props.interval))

const annualNote = computed(() => {
  if (props.interval !== 'annual' || props.plan.code === 'FREE') return null
  const monthly = parseFloat(props.plan.price_monthly)
  if (monthly === 0) return null
  return `KES ${(monthly * 12).toLocaleString()} billed annually`
})

const ctaLabels: Record<string, string> = {
  FREE: 'Start Free',
  BIASHARA: 'Choose Biashara',
  BIASHARA_PLUS: 'Choose Biashara Plus',
  BIASHARA_MAX: 'Choose Biashara Max',
}
const ctaLabel = computed(() => ctaLabels[props.plan.code] ?? `Choose ${props.plan.name}`)

const ctaClass = computed(() => {
  if (props.isCurrent) {
    return 'bg-[var(--p-surface-sunken)] text-[var(--p-text-muted)] cursor-default border border-[var(--p-border)]'
  }
  if (highlighted.value) {
    return 'bg-[var(--color-primary-600)] text-white shadow-lg shadow-[var(--color-primary-600)]/20 hover:bg-[var(--color-primary-500)] focus-visible:outline-[var(--color-primary-600)]'
  }
  return 'border border-[var(--p-border)] bg-[var(--p-surface)] text-[var(--p-text)] hover:bg-[var(--p-surface-sunken)] focus-visible:outline-[var(--p-text)]'
})
</script>
