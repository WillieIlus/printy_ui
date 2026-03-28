<template>
  <QuotesQuoteConfigModal
    :open="open"
    eyebrow="Product Gallery"
    :title="`Configure ${product.title}`"
    description="Use the same quote configuration flow before adding this product to a draft."
    size="lg"
    @update:open="setOpen"
  >
    <div class="space-y-4 sm:space-y-5">
      <QuotesQuoteConfigSection title="Product" description="Gallery product details before configuration.">
        <div class="flex items-center gap-4 rounded-xl bg-[var(--p-surface)] p-4">
          <div
            v-if="imageUrl"
            class="h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-[var(--p-border)]"
          >
            <img :src="imageUrl" :alt="product.title" class="h-full w-full object-cover">
          </div>
          <div
            v-else
            class="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-[var(--p-border)]"
          >
            <UIcon name="i-lucide-package" class="h-8 w-8 text-[var(--p-text-muted)]" />
          </div>
          <div class="min-w-0 flex-1">
            <p class="truncate text-base font-semibold text-[var(--p-text)]">{{ product.title }}</p>
            <p class="mt-1 text-xs text-[var(--p-text-muted)]">{{ category.name }}</p>
            <div class="mt-2 flex flex-wrap gap-1.5">
              <UBadge v-if="product.dimensions_label" variant="soft" color="neutral" size="xs">{{ product.dimensions_label }}</UBadge>
              <UBadge v-if="product.weight_label" variant="soft" color="neutral" size="xs">{{ product.weight_label }}</UBadge>
            </div>
          </div>
        </div>
      </QuotesQuoteConfigSection>

      <QuotesQuoteConfigSection v-if="optionsLoading" title="Loading" description="Preparing available options for this product.">
        <div class="flex flex-col items-center justify-center py-12 text-[var(--p-text-muted)]">
          <UIcon name="i-lucide-loader-2" class="mb-3 h-8 w-8 animate-spin" />
          <p class="text-sm">Loading options…</p>
        </div>
      </QuotesQuoteConfigSection>

      <form v-else class="space-y-4 sm:space-y-5" @submit.prevent="handleAddToQuote">
        <QuotesQuoteConfigSection title="Specifications" description="Use the same configuration controls available from shop and draft flows.">
          <div class="space-y-5">
            <div>
              <label class="mb-1.5 block text-sm font-medium text-[var(--p-text-dim)]">Quantity</label>
              <div class="flex items-center gap-2">
                <UButton variant="soft" color="neutral" size="sm" icon="i-lucide-minus" @click="quantity = Math.max(minQuantity, quantity - 50)" />
                <UInput
                  v-model.number="quantity"
                  type="number"
                  :min="minQuantity"
                  class="w-24 text-center"
                  @blur="quantity = Math.max(minQuantity, quantity || minQuantity)"
                />
                <UButton variant="soft" color="neutral" size="sm" icon="i-lucide-plus" @click="quantity += 50" />
                <span class="text-xs text-[var(--p-text-muted)]">min {{ minQuantity }}</span>
              </div>
            </div>

            <div v-if="pricingMode === 'SHEET'" class="grid gap-5 lg:grid-cols-2">
              <div>
                <label class="mb-1.5 block text-sm font-medium text-[var(--p-text-dim)]">Sides</label>
                <div class="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    class="rounded-lg border px-3 py-2 text-sm font-medium transition-all"
                    :class="form.sides === 'SIMPLEX' ? 'border-[var(--color-primary-400)] bg-[var(--color-primary-50)] text-[var(--color-primary-700)] dark:bg-[var(--color-primary-900)]/20' : 'border-[var(--p-border)] text-[var(--p-text-dim)]'"
                    @click="form.sides = 'SIMPLEX'"
                  >
                    Single-sided
                  </button>
                  <button
                    type="button"
                    class="rounded-lg border px-3 py-2 text-sm font-medium transition-all"
                    :class="form.sides === 'DUPLEX' ? 'border-[var(--color-primary-400)] bg-[var(--color-primary-50)] text-[var(--color-primary-700)] dark:bg-[var(--color-primary-900)]/20' : 'border-[var(--p-border)] text-[var(--p-text-dim)]'"
                    @click="form.sides = 'DUPLEX'"
                  >
                    Double-sided
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
                  :class="form.machine === m.id ? 'bg-[var(--color-primary-50)] dark:bg-[var(--color-primary-900)]/20' : 'hover:bg-[var(--p-surface-sunken)]'"
                >
                  <input v-model="form.machine" type="radio" :value="m.id" class="accent-[var(--color-primary-500)]">
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
                  :class="form.paper === p.id ? 'bg-[var(--color-primary-50)] dark:bg-[var(--color-primary-900)]/20' : 'hover:bg-[var(--p-surface-sunken)]'"
                >
                  <input v-model="form.paper" type="radio" :value="p.id" class="accent-[var(--color-primary-500)]">
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
                  :class="form.material === m.id ? 'bg-[var(--color-primary-50)] dark:bg-[var(--color-primary-900)]/20' : 'hover:bg-[var(--p-surface-sunken)]'"
                >
                  <input v-model="form.material" type="radio" :value="m.id" class="accent-[var(--color-primary-500)]">
                  <span class="text-sm text-[var(--p-text)]">{{ m.material_type ?? 'Material' }}</span>
                </label>
              </div>
            </div>
          </div>
        </QuotesQuoteConfigSection>

        <QuotesQuoteConfigSection v-if="finishingRates.length" title="Finishing" description="Optional finishing for this product.">
          <div class="space-y-2">
            <label
              v-for="fr in finishingRates"
              :key="fr.id"
              class="flex items-center gap-3 rounded-xl border border-[var(--p-border)] bg-[var(--p-surface)] px-3 py-3"
            >
              <UCheckbox
                :model-value="form.finishings.some(f => f.finishing_rate === fr.id)"
                @update:model-value="toggleFinishing(fr.id, $event)"
              />
              <span class="flex-1 text-sm text-[var(--p-text)]">{{ fr.name }}</span>
            </label>
          </div>
        </QuotesQuoteConfigSection>

        <QuotesQuoteConfigNotice
          v-if="needsMachineWarning"
          tone="error"
          title="Machine not chosen"
          message="Please select a printing machine before adding this product to your quote."
        />

        <QuotesQuoteConfigSection title="Notes" description="Optional notes to send with this quote request.">
          <UTextarea
            v-model="form.special_instructions"
            placeholder="Any notes for the shop (optional)"
            :rows="3"
          />
        </QuotesQuoteConfigSection>

        <QuotesQuoteConfigSection title="Pricing" description="Live preview for the same quote configuration.">
          <div class="space-y-3">
            <div v-if="calculating" class="flex items-center gap-2 text-sm text-[var(--p-text-muted)]">
              <UIcon name="i-lucide-loader-2" class="h-4 w-4 animate-spin" />
              Calculating...
            </div>

            <template v-else-if="priceResult">
              <div class="rounded-xl border border-[var(--color-primary-200)]/70 bg-[var(--color-primary-50)]/70 p-4 dark:border-[var(--color-primary-800)]/40 dark:bg-[var(--color-primary-900)]/10">
                <div class="flex items-baseline justify-between gap-4">
                  <span class="font-semibold text-[var(--p-text)]">Estimated total</span>
                  <span class="text-xl font-bold text-[var(--color-primary-600)] dark:text-[var(--color-primary-400)]">
                    {{ formatKES(totalPrice) }}
                  </span>
                </div>
                <p v-if="isDemoMode" class="mt-2 text-xs italic text-[var(--p-text-muted)]">
                  Demo pricing fallback. Final price will come from the shop.
                </p>
              </div>
            </template>

            <p v-else class="text-sm text-[var(--p-text-muted)]">Complete the configuration to preview the estimated total.</p>
          </div>
        </QuotesQuoteConfigSection>
      </form>
    </div>

    <template #footer>
      <div class="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
        <div class="flex flex-col-reverse gap-3 sm:flex-row">
          <UButton variant="soft" color="neutral" class="sm:min-w-32" @click="close">
            Cancel
          </UButton>
          <UButton
            v-if="product.shop"
            color="primary"
            class="sm:min-w-40"
            :loading="submitting"
            :disabled="needsMachineWarning"
            @click="handleAddToQuote"
          >
            <UIcon name="i-lucide-plus" class="mr-1 h-4 w-4" />
            Add to Quote
          </UButton>
        </div>

        <div class="flex flex-col gap-3 sm:flex-row">
          <UButton
            v-if="product.shop"
            variant="outline"
            color="primary"
            @click="goToDraft"
          >
            <UIcon name="i-lucide-file-text" class="mr-1 h-4 w-4" />
            {{ isLoggedIn ? 'View Draft' : 'View Quote' }}
          </UButton>
          <NuxtLink v-else to="/shops" class="block" @click="close">
            <UButton color="primary" variant="outline" class="w-full">
              <UIcon name="i-lucide-store" class="mr-1 h-4 w-4" />
              Browse Shops
            </UButton>
          </NuxtLink>
        </div>
      </div>
    </template>
  </QuotesQuoteConfigModal>
