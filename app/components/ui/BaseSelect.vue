<!-- Purpose: Reusable labeled select primitive for simple starter forms. -->
<template>
  <label class="flex flex-col gap-2 text-sm text-[var(--p-text-muted)]">
    <span class="font-medium text-[var(--p-text)]">{{ label }}</span>
    <div class="relative">
      <select
        :id="id"
        :value="modelValue"
        :name="name"
        :required="required"
        :disabled="disabled"
        :class="selectClass"
        v-bind="$attrs"
        @change="onChange"
      >
        <option
          v-for="option in options"
          :key="option.value"
          :value="option.value"
        >
          {{ option.label }}
        </option>
      </select>
      <span class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4 text-[color:color-mix(in_srgb,var(--p-text)_74%,var(--p-text-muted))]">
        <svg viewBox="0 0 20 20" fill="currentColor" class="h-4 w-4" aria-hidden="true">
          <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.17l3.71-3.94a.75.75 0 1 1 1.08 1.04l-4.25 4.5a.75.75 0 0 1-1.08 0l-4.25-4.5a.75.75 0 0 1 .02-1.06Z" clip-rule="evenodd" />
        </svg>
      </span>
    </div>
    <p v-if="hint && !error" class="text-xs text-[var(--p-text-muted)]">{{ hint }}</p>
    <p v-if="error" role="alert" class="text-xs font-medium text-[var(--p-error)]">{{ error }}</p>
  </label>
</template>

<script setup lang="ts">
defineOptions({
  inheritAttrs: false,
})

type SelectOption = {
  label: string
  value: string
}

const props = withDefaults(defineProps<{
  label: string
  modelValue?: string
  options: SelectOption[]
  id?: string
  name?: string
  hint?: string
  error?: string
  required?: boolean
  disabled?: boolean
}>(), {
  modelValue: '',
  id: undefined,
  name: undefined,
  hint: '',
  error: '',
  required: false,
  disabled: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const selectClass = computed(() => [
  'min-h-11 w-full appearance-none rounded-[1rem] border px-4 py-3 pr-12 text-[var(--p-text)] outline-none transition duration-150 focus:-translate-y-px disabled:cursor-not-allowed disabled:opacity-70',
  'border-[color:color-mix(in_srgb,var(--p-border)_92%,transparent)] bg-[color:color-mix(in_srgb,var(--p-surface)_96%,white)]',
  'shadow-[inset_0_1px_0_rgba(255,255,255,0.4),0_1px_2px_rgba(15,23,42,0.06)]',
  'disabled:bg-[color:color-mix(in_srgb,var(--p-bg-soft)_92%,white)] disabled:text-[var(--p-text-muted)]',
  props.error
    ? 'border-[var(--p-error)] focus:border-[var(--p-error)] focus:ring-4 focus:ring-[color:var(--p-error-soft)]'
    : 'focus:border-[color:color-mix(in_srgb,var(--p-primary)_78%,white)] focus:ring-4 focus:ring-[color:var(--p-primary-soft)] focus:shadow-[0_0_0_1px_color-mix(in_srgb,var(--p-primary)_16%,transparent),0_4px_12px_rgba(15,23,42,0.08)]',
])

const onChange = (event: Event) => {
  emit('update:modelValue', (event.target as HTMLSelectElement).value)
}
</script>
