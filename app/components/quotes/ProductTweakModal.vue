<template>
  <QuotesQuoteConfigModal
    :open="isOpen"
    eyebrow="Quote Configuration"
    :title="`Configure ${product.name}`"
    description="This public tweak flow now runs on the shared calculator engine. Machine selection stays hidden in public mode."
    size="lg"
    @update:open="isOpen = $event"
  >
    <QuotesPublicCalculator
      :title="`Tweak ${product.name}`"
      description="Shared public calculator mode for tweak and tweak-and-quote flows."
      eyebrow="Tweak Flow"
      :mode="mode"
      :product="product"
      :fixed-shop-slug="shopSlug"
      :fixed-shop-name="shopName"
      @submit="onSubmit"
    />
  </QuotesQuoteConfigModal>
</template>

<script setup lang="ts">
import type { AddCustomItemPayload, AddProductItemPayload } from '~/services/quoteDraft'
import type { Product } from '~/shared/types'
import { useAnalyticsTracking } from '~/composables/useAnalyticsTracking'
import { useAuthStore } from '~/stores/auth'
import { useGuestQuoteStore } from '~/stores/guestQuote'
import { useQuoteDraftStore } from '~/stores/quoteDraft'

const props = defineProps<{
  product: Product
  shopSlug: string
  shopName?: string
  mode?: 'tweak' | 'tweak-and-quote'
}>()

const emit = defineEmits<{ (e: 'added'): void }>()

const isOpen = defineModel<boolean>({ default: false })

const authStore = useAuthStore()
const guestStore = useGuestQuoteStore()
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
    guestStore.addItem(props.shopSlug, props.shopName ?? 'Shop', props.product.name, {
      product: payload.product,
      quantity: payload.quantity,
      pricing_mode: payload.pricing_mode,
      paper: payload.paper ?? undefined,
      material: payload.material ?? undefined,
      machine: payload.machine ?? undefined,
      sides: payload.sides,
      color_mode: payload.color_mode,
      finishings: payload.finishings,
    })
    toast.add({ title: 'Added to draft', description: 'Sign in when you are ready to submit the quote request.', color: 'success' })
    emit('added')
    isOpen.value = false
    return
  }

  await quoteDraftStore.addTweakedProductToQuote(props.shopSlug, payload)
  toast.add({ title: 'Added to draft', description: `${props.product.name} added to your draft.`, color: 'success' })
  emit('added')
  isOpen.value = false
}
</script>
