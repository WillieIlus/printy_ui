<template>
  <QuotesQuoteConfigModal
    :open="isOpen"
    eyebrow="Quote Configuration"
    :title="`Configure ${product.name}`"
    description="Customize quantity, production options, and finishing before adding this item to your draft."
    size="lg"
    @update:open="isOpen = $event"
  >
    <div class="space-y-4 sm:space-y-5">
      <QuotesQuoteConfigNotice
        v-if="successMessage"
        tone="success"
        title="Added to draft"
        :message="successMessage"
      />

      <QuotesQuoteConfigSection title="Product" description="Base product details from this shop.">
        <div class="flex items-center gap-4 rounded-xl bg-[var(--p-surface)] p-4">
          <div v-if="imageUrl" class="h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-[var(--p-border)]">
            <img :src="imageUrl" :alt="product.name" class="h-full w-full object-cover">
          </div>
          <div v-else class="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-[var(--p-border)]">
            <UIcon name="i-lucide-package" class="h-8 w-8 text-[var(--p-text-muted)]" />
          </div>
          <div class="min-w-0 flex-1">
            <p class="truncate text-base font-semibold text-[var(--p-text)]">{{ product.name }}</p>
            <p v-if="product.category" class="mt-1 text-xs text-[var(--p-text-muted)]">{{ product.category }}</p>
            <div class="mt-2 flex flex-wrap gap-1.5">
              <UBadge v-if="product.final_size" variant="soft" color="neutral" size="xs">{{ product.final_size }}</UBadge>
              <UBadge v-if="product.imposition_summary" variant="soft" color="neutral" size="xs">{{ product.imposition_summary }}</UBadge>
              <UBadge variant="soft" color="primary" size="xs">{{ product.pricing_mode === 'LARGE_FORMAT' ? 'Large Format' : 'Sheet' }}</UBadge>
            </div>
          </div>
        </div>
      </QuotesQuoteConfigSection>

      <QuotesQuoteConfigSection v-if="loading" title="Loading" description="Preparing available options for this product.">
        <div class="flex flex-col items-center justify-center py-12 text-[var(--p-text-muted)]">
          <UIcon name="i-lucide-loader-2" class="mb-3 h-8 w-8 animate-spin" />
          <p class="text-sm">Loading options…</p>
        </div>
      </QuotesQuoteConfigSection>

      <QuotesQuoteConfigSection v-else-if="loadError" title="Unavailable" description="The quote options could not be loaded right now.">
        <QuotesQuoteConfigNotice tone="error" title="Could not open quote options" :message="loadError">
          <div class="flex flex-wrap gap-2">
            <UButton variant="soft" color="error" size="sm" @click="loadShopData">Retry</UButton>
            <UButton variant="ghost" size="sm" @click="isOpen = false">Close</UButton>
          </div>
        </QuotesQuoteConfigNotice>
      </QuotesQuoteConfigSection>

      <form v-else class="space-y-4 sm:space-y-5" @submit.prevent="onSubmit">
        <QuotesQuoteConfigSection title="Specifications" description="Set the core print configuration used for pricing.">
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

            <div v-if="product.pricing_mode === 'SHEET'" class="grid gap-5 lg:grid-cols-2">
              <div>
                <label class="mb-1.5 block text-sm font-medium text-[var(--p-text-dim)]">Sides</label>
                <div class="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    class="rounded-lg border px-3 py-2 text-sm font-medium transition-all"
                    :class="form.sides === 'SIMPLEX'
                      ? 'border-flamingo-400 bg-flamingo-50 text-flamingo-700 dark:bg-flamingo-900/20 dark:text-flamingo-300'
                      : 'border-[var(--p-border)] text-[var(--p-text-dim)] hover:border-[var(--p-border-dim)]'"
                    @click="form.sides = 'SIMPLEX'"
                  >
                    Single-sided
                  </button>
                  <button
                    type="button"
                    class="rounded-lg border px-3 py-2 text-sm font-medium transition-all"
                    :class="form.sides === 'DUPLEX'
                      ? 'border-flamingo-400 bg-flamingo-50 text-flamingo-700 dark:bg-flamingo-900/20 dark:text-flamingo-300'
                      : 'border-[var(--p-border)] text-[var(--p-text-dim)] hover:border-[var(--p-border-dim)]'"
                    @click="form.sides = 'DUPLEX'"
                  >
                    Double-sided
                  </button>
                </div>
              </div>

              <div>
                <label class="mb-1.5 block text-sm font-medium text-[var(--p-text-dim)]">Color</label>
                <div class="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    class="rounded-lg border px-3 py-2 text-sm font-medium transition-all"
                    :class="form.color_mode === 'COLOR'
                      ? 'border-flamingo-400 bg-flamingo-50 text-flamingo-700 dark:bg-flamingo-900/20 dark:text-flamingo-300'
                      : 'border-[var(--p-border)] text-[var(--p-text-dim)] hover:border-[var(--p-border-dim)]'"
                    @click="form.color_mode = 'COLOR'"
                  >
                    <UIcon name="i-lucide-palette" class="mr-1 inline h-4 w-4" />
                    Color
                  </button>
                  <button
                    type="button"
                    class="rounded-lg border px-3 py-2 text-sm font-medium transition-all"
                    :class="form.color_mode === 'BW'
                      ? 'border-flamingo-400 bg-flamingo-50 text-flamingo-700 dark:bg-flamingo-900/20 dark:text-flamingo-300'
                      : 'border-[var(--p-border)] text-[var(--p-text-dim)] hover:border-[var(--p-border-dim)]'"
                    @click="form.color_mode = 'BW'"
                  >
                    B&W
                  </button>
                </div>
              </div>
            </div>

            <div v-if="product.pricing_mode === 'SHEET' && machines.length">
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

            <div v-if="product.pricing_mode === 'SHEET' && papers.length">
              <label class="mb-1.5 block text-sm font-medium text-[var(--p-text-dim)]">Paper type / grammage</label>
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

            <div v-if="product.pricing_mode === 'LARGE_FORMAT' && materials.length">
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

        <QuotesQuoteConfigSection v-if="finishingRates.length" title="Finishing" description="Optional finishing services that affect the final quote.">
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
                v-if="fr.charge_unit === 'PER_SIDE_PER_SHEET' && form.finishings.some(f => f.finishing_rate === fr.id)"
                class="mt-3 ml-6 flex flex-wrap gap-2"
              >
                <button
                  type="button"
                  :class="['rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-colors', getFinishingApplyToSides(fr.id) === 'SINGLE' ? 'border-flamingo-400 bg-flamingo-50 text-flamingo-700 dark:bg-flamingo-900/20' : 'border-[var(--p-border)] text-[var(--p-text-dim)] hover:border-[var(--p-border-dim)]']"
                  @click="setFinishingApplyToSides(fr.id, 'SINGLE')"
                >
                  Single-sided
                </button>
                <button
                  type="button"
                  :class="['rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-colors', getFinishingApplyToSides(fr.id) === 'DOUBLE' ? 'border-flamingo-400 bg-flamingo-50 text-flamingo-700 dark:bg-flamingo-900/20' : 'border-[var(--p-border)] text-[var(--p-text-dim)] hover:border-[var(--p-border-dim)]']"
                  @click="setFinishingApplyToSides(fr.id, 'DOUBLE')"
                >
                  Double-sided
                </button>
              </div>
            </div>
          </div>
        </QuotesQuoteConfigSection>

        <QuotesQuoteConfigNotice
          v-if="needsMachineWarning"
          tone="error"
          title="Machine not chosen"
          message="Please select a printing machine to get an accurate quote for this configuration."
        />

        <QuotesQuoteConfigNotice
          v-else-if="needsPaperOrFinishing"
          tone="warning"
          title="Complete the quote"
          message="Adding the missing production details will make the preview more accurate."
        >
          <ul class="list-disc space-y-1 pl-5 text-sm">
            <li v-if="product.pricing_mode === 'SHEET' && papers.length && !form.paper">Select paper for accurate pricing.</li>
            <li v-if="product.pricing_mode === 'LARGE_FORMAT' && materials.length && !form.material">Select material for accurate pricing.</li>
            <li v-if="finishingRates.length && !form.finishings.length">Consider adding finishing if the job requires it.</li>
          </ul>
        </QuotesQuoteConfigNotice>

        <QuotesQuoteConfigSection title="Notes" description="Anything the shop should keep in mind for this item.">
          <UTextarea
            v-model="form.special_instructions"
            placeholder="Any notes for the shop (optional)"
            :rows="3"
          />
        </QuotesQuoteConfigSection>

        <QuotesQuoteConfigSection title="Pricing" description="Live preview based on the current configuration.">
          <div class="space-y-3">
            <div class="grid gap-2 text-sm text-[var(--p-text-muted)]">
              <div class="flex justify-between gap-4">
                <span>Product</span>
                <span class="font-medium text-[var(--p-text)]">{{ product.name }}</span>
              </div>
              <div class="flex justify-between gap-4">
                <span>Quantity</span>
                <span class="font-medium text-[var(--p-text)]">{{ form.quantity }} pcs</span>
              </div>
              <div v-if="product.pricing_mode === 'SHEET'" class="flex justify-between gap-4">
                <span>Sides</span>
                <span class="font-medium text-[var(--p-text)]">{{ form.sides === 'DUPLEX' ? 'Double-sided' : 'Single-sided' }}</span>
              </div>
              <div v-if="product.pricing_mode === 'SHEET'" class="flex justify-between gap-4">
                <span>Color</span>
                <span class="font-medium text-[var(--p-text)]">{{ form.color_mode === 'COLOR' ? 'Full Color' : 'Black & White' }}</span>
              </div>
              <div v-if="selectedPaperLabel" class="flex justify-between gap-4">
                <span>Paper</span>
                <span class="font-medium text-[var(--p-text)]">{{ selectedPaperLabel }}</span>
              </div>
              <div v-if="selectedMaterialLabel" class="flex justify-between gap-4">
                <span>Material</span>
                <span class="font-medium text-[var(--p-text)]">{{ selectedMaterialLabel }}</span>
              </div>
              <div v-if="selectedFinishingLabels.length" class="flex justify-between gap-4">
                <span>Finishing</span>
                <span class="font-medium text-[var(--p-text)]">{{ selectedFinishingLabels.join(', ') }}</span>
              </div>
            </div>

            <div v-if="product.price_hint?.can_calculate || product.price_range_est?.can_calculate" class="rounded-xl border border-flamingo-200/70 bg-flamingo-50/70 p-4 dark:border-flamingo-800/40 dark:bg-flamingo-900/10">
              <div v-if="tweakPriceSummary" class="flex items-baseline justify-between gap-4">
                <span class="font-semibold text-[var(--p-text)]">Estimated total</span>
                <span class="flex items-center gap-2 text-lg font-bold text-flamingo-600 dark:text-flamingo-400">
                  <UIcon v-if="backendPriceLoading" name="i-lucide-loader-2" class="h-4 w-4 animate-spin" />
                  {{ tweakPriceSummary.totalLine }}
                </span>
              </div>
              <div v-if="tweakPriceSummary?.perUnitLine" class="mt-1 flex justify-between gap-4 text-sm text-[var(--p-text-muted)]">
                <span>Per item</span>
                <span>{{ tweakPriceSummary.perUnitLine }}</span>
              </div>
              <div v-else-if="product.price_hint?.price_display" class="flex items-baseline justify-between gap-4">
                <span class="font-semibold text-[var(--p-text)]">Estimated price</span>
                <span class="text-lg font-bold text-flamingo-600 dark:text-flamingo-400">
                  {{ product.price_hint.price_display }}
                </span>
              </div>
            </div>

            <p class="text-xs text-[var(--p-text-muted)]">Final price is computed by the shop after submission.</p>
          </div>
        </QuotesQuoteConfigSection>
      </form>
    </div>

    <template #footer>
      <div class="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <UButton variant="soft" color="neutral" class="sm:min-w-32" @click="isOpen = false">
          Cancel
        </UButton>
        <UButton
          color="primary"
          class="sm:min-w-40"
          :loading="submitting"
          :disabled="loading || !!loadError || needsMachineWarning"
          @click="onSubmit"
        >
          <UIcon name="i-lucide-plus" class="mr-1 h-4 w-4" />
          Add to Quote
        </UButton>
      </div>
    </template>
  </QuotesQuoteConfigModal>
