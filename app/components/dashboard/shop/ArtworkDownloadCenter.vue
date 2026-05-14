<template>
  <FileLifecyclePanel
    eyebrow="Artwork center"
    title="Assignment files and proofs"
    :files="files"
    empty-title="No files yet"
    empty-copy="Customer uploads, proofs, and print-ready files will appear here when the assignment starts moving."
  >
    <template #default>
      <div class="rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
        <p class="text-sm font-semibold text-slate-950">Revision control stays attached to the assignment.</p>
        <p class="mt-2 text-sm leading-6 text-slate-500">
          Download the approved pack, keep proof versions visible, and use file actions here so prepress and print-ready state stay synchronized.
        </p>
      </div>
    </template>
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
