<!-- Purpose: Featured top result card for quote output. -->
<template>
  <BaseCard class="space-y-4 bg-slate-950 text-white">
    <div class="flex items-center justify-between gap-3">
      <div>
        <p class="text-xl font-semibold">Top matched shop</p>
        <p class="text-sm text-slate-300">Fast turnaround and strong fit for the selected job.</p>
      </div>
      <BaseBadge tone="primary">Best fit</BaseBadge>
    </div>
    <div class="grid gap-3 md:grid-cols-3">
      <div class="rounded-2xl bg-white/5 px-4 py-4">KES 18,500 estimate</div>
      <div class="rounded-2xl bg-white/5 px-4 py-4">Ready in 2 to 3 days</div>
      <div class="rounded-2xl bg-white/5 px-4 py-4">Artwork review included</div>
    </div>
  </BaseCard>
</template>

<script setup lang="ts">
import BaseBadge from '~/components/ui/BaseBadge.vue'
import BaseCard from '~/components/ui/BaseCard.vue'
</script>
