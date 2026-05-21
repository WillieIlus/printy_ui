<template>
  <section :class="[variantClass, spacingClass]">
    <slot />
  </section>
</template>

<script setup lang="ts">
import { PRINTY_SECTION_SPACING } from '~/constants/design'

const props = withDefaults(defineProps<{
  variant?: 'default' | 'muted' | 'dark' | 'orange' | 'gradient' | 'hero' | 'dashboard'
  spacing?: keyof typeof PRINTY_SECTION_SPACING
}>(), {
  variant: 'default',
  spacing: 'lg',
})

const variantClass = computed(() => ({
  default: 'bg-white',
  muted: 'bg-[#f9fafb]',
  dark: 'bg-[#101828] text-white',
  orange: 'bg-[#e13515] text-white',
  gradient: 'bg-[linear-gradient(135deg,#101828_0%,#0f172a_50%,#1f2937_100%)] text-white',
  hero: 'bg-[#101828] text-white relative overflow-hidden',
  dashboard: 'bg-white',
}[props.variant]))

const spacingClass = computed(() => PRINTY_SECTION_SPACING[props.spacing])
</script>
