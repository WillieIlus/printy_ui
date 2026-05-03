<!-- Purpose: Create honest urgency for early shop onboarding. -->
<template>
  <section id="early-access-scarcity-section" class="rounded-[2rem] border border-[#e9b7a7] bg-[linear-gradient(135deg,#fff0e7_0%,#ffe6db_100%)] px-6 py-8 md:px-8 md:py-10">
    <div class="grid gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
      <div class="space-y-4">
        <p class="text-xs font-semibold uppercase tracking-[0.22em] text-[#e13515]">Early access</p>
        <h2 class="font-[Montserrat] text-3xl font-semibold tracking-[-0.04em] text-[#101828] md:text-4xl">
          Early access is limited by area.
        </h2>
        <p class="max-w-3xl text-base leading-7 text-[#667085] md:text-lg">
          We are onboarding selected print shops carefully so each shop&apos;s pricing, materials, and finishing are set up properly. Early shops get priority visibility as buyer traffic grows.
        </p>
      </div>

      <BaseButton to="#join-early" variant="primary" size="lg" class="bg-[#e13515] hover:bg-[#bd2d12] focus-visible:outline-[#e13515]">
        Join early shops
      </BaseButton>
    </div>

    <div class="mt-6 flex flex-wrap gap-2">
      <span
        v-for="badge in badges"
        :key="badge"
        class="rounded-full border border-[#efc4b5] bg-white/80 px-4 py-2 text-sm font-medium text-[#101828]"
      >
        {{ badge }}
      </span>
    </div>
  </section>
</template>

<script setup lang="ts">
import BaseButton from '~/components/ui/BaseButton.vue'

const badges = [
  'Nairobi-first',
  'Founder-assisted setup',
  'Priority early visibility',
  'Selected shops by area',
]
</script>
