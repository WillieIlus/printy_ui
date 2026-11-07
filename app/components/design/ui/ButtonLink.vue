<script setup lang="ts">
import { cx } from '../../../utils/design/cx'

type ButtonTone = 'primary' | 'charcoal' | 'outline' | 'ghost' | 'paper'
type ButtonSize = 'sm' | 'md' | 'lg'

const BUTTON_TONES: Record<ButtonTone, string> = {
  primary: 'bg-brand text-white shadow-brand hover:bg-brand-deep border border-brand hover:border-brand-deep',
  charcoal: 'bg-ink text-paper hover:bg-brand-deep border border-ink',
  outline: 'bg-transparent text-ink border border-line-strong hover:border-ink hover:bg-paper-2',
  ghost: 'bg-transparent text-ink-2 border border-transparent hover:text-ink hover:bg-paper-2',
  paper: 'bg-paper text-ink border border-paper hover:bg-paper-2',
}

const BUTTON_BASE = 'inline-flex items-center justify-center gap-2 rounded-xl font-semibold tracking-tight transition-all duration-300 cursor-pointer active:scale-[0.98]'
const sizes: Record<ButtonSize, string> = {
  sm: 'px-3.5 py-2 text-[13px]',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-7 py-3.5 text-base',
}

const props = withDefaults(defineProps<{
  href?: string
  tone?: ButtonTone
  size?: ButtonSize
  class?: string
  disabled?: boolean
}>(), {
  href: undefined,
  tone: 'primary',
  size: 'md',
  class: undefined,
  disabled: false,
})

const classes = computed(() => cx(BUTTON_BASE, BUTTON_TONES[props.tone], sizes[props.size], props.disabled && 'cursor-not-allowed opacity-60', props.class))
</script>

<template>
  <NuxtLink v-if="props.href && !props.disabled" :to="props.href" :class="classes">
    <slot />
  </NuxtLink>
  <span v-else :class="classes" :aria-disabled="props.disabled || undefined">
    <slot />
  </span>
</template>
