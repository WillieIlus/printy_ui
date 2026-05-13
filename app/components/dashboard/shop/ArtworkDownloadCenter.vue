<template>
  <FileLifecyclePanel
    eyebrow="Artwork center"
    title="Assignment files and proofs"
    :files="files"
    empty-title="No files yet"
    empty-copy="Customer uploads, proofs, and print-ready files will appear here when the assignment starts moving."
  >
    <template #actions="{ file }">
      <slot name="actions" :file="file" />
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
