<script setup lang="ts">
import { AlertCircle } from 'lucide-vue-next'
import { cx } from '../../../utils/design/cx'

/**
 * Field-level validation message. The caller keeps its existing validation
 * trigger and only swaps the old ad-hoc text for this design primitive.
 */
const props = withDefaults(defineProps<{
  message?: string
  class?: string
}>(), {
  message: '',
  class: undefined,
})
</script>

<template>
  <p
    v-if="props.message"
    :class="cx('mt-1.5 flex items-start gap-1.5 text-[11.5px] leading-snug font-medium text-red', props.class)"
    role="alert"
    data-design-field-error
  >
    <AlertCircle :size="12" class="mt-px shrink-0" aria-hidden="true" />
    <span>{{ props.message }}</span>
  </p>
</template>
