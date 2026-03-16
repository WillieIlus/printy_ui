<template>
  <div id="demo" class="scroll-mt-24">
    <div class="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-5 sm:p-6 shadow-2xl">
      <p class="text-xs font-semibold uppercase tracking-wider text-flamingo-300 mb-4">
        Live pricing demo
      </p>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- LEFT: Inputs -->
        <div class="space-y-3">
          <UFormField label="Pickup / Delivery location" :ui="{ label: 'text-xs font-medium text-gray-400' }">
            <USelectMenu
              v-model="locationSlug"
              :items="locationSelectItems"
              value-key="value"
              :ui="selectMenuUi"
              portal
              class="w-full"
            />
          </UFormField>
          <div class="grid grid-cols-2 gap-3">
            <UFormField label="Product" :ui="{ label: 'text-xs font-medium text-gray-400' }">
              <USelectMenu
                v-model="product"
                :items="productOptions"
                value-key="value"
                :ui="selectMenuUi"
                portal
                class="w-full"
              />
            </UFormField>
            <UFormField label="Quantity" :ui="{ label: 'text-xs font-medium text-gray-400' }">
              <USelectMenu
                v-model="qty"
                :items="qtySelectItems"
                value-key="value"
                :ui="selectMenuUi"
                portal
                class="w-full"
              />
            </UFormField>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <UFormField label="Size" :ui="{ label: 'text-xs font-medium text-gray-400' }">
              <USelectMenu
                v-model="size"
                :items="sizeOptionsForProduct"
                value-key="value"
                :ui="selectMenuUi"
                portal
                class="w-full"
              />
            </UFormField>
            <UFormField label="Print sides" :ui="{ label: 'text-xs font-medium text-gray-400' }">
              <USelectMenu
                v-model="sides"
                :items="sidesOptions"
                value-key="value"
                :ui="selectMenuUi"
                portal
                class="w-full"
              />
            </UFormField>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <UFormField label="Grammage (GSM)" :ui="{ label: 'text-xs font-medium text-gray-400' }">
              <USelectMenu
                v-model="gsm"
                :items="gsmSelectItems"
                value-key="value"
                :ui="selectMenuUi"
                portal
                class="w-full"
              />
            </UFormField>
            <UFormField label="Colour mode" :ui="{ label: 'text-xs font-medium text-gray-400' }">
              <USelectMenu
                v-model="color"
                :items="colorOptions"
                value-key="value"
                :ui="selectMenuUi"
                portal
                class="w-full"
              />
            </UFormField>
          </div>

          <div>
            <label class="block text-xs font-medium text-gray-400 mb-1">Finishing services</label>
            <div class="space-y-2">
              <div
                v-for="group in finishingGroups"
                :key="group.label"
                class="rounded-lg border border-white/10 bg-white/5 p-2"
              >
                <p class="text-[10px] font-medium text-gray-500 uppercase tracking-wider mb-1.5">{{ group.label }}</p>
                <div class="flex flex-wrap gap-1.5">
                  <button
                    v-for="f in group.options"
                    :key="f.id"
                    type="button"
                    :class="[
                      'px-2.5 py-1 rounded-md text-xs font-medium transition-colors',
                      selectedFinishingIds.includes(f.id)
                        ? 'bg-flamingo-500/30 text-flamingo-200 border border-flamingo-500/50'
                        : 'bg-white/5 text-gray-400 border border-white/10 hover:border-white/20 hover:text-gray-300',
                    ]"
                    @click="toggleFinishing(f.id)"
                  >
                    {{ f.label }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- RIGHT: Output -->
        <div class="flex flex-col justify-between">
          <div>
            <div class="rounded-xl border border-flamingo-500/30 bg-flamingo-500/10 p-4 mb-3">
              <p class="text-xs text-gray-400 mb-1">Estimated total</p>
              <p class="text-3xl font-bold text-flamingo-400">
                {{ formatKES(total) }}
              </p>
              <p class="text-xs text-gray-500 mt-1">
                {{ formatKES(perUnit) }} per unit
              </p>
              <p class="text-[10px] text-gray-500 mt-1.5">
                {{ totalHelperLine }}
              </p>
            </div>
            <div class="grid grid-cols-2 gap-2 mb-3">
              <div class="rounded-lg border border-white/10 bg-white/5 p-3">
                <p class="text-xs text-gray-400 mb-1">Print cost</p>
                <p class="text-sm font-semibold text-white">{{ formatKES(printCost) }}</p>
              </div>
              <div class="rounded-lg border border-white/10 bg-white/5 p-3">
                <p class="text-xs text-gray-400 mb-1">Finishing total</p>
                <p class="text-sm font-semibold text-white">{{ finishTotal > 0 ? formatKES(finishTotal) : 'None' }}</p>
              </div>
            </div>
            <div v-if="finishingBreakdown.length" class="rounded-lg border border-white/10 bg-white/5 p-3 mb-3">
              <p class="text-[10px] font-medium text-gray-500 uppercase tracking-wider mb-2">Finishing breakdown</p>
              <div class="space-y-1">
                <div
                  v-for="line in finishingBreakdown"
                  :key="line.id"
                  class="flex justify-between items-center text-xs"
                >
                  <span class="text-gray-400">{{ line.label }}</span>
                  <span class="text-gray-200 font-medium">{{ formatKES(line.cost) }}</span>
                </div>
              </div>
            </div>
            <div class="grid grid-cols-2 gap-2 mb-3">
              <div class="rounded-lg border border-white/10 bg-white/5 p-3">
                <p class="text-xs text-gray-400 mb-1">Turnaround</p>
                <p class="text-sm font-semibold text-white">{{ turnaround }}</p>
              </div>
              <div class="rounded-lg border border-white/10 bg-white/5 p-3">
                <p class="text-xs text-gray-400 mb-1">{{ locationShopsLabel }}</p>
                <p class="text-sm font-semibold text-flamingo-400">{{ nearbyShopsCount }} shops</p>
                <p v-if="locationMeta?.deliveryMode" class="text-[10px] text-gray-500 mt-0.5">{{ locationMeta.deliveryMode }}</p>
              </div>
            </div>
            <p v-if="locationMeta?.serviceNote" class="text-[10px] text-gray-500 mb-3">
              {{ locationMeta.serviceNote }}
            </p>
            <div v-if="outputSummaryLines.length" class="rounded-lg border border-white/10 bg-white/5 p-3 mb-3">
              <p class="text-[10px] font-medium text-gray-500 uppercase tracking-wider mb-2">Your quote</p>
              <ul class="space-y-0.5 text-xs text-gray-300">
                <li v-for="(line, i) in outputSummaryLines" :key="i">{{ line }}</li>
              </ul>
            </div>
            <div v-if="qtyNum < 500" class="rounded-lg border border-flamingo-500/30 bg-flamingo-500/10 px-3 py-2 mb-3">
              <p class="text-xs text-flamingo-200 font-medium">
                ⚠ Quantity below 500 — per-unit cost is higher. Consider 500+ for better pricing.
              </p>
            </div>
          </div>
          <div class="flex flex-col gap-3 mt-4">
            <NuxtLink
              :to="primaryCtaTo"
              class="w-full inline-flex items-center justify-center bg-flamingo-500 hover:bg-flamingo-600 text-white font-semibold py-3 rounded-xl text-sm transition-colors shadow-lg"
            >
              {{ primaryCtaLabel }}
            </NuxtLink>
            <NuxtLink
              :to="secondaryCtaTo"
              class="w-full inline-flex items-center justify-center border border-white/30 bg-white/5 hover:bg-white/10 text-white font-medium py-2.5 rounded-xl text-sm transition-colors"
            >
              {{ secondaryCtaLabel }}
            </NuxtLink>
            <NuxtLink
              :to="tertiaryCtaTo"
              class="text-center text-xs text-gray-400 hover:text-flamingo-400 transition-colors"
            >
              {{ tertiaryCtaLabel }}
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  HERO_FINISHING_SERVICES,
  appliesToProduct,
  computeServiceCost,
  type HeroFinishingService,
} from '~/components/home/heroFinishingServices'
import {
  getHeroLocationOptions,
  getHeroLocationMeta,
} from '~/components/home/heroLocationMetadata'
import {
  getProductConfig,
  getSizeOptionsForProduct,
  getGsmOptionsForProduct,
  getQtyOptionsForProduct,
} from '~/components/home/heroProductConfig'

