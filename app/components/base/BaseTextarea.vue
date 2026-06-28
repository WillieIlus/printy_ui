<template>
  <FormField :label="label" :error="error" :help="help" :required="required">
    <textarea v-bind="attrs" :value="modelValue ?? ''" :placeholder="placeholder" :disabled="disabled" :class="textareaClass" @input="$emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)" />
  </FormField>
</template>

<script setup lang="ts">
import FormField from '~/components/forms/FormField.vue'

const props = withDefaults(defineProps<{
  modelValue?: string | null
  label?: string
  placeholder?: string
  error?: string
  help?: string
  disabled?: boolean
  required?: boolean
  variant?: 'default' | 'dark' | 'calculator' | 'dashboard' | 'auth'
}>(), {
  disabled: false,
  required: false,
  variant: 'default',
})

defineEmits(['update:modelValue'])
const attrs = useAttrs()

const variantMap = {
  default: 'bg-white border border-[#d0d5dd] text-[#101828] placeholder-[#98a2b3]',
  dark: 'bg-[#1d2939] border border-[#344054] text-white placeholder-[#667085]',
  calculator: 'bg-white border border-[#d0d5dd] text-[#101828] placeholder-[#98a2b3]',
  dashboard: 'bg-slate-50 border border-slate-200 text-slate-700 placeholder-slate-400',
  auth: 'bg-white border border-[#d0d5dd] text-[#101828] placeholder-[#98a2b3]',
} as const

const textareaClass = computed(() => ['min-h-28 w-full rounded-lg px-3.5 py-3 shadow-sm outline-none focus:ring-2 focus:ring-[#e13515] focus:border-[#e13515]', variantMap[props.variant]])
</script>
