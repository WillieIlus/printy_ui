<!-- Purpose: Starter public listing page for print products. -->
<template>
  <section class="mx-auto max-w-6xl px-4 py-12 md:px-6">
    <div class="space-y-8">
      <BaseSectionTitle
        eyebrow="Products"
        title="Browse printable product categories."
        description="A simple catalog spine for products without overcommitting to unsupported backend logic."
      />
      <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <BaseCard v-for="product in products" :key="product.name" class="space-y-3">
          <BaseBadge tone="neutral">{{ product.tag }}</BaseBadge>
          <h2 class="text-xl font-semibold text-slate-950">{{ product.name }}</h2>
          <p class="text-sm text-slate-600">{{ product.summary }}</p>
          <BaseButton :to="product.to" variant="secondary" size="sm">View product</BaseButton>
        </BaseCard>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import BaseBadge from '~/components/ui/BaseBadge.vue'
import BaseButton from '~/components/ui/BaseButton.vue'
import BaseCard from '~/components/ui/BaseCard.vue'
import BaseSectionTitle from '~/components/ui/BaseSectionTitle.vue'

const products = [
  { name: 'Flyers', tag: 'Promo', summary: 'Starter category page for promotional jobs.', to: '/products/flyers' },
  { name: 'Business cards', tag: 'Core', summary: 'Shell for a common repeat-order category.', to: '/products/business-cards' },
  { name: 'Posters', tag: 'Large format', summary: 'Placeholder for shop capability matches and print specs.', to: '/products/posters' },
]
</script>
