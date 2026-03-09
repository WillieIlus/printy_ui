<script setup lang="ts">
import { ref, computed, watch, reactive } from 'vue'
import type { GalleryProductDTO, GalleryCategoryDTO, GalleryCalculatePriceResponse, GalleryProductOptions } from '~/shared/types/gallery'
import type { QuoteItemFinishingPayload } from '~/services/quoteDraft'
import { getGalleryProductOptions, calculateGalleryProductPrice } from '~/shared/api/gallery'
import { getActiveDraft, tweakAndAdd } from '~/services/quoteDraft'
import { formatKES } from '~/utils/formatters'

const props = defineProps<{
  open: boolean
  product: GalleryProductDTO
  category: GalleryCategoryDTO
}>()

const emit = defineEmits<{ 'update:open': [value: boolean]; close: []; added: [item: unknown] }>()

const { getMediaUrl } = useApi()
const toast = useToast()
const authStore = useAuthStore()

const quantity = ref(100)
const calculating = ref(false)
const priceResult = ref<GalleryCalculatePriceResponse | null>(null)
const isDemoMode = ref(false)
const productOptions = ref<GalleryProductOptions | null>(null)
const optionsLoading = ref(false)
const submitting = ref(false)
const addedItem = ref<unknown>(null)

const form = reactive({
  paper: null as number | null,
  material: null as number | null,
  finishings: [] as QuoteItemFinishingPayload[],
  sides: 'DUPLEX' as 'SIMPLEX' | 'DUPLEX',
  color_mode: 'COLOR' as 'BW' | 'COLOR',
  special_instructions: '',
})

const minQuantity = computed(() => {
  const opts = productOptions.value
  if (opts?.min_quantity) return opts.min_quantity
  const dims = props.product.dimensions_label ?? ''
  const isSmall = /(\d+)\s*[×x]\s*(\d+)/i.test(dims)
  return isSmall ? 100 : 50
})

const papers = computed(() => productOptions.value?.available_papers ?? [])
const materials = computed(() => productOptions.value?.available_materials ?? [])
const finishingRates = computed(() => productOptions.value?.available_finishings ?? [])
const pricingMode = computed(() => productOptions.value?.pricing_mode ?? 'SHEET')
const defaultSides = computed(() => (productOptions.value?.default_sides as 'SIMPLEX' | 'DUPLEX') ?? 'DUPLEX')

const imageUrl = computed(() => {
  const path = props.product.preview_image
  if (!path) return null
  if (path.startsWith('http')) return path
  return getMediaUrl(path)
})

const isLoggedIn = computed(() => !!authStore.user)

/** Parse dimensions "90 × 55 mm" -> { width: 90, height: 55 } */
function parseDimensions(label: string | undefined): { width: number; height: number } {
  if (!label) return { width: 210, height: 297 }
  const m = label.match(/(\d+)\s*[×x]\s*(\d+)/i)
  if (m) return { width: parseInt(m[1], 10), height: parseInt(m[2], 10) }
  return { width: 210, height: 297 }
}

/** Demo pricing: simple formula based on quantity and dimensions */
function computeDemoPrice(): GalleryCalculatePriceResponse {
  const dims = parseDimensions(props.product.dimensions_label)
  const areaSqm = (dims.width / 1000) * (dims.height / 1000)
  const basePerPiece = 2.5
  const material = Math.round(areaSqm * quantity.value * basePerPiece * 100) / 100
  const printing = Math.round(quantity.value * 0.8 * 100) / 100
  const finishing = Math.round(quantity.value * 0.15 * 100) / 100
  const total = material + printing + finishing
  return {
    product_id: props.product.id,
    product_slug: props.product.slug,
    breakdown: { material, printing, finishing, total },
  }
}

