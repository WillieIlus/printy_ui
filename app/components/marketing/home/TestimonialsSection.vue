<!-- Purpose: Homepage social proof placeholder cards. -->
<template>
  <section class="mx-auto max-w-6xl px-4 py-14 md:px-6">
    <div class="space-y-8">
      <BaseSectionTitle
        eyebrow="Testimonials"
        title="Starter proof blocks for the marketing surface."
        description="These are presentation shells only until real testimonial content is approved."
      />
      <div class="grid gap-4 lg:grid-cols-3">
        <BaseCard v-for="item in items" :key="item.name" class="space-y-4">
          <p class="text-sm text-[var(--p-text-muted)]">{{ item.quote }}</p>
          <div>
            <p class="font-semibold text-[var(--p-text)]">{{ item.name }}</p>
            <p class="text-sm text-[var(--p-text-muted)]">{{ item.role }}</p>
          </div>
        </BaseCard>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import BaseCard from '~/components/ui/BaseCard.vue'
import BaseSectionTitle from '~/components/ui/BaseSectionTitle.vue'

const items = [
  { name: 'Studio lead', role: 'Agency operations', quote: 'The structure makes it easier to start jobs without overexplaining every detail.' },
  { name: 'Procurement admin', role: 'In-house marketing team', quote: 'Comparing replies from multiple shops feels more orderly than scattered chats.' },
  { name: 'Shop owner', role: 'Commercial printer', quote: 'A cleaner request brief leads to less follow-up and faster quoting.' },
]
</script>
