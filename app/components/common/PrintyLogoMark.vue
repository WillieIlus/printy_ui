<template>
  <!-- Logo mark (icon): light/white for colored or dark backgrounds (red box, footer) -->
  <img
    src="/printy-brand-assets-ready/logo-mark/light/printy-logo-mark-01.svg"
    alt="Printy"
    class="object-contain"
    :class="imgClass"
  >
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    imgClass?: string
  }>(),
  { imgClass: 'h-6 w-6' }
)
</script>
