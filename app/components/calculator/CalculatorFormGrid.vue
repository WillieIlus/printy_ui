<template>
  <form class="grid min-w-0 gap-4 sm:gap-5" @submit.prevent="$emit('submit')">
    <slot />
  </form>
</template>

<script setup lang="ts">
defineEmits<{ submit: [] }>()
</script>
