<template>
  <UiCard class="space-y-4">
    <div>
      <p class="text-sm font-semibold uppercase tracking-[0.18em] text-primary-600">Files and proofs</p>
      <h3 class="mt-2 text-2xl font-black text-slate-950">Current uploaded files</h3>
    </div>
    <div v-if="files.length" class="space-y-3">
      <div v-for="file in files" :key="file.id" class="rounded-2xl border border-slate-200 bg-slate-50 p-4">
        <div class="flex items-start justify-between gap-3">
          <div>
            <p class="text-sm font-semibold text-slate-950">{{ file.original_filename }}</p>
            <p class="mt-1 text-xs text-slate-500">{{ file.file_type }} · version {{ file.version }}</p>
          </div>
          <StatusBadge :value="file.status" />
        </div>
      </div>
    </div>
    <UiEmptyState v-else eyebrow="Files" title="No files are visible yet." description="This route only shows backend-confirmed files." />
  </UiCard>
</template>

<script setup lang="ts">
import StatusBadge from '~/components/ui/UiStatusBadge.vue'
import UiCard from '~/components/ui/UiCard.vue'
import UiEmptyState from '~/components/ui/UiEmptyState.vue'

defineProps<{
  files: Array<Record<string, any>>
}>()
</script>
