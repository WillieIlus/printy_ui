<!-- Purpose: Show how structured requests protect margins and quoting conversations. -->
<template>
  <section id="negotiation-safe-pricing-section" class="rounded-[2rem] border border-[#f2d3c8] bg-white px-6 py-8 shadow-[0_24px_60px_-44px_rgba(16,24,40,0.24)] md:px-8 md:py-10">
    <div class="max-w-3xl space-y-3">
      <p class="text-xs font-semibold uppercase tracking-[0.22em] text-[#e13515]">Negotiation-safe pricing</p>
      <h2 class="font-[Montserrat] text-3xl font-semibold tracking-[-0.04em] text-[#101828] md:text-4xl">
        Cleaner requests create safer pricing conversations.
      </h2>
      <p class="text-base leading-7 text-[#667085] md:text-lg">
        When quantities, materials, finishing, and turnaround are clearer upfront, your team spends less time rescuing vague requests and more time protecting margins.
      </p>
    </div>

    <div class="mt-8 grid gap-4 md:grid-cols-3">
      <article
        v-for="item in cards"
        :key="item.title"
        class="rounded-[1.75rem] border border-[#f4ddd5] bg-[#fffaf7] p-5"
      >
        <h3 class="font-[Montserrat] text-xl font-semibold tracking-[-0.02em] text-[#101828]">
          {{ item.title }}
        </h3>
        <p class="mt-3 text-sm leading-7 text-[#667085]">
          {{ item.copy }}
        </p>
      </article>
    </div>
  </section>
</template>

<script setup lang="ts">
const cards = [
  {
    title: 'Less guesswork',
    copy: 'Specs arrive with more context, so your team is not forced to fill in risky assumptions before quoting.',
  },
  {
    title: 'Fewer margin leaks',
    copy: 'Configured papers, finishing, and turnaround rules help reduce forgotten cost items during busy quoting windows.',
  },
  {
    title: 'Better client conversations',
    copy: 'If something needs changing, the shop can modify or reply with structure instead of starting over from scratch.',
  },
]
</script>
