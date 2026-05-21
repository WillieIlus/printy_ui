<template>
  <BaseInput v-bind="mergedProps" />
</template>

<script setup lang="ts">
import BaseInput from '~/components/base/BaseInput.vue'

const props = defineProps<{
  modelValue?: string | number | null
  label?: string
}>()

defineEmits<{
  'update:modelValue': [value: string]
}>()

const attrs = useAttrs()
const mergedProps = computed(() => ({ ...attrs, ...props }))
</script>
