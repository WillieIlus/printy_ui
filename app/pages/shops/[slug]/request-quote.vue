<template>
  <div class="min-h-screen bg-[var(--p-bg)]">
    <div class="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <div class="mb-8">
        <NuxtLink :to="`/shops/${slug}`" class="inline-flex items-center gap-2 text-sm font-medium text-[var(--p-text-muted)] hover:text-[var(--p-text)]">
          <UIcon name="i-lucide-arrow-left" class="h-4 w-4" />
          {{ t('shop.backToShop') }}
        </NuxtLink>
        <h1 class="mt-4 text-3xl font-bold text-[var(--p-text)]">{{ t('shop.requestCustomPrintTitle') }}</h1>
        <p class="mt-2 max-w-2xl text-sm text-[var(--p-text-muted)]">
          {{ t('shop.requestCustomPrintDescription') }}
        </p>
      </div>

      <QuotesCalculatorHub>
        <template #flat>
          <section class="rounded-3xl border border-[var(--p-border)] bg-[var(--p-surface)] p-5 shadow-sm sm:p-8">
            <QuotesPublicCalculator
              :title="t('shop.requestCustomPrintTitle')"
              :description="t('shop.marketplaceRequestFromShopDescription', { shop: shopName || slug })"
              :eyebrow="t('shop.requestCustomPrintEyebrow')"
              mode="marketplace"
            />
          </section>
        </template>
        <template #booklet>
          <section class="rounded-3xl border border-[var(--p-border)] bg-[var(--p-surface)] p-5 shadow-sm sm:p-8">
            <QuotesBookletCalculator
              :title="t('shop.requestCustomBookletEyebrow')"
              :description="t('shop.marketplaceRequestFromShopDescription', { shop: shopName || slug })"
              :eyebrow="t('shop.requestCustomBookletEyebrow')"
              mode="marketplace"
            />
          </section>
        </template>
        <template #large_format>
          <section class="rounded-3xl border border-[var(--p-border)] bg-[var(--p-surface)] p-5 shadow-sm sm:p-8">
            <QuotesLargeFormatCalculator
              :title="t('shop.requestLargeFormatEyebrow')"
              :description="t('shop.marketplaceRequestFromShopDescription', { shop: shopName || slug })"
              :eyebrow="t('shop.requestLargeFormatEyebrow')"
              mode="marketplace"
            />
          </section>
        </template>
      </QuotesCalculatorHub>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { getCatalog } from '~/services/public'

definePageMeta({ layout: 'default' })

const route = useRoute()
const { t } = useI18n()
const slug = computed(() => route.params.slug as string)
const shopName = ref('')

onMounted(async () => {
  const catalog = await getCatalog(slug.value)
  shopName.value = catalog?.shop?.name ?? slug.value
})
</script>
