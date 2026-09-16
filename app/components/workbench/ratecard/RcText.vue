<template>
  <input
    type="text"
    :value="modelValue"
    @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    class="w-full rounded-lg border bg-[var(--panel2)] px-2.5 py-2 text-[12.5px] font-medium outline-none focus:border-[var(--accent)]"
    :style="{ borderColor: 'var(--line)' }"
  />
</template>

<script setup lang="ts">
defineProps<{ modelValue: string }>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()
</script>