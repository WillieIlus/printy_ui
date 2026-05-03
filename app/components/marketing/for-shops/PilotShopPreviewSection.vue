<!-- Purpose: Show a quote-ready shop profile example without fake marketplace counts. -->
<template>
  <section id="pilot-shop-preview-section" class="rounded-[2rem] border border-[#f2d3c8] bg-white px-6 py-8 shadow-[0_24px_60px_-44px_rgba(16,24,40,0.24)] md:px-8 md:py-10">
    <div class="max-w-3xl space-y-3">
      <p class="text-xs font-semibold uppercase tracking-[0.22em] text-[#e13515]">Pilot preview</p>
      <h2 class="font-[Montserrat] text-3xl font-semibold tracking-[-0.04em] text-[#101828] md:text-4xl">
        Example of a quote-ready shop profile.
      </h2>
      <p class="text-base leading-7 text-[#667085] md:text-lg">
        Early pilot profiles show how customers can send clearer requests based on configured products, papers, finishing, turnaround, and shop-specific pricing.
      </p>
    </div>

    <article class="mt-8 rounded-[1.75rem] border border-[#f0d4c9] bg-[linear-gradient(180deg,#fffaf7_0%,#ffffff_100%)] p-6 shadow-[0_18px_40px_-34px_rgba(16,24,40,0.28)]">
      <div class="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div class="space-y-3">
          <div class="flex flex-wrap gap-2">
            <span class="rounded-full border border-[#f0cdbf] bg-white px-3 py-1 text-xs font-semibold text-[#e13515]">Pilot profile</span>
            <span class="rounded-full border border-[#c9ead7] bg-[#ecfdf3] px-3 py-1 text-xs font-semibold text-[#067647]">Quote-ready setup</span>
          </div>
          <h3 class="font-[Montserrat] text-2xl font-semibold tracking-[-0.03em] text-[#101828]">
            Kaskazini Solutions
          </h3>
          <p class="max-w-2xl text-sm leading-7 text-[#667085]">
            Customers can send clearer requests based on this shop&apos;s configured products, papers, finishing, turnaround, and shop-specific pricing.
          </p>
          <p class="text-sm font-medium text-[#101828]">
            Printy is not just a directory.
          </p>
        </div>

        <BaseButton to="/shops" variant="outline" size="sm" class="border-[#f2d3c8] bg-white text-[#101828] hover:bg-[#fff1eb]">
          View example profile
        </BaseButton>
      </div>

      <div class="mt-6 grid gap-3 md:grid-cols-5">
        <div
          v-for="area in configuredAreas"
          :key="area"
          class="rounded-2xl bg-[#fff7f3] px-4 py-4 text-center text-sm font-medium text-[#101828]"
        >
          {{ area }}
        </div>
      </div>
    </article>
  </section>
</template>

<script setup lang="ts">
import BaseButton from '~/components/ui/BaseButton.vue'

const configuredAreas = [
  'Products',
  'Papers',
  'Finishing',
  'Turnaround',
  'Shop-specific pricing',
]
</script>
