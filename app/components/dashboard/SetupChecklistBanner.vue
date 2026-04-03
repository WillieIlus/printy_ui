<template>
  <div v-if="showBanner" class="rounded-xl border border-[var(--p-border)] bg-[var(--p-surface)] p-4 sm:p-5">
    <div class="flex items-start justify-between gap-4">
      <div class="flex items-start gap-3 min-w-0">
        <div class="shrink-0 mt-0.5">
          <UIcon name="i-lucide-rocket" class="h-5 w-5 text-amber-400" />
        </div>
        <div class="min-w-0">
          <p class="text-sm font-semibold text-[var(--p-text)]">Follow the setup sequence</p>
          <p class="mt-0.5 text-xs text-[var(--p-text-muted)]">
            Only the next required section is highlighted. Completed steps stay reviewable and later steps stay intentionally gated.
          </p>
        </div>
      </div>
      <button
        class="shrink-0 text-[var(--p-text-muted)] hover:text-[var(--p-text)] transition-colors"
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
        :class="stepClass(step.state)"
      >
        <UIcon :name="stepIcon(step.state)" class="h-4 w-4 shrink-0" />
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
import { useSetupChecklist } from '~/composables/useSetupChecklist'

const { status, isSetupComplete, nextRoute } = useSetupStatus()
const hidden = useState('setup-banner-hidden', () => false)
const { items: steps } = useSetupChecklist()

const showBanner = computed(() => {
  return !!status.value && !isSetupComplete.value && !hidden.value
})

function dismiss() {
  hidden.value = true
}

function stepClass(state: 'complete' | 'current' | 'blocked') {
  if (state === 'complete') return 'bg-emerald-500/10 text-emerald-400'
  if (state === 'current') return 'bg-amber-400/12 text-amber-300 ring-1 ring-amber-400/30'
  return 'bg-[var(--p-surface-sunken)] text-[var(--p-text-muted)]'
}

function stepIcon(state: 'complete' | 'current' | 'blocked') {
  if (state === 'complete') return 'i-lucide-check-circle'
  if (state === 'current') return 'i-lucide-sparkles'
  return 'i-lucide-lock'
}
</script>
