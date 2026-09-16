<script setup lang="ts">
import { computed } from 'vue'
import type { Imposition } from '~/shared/workflow/pricing'

const props = defineProps<{ imp: Imposition }>()

const W = 260
const scale = computed(() => W / props.imp.sheet.w)
const H = computed(() => props.imp.sheet.h * scale.value)
const pw = computed(() => props.imp.pieceW * scale.value)
const ph = computed(() => props.imp.pieceH * scale.value)
const cells = computed(() => {
  const arr: { x: number; y: number }[] = []
  for (let r = 0; r < props.imp.rows; r++)
    for (let c = 0; c < props.imp.cols; c++) arr.push({ x: c * pw.value, y: r * ph.value })
  return arr
})
const corners: Array<[number, number]> = [
  [0, 0],
  [W, 0],
  [0, H.value],
  [W, H.value],
]
const facts = computed(() => {
  const rows: Array<[string, string]> = [
    ['Press sheet', `${props.imp.sheet.label} · ${props.imp.sheet.w}×${props.imp.sheet.h}mm`],
    ['Layout', `${props.imp.cols} × ${props.imp.rows} ${props.imp.orientation}`],
    ['Fits per sheet', `${props.imp.copiesPerSheet} up (incl. ${props.imp.bleed}mm bleed)`],
  ]
  if (props.imp.sheetsPerCopy)
    rows.push(['Sheets per copy', `${props.imp.sheetsPerCopy} (${props.imp.pagesPerSheet}pp per sheet)`])
  rows.push(
    ['Good sheets', props.imp.goodSheets.toLocaleString()],
    ['Spoilage', `+${props.imp.wasteSheets} (2 fixed + 10%)`],
    ['You are billed', `${props.imp.billableSheets.toLocaleString()} sheets`],
  )
  return rows
})
</script>

<template>
  <div class="flex flex-wrap items-center gap-5">
    <svg :width="W" :height="H" class="shrink-0 overflow-visible">
      <rect x="0" y="0" :width="W" :height="H" rx="3" fill="var(--panel2)" stroke="var(--line)" stroke-width="1" />
      <rect
        v-for="(c, i) in cells"
        :key="i"
        class="calc-cell"
        :style="{ animationDelay: `${Math.min(i * 0.012, 0.5)}s` }"
        :x="c.x + 1.5"
        :y="c.y + 1.5"
        :width="Math.max(pw - 3, 1)"
        :height="Math.max(ph - 3, 1)"
        rx="1.5"
        fill="color-mix(in srgb, var(--accent) 18%, transparent)"
        stroke="var(--accent)"
        stroke-width="0.8"
      />
      <g v-for="([x, y], i) in corners" :key="i" stroke="var(--sub)" stroke-width="1">
        <line :x1="x - 6" :y1="y" :x2="x + 6" :y2="y" />
        <line :x1="x" :y1="y - 6" :x2="x" :y2="y + 6" />
      </g>
    </svg>
    <div class="min-w-[180px] flex-1 space-y-2">
      <div v-for="[k, v] in facts" :key="k" class="flex items-baseline justify-between gap-3 border-b pb-1.5 last:border-0" style="border-color: var(--line)">
        <span class="font-mono2 text-[9.5px] uppercase tracking-[0.14em] text-[var(--sub)]">{{ k }}</span>
        <span class="text-right font-disp text-[12.5px] font-semibold" :style="{ color: k === 'You are billed' ? 'var(--accent)' : 'var(--ink)' }">{{ v }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.calc-cell {
  transform-origin: center;
  animation: calc-pop 0.3s ease both;
}
@keyframes calc-pop {
  from { opacity: 0; transform: scale(0.6); }
  to { opacity: 1; transform: scale(1); }
}
</style>