</template>

<script setup lang="ts">
import { ref, computed, watch, reactive } from 'vue'
import type { GalleryProductDTO, GalleryCategoryDTO, GalleryCalculatePriceResponse, GalleryProductOptions } from '~/shared/types/gallery'
import type { QuoteItemFinishingPayload } from '~/services/quoteDraft'
import { getGalleryProductOptions, calculateGalleryProductPrice } from '~/shared/api/gallery'
import { usePublicApiNoAuth } from '~/shared/api'
import { getActiveDraft, tweakAndAdd } from '~/services/quoteDraft'
import { useGuestQuoteStore } from '~/stores/guestQuote'
import { formatKES } from '~/utils/formatters'

const props = defineProps<{
  open: boolean
  product: GalleryProductDTO
  category: GalleryCategoryDTO
}>()

const emit = defineEmits<{ 'update:open': [value: boolean]; close: []; added: [item: unknown] }>()

const { getMediaUrl } = useApi()
const api = useApi()
const publicApiNoAuth = usePublicApiNoAuth()
const toast = useToast()
const authStore = useAuthStore()
const guestStore = useGuestQuoteStore()

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
  machine: null as number | null,
  finishings: [] as QuoteItemFinishingPayload[],
  sides: 'DUPLEX' as 'SIMPLEX' | 'DUPLEX',
  color_mode: 'COLOR' as 'BW' | 'COLOR',
  special_instructions: '',
})

