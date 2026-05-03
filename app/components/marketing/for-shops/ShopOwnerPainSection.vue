<!-- Purpose: Empathy section highlighting the daily quoting friction print shops deal with. -->
<template>
  <section id="shop-owner-pain-section" class="space-y-6 rounded-[2rem] border border-[#f2d3c8] bg-white px-6 py-8 shadow-[0_24px_60px_-46px_rgba(16,24,40,0.28)] md:px-8 md:py-10">
    <div class="max-w-3xl space-y-3">
      <p class="text-xs font-semibold uppercase tracking-[0.22em] text-[#e13515]">Why this matters</p>
      <h2 class="font-[Montserrat] text-3xl font-semibold tracking-[-0.04em] text-[#101828] md:text-4xl">
        Built for the problems print shops face every day.
      </h2>
      <p class="text-base leading-7 text-[#667085] md:text-lg">
        Before a job is quoted, your team often has to chase missing details. Printy helps clean up the request before it reaches your shop.
      </p>
    </div>

    <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <article
        v-for="card in cards"
        :key="card.title"
        class="rounded-[1.75rem] border border-[#f4ddd5] bg-[#fffaf7] p-5 shadow-[0_18px_36px_-32px_rgba(16,24,40,0.35)]"
      >
        <div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#fff1eb] text-lg font-semibold text-[#e13515]">
          {{ card.marker }}
        </div>
        <div class="mt-5 space-y-3">
          <h3 class="font-[Montserrat] text-xl font-semibold tracking-[-0.02em] text-[#101828]">
            {{ card.title }}
          </h3>
          <p class="text-sm leading-7 text-[#667085]">
            {{ card.copy }}
          </p>
        </div>
      </article>
    </div>
  </section>
</template>

<script setup lang="ts">
const cards = [
  {
    marker: '01',
    title: 'Too much WhatsApp back-and-forth',
    copy: 'Customers ask "how much?" before giving quantity, size, paper, or finishing.',
  },
  {
    marker: '02',
    title: 'Incomplete job specs',
    copy: 'Your team wastes time chasing details before a real quote can happen.',
  },
  {
    marker: '03',
    title: 'Inconsistent quoting',
    copy: 'Different people quote differently. Finishing, wastage, or paper cost can be forgotten.',
  },
  {
    marker: '04',
    title: 'Idle machines, slow decisions',
    copy: 'A delayed quote can mean a lost job even when your shop could produce it.',
  },
]
</script>
