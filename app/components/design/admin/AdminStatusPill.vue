<script setup lang="ts">
import { computed } from 'vue'
import DesignStatusPill from '../ui/StatusPill.vue'
import { STATUS_META, type Status } from '~/shared/workflow/printy'
import type { StatusTone } from '~/types/design/status-tone'

/**
 * Maps Printy's workflow status onto the design status scale. Status is always
 * icon + label + colour; the label still comes from Printy's STATUS_META, so
 * no new state or wording is introduced.
 */
const props = withDefaults(defineProps<{ status: Status; class?: string }>(), {
  class: undefined,
})

const TONES: Record<Status, StatusTone> = {
  'on-track': 'ontrack',
  'at-risk': 'atrisk',
  overdue: 'late',
  disputed: 'late',
  completed: 'delivered',
}

const tone = computed(() => TONES[props.status])
</script>

<template>
  <DesignStatusPill :tone="tone" :class="props.class">{{ STATUS_META[props.status].label }}</DesignStatusPill>
</template>
