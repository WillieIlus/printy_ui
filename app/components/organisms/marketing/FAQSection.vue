<!-- Purpose: FAQ accordion section for the marketing homepage. -->
<template>
  <section class="mx-auto max-w-2xl py-16">
    <div class="mb-8 text-center">
      <h2 class="text-3xl font-bold text-[var(--p-text)]">Frequently asked questions</h2>
      <p class="mt-2 text-[var(--p-text-muted)]">Everything you need to know about Printy.</p>
    </div>

    <div class="space-y-3">
      <div
        v-for="(item, i) in items"
        :key="i"
        class="rounded-[var(--radius-md)] border border-[var(--p-border)] bg-[var(--p-surface)]"
      >
        <button
          type="button"
          class="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
          :aria-expanded="open === i"
          @click="open = open === i ? null : i"
        >
          <span class="text-sm font-semibold text-[var(--p-text)]">{{ item.question }}</span>
          <Icon
            name="lucide:chevron-down"
            :class="[
              'size-4 shrink-0 text-[var(--p-text-muted)] transition-transform duration-200',
              open === i ? 'rotate-180' : '',
            ]"
          />
        </button>
        <div v-show="open === i" class="border-t border-[var(--p-border)] px-5 pb-4 pt-3">
          <p class="text-sm leading-relaxed text-[var(--p-text-muted)]">{{ item.answer }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  items?: { question: string; answer: string }[]
}>(), {
  items: () => [
    {
      question: 'How do I get a quote?',
      answer: 'Fill in the calculator on the homepage with your job details and click "Find print shops". We will show you matching shops with estimated prices.',
    },
    {
      question: 'Is Printy free to use?',
      answer: 'Yes – getting quotes is completely free. Print shops pay a small subscription to list their services on the platform.',
    },
    {
      question: 'How accurate are the prices shown?',
      answer: "Prices shown are estimates based on each shop's pricing rules. Final prices may vary based on artwork review and any custom requirements.",
    },
    {
      question: 'Can I upload my design file?',
      answer: 'Yes. You can attach your artwork (PDF, AI, PSD, PNG, or JPG) to help shops give you a more accurate quote.',
    },
  ],
})

const open = ref<number | null>(0)
</script>
