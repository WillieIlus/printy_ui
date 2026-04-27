<template>
  <div class="relative min-h-screen bg-[var(--p-bg)]">
    <div class="absolute inset-x-0 top-0 -z-10 h-72 bg-[radial-gradient(circle_at_top_left,_rgba(225,53,21,0.12),_transparent_45%),radial-gradient(circle_at_top_right,_rgba(255,184,0,0.12),_transparent_40%)]" />

    <div class="mx-auto max-w-3xl px-4 py-16 md:px-6 md:py-24">
      <div class="space-y-10">

        <!-- Header -->
        <div class="space-y-3">
          <p class="text-xs font-bold uppercase tracking-[0.3em] text-[var(--p-primary)]">Quote workspace</p>
          <h1 class="text-3xl font-bold tracking-tight text-[var(--p-text)] md:text-4xl">
            Ready when you are
          </h1>
          <p class="max-w-lg text-sm leading-6 text-[var(--p-text-muted)]">
            Head back to the calculator to price a new job, or pick up where you left off below.
          </p>
        </div>

        <!-- Draft recovery panel -->
        <ClientDraftRecoveryPanel />

        <!-- Actions -->
        <div class="flex flex-wrap gap-3">
          <BaseButton to="/" variant="primary" size="lg">
            Start a new quote
          </BaseButton>
          <BaseButton to="/dashboard/client" variant="secondary" size="lg">
            Go to my dashboard
          </BaseButton>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import BaseButton from '~/components/ui/BaseButton.vue'
import ClientDraftRecoveryPanel from '~/components/dashboard/client/ClientDraftRecoveryPanel.vue'

definePageMeta({
  middleware: ['auth'],
})
</script>
