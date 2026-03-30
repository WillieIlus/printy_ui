<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { usePricingStore } from '~/stores/pricing'
import { useLocalQuotesStore } from '~/stores/localQuotes'
import { useNotification } from '~/composables/useNotification'
import { nativeInputBaseClass } from '~/utils/formUi'
import type { RateCard, PriceCalculationInput, PriceCalculationResult } from '~/shared/types'

interface Props {
  slug: string
  rateCard?: RateCard
  shopName?: string
  shopPhone?: string
}

const props = withDefaults(defineProps<Props>(), { shopName: '', shopPhone: '', rateCard: undefined })
const emit = defineEmits<{
  (e: 'calculated', result: PriceCalculationResult): void
}>()

const pricingStore = usePricingStore()

type CalcMode = 'sheet' | 'large_format'
const calcMode = ref<CalcMode>('sheet')

const sheetSize = ref<'A5' | 'A4' | 'A3' | 'SRA3'>('A3')
const gsm = ref(150)
const quantity = ref(100)
const sides = ref<1 | 2>(1)
const paperType = ref<'GLOSS' | 'MATTE' | 'BOND' | 'ART'>('GLOSS')

const materialType = ref<'BANNER' | 'VINYL' | 'REFLECTIVE' | 'CANVAS' | 'MESH'>('BANNER')
const areaSqm = ref(1)
const largeFormatQuantity = ref(1)

const selectedFinishing = ref<number[]>([])

const availableGSM = computed(() => {
  if (!props.rateCard?.paper) return [80, 100, 130, 150, 170, 200, 250, 300]
  const gsms = [...new Set(props.rateCard.paper.map(p => p.gsm))]
  return gsms.sort((a, b) => a - b)
})

const result = ref<PriceCalculationResult | null>(null)
const calculating = ref(false)
const error = ref<string | null>(null)
const overridePrice = ref<string | null>(null)
const saving = ref(false)
const savedQuoteId = ref<string | null>(null)

const calculatePrice = async () => {
  calculating.value = true
  error.value = null

  try {
    let input: PriceCalculationInput
    if (calcMode.value === 'sheet') {
      input = {
        sheet_size: sheetSize.value,
        gsm: gsm.value,
        quantity: quantity.value,
        sides: sides.value,
        paper_type: paperType.value,
        finishing_ids: selectedFinishing.value,
      }
    } else {
      input = {
        unit: 'SQM',
        material_type: materialType.value,
        area_sqm: areaSqm.value,
        quantity: largeFormatQuantity.value,
        finishing_ids: selectedFinishing.value,
      }
    }

    result.value = await pricingStore.calculatePrice(props.slug, input)
    if (result.value) emit('calculated', result.value)
  } catch (err: unknown) {
    error.value = (err instanceof Error ? err.message : null) || 'Failed to calculate price'
  } finally {
    calculating.value = false
  }
}

let debounceTimer: ReturnType<typeof setTimeout>
watch(
  [calcMode, sheetSize, gsm, quantity, sides, paperType, materialType, areaSqm, largeFormatQuantity, selectedFinishing],
  () => {
    clearTimeout(debounceTimer)
    debounceTimer = setTimeout(calculatePrice, 500)
  }
)

onMounted(() => {
  calculatePrice()
})

const quoteSnapshot = computed(() => {
  const price = overridePrice.value && overridePrice.value !== ''
    ? overridePrice.value
    : result.value?.grand_total ?? '0'
  const finishingNames = props.rateCard?.finishing
    ?.filter((f) => selectedFinishing.value.includes(f.id))
    .map((f) => f.name) ?? []
  const base = {
    shopName: props.shopName || 'Printy',
    shopPhone: props.shopPhone,
    currency: result.value?.currency ?? null,
    finishingNames: finishingNames.length ? finishingNames : undefined,
    suggestedPrice: price,
    validityDays: 7,
  }
  if (calcMode.value === 'sheet') {
    return {
      ...base,
      sheetSize: sheetSize.value,
      gsm: gsm.value,
      paperType: paperType.value,
      quantity: quantity.value,
      sides: sides.value,
    }
  }
  return {
    ...base,
    materialType: materialType.value,
    areaSqm: areaSqm.value,
    quantity: largeFormatQuantity.value,
  }
})

const localQuotesStore = useLocalQuotesStore()
const notification = useNotification()
const nativeFieldClass = `${nativeInputBaseClass} px-4`
const { formatMoney } = useCurrencyFormatter(computed(() => result.value?.currency ?? null))

