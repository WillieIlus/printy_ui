<template>
  <div class="inline-flex flex-col" :style="{ width: `${width}px` }">
    <div
      class="inline-flex items-center gap-1 rounded-lg border px-2 py-1.5 transition-colors"
      :style="{
        borderColor: invalid ? '#C81E44' : 'var(--line)',
        background: invalid ? 'rgba(200,30,68,.06)' : 'var(--panel2)',
      }"
    >
      <span v-if="prefix" class="shrink-0 font-mono2 text-[9px] text-[var(--sub)]">{{ prefix }}</span>
      <input
        :value="draft"
        type="text"
        inputmode="decimal"
        :placeholder="placeholder"
        :disabled="disabled"
        :data-row="rowKey || undefined"
        :data-field="field || undefined"
        :aria-invalid="invalid"
        class="w-full bg-transparent font-mono2 text-[12px] font-semibold outline-none placeholder:opacity-50 disabled:opacity-40"
        @input="onInput"
        @focus="focused = true"
        @blur="onBlur"
        @keydown.enter.prevent="emit('enter')"
      >
    </div>
    <span v-if="error" class="mt-1 text-[10px] leading-snug" style="color: #C81E44">{{ error }}</span>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

const props = withDefaults(defineProps<{
  value: string | number | null
  prefix?: string
  width?: number
  disabled?: boolean
  placeholder?: string
  invalid?: boolean
  error?: string
  rowKey?: string
  field?: string
}>(), {
  prefix: '',
  width: 96,
  disabled: false,
  placeholder: '',
  invalid: false,
  error: '',
  rowKey: '',
  field: '',
})

const emit = defineEmits<{
  change: [value: string]
  enter: []
}>()

const focused = ref(false)
const draft = ref(formatValue(props.value))

function formatValue(value: string | number | null | undefined): string {
  return value == null ? '' : String(value)
}

watch(
  () => props.value,
  (value) => {
    if (!focused.value) draft.value = formatValue(value)
  },
)

function onInput(event: Event) {
  draft.value = (event.target as HTMLInputElement).value
  emit('change', draft.value)
}

function onBlur() {
  focused.value = false
  if (!props.invalid && !props.error) {
    draft.value = formatValue(props.value)
  }
}
</script>
