<!-- Purpose: CTA card for browsing all matching quote options. -->
<template>
  <BaseCard class="flex flex-col items-start justify-between gap-4 bg-primary-50">
    <div class="space-y-2">
      <p class="text-lg font-semibold text-slate-950">Need more options?</p>
      <p class="text-sm text-slate-600">Open the full comparison view once live data and sorting are connected.</p>
    </div>
    <BaseButton variant="dark" size="sm">View all shops</BaseButton>
  </BaseCard>
</template>

<script setup lang="ts">
import BaseButton from '~/components/ui/BaseButton.vue'
import BaseCard from '~/components/ui/BaseCard.vue'
</script>
