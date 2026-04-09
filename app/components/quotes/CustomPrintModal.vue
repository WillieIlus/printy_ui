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
                  :description="t('shop.marketplaceRequestFromShopDescription', { shop: fixedShopName || shopSlug })"
                  :eyebrow="t('shop.customPrintRequestEyebrow')"
                  mode="marketplace"
                />
              </template>
              <template #booklet>
                <QuotesBookletCalculator
                  :title="customBookletTitle"
                  :description="t('shop.marketplaceRequestFromShopDescription', { shop: fixedShopName || shopSlug })"
                  :eyebrow="t('shop.customBookletRequestEyebrow')"
                  mode="marketplace"
                />
              </template>
              <template #large_format>
                <QuotesLargeFormatCalculator
                  :title="customLargeFormatTitle"
                  :description="t('shop.marketplaceRequestFromShopDescription', { shop: fixedShopName || shopSlug })"
                  :eyebrow="t('shop.customLargeFormatRequestEyebrow')"
                  mode="marketplace"
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
import { useI18n } from 'vue-i18n'
import QuotesCalculatorHub from '~/components/quotes/CalculatorHub.vue'
import QuotesBookletCalculator from '~/components/quotes/BookletCalculator.vue'
import QuotesLargeFormatCalculator from '~/components/quotes/LargeFormatCalculator.vue'

const props = defineProps<{
  modelValue: boolean
  shopSlug: string
  paperOptions?: { value: number; label: string }[]
  fixedShopName?: string
}>()

const emit = defineEmits<{ 'update:modelValue': [v: boolean] }>()

const { t } = useI18n()

const customPrintTitle = computed(() => props.fixedShopName
  ? t('shop.requestCustomPrintTitle')
  : t('shop.requestCustomPrintTitle'))

const customBookletTitle = computed(() => props.fixedShopName
  ? t('shop.requestCustomBookletEyebrow')
  : t('shop.requestCustomBookletEyebrow'))

const customLargeFormatTitle = computed(() => props.fixedShopName
  ? t('shop.requestLargeFormatEyebrow')
  : t('shop.requestLargeFormatEyebrow'))
</script>
