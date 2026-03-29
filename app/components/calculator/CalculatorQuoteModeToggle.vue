<template>
  <div class="grid grid-cols-2 gap-2 rounded-md border border-white/10 bg-white/5 p-1">
    <button
      v-for="option in options"
      :key="option.value"
      type="button"
      class="rounded-md px-4 py-2 text-sm font-semibold transition-colors"
      :class="modelValue === option.value
        ? 'bg-flamingo-500 text-white shadow-sm'
        : 'text-slate-300 hover:bg-white/6 hover:text-white'"
      @click="$emit('update:modelValue', option.value)"
    >
      {{ option.label }}
    </button>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  modelValue: string
  options: Array<{ label: string; value: string }>
}>()

defineEmits<{ 'update:modelValue': [value: string] }>()
</script>
