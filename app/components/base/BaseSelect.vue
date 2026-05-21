<template>
  <FormField :label="label" :error="error" :help="help" :required="required">
    <select v-bind="attrs" :value="modelValue ?? ''" :disabled="disabled" :class="selectClass" @change="$emit('update:modelValue', ($event.target as HTMLSelectElement).value)">
      <option v-if="placeholder" value="">{{ placeholder }}</option>
      <option v-for="option in normalizedOptions" :key="option.value" :value="option.value">{{ option.label }}</option>
    </select>
  </FormField>
</template>

<script setup lang="ts">
import FormField from '~/components/forms/FormField.vue'

const props = withDefaults(defineProps<{
  modelValue?: string | number | null
  options: Array<string | { label: string; value: string | number }>
  label?: string
  placeholder?: string
  error?: string
  help?: string
  disabled?: boolean
  required?: boolean
  variant?: 'default' | 'dark' | 'calculator' | 'dashboard' | 'auth'
  size?: 'sm' | 'md' | 'lg'
}>(), {
  disabled: false,
  required: false,
  variant: 'default',
  size: 'md',
})

defineEmits(['update:modelValue'])
const attrs = useAttrs()

const normalizedOptions = computed(() => props.options.map((option) => typeof option === 'string' ? { label: option, value: option } : option))
const sizeMap = {
  sm: 'py-2 text-[13px]',
  md: 'py-2.5 text-[13.5px]',
  lg: 'py-3 text-[14px]',
} as const
const variantMap = {
  default: 'bg-white border border-[#d0d5dd] text-[#101828]',
  dark: 'bg-[#1d2939] border border-[#344054] text-white',
  calculator: 'bg-white border border-[#d0d5dd] text-[#101828]',
  dashboard: 'bg-slate-50 border border-slate-200 text-slate-700',
  auth: 'bg-white border border-[#d0d5dd] text-[#101828]',
} as const
const selectClass = computed(() => ['w-full rounded-lg px-3.5 shadow-sm outline-none focus:ring-2 focus:ring-[#e13515] focus:border-[#e13515]', sizeMap[props.size], variantMap[props.variant]])
</script>
