<template>
  <DesignWorkflowRail
    :stages="stages"
    :current-note="currentNote"
    :current-number="currentNumber"
    :total-stages="totalStages"
    :aria-label="`Stage ${currentNumber} of ${totalStages}`"
  />
</template>

<script setup lang="ts">
import DesignWorkflowRail from '~/components/design/tracker/WorkflowRail.vue'

/**
 * Buyer ticket stepper. The rail itself is the shared workspace workflow
 * component, so the buyer tracker draws the exact same stages as the manager
 * and printer dashboards.
 */
interface Stage {
  key: string
  label: string
  status: string
}

withDefaults(
  defineProps<{
    stages: Stage[]
    currentNote?: string
    currentNumber?: number
    totalStages?: number
  }>(),
  { currentNote: '', currentNumber: 1, totalStages: 7 },
)
</script>
