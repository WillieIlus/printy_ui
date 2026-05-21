<template>
  <section :class="classes">
    <header v-if="$slots.header" class="contents">
      <slot name="header" />
    </header>
    <slot />
    <footer v-if="$slots.footer" class="contents">
      <slot name="footer" />
    </footer>
  </section>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  variant?: 'default' | 'elevated' | 'bordered' | 'dark' | 'soft' | 'glass' | 'dashboard' | 'calculator'
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
  radius?: 'md' | 'lg' | 'xl' | '2xl' | '3xl'
  interactive?: boolean
}>(), {
  variant: 'default',
  padding: 'md',
  radius: '2xl',
  interactive: false,
})

const variantMap = {
  default: 'bg-white border border-[#e4e7ec] shadow-sm',
  elevated: 'bg-white border border-[#e4e7ec] shadow-xl shadow-[#1018280d]',
  bordered: 'bg-white border border-slate-200',
  dark: 'bg-[#101828] border border-[#1d2939] text-white',
  soft: 'bg-[#f9fafb] border border-[#e4e7ec]',
  glass: 'bg-white/5 border border-white/10 backdrop-blur',
  dashboard: 'bg-white border border-slate-200 shadow-sm',
  calculator: 'bg-white border border-[#e4e7ec] shadow-2xl overflow-hidden',
} as const

const paddingMap = {
  none: '',
  sm: 'p-4',
  md: 'p-5',
  lg: 'p-6',
  xl: 'p-8',
} as const

const radiusMap = {
  md: 'rounded-lg',
  lg: 'rounded-xl',
  xl: 'rounded-2xl',
  '2xl': 'rounded-[1.75rem]',
  '3xl': 'rounded-[2rem]',
} as const

const classes = computed(() => [
  variantMap[props.variant],
  paddingMap[props.padding],
  radiusMap[props.radius],
  props.interactive ? 'transition-all hover:shadow-md' : '',
])
</script>
