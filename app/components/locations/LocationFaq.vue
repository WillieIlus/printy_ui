<script setup lang="ts">
interface FaqItem {
  question: string
  answer: string
}

interface Props {
  locationName: string
  shopCount?: number
  items?: FaqItem[]
}

const props = withDefaults(defineProps<Props>(), {
  shopCount: 0,
  items: () => [],
})

const defaultFaqs = computed<FaqItem[]>(() => [
  {
    question: `How do I get a printing quote in ${props.locationName}?`,
    answer: `Browse our list of print shops in ${props.locationName}, pick a shop, and add products to your quote. You can customize paper, quantity, and finishing options. Most shops provide instant pricing for standard items like business cards and flyers.`,
  },
  {
    question: `What can I print?`,
    answer: `Print shops in ${props.locationName} typically offer business cards, flyers, posters, brochures, stickers, and more. Each shop has its own catalog—browse their products to see available sizes, paper stocks, and finishing options.`,
  },
  {
    question: `How long does printing take?`,
    answer: `Turnaround varies by shop and product. Simple jobs like business cards can often be ready in 1–3 days. Larger orders or custom work may take longer. Contact the shop directly for specific timelines.`,
  },
  {
    question: `Can I compare prices between shops?`,
    answer: `Yes. Add the same or similar products from different shops to get quotes. Printy shows you pricing as you customize, so you can compare before requesting a formal quote.`,
  },
])

const faqItems = computed(() =>
  props.items.length > 0 ? props.items : defaultFaqs.value
)

const openIndex = ref<number | null>(null)

function toggle(index: number) {
  openIndex.value = openIndex.value === index ? null : index
}
</script>

<template>
  <section class="rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface)] p-6 sm:p-8">
    <h2 class="text-xl font-semibold text-[var(--p-text)] sm:text-2xl">
      Frequently asked questions
    </h2>
    <p class="mt-2 text-sm text-[var(--p-text-muted)]">
      Common questions about printing in {{ locationName }}
    </p>
    <ul class="mt-6 space-y-4">
      <li
        v-for="(item, i) in faqItems"
        :key="i"
        class="rounded-xl border border-[var(--p-border)] bg-[var(--p-bg)] overflow-hidden"
      >
        <button
          type="button"
          class="flex w-full items-center justify-between gap-4 px-4 py-4 text-left text-sm font-medium text-[var(--p-text)] hover:bg-[var(--p-surface-sunken)] transition-colors"
          @click="toggle(i)"
        >
          <span>{{ item.question }}</span>
          <UIcon
            :name="openIndex === i ? 'i-lucide-chevron-up' : 'i-lucide-chevron-down'"
            class="h-4 w-4 shrink-0 text-[var(--p-text-muted)]"
          />
        </button>
        <div
          v-show="openIndex === i"
          class="border-t border-[var(--p-border)] px-4 py-3 text-sm text-[var(--p-text-muted)]"
        >
          {{ item.answer }}
        </div>
      </li>
    </ul>
  </section>
</template>
