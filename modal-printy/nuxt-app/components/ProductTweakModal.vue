<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="modelValue"
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
        role="dialog"
        aria-modal="true"
        @keydown.esc="close"
      >
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="close" />

        <!-- Modal panel -->
        <div
          class="modal-panel relative w-full max-w-lg max-h-[90vh] overflow-y-auto bg-white dark:bg-stone-900 rounded-2xl shadow-2xl z-10"
          @click.stop
        >
          <!-- ── Header ── -->
          <div class="sticky top-0 z-10 bg-white/95 dark:bg-stone-900/95 backdrop-blur border-b border-stone-200 dark:border-stone-700 px-6 py-4 rounded-t-2xl">
            <div class="flex items-start justify-between gap-4">
              <div>
                <h2 class="text-lg font-bold text-stone-800 dark:text-stone-100">
                  Tweak Quote — {{ product.name }}
                </h2>
                <p class="text-sm text-stone-500 dark:text-stone-400 mt-0.5">
                  Customize paper, quantity, finishing, and other options before adding to your quote.
                </p>
              </div>
              <button
                @click="close"
                class="rounded-lg p-1.5 text-stone-400 hover:text-stone-600 dark:hover:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
              >
                <XIcon class="h-5 w-5" />
              </button>
            </div>
          </div>

          <!-- ── Body ── -->
          <div class="min-h-[200px] p-6 space-y-6">

            <!-- Success message -->
            <div
              v-if="successMessage"
              class="rounded-xl border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950/30 p-4 flex items-center gap-3"
            >
              <div class="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                <CheckIcon class="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <p class="text-sm font-medium text-green-700 dark:text-green-300">{{ successMessage }}</p>
            </div>

            <!-- Loading -->
            <div v-if="loading" class="flex flex-col items-center justify-center py-12 text-stone-400">
              <Loader2Icon class="h-8 w-8 animate-spin mb-3" />
              <p class="text-sm">Loading options…</p>
            </div>

            <!-- Error -->
            <div
              v-else-if="loadError"
              class="rounded-lg border border-red-300 dark:border-red-800 bg-red-50 dark:bg-red-950/30 p-4 text-sm text-red-700 dark:text-red-300"
            >
              <p class="font-semibold flex items-center gap-2">
                <AlertCircleIcon class="h-4 w-4" />
                Could not open quote options.
              </p>
              <p class="mt-1">{{ loadError }}</p>
              <div class="mt-3 flex gap-2">
                <button
                  @click="loadShopData"
                  class="px-3 py-1.5 text-sm rounded-lg bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-900 transition-colors"
                >
                  Retry
                </button>
                <button
                  @click="close"
                  class="px-3 py-1.5 text-sm rounded-lg text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>

            <!-- ── Loaded content ── -->
            <template v-if="!loading && !loadError">
              <!-- Product info row -->
              <div class="flex items-center gap-4 rounded-xl bg-stone-50 dark:bg-stone-800/50 p-4">
                <div class="w-16 h-16 rounded-lg bg-stone-200 dark:bg-stone-700 flex items-center justify-center shrink-0 border border-stone-200 dark:border-stone-600 overflow-hidden">
                  <img v-if="product.primary_image" :src="product.primary_image" :alt="product.name" class="w-full h-full object-cover" />
                  <PackageIcon v-else class="h-8 w-8 text-stone-400 dark:text-stone-500" />
                </div>
                <div class="min-w-0 flex-1">
                  <p class="font-semibold text-stone-800 dark:text-stone-100 truncate">{{ product.name }}</p>
                  <p v-if="product.category" class="text-xs text-stone-500 dark:text-stone-400">{{ product.category }}</p>
                  <div class="flex flex-wrap gap-1.5 mt-1">
                    <span v-if="product.final_size" class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-stone-100 dark:bg-stone-700 text-stone-600 dark:text-stone-300">
                      {{ product.final_size }}
                    </span>
                    <span v-if="product.imposition_summary" class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-stone-100 dark:bg-stone-700 text-stone-600 dark:text-stone-300">
                      {{ product.imposition_summary }}
                    </span>
                    <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300">
                      {{ product.pricing_mode === 'LARGE_FORMAT' ? 'Large Format' : 'Sheet' }}
                    </span>
                  </div>
                </div>
              </div>

              <!-- ── Form ── -->
              <form class="space-y-5" @submit.prevent="onSubmit">

                <!-- Quantity -->
                <div>
                  <label class="block text-sm font-medium text-stone-600 dark:text-stone-300 mb-1.5">Quantity</label>
                  <div class="flex items-center gap-2">
                    <button
                      type="button"
                      @click="form.quantity = Math.max(minQty, form.quantity - 50)"
                      class="p-2 rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors"
                    >
                      <MinusIcon class="h-4 w-4" />
                    </button>
                    <input
                      v-model.number="form.quantity"
                      type="number"
                      :min="minQty"
                      class="w-24 text-center rounded-lg border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-800 px-3 py-2 text-sm font-medium text-stone-800 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-400"
                      @blur="form.quantity = Math.max(minQty, form.quantity || minQty)"
                    />
                    <button
                      type="button"
                      @click="form.quantity += 50"
                      class="p-2 rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors"
                    >
                      <PlusIcon class="h-4 w-4" />
                    </button>
                    <span class="text-xs text-stone-400">min {{ minQty }}</span>
                  </div>
                </div>

                <!-- Sides (SHEET only) -->
                <div v-if="product.pricing_mode === 'SHEET'">
                  <label class="block text-sm font-medium text-stone-600 dark:text-stone-300 mb-1.5">Sides</label>
                  <div class="grid grid-cols-2 gap-2">
                    <button
                      v-for="side in (['SIMPLEX', 'DUPLEX'] as const)"
                      :key="side"
                      type="button"
                      :class="[
                        'rounded-lg border px-3 py-2 text-sm font-medium transition-all',
                        form.sides === side
                          ? 'border-amber-400 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 ring-1 ring-amber-400/50'
                          : 'border-stone-200 dark:border-stone-600 text-stone-600 dark:text-stone-300 hover:border-stone-300 dark:hover:border-stone-500'
                      ]"
                      @click="form.sides = side"
                    >
                      {{ side === 'SIMPLEX' ? 'Single-sided' : 'Double-sided' }}
                    </button>
                  </div>
                </div>

                <!-- Color mode (SHEET only) -->
                <div v-if="product.pricing_mode === 'SHEET'">
                  <label class="block text-sm font-medium text-stone-600 dark:text-stone-300 mb-1.5">Color</label>
                  <div class="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      :class="[
                        'rounded-lg border px-3 py-2 text-sm font-medium transition-all flex items-center justify-center gap-1',
                        form.color_mode === 'COLOR'
                          ? 'border-amber-400 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 ring-1 ring-amber-400/50'
                          : 'border-stone-200 dark:border-stone-600 text-stone-600 dark:text-stone-300 hover:border-stone-300'
                      ]"
                      @click="form.color_mode = 'COLOR'"
                    >
                      <PaletteIcon class="h-4 w-4" />
                      Color
                    </button>
                    <button
                      type="button"
                      :class="[
                        'rounded-lg border px-3 py-2 text-sm font-medium transition-all',
                        form.color_mode === 'BW'
                          ? 'border-amber-400 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 ring-1 ring-amber-400/50'
                          : 'border-stone-200 dark:border-stone-600 text-stone-600 dark:text-stone-300 hover:border-stone-300'
                      ]"
                      @click="form.color_mode = 'BW'"
                    >
                      B&amp;W
                    </button>
                  </div>
                </div>

                <!-- Paper (SHEET mode) -->
                <div v-if="product.pricing_mode === 'SHEET' && papers.length">
                  <label class="block text-sm font-medium text-stone-600 dark:text-stone-300 mb-1.5">Paper type / grammage</label>
                  <div class="space-y-1.5 max-h-36 overflow-y-auto rounded-lg border border-stone-200 dark:border-stone-600 p-2">
                    <label
                      v-for="p in papers"
                      :key="p.id"
                      :class="[
                        'flex items-center gap-3 rounded-lg px-3 py-2 cursor-pointer transition-colors',
                        form.paper === p.id ? 'bg-amber-50 dark:bg-amber-900/20' : 'hover:bg-stone-50 dark:hover:bg-stone-800/50'
                      ]"
                    >
                      <input
                        v-model="form.paper"
                        type="radio"
                        :value="p.id"
                        class="accent-amber-500"
                      />
                      <span class="text-sm text-stone-700 dark:text-stone-200">
                        {{ p.sheet_size }} {{ p.gsm }}gsm {{ p.paper_type }}
                      </span>
                      <span class="ml-auto text-xs text-stone-400">KES {{ p.selling_price }}</span>
                    </label>
                  </div>
                </div>

                <!-- Material (LARGE_FORMAT mode) -->
                <div v-if="product.pricing_mode === 'LARGE_FORMAT' && materials.length">
                  <label class="block text-sm font-medium text-stone-600 dark:text-stone-300 mb-1.5">Material</label>
                  <div class="space-y-1.5 max-h-36 overflow-y-auto rounded-lg border border-stone-200 dark:border-stone-600 p-2">
                    <label
                      v-for="m in materials"
                      :key="m.id"
                      :class="[
                        'flex items-center gap-3 rounded-lg px-3 py-2 cursor-pointer transition-colors',
                        form.material === m.id ? 'bg-amber-50 dark:bg-amber-900/20' : 'hover:bg-stone-50 dark:hover:bg-stone-800/50'
                      ]"
                    >
                      <input
                        v-model="form.material"
                        type="radio"
                        :value="m.id"
                        class="accent-amber-500"
                      />
                      <span class="text-sm text-stone-700 dark:text-stone-200">
                        {{ m.material_type ?? m.name }}
                      </span>
                      <span class="ml-auto text-xs text-stone-400">
                        KES {{ m.selling_price }}/{{ m.unit }}
                      </span>
                    </label>
                  </div>
                </div>

                <!-- Finishing options -->
                <div v-if="finishingRates.length">
                  <label class="block text-sm font-medium text-stone-600 dark:text-stone-300 mb-1.5">Finishing</label>
                  <div class="space-y-1.5 max-h-40 overflow-y-auto rounded-lg border border-stone-200 dark:border-stone-600 p-2">
                    <label
                      v-for="fr in finishingRates"
                      :key="fr.id"
                      class="flex items-center gap-3 rounded-lg px-3 py-2 cursor-pointer transition-colors hover:bg-stone-50 dark:hover:bg-stone-800/50"
                    >
                      <input
                        type="checkbox"
                        :checked="form.finishings.some(f => f.finishing_rate === fr.id)"
                        class="accent-amber-500 h-4 w-4 rounded"
                        @change="toggleFinishing(fr.id, ($event.target as HTMLInputElement).checked)"
                      />
                      <span class="text-sm text-stone-700 dark:text-stone-200 flex-1">{{ fr.name }}</span>
                      <span class="text-xs text-stone-400">KES {{ fr.price }}</span>
                    </label>
                  </div>
                </div>

                <!-- Hint for complete quote -->
                <div
                  v-if="needsPaperOrFinishing"
                  class="rounded-lg border border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-900/20 p-3 text-sm text-amber-800 dark:text-amber-200"
                >
                  <p class="font-medium flex items-center gap-2">
                    <LightbulbIcon class="h-4 w-4 shrink-0" />
                    For a complete quote
                  </p>
                  <ul class="mt-1 ml-6 list-disc space-y-0.5 text-amber-700 dark:text-amber-300">
                    <li v-if="product.pricing_mode === 'SHEET' && papers.length && !form.paper">Select paper for accurate pricing</li>
                    <li v-if="product.pricing_mode === 'LARGE_FORMAT' && materials.length && !form.material">Select material for accurate pricing</li>
                    <li v-if="finishingRates.length && !form.finishings.length">Consider adding finishing (lamination, binding, etc.)</li>
                  </ul>
                </div>

                <!-- Special instructions -->
                <div>
                  <label class="block text-sm font-medium text-stone-600 dark:text-stone-300 mb-1.5">Special instructions</label>
                  <textarea
                    v-model="form.special_instructions"
                    placeholder="Any notes for the shop (optional)"
                    rows="2"
                    class="w-full rounded-lg border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-800 px-3 py-2 text-sm text-stone-800 dark:text-stone-100 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-400 resize-none"
                  />
                </div>

                <!-- ── Price preview / Quote summary ── -->
                <div class="rounded-xl border border-amber-200 dark:border-amber-800/50 bg-amber-50/50 dark:bg-amber-900/10 p-4 space-y-2">
                  <p class="text-xs font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400">Quote Summary</p>

                  <div class="flex justify-between text-sm">
                    <span class="text-stone-500 dark:text-stone-400">Product</span>
                    <span class="font-medium text-stone-800 dark:text-stone-100">{{ product.name }}</span>
                  </div>
                  <div class="flex justify-between text-sm">
                    <span class="text-stone-500 dark:text-stone-400">Quantity</span>
                    <span class="font-medium text-stone-800 dark:text-stone-100">{{ form.quantity }} pcs</span>
                  </div>
                  <div v-if="product.pricing_mode === 'SHEET'" class="flex justify-between text-sm">
                    <span class="text-stone-500 dark:text-stone-400">Sides</span>
                    <span class="font-medium text-stone-800 dark:text-stone-100">
                      {{ form.sides === 'DUPLEX' ? 'Double-sided' : 'Single-sided' }}
                    </span>
                  </div>
                  <div v-if="product.pricing_mode === 'SHEET'" class="flex justify-between text-sm">
                    <span class="text-stone-500 dark:text-stone-400">Color</span>
                    <span class="font-medium text-stone-800 dark:text-stone-100">
                      {{ form.color_mode === 'COLOR' ? 'Full Color' : 'Black & White' }}
                    </span>
                  </div>
                  <div v-if="selectedPaperLabel" class="flex justify-between text-sm">
                    <span class="text-stone-500 dark:text-stone-400">Paper</span>
                    <span class="font-medium text-stone-800 dark:text-stone-100">{{ selectedPaperLabel }}</span>
                  </div>
                  <div v-if="selectedMaterialLabel" class="flex justify-between text-sm">
                    <span class="text-stone-500 dark:text-stone-400">Material</span>
                    <span class="font-medium text-stone-800 dark:text-stone-100">{{ selectedMaterialLabel }}</span>
                  </div>
                  <div v-if="selectedFinishingLabels.length" class="flex justify-between text-sm">
                    <span class="text-stone-500 dark:text-stone-400">Finishing</span>
                    <span class="font-medium text-stone-800 dark:text-stone-100 text-right max-w-[60%]">
                      {{ selectedFinishingLabels.join(', ') }}
                    </span>
                  </div>

                  <template v-if="estimatedTotal">
                    <div class="border-t border-amber-200/60 dark:border-amber-800/30 pt-2 space-y-1">
                      <div class="flex justify-between items-baseline">
                        <span class="font-semibold text-stone-800 dark:text-stone-100">Est. total</span>
                        <span class="text-lg font-bold text-amber-600 dark:text-amber-400">
                          KES {{ estimatedTotal.total.toLocaleString() }}
                        </span>
                      </div>
                      <div class="flex justify-between text-sm text-stone-400">
                        <span>Per item</span>
                        <span>KES {{ estimatedTotal.perUnit.toFixed(2) }}</span>
                      </div>
                    </div>
                  </template>

                  <p class="text-xs text-stone-400 pt-1">Final price computed by the shop after submission.</p>
                </div>

                <!-- Actions -->
                <div class="flex gap-3 pt-2">
                  <button
                    type="button"
                    @click="close"
                    class="flex-1 px-4 py-2.5 rounded-xl border border-stone-200 dark:border-stone-600 text-stone-600 dark:text-stone-300 text-sm font-medium hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    :disabled="submitting"
                    class="flex-1 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <Loader2Icon v-if="submitting" class="h-4 w-4 animate-spin" />
                    <PlusIcon v-else class="h-4 w-4" />
                    {{ submitting ? 'Adding…' : 'Add to Quote' }}
                  </button>
                </div>
              </form>
            </template>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import {
  X as XIcon,
  Loader2 as Loader2Icon,
  Package as PackageIcon,
  Minus as MinusIcon,
  Plus as PlusIcon,
  Palette as PaletteIcon,
  Lightbulb as LightbulbIcon,
  Check as CheckIcon,
  AlertCircle as AlertCircleIcon,
} from 'lucide-vue-next'
import type { Product, Paper, MaterialItem, FinishingRate, TweakForm, QuoteItemFinishingPayload } from '~/shared/types'
import { getShopDataForProduct } from '~/shared/mockData'
import { useQuoteStore } from '~/stores/quote'

