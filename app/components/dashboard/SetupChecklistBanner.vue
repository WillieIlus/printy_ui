<template>
  <div v-if="showBanner" class="rounded-xl border border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-900/20 p-4 sm:p-5">
    <div class="flex items-start justify-between gap-4">
      <div class="flex items-start gap-3 min-w-0">
        <div class="shrink-0 mt-0.5">
          <UIcon name="i-lucide-rocket" class="h-5 w-5 text-amber-600 dark:text-amber-400" />
        </div>
        <div class="min-w-0">
          <p class="text-sm font-semibold text-amber-800 dark:text-amber-200">Complete your shop setup</p>
          <p v-if="status?.blocking_reason" class="mt-0.5 text-xs text-amber-700 dark:text-amber-300">
            {{ status.blocking_reason }}
          </p>
        </div>
      </div>
      <button
        class="shrink-0 text-amber-500 hover:text-amber-700 dark:hover:text-amber-300 transition-colors"
        aria-label="Dismiss setup banner"
        @click="dismiss()"
      >
        <UIcon name="i-lucide-x" class="h-4 w-4" />
      </button>
    </div>

    <!-- Steps -->
    <div class="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2">
      <div
        v-for="step in steps"
        :key="step.key"
        class="flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium"
        :class="stepClass(step)"
      >
        <UIcon :name="stepIcon(step)" class="h-4 w-4 shrink-0" />
        <span class="truncate">{{ step.label }}</span>
      </div>
    </div>

    <div class="mt-4 flex items-center gap-3">
      <UButton color="primary" size="sm" :to="nextRoute" class="shadow-sm">
        Continue setup
        <UIcon name="i-lucide-arrow-right" class="h-3.5 w-3.5 ml-1" />
      </UButton>
      <UButton variant="soft" color="neutral" size="sm" @click="dismiss()">
        Dismiss for now
      </UButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useSetupStatus } from '~/composables/useSetupStatus'

const { status, isSetupComplete, nextRoute } = useSetupStatus()

interface Step { key: string; label: string; done: boolean; current: boolean }

const hidden = useState('setup-banner-hidden', () => false)

const steps = computed<Step[]>(() => {
  const s = status.value
  if (!s) return []
  const next = s.next_step
  return [
    { key: 'shop', label: 'Create Shop', done: s.has_shop, current: next === 'shop' },
    { key: 'materials', label: 'Add Materials', done: !!s.has_materials, current: next === 'materials' },
    { key: 'pricing', label: 'Add Pricing', done: s.has_pricing, current: next === 'pricing' },
    { key: 'finishing', label: 'Add Finishing', done: s.has_finishing, current: next === 'finishing' },
    { key: 'products', label: 'Add Product', done: !!s.has_products, current: next === 'products' },
  ]
})

const showBanner = computed(() => {
  return !!status.value && !isSetupComplete.value && !hidden.value
})

function dismiss() {
  hidden.value = true
}

function stepClass(step: Step) {
  if (step.done) return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
  if (step.current) return 'bg-amber-200/60 dark:bg-amber-800/40 text-amber-800 dark:text-amber-200 ring-1 ring-amber-300 dark:ring-amber-700'
  return 'bg-gray-100 dark:bg-gray-800/50 text-gray-400 dark:text-gray-500'
}

function stepIcon(step: Step) {
  if (step.done) return 'i-lucide-check-circle'
  if (step.current) return 'i-lucide-circle-dot'
  return 'i-lucide-circle'
}
</script>
