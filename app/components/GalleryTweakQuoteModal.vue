<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import {
  DialogRoot,
  DialogPortal,
  DialogOverlay,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from 'reka-ui'
import type { GalleryProductDTO, GalleryCategoryDTO, GalleryCalculatePriceResponse } from '~/shared/types/gallery'
import { calculateGalleryProductPrice } from '~/shared/api/gallery'
import { formatKES } from '~/utils/formatters'

const props = defineProps<{
  open: boolean
  product: GalleryProductDTO
  category: GalleryCategoryDTO
}>()

const emit = defineEmits<{ 'update:open': [value: boolean]; close: [] }>()

const { getMediaUrl } = useApi()

const quantity = ref(100)
const calculating = ref(false)
const priceResult = ref<GalleryCalculatePriceResponse | null>(null)
const isDemoMode = ref(false)

const minQuantity = computed(() => {
  const dims = props.product.dimensions_label ?? ''
  const isSmall = /(\d+)\s*[×x]\s*(\d+)/i.test(dims)
  return isSmall ? 100 : 50
})

const imageUrl = computed(() => {
  const path = props.product.preview_image
  if (!path) return null
  if (path.startsWith('http')) return path
  return getMediaUrl(path)
})

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

function handleOpenChange(value: boolean) {
  emit('update:open', value)
  if (!value) emit('close')
}

watch(
  () => props.open,
  async (open) => {
    if (!open) {
      priceResult.value = null
      isDemoMode.value = false
      return
    }
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

const descriptionId = 'gallery-tweak-desc'
</script>

<template>
  <DialogRoot :open="open" @update:open="handleOpenChange">
    <DialogPortal to="#modal-portal">
      <DialogOverlay
        class="fixed inset-0 z-[9999] bg-black/50"
        aria-hidden
        @click="handleOpenChange(false)"
      />
      <DialogContent
        class="fixed inset-0 z-[9999] flex items-center justify-center p-0 sm:p-4 focus:outline-none"
        :aria-describedby="descriptionId"
      >
        <div
          class="relative w-full h-full sm:h-auto sm:max-h-[calc(100dvh-2rem)] sm:max-w-lg sm:rounded-2xl shadow-xl border border-[var(--p-border)] bg-[var(--p-surface)] overflow-hidden flex flex-col"
          role="document"
        >
          <div class="flex items-center justify-between p-4 sm:px-6 border-b border-[var(--p-border)] shrink-0">
            <div>
              <DialogTitle class="text-lg font-semibold text-[var(--p-text)]">
                Tweak Quote — {{ product.title }}
              </DialogTitle>
              <DialogDescription :id="descriptionId" class="mt-0.5 text-sm text-[var(--p-text-muted)]">
                Configure quantity and see the price breakdown.
              </DialogDescription>
            </div>
            <DialogClose as-child>
              <UButton icon="i-lucide-x" color="neutral" variant="soft" aria-label="Close" />
            </DialogClose>
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
              <label class="mb-1.5 block text-sm font-medium text-[var(--p-text-dim)]">
                Quantity
              </label>
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

            <!-- Price section -->
            <div
              class="rounded-xl border border-flamingo-200 dark:border-flamingo-800/50 bg-flamingo-50/50 dark:bg-flamingo-900/10 p-4 space-y-3"
            >
              <div class="flex items-center justify-between gap-2">
                <p class="text-xs font-semibold uppercase tracking-wider text-flamingo-600 dark:text-flamingo-400">
                  Quote Summary
                </p>
                <UBadge v-if="isDemoMode" variant="soft" color="warning" size="xs">
                  Demo mode
                </UBadge>
              </div>

              <div v-if="calculating" class="flex items-center gap-2 text-sm text-[var(--p-text-muted)]">
                <UIcon name="i-lucide-loader-2" class="h-4 w-4 animate-spin" />
                Calculating...
              </div>

              <template v-else-if="priceResult">
                <!-- Suggested price -->
                <div class="flex justify-between items-baseline">
                  <span class="font-semibold text-[var(--p-text)]">Suggested price</span>
                  <span class="text-xl font-bold text-flamingo-600 dark:text-flamingo-400">
                    {{ formatKES(totalPrice) }}
                  </span>
                </div>

                <!-- Breakdown table -->
                <div class="border-t border-flamingo-200/60 dark:border-flamingo-800/30 pt-3 mt-3">
                  <h4 class="text-sm font-semibold text-[var(--p-text-dim)] mb-2">Cost breakdown</h4>
                  <table class="w-full text-sm">
                    <tbody class="divide-y divide-[var(--p-border-dim)]">
                      <tr v-for="row in breakdownRows" :key="row.label">
                        <td class="py-1.5 text-[var(--p-text-muted)]">{{ row.label }}</td>
                        <td class="py-1.5 text-right font-medium text-[var(--p-text)]">
                          {{ formatKES(row.amount) }}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <div class="flex justify-between pt-2 mt-2 border-t border-[var(--p-border)]">
                    <span class="font-semibold text-[var(--p-text)]">Total</span>
                    <span class="font-bold text-flamingo-600 dark:text-flamingo-400">
                      {{ formatKES(totalPrice) }}
                    </span>
                  </div>
                </div>

                <p v-if="isDemoMode" class="text-xs text-[var(--p-text-muted)] italic">
                  Demo pricing. Actual quote will be provided by the shop.
                </p>
              </template>
            </div>

            <!-- Actions -->
            <div class="flex gap-3 pt-2">
              <UButton variant="soft" color="neutral" class="flex-1" @click="handleOpenChange(false)">
                Close
              </UButton>
              <NuxtLink
                v-if="product.shop"
                :to="`/quote-draft?shop=${product.shop.slug}`"
                class="flex-1"
                @click="handleOpenChange(false)"
              >
                <UButton color="primary" class="w-full">
                  <UIcon name="i-lucide-file-text" class="h-4 w-4 mr-1" />
                  Request Quote
                </UButton>
              </NuxtLink>
              <NuxtLink v-else to="/shops" class="flex-1" @click="handleOpenChange(false)">
                <UButton color="primary" variant="outline" class="w-full">
                  <UIcon name="i-lucide-store" class="h-4 w-4 mr-1" />
                  Browse Shops
                </UButton>
              </NuxtLink>
            </div>
          </div>
        </div>
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>