const props = defineProps<{
  product: Product
  shopSlug: string
}>()

const emit = defineEmits<{
  (e: 'added'): void
}>()

const modelValue = defineModel<boolean>({ default: false })

const quoteStore = useQuoteStore()

const loading = ref(false)
const loadError = ref('')
const submitting = ref(false)
const successMessage = ref('')
const papers = ref<Paper[]>([])
const materials = ref<MaterialItem[]>([])
const finishingRates = ref<FinishingRate[]>([])

const minQty = computed(() => props.product.min_quantity || 100)

const form = reactive<TweakForm>({
  quantity: minQty.value,
  sides: (props.product.default_sides as 'SIMPLEX' | 'DUPLEX') || 'SIMPLEX',
  color_mode: 'COLOR',
  paper: null,
  material: null,
  finishings: [],
  special_instructions: '',
})

// ── Computed labels ──

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

const estimatedTotal = computed(() => {
  if (!props.product.price_hint?.can_calculate) return null
  const base = props.product.price_hint.total || 0
  const defaultQty = props.product.min_quantity || 100
  const ratio = form.quantity / defaultQty
  let total = base * ratio

  if (form.sides === 'DUPLEX' && props.product.default_sides !== 'DUPLEX') {
    total *= 1.4
  }

  form.finishings.forEach(f => {
    const rate = finishingRates.value.find(r => r.id === f.finishing_rate)
    if (rate) {
      const price = parseFloat(rate.price) || 0
      if (rate.charge_unit === 'FLAT') {
        total += price
      } else {
        total += price * form.quantity
      }
    }
  })

  return {
    total: Math.round(total),
    perUnit: Math.round((total / form.quantity) * 100) / 100,
  }
})

