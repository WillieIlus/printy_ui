<!-- Purpose: Starter public detail page for a single product category. -->
<template>
  <section class="mx-auto max-w-5xl px-4 py-12 md:px-6">
    <div class="space-y-6">
      <BaseBadge tone="primary">Product detail</BaseBadge>
      <div class="space-y-3">
        <h1 class="text-4xl font-semibold tracking-tight text-slate-950">{{ slugTitle }}</h1>
        <p class="max-w-3xl text-sm text-slate-600">
          Placeholder product detail page for product guidance, supported specs, and a future quote shortcut.
        </p>
      </div>
      <div class="grid gap-4 md:grid-cols-3">
        <BaseCard v-for="item in sections" :key="item.title" class="space-y-2">
          <h2 class="text-lg font-semibold text-slate-950">{{ item.title }}</h2>
          <p class="text-sm text-slate-600">{{ item.description }}</p>
        </BaseCard>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import BaseBadge from '~/components/ui/BaseBadge.vue'
import BaseCard from '~/components/ui/BaseCard.vue'

const route = useRoute()

const slugTitle = computed(() =>
  String(route.params.slug || 'Product')
    .split('-')
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' '),
)

const sections = [
  { title: 'Core specs', description: 'Reserved for size, material, and finishing defaults.' },
  { title: 'Recommended shops', description: 'Placeholder for compatible shop recommendations when supported.' },
  { title: 'Quote action', description: 'Starter slot for sending a request based on this product.' },
]
</script>
