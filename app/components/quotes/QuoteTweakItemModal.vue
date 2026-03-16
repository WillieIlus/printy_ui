<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="open"
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
        role="dialog"
        aria-modal="true"
        @keydown.esc="emit('update:open', false)"
      >
        <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="emit('update:open', false)" />
        <div
          class="modal-panel relative w-full max-w-lg max-h-[90vh] overflow-y-auto bg-[var(--p-surface)] rounded-2xl shadow-2xl z-10"
          @click.stop
        >
          <div class="sticky top-0 z-10 bg-[var(--p-surface)]/95 backdrop-blur border-b border-[var(--p-border)] px-6 py-4 rounded-t-2xl">
            <div class="flex items-start justify-between gap-4">
              <div>
                <h2 class="text-lg font-bold text-[var(--p-text)]">Tweak — {{ item?.product_name ?? 'Item' }}</h2>
                <p class="text-sm text-[var(--p-text-muted)] mt-0.5">Update options and quantity.</p>
              </div>
              <button
                class="rounded-lg p-1.5 text-[var(--p-text-muted)] hover:text-[var(--p-text)] hover:bg-[var(--p-surface-sunken)] transition-colors"
                @click="emit('update:open', false)"
              >
                <UIcon name="i-lucide-x" class="h-5 w-5" />
              </button>
            </div>
          </div>
          <div class="p-6 space-y-6">
            <div v-if="loadError" class="rounded-lg border border-red-300 dark:border-red-800 bg-red-50 dark:bg-red-950/30 p-4 text-sm text-red-700 dark:text-red-300">
              {{ loadError }}
              <UButton variant="soft" color="error" size="sm" class="mt-2" @click="loadOptions">Retry</UButton>
            </div>
            <form v-else class="space-y-5" @submit.prevent="onSubmit">
              <div>
                <label class="block text-sm font-medium text-[var(--p-text-dim)] mb-1.5">Quantity</label>
                <div class="flex items-center gap-2">
                  <UButton variant="soft" color="neutral" size="sm" icon="i-lucide-minus" @click="form.quantity = Math.max(minQty, form.quantity - 50)" />
                  <input
                    v-model.number="form.quantity"
                    type="number"
                    :min="minQty"
                    class="w-24 text-center rounded-lg border border-[var(--p-border)] bg-[var(--p-surface)] px-3 py-2 text-sm font-medium text-[var(--p-text)] focus:outline-none focus:ring-2 focus:ring-flamingo-400"
                    @blur="form.quantity = Math.max(minQty, form.quantity || minQty)"
                  />
                  <UButton variant="soft" color="neutral" size="sm" icon="i-lucide-plus" @click="form.quantity += 50" />
                  <span class="text-xs text-[var(--p-text-muted)]">min {{ minQty }}</span>
                </div>
              </div>
              <div v-if="pricingMode === 'SHEET' && machines.length">
                <label class="block text-sm font-medium text-[var(--p-text-dim)] mb-1.5">Printing machine</label>
                <div class="space-y-1.5 max-h-36 overflow-y-auto rounded-lg border border-[var(--p-border)] p-2">
                  <label
                    v-for="m in machines"
                    :key="m.id"
                    class="flex items-center gap-3 rounded-lg px-3 py-2 cursor-pointer transition-colors"
                    :class="form.machine === m.id ? 'bg-flamingo-50 dark:bg-flamingo-900/20' : 'hover:bg-[var(--p-surface-sunken)]'"
                  >
                    <input v-model="form.machine" type="radio" :value="m.id" class="accent-flamingo-500" />
                    <span class="text-sm text-[var(--p-text)]">{{ m.name }}</span>
                  </label>
                </div>
              </div>
              <div v-if="pricingMode === 'SHEET' && papers.length">
                <label class="block text-sm font-medium text-[var(--p-text-dim)] mb-1.5">Paper</label>
                <div class="space-y-1.5 max-h-36 overflow-y-auto rounded-lg border border-[var(--p-border)] p-2">
                  <label
                    v-for="p in papers"
                    :key="p.id"
                    class="flex items-center gap-3 rounded-lg px-3 py-2 cursor-pointer transition-colors"
                    :class="form.paper === p.id ? 'bg-flamingo-50 dark:bg-flamingo-900/20' : 'hover:bg-[var(--p-surface-sunken)]'"
                  >
                    <input v-model="form.paper" type="radio" :value="p.id" class="accent-flamingo-500" />
                    <span class="text-sm text-[var(--p-text)]">{{ p.sheet_size }} {{ p.gsm }}gsm {{ p.paper_type }}</span>
                  </label>
                </div>
              </div>
              <div v-if="pricingMode === 'LARGE_FORMAT' && materials.length">
                <label class="block text-sm font-medium text-[var(--p-text-dim)] mb-1.5">Material</label>
                <div class="space-y-1.5 max-h-36 overflow-y-auto rounded-lg border border-[var(--p-border)] p-2">
                  <label
                    v-for="m in materials"
                    :key="m.id"
                    class="flex items-center gap-3 rounded-lg px-3 py-2 cursor-pointer transition-colors"
                    :class="form.material === m.id ? 'bg-flamingo-50 dark:bg-flamingo-900/20' : 'hover:bg-[var(--p-surface-sunken)]'"
                  >
                    <input v-model="form.material" type="radio" :value="m.id" class="accent-flamingo-500" />
                    <span class="text-sm text-[var(--p-text)]">{{ m.material_type ?? m.name }}</span>
                  </label>
                </div>
              </div>
              <div v-if="pricingMode === 'SHEET'">
                <label class="block text-sm font-medium text-[var(--p-text-dim)] mb-1.5">Sides</label>
                <div class="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    :class="['rounded-lg border px-3 py-2 text-sm font-medium', form.sides === 'SIMPLEX' ? 'border-flamingo-400 bg-flamingo-50 dark:bg-flamingo-900/20 text-flamingo-700' : 'border-[var(--p-border)] text-[var(--p-text-dim)]']"
                    @click="form.sides = 'SIMPLEX'"
                  >
                    Single-sided
                  </button>
                  <button
                    type="button"
                    :class="['rounded-lg border px-3 py-2 text-sm font-medium', form.sides === 'DUPLEX' ? 'border-flamingo-400 bg-flamingo-50 dark:bg-flamingo-900/20 text-flamingo-700' : 'border-[var(--p-border)] text-[var(--p-text-dim)]']"
                    @click="form.sides = 'DUPLEX'"
                  >
                    Double-sided
                  </button>
                </div>
              </div>
              <div v-if="pricingMode === 'SHEET'">
                <label class="block text-sm font-medium text-[var(--p-text-dim)] mb-1.5">Color</label>
                <div class="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    :class="['rounded-lg border px-3 py-2 text-sm font-medium', form.color_mode === 'COLOR' ? 'border-flamingo-400 bg-flamingo-50 dark:bg-flamingo-900/20 text-flamingo-700' : 'border-[var(--p-border)] text-[var(--p-text-dim)]']"
                    @click="form.color_mode = 'COLOR'"
                  >
                    Color
                  </button>
                  <button
                    type="button"
                    :class="['rounded-lg border px-3 py-2 text-sm font-medium', form.color_mode === 'BW' ? 'border-flamingo-400 bg-flamingo-50 dark:bg-flamingo-900/20 text-flamingo-700' : 'border-[var(--p-border)] text-[var(--p-text-dim)]']"
                    @click="form.color_mode = 'BW'"
                  >
                    B&W
                  </button>
                </div>
              </div>
              <div v-if="finishingRates.length">
                <label class="block text-sm font-medium text-[var(--p-text-dim)] mb-1.5">Finishing</label>
                <div class="space-y-2 max-h-48 overflow-y-auto rounded-lg border border-[var(--p-border)] p-2">
                  <div
                    v-for="fr in finishingRates"
                    :key="fr.id"
                    class="rounded-lg px-3 py-2 transition-colors hover:bg-[var(--p-surface-sunken)]"
                  >
                    <label class="flex items-center gap-3 cursor-pointer">
                      <UCheckbox
                        :model-value="form.finishings.some(f => f.finishing_rate === fr.id)"
                        @update:model-value="toggleFinishing(fr.id, $event)"
                      />
                      <span class="text-sm text-[var(--p-text)] flex-1">{{ fr.name }}</span>
                    </label>
                    <div
                      v-if="fr.charge_unit === 'PER_SIDE_PER_SHEET' && form.finishings.some(f => f.finishing_rate === fr.id)"
                      class="mt-2 ml-6 flex flex-wrap gap-2"
                    >
                      <button
                        type="button"
                        :class="['rounded-lg border px-2 py-1 text-xs font-medium transition-colors', getFinishingApplyToSides(fr.id) === 'SINGLE' ? 'border-flamingo-400 bg-flamingo-50 dark:bg-flamingo-900/20 text-flamingo-700' : 'border-[var(--p-border)] text-[var(--p-text-dim)] hover:border-[var(--p-border-dim)]']"
                        @click="setFinishingApplyToSides(fr.id, 'SINGLE')"
                      >
                        Single-sided
                      </button>
                      <button
                        type="button"
                        :class="['rounded-lg border px-2 py-1 text-xs font-medium transition-colors', getFinishingApplyToSides(fr.id) === 'DOUBLE' ? 'border-flamingo-400 bg-flamingo-50 dark:bg-flamingo-900/20 text-flamingo-700' : 'border-[var(--p-border)] text-[var(--p-text-dim)] hover:border-[var(--p-border-dim)]']"
                        @click="setFinishingApplyToSides(fr.id, 'DOUBLE')"
                      >
                        Double-sided
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div v-if="needsMachineWarning" class="rounded-lg border border-red-300 dark:border-red-800 bg-red-50 dark:bg-red-950/30 p-3 text-sm text-red-700 dark:text-red-300">
                <p class="font-medium flex items-center gap-2">
                  <UIcon name="i-lucide-alert-triangle" class="h-4 w-4 shrink-0" />
                  Machine not chosen
                </p>
                <p class="mt-1">Please select a printing machine above to update the quote.</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-[var(--p-text-dim)] mb-1.5">Special instructions</label>
                <UTextarea v-model="form.special_instructions" placeholder="Optional notes" :rows="2" />
              </div>
              <div
                v-if="hasAllRequiredOptions && (backendPriceResult?.can_calculate || backendPriceLoading)"
                class="rounded-xl border border-flamingo-200 dark:border-flamingo-800/50 bg-flamingo-50/50 dark:bg-flamingo-900/10 p-4"
              >
                <div class="flex justify-between items-baseline">
                  <span class="text-sm font-medium text-[var(--p-text-dim)]">Est. total</span>
                  <span class="text-lg font-bold text-flamingo-600 dark:text-flamingo-400 flex items-center gap-2">
                    <UIcon v-if="backendPriceLoading" name="i-lucide-loader-2" class="h-4 w-4 animate-spin" />
                    {{ backendPriceResult?.can_calculate ? formatKES(backendPriceResult.total ?? 0) : '—' }}
                  </span>
                </div>
                <div v-if="backendPriceResult?.per_unit && form.quantity > 0" class="mt-1 text-xs text-[var(--p-text-muted)]">
                  {{ formatKES(backendPriceResult.per_unit) }} per item
                </div>
              </div>
              <div class="flex gap-3 pt-2">
                <UButton variant="soft" color="neutral" class="flex-1" @click="emit('update:open', false)">Cancel</UButton>
                <UButton type="submit" color="primary" class="flex-1" :loading="submitting" :disabled="needsMachineWarning">
                  <UIcon name="i-lucide-check" class="h-4 w-4 mr-1" />
                  Update
                </UButton>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import type { QuoteItem } from '~/shared/types'
