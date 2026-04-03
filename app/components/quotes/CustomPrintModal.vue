<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="modelValue"
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
        role="dialog"
        aria-modal="true"
        @keydown.esc="$emit('update:modelValue', false)"
      >
        <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="$emit('update:modelValue', false)" />

        <div class="relative z-[100010] max-h-[92vh] w-full max-w-6xl overflow-y-auto rounded-lg border border-white/10 bg-mirage-950 shadow-lg" @click.stop>
          <div class="p-5 sm:p-6">
            <QuotesCalculatorHub>
              <template #flat>
                <QuotesPublicCalculator
                  :title="customPrintTitle"
                  :description="t('shop.customPrintModalDescription')"
                  :eyebrow="t('shop.customPrintRequestEyebrow')"
                  mode="single-shop"
                  :fixed-shop-slug="shopSlug"
                  :fixed-shop-name="fixedShopName"
                  @submit="onSubmit"
                />
              </template>
              <template #booklet>
                <QuotesBookletCalculator
                  :title="customBookletTitle"
                  :description="t('shop.customBookletModalDescription')"
                  :eyebrow="t('shop.customBookletRequestEyebrow')"
                  :fixed-shop-slug="shopSlug"
                  :fixed-shop-name="fixedShopName"
                />
              </template>
              <template #large_format>
                <QuotesLargeFormatCalculator
                  :title="customLargeFormatTitle"
                  :description="t('shop.customLargeFormatModalDescription')"
                  :eyebrow="t('shop.customLargeFormatRequestEyebrow')"
                  :fixed-shop-slug="shopSlug"
                  :fixed-shop-name="fixedShopName"
                />
              </template>
            </QuotesCalculatorHub>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { useToast } from '#imports'
import { useI18n } from 'vue-i18n'
import type { AddCustomItemPayload, AddProductItemPayload } from '~/services/quoteDraft'
import QuotesCalculatorHub from '~/components/quotes/CalculatorHub.vue'
import QuotesBookletCalculator from '~/components/quotes/BookletCalculator.vue'
import QuotesLargeFormatCalculator from '~/components/quotes/LargeFormatCalculator.vue'
import { useQuoteDraftStore } from '~/stores/quoteDraft'

const props = defineProps<{
  modelValue: boolean
  shopSlug: string
  paperOptions?: { value: number; label: string }[]
  fixedShopName?: string
}>()

const emit = defineEmits<{ 'update:modelValue': [v: boolean] }>()

const { t } = useI18n()
const quoteDraftStore = useQuoteDraftStore()
const toast = useToast()

const customPrintTitle = computed(() => props.fixedShopName
  ? t('shop.requestCustomPrintFor', { shop: props.fixedShopName })
  : t('shop.requestCustomPrintTitle'))

const customBookletTitle = computed(() => props.fixedShopName
  ? t('shop.requestCustomBookletFor', { shop: props.fixedShopName })
  : t('shop.singleShopBookletTitle'))

const customLargeFormatTitle = computed(() => props.fixedShopName
  ? t('shop.requestLargeFormatFor', { shop: props.fixedShopName })
  : t('shop.singleShopLargeFormatTitle'))

async function onSubmit(payload: AddCustomItemPayload | AddProductItemPayload) {
  if (payload.item_type !== 'CUSTOM') return
  quoteDraftStore.setShop(props.shopSlug)
  await quoteDraftStore.addCustomToQuote(payload)
  toast.add({
    title: t('shop.addedToQuoteTitle'),
    description: t('shop.addedToQuoteDescription', { name: payload.title }),
    color: 'success',
  })
  emit('update:modelValue', false)
}
</script>
