<template>
  <UModal v-model:open="isOpen" :ui="{ content: 'w-[calc(100vw-2rem)] max-w-lg rounded-2xl shadow-xl' }">
    <template #content>
      <div class="p-6 space-y-6">
        <!-- Header -->
        <div>
          <h2 class="text-xl font-bold text-[var(--p-text)]">Tweak Quote</h2>
          <p class="mt-1 text-sm text-[var(--p-text-muted)]">
            Customize <span class="font-medium text-[var(--p-text)]">{{ product.name }}</span> before adding to your quote.
          </p>
        </div>

        <!-- Product info row -->
        <div class="flex items-center gap-4 rounded-xl bg-[var(--p-surface-sunken)] p-4">
          <div v-if="imageUrl" class="w-16 h-16 rounded-lg overflow-hidden shrink-0 border border-[var(--p-border)]">
            <img :src="imageUrl" :alt="product.name" class="w-full h-full object-cover" />
          </div>
          <div v-else class="w-16 h-16 rounded-lg bg-[var(--p-border)] flex items-center justify-center shrink-0">
            <UIcon name="i-lucide-package" class="h-8 w-8 text-[var(--p-text-muted)]" />
          </div>
          <div class="min-w-0 flex-1">
            <p class="font-semibold text-[var(--p-text)] truncate">{{ product.name }}</p>
            <p v-if="product.category" class="text-xs text-[var(--p-text-muted)]">{{ product.category }}</p>
            <div class="flex flex-wrap gap-1.5 mt-1">
              <UBadge v-if="product.final_size" variant="soft" color="neutral" size="xs">{{ product.final_size }}</UBadge>
              <UBadge v-if="product.imposition_summary" variant="soft" color="neutral" size="xs">{{ product.imposition_summary }}</UBadge>
              <UBadge variant="soft" color="primary" size="xs">{{ product.pricing_mode === 'LARGE_FORMAT' ? 'Large Format' : 'Sheet' }}</UBadge>
            </div>
          </div>
        </div>

        <!-- Form -->
        <form class="space-y-5" @submit.prevent="onSubmit">
          <!-- Quantity -->
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

          <!-- Sides (simplex / duplex) -->
          <div v-if="product.pricing_mode === 'SHEET'">
            <label class="block text-sm font-medium text-[var(--p-text-dim)] mb-1.5">Sides</label>
            <div class="grid grid-cols-2 gap-2">
              <button
                type="button"
                class="rounded-lg border px-3 py-2 text-sm font-medium transition-all"
                :class="form.sides === 'SIMPLEX'
                  ? 'border-flamingo-400 bg-flamingo-50 dark:bg-flamingo-900/20 text-flamingo-700 dark:text-flamingo-300'
                  : 'border-[var(--p-border)] text-[var(--p-text-dim)] hover:border-[var(--p-border-dim)]'"
                @click="form.sides = 'SIMPLEX'"
              >
                Single-sided
              </button>
              <button
                type="button"
                class="rounded-lg border px-3 py-2 text-sm font-medium transition-all"
                :class="form.sides === 'DUPLEX'
                  ? 'border-flamingo-400 bg-flamingo-50 dark:bg-flamingo-900/20 text-flamingo-700 dark:text-flamingo-300'
                  : 'border-[var(--p-border)] text-[var(--p-text-dim)] hover:border-[var(--p-border-dim)]'"
                @click="form.sides = 'DUPLEX'"
              >
                Double-sided
              </button>
            </div>
          </div>

          <!-- Color mode -->
          <div v-if="product.pricing_mode === 'SHEET'">
            <label class="block text-sm font-medium text-[var(--p-text-dim)] mb-1.5">Color</label>
            <div class="grid grid-cols-2 gap-2">
              <button
                type="button"
                class="rounded-lg border px-3 py-2 text-sm font-medium transition-all"
                :class="form.color_mode === 'COLOR'
                  ? 'border-flamingo-400 bg-flamingo-50 dark:bg-flamingo-900/20 text-flamingo-700 dark:text-flamingo-300'
                  : 'border-[var(--p-border)] text-[var(--p-text-dim)] hover:border-[var(--p-border-dim)]'"
                @click="form.color_mode = 'COLOR'"
              >
                <UIcon name="i-lucide-palette" class="h-4 w-4 mr-1 inline" />
                Color
              </button>
              <button
                type="button"
                class="rounded-lg border px-3 py-2 text-sm font-medium transition-all"
                :class="form.color_mode === 'BW'
                  ? 'border-flamingo-400 bg-flamingo-50 dark:bg-flamingo-900/20 text-flamingo-700 dark:text-flamingo-300'
                  : 'border-[var(--p-border)] text-[var(--p-text-dim)] hover:border-[var(--p-border-dim)]'"
                @click="form.color_mode = 'BW'"
              >
                B&W
              </button>
            </div>
          </div>

          <!-- Paper (SHEET mode) -->
          <div v-if="product.pricing_mode === 'SHEET' && papers.length">
            <label class="block text-sm font-medium text-[var(--p-text-dim)] mb-1.5">Paper type / grammage</label>
            <div class="space-y-1.5 max-h-36 overflow-y-auto rounded-lg border border-[var(--p-border)] p-2">
              <label
                v-for="p in papers"
                :key="p.id"
                class="flex items-center gap-3 rounded-lg px-3 py-2 cursor-pointer transition-colors"
                :class="form.paper === p.id ? 'bg-flamingo-50 dark:bg-flamingo-900/20' : 'hover:bg-[var(--p-surface-sunken)]'"
              >
                <input
                  v-model="form.paper"
                  type="radio"
                  :value="p.id"
                  class="accent-flamingo-500"
                />
                <span class="text-sm text-[var(--p-text)]">{{ p.sheet_size }} {{ p.gsm }}gsm {{ p.paper_type }}</span>
                <span class="ml-auto text-xs text-[var(--p-text-muted)]">KES {{ p.selling_price }}</span>
              </label>
            </div>
          </div>

          <!-- Material (LARGE_FORMAT mode) -->
          <div v-if="product.pricing_mode === 'LARGE_FORMAT' && materials.length">
            <label class="block text-sm font-medium text-[var(--p-text-dim)] mb-1.5">Material</label>
            <div class="space-y-1.5 max-h-36 overflow-y-auto rounded-lg border border-[var(--p-border)] p-2">
              <label
                v-for="m in materials"
                :key="m.id"
                class="flex items-center gap-3 rounded-lg px-3 py-2 cursor-pointer transition-colors"
                :class="form.material === m.id ? 'bg-flamingo-50 dark:bg-flamingo-900/20' : 'hover:bg-[var(--p-surface-sunken)]'"
              >
                <input
                  v-model="form.material"
                  type="radio"
                  :value="m.id"
                  class="accent-flamingo-500"
                />
                <span class="text-sm text-[var(--p-text)]">{{ m.material_type ?? m.name }}</span>
                <span class="ml-auto text-xs text-[var(--p-text-muted)]">KES {{ m.selling_price }}/{{ m.unit }}</span>
              </label>
            </div>
          </div>

          <!-- Finishing options -->
          <div v-if="finishingRates.length">
            <label class="block text-sm font-medium text-[var(--p-text-dim)] mb-1.5">Finishing</label>
            <div class="space-y-1.5 max-h-40 overflow-y-auto rounded-lg border border-[var(--p-border)] p-2">
              <label
                v-for="fr in finishingRates"
                :key="fr.id"
                class="flex items-center gap-3 rounded-lg px-3 py-2 cursor-pointer transition-colors hover:bg-[var(--p-surface-sunken)]"
              >
                <UCheckbox
                  :model-value="form.finishings.some(f => f.finishing_rate === fr.id)"
                  @update:model-value="toggleFinishing(fr.id, $event)"
                />
                <span class="text-sm text-[var(--p-text)] flex-1">{{ fr.name }}</span>
                <span class="text-xs text-[var(--p-text-muted)]">KES {{ fr.price }}</span>
              </label>
            </div>
          </div>

          <!-- Special instructions -->
          <div>
            <label class="block text-sm font-medium text-[var(--p-text-dim)] mb-1.5">Special instructions</label>
            <UTextarea
              v-model="form.special_instructions"
              placeholder="Any notes for the shop (optional)"
              :rows="2"
            />
          </div>

          <!-- Price preview section -->
          <div class="rounded-xl border border-flamingo-200 dark:border-flamingo-800/50 bg-flamingo-50/50 dark:bg-flamingo-900/10 p-4 space-y-2">
            <p class="text-xs font-semibold uppercase tracking-wider text-flamingo-600 dark:text-flamingo-400">Quote Summary</p>
            <div class="flex justify-between text-sm">
              <span class="text-[var(--p-text-dim)]">Product</span>
              <span class="font-medium text-[var(--p-text)]">{{ product.name }}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-[var(--p-text-dim)]">Quantity</span>
              <span class="font-medium text-[var(--p-text)]">{{ form.quantity }} pcs</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-[var(--p-text-dim)]">Sides</span>
              <span class="font-medium text-[var(--p-text)]">{{ form.sides === 'DUPLEX' ? 'Double-sided' : 'Single-sided' }}</span>
            </div>
            <div v-if="selectedPaperLabel" class="flex justify-between text-sm">
              <span class="text-[var(--p-text-dim)]">Paper</span>
              <span class="font-medium text-[var(--p-text)]">{{ selectedPaperLabel }}</span>
            </div>
            <div v-if="selectedMaterialLabel" class="flex justify-between text-sm">
              <span class="text-[var(--p-text-dim)]">Material</span>
              <span class="font-medium text-[var(--p-text)]">{{ selectedMaterialLabel }}</span>
            </div>
            <div v-if="selectedFinishingLabels.length" class="flex justify-between text-sm">
              <span class="text-[var(--p-text-dim)]">Finishing</span>
              <span class="font-medium text-[var(--p-text)]">{{ selectedFinishingLabels.join(', ') }}</span>
            </div>
            <div v-if="product.price_hint?.can_calculate" class="border-t border-flamingo-200/60 dark:border-flamingo-800/30 pt-2 flex justify-between">
              <span class="font-semibold text-[var(--p-text)]">Est. price</span>
              <span class="text-lg font-bold text-flamingo-600 dark:text-flamingo-400">
                {{ product.price_hint.price_display }}
              </span>
            </div>
            <p class="text-xs text-[var(--p-text-muted)]">Final price computed by the shop after submission.</p>
          </div>

          <!-- Actions -->
          <div class="flex gap-3 pt-2">
            <UButton variant="soft" color="neutral" class="flex-1" @click="isOpen = false">
              Cancel
            </UButton>
            <UButton type="submit" color="primary" class="flex-1" :loading="submitting">
              <UIcon name="i-lucide-plus" class="h-4 w-4 mr-1" />
              Add to Quote
            </UButton>
          </div>
        </form>
      </div>
    </template>
  </UModal>
