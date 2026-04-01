<template>
  <QuotesQuoteConfigModal
    :open="open"
    eyebrow="Draft Item"
    :title="`Update ${item?.product_name ?? 'item'}`"
    description="Adjust the saved configuration and refresh the quote preview."
    size="lg"
    @update:open="emit('update:open', $event)"
  >
    <div class="space-y-4 sm:space-y-5">
      <QuotesQuoteConfigSection v-if="loading" title="Loading" description="Preparing product options for this draft item.">
        <div class="flex flex-col items-center justify-center py-12 text-[var(--p-text-muted)]">
          <UIcon name="i-lucide-loader-2" class="mb-3 h-8 w-8 animate-spin" />
          <p class="text-sm">Loading options…</p>
        </div>
      </QuotesQuoteConfigSection>

      <QuotesQuoteConfigSection v-else-if="loadError" title="Unavailable" description="The quote options could not be loaded right now.">
        <QuotesQuoteConfigNotice tone="error" title="Could not load options" :message="loadError">
          <div class="flex flex-wrap gap-2">
            <UButton variant="soft" color="error" size="sm" @click="loadOptions">Retry</UButton>
          </div>
        </QuotesQuoteConfigNotice>
      </QuotesQuoteConfigSection>

      <form v-else class="space-y-4 sm:space-y-5" @submit.prevent="onSubmit">
        <QuotesQuoteConfigSection title="Specifications" description="Update the configuration stored on this draft item.">
          <div class="space-y-5">
            <div>
              <label class="mb-1.5 block text-sm font-medium text-[var(--p-text-dim)]">Quantity</label>
              <div class="flex items-center gap-2">
                <UButton variant="soft" color="neutral" size="sm" icon="i-lucide-minus" @click="form.quantity = Math.max(minQty, form.quantity - 50)" />
                <input
                  v-model.number="form.quantity"
                  type="number"
                  :min="minQty"
                  class="w-24 rounded-lg border border-[var(--p-border)] bg-[var(--p-surface)] px-3 py-2 text-center text-sm font-medium text-[var(--p-text)] focus:outline-none focus:ring-2 focus:ring-flamingo-400"
                  @blur="form.quantity = Math.max(minQty, form.quantity || minQty)"
                >
                <UButton variant="soft" color="neutral" size="sm" icon="i-lucide-plus" @click="form.quantity += 50" />
                <span class="text-xs text-[var(--p-text-muted)]">min {{ minQty }}</span>
              </div>
            </div>

            <div v-if="pricingMode === 'SHEET'" class="grid gap-5 lg:grid-cols-2">
              <div>
                <label class="mb-1.5 block text-sm font-medium text-[var(--p-text-dim)]">Sides</label>
                <div class="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    class="rounded-lg border px-3 py-2 text-sm font-medium transition-all"
                  :class="form.sides === 'SIMPLEX' ? 'border-flamingo-400 bg-flamingo-50 text-flamingo-700 dark:bg-flamingo-900/20' : 'border-[var(--p-border)] text-[var(--p-text-dim)]'"
                  @click="form.sides = 'SIMPLEX'"
                >
                    One side
                  </button>
                  <button
                    type="button"
                    class="rounded-lg border px-3 py-2 text-sm font-medium transition-all"
                  :class="form.sides === 'DUPLEX' ? 'border-flamingo-400 bg-flamingo-50 text-flamingo-700 dark:bg-flamingo-900/20' : 'border-[var(--p-border)] text-[var(--p-text-dim)]'"
                  @click="form.sides = 'DUPLEX'"
                >
                    Both sides
                  </button>
                </div>
              </div>

              <div>
                <label class="mb-1.5 block text-sm font-medium text-[var(--p-text-dim)]">Color</label>
                <div class="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    class="rounded-lg border px-3 py-2 text-sm font-medium transition-all"
                    :class="form.color_mode === 'COLOR' ? 'border-flamingo-400 bg-flamingo-50 text-flamingo-700 dark:bg-flamingo-900/20' : 'border-[var(--p-border)] text-[var(--p-text-dim)]'"
                    @click="form.color_mode = 'COLOR'"
                  >
                    Color
                  </button>
                  <button
                    type="button"
                    class="rounded-lg border px-3 py-2 text-sm font-medium transition-all"
                    :class="form.color_mode === 'BW' ? 'border-flamingo-400 bg-flamingo-50 text-flamingo-700 dark:bg-flamingo-900/20' : 'border-[var(--p-border)] text-[var(--p-text-dim)]'"
                    @click="form.color_mode = 'BW'"
                  >
                    B&W
                  </button>
                </div>
              </div>
            </div>

            <div v-if="pricingMode === 'SHEET' && machines.length">
              <label class="mb-1.5 block text-sm font-medium text-[var(--p-text-dim)]">Printing machine</label>
              <div class="space-y-1.5 rounded-xl border border-[var(--p-border)] bg-[var(--p-surface)] p-2">
                <label
                  v-for="m in machines"
                  :key="m.id"
                  class="flex items-center gap-3 rounded-lg px-3 py-2 transition-colors"
                  :class="form.machine === m.id ? 'bg-flamingo-50 dark:bg-flamingo-900/20' : 'hover:bg-[var(--p-surface-sunken)]'"
                >
                  <input v-model="form.machine" type="radio" :value="m.id" class="accent-flamingo-500">
                  <span class="text-sm text-[var(--p-text)]">{{ m.name }}</span>
                </label>
              </div>
            </div>

            <div v-if="pricingMode === 'SHEET' && papers.length">
              <label class="mb-1.5 block text-sm font-medium text-[var(--p-text-dim)]">Paper</label>
              <div class="space-y-1.5 rounded-xl border border-[var(--p-border)] bg-[var(--p-surface)] p-2">
                <label
                  v-for="p in papers"
                  :key="p.id"
                  class="flex items-center gap-3 rounded-lg px-3 py-2 transition-colors"
                  :class="form.paper === p.id ? 'bg-flamingo-50 dark:bg-flamingo-900/20' : 'hover:bg-[var(--p-surface-sunken)]'"
                >
                  <input v-model="form.paper" type="radio" :value="p.id" class="accent-flamingo-500">
                  <span class="text-sm text-[var(--p-text)]">{{ p.sheet_size }} {{ p.gsm }}gsm {{ p.paper_type }}</span>
                </label>
              </div>
            </div>

            <div v-if="pricingMode === 'LARGE_FORMAT' && materials.length">
              <label class="mb-1.5 block text-sm font-medium text-[var(--p-text-dim)]">Material</label>
              <div class="space-y-1.5 rounded-xl border border-[var(--p-border)] bg-[var(--p-surface)] p-2">
                <label
                  v-for="m in materials"
                  :key="m.id"
                  class="flex items-center gap-3 rounded-lg px-3 py-2 transition-colors"
                  :class="form.material === m.id ? 'bg-flamingo-50 dark:bg-flamingo-900/20' : 'hover:bg-[var(--p-surface-sunken)]'"
                >
                  <input v-model="form.material" type="radio" :value="m.id" class="accent-flamingo-500">
                  <span class="text-sm text-[var(--p-text)]">{{ m.material_type ?? m.name }}</span>
                </label>
              </div>
            </div>
          </div>
        </QuotesQuoteConfigSection>

        <QuotesQuoteConfigSection v-if="finishingRates.length" title="Finishing" description="Finishing services attached to this quote item.">
          <div class="space-y-2">
            <div
              v-for="fr in finishingRates"
              :key="fr.id"
              class="rounded-xl border border-[var(--p-border)] bg-[var(--p-surface)] p-3"
            >
              <label class="flex cursor-pointer items-center gap-3">
                <UCheckbox
                  :model-value="form.finishings.some(f => f.finishing_rate === fr.id)"
                  @update:model-value="toggleFinishing(fr.id, $event)"
                />
                <span class="flex-1 text-sm text-[var(--p-text)]">{{ fr.name }}</span>
              </label>
              <div
                v-if="isLaminationFinishing(fr) && form.finishings.some(f => f.finishing_rate === fr.id)"
                class="mt-3 ml-6 flex flex-wrap gap-2"
              >
                <button
                  type="button"
                  :class="['rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-colors', getFinishingApplyToSides(fr.id) === 'SINGLE' ? 'border-flamingo-400 bg-flamingo-50 text-flamingo-700 dark:bg-flamingo-900/20' : 'border-[var(--p-border)] text-[var(--p-text-dim)]']"
                  @click="setFinishingApplyToSides(fr.id, 'SINGLE')"
                >
                  One side
                </button>
                <button
                  type="button"
                  :class="['rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-colors', getFinishingApplyToSides(fr.id) === 'DOUBLE' ? 'border-flamingo-400 bg-flamingo-50 text-flamingo-700 dark:bg-flamingo-900/20' : 'border-[var(--p-border)] text-[var(--p-text-dim)]']"
                  @click="setFinishingApplyToSides(fr.id, 'DOUBLE')"
                >
                  Both sides
                </button>
              </div>
            </div>
          </div>
        </QuotesQuoteConfigSection>

        <QuotesQuoteConfigNotice
          v-if="needsMachineWarning"
          tone="error"
          title="Machine not chosen"
          message="Please select a printing machine before updating this draft item."
        />

        <QuotesQuoteConfigSection title="Notes" description="Internal notes that remain attached to this draft item.">
          <UTextarea v-model="form.special_instructions" placeholder="Optional notes" :rows="3" />
        </QuotesQuoteConfigSection>

        <QuotesQuoteConfigSection title="Pricing" description="Live preview of the updated configuration.">
          <div
            v-if="hasAllRequiredOptions && (backendPriceResult?.can_calculate || backendPriceLoading)"
            class="rounded-xl border border-flamingo-200/70 bg-flamingo-50/70 p-4 dark:border-flamingo-800/40 dark:bg-flamingo-900/10"
          >
            <div
              v-if="productionDetails.piecesPerSheet || productionDetails.sheetsNeeded"
              class="mb-4 grid gap-3 sm:grid-cols-2"
            >
              <div class="rounded-xl border border-flamingo-200 bg-[var(--p-surface)] p-3">
                <p class="text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-[var(--p-text-muted)]">Pcs per sheet</p>
                <p class="mt-2 text-lg font-extrabold text-[var(--p-text)]">{{ productionDetails.piecesPerSheet }}</p>
              </div>
              <div class="rounded-xl border border-flamingo-200 bg-[var(--p-surface)] p-3">
                <p class="text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-[var(--p-text-muted)]">Sheets needed</p>
                <p class="mt-2 text-lg font-extrabold text-flamingo-600">{{ productionDetails.sheetsNeeded }}</p>
              </div>
            </div>
            <div class="flex items-baseline justify-between gap-4">
              <span class="font-semibold text-[var(--p-text)]">Estimated total</span>
              <span class="flex items-center gap-2 text-lg font-bold text-flamingo-600 dark:text-flamingo-400">
                <UIcon v-if="backendPriceLoading" name="i-lucide-loader-2" class="h-4 w-4 animate-spin" />
                {{ backendPriceResult?.can_calculate ? formatMoney(backendPriceResult.total ?? 0) : '—' }}
              </span>
            </div>
            <div v-if="backendPriceResult?.per_unit && form.quantity > 0" class="mt-1 text-sm text-[var(--p-text-muted)]">
              {{ formatMoney(backendPriceResult.per_unit) }} per item
            </div>
          </div>
          <p v-else class="text-sm text-[var(--p-text-muted)]">Select all required options to refresh the live total.</p>
        </QuotesQuoteConfigSection>
      </form>
    </div>

    <template #footer>
      <div class="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <UButton variant="soft" color="neutral" class="sm:min-w-32" @click="emit('update:open', false)">
          Cancel
        </UButton>
        <UButton
          color="primary"
          class="sm:min-w-40"
          :loading="submitting"
          :disabled="loading || !!loadError || needsMachineWarning"
          @click="onSubmit"
        >
          <UIcon name="i-lucide-check" class="mr-1 h-4 w-4" />
          Update Item
        </UButton>
      </div>
    </template>
  </QuotesQuoteConfigModal>
