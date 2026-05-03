<!-- Purpose: Explain the quote-readiness workflow for print shop owners. -->
<template>
  <section id="how-printy-works-for-shops" class="rounded-[2rem] border border-[#f2d3c8] bg-white px-6 py-8 shadow-[0_24px_60px_-44px_rgba(16,24,40,0.24)] md:px-8 md:py-10">
    <div id="how-it-works" class="scroll-mt-32" />
    <div class="max-w-3xl space-y-3">
      <p class="text-xs font-semibold uppercase tracking-[0.22em] text-[#e13515]">How it works</p>
      <h2 class="font-[Montserrat] text-3xl font-semibold tracking-[-0.04em] text-[#101828] md:text-4xl">
        Printy helps the customer arrive better prepared before your team starts quoting.
      </h2>
      <p class="text-base leading-7 text-[#667085] md:text-lg">
        Instead of starting from scattered WhatsApp questions, Printy structures the request around products, papers, finishing, turnaround, and pricing logic your shop already uses.
      </p>
    </div>

    <div class="mt-8 grid gap-4 lg:grid-cols-3">
      <article
        v-for="step in steps"
        :key="step.title"
        class="rounded-[1.75rem] border border-[#f4ddd5] bg-[#fffaf7] p-5 shadow-[0_18px_40px_-34px_rgba(16,24,40,0.28)]"
      >
        <div class="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#fff1eb] text-sm font-semibold text-[#e13515]">
          {{ step.number }}
        </div>
        <div class="mt-4 space-y-2">
          <h3 class="font-[Montserrat] text-xl font-semibold tracking-[-0.02em] text-[#101828]">
            {{ step.title }}
          </h3>
          <p class="text-sm leading-7 text-[#667085]">
            {{ step.copy }}
          </p>
        </div>
      </article>
    </div>
  </section>
</template>

<script setup lang="ts">
const steps = [
  {
    number: '01',
    title: 'Configure your shop logic',
    copy: 'Set the products, papers, finishing options, turnaround expectations, and pricing rules your shop actually wants to use.',
  },
  {
    number: '02',
    title: 'Customers send clearer requests',
    copy: 'Buyers choose from structured options so the request reaches your shop with fewer missing specs and less guesswork.',
  },
  {
    number: '03',
    title: 'Review before you confirm',
    copy: 'Your team can accept, modify, reject, or reply before any job is confirmed, so the shop keeps final control.',
  },
]
</script>
