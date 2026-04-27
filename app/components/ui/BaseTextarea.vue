<!-- Purpose: Reusable labeled textarea primitive with the same tactile field treatment as other controls. -->
<template>
  <label class="flex flex-col gap-2 text-sm text-[var(--p-text-muted)]">
    <span class="font-medium text-[var(--p-text)]">{{ label }}</span>
    <textarea
      :id="id"
      :value="modelValue"
      :placeholder="placeholder"
      :name="name"
      :required="required"
      :disabled="disabled"
      :rows="rows"
      :class="textareaClass"
      v-bind="$attrs"
      @input="onInput"
    />
    <p v-if="hint && !error" class="text-xs text-[var(--p-text-muted)]">{{ hint }}</p>
    <p v-if="error" role="alert" class="text-xs font-medium text-[var(--p-error)]">{{ error }}</p>
  </label>
</template>

<script setup lang="ts">
defineOptions({
  inheritAttrs: false,
})

const props = withDefaults(defineProps<{
  label: string
  modelValue?: string
  placeholder?: string
  id?: string
  name?: string
  hint?: string
  error?: string
  required?: boolean
  disabled?: boolean
  rows?: number
}>(), {
  modelValue: '',
  placeholder: '',
  id: undefined,
  name: undefined,
  hint: '',
  error: '',
  required: false,
  disabled: false,
  rows: 4,
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const textareaClass = computed(() => [
  'min-h-[7rem] rounded-[1rem] border px-4 py-3 text-[var(--p-text)] outline-none transition duration-150 placeholder:text-[color:color-mix(in_srgb,var(--p-text-muted)_84%,transparent)] focus:-translate-y-px disabled:cursor-not-allowed disabled:opacity-70',
  'border-[color:color-mix(in_srgb,var(--p-border)_92%,transparent)] bg-[color:color-mix(in_srgb,var(--p-surface)_96%,white)]',
  'shadow-[inset_0_1px_0_rgba(255,255,255,0.4),0_1px_2px_rgba(15,23,42,0.06)]',
  'disabled:bg-[color:color-mix(in_srgb,var(--p-bg-soft)_92%,white)] disabled:text-[var(--p-text-muted)]',
  props.error
    ? 'border-[var(--p-error)] focus:ring-4 focus:ring-[color:var(--p-error-soft)]'
    : 'focus:border-[color:color-mix(in_srgb,var(--p-primary)_78%,white)] focus:ring-4 focus:ring-[color:var(--p-primary-soft)] focus:shadow-[0_0_0_1px_color-mix(in_srgb,var(--p-primary)_16%,transparent),0_4px_12px_rgba(15,23,42,0.08)]',
])

function onInput(event: Event) {
  emit('update:modelValue', (event.target as HTMLTextAreaElement).value)
}
</script>
