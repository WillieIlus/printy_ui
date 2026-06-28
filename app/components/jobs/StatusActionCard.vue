<template>
  <UiCard class="space-y-4">
    <div>
      <p class="text-sm font-semibold uppercase tracking-[0.18em] text-primary-600">Status actions</p>
      <h3 class="mt-2 text-2xl font-black text-slate-950">Update the workflow honestly.</h3>
    </div>
    <div class="flex flex-wrap gap-3">
      <UiButton variant="secondary" @click="$emit('accept')">Accept</UiButton>
      <UiButton variant="secondary" @click="$emit('production')">Mark in production</UiButton>
      <UiButton variant="secondary" @click="$emit('ready')">Mark ready</UiButton>
    </div>
    <p class="text-xs text-slate-500">Buttons only call existing assignment endpoints. No fake machine state is implied.</p>
  </UiCard>
</template>

<script setup lang="ts">
import UiButton from '~/components/ui/UiButton.vue'
import UiCard from '~/components/ui/UiCard.vue'

defineEmits<{
  accept: []
  production: []
  ready: []
}>()
</script>
