<template>
  <span :class="classes">
    <span v-if="dot" class="w-1.5 h-1.5 rounded-full inline-block" :class="dotClass"></span>
    <slot />
  </span>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  variant?: 'default' | 'orange' | 'dark' | 'green' | 'red' | 'yellow' | 'blue' | 'gray' | 'verified' | 'pending' | 'accepted' | 'rejected' | 'active' | 'completed'
  size?: 'sm' | 'md' | 'lg'
  dot?: boolean
}>(), {
  variant: 'default',
  size: 'md',
  dot: false,
})

const variantMap = {
  default: 'bg-slate-50 text-slate-700 border-slate-200',
  orange: 'bg-[#fff4ed] text-[#c4471a] border-[#fed7b5]',
  dark: 'bg-[#101828] text-white border-[#101828]',
  green: 'bg-green-50 text-green-700 border-green-200',
  red: 'bg-red-50 text-red-700 border-red-200',
  yellow: 'bg-[#fffaeb] text-[#b54708] border-[#fedf89]',
  blue: 'bg-blue-50 text-blue-700 border-blue-200',
  gray: 'bg-slate-100 text-slate-500 border-slate-200',
  verified: 'bg-green-50 text-green-700 border-green-200',
  pending: 'bg-amber-50 text-amber-700 border-amber-200',
  accepted: 'bg-green-50 text-green-700 border-green-200',
  rejected: 'bg-red-50 text-red-700 border-red-200',
  active: 'bg-[#fff4ed] text-[#c4471a] border-[#fed7b5]',
  completed: 'bg-blue-50 text-blue-700 border-blue-200',
} as const

const dotMap = {
  default: 'bg-slate-400',
  orange: 'bg-[#e13515]',
  dark: 'bg-white',
  green: 'bg-green-500',
  red: 'bg-red-500',
  yellow: 'bg-[#f79009]',
  blue: 'bg-blue-500',
  gray: 'bg-slate-400',
  verified: 'bg-green-500',
  pending: 'bg-amber-500',
  accepted: 'bg-green-500',
  rejected: 'bg-red-500',
  active: 'bg-[#e13515]',
  completed: 'bg-blue-500',
} as const

const sizeMap = {
  sm: 'px-2 py-0.5 text-[11px]',
  md: 'px-2.5 py-1 text-xs',
  lg: 'px-3 py-1.5 text-sm',
} as const

const classes = computed(() => [
  'inline-flex items-center gap-1.5 rounded-full border font-semibold',
  variantMap[props.variant],
  sizeMap[props.size],
])

const dotClass = computed(() => dotMap[props.variant])
</script>
