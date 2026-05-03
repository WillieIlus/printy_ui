<!-- Purpose: Clarify that Printy is driven by shop-specific pricing structure, not just listings. -->
<template>
  <section id="pricing-engine-moat-section" class="rounded-[2rem] border border-[#f2d3c8] bg-[linear-gradient(180deg,#fffaf7_0%,#ffffff_100%)] px-6 py-8 md:px-8 md:py-10">
    <div class="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(320px,0.9fr)] lg:items-center">
      <div class="space-y-4">
        <p class="text-xs font-semibold uppercase tracking-[0.22em] text-[#e13515]">Pricing engine moat</p>
        <h2 class="font-[Montserrat] text-3xl font-semibold tracking-[-0.04em] text-[#101828] md:text-4xl">
          Built around how real print shops price work.
        </h2>
        <p class="text-base leading-7 text-[#667085] md:text-lg">
          Most platforms list shops. Printy structures how a real print shop prices work.
        </p>
        <p class="text-base leading-7 text-[#667085]">
          That means configured papers, finishing, turnaround expectations, and shop-specific pricing logic sit underneath the visible profile.
        </p>
      </div>

      <div class="rounded-[1.75rem] border border-[#f3ddd5] bg-white p-6 shadow-[0_18px_40px_-34px_rgba(16,24,40,0.28)]">
        <div class="space-y-3">
          <div
            v-for="item in pillars"
            :key="item"
            class="flex items-center justify-between gap-4 rounded-2xl bg-[#fff7f3] px-4 py-3"
          >
            <span class="text-sm font-medium text-[#101828]">{{ item }}</span>
            <span class="rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-[#e13515]">Configured</span>
          </div>
        </div>
        <p class="mt-5 text-sm leading-6 text-[#667085]">
          Printy suggests. The shop decides.
        </p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const pillars = [
  'Shop-specific rate cards',
  'Paper and material options',
  'Finishing logic and markups',
  'Turnaround rules by job type',
]
</script>