</template>

<script setup lang="ts">
import type { Product, Paper, FinishingRate } from '~/shared/types'
import type { GalleryCalculatePriceResponse } from '~/shared/types/gallery'
import type { QuoteItemFinishingPayload } from '~/services/quoteDraft'
import { useDebounceFn } from '@vueuse/core'
import { calculateGalleryProductPrice } from '~/shared/api/gallery'
import { useApi, usePublicApiNoAuth } from '~/shared/api'
import { API } from '~/shared/api-paths'
import { useAuthStore } from '~/stores/auth'
import { formatKES } from '~/utils/formatters'
import { useMediaUrl } from '~/utils/media'

interface MaterialItem {
  id: number
  material_type?: string
  name?: string
  unit: string
  selling_price: string
  is_active: boolean
}

const props = defineProps<{
  product: Product
  shopSlug: string
  shopName?: string
}>()

const { priceDisplaySummary } = useProductPriceDisplay()
const toast = useToast()
const authStore = useAuthStore()
const guestStore = useGuestQuoteStore()
const quoteDraftStore = useQuoteDraftStore()
const shopApi = useApi()
const publicApiNoAuth = usePublicApiNoAuth()
const getMediaUrl = useMediaUrl()

const hasAllRequiredOptions = computed(() => {
  if (props.product.pricing_mode === 'SHEET' && papers.value.length > 0 && !form.paper) return false
  if (props.product.pricing_mode === 'SHEET' && machines.value.length > 0 && !form.machine) return false
  if (props.product.pricing_mode === 'LARGE_FORMAT' && materials.value.length > 0 && !form.material) return false
  return true
})

