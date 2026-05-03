<!-- Purpose: Close the page with owner-facing positioning and signup action. -->
<template>
  <section id="for-shops-final-cta" class="rounded-[2rem] border border-[#ebb8a9] bg-[linear-gradient(135deg,#101828_0%,#1d2939_100%)] px-6 py-8 text-white shadow-[0_30px_70px_-48px_rgba(16,24,40,0.65)] md:px-8 md:py-10">
    <div id="join-early" class="scroll-mt-32" />
    <div class="max-w-4xl space-y-4">
      <p class="text-xs font-semibold uppercase tracking-[0.22em] text-[#f9b6a4]">Final call</p>
      <h2 class="font-[Montserrat] text-3xl font-semibold tracking-[-0.04em] text-white md:text-4xl">
        Give your shop a cleaner way to receive and price work.
      </h2>
      <p class="text-base leading-7 text-slate-300 md:text-lg">
        Printy suggests. The shop decides.
      </p>
      <p class="text-base leading-7 text-slate-300">
        Join early if you want founder-assisted setup, clearer requests, and a pricing workflow shaped around how print shops actually operate.
      </p>
    </div>

    <div class="mt-6 flex flex-col gap-3 sm:flex-row">
      <BaseButton to="/auth/signup?type=shop" variant="primary" size="lg" class="bg-[#e13515] hover:bg-[#bd2d12] focus-visible:outline-[#e13515]">
        Join early shops
      </BaseButton>
      <BaseButton to="#rate-card-check" variant="outline" size="lg" class="border-white/20 bg-white/5 text-white hover:bg-white/10">
        Get free rate-card check
      </BaseButton>
    </div>
  </section>
</template>

<script setup lang="ts">
import BaseButton from '~/components/ui/BaseButton.vue'
</script>
