<template>
  <UButton
    :type="type"
    :color="color"
    :variant="variant"
    :loading="loading"
    :disabled="disabled || loading"
    :icon="icon"
    :class="buttonClass"
  >
    <slot />
  </UButton>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  type?: 'button' | 'submit' | 'reset'
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'neutral'
  variant?: 'solid' | 'outline' | 'soft' | 'subtle' | 'ghost' | 'link'
  loading?: boolean
  disabled?: boolean
  icon?: string
  block?: boolean
}>(), {
  type: 'button',
  color: 'primary',
  variant: 'solid',
  loading: false,
  disabled: false,
  icon: undefined,
  block: false,
})

const buttonClass = computed(() => {
  const classes = [props.block ? 'w-full justify-center' : '']

  if (props.color === 'primary' && props.variant === 'solid') {
    classes.push('bg-flamingo-500 text-white hover:bg-flamingo-400 disabled:bg-flamingo-300')
  }

  return classes.filter(Boolean).join(' ')
})
</script>
