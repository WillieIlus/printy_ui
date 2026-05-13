<!-- Purpose: Reusable labeled text input primitive. -->
<template>
  <label class="flex flex-col gap-2 text-sm text-[var(--p-text-muted)]">
    <span class="font-medium text-[var(--p-text)]">{{ label }}</span>
    <div class="relative">
      <input
        :id="id"
        :value="modelValue"
        :type="resolvedType"
        :placeholder="placeholder"
        :name="name"
        :autocomplete="autocomplete"
        :required="required"
        :disabled="disabled"
        :class="inputClass"
        v-bind="$attrs"
        @input="onInput"
      >
      <button
        v-if="showPasswordToggle"
        type="button"
        class="absolute inset-y-0 right-0 inline-flex items-center justify-center px-3 text-[var(--p-text-muted)] transition hover:text-[var(--p-text)] focus-visible:outline-none focus-visible:text-[var(--p-text)] disabled:cursor-not-allowed disabled:opacity-60"
        :aria-label="passwordVisible ? 'Hide password' : 'Show password'"
        :aria-pressed="passwordVisible"
        :aria-controls="id"
        :disabled="disabled"
        @click="togglePasswordVisibility"
      >
        <Icon :name="passwordVisible ? 'lucide:eye-off' : 'lucide:eye'" class="size-4" />
      </button>
    </div>
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
  modelValue?: string | number
  placeholder?: string
  type?: string
  id?: string
  name?: string
  autocomplete?: string
  hint?: string
  error?: string
  required?: boolean
  disabled?: boolean
}>(), {
  modelValue: '',
  placeholder: '',
  type: 'text',
  id: undefined,
  name: undefined,
  autocomplete: undefined,
  hint: '',
  error: '',
  required: false,
  disabled: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const passwordVisible = ref(false)
const showPasswordToggle = computed(() => props.type === 'password')
const resolvedType = computed(() => {
  if (!showPasswordToggle.value) return props.type
  return passwordVisible.value ? 'text' : 'password'
})

const inputClass = computed(() => [
  'min-h-11 rounded-[1rem] border px-4 py-3 text-[var(--p-text)] outline-none transition duration-150 placeholder:text-[color:color-mix(in_srgb,var(--p-text-muted)_84%,transparent)] focus:-translate-y-px disabled:cursor-not-allowed disabled:opacity-70',
  'border-[color:color-mix(in_srgb,var(--p-border)_92%,transparent)] bg-[color:color-mix(in_srgb,var(--p-surface)_96%,white)]',
  'shadow-[inset_0_1px_0_rgba(255,255,255,0.4),0_1px_2px_rgba(15,23,42,0.06)]',
  'disabled:bg-[color:color-mix(in_srgb,var(--p-bg-soft)_92%,white)] disabled:text-[var(--p-text-muted)]',
  showPasswordToggle.value ? 'pr-12' : '',
  props.error
    ? 'border-[var(--p-error)] focus:ring-4 focus:ring-[color:var(--p-error-soft)]'
    : 'focus:border-[color:color-mix(in_srgb,var(--p-primary)_78%,white)] focus:ring-4 focus:ring-[color:var(--p-primary-soft)] focus:shadow-[0_0_0_1px_color-mix(in_srgb,var(--p-primary)_16%,transparent),0_4px_12px_rgba(15,23,42,0.08)]',
])

const onInput = (event: Event) => {
  emit('update:modelValue', (event.target as HTMLInputElement).value)
}

const togglePasswordVisibility = () => {
  passwordVisible.value = !passwordVisible.value
}
</script>