const needsMachineWarning = computed(() =>
  props.product.pricing_mode === 'SHEET' && machines.value.length > 0 && !form.machine
)

const backendPriceResult = ref<GalleryCalculatePriceResponse | null>(null)
const backendPriceLoading = ref(false)

const tweakPriceSummary = computed(() => {
  if (hasAllRequiredOptions.value && backendPriceResult.value?.can_calculate) {
    const total = backendPriceResult.value.total ?? backendPriceResult.value.breakdown?.total ?? 0
    const perUnit = backendPriceResult.value.per_unit ?? (total && form.quantity ? total / form.quantity : 0)
    return {
      totalLine: formatKES(total),
      perUnitLine: perUnit ? `${formatKES(perUnit)} per item` : '',
    }
  }
  return priceDisplaySummary(props.product)
})

const emit = defineEmits<{
  (e: 'added'): void
}>()

const isOpen = defineModel<boolean>({ default: false })
const submitting = ref(false)
const successMessage = ref('')
const loading = ref(false)
const loadError = ref('')
const papers = ref<Paper[]>([])
const materials = ref<MaterialItem[]>([])
const finishingRates = ref<FinishingRate[]>([])
const machines = ref<MachineOption[]>([])

const minQty = computed(() => props.product.min_quantity || 100)

