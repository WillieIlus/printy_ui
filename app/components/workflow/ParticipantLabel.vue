<template>
  <ParticipantProjectionLabel :label="label" />
</template>

<script setup lang="ts">
import ParticipantProjectionLabel from '~/components/workflow/ParticipantProjectionLabel.vue'

defineProps<{
  label: string
}>()
</script>
