<!-- Purpose: Simple CTA strip for sending requests to top shops. -->
<template>
  <section class="mx-auto max-w-6xl px-4 py-4 md:px-6">
    <BaseCard class="flex flex-col gap-4 !bg-[var(--p-primary)] !text-white md:flex-row md:items-center md:justify-between">
      <div class="space-y-1">
        <p class="text-lg font-semibold">Send one request to multiple strong-fit shops.</p>
        <p class="text-sm text-white/80">Keep this safely scoped to request distribution and response collection.</p>
      </div>
      <BaseButton variant="secondary" size="sm">Request top matches</BaseButton>
    </BaseCard>
  </section>
</template>

<script setup lang="ts">
import BaseButton from '~/components/ui/BaseButton.vue'
import BaseCard from '~/components/ui/BaseCard.vue'
</script>
