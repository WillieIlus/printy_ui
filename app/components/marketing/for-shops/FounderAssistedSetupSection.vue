<!-- Purpose: Reduce setup fear by offering founder-led onboarding help first. -->
<template>
  <section id="founder-assisted-setup-section" class="rounded-[2rem] border border-[#efcabb] bg-[linear-gradient(180deg,#fff3ec_0%,#fffaf7_100%)] px-6 py-8 shadow-[0_26px_60px_-44px_rgba(225,53,21,0.26)] md:px-8 md:py-10">
    <div id="rate-card-check" class="scroll-mt-32" />
    <div class="grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-center">
      <div class="space-y-4">
        <p class="inline-flex rounded-full border border-[#f0c4b7] bg-white/80 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.22em] text-[#e13515]">
          Free rate-card check
        </p>
        <h2 class="font-[Montserrat] text-3xl font-semibold tracking-[-0.04em] text-[#101828] md:text-4xl">
          Start with founder-assisted setup.
        </h2>
        <p class="text-base leading-7 text-[#667085] md:text-lg">
          For early Nairobi shops, we can help structure your first rate card, materials, common products, and finishing options so you do not start from an empty dashboard.
        </p>
        <p class="text-sm font-semibold text-[#101828]">
          Founder-assisted setup available for early Nairobi shops.
        </p>
        <BaseButton :to="signupRoute" variant="primary" size="lg" class="bg-[#e13515] hover:bg-[#bd2d12] focus-visible:outline-[#e13515]">
          Request free setup check
        </BaseButton>
      </div>

      <div class="rounded-[1.75rem] border border-[#f0cdbf] bg-white p-6 shadow-[0_18px_40px_-34px_rgba(16,24,40,0.28)]">
        <p class="text-sm font-semibold uppercase tracking-[0.18em] text-[#e13515]">Checklist</p>
        <ul class="mt-4 space-y-3">
          <li
            v-for="bullet in bullets"
            :key="bullet"
            class="flex gap-3 rounded-2xl bg-[#fff7f3] px-4 py-3 text-sm leading-6 text-[#667085]"
          >
            <span class="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#e13515] text-xs font-semibold text-white">+</span>
            <span>{{ bullet }}</span>
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import BaseButton from '~/components/ui/BaseButton.vue'

const signupRoute = '/auth/signup?type=shop'

const bullets = [
  'Bring your common price list or PDF.',
  'We help map your papers, finishing, and common products.',
  'You approve before anything goes live.',
]
</script>
