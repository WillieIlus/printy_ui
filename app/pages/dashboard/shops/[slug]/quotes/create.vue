<template>
  <div class="col-span-12 space-y-6">
    <DashboardPageHeader
      title="New quote"
      :subtitle="slug"
    >
      <template #actions>
        <UButton :to="`/dashboard/shops/${slug}/quotes`" variant="ghost" size="sm">Back</UButton>
      </template>
    </DashboardPageHeader>

    <div class="col-span-12">
      <QuotesQuoteForm
        :loading="quoteStore.loading"
        @submit="onSubmit"
        @cancel="goBack"
      />
    </div>
    <QuotesQuoteForm
      :slug="slug"
      :rate-card="rateCard"
      :loading="quoteStore.loading"
      submit-label="Create Quote"
      @submit="onSubmit"
      @cancel="goBack"
    />
  </div>
</template>

<script setup lang="ts">
import type { Quote } from '~/shared/types'
import { useQuoteStore } from '~/stores/quote'

definePageMeta({
  layout: 'dashboard',
  middleware: ['auth', 'shop-owner'],
})

const route = useRoute()
const quoteStore = useQuoteStore()
const pricingStore = usePricingStore()
const notification = useNotification()
const slug = computed(() => route.params.slug as string)
const rateCard = computed(() => pricingStore.rateCard)

onMounted(async () => {
  try {
    await pricingStore.fetchRateCard(slug.value)
  } catch {
    // Rate card might not be available
  }
})

function goBack() {
  navigateTo(`/dashboard/shops/${slug.value}/quotes`)
}

async function onSubmit(data: Partial<Quote>) {
  const result = await quoteStore.createQuote(slug.value, data)
  if (result.success && result.quote) {
    notification.success('Quote created')
    await navigateTo(`/dashboard/shops/${slug.value}/quotes/${result.quote.id}`)
  } else {
    notification.error(quoteStore.error ?? 'Create failed')
  }
}
</script>
