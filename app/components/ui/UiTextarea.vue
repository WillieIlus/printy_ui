<template>
  <BaseTextarea v-bind="mergedProps" @update:model-value="$emit('update:modelValue', $event)" />
</template>

<script setup lang="ts">
import BaseTextarea from '~/components/base/BaseTextarea.vue'

const props = defineProps<{
  modelValue?: string | null
  label?: string
}>()

defineEmits<{
  'update:modelValue': [value: string]
}>()

const attrs = useAttrs()
const mergedProps = computed(() => ({ ...attrs, ...props }))
</script>
