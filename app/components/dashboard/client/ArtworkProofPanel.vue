<template>
  <FileLifecyclePanel
    eyebrow="Artwork and proofs"
    title="Files and proofs"
    :files="files"
    empty-title="No files yet"
    empty-copy="Artwork, proofs, and delivery evidence will appear here as Printy moves the job forward."
  />
</template>

<script setup lang="ts">
import type { JobFileRecord } from '~/stores/workflowSpine'
import FileLifecyclePanel from '~/components/workflow/FileLifecyclePanel.vue'

defineProps<{
  files: JobFileRecord[]
}>()
</script>