import type { QuoteItemFinishingPayload } from '~/services/quoteDraft'
import { calculateGalleryProductPrice } from '~/shared/api/gallery'
import { API } from '~/shared/api-paths'
import { useDebounceFn } from '@vueuse/core'
import { usePublicApiNoAuth } from '~/shared/api'
import { updateTweakedItem } from '~/services/quoteDraft'
import { formatKES } from '~/utils/formatters'

const props = defineProps<{
  open: boolean
  item: QuoteItem | null
  shopSlug?: string
}>()

const emit = defineEmits<{ 'update:open': [v: boolean]; updated: [] }>()

const publicApiNoAuth = usePublicApiNoAuth()
const minQty = 100
const loading = ref(false)
const loadError = ref('')
const submitting = ref(false)

const papers = ref<Array<{ id: number; sheet_size: string; gsm: number; paper_type: string; selling_price: string; unit?: string }>>([])
const materials = ref<Array<{ id: number; material_type?: string; name?: string; unit: string; selling_price: string }>>([])
const finishingRates = ref<Array<{ id: number; name: string; price: string; charge_unit?: string }>>([])
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

const backendPriceResult = ref<{ total?: number; per_unit?: number; can_calculate?: boolean } | null>(null)
const backendPriceLoading = ref(false)

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
    })
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