const locationOptions = getHeroLocationOptions()

const locationSelectItems = locationOptions.map((l) => ({ value: l.slug, label: l.label }))

const productOptions = [
  { value: 'business_cards', label: 'Business cards' },
  { value: 'flyers', label: 'Flyers' },
  { value: 'brochures', label: 'Brochures' },
  { value: 'stickers', label: 'Stickers' },
  { value: 'banners', label: 'Banners' },
  { value: 'receipt_books', label: 'Receipt books' },
]

const sidesOptions = [
  { value: 1 as const, label: '1-sided (simplex)' },
  { value: 2 as const, label: '2-sided (duplex)' },
]

const colorOptions = [
  { value: 1, label: 'Full colour' },
  { value: 0.6, label: '1 colour' },
  { value: 0.5, label: 'B&W' },
]

/** Dark hero styling for select menus — ensures dropdown text is visible on dark bg. */
const selectMenuUi = {
  base: 'w-full rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-sm text-white focus:ring-2 focus:ring-flamingo-500/50',
  content: '!bg-gray-900 !border-gray-600 !text-gray-100 [&_*]:!text-gray-100 [&_input]:!bg-gray-900 [&_input]:!text-gray-100 [&_input]:placeholder:!text-gray-400',
  item: '!text-gray-100 data-highlighted:!text-white',
  itemLabel: '!text-gray-100',
}

