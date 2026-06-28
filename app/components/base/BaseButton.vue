<template>
  <NuxtLink v-if="to" :to="to" :class="classes">
    <slot name="left">{{ iconLeft }}</slot>
    <span v-if="loading" class="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current/30 border-t-current" />
    <slot v-else />
    <slot name="right">{{ iconRight }}</slot>
  </NuxtLink>
  <button v-else :type="type" :disabled="disabled || loading" :class="classes">
    <slot name="left">{{ iconLeft }}</slot>
    <span v-if="loading" class="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current/30 border-t-current" />
    <slot v-else />
    <slot name="right">{{ iconRight }}</slot>
  </button>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  to?: string
  variant?: 'primary' | 'secondary' | 'dark' | 'light' | 'ghost' | 'outline' | 'danger' | 'success'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  block?: boolean
  loading?: boolean
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
  iconLeft?: string
  iconRight?: string
}>(), {
  variant: 'primary',
  size: 'md',
  block: false,
  loading: false,
  disabled: false,
  type: 'button',
})

const variantMap = {
  primary: 'bg-[#e13515] border border-[#e13515] text-white shadow-[0_18px_36px_-22px_rgba(225,53,21,0.9)] hover:bg-[#b82c10] hover:border-[#b82c10]',
  secondary: 'bg-white border border-[#d0d5dd] text-[#344054] shadow-sm hover:bg-[#f9fafb]',
  dark: 'bg-[#101828] border border-[#101828] text-white shadow-sm hover:bg-[#1d2939]',
  light: 'bg-white border border-white/40 text-white hover:bg-white/10',
  ghost: 'bg-transparent border border-transparent text-[#667085] hover:bg-[#f9fafb] hover:text-[#344054]',
  outline: 'bg-transparent border border-[#475467] text-[#d0d5dd] hover:text-white hover:border-[#667085]',
  danger: 'bg-[#d92d20] border border-[#d92d20] text-white hover:bg-[#b42318]',
  success: 'bg-[#12b76a] border border-[#12b76a] text-white hover:bg-[#039855]',
} as const

const sizeMap = {
  sm: 'px-3 py-2 text-[12px] rounded-lg',
  md: 'px-4 py-2.5 text-[13px] rounded-xl',
  lg: 'px-5 py-2.5 text-[13.5px] rounded-xl',
  xl: 'px-7 py-3.5 text-base rounded-xl',
} as const

const classes = computed(() => [
  'inline-flex items-center justify-center gap-2 font-semibold transition-colors',
  variantMap[props.variant],
  sizeMap[props.size],
  props.block ? 'w-full' : '',
  props.disabled || props.loading ? 'cursor-not-allowed opacity-60' : '',
])
</script>