</template>

<script setup lang="ts">
import type { QuoteItem } from '~/shared/types'
import type { QuoteItemFinishingPayload } from '~/services/quoteDraft'
import { calculateGalleryProductPrice } from '~/shared/api/gallery'
import { API } from '~/shared/api-paths'
import { useDebounceFn } from '@vueuse/core'
import { useApi, usePublicApiNoAuth } from '~/shared/api'
import { updateTweakedItem } from '~/services/quoteDraft'
import { extractProductionDetails } from '~/utils/productionDetails'

const props = defineProps<{
  open: boolean
  item: QuoteItem | null
  shopSlug?: string
}>()

const emit = defineEmits<{ 'update:open': [v: boolean]; updated: [] }>()

const toast = useToast()
const api = useApi()
const publicApiNoAuth = usePublicApiNoAuth()
const minQty = 100
const loading = ref(false)
const loadError = ref('')
const submitting = ref(false)

const papers = ref<Array<{ id: number; sheet_size: string; gsm: number; paper_type: string; selling_price: string; unit?: string }>>([])
const materials = ref<Array<{ id: number; material_type?: string; name?: string; unit: string; selling_price: string }>>([])
const finishingRates = ref<Array<{ id: number; name: string; price: string; charge_unit?: string; billing_basis?: string; side_mode?: string; display_unit_label?: string }>>([])
const machines = ref<Array<{ id: number; name: string; machine_type?: string }>>([])
const pricingMode = ref<'SHEET' | 'LARGE_FORMAT'>('SHEET')