const rates: Record<string, { base: number; turnaround: string }> = {
  business_cards: { base: 1.8, turnaround: '1–2 days' },
  flyers: { base: 1.2, turnaround: 'Same day' },
  brochures: { base: 3.5, turnaround: '2–3 days' },
  stickers: { base: 2.8, turnaround: '1–2 days' },
  banners: { base: 8.0, turnaround: '2–3 days' },
  receipt_books: { base: 6.0, turnaround: '3–5 days' },
}

const gsmMult: Record<number, number> = {
  80: 0.8, 100: 1.0, 130: 1.1, 150: 1.2, 250: 1.35, 300: 1.5, 350: 1.7,
}

const sizeMult: Record<string, number> = {
  a4: 1.0, a5: 0.65, a6: 0.5, a7: 0.35, bcards: 0.35, letter: 1.05, dl: 0.55, a3: 1.6, custom: 1.2,
}

const sidesMult: Record<number, number> = { 1: 1.0, 2: 1.75 }

const locationSlug = ref('cbd')
const product = ref('business_cards')
const initialConfig = getProductConfig('business_cards')
const qty = ref(initialConfig?.defaultQty ?? 500)
const size = ref(initialConfig?.defaultSize ?? 'bcards')
const sides = ref(initialConfig?.defaultSides ?? 2)
const gsm = ref(initialConfig?.defaultGsm ?? 300)
const color = ref(1)
/** Calculator state: array of selected finishing service ids. */
const selectedFinishingIds = ref<string[]>([])

/** Product-aware size options. */
const sizeOptionsForProduct = computed(() => getSizeOptionsForProduct(product.value))

/** Product-aware quantity options. */
const qtyOptionsForProduct = computed(() => getQtyOptionsForProduct(product.value))

const qtySelectItems = computed(() =>
  qtyOptionsForProduct.value.map((n) => ({ value: n, label: n.toLocaleString() })),
)

/** Product-aware GSM options. */
const gsmOptionsForProduct = computed(() => getGsmOptionsForProduct(product.value))

const gsmSelectItems = computed(() =>
  gsmOptionsForProduct.value.map((g) => ({ value: g, label: `${g} gsm` })),
)

/** Product-aware finishing: only services allowed for this product. */
const availableFinishingForProduct = computed(() => {
  const config = getProductConfig(product.value)
  const allowedIds = config?.finishingIds
  if (!allowedIds?.length) return HERO_FINISHING_SERVICES.filter((s) => appliesToProduct(s, product.value))
  return HERO_FINISHING_SERVICES.filter((s) => allowedIds.includes(s.id) && appliesToProduct(s, product.value))
})

const finishingGroups = computed(() => {
  const relevant = availableFinishingForProduct.value
  const lamination = relevant.filter((s) => s.id.startsWith('lamination_'))
  const other = relevant.filter((s) => !s.id.startsWith('lamination_'))
  const groups: { label: string; options: HeroFinishingService[] }[] = []
  if (lamination.length) groups.push({ label: 'Lamination', options: lamination })
  if (other.length) groups.push({ label: 'Other finishing', options: other })
  return groups
})

/** Apply product defaults when product changes. */
watch(product, (newProduct) => {
  const config = getProductConfig(newProduct)
  if (!config) return
  size.value = config.defaultSize
  qty.value = config.defaultQty
  sides.value = config.defaultSides
  gsm.value = config.defaultGsm
  selectedFinishingIds.value = selectedFinishingIds.value.filter((id) =>
    config.finishingIds.includes(id),
  )
}, { immediate: false })

function toggleFinishing(id: string) {
  if (selectedFinishingIds.value.includes(id)) {
    selectedFinishingIds.value = selectedFinishingIds.value.filter((x) => x !== id)
  } else {
    selectedFinishingIds.value = [...selectedFinishingIds.value, id]
  }
}

const copiesPerSheet = computed(() => {
  if (size.value === 'bcards') return 10
  if (size.value === 'a6') return 4
  if (size.value === 'a7') return 8
  if (size.value === 'dl') return 3
  return 2
})

