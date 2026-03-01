<template>
  <!-- Single img: darkOnly = light wordmark for dark backgrounds; else switch by color mode -->
  <img
    :src="wordmarkSrc"
    alt="Printy"
    class="object-contain object-left"
    :class="imgClass"
  >
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    imgClass?: string
    /** Use light wordmark (for always-dark backgrounds e.g. footer) */
    darkOnly?: boolean
  }>(),
  { imgClass: 'h-6', darkOnly: false }
)

const colorMode = useColorMode()
const wordmarkSrc = computed(() => {
  if (props.darkOnly) {
    return '/printy-brand-assets-ready/word-mark/light/printy-word-mark-03.svg'
  }
  return colorMode.value === 'dark'
    ? '/printy-brand-assets-ready/word-mark/light/printy-word-mark-03.svg'
    : '/printy-brand-assets-ready/word-mark/dark/printy-word-mark-04.svg'
})
</script>
