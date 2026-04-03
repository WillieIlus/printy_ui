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
                  :title="`Request custom print${shopNameSuffix}`"
                  description="Single-shop public mode keeps the shop fixed, removes send-to-shops UI, and preserves the quote-draft submission flow."
                  eyebrow="Custom print request"
                  mode="single-shop"
                  :fixed-shop-slug="shopSlug"
                  :fixed-shop-name="fixedShopName"
                  @submit="onSubmit"
                />
              </template>
              <template #booklet>
                <QuotesBookletCalculator
                  :title="`Request custom booklet${shopNameSuffix}`"
                  description="Keep the shop fixed and use the backend booklet preview without leaving this modal flow."
                  eyebrow="Custom booklet request"
                  :fixed-shop-slug="shopSlug"
                  :fixed-shop-name="fixedShopName"
                />
              </template>
              <template #large_format>
                <QuotesLargeFormatCalculator
                  :title="`Request large-format print${shopNameSuffix}`"
                  description="Keep the shop fixed and use the backend large-format preview without leaving this modal flow."
                  eyebrow="Custom large-format request"
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

const quoteDraftStore = useQuoteDraftStore()
const toast = useToast()

const shopNameSuffix = computed(() => props.fixedShopName ? ` for ${props.fixedShopName}` : '')

async function onSubmit(payload: AddCustomItemPayload | AddProductItemPayload) {
  if (payload.item_type !== 'CUSTOM') return
  quoteDraftStore.setShop(props.shopSlug)
  await quoteDraftStore.addCustomToQuote(payload)
  toast.add({ title: 'Added to Quote', description: `${payload.title} added.`, color: 'success' })
  emit('update:modelValue', false)
}
</script>