const qtyNum = computed(() => (typeof qty.value === 'string' ? parseInt(qty.value, 10) : qty.value) || 500)
const sheetsEst = computed(() => Math.max(1, Math.ceil(qtyNum.value / copiesPerSheet.value)))

const printCost = computed(() => {
  const r = rates[product.value] ?? rates.business_cards
  const colorVal = typeof color.value === 'string' ? parseFloat(color.value) : color.value
  const sidesVal = typeof sides.value === 'string' ? parseInt(sides.value, 10) : sides.value
  const gsmVal = typeof gsm.value === 'string' ? parseInt(gsm.value, 10) : gsm.value
  const base =
    r.base *
    qtyNum.value *
    (gsmMult[gsmVal] ?? 1.5) *
    (sizeMult[size.value] ?? 1) *
    (colorVal || 1) *
    (sidesMult[sidesVal] ?? 1.75)
  return Math.round(base)
})

/** Per-service finishing cost breakdown. Derived from selected ids. */
const finishingBreakdown = computed(() => {
  const lines: { id: string; label: string; cost: number }[] = []
  for (const id of selectedFinishingIds.value) {
    const service = HERO_FINISHING_SERVICES.find((s) => s.id === id)
    if (!service || !appliesToProduct(service, product.value)) continue
    const cost = computeServiceCost(service, sheetsEst.value, qtyNum.value)
    lines.push({ id: service.id, label: service.label, cost })
  }
  return lines
})

/** Total finishing cost — sum of breakdown. Derived, not stored. */
const finishTotal = computed(() =>
  Math.round(finishingBreakdown.value.reduce((sum, line) => sum + line.cost, 0)),
)

const total = computed(() => printCost.value + finishTotal.value)
const perUnit = computed(() => (qtyNum.value > 0 ? total.value / qtyNum.value : 0))
const turnaround = computed(() => (rates[product.value] ?? rates.business_cards).turnaround)

const locationMeta = computed(() => getHeroLocationMeta(locationSlug.value))

const nearbyShopsCount = computed(() => locationMeta.value?.shops ?? 0)

const locationShopsLabel = computed(() => {
  const label = locationMeta.value?.label ?? 'your area'
  return `Shops in ${label}`
})

/** Primary: discovery — find shops in selected location. */
const primaryCtaTo = computed(() => `/locations/${locationSlug.value}`)
const primaryCtaLabel = computed(() => {
  const label = locationMeta.value?.label ?? 'your area'
  return `Find shops in ${label}`
})

/** Secondary: quote request — aligned with calculator config. */
const secondaryCtaTo = '/shops'
const secondaryCtaLabel = 'Request this quote'

/** Tertiary: shop comparison — optional text link. */
const tertiaryCtaTo = '/shops'
const tertiaryCtaLabel = 'Compare print shops'

const productLabel = computed(() => productOptions.find((p) => p.value === product.value)?.label ?? product.value)
const sizeLabel = computed(() => sizeOptionsForProduct.value.find((s) => s.value === size.value)?.label ?? size.value)
const colorLabel = computed(() => {
  const v = typeof color.value === 'string' ? parseFloat(color.value) : color.value
  if (v >= 1) return 'Full colour'
  if (v >= 0.6) return '1 colour'
  return 'B&W'
})

const selectedFinishingLabels = computed(() =>
  selectedFinishingIds.value
    .map((id) => HERO_FINISHING_SERVICES.find((s) => s.id === id)?.label)
    .filter(Boolean) as string[],
)

/** Concise output summary — proves Printy is useful beyond arithmetic. */
const outputSummaryLines = computed(() => {
  const lines: string[] = []
  const locLabel = locationMeta.value?.label ?? 'your area'
  lines.push(`${qtyNum.value.toLocaleString()} ${sizeLabel.value} ${productLabel.value.toLowerCase()}`)
  lines.push(`${colorLabel.value} · ${sides.value === 2 ? 'double-sided' : 'single-sided'} · ${gsm.value} gsm`)
  if (selectedFinishingLabels.value.length) {
    lines.push(selectedFinishingLabels.value.join(' · '))
  }
  lines.push(`Available from ${nearbyShopsCount.value} shops in ${locLabel}`)
  return lines
})

/** Helper under total — reinforces discovery. */
const totalHelperLine = computed(() => {
  const locLabel = locationMeta.value?.label ?? 'your area'
  return `Compare shops serving ${locLabel}`
})

function formatKES(n: number): string {
  return `KES ${Math.round(n).toLocaleString('en-KE')}`
}

</script>