async function fetchOptions() {
  optionsLoading.value = true
  productOptions.value = null
  try {
    productOptions.value = await getGalleryProductOptions(props.product.id)
    if (productOptions.value) {
      form.sides = defaultSides.value
      quantity.value = minQuantity.value
      if (pricingMode.value === 'SHEET' && papers.value.length && !form.paper) {
        form.paper = papers.value[0].id
      }
      if (pricingMode.value === 'LARGE_FORMAT' && materials.value.length && !form.material) {
        form.material = materials.value[0].id
      }
    }
  } finally {
    optionsLoading.value = false
  }
}

async function fetchPrice() {
  const shopSlug = props.product.shop?.slug
  if (!shopSlug) {
    priceResult.value = computeDemoPrice()
    isDemoMode.value = true
    return
  }
  calculating.value = true
  priceResult.value = null
  isDemoMode.value = false
  try {
    const result = await calculateGalleryProductPrice(shopSlug, props.product.slug, {
      quantity: quantity.value,
    })
    if (result) {
      priceResult.value = result
      isDemoMode.value = false
    } else {
      priceResult.value = computeDemoPrice()
      isDemoMode.value = true
    }
  } catch {
    priceResult.value = computeDemoPrice()
    isDemoMode.value = true
  } finally {
    calculating.value = false
  }
}

function toggleFinishing(id: number, checked: boolean) {
  if (checked) {
    form.finishings.push({ finishing_rate: id })
  } else {
    form.finishings = form.finishings.filter(f => f.finishing_rate !== id)
  }
}

async function handleAddToQuote() {
  const shopSlug = props.product.shop?.slug
  if (!shopSlug) {
    toast.add({ title: 'No shop', description: 'This product is not linked to a shop.', color: 'error' })
    return
  }
  if (!isLoggedIn.value) {
    toast.add({
      title: 'Sign in to add to quote',
      description: 'Please sign in to add products to your quote.',
      color: 'warning',
    })
    navigateTo(`/auth/login?redirect=${encodeURIComponent(useRoute().fullPath)}`)
    return
  }

  submitting.value = true
  try {
    const draft = await getActiveDraft(shopSlug)
    const payload = {
      item_type: 'PRODUCT' as const,
      product: props.product.id,
      quantity: Math.max(minQuantity.value, quantity.value),
      sides: form.sides,
      color_mode: form.color_mode,
      paper: form.paper ?? undefined,
      material: form.material ?? undefined,
      finishings: form.finishings.length ? form.finishings : undefined,
      special_instructions: form.special_instructions.trim() || undefined,
    }
    const item = await tweakAndAdd(draft.id, payload)
    addedItem.value = item
    toast.add({
      title: 'Added to Quote',
      description: `${props.product.title} added to your quote draft.`,
      color: 'success',
    })
    emit('added', item)
    handleOpenChange(false)
  } catch (err) {
    toast.add({
      title: 'Could not add to quote',
      description: err instanceof Error ? err.message : 'Please try again.',
      color: 'error',
    })
  } finally {
    submitting.value = false
  }
}

function goToDraft() {
  const shopSlug = props.product.shop?.slug
  if (shopSlug) {
    navigateTo(`/quote-draft?shop=${shopSlug}`)
  }
  handleOpenChange(false)
}

const breakdownRows = computed(() => {
  const b = priceResult.value?.breakdown
  if (!b) return []
  const rows: { label: string; amount: number }[] = []
  if (b.material != null) rows.push({ label: 'Material', amount: b.material })
  if (b.printing != null) rows.push({ label: 'Printing', amount: b.printing })
  if (b.finishing != null) rows.push({ label: 'Finishing', amount: b.finishing })
  return rows
})

const totalPrice = computed(() => {
  const b = priceResult.value?.breakdown
  return b?.total ?? 0
})

function close() {
  emit('update:open', false)
  emit('close')
  addedItem.value = null
}

