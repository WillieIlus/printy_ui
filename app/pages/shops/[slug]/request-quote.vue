<template>
  <div class="min-h-[60vh] flex items-center justify-center p-4">
    <div v-if="!shopStore.currentShop && shopStore.loading" class="flex justify-center py-12">
      <CommonLoadingSpinner />
    </div>
    <template v-else-if="shopStore.currentShop">
      <!-- Modal on desktop, Drawer on mobile - always open when on this page -->
      <QuotesQuoteRequestModal
        :open="true"
        title="Request a quote"
        @update:open="onClose"
      >
        <QuotesQuoteForm
            :slug="slug"
            :rate-card="rateCard"
            :loading="quoteStore.loading"
            @submit="onSubmit"
            @cancel="goBack"
          />
      </QuotesQuoteRequestModal>
    </template>
    <div v-else class="text-center text-gray-500">
      <p>Shop not found.</p>
      <UButton to="/shops" variant="link" class="mt-2">Browse shops</UButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useShopStore } from '~/stores/shop'
import { useQuoteStore } from '~/stores/quote'
import { usePricingStore } from '~/stores/pricing'
import { useNotification } from '~/composables/useNotification'

definePageMeta({ layout: 'default' })

const route = useRoute()
const shopStore = useShopStore()
const quoteStore = useQuoteStore()
const pricingStore = usePricingStore()
const notification = useNotification()

const slug = computed(() => route.params.slug as string)
const rateCard = computed(() => pricingStore.rateCard)

function goBack() {
  navigateTo(`/shops/${slug.value}`)
}

function onClose() {
  goBack()
}

onMounted(async () => {
  await shopStore.fetchShopBySlug(slug.value)
  if (shopStore.currentShop) {
    try {
      await pricingStore.fetchRateCard(slug.value)
    } catch {
      // Rate card might not be available
    }
  }
})

onUnmounted(() => {
  pricingStore.clearPricing()
})

async function onSubmit(data: Record<string, unknown>) {
  const result = await quoteStore.requestQuote(slug.value, data)
  if (result.success) {
    notification.success('Quote request sent')
    await navigateTo(`/shops/${slug.value}`)
  } else {
    notification.error(result.error ?? 'Request failed')
  }
}
</script>
