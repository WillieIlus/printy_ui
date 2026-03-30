<template>
  <div
    v-if="showPanel"
    class="space-y-3 rounded-xl border border-violet-500/20 bg-[var(--p-surface-container-low)] p-4"
  >
    <h4 class="flex items-center gap-2 text-sm font-semibold text-[var(--p-text)]">
      <UIcon name="i-lucide-layout-grid" class="h-4 w-4 text-violet-500 dark:text-violet-400" />
      Imposition
    </h4>
    <ul v-if="hasBackendValues" class="space-y-2 text-sm">
      <li class="flex items-center gap-2 text-[var(--p-text-dim)]">
        <span class="text-[var(--p-text-muted)]">Pcs per sheet:</span>
        <span class="font-medium text-[var(--p-text)]">{{ upsPerSheetFromBackend }}</span>
      </li>
      <li class="flex items-center gap-2 text-[var(--p-text-dim)]">
        <span class="text-[var(--p-text-muted)]">Sheets required:</span>
        <span class="font-semibold text-violet-600 dark:text-violet-400">{{ sheetsNeededFromBackend }}</span>
      </li>
    </ul>
    <p
      v-if="backendNote"
      class="rounded-lg border border-[var(--p-border)] bg-[var(--p-surface-container-low)] px-3 py-2 text-sm text-[var(--p-text-dim)]"
    >
      {{ backendNote }}
    </p>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  upsPerSheetFromBackend?: number | null
  sheetsNeededFromBackend?: number | null
  backendNote?: string | null
}>()

const hasBackendValues = computed(() =>
  props.upsPerSheetFromBackend != null && props.sheetsNeededFromBackend != null
)

const showPanel = computed(() => hasBackendValues.value || Boolean(props.backendNote))
</script>