async function handleSaveQuote() {
  if (!quoteSnapshot.value || !result.value) return
  saving.value = true
  try {
    const costRows = [
      { label: 'Paper', amount: result.value.total_paper, configured: parseFloat(result.value.total_paper) > 0 },
      { label: 'Printing', amount: result.value.total_printing, configured: parseFloat(result.value.total_printing) > 0 },
      { label: 'Finishing', amount: result.value.total_finishing, configured: parseFloat(result.value.total_finishing) > 0 },
    ]
    const quote = localQuotesStore.addQuote({
      shopSlug: props.slug,
      shopName: props.shopName || 'Printy',
      snapshot: quoteSnapshot.value,
      costBreakdown: costRows,
      suggestedPrice: overridePrice.value || result.value.grand_total,
      overridePrice: overridePrice.value,
      status: 'draft',
    })
    savedQuoteId.value = quote.id
    notification.success('Quote saved locally')
  } catch (err) {
    notification.error(err instanceof Error ? err.message : 'Failed to save')
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <div class="softui-panel softui-glow relative rounded-lg p-5 sm:p-6">
    <div class="mb-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p class="inline-flex items-center gap-2 rounded-full border border-[var(--p-accent)]/20 bg-[var(--p-accent)]/10 px-3 py-1 text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-[var(--p-accent-strong)]">
          <UIcon name="i-lucide-calculator" class="h-4 w-4" />
          Pricing Tool
        </p>
        <h3 class="mt-3 text-xl font-semibold tracking-[0.01em] text-[var(--p-text)] sm:text-2xl">
          Quote in under 60 seconds
        </h3>
        <p class="mt-2 max-w-xl text-sm leading-6 text-[var(--p-text-muted)]">
          Premium mobile-first calculator for quick Kenyan print pricing.
        </p>
      </div>
      <div class="softui-chip inline-flex self-start rounded-md px-3 py-1.5 text-xs font-medium text-[var(--p-text-dim)]">
        KES-first pricing
      </div>
    </div>

    <div class="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1.1fr)_minmax(18rem,0.9fr)]">
      <div class="space-y-3">
        <QuotesQuoteInputsSection title="Job Type" :default-open="true">
          <div class="softui-segment grid grid-cols-2 gap-2 rounded-md p-2">
            <button
              type="button"
              class="rounded-md px-4 py-2 text-sm font-semibold transition-all"
              :class="calcMode === 'sheet'
                ? 'bg-[var(--p-accent)]/20 text-[var(--p-accent-strong)] shadow-[var(--shadow-sm)] ring-1 ring-[var(--p-accent)]/30'
                : 'text-[var(--p-text-muted)] hover:bg-[var(--p-surface-sunken)] hover:text-[var(--p-text-dim)]'"
              @click="calcMode = 'sheet'"
            >
              Sheet (A4/A3)
            </button>
            <button
              type="button"
              class="rounded-md px-4 py-2 text-sm font-semibold transition-all"
              :class="calcMode === 'large_format'
                ? 'bg-[var(--p-accent)]/20 text-[var(--p-accent-strong)] shadow-[var(--shadow-sm)] ring-1 ring-[var(--p-accent)]/30'
                : 'text-[var(--p-text-muted)] hover:bg-[var(--p-surface-sunken)] hover:text-[var(--p-text-dim)]'"
              @click="calcMode = 'large_format'"
            >
              Large Format
            </button>
          </div>
        </QuotesQuoteInputsSection>

        <template v-if="calcMode === 'sheet'">
          <QuotesQuoteInputsSection title="Print Specs" :default-open="true">
            <div class="space-y-4">
              <div>
                <label class="mb-1 block text-sm font-medium text-[var(--p-text-dim)]">Paper Size</label>
                <select v-model="sheetSize" :class="nativeFieldClass">
                  <option value="A5">A5</option>
                  <option value="A4">A4</option>
                  <option value="A3">A3</option>
                  <option value="SRA3">SRA3</option>
                </select>
              </div>
              <div>
                <label class="mb-1 block text-sm font-medium text-[var(--p-text-dim)]">Quantity (sheets)</label>
                <input
                  v-model.number="quantity"
                  type="number"
                  min="1"
                  :class="nativeFieldClass"
                >
              </div>
              <div>
                <label class="mb-2 block text-sm font-medium text-[var(--p-text-dim)]">Print Sides</label>
                <div class="softui-segment grid grid-cols-2 gap-2 rounded-md p-2">
                  <button
                    type="button"
                    class="rounded-md px-4 py-2 text-sm font-semibold transition-all"
                    :class="sides === 1
                      ? 'bg-[var(--p-surface-raised)] text-[var(--p-text)] ring-1 ring-[var(--p-border)] shadow-[var(--p-soft-shadow)]'
                      : 'text-[var(--p-text-muted)] hover:bg-[var(--p-surface-sunken)] hover:text-[var(--p-text-dim)]'"
                    @click="sides = 1"
                  >
                    Single-sided
                  </button>
                  <button
                    type="button"
                    class="rounded-md px-4 py-2 text-sm font-semibold transition-all"
                    :class="sides === 2
                      ? 'bg-[var(--p-surface-raised)] text-[var(--p-text)] ring-1 ring-[var(--p-border)] shadow-[var(--p-soft-shadow)]'
                      : 'text-[var(--p-text-muted)] hover:bg-[var(--p-surface-sunken)] hover:text-[var(--p-text-dim)]'"
                    @click="sides = 2"
                  >
                    Double-sided
                  </button>
                </div>
              </div>
            </div>
          </QuotesQuoteInputsSection>

          <QuotesQuoteInputsSection title="Materials" :default-open="true">
            <div class="space-y-4">
              <div>
                <label class="mb-1 block text-sm font-medium text-[var(--p-text-dim)]">Paper Type</label>
                <select v-model="paperType" :class="nativeFieldClass">
                  <option value="GLOSS">Gloss</option>
                  <option value="MATTE">Matte</option>
                  <option value="BOND">Bond</option>
                  <option value="ART">Art Paper</option>
                </select>
              </div>
              <div>
                <label class="mb-1 block text-sm font-medium text-[var(--p-text-dim)]">Paper Weight (GSM)</label>
                <select v-model="gsm" :class="nativeFieldClass">
                  <option v-for="g in availableGSM" :key="g" :value="g">{{ g }} gsm</option>
                </select>
              </div>
            </div>
          </QuotesQuoteInputsSection>
        </template>

        <QuotesQuoteInputsSection v-else title="Large Format (SQM)" :default-open="true">
          <div class="space-y-4">
            <div>
              <label class="mb-1 block text-sm font-medium text-[var(--p-text-dim)]">Material Type</label>
              <select v-model="materialType" :class="nativeFieldClass">
                <option value="BANNER">Banner</option>
                <option value="VINYL">Vinyl</option>
                <option value="REFLECTIVE">Reflective</option>
                <option value="CANVAS">Canvas</option>
                <option value="MESH">Mesh</option>
              </select>
            </div>
            <div>
              <label class="mb-1 block text-sm font-medium text-[var(--p-text-dim)]">Area (SQM)</label>
              <input
                v-model.number="areaSqm"
                type="number"
                min="0.1"
                step="0.1"
                :class="nativeFieldClass"
              >
            </div>
            <div>
              <label class="mb-1 block text-sm font-medium text-[var(--p-text-dim)]">Quantity</label>
              <input
                v-model.number="largeFormatQuantity"
                type="number"
                min="1"
                :class="nativeFieldClass"
              >
            </div>
          </div>
        </QuotesQuoteInputsSection>

        <QuotesQuoteInputsSection v-if="rateCard?.finishing?.length" title="Finishing & Delivery" :default-open="false">
          <div class="space-y-2 max-h-40 overflow-y-auto">
            <label
              v-for="service in rateCard.finishing"
              :key="service.id"
              class="softui-chip flex items-center gap-3 rounded-md px-3 py-2.5 transition-transform hover:-translate-y-0.5"
            >
              <input
                v-model="selectedFinishing"
                type="checkbox"
                :value="service.id"
                class="h-4 w-4 rounded border-[var(--p-border)] bg-transparent text-[var(--p-accent-strong)] focus:ring-[var(--p-accent)]/30"
              >
              <span class="text-sm text-[var(--p-text-dim)]">{{ service.name }}</span>
              <span class="ml-auto text-right text-xs font-medium uppercase tracking-[0.1em] text-[var(--p-text-muted)]">{{ formatMoney(service.price) }}/{{ (service.display_unit_label || service.charge_unit).replace('PER_', '').toLowerCase() }}</span>
            </label>
          </div>
        </QuotesQuoteInputsSection>
      </div>

      <div class="self-start lg:sticky lg:top-24">
        <div v-if="calculating" class="softui-card flex items-center justify-center rounded-lg py-12">
          <CommonLoadingSpinner />
        </div>

        <div v-else-if="error" class="rounded-lg border border-red-400/20 bg-red-500/8 p-5">
          <p class="text-sm text-red-600 dark:text-red-400">{{ error }}</p>
        </div>

        <QuotesQuoteOutputPanel
          v-else
          :pricing="result"
          :override-price="overridePrice"
          :show-override="true"
          @update:override-price="overridePrice = $event"
        >
          <template #actions>
            <QuotesQuoteActions
              :snapshot="quoteSnapshot"
              :show-save="true"
              :show-print="!!savedQuoteId"
              :print-url="savedQuoteId ? `/quote/print?id=${savedQuoteId}` : null"
              :saving="saving"
              @save="handleSaveQuote"
            />
            <NuxtLink
              :to="`/shops/${props.slug}/request-quote`"
              class="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-md border border-[var(--p-accent)]/20 bg-[var(--p-accent)]/10 px-4 py-2.5 font-semibold text-[var(--p-accent-strong)] transition-all hover:-translate-y-0.5 hover:bg-[var(--p-accent)]/20"
            >
              Request Quote
              <UIcon name="i-lucide-arrow-right" class="h-4 w-4" />
            </NuxtLink>
          </template>
        </QuotesQuoteOutputPanel>
      </div>
    </div>
  </div>
</template>
