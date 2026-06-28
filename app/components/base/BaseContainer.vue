<template>
  <div :class="[containerClass, props.padded ? 'px-5 sm:px-6 lg:px-8' : '', 'mx-auto']">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { PRINTY_CONTAINER } from '~/constants/design'

const props = withDefaults(defineProps<{
  size?: keyof typeof PRINTY_CONTAINER
  padded?: boolean
}>(), {
  size: 'xl',
  padded: true,
})

const containerClass = computed(() => PRINTY_CONTAINER[props.size])
</script>
