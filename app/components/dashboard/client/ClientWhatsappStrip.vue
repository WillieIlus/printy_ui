<!-- Purpose: Lightweight WhatsApp communication strip for client dashboard. -->
<template>
  <BaseCard class="flex flex-col gap-4 bg-emerald-50/80 md:flex-row md:items-center md:justify-between">
    <div class="space-y-1">
      <p class="text-sm font-semibold text-emerald-800">WhatsApp updates</p>
      <p class="text-sm text-emerald-900/80">Keep quote follow-ups simple with a direct channel for confirmations and file nudges.</p>
    </div>
    <BaseButton variant="dark" size="sm">Connect WhatsApp</BaseButton>
  </BaseCard>
</template>

<script setup lang="ts">
import BaseButton from '~/components/ui/BaseButton.vue'
import BaseCard from '~/components/ui/BaseCard.vue'
</script>
