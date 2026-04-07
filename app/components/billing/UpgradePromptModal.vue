<template>
  <UModal v-model:open="open" :dismissible="!loading">
    <template #content>
      <div class="w-full max-w-md rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface)] p-6 shadow-2xl">
        <!-- Icon -->
        <div class="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--color-primary-600)]/10">
          <UIcon name="i-lucide-trending-up" class="h-6 w-6 text-[var(--color-primary-600)]" />
        </div>

        <h2 class="text-lg font-bold text-[var(--p-text)]">Upgrade your plan</h2>
        <p class="mt-2 text-sm leading-6 text-[var(--p-text-dim)]">{{ prompt.message }}</p>

        <!-- Usage bar -->
        <div class="mt-4 rounded-xl border border-[var(--p-border)] bg-[var(--p-surface-sunken)] p-4">
          <BillingUsageMeter
            :label="resourceLabel"
            :icon="resourceIcon"
            :used="prompt.current"
            :limit="prompt.limit"
          />
        </div>

        <!-- Suggested plan -->
        <div v-if="suggestedPlan" class="mt-4 rounded-xl border border-[var(--color-primary-600)]/30 bg-[var(--color-primary-600)]/5 p-4">
          <div class="flex items-start justify-between">
            <div>
              <p class="text-xs font-semibold uppercase tracking-wide text-[var(--color-primary-600)]">Recommended</p>
              <p class="mt-0.5 text-base font-bold text-[var(--p-text)]">{{ suggestedPlan.name }}</p>
              <p class="mt-0.5 text-sm text-[var(--p-text-muted)]">{{ suggestedPlan.public_tagline }}</p>
            </div>
            <div class="text-right shrink-0">
              <p class="text-xl font-extrabold text-[var(--p-text)]">{{ planPrice(suggestedPlan, 'monthly') }}</p>
              <p class="text-xs text-[var(--p-text-muted)]">/month</p>
            </div>
          </div>
          <!-- Shops limit highlight -->
          <div class="mt-3 flex items-center gap-2 text-xs font-medium text-[var(--p-text-dim)]">
            <UIcon name="i-lucide-store" class="h-3.5 w-3.5 text-[var(--color-primary-600)]" />
            {{ suggestedPlan.shops_limit }} shop{{ suggestedPlan.shops_limit !== 1 ? 's' : '' }}
            <span class="mx-1 text-[var(--p-border)]">·</span>
            <UIcon name="i-lucide-cpu" class="h-3.5 w-3.5 text-[var(--color-primary-600)]" />
            {{ suggestedPlan.machines_limit ?? 'Unlimited' }} machines
          </div>
        </div>

        <!-- Actions -->
        <div class="mt-6 flex flex-col gap-2.5 sm:flex-row">
          <button
            v-if="suggestedPlan"
            type="button"
            class="flex-1 rounded-xl bg-[var(--color-primary-600)] px-5 py-3 text-sm font-bold text-white shadow-sm transition-colors hover:bg-[var(--color-primary-500)] disabled:opacity-60"
            :disabled="loading"
            @click="$emit('upgrade', suggestedPlan)"
          >
            <span v-if="loading" class="flex items-center justify-center gap-2">
              <UIcon name="i-lucide-loader-circle" class="h-4 w-4 animate-spin" />
              Processing…
            </span>
            <span v-else>Upgrade to {{ suggestedPlan.name }}</span>
          </button>
          <button
            type="button"
            class="flex-1 rounded-xl border border-[var(--p-border)] bg-[var(--p-surface)] px-5 py-3 text-sm font-semibold text-[var(--p-text)] transition-colors hover:bg-[var(--p-surface-sunken)]"
            :disabled="loading"
            @click="open = false"
          >
            Not now
          </button>
        </div>
      </div>
    </template>
  </UModal>
</template>

<script setup lang="ts">
import { useBillingStore } from '~/stores/billing'
import { useBilling } from '~/composables/useBilling'
import type { Plan, UpgradePrompt } from '~/shared/types/billing'

const props = defineProps<{
  prompt: UpgradePrompt
  loading?: boolean
}>()

defineEmits<{ (e: 'upgrade', plan: Plan): void }>()

const open = defineModel<boolean>({ default: false })

const store = useBillingStore()
const { planPrice } = useBilling()

const suggestedPlan = computed<Plan | null>(() => {
  if (!props.prompt.suggestedPlan) return null
  return store.plans.find(p => p.code === props.prompt.suggestedPlan) ?? null
})

const resourceLabels: Record<string, string> = {
  shop: 'Shops',
  machine: 'Machines',
  product: 'Products',
  quote: 'Quotes this month',
  user: 'Team members',
}
const resourceIcons: Record<string, string> = {
  shop: 'i-lucide-store',
  machine: 'i-lucide-cpu',
  product: 'i-lucide-package',
  quote: 'i-lucide-file-text',
  user: 'i-lucide-users',
}
const resourceLabel = computed(() => resourceLabels[props.prompt.resource] ?? props.prompt.resource)
const resourceIcon = computed(() => resourceIcons[props.prompt.resource] ?? 'i-lucide-alert-circle')
</script>
