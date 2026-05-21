<template>
  <FormField :label="label" :error="error" :help="help" :required="required">
    <div class="relative">
      <div v-if="$slots.left || iconLeft" class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <slot name="left">
          <span class="text-[#98a2b3]" v-html="iconLeft" />
        </slot>
      </div>
      <input
        v-bind="attrs"
        :value="modelValue ?? ''"
        :type="type"
        :placeholder="placeholder"
        :disabled="disabled"
        :required="required"
        :class="inputClass"
        @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
        @blur="$emit('blur', $event)"
        @focus="$emit('focus', $event)"
      >
      <div v-if="$slots.right || iconRight" class="absolute inset-y-0 right-0 pr-3 flex items-center">
        <slot name="right">
          <span class="text-[#98a2b3]" v-html="iconRight" />
        </slot>
      </div>
    </div>
  </FormField>
</template>

<script setup lang="ts">
import FormField from '~/components/forms/FormField.vue'

const props = withDefaults(defineProps<{
  modelValue?: string | number | null
  type?: string
  label?: string
  placeholder?: string
  error?: string
  help?: string
  disabled?: boolean
  required?: boolean
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'dark' | 'calculator' | 'dashboard' | 'auth'
  iconLeft?: string
  iconRight?: string
}>(), {
  type: 'text',
  size: 'md',
  variant: 'default',
  disabled: false,
  required: false,
})

defineEmits(['update:modelValue', 'blur', 'focus'])
const attrs = useAttrs()
const slots = useSlots()

const sizeMap = {
  sm: 'py-2 text-[13px]',
  md: 'py-2.5 text-[13.5px]',
  lg: 'py-3 text-[14px]',
} as const

const variantMap = {
  default: 'bg-white border border-[#d0d5dd] text-[#101828] placeholder-[#98a2b3] focus:ring-[#e13515] focus:border-[#e13515]',
  dark: 'bg-[#1d2939] border border-[#344054] text-white placeholder-[#667085] focus:ring-[#e13515] focus:border-[#e13515]',
  calculator: 'bg-white border border-[#d0d5dd] text-[#101828] placeholder-[#98a2b3] focus:ring-[#e13515] focus:border-[#e13515]',
  dashboard: 'bg-slate-50 border border-slate-200 text-slate-700 placeholder-slate-400 focus:ring-[#e13515] focus:border-[#e13515]',
  auth: 'bg-white border border-[#d0d5dd] text-[#101828] placeholder-[#98a2b3] focus:ring-[#e13515] focus:border-[#e13515]',
} as const

const inputClass = computed(() => [
  'w-full rounded-lg shadow-sm outline-none transition focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:bg-[#f9fafb]',
  sizeMap[props.size],
  variantMap[props.variant],
  props.iconLeft || !!slots.left ? 'pl-9' : 'pl-3.5',
  props.iconRight || !!slots.right ? 'pr-10' : 'pr-3.5',
])
</script>
