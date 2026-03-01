<template>
  <div class="col-span-12 space-y-6">
    <DashboardPageHeader
      title="Add product template"
      subtitle="Create a preset for quick quoting"
    >
      <template #actions>
        <UButton :to="`/dashboard/shops/${slug}/products`" variant="ghost" size="sm">Back</UButton>
      </template>
    </DashboardPageHeader>

    <div class="col-span-12">
      <DashboardSectionCard>
        <ProductsProductTemplateForm
          :loading="quoteStore.loading"
          @submit="onSubmit"
          @cancel="goBack"
        />
      </DashboardSectionCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ProductTemplate } from '~/shared/types'
import { useQuoteStore } from '~/stores/quote'

definePageMeta({
  layout: 'dashboard',
  middleware: ['auth', 'shop-owner'],
})

const route = useRoute()
const quoteStore = useQuoteStore()
const notification = useNotification()
const slug = computed(() => route.params.slug as string)

function goBack() {
  navigateTo(`/dashboard/shops/${slug.value}/products`)
}

async function onSubmit(data: Partial<ProductTemplate> & { base_price?: string; unit?: string }) {
  const payload = {
    name: data.name,
    description: data.description ?? null,
    is_active: data.is_active ?? true,
    defaults: {
      ...(data.base_price && { base_price: data.base_price }),
      ...(data.unit && { unit: data.unit }),
    },
  }
  const result = await quoteStore.createProductTemplate(slug.value, payload)
  if (result.success && result.product) {
    notification.success('Product template created')
    await navigateTo(`/dashboard/shops/${slug.value}/products`)
  } else {
    notification.error(quoteStore.error ?? 'Create failed')
  }
}
</script>
