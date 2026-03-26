<template>
  <section class="rounded-3xl border border-[var(--p-border)] bg-[var(--p-surface)] p-5 shadow-sm">
    <div class="flex items-start justify-between gap-4">
      <div>
        <p class="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--p-text-muted)]">Backend Preview</p>
        <h3 class="mt-2 text-xl font-semibold text-[var(--p-text)]">
          {{ totalLabel }}
        </h3>
        <p v-if="preview?.reason" class="mt-2 text-sm text-[var(--p-text-muted)]">{{ preview.reason }}</p>
      </div>
      <UBadge :color="preview?.can_calculate === false ? 'warning' : 'success'" variant="soft">
        {{ preview?.can_calculate === false ? 'Needs attention' : 'Ready' }}
      </UBadge>
    </div>

    <div v-if="preview?.paper || preview?.printing || preview?.totals" class="mt-5 grid gap-3 md:grid-cols-3">
      <article class="rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface-sunken)] p-4">
        <p class="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--p-text-muted)]">Paper</p>
        <p class="mt-2 text-sm font-medium text-[var(--p-text)]">{{ preview?.paper?.label || 'Not selected' }}</p>
        <p class="mt-1 text-sm text-[var(--p-text-muted)]">{{ preview?.totals?.paper_cost || '0' }}</p>
      </article>
      <article class="rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface-sunken)] p-4">
        <p class="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--p-text-muted)]">Printing</p>
        <p class="mt-2 text-sm font-medium text-[var(--p-text)]">{{ preview?.printing?.machine_name || 'Not selected' }}</p>
        <p class="mt-1 text-sm text-[var(--p-text-muted)]">{{ preview?.totals?.print_cost || '0' }}</p>
      </article>
      <article class="rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface-sunken)] p-4">
        <p class="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--p-text-muted)]">Imposition</p>
        <p class="mt-2 text-sm font-medium text-[var(--p-text)]">{{ preview?.copies_per_sheet ?? 0 }} up</p>
        <p class="mt-1 text-sm text-[var(--p-text-muted)]">{{ preview?.good_sheets ?? 0 }} good sheets</p>
      </article>
    </div>

    <div v-if="preview?.finishings?.length" class="mt-5 space-y-3">
      <h4 class="text-sm font-semibold text-[var(--p-text)]">Finishing Breakdown</h4>
      <article
        v-for="line in preview.finishings"
        :key="`${line.slug || line.name}-${line.selected_side || 'both'}`"
        class="rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface-sunken)] p-4"
      >
        <div class="flex items-start justify-between gap-3">
          <div>
            <p class="text-sm font-medium text-[var(--p-text)]">{{ line.name }}</p>
            <p class="mt-1 text-xs uppercase tracking-[0.12em] text-[var(--p-text-muted)]">
              {{ line.billing_basis }} · {{ line.side_mode }}
            </p>
            <p
              v-if="isLamination(line)"
              class="mt-2 text-sm text-[var(--p-text-muted)]"
            >
              {{ preview.good_sheets || 0 }} good sheets × {{ line.rate || '0' }} × {{ line.selected_side_count || 1 }} side(s)
            </p>
            <p
              v-else
              class="mt-2 text-sm text-[var(--p-text-muted)]"
            >
              {{ line.units || 1 }} unit(s) × {{ line.rate || '0' }}
            </p>
          </div>
          <p class="text-sm font-semibold text-[var(--p-text)]">{{ line.total }}</p>
        </div>
      </article>
    </div>

    <div v-if="preview?.suggestions?.length" class="mt-5 rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface-sunken)] p-4">
      <p class="text-sm font-semibold text-[var(--p-text)]">Suggestions</p>
      <p
        v-for="suggestion in preview.suggestions"
        :key="suggestion.code || suggestion.message"
        class="mt-2 text-sm text-[var(--p-text-muted)]"
      >
        {{ suggestion.message }}
      </p>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { PreviewPriceResponse } from '~/shared/types/buyer'

const props = defineProps<{
  preview: PreviewPriceResponse | null
}>()

const totalLabel = computed(() => props.preview?.totals?.grand_total || props.preview?.total || 'Awaiting preview')

function isLamination(line: NonNullable<PreviewPriceResponse['finishings']>[number]) {
  const name = `${line.slug || ''} ${line.name || ''}`.toLowerCase()
  return name.includes('lamination')
}
</script>
