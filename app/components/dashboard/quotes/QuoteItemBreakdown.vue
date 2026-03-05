<template>
  <details class="group">
    <summary class="flex items-center gap-2 cursor-pointer text-sm text-[var(--p-text-muted)] hover:text-[var(--p-text-dim)] list-none">
      <UIcon name="i-lucide-chevron-right" class="w-4 h-4 transition-transform group-open:rotate-90" />
      Pricing breakdown
    </summary>
    <div class="mt-2 pl-6 border-l-2 border-[var(--p-border)]">
      <div class="space-y-1.5 text-sm">
        <div v-if="snapshot.paper_label" class="flex justify-between">
          <span class="text-[var(--p-text-muted)]">Paper</span>
          <span class="text-[var(--p-text)]">{{ snapshot.paper_label }}</span>
        </div>
        <div v-if="snapshot.paper_cost" class="flex justify-between">
          <span class="text-[var(--p-text-muted)]">Paper cost</span>
          <span class="text-[var(--p-text)]">{{ formatKES(snapshot.paper_cost) }}</span>
        </div>
        <div v-if="snapshot.print_cost" class="flex justify-between">
          <span class="text-[var(--p-text-muted)]">Print</span>
          <span class="text-[var(--p-text)]">{{ formatKES(snapshot.print_cost) }}</span>
        </div>
        <div v-if="snapshot.material_cost" class="flex justify-between">
          <span class="text-[var(--p-text-muted)]">Material</span>
          <span class="text-[var(--p-text)]">{{ formatKES(snapshot.material_cost) }}</span>
        </div>
        <div v-if="snapshot.finishing_total" class="flex justify-between">
          <span class="text-[var(--p-text-muted)]">Finishing</span>
          <span class="text-[var(--p-text)]">{{ formatKES(snapshot.finishing_total) }}</span>
        </div>
        <div v-if="snapshot.finishing_lines?.length" class="mt-1 space-y-0.5">
          <div
            v-for="(line, i) in snapshot.finishing_lines"
            :key="i"
            class="flex justify-between text-xs pl-2"
          >
            <span class="text-[var(--p-text-muted)]">{{ line.name }}</span>
            <span class="text-[var(--p-text-dim)]">{{ formatKES(line.computed_cost) }}</span>
          </div>
        </div>
        <div v-if="snapshot.line_total" class="flex justify-between font-medium pt-2 border-t border-[var(--p-border)]">
          <span class="text-[var(--p-text)]">Line total</span>
          <span class="text-[var(--p-text)]">{{ formatKES(snapshot.line_total) }}</span>
        </div>
      </div>
    </div>
  </details>
</template>

<script setup lang="ts">
import type { StaffPricingSnapshot } from '~/shared/types'
import { formatKES } from '~/utils/formatters'

defineProps<{
  snapshot: StaffPricingSnapshot
}>()
</script>
