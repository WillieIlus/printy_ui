<template>
  <BaseSelect v-bind="mergedProps" @update:model-value="$emit('update:modelValue', $event)" />
</template>

<script setup lang="ts">
import BaseSelect from '~/components/base/BaseSelect.vue'

const props = defineProps<{
  modelValue?: string | number | null
  label?: string
  placeholder?: string
  options: Array<{ value: string | number; label: string }>
}>()

defineEmits<{
  'update:modelValue': [value: string]
}>()

const attrs = useAttrs()
const mergedProps = computed(() => ({ ...attrs, ...props }))
</script>