const imageUrl = computed(() => {
  const path = props.product.primary_image
  if (!path) return null
  if (path.startsWith('http')) return path
  return getMediaUrl(path)
})

interface TweakForm {
  quantity: number
  sides: 'SIMPLEX' | 'DUPLEX'
  color_mode: 'BW' | 'COLOR'
  paper: number | null
  material: number | null
  machine: number | null
  finishings: QuoteItemFinishingPayload[]
  special_instructions: string
}

const form = reactive<TweakForm>({
  quantity: minQty.value,
  sides: (props.product.default_sides as 'SIMPLEX' | 'DUPLEX') || 'SIMPLEX',
  color_mode: 'COLOR',
  paper: null,
  material: null,
  machine: null,
  finishings: [],
  special_instructions: '',
})

const selectedPaperLabel = computed(() => {
  if (!form.paper) return null
  const p = papers.value.find(x => x.id === form.paper)
  return p ? `${p.sheet_size} ${p.gsm}gsm ${p.paper_type}` : null
})

const selectedMaterialLabel = computed(() => {
  if (!form.material) return null
  const m = materials.value.find(x => x.id === form.material)
  return m ? (m.material_type ?? m.name ?? '') : null
})

const selectedFinishingLabels = computed(() => {
  return form.finishings
    .map(f => finishingRates.value.find(r => r.id === f.finishing_rate)?.name)
    .filter(Boolean) as string[]
})

