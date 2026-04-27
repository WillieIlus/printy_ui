<!-- Purpose: Results section shown after a quote calculation – slotted layout for dominant and supporting shop cards. -->
<template>
  <section class="space-y-4">
    <div class="flex items-center justify-between">
      <h2 class="text-lg font-semibold text-[var(--p-text)]">
        <slot name="title">
          {{ loading ? 'Finding shops…' : hasResults ? `${resultCount} shops found` : 'Results' }}
        </slot>
      </h2>
      <slot name="controls" />
    </div>

    <div v-if="loading" class="flex items-center justify-center py-16">
      <BaseSpinner size="lg" color="primary" />
    </div>

    <template v-else-if="hasResults">
      <slot name="dominant" />
      <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <slot name="supporting" />
      </div>
    </template>

    <div
      v-else
      class="rounded-[var(--radius-md)] border border-[var(--p-border)] bg-[var(--p-surface-container)] py-16 text-center"
    >
      <Icon name="lucide:printer" class="mx-auto mb-3 size-10 text-[var(--p-text-muted)]" />
      <p class="text-sm text-[var(--p-text-muted)]">
        No results yet. Fill in the calculator above to see quotes.
      </p>
    </div>
  </section>
</template>

<script setup lang="ts">
import BaseSpinner from '~/components/atoms/BaseSpinner.vue'

withDefaults(defineProps<{
  loading?: boolean
  resultCount?: number
  hasResults?: boolean
}>(), {
  resultCount: 0,
  hasResults: false,
})
</script>
