<template>
  <div
    class="inline-flex items-center gap-1 rounded-lg border px-2 py-1.5"
    :style="{ width: `${width}px`, borderColor: 'var(--line)', background: 'var(--panel2)' }"
  >
    <span v-if="prefix" class="shrink-0 font-mono2 text-[9px] text-[var(--sub)]">{{ prefix }}</span>
    <input
      type="text"
      inputmode="decimal"
      :value="value ?? ''"
      :placeholder="placeholder"
      :disabled="disabled"
      class="w-full bg-transparent font-mono2 text-[12px] font-semibold outline-none placeholder:opacity-50 disabled:opacity-40"
      @input="emit('change', ($event.target as HTMLInputElement).value)"
    />
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  value: string | number | null
  prefix?: string
  width?: number
  disabled?: boolean
  placeholder?: string
}>(), {
  prefix: '',
  width: 96,
  disabled: false,
  placeholder: '',
})

const emit = defineEmits<{
  change: [value: string]
}>()
</script>