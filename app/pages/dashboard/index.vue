<!-- Purpose: Role-routing dashboard landing page shell. -->
<template>
  <section class="mx-auto max-w-5xl px-4 py-12 md:px-6">
    <BaseCard class="space-y-6 text-center">
      <BaseBadge tone="primary">Workspaces</BaseBadge>
      <div class="space-y-2">
        <h1 class="text-3xl font-semibold tracking-tight text-slate-950">Choose the right workspace.</h1>
        <p class="mx-auto max-w-2xl text-sm text-slate-600">
          Printy now separates client, partner, and production work so each role sees the right workflow surface.
        </p>
      </div>
      <div class="flex flex-wrap items-center justify-center gap-3">
        <BaseButton to="/dashboard/client">Open client workspace</BaseButton>
        <BaseButton to="/dashboard/partner" variant="secondary">Open partner workspace</BaseButton>
        <BaseButton to="/dashboard/shop" variant="dark">Open production workspace</BaseButton>
      </div>
    </BaseCard>
  </section>
</template>

<script setup lang="ts">
import BaseBadge from '~/components/ui/BaseBadge.vue'
import BaseButton from '~/components/ui/BaseButton.vue'
import BaseCard from '~/components/ui/BaseCard.vue'

definePageMeta({
  layout: 'dashboard',
})
</script>