const form = reactive({
  quantity: minQty,
  sides: 'SIMPLEX' as 'SIMPLEX' | 'DUPLEX',
  color_mode: 'COLOR' as 'BW' | 'COLOR',
  paper: null as number | null,
  material: null as number | null,
  machine: null as number | null,
  finishings: [] as QuoteItemFinishingPayload[],
  special_instructions: '',
})

const needsMachineWarning = computed(() =>
  pricingMode.value === 'SHEET' && machines.value.length > 0 && !form.machine
)

const hasAllRequiredOptions = computed(() => {
  if (pricingMode.value === 'SHEET' && papers.value.length > 0 && !form.paper) return false
  if (pricingMode.value === 'SHEET' && machines.value.length > 0 && !form.machine) return false
  if (pricingMode.value === 'LARGE_FORMAT' && materials.value.length > 0 && !form.material) return false
  return true
})

const backendPriceResult = ref<{ total?: number; per_unit?: number; can_calculate?: boolean; currency?: string | null } | null>(null)
const backendPriceLoading = ref(false)
const { formatMoney } = useCurrencyFormatter(computed(() => backendPriceResult.value?.currency ?? null))
const productionDetails = computed(() => extractProductionDetails(backendPriceResult.value))

async function fetchBackendPrice() {
  const slug = props.item?.product_slug
  if (!slug || !props.shopSlug || !hasAllRequiredOptions.value) {
    backendPriceResult.value = null
    return
  }
  backendPriceLoading.value = true
  backendPriceResult.value = null
  try {
    const result = await calculateGalleryProductPrice(props.shopSlug, slug, {
      quantity: form.quantity,
      paper_id: form.paper ?? undefined,
      material_id: form.material ?? undefined,
      machine_id: form.machine ?? undefined,
      sides: form.sides,
      color_mode: form.color_mode,
      finishings: form.finishings.length ? form.finishings : undefined,
    }, api)
    backendPriceResult.value = result
  } catch {
    backendPriceResult.value = null
  } finally {
    backendPriceLoading.value = false
  }
}

