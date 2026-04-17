<template>
  <QuotesQuoteConfigModal
    :open="isOpen"
    :eyebrow="t('shop.quoteConfiguration')"
    :title="t('shop.configureProduct', { name: product.name })"
    :description="t('shop.productTweakDescription')"
    size="lg"
    @update:open="isOpen = $event"
  >
    <QuotesCalculatorHub>
      <template #flat>
        <QuotesPublicCalculator
          :title="t('shop.tweakProduct', { name: product.name })"
          :description="t('shop.tweakFlowDescription')"
          :eyebrow="t('shop.tweakFlow')"
          :mode="mode"
          :product="product"
          :fixed-shop-slug="shopSlug"
          :fixed-shop-name="shopName"
          @submit="onSubmit"
        />
      </template>
      <template #booklet>
        <QuotesBookletCalculator
          :title="t('shop.bookletRequestForProduct', { name: product.name })"
          :description="t('shop.bookletFlowDescription')"
          :eyebrow="t('shop.bookletFlow')"
          :fixed-shop-slug="shopSlug"
          :fixed-shop-name="shopName"
        />
      </template>
      <template #large_format>
        <QuotesLargeFormatCalculator
          :title="t('shop.largeFormatRequestForProduct', { name: product.name })"
          :description="t('shop.largeFormatFlowDescription')"
          :eyebrow="t('shop.largeFormatFlow')"
          :fixed-shop-slug="shopSlug"
          :fixed-shop-name="shopName"
        />
      </template>
    </QuotesCalculatorHub>
  </QuotesQuoteConfigModal>
</template>

<script setup lang="ts">
import { useToast } from '#imports'
import { useI18n } from 'vue-i18n'
import type { AddCustomItemPayload, AddProductItemPayload } from '~/services/quoteDraft'
import type { Product } from '~/shared/types'
import { useAnalyticsTracking } from '~/composables/useAnalyticsTracking'
import QuotesCalculatorHub from '~/components/quotes/CalculatorHub.vue'
import QuotesBookletCalculator from '~/components/quotes/BookletCalculator.vue'
import QuotesLargeFormatCalculator from '~/components/quotes/LargeFormatCalculator.vue'
import { useAuthStore } from '~/stores/auth'
import { useGuestQuoteStore } from '~/stores/guestQuote'
import { useQuoteDraftStore } from '~/stores/quoteDraft'

import { usePendingActionStore } from '~/stores/pendingAction'

const props = defineProps<{
  product: Product
  shopSlug: string
  shopName?: string
  mode?: 'tweak' | 'tweak-and-quote'
}>()

const emit = defineEmits<{ (e: 'added'): void }>()

const isOpen = defineModel<boolean>({ default: false })

const authStore = useAuthStore()
const { t } = useI18n()
const pendingActionStore = usePendingActionStore()
const quoteDraftStore = useQuoteDraftStore()
const toast = useToast()
const { trackQuoteStart } = useAnalyticsTracking()

const mode = computed(() => props.mode ?? 'tweak')

watch(isOpen, (open) => {
  if (!open) return
  void trackQuoteStart({
    source: mode.value === 'tweak-and-quote' ? 'gallery_tweak_and_quote' : 'gallery_tweak',
    product_id: props.product.id,
    product_name: props.product.name,
    product_slug: props.product.slug,
    shop_slug: props.shopSlug,
  })
})

async function onSubmit(payload: AddProductItemPayload | AddCustomItemPayload) {
  if (payload.item_type !== 'PRODUCT') return
  if (!authStore.isAuthenticated) {
    pendingActionStore.setAction({
      name: 'addTweakedProductToQuote',
      payload: { shopSlug: props.shopSlug, payload },
      redirectPath: useRoute().fullPath,
    })

    await navigateTo({
      path: '/auth/login',
      query: {
        redirect: useRoute().fullPath,
        role: 'client',
      },
    })
    return
  }

  await quoteDraftStore.addTweakedProductToQuote(props.shopSlug, payload)
  toast.add({ title: t('shop.addedToQuoteTitle'), description: t('shop.addedToQuoteDescription', { name: props.product.name }), color: 'success' })
  emit('added')
  isOpen.value = false
}
</script>
