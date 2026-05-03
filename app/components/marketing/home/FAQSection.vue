<!-- Purpose: Homepage FAQ — accordion style matching the for-shops page. -->
<template>
  <section class="py-12">
    <div class="max-w-3xl mx-auto px-4 md:px-6">
      <h2 class="text-center text-2xl font-black text-[var(--p-text)] md:text-3xl">Common questions.</h2>
      <p class="mt-2 text-center text-sm text-[var(--p-text-muted)]">How the calculator and shop matching works.</p>
      <div class="mt-8 space-y-3">
        <div
          v-for="(item, i) in items"
          :key="i"
          class="border border-[var(--p-border)] rounded-xl overflow-hidden bg-[var(--p-surface-soft)]"
        >
          <button
            @click="open = open === i ? null : i"
            class="w-full text-left px-5 py-4 font-semibold text-[var(--p-text)] flex justify-between items-center text-sm"
          >
            {{ item.question }}
            <span class="text-[var(--p-primary)] font-bold text-lg ml-4 flex-shrink-0">{{ open === i ? '−' : '+' }}</span>
          </button>
          <div v-if="open === i" class="px-5 pb-4 text-sm text-[var(--p-text-muted)]">{{ item.answer }}</div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const open = ref<number | null>(null)

const items = [
  { question: 'Does the calculator show live pricing?', answer: 'Yes. Fields and prices are loaded live — including stock matching and available price ranges from each shop.' },
  { question: 'Can I send a request to shops from here?', answer: 'Yes. Once you calculate a price, select a matching shop and send a quote request directly from the results. No account needed to start.' },
  { question: 'Will booklet details like page count appear here?', answer: 'Yes. When you select a booklet product, the form shows the relevant fields — cover paper, inside pages, and page count.' },
]
</script>