const needsPaperOrFinishing = computed(() => {
  if (props.product.pricing_mode === 'SHEET' && papers.value.length && !form.paper) return true
  if (props.product.pricing_mode === 'LARGE_FORMAT' && materials.value.length && !form.material) return true
  if (finishingRates.value.length && !form.finishings.length) return true
  return false
})

function toggleFinishing(id: number, checked: boolean) {
  const fr = finishingRates.value.find(r => r.id === id)
  const defaultApply = fr?.charge_unit === 'PER_SIDE_PER_SHEET' ? 'BOTH' : undefined
  if (checked) {
    form.finishings.push({ finishing_rate: id, ...(defaultApply ? { apply_to_sides: defaultApply } : {}) })
  } else {
    form.finishings = form.finishings.filter(f => f.finishing_rate !== id)
  }
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

function resetForm() {
  form.quantity = minQty.value
  form.sides = (props.product.default_sides as 'SIMPLEX' | 'DUPLEX') || 'SIMPLEX'
  form.color_mode = 'COLOR'
  form.paper = null
  form.material = null
  form.machine = null
  form.special_instructions = ''

  const defaultFinishings = (props.product.finishing_options ?? [])
    .filter(o => o.is_default)
    .map(o => ({ finishing_rate: o.finishing_rate, apply_to_sides: 'BOTH' as const }))
  form.finishings = defaultFinishings
  successMessage.value = ''
}

interface MachineOption {
  id: number
  name: string
  machine_type?: string
}

interface PublicProductOptions {
  available_papers?: Array<{ id: number; sheet_size: string; gsm: number; paper_type: string; selling_price: string }>
  available_materials?: Array<{ id: number; material_type?: string; unit: string; selling_price: string }>
  available_finishings?: Array<{ id: number; name: string; price: string; charge_unit?: string }>
  available_machines?: MachineOption[]
  default_machine_id?: number | null
}

async function loadShopData() {
  const slug = props.shopSlug
  const productId = props.product?.id
  if (!slug && !productId) {
    loadError.value = 'No shop or product selected.'
    return
  }

  loading.value = true
  loadError.value = ''

  if (productId) {
    try {
      const opts = await publicApiNoAuth<PublicProductOptions>(API.publicProductOptions(productId))
      papers.value = (opts.available_papers ?? []).map((p) => ({
        id: p.id,
        shop: 0,
        sheet_size: p.sheet_size,
        gsm: p.gsm,
        paper_type: p.paper_type,
        selling_price: p.selling_price,
        buying_price: '0',
        is_active: true,
      }))
      materials.value = (opts.available_materials ?? []).map((m) => ({
        id: m.id,
        material_type: m.material_type,
        name: m.material_type,
        unit: m.unit,
        selling_price: m.selling_price,
        is_active: true,
      }))
      finishingRates.value = (opts.available_finishings ?? []).map((f) => ({
        id: f.id,
        name: f.name,
        price: f.price,
        charge_unit: (f.charge_unit as FinishingRate['charge_unit']) ?? 'PER_PIECE',
        is_active: true,
      }))
      machines.value = opts.available_machines ?? []
      const defaultMachineId = opts.default_machine ?? opts.default_machine_id
      if (defaultMachineId && machines.value.some(m => m.id === defaultMachineId)) {
        form.machine = defaultMachineId
      } else if (machines.value.length === 1) {
        form.machine = machines.value[0].id
      }
    } catch (err: unknown) {
      const msg = err && typeof err === 'object' && 'data' in err
        ? (err as { data?: { message?: string } }).data?.message
        : err instanceof Error ? err.message : 'Unknown error loading product options.'
      loadError.value = msg || 'Could not load product options.'
    } finally {
      loading.value = false
      return
    }
  }

  if (!slug) {
    loadError.value = 'No shop selected.'
    loading.value = false
    return
  }

  try {
    const [papersData, finishData, materialsData, machinesData] = await Promise.all([
      shopApi<Paper[] | { results: Paper[] }>(API.shopPapers(slug)),
      shopApi<FinishingRate[] | { results: FinishingRate[] }>(API.shopFinishingRates(slug)),
      shopApi<MaterialItem[] | { results: MaterialItem[] }>(API.shopMaterials(slug)),
      shopApi<MachineOption[] | { results: MachineOption[] }>(API.shopMachines(slug)).catch(() => []),
    ])
    papers.value = extractArray(papersData)
    finishingRates.value = extractArray(finishData)
    materials.value = extractArray(materialsData)
    machines.value = extractArray(machinesData)
  } catch (err: unknown) {
    papers.value = []
    finishingRates.value = []
    materials.value = []
    const msg = err && typeof err === 'object' && 'data' in err
      ? (err as { data?: { message?: string } }).data?.message
      : err instanceof Error ? err.message : 'Could not load shop options.'
    loadError.value = msg || 'Could not load papers, materials, or finishing options.'
  } finally {
    loading.value = false
  }
}

function extractArray<T>(data: T[] | { results: T[] }): T[] {
  if (Array.isArray(data)) return data
  if (data && typeof data === 'object' && Array.isArray((data as { results?: T[] }).results)) {
    return (data as { results: T[] }).results
  }
  return []
}

async function onSubmit() {
  if (needsMachineWarning.value || loading.value || loadError.value) return

  if (!authStore.isAuthenticated) {
    guestStore.addItem(props.shopSlug, props.shopName ?? 'Shop', props.product.name, {
      product: props.product.id,
      quantity: Math.max(minQty.value, form.quantity),
      pricing_mode: props.product.pricing_mode,
      paper: form.paper ?? undefined,
      material: form.material ?? undefined,
      machine: form.machine ?? undefined,
      sides: form.sides,
      color_mode: form.color_mode,
      finishings: form.finishings.length ? form.finishings : undefined,
      special_instructions: form.special_instructions.trim() || undefined,
    })
    successMessage.value = `${props.product.name} added to your draft.`
    emit('added')
    setTimeout(() => { isOpen.value = false }, 1200)
    toast.add({ title: 'Added to draft', description: 'Sign in when you submit to get your quote request.', color: 'success' })
    return
  }

  submitting.value = true
  try {
    await quoteDraftStore.addTweakedProductToQuote(props.shopSlug, {
      product: props.product.id,
      quantity: Math.max(minQty.value, form.quantity),
      pricing_mode: props.product.pricing_mode,
      paper: form.paper ?? undefined,
      material: form.material ?? undefined,
      machine: form.machine ?? undefined,
      sides: form.sides,
      color_mode: form.color_mode,
      finishings: form.finishings.length ? form.finishings : undefined,
      special_instructions: form.special_instructions.trim() || undefined,
    })
    successMessage.value = `${props.product.name} added to your draft.`
    emit('added')
    setTimeout(() => { isOpen.value = false }, 1200)
  } catch (err) {
    toast.add({
      title: 'Could not add to draft',
      description: err instanceof Error ? err.message : 'Please sign in to add to your draft.',
      color: 'error',
    })
  } finally {
    submitting.value = false
  }
}

async function fetchBackendPrice() {
  const slug = props.product?.slug
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
      chosen_width_mm: props.product.default_finished_width_mm ?? undefined,
      chosen_height_mm: props.product.default_finished_height_mm ?? undefined,
      finishings: form.finishings.length ? form.finishings : undefined,
    }, shopApi)
    backendPriceResult.value = result
  } catch {
    backendPriceResult.value = null
  } finally {
    backendPriceLoading.value = false
  }
}

const fetchPriceDebounced = useDebounceFn(fetchBackendPrice, 300)

watch(
  () => [form.quantity, form.paper, form.material, form.machine, form.sides, form.color_mode, form.finishings],
  () => {
    if (isOpen.value && hasAllRequiredOptions.value) {
      fetchPriceDebounced()
    } else {
      backendPriceResult.value = null
    }
  },
  { deep: true }
)

watch(isOpen, (open) => {
  if (open) {
    resetForm()
    void loadShopData()
    nextTick(() => {
      if (hasAllRequiredOptions.value) fetchPriceDebounced()
    })
  } else {
    backendPriceResult.value = null
  }
}, { immediate: true })
</script>
