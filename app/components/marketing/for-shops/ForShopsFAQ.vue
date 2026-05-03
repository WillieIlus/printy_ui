<!-- Purpose: Answer common objections from shop owners before signup. -->
<template>
  <section id="for-shops-faq" class="rounded-[2rem] border border-[#f2d3c8] bg-[linear-gradient(180deg,#fffaf7_0%,#ffffff_100%)] px-6 py-8 md:px-8 md:py-10">
    <div id="faq" class="scroll-mt-32" />
    <div class="max-w-3xl space-y-3">
      <p class="text-xs font-semibold uppercase tracking-[0.22em] text-[#e13515]">FAQ</p>
      <h2 class="font-[Montserrat] text-3xl font-semibold tracking-[-0.04em] text-[#101828] md:text-4xl">
        Questions shop owners ask before joining.
      </h2>
    </div>

    <div class="mt-8 space-y-4">
      <article
        v-for="item in faqs"
        :key="item.question"
        class="rounded-[1.5rem] bg-white p-5 shadow-[0_16px_34px_-30px_rgba(16,24,40,0.22)]"
      >
        <h3 class="font-[Montserrat] text-xl font-semibold tracking-[-0.02em] text-[#101828]">
          {{ item.question }}
        </h3>
        <p class="mt-3 text-sm leading-7 text-[#667085]">
          {{ item.answer }}
        </p>
      </article>
    </div>
  </section>
</template>

<script setup lang="ts">
const faqs = [
  {
    question: 'Will Printy control my prices?',
    answer: 'No. You set your own prices, materials, finishing, and turnaround rules.',
  },
  {
    question: 'Will other shops see my rate card?',
    answer: 'No. Private shop rate cards are not exposed to competitors.',
  },
  {
    question: 'Can I reject a request?',
    answer: 'Yes. You can accept, modify, reject, or reply before confirming.',
  },
  {
    question: 'Do I need to enter everything myself?',
    answer: 'Early shops can get founder-assisted setup. We can help structure your first rate card.',
  },
  {
    question: 'Is this only for Nairobi?',
    answer: 'Printy is starting Nairobi-first to keep setup quality high, then expanding.',
  },
  {
    question: 'Is Printy a directory?',
    answer: 'No. The directory is only the visible layer. The real value is quote-readiness and shop-specific pricing logic.',
  },
]
</script>