const fetchPriceDebounced = useDebounceFn(fetchBackendPrice, 300)

function toggleFinishing(id: number, checked: boolean) {
  const fr = finishingRates.value.find(r => r.id === id)
  const defaultApply = fr && isLaminationFinishing(fr) ? 'BOTH' : undefined
  if (checked) {
    form.finishings.push({ finishing_rate: id, ...(defaultApply ? { apply_to_sides: defaultApply } : {}) })
  } else {
    form.finishings = form.finishings.filter(f => f.finishing_rate !== id)
  }
}

function isLaminationFinishing(finishing: { charge_unit?: string; billing_basis?: string; side_mode?: string; name?: string }) {
  return (finishing.billing_basis === 'per_sheet' && finishing.side_mode === 'per_selected_side')
    || finishing.charge_unit === 'PER_SIDE_PER_SHEET'
    || String(finishing.name ?? '').toLowerCase().includes('lamination')
}

function getFinishingApplyToSides(finishingRateId: number): 'SINGLE' | 'DOUBLE' {
  const f = form.finishings.find(x => x.finishing_rate === finishingRateId)
  const v = f?.apply_to_sides ?? 'BOTH'
  if (v === 'BOTH') return form.sides === 'DUPLEX' ? 'DOUBLE' : 'SINGLE'
  return v as 'SINGLE' | 'DOUBLE'
}

