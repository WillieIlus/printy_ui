<template>
  <div class="space-y-4">
    <div v-if="quotes?.length" class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <QuotesQuoteCard v-for="q in quotes" :key="q.id" :quote="q">
        <template #actions>
          <slot name="card-actions" :quote="q" />
        </template>
      </QuotesQuoteCard>
    </div>
    <DashboardEmptyState
      v-else
      title="No incoming requests"
      description="New quote requests from customers will appear here when they submit."
      icon="i-lucide-file-text"
    >
      <slot name="empty-actions" />
    </DashboardEmptyState>
  </div>
</template>

<script setup lang="ts">
import type { Quote } from '~/shared/types'
defineProps<{ quotes?: Quote[] }>()
</script>
