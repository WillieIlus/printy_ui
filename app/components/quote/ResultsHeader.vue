<!-- Purpose: Header for calculator result sections. -->
<template>
  <div class="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
    <BaseSectionTitle
      eyebrow="Quote results"
      title="Compare the strongest shop matches."
      description="Keep this layer lightweight until the real backend pricing flow is wired."
    />
    <BaseBadge tone="neutral">Starter shell</BaseBadge>
  </div>
</template>

<script setup lang="ts">
import BaseBadge from '~/components/ui/BaseBadge.vue'
import BaseSectionTitle from '~/components/ui/BaseSectionTitle.vue'
</script>
