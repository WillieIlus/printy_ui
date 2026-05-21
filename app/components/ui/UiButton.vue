<template>
  <BaseButton v-bind="props">
    <slot />
  </BaseButton>
</template>

<script setup lang="ts">
import BaseButton from '~/components/base/BaseButton.vue'

const props = withDefaults(defineProps<{
  to?: string
  type?: 'button' | 'submit' | 'reset'
  variant?: 'primary' | 'secondary' | 'dark' | 'light' | 'ghost' | 'outline' | 'danger' | 'success'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  loading?: boolean
  disabled?: boolean
  block?: boolean
}>(), {
  type: 'button',
  variant: 'primary',
  size: 'md',
  loading: false,
  disabled: false,
  block: false,
})
</script>
