<template>
  <div
    v-if="showPanel"
    class="rounded-xl border border-violet-200 dark:border-violet-800/50 bg-violet-50/50 dark:bg-violet-950/20 p-4 space-y-3"
  >
    <h4 class="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
      <UIcon name="i-lucide-layout-grid" class="h-4 w-4 text-violet-500 dark:text-violet-400" />
      Imposition
    </h4>
    <ul class="space-y-2 text-sm">
      <li class="flex items-center gap-2 text-gray-700 dark:text-gray-300">
        <span class="text-gray-500 dark:text-gray-400">Ups per sheet:</span>
        <span class="font-medium text-gray-900 dark:text-white">{{ upsPerSheet }}</span>
        <span v-if="isEstimated" class="text-xs text-amber-600 dark:text-amber-400">(demo)</span>
      </li>
      <li class="flex items-center gap-2 text-gray-700 dark:text-gray-300">
        <span class="text-gray-500 dark:text-gray-400">Quantity:</span>
        <span class="font-medium text-gray-900 dark:text-white">{{ quantity }}</span>
      </li>
      <li class="flex items-center gap-2 text-gray-700 dark:text-gray-300">
        <span class="text-gray-500 dark:text-gray-400">Sheets needed:</span>
        <span class="font-semibold text-violet-600 dark:text-violet-400">{{ sheetsNeeded }}</span>
      </li>
      <li
        v-if="hasRounding"
        class="flex items-center gap-2 text-amber-700 dark:text-amber-400 text-xs italic"
      >
        <UIcon name="i-lucide-info" class="h-3.5 w-3.5 shrink-0" />
        Rounded up to whole sheets
      </li>
    </ul>
    <p
      class="text-sm text-gray-600 dark:text-gray-400 font-mono bg-white/60 dark:bg-gray-800/60 rounded-lg px-3 py-2 border border-gray-200 dark:border-gray-700"
    >
      {{ explanationText }}
    </p>
  </div>
</template>

<script setup lang="ts">
/**
 * ImpositionPanel — Shows imposition logic (ups per sheet, sheets needed) with magic arithmetic.
 * Works with or without backend fields; uses template metadata or sensible defaults as fallback.
 */
const props = withDefaults(
  defineProps<{
    /** Number of pieces ordered */
    quantity: number
    /** Ups per sheet from backend (optional) */
    upsPerSheetFromBackend?: number | null
    /** Ups per sheet from template metadata (e.g. piecesPerSheet, imposition_count) */
    upsPerSheetFromTemplate?: number | null
    /** Sheets needed from backend (optional) */
    sheetsNeededFromBackend?: number | null
    /** Sensible default when nothing else is available */
    defaultUpsPerSheet?: number
    /** Hide panel when quantity or ups is invalid */
    hideWhenInvalid?: boolean
  }>(),
  { defaultUpsPerSheet: 25, hideWhenInvalid: true }
)

const upsPerSheet = computed(() => {
  if (props.upsPerSheetFromBackend != null && props.upsPerSheetFromBackend > 0) {
    return props.upsPerSheetFromBackend
  }
  if (props.upsPerSheetFromTemplate != null && props.upsPerSheetFromTemplate > 0) {
    return props.upsPerSheetFromTemplate
  }
  return props.defaultUpsPerSheet
})

const isEstimated = computed(() => {
  return (
    (props.upsPerSheetFromBackend == null || props.upsPerSheetFromBackend <= 0) &&
    (props.upsPerSheetFromTemplate == null || props.upsPerSheetFromTemplate <= 0)
  )
})

const sheetsNeeded = computed(() => {
  if (props.sheetsNeededFromBackend != null && props.sheetsNeededFromBackend > 0) {
    return props.sheetsNeededFromBackend
  }
  return Math.ceil(props.quantity / upsPerSheet.value)
})

const hasRounding = computed(() => {
  const raw = props.quantity / upsPerSheet.value
  return raw > 0 && raw !== Math.floor(raw)
})

const explanationText = computed(() => {
  const q = props.quantity
  const u = upsPerSheet.value
  const raw = q / u
  const sheets = sheetsNeeded.value
  return `${q} ÷ ${u} = ${raw.toFixed(2)} → ${sheets} sheets`
})

const showPanel = computed(() => {
  if (props.hideWhenInvalid && (props.quantity <= 0 || upsPerSheet.value <= 0)) {
    return false
  }
  return true
})
</script>