async function loadOptions() {
  const productId = props.item?.product
  if (!productId) return
  loading.value = true
  loadError.value = ''
  try {
    const opts = await publicApiNoAuth<{
      available_papers?: Array<{ id: number; sheet_size: string; gsm: number; paper_type: string; selling_price: string }>
      available_materials?: Array<{ id: number; material_type?: string; unit: string; selling_price: string }>
      available_finishings?: Array<{ id: number; name: string; price: string; charge_unit?: string }>
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
    loadOptions()
    document.body.style.overflow = 'hidden'
    nextTick(() => {
      if (hasAllRequiredOptions.value) fetchPriceDebounced()
    })
  } else {
    document.body.style.overflow = ''
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
  if (!props.item) return
  submitting.value = true
  try {
    if (needsMachineWarning.value) return
    await updateTweakedItem(props.item.id, {
      quantity: form.quantity,
      sides: form.sides,
      color_mode: form.color_mode,
      paper: form.paper ?? undefined,
      material: form.material ?? undefined,
      machine: form.machine ?? undefined,
      finishings: form.finishings.length ? form.finishings : undefined,
      special_instructions: form.special_instructions.trim() || undefined,
    })
    emit('updated')
    emit('update:open', false)
  } catch (err) {
    const toast = useToast()
    toast.add({ title: 'Update failed', description: err instanceof Error ? err.message : 'Please try again.', color: 'error' })
  } finally {
    submitting.value = false
  }
}

onUnmounted(() => {
  document.body.style.overflow = ''
})
</script>
