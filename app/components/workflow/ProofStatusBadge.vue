<template>
  <span class="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold" :class="workflowToneClass(proofTone(status))">
    <Icon name="lucide:file-check-2" class="size-3.5" />
    {{ humanizeWorkflowValue(status) }}
  </span>
</template>

<script setup lang="ts">
import { humanizeWorkflowValue, proofTone, workflowToneClass } from '~/utils/workflowUi'

defineProps<{
  status?: string | null
}>()
</script>
