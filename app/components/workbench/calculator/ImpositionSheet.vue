<script setup lang="ts">
import { computed, ref } from 'vue'
import type { DiagramLayoutMode } from '~/shared/imposition-layout'
import { buildImpositionDiagram } from '~/shared/imposition-layout'
import type { ServerProductionPreview } from '~/shared/types'

const props = defineProps<{
  imposition: ServerProductionPreview
}>()

// Visual only. The priced imposition always comes from the server's grid
// layout; 'brick' re-draws the same pieces in a staggered pattern so the buyer
// can see how a brick/staggered arrangement would sit on the parent sheet.
const layoutMode = ref<DiagramLayoutMode>('grid')

function numberish(value: string | number | null | undefined): number | null {
  if (value === null || value === undefined || value === '') {
    return null
  }
  const n = typeof value === 'number' ? value : Number(value)
  return Number.isFinite(n) ? n : null
}

const p = computed(() => props.imposition)

const diagram = computed(() => buildImpositionDiagram({
  cols: p.value.layout?.cols ?? 0,
  rows: p.value.layout?.rows ?? 0,
  pressWidthMm: numberish(p.value.press_sheet?.width_mm),
  pressHeightMm: numberish(p.value.press_sheet?.height_mm),
  mode: layoutMode.value,
}))

// The server's grid is what the price is built from; the brick drawing is not.
const caption = computed(() => (layoutMode.value === 'brick'
  ? 'Same pieces, staggered row by row. Illustrative only — your price is still built from the grid layout.'
  : 'This is the actual imposition your price is built from. Nothing hidden.'))

const layoutLabel = computed(() => (layoutMode.value === 'brick' ? 'Priced layout' : 'Layout'))

const detailRows = computed<Array<[string, string]>>(() => {
  const press = p.value.press_sheet
  const rows: Array<[string, string]> = []
  const pressLabel = [press?.label, numberish(press?.width_mm) && numberish(press?.height_mm)
    ? `${numberish(press!.width_mm)}\u00d7${numberish(press!.height_mm)}mm`
    : null].filter(Boolean).join(' \u00b7 ')
  if (pressLabel) {
    rows.push(['Press sheet', pressLabel])
  }
  if (p.value.layout?.cols && p.value.layout.rows) {
    rows.push([layoutLabel.value, `${p.value.layout.cols} \u00d7 ${p.value.layout.rows}${p.value.layout.orientation === 'rotated' ? ' rotated' : ''}`])
  }
  if (p.value.pieces_per_sheet) {
    rows.push(['Fits per sheet', `${p.value.pieces_per_sheet} up${numberish(p.value.bleed_mm) ? ` (incl. ${p.value.bleed_mm}mm bleed)` : ''}`])
  }
  if (p.value.good_sheets) {
    rows.push(['Good sheets', p.value.good_sheets.toLocaleString()])
  }
  if (p.value.waste_sheets_added != null) {
    const ratePct = numberish(p.value.variable_waste_rate)
    const details = [`${p.value.fixed_waste_sheets ?? 2} fixed`, ratePct != null ? `${Math.round(ratePct * 100)}%` : null]
      .filter(Boolean)
      .join(' + ')
    rows.push(['Spoilage', `+${p.value.waste_sheets_added} (${details})`])
  }
  if (p.value.billable_sheets) {
    rows.push(['You are billed', `${p.value.billable_sheets.toLocaleString()} sheets`])
  }
  return rows
})
</script>

<template>
  <div>
    <div class="flex items-center justify-end">
      <div
        v-if="diagram.cells.length"
        class="flex shrink-0 overflow-hidden rounded-md border text-[9px] font-mono2 uppercase tracking-[0.1em]"
        style="border-color: var(--line)"
        role="group"
        aria-label="Imposition layout style"
      >
        <button
          v-for="mode in (['grid', 'brick'] as DiagramLayoutMode[])"
          :key="mode"
          type="button"
          class="px-1.5 py-0.5 transition-colors"
          :style="layoutMode === mode
            ? { background: 'color-mix(in srgb, var(--accent) 18%, transparent)', color: 'var(--accent)' }
            : { color: 'var(--sub)' }"
          :aria-pressed="layoutMode === mode"
          @click="layoutMode = mode"
        >
          {{ mode }}
        </button>
      </div>
    </div>

    <p class="mt-1 text-[12.5px] leading-relaxed text-[var(--sub)]">
      {{ caption }}
    </p>

    <div class="mt-2.5 flex flex-wrap items-start gap-5">
      <svg
        v-if="diagram.cells.length"
        :viewBox="`0 0 ${diagram.W} ${diagram.H}`"
        class="w-[260px] max-w-full shrink-0 rounded-lg border"
        :style="{ borderColor: 'var(--line)', background: 'var(--panel2)' }"
        role="img"
        :aria-label="`Imposition layout: ${p.layout?.cols} by ${p.layout?.rows} pieces, ${layoutMode} arrangement`"
      >
        <rect
          v-for="(cell, i) in diagram.cells"
          :key="i"
          :x="cell.x + 1"
          :y="cell.y + 1"
          :width="Math.max(cell.w - 2, 1)"
          :height="Math.max(cell.h - 2, 1)"
          rx="1.5"
          fill="color-mix(in srgb, var(--accent) 16%, transparent)"
          stroke="var(--accent)"
          stroke-width="0.8"
        />
      </svg>

      <div class="min-w-[180px] flex-1 space-y-1.5">
        <div
          v-for="[k, v] in detailRows"
          :key="k"
          class="flex items-baseline justify-between gap-3 border-b pb-1.5 last:border-0"
          style="border-color: var(--line)"
        >
          <span class="font-mono2 text-[9px] uppercase tracking-[0.12em] text-[var(--sub)]">{{ k }}</span>
          <span class="text-right text-[12px] font-bold" :style="k === 'You are billed' ? { color: 'var(--accent)' } : {}">{{ v }}</span>
        </div>
      </div>
    </div>

    <p v-if="p.imposition_label" class="pt-1 text-[10.5px] leading-snug text-[var(--sub)]">{{ p.imposition_label }}</p>
  </div>
</template>
