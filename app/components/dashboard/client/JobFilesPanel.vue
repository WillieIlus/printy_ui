<template>
  <FileLifecyclePanel
    eyebrow="Job files"
    title="Artwork and downloads"
    :files="files"
    empty-title="No job files yet"
    empty-copy="Artwork, print files, and delivery records will appear here as your order moves forward."
  >
    <template #default>
      <div class="rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
        <p class="text-sm font-semibold text-slate-950">Everything stays attached to the order.</p>
        <p class="mt-2 text-sm leading-6 text-slate-500">
          Use this panel to download approved artwork, check file versions, and follow what has already been prepared for production.
        </p>
      </div>
    </template>
  </FileLifecyclePanel>
</template>

<script setup lang="ts">
import type { JobFileRecord } from '~/stores/workflowSpine'
import FileLifecyclePanel from '~/components/workflow/FileLifecyclePanel.vue'

defineProps<{
  files: JobFileRecord[]
}>()
</script>
