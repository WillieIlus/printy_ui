<template>
  <FileLifecyclePanel
    eyebrow="Proof review"
    title="Proofs waiting on you"
    :files="proofFiles"
    empty-title="No proofs to review"
    empty-copy="When a proof is ready, you will see it here before production moves ahead."
  >
    <template #default>
      <div class="rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
        <p class="text-sm font-semibold text-slate-950">Review carefully before approval.</p>
        <p class="mt-2 text-sm leading-6 text-slate-500">
          Printy will keep proof revisions here so you can confirm the latest version without chasing updates across different channels.
        </p>
      </div>
    </template>
  </FileLifecyclePanel>
</template>

<script setup lang="ts">
import type { JobFileRecord } from '~/stores/workflowSpine'
import FileLifecyclePanel from '~/components/workflow/FileLifecyclePanel.vue'

const props = defineProps<{
  files: JobFileRecord[]
}>()

const proofFiles = computed(() =>
  props.files.filter(file => ['proof', 'print_ready'].includes(String(file.file_type ?? ''))),
)
</script>
