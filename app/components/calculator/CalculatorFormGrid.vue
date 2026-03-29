<template>
  <form class="space-y-4" @submit.prevent="$emit('submit')">
    <slot />
  </form>
</template>

<script setup lang="ts">
defineEmits<{ submit: [] }>()
</script>