watch(
  () => props.open,
  async (open) => {
    if (!open) {
      priceResult.value = null
      isDemoMode.value = false
      productOptions.value = null
      form.paper = null
      form.material = null
      form.finishings = []
      form.special_instructions = ''
      return
    }
    await fetchOptions()
    quantity.value = minQuantity.value
    await fetchPrice()
  },
  { immediate: true }
)

const DEBOUNCE_MS = 300
let debounceTimer: ReturnType<typeof setTimeout> | null = null
watch(quantity, () => {
  if (!props.open) return
  if (debounceTimer) clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    debounceTimer = null
    void fetchPrice()
  }, DEBOUNCE_MS)
})

watch(() => props.open, (open) => {
  if (open) document.body.style.overflow = 'hidden'
  else document.body.style.overflow = ''
}, { immediate: true })

onUnmounted(() => {
  document.body.style.overflow = ''
})
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="open"
        class="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4"
        role="dialog"
        aria-modal="true"
        @keydown.esc="close"
      >
        <div
          class="absolute inset-0 bg-black/50 backdrop-blur-sm"
          aria-hidden
          @click="close"
        />
        <div
          class="modal-panel relative w-full h-full sm:h-auto sm:max-h-[calc(100dvh-2rem)] sm:max-w-lg sm:rounded-2xl shadow-xl border border-[var(--p-border)] bg-[var(--p-surface)] overflow-hidden flex flex-col z-10"
          @click.stop
        >
          <div class="flex items-center justify-between p-4 sm:px-6 border-b border-[var(--p-border)] shrink-0">
            <div>
              <h2 class="text-lg font-semibold text-[var(--p-text)]">
                Tweak Quote — {{ product.title }}
              </h2>
              <p class="mt-0.5 text-sm text-[var(--p-text-muted)]">
                Configure options and add to your quote draft.
              </p>
            </div>
            <button
              type="button"
              class="rounded-lg p-1.5 text-[var(--p-text-muted)] hover:text-[var(--p-text)] hover:bg-[var(--p-surface-sunken)] transition-colors"
              aria-label="Close"
              @click="close"
            >
              <UIcon name="i-lucide-x" class="h-5 w-5" />
            </button>
          </div>

          <div class="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
            <!-- Product info -->
            <div class="flex items-center gap-4 rounded-xl bg-[var(--p-surface-sunken)] p-4">
              <div
                v-if="imageUrl"
                class="w-16 h-16 rounded-lg overflow-hidden shrink-0 border border-[var(--p-border)]"
              >
                <img :src="imageUrl" :alt="product.title" class="w-full h-full object-cover" />
              </div>
              <div
                v-else
                class="w-16 h-16 rounded-lg bg-[var(--p-border)] flex items-center justify-center shrink-0"
              >
                <UIcon name="i-lucide-package" class="h-8 w-8 text-[var(--p-text-muted)]" />
              </div>
              <div class="min-w-0 flex-1">
                <p class="font-semibold text-[var(--p-text)] truncate">{{ product.title }}</p>
                <p class="text-xs text-[var(--p-text-muted)]">{{ category.name }}</p>
                <div class="flex flex-wrap gap-1.5 mt-1">
                  <UBadge v-if="product.dimensions_label" variant="soft" color="neutral" size="xs">
                    {{ product.dimensions_label }}
                  </UBadge>
                  <UBadge v-if="product.weight_label" variant="soft" color="neutral" size="xs">
                    {{ product.weight_label }}
                  </UBadge>
                </div>
              </div>
            </div>

            <!-- Quantity -->
            <div>
              <label class="mb-1.5 block text-sm font-medium text-[var(--p-text-dim)]">Quantity</label>
              <div class="flex items-center gap-2">
                <UButton
                  variant="soft"
                  color="neutral"
                  size="sm"
                  icon="i-lucide-minus"
                  @click="quantity = Math.max(minQuantity, quantity - 50)"
                />
                <UInput
                  v-model.number="quantity"
                  type="number"
                  :min="minQuantity"
                  class="w-24 text-center"
                  @blur="quantity = Math.max(minQuantity, quantity || minQuantity)"
                />
                <UButton
                  variant="soft"
                  color="neutral"
                  size="sm"
                  icon="i-lucide-plus"
                  @click="quantity += 50"
                />
                <span class="text-xs text-[var(--p-text-muted)]">min {{ minQuantity }}</span>
              </div>
            </div>

            <!-- Paper (SHEET mode) -->
            <div v-if="pricingMode === 'SHEET' && papers.length" class="space-y-1.5">
              <label class="block text-sm font-medium text-[var(--p-text-dim)]">Paper</label>
              <div class="max-h-32 overflow-y-auto rounded-lg border border-[var(--p-border)] p-2 space-y-1">
                <label
                  v-for="p in papers"
                  :key="p.id"
                  class="flex items-center gap-3 rounded-lg px-3 py-2 cursor-pointer transition-colors"
                  :class="form.paper === p.id ? 'bg-flamingo-50 dark:bg-flamingo-900/20' : 'hover:bg-[var(--p-surface-sunken)]'"
                >
                  <input v-model="form.paper" type="radio" :value="p.id" class="accent-flamingo-500" />
                  <span class="text-sm">{{ p.sheet_size }} {{ p.gsm }}gsm {{ p.paper_type }}</span>
                  <span class="ml-auto text-xs text-[var(--p-text-muted)]">KES {{ p.selling_price }}</span>
                </label>
              </div>
            </div>

            <!-- Material (LARGE_FORMAT mode) -->
            <div v-if="pricingMode === 'LARGE_FORMAT' && materials.length" class="space-y-1.5">
              <label class="block text-sm font-medium text-[var(--p-text-dim)]">Material</label>
              <div class="max-h-32 overflow-y-auto rounded-lg border border-[var(--p-border)] p-2 space-y-1">
                <label
                  v-for="m in materials"
                  :key="m.id"
                  class="flex items-center gap-3 rounded-lg px-3 py-2 cursor-pointer transition-colors"
                  :class="form.material === m.id ? 'bg-flamingo-50 dark:bg-flamingo-900/20' : 'hover:bg-[var(--p-surface-sunken)]'"
                >
                  <input v-model="form.material" type="radio" :value="m.id" class="accent-flamingo-500" />
                  <span class="text-sm">{{ m.material_type ?? 'Material' }}</span>
                  <span class="ml-auto text-xs text-[var(--p-text-muted)]">KES {{ m.selling_price }}/{{ m.unit }}</span>
                </label>
              </div>
            </div>

            <!-- Sides (SHEET mode) -->
            <div v-if="pricingMode === 'SHEET'" class="space-y-1.5">
              <label class="block text-sm font-medium text-[var(--p-text-dim)]">Sides</label>
              <div class="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  class="rounded-lg border px-3 py-2 text-sm font-medium transition-all"
                  :class="form.sides === 'SIMPLEX' ? 'border-flamingo-400 bg-flamingo-50 dark:bg-flamingo-900/20 text-flamingo-700' : 'border-[var(--p-border)] hover:border-[var(--p-border-dim)]'"
                  @click="form.sides = 'SIMPLEX'"
                >
                  Single-sided
                </button>
                <button
                  type="button"
                  class="rounded-lg border px-3 py-2 text-sm font-medium transition-all"
                  :class="form.sides === 'DUPLEX' ? 'border-flamingo-400 bg-flamingo-50 dark:bg-flamingo-900/20 text-flamingo-700' : 'border-[var(--p-border)] hover:border-[var(--p-border-dim)]'"
                  @click="form.sides = 'DUPLEX'"
                >
                  Double-sided
                </button>
              </div>
            </div>

            <!-- Finishing -->
            <div v-if="finishingRates.length" class="space-y-1.5">
              <label class="block text-sm font-medium text-[var(--p-text-dim)]">Finishing</label>
              <div class="max-h-28 overflow-y-auto rounded-lg border border-[var(--p-border)] p-2 space-y-1">
                <label
                  v-for="fr in finishingRates"
                  :key="fr.id"
                  class="flex items-center gap-3 rounded-lg px-3 py-2 cursor-pointer transition-colors hover:bg-[var(--p-surface-sunken)]"
                >
                  <UCheckbox
                    :model-value="form.finishings.some(f => f.finishing_rate === fr.id)"
                    @update:model-value="toggleFinishing(fr.id, $event)"
                  />
                  <span class="text-sm flex-1">{{ fr.name }}</span>
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

            <!-- Price section -->
            <div
              class="rounded-xl border border-flamingo-200 dark:border-flamingo-800/50 bg-flamingo-50/50 dark:bg-flamingo-900/10 p-4 space-y-3"
            >
              <div class="flex justify-between gap-2">
                <p class="text-xs font-semibold uppercase tracking-wider text-flamingo-600 dark:text-flamingo-400">
                  Quote Summary
                </p>
                <UBadge v-if="isDemoMode" variant="soft" color="warning" size="xs">Demo mode</UBadge>
              </div>

              <div v-if="calculating" class="flex items-center gap-2 text-sm text-[var(--p-text-muted)]">
                <UIcon name="i-lucide-loader-2" class="h-4 w-4 animate-spin" />
                Calculating...
              </div>

              <template v-else-if="priceResult">
                <div class="flex justify-between items-baseline">
                  <span class="font-semibold text-[var(--p-text)]">Suggested price</span>
                  <span class="text-xl font-bold text-flamingo-600 dark:text-flamingo-400">
                    {{ formatKES(totalPrice) }}
                  </span>
                </div>
                <div class="border-t border-flamingo-200/60 dark:border-flamingo-800/30 pt-3 mt-3">
                  <table class="w-full text-sm">
                    <tbody class="divide-y divide-[var(--p-border-dim)]">
                      <tr v-for="row in breakdownRows" :key="row.label">
                        <td class="py-1.5 text-[var(--p-text-muted)]">{{ row.label }}</td>
                        <td class="py-1.5 text-right font-medium">{{ formatKES(row.amount) }}</td>
                      </tr>
                    </tbody>
                  </table>
                  <div class="flex justify-between pt-2 mt-2 border-t border-[var(--p-border)]">
                    <span class="font-semibold">Total</span>
                    <span class="font-bold text-flamingo-600 dark:text-flamingo-400">{{ formatKES(totalPrice) }}</span>
                  </div>
                </div>
                <p v-if="isDemoMode" class="text-xs text-[var(--p-text-muted)] italic mt-2">
                  Demo pricing. Actual quote will be provided by the shop.
                </p>
              </template>
            </div>

            <!-- Actions -->
            <div class="flex gap-3 pt-2">
              <UButton variant="soft" color="neutral" class="flex-1" @click="close">
                Close
              </UButton>
              <template v-if="product.shop">
                <UButton
                  color="primary"
                  class="flex-1"
                  :loading="submitting"
                  :disabled="!isLoggedIn"
                  @click="handleAddToQuote"
                >
                  <UIcon name="i-lucide-plus" class="h-4 w-4 mr-1" />
                  {{ isLoggedIn ? 'Add to Quote' : 'Sign in to add' }}
                </UButton>
                <UButton
                  v-if="isLoggedIn"
                  variant="outline"
                  color="primary"
                  @click="goToDraft"
                >
                  <UIcon name="i-lucide-file-text" class="h-4 w-4 mr-1" />
                  View Draft
                </UButton>
              </template>
              <NuxtLink v-else to="/shops" class="flex-1" @click="close">
                <UButton color="primary" variant="outline" class="w-full">
                  <UIcon name="i-lucide-store" class="h-4 w-4 mr-1" />
                  Browse Shops
                </UButton>
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