// ── Methods ──

function close() {
  modelValue.value = false
}

function resetForm() {
  const defaultFinishings: QuoteItemFinishingPayload[] = (props.product.finishing_options ?? [])
    .filter(o => o.is_default)
    .map(o => ({ finishing_rate: o.finishing_rate }))

  form.quantity = minQty.value
  form.sides = (props.product.default_sides as 'SIMPLEX' | 'DUPLEX') || 'SIMPLEX'
  form.color_mode = 'COLOR'
  form.paper = null
  form.material = null
  form.finishings = defaultFinishings
  form.special_instructions = ''
  successMessage.value = ''
}

async function loadShopData() {
  loading.value = true
  loadError.value = ''
  try {
    // Simulate API latency
    await new Promise(resolve => setTimeout(resolve, 500))
    const data = getShopDataForProduct(props.product)
    papers.value = data.papers
    materials.value = data.materials
    finishingRates.value = data.finishings
  } catch {
    loadError.value = 'Could not load product options.'
  } finally {
    loading.value = false
  }
}

function toggleFinishing(id: number, checked: boolean) {
  if (checked) {
    form.finishings.push({ finishing_rate: id })
  } else {
    form.finishings = form.finishings.filter(f => f.finishing_rate !== id)
  }
}

async function onSubmit() {
  submitting.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 400))

    const selectedPaper = form.paper ? papers.value.find(p => p.id === form.paper) ?? null : null
    const selectedMaterial = form.material ? materials.value.find(m => m.id === form.material) ?? null : null
    const selectedFinishings = form.finishings
      .map(f => finishingRates.value.find(r => r.id === f.finishing_rate))
      .filter(Boolean) as FinishingRate[]

    quoteStore.addItem({
      product: props.product,
      quantity: Math.max(minQty.value, form.quantity),
      sides: form.sides,
      color_mode: form.color_mode,
      paper: selectedPaper,
      material: selectedMaterial,
      finishings: selectedFinishings,
      special_instructions: form.special_instructions.trim() || undefined,
    })

    successMessage.value = `${props.product.name} added to your quote!`
    emit('added')

    setTimeout(() => {
      close()
    }, 1200)
  } catch {
    loadError.value = 'Could not add to quote. Please try again.'
  } finally {
    submitting.value = false
  }
}

// ── Body scroll lock & data loading ──

watch(modelValue, (open, wasOpen) => {
  if (open && !wasOpen) {
    document.body.style.overflow = 'hidden'
    resetForm()
    loadShopData()
  }
  if (!open && wasOpen) {
    document.body.style.overflow = ''
  }
})

onUnmounted(() => {
  document.body.style.overflow = ''
})
</script>
