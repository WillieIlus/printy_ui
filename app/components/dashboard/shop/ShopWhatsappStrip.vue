<!-- Purpose: WhatsApp business strip for shop-side follow-ups. -->
<template>
  <BaseCard tone="dark" class="flex flex-col gap-4 bg-emerald-900/90 md:flex-row md:items-center md:justify-between">
    <div class="space-y-1">
      <p class="text-sm font-semibold text-emerald-100">WhatsApp business strip</p>
      <p class="text-sm text-emerald-50/80">Use a direct thread for confirming artwork, timing, and pickup details after the quote stage.</p>
    </div>
    <BaseButton variant="secondary" size="sm">Link business number</BaseButton>
  </BaseCard>
</template>

<script setup lang="ts">
import BaseButton from '~/components/ui/BaseButton.vue'
import BaseCard from '~/components/ui/BaseCard.vue'
</script>
