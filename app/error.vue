<template>
  <div class="min-h-screen bg-[var(--p-bg)] px-6 py-10 text-[var(--p-text)]">
    <div class="mx-auto flex min-h-[calc(100vh-5rem)] max-w-xl items-center justify-center">
      <div class="w-full rounded-[1.75rem] border border-[var(--p-border)] bg-[color:color-mix(in_srgb,var(--p-surface)_94%,black_6%)] p-8 text-center shadow-[0_24px_60px_-28px_rgba(15,23,42,0.72)] sm:p-10">
        <div class="mx-auto mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl border border-rose-700/70 bg-[rgb(94_25_36)] text-rose-300">
        <UIcon name="i-lucide-alert-circle" class="w-8 h-8" />
        </div>
        <p class="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--p-text-muted)]">Application error</p>
        <h1 class="mt-2 text-2xl font-bold text-[var(--p-text)]">
          Something went wrong
        </h1>
        <p class="mt-3 text-sm leading-6 text-[var(--p-text-muted)]">
          {{ error?.message ?? 'An unexpected error occurred.' }}
        </p>
        <div class="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          <UButton color="primary" size="lg" class="rounded-xl bg-flamingo-500 text-white hover:bg-flamingo-600" @click="handleRetry">
            Try again
          </UButton>
          <UButton to="/" variant="soft" color="neutral" size="lg" class="rounded-xl">
            Go home
          </UButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAnalyticsTracking } from '~/composables/useAnalyticsTracking'

const error = useError()
const { trackFrontendError } = useAnalyticsTracking()

onMounted(() => {
  if (error.value) {
    void trackFrontendError(error.value, {
      source: 'nuxt_error_page',
      fatal: true,
    })
  }
})

function handleRetry() {
  clearError({ redirect: '/' })
}
</script>
