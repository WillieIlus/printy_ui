<template>
  <CommonPrintyLogoMark :img-class="iconClass || 'h-8 w-8'" />
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    iconClass?: string
  }>(),
  { iconClass: '' }
)
</script>