function setFinishingApplyToSides(finishingRateId: number, apply: 'SINGLE' | 'DOUBLE') {
  const f = form.finishings.find(x => x.finishing_rate === finishingRateId)
  if (f) f.apply_to_sides = apply
}

async function loadOptions() {
  const productId = props.item?.product
  if (!productId) return
  loading.value = true
  loadError.value = ''
  try {
    const opts = await publicApiNoAuth<{
      available_papers?: Array<{ id: number; sheet_size: string; gsm: number; paper_type: string; selling_price: string }>
      available_materials?: Array<{ id: number; material_type?: string; unit: string; selling_price: string }>
      available_finishings?: Array<{ id: number; name: string; price: string; charge_unit?: string; billing_basis?: string; side_mode?: string; display_unit_label?: string }>
      available_machines?: Array<{ id: number; name: string; machine_type?: string }>
      pricing_mode?: string
    }>(API.publicProductOptions(productId))
    papers.value = opts.available_papers ?? []
    materials.value = opts.available_materials ?? []
    finishingRates.value = opts.available_finishings ?? []
    machines.value = opts.available_machines ?? []
    pricingMode.value = (opts.pricing_mode as 'SHEET' | 'LARGE_FORMAT') ?? 'SHEET'
    nextTick(() => {
      if (hasAllRequiredOptions.value) fetchPriceDebounced()
    })
  } catch {
    loadError.value = 'Could not load options.'
  } finally {
    loading.value = false
  }
}

function resetForm() {
  const i = props.item
  if (!i) return
  form.quantity = Math.max(minQty, i.quantity)
  form.sides = (i.sides as 'SIMPLEX' | 'DUPLEX') || 'SIMPLEX'
  form.color_mode = (i.color_mode as 'BW' | 'COLOR') || 'COLOR'
  form.paper = i.paper ?? null
  form.material = i.material ?? null
  form.machine = (i as { machine?: number }).machine ?? null
  form.special_instructions = ''
  form.finishings = (i.finishings ?? []).map((f) => {
    const obj = typeof f === 'object' && f && 'finishing_rate' in f ? f as { finishing_rate: number; apply_to_sides?: string } : { finishing_rate: Number(f) }
    return { finishing_rate: obj.finishing_rate, apply_to_sides: obj.apply_to_sides }
  })
}

watch(() => [props.open, props.item], ([open, it]) => {
  if (open && it) {
    resetForm()
    void loadOptions()
    nextTick(() => {
      if (hasAllRequiredOptions.value) fetchPriceDebounced()
    })
  } else {
    backendPriceResult.value = null
  }
}, { immediate: true })

watch(
  () => [form.quantity, form.paper, form.material, form.machine, form.sides, form.color_mode, form.finishings],
  () => {
    if (props.open && hasAllRequiredOptions.value) {
      fetchPriceDebounced()
    } else {
      backendPriceResult.value = null
    }
  },
  { deep: true }
)

async function onSubmit() {
  if (!props.item || loading.value || loadError.value || needsMachineWarning.value) return
  submitting.value = true
  try {
    await updateTweakedItem(props.item.id, {
      quantity: form.quantity,
      sides: form.sides,
      color_mode: form.color_mode,
      paper: form.paper ?? undefined,
      material: form.material ?? undefined,
      machine: form.machine ?? undefined,
      finishings: form.finishings.length ? form.finishings : undefined,
      special_instructions: form.special_instructions.trim() || undefined,
    }, api)
    emit('updated')
    emit('update:open', false)
  } catch (err) {
    toast.add({ title: 'Update failed', description: err instanceof Error ? err.message : 'Please try again.', color: 'error' })
  } finally {
    submitting.value = false
  }
}
</script>