</template>

<script setup lang="ts">
import type { Product, Paper, FinishingRate } from '~/shared/types'
import type { QuoteItemFinishingPayload } from '~/services/quoteDraft'
import { useApi as useRawApi } from '~/shared/api'
import { API } from '~/shared/api-paths'

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
}>()

const emit = defineEmits<{
  (e: 'added'): void
}>()

const isOpen = defineModel<boolean>({ default: false })

const { getMediaUrl } = useApi()
const rawApi = useRawApi()

const submitting = ref(false)
const papers = ref<Paper[]>([])
const materials = ref<MaterialItem[]>([])
const finishingRates = ref<FinishingRate[]>([])

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
  finishings: QuoteItemFinishingPayload[]
  special_instructions: string
}

const form = reactive<TweakForm>({
  quantity: minQty.value,
  sides: (props.product.default_sides as 'SIMPLEX' | 'DUPLEX') || 'SIMPLEX',
  color_mode: 'COLOR',
  paper: null,
  material: null,
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

function toggleFinishing(id: number, checked: boolean) {
  if (checked) {
    form.finishings.push({ finishing_rate: id })
  } else {
    form.finishings = form.finishings.filter(f => f.finishing_rate !== id)
  }
}

function resetForm() {
  form.quantity = minQty.value
  form.sides = (props.product.default_sides as 'SIMPLEX' | 'DUPLEX') || 'SIMPLEX'
  form.color_mode = 'COLOR'
  form.paper = null
  form.material = null
  form.special_instructions = ''

  const defaultFinishings = (props.product.finishing_options ?? [])
    .filter(o => o.is_default)
    .map(o => ({ finishing_rate: o.finishing_rate }))
  form.finishings = defaultFinishings
}

interface PublicProductOptions {
  available_papers?: Array<{ id: number; sheet_size: string; gsm: number; paper_type: string; selling_price: string }>
  available_materials?: Array<{ id: number; material_type?: string; unit: string; selling_price: string }>
  available_finishings?: Array<{ id: number; name: string; price: string; charge_unit?: string }>
}

async function loadShopData() {
  const slug = props.shopSlug
  const productId = props.product?.id
  if (!slug && !productId) return

  // Prefer public product options (no auth) for gallery / unauthenticated users
  if (productId) {
    try {
      const opts = await rawApi<PublicProductOptions>(API.publicProductOptions(productId))
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
      return
    } catch {
      // Fall through to shop-scoped fetch for authenticated shop owners
    }
  }

  if (!slug) return
  try {
    const [papersData, finishData, materialsData] = await Promise.all([
      rawApi<Paper[] | { results: Paper[] }>(API.shopPapers(slug)),
      rawApi<FinishingRate[] | { results: FinishingRate[] }>(API.shopFinishingRates(slug)),
      rawApi<MaterialItem[] | { results: MaterialItem[] }>(API.shopMaterials(slug)),
    ])
    papers.value = extractArray(papersData)
    finishingRates.value = extractArray(finishData)
    materials.value = extractArray(materialsData)
  } catch {
    papers.value = []
    finishingRates.value = []
    materials.value = []
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
  const { useQuoteDraftStore } = await import('~/stores/quoteDraft')
  const quoteDraftStore = useQuoteDraftStore()
  submitting.value = true
  try {
    await quoteDraftStore.addTweakedProductToQuote(props.shopSlug, {
      item_type: 'PRODUCT',
      product: props.product.id,
      quantity: Math.max(minQty.value, form.quantity),
      pricing_mode: props.product.pricing_mode,
      paper: form.paper ?? undefined,
      material: form.material ?? undefined,
      sides: form.sides,
      color_mode: form.color_mode,
      finishings: form.finishings.length ? form.finishings : undefined,
      special_instructions: form.special_instructions.trim() || undefined,
    })
    emit('added')
    isOpen.value = false
  } catch (err) {
    const toast = useToast()
    toast.add({
      title: 'Could not add to quote',
      description: err instanceof Error ? err.message : 'Please sign in to add to your quote.',
      color: 'error',
    })
  } finally {
    submitting.value = false
  }
}

watch(isOpen, (open) => {
  if (open) {
    resetForm()
    loadShopData()
  }
})
</script>