const needsMachineWarning = computed(() =>
  pricingMode.value === 'SHEET' && machines.value.length > 0 && !form.machine
)

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
const machines = computed(() => productOptions.value?.available_machines ?? [])
const pricingMode = computed(() => productOptions.value?.pricing_mode ?? 'SHEET')
const defaultSides = computed(() => (productOptions.value?.default_sides as 'SIMPLEX' | 'DUPLEX') ?? 'DUPLEX')

const imageUrl = computed(() => {
  const path = props.product.preview_image
  if (!path) return null
  if (path.startsWith('http')) return path
  return getMediaUrl(path)
})

const isLoggedIn = computed(() => !!authStore.user)

function parseDimensions(label: string | undefined): { width: number; height: number } {
  if (!label) return { width: 210, height: 297 }
  const m = label.match(/(\d+)\s*[×x]\s*(\d+)/i)
  if (m) return { width: parseInt(m[1], 10), height: parseInt(m[2], 10) }
  return { width: 210, height: 297 }
}

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
    productOptions.value = await getGalleryProductOptions(props.product.id, publicApiNoAuth)
    if (productOptions.value) {
      form.sides = defaultSides.value
      quantity.value = minQuantity.value
      if (pricingMode.value === 'SHEET' && papers.value.length && !form.paper) {
        form.paper = papers.value[0].id
      }
      if (pricingMode.value === 'SHEET' && machines.value.length && !form.machine) {
        form.machine = machines.value[0].id
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
      paper_id: form.paper ?? undefined,
      material_id: form.material ?? undefined,
      machine_id: form.machine ?? undefined,
      sides: form.sides,
      color_mode: form.color_mode,
      finishings: form.finishings.length ? form.finishings : undefined,
    }, api)
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
  const shopName = props.product.shop?.name ?? 'Shop'
  if (!shopSlug) {
    toast.add({ title: 'No shop', description: 'This product is not linked to a shop.', color: 'error' })
    return
  }
  if (!isLoggedIn.value) {
    if (needsMachineWarning.value) {
      toast.add({ title: 'Machine not chosen', description: 'Please select a printing machine to add to your quote.', color: 'error' })
      return
    }
    guestStore.addItem(shopSlug, shopName, props.product.title, {
      product: props.product.id,
      quantity: Math.max(minQuantity.value, quantity.value),
      pricing_mode: pricingMode.value,
      sides: form.sides,
      color_mode: form.color_mode,
      paper: form.paper ?? undefined,
      material: form.material ?? undefined,
      machine: form.machine ?? undefined,
      finishings: form.finishings.length ? form.finishings : undefined,
      special_instructions: form.special_instructions.trim() || undefined,
    })
    toast.add({
      title: 'Added to quote',
      description: 'Sign in when you submit to get your quote request.',
      color: 'success',
    })
    addedItem.value = { id: 'guest', product_name: props.product.title }
    emit('added', addedItem.value)
    setOpen(false)
    return
  }

  submitting.value = true
  try {
    const draft = await getActiveDraft(shopSlug, undefined, api)
    if (needsMachineWarning.value) {
      toast.add({ title: 'Machine not chosen', description: 'Please select a printing machine to add to your quote.', color: 'error' })
      return
    }
    const payload = {
      item_type: 'PRODUCT' as const,
      product: props.product.id,
      quantity: Math.max(minQuantity.value, quantity.value),
      sides: form.sides,
      color_mode: form.color_mode,
      paper: form.paper ?? undefined,
      material: form.material ?? undefined,
      machine: form.machine ?? undefined,
      finishings: form.finishings.length ? form.finishings : undefined,
      special_instructions: form.special_instructions.trim() || undefined,
    }
    const item = await tweakAndAdd(draft.id, payload, api)
    addedItem.value = item
    toast.add({
      title: 'Added to quote',
      description: `${props.product.title} added to your draft.`,
      color: 'success',
    })
    emit('added', item)
    setOpen(false)
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
  setOpen(false)
}

const totalPrice = computed(() => {
  const b = priceResult.value?.breakdown
  return b?.total ?? 0
})

function close() {
  setOpen(false)
  emit('close')
  addedItem.value = null
}

function setOpen(value: boolean) {
  emit('update:open', value)
  if (!value) {
    emit('close')
    addedItem.value = null
  }
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
      form.machine = null
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
function debouncedFetchPrice() {
  if (!props.open) return
  if (debounceTimer) clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    debounceTimer = null
    void fetchPrice()
  }, DEBOUNCE_MS)
}

watch(quantity, debouncedFetchPrice)
watch(() => [form.paper, form.material, form.machine, form.sides, form.color_mode, form.finishings], debouncedFetchPrice, { deep: true })
</script>
