<template>
  <div class="flex flex-wrap items-center gap-1.5">
    <!-- B1.3 — two different facts, so two different looks:
         "Your managers" is a relationship the client already has (filled, green,
         handshake); "Verified" is a manual Printy check (outlined, brand, tick). -->
    <span
      v-if="yourManager"
      data-test="your-manager-badge"
      class="inline-flex items-center gap-1 rounded-full bg-mint px-2 py-[2px] font-mono2 text-[8.5px] font-bold uppercase tracking-[0.12em] text-brand-deep"
    >
      <Handshake :size="9" aria-hidden="true" /> Your managers
    </span>
    <span
      v-if="verified"
      data-test="verified-badge"
      class="inline-flex items-center gap-1 rounded-full border border-brand bg-card px-2 py-[2px] font-mono2 text-[8.5px] font-bold uppercase tracking-[0.12em] text-brand"
    >
      <BadgeCheck :size="9" aria-hidden="true" /> Verified
    </span>
  </div>
</template>

<script setup lang="ts">
import { BadgeCheck, Handshake } from 'lucide-vue-next'

withDefaults(defineProps<{
  yourManager?: boolean
  verified?: boolean
}>(), {
  yourManager: false,
  verified: false,
})
</script>
