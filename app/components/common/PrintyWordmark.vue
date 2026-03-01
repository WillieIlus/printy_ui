<template>
  <!-- Default: switches by color mode. darkOnly: always light wordmark (for dark backgrounds e.g. footer) -->
  <img
    v-if="!darkOnly"
    src="/printy-brand-assets-ready/word-mark/dark/printy-word-mark-04.svg"
    alt="Printy"
    class="dark:hidden object-contain object-left"
    :class="imgClass"
  >
  <img
    v-if="!darkOnly"
    src="/printy-brand-assets-ready/word-mark/light/printy-word-mark-03.svg"
    alt="Printy"
    class="hidden dark:block object-contain object-left"
    :class="imgClass"
  >
  <img
    v-if="darkOnly"
    src="/printy-brand-assets-ready/word-mark/light/printy-word-mark-03.svg"
    alt="Printy"
    class="object-contain object-left"
    :class="imgClass"
  >
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    imgClass?: string
    /** Use light wordmark (for always-dark backgrounds e.g. footer) */
    darkOnly?: boolean
  }>(),
  { imgClass: 'h-6', darkOnly: false }
)
</script>
