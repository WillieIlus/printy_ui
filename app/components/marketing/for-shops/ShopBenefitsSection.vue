<!-- Purpose: Summarize operator-facing benefits of adopting Printy. -->
<template>
  <section id="shop-benefits-section" class="rounded-[2rem] border border-[#f2d3c8] bg-[linear-gradient(180deg,#ffffff_0%,#fff9f5_100%)] px-6 py-8 md:px-8 md:py-10">
    <div id="benefits" class="scroll-mt-32" />
    <div class="max-w-3xl space-y-3">
      <p class="text-xs font-semibold uppercase tracking-[0.22em] text-[#e13515]">Benefits</p>
      <h2 class="font-[Montserrat] text-3xl font-semibold tracking-[-0.04em] text-[#101828] md:text-4xl">
        Benefits for the shop team, not just the listing.
      </h2>
      <p class="text-base leading-7 text-[#667085] md:text-lg">
        Printy is not just a directory. It is a shop workflow layer that helps your team quote faster, reply cleaner, and stay consistent.
      </p>
    </div>

    <div class="mt-8 grid gap-4 md:grid-cols-2">
      <article
        v-for="benefit in benefits"
        :key="benefit.title"
        class="rounded-[1.75rem] border border-[#f4ddd5] bg-white p-5 shadow-[0_16px_36px_-32px_rgba(16,24,40,0.26)]"
      >
        <h3 class="font-[Montserrat] text-xl font-semibold tracking-[-0.02em] text-[#101828]">
          {{ benefit.title }}
        </h3>
        <p class="mt-3 text-sm leading-7 text-[#667085]">
          {{ benefit.copy }}
        </p>
      </article>
    </div>
  </section>
</template>

<script setup lang="ts">
const benefits = [
  {
    title: 'More quote-ready demand',
    copy: 'Customers arrive with clearer job briefs, which means less time extracting missing details before quoting.',
  },
  {
    title: 'More consistent pricing',
    copy: 'Configured shop logic helps staff quote from the same structure instead of relying on memory or ad hoc shortcuts.',
  },
  {
    title: 'More confident replies',
    copy: 'The team can accept, modify, reject, or reply from a better-prepared starting point when details change.',
  },
  {
    title: 'More usable setup over time',
    copy: 'As products, papers, finishing, and rate cards are structured, your shop builds a cleaner quoting foundation.',
  },
]
</script>
