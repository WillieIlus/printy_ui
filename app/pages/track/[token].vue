<template>
  <TrackView :token="token" />
</template>

<script setup lang="ts">
const route = useRoute()
const token = computed(() => typeof route.params.token === 'string' ? route.params.token : '')
</script>