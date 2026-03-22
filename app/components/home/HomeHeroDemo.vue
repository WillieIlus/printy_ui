<template>
  <div id="demo" class="scroll-mt-24">
    <div class="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-2xl backdrop-blur-xl sm:p-6">
      <p class="mb-4 text-xs font-semibold uppercase tracking-wider text-flamingo-300">
        Live pricing demo
      </p>

      <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
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
            <label class="mb-1 block text-xs font-medium text-gray-400">Finishing services</label>
            <div class="space-y-2">
              <div
                v-for="group in finishingGroups"
                :key="group.label"
                class="rounded-lg border border-white/10 bg-white/5 p-2"
              >
                <p class="mb-1.5 text-[10px] font-medium uppercase tracking-wider text-gray-500">{{ group.label }}</p>
                <div class="flex flex-wrap gap-1.5">
                  <button
                    v-for="option in group.options"
                    :key="option.id"
                    type="button"
                    :class="[
                      'rounded-md border px-2.5 py-1 text-xs font-medium transition-colors',
                      selectedFinishingIds.includes(option.id)
                        ? 'border-flamingo-500/50 bg-flamingo-500/30 text-flamingo-200'
                        : 'border-white/10 bg-white/5 text-gray-400 hover:border-white/20 hover:text-gray-300',
                    ]"
                    @click="toggleFinishing(option.id)"
                  >
                    {{ option.label }}
                  </button>
                </div>
              </div>
            </div>
            <p v-if="hasLaminationOptions" class="mt-2 text-[10px] text-gray-500">
              Lamination options are exclusive. Pick one lamination finish only when needed.
            </p>
          </div>
        </div>

        <div class="flex flex-col justify-between">
          <div>
            <div class="mb-3 rounded-xl border border-flamingo-500/30 bg-flamingo-500/10 p-4">
              <p class="mb-1 text-xs text-gray-400">Estimated total</p>
              <p class="text-3xl font-bold text-flamingo-400">{{ formatKES(total) }}</p>
              <p class="mt-1 text-xs text-gray-500">{{ formatKES(perUnit) }} per unit</p>
              <p class="mt-1.5 text-[10px] text-gray-500">{{ totalHelperLine }}</p>
            </div>

            <div class="mb-3 grid grid-cols-2 gap-2">
              <div class="rounded-lg border border-white/10 bg-white/5 p-3">
                <p class="mb-1 text-xs text-gray-400">Print cost</p>
                <p class="text-sm font-semibold text-white">{{ formatKES(printCost) }}</p>
              </div>
              <div class="rounded-lg border border-white/10 bg-white/5 p-3">
                <p class="mb-1 text-xs text-gray-400">Finishing total</p>
                <p class="text-sm font-semibold text-white">{{ finishTotal > 0 ? formatKES(finishTotal) : 'None' }}</p>
              </div>
            </div>

            <div v-if="finishingBreakdown.length" class="mb-3 rounded-lg border border-white/10 bg-white/5 p-3">
              <p class="mb-2 text-[10px] font-medium uppercase tracking-wider text-gray-500">Finishing breakdown</p>
              <div class="space-y-1">
                <div
                  v-for="line in finishingBreakdown"
                  :key="line.id"
                  class="flex items-center justify-between text-xs"
                >
                  <span class="text-gray-400">{{ line.label }}</span>
                  <span class="font-medium text-gray-200">{{ formatKES(line.cost) }}</span>
                </div>
              </div>
            </div>

            <div class="mb-3 grid grid-cols-2 gap-2">
              <div class="rounded-lg border border-white/10 bg-white/5 p-3">
                <p class="mb-1 text-xs text-gray-400">Turnaround</p>
                <p class="text-sm font-semibold text-white">{{ turnaround }}</p>
              </div>
              <div class="rounded-lg border border-white/10 bg-white/5 p-3">
                <p class="mb-1 text-xs text-gray-400">{{ locationShopsLabel }}</p>
                <p class="text-sm font-semibold text-flamingo-400">{{ nearbyShopsCount }} shops</p>
                <p v-if="locationMeta?.deliveryMode" class="mt-0.5 text-[10px] text-gray-500">
                  {{ locationMeta.deliveryMode }}
                </p>
              </div>
            </div>

            <p v-if="locationMeta?.serviceNote" class="mb-3 text-[10px] text-gray-500">
              {{ locationMeta.serviceNote }}
            </p>

            <div v-if="outputSummaryLines.length" class="mb-3 rounded-lg border border-white/10 bg-white/5 p-3">
              <p class="mb-2 text-[10px] font-medium uppercase tracking-wider text-gray-500">Your draft</p>
              <ul class="space-y-0.5 text-xs text-gray-300">
                <li v-for="(line, index) in outputSummaryLines" :key="index">{{ line }}</li>
              </ul>
            </div>

            <div v-if="qtyNum < 500" class="mb-3 rounded-lg border border-flamingo-500/30 bg-flamingo-500/10 px-3 py-2">
              <p class="text-xs font-medium text-flamingo-200">
                Quantity below 500 - per-unit cost is higher. Consider 500+ for better pricing.
              </p>
            </div>
          </div>

          <div class="mt-4 flex flex-col gap-3">
            <NuxtLink
              :to="primaryCtaTo"
              class="inline-flex w-full items-center justify-center rounded-xl bg-flamingo-500 py-3 text-sm font-semibold text-white shadow-lg transition-colors hover:bg-flamingo-600"
            >
              {{ primaryCtaLabel }}
            </NuxtLink>
            <NuxtLink
              :to="secondaryCtaTo"
              class="inline-flex w-full items-center justify-center rounded-xl border border-white/30 bg-white/5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-white/10"
            >
              {{ secondaryCtaLabel }}
            </NuxtLink>
            <NuxtLink
              :to="tertiaryCtaTo"
              class="text-center text-xs text-gray-400 transition-colors hover:text-flamingo-400"
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
  getHeroLocationMeta,
  getHeroLocationOptions,
} from '~/components/home/heroLocationMetadata'
import {
  getGsmOptionsForProduct,
  getProductConfig,
  getQtyOptionsForProduct,
  getSizeOptionsForProduct,
} from '~/components/home/heroProductConfig'

const locationOptions = getHeroLocationOptions()

const locationSelectItems = locationOptions.map((location) => ({
  value: location.slug,
  label: location.label,
}))

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

const selectMenuUi = {
  base: 'w-full rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-sm text-white focus:ring-2 focus:ring-flamingo-500/50',
  content: '!bg-gray-900 !border-gray-600 !text-gray-100 [&_*]:!text-gray-100 [&_input]:!bg-gray-900 [&_input]:!text-gray-100 [&_input]:placeholder:!text-gray-400',
  item: '!text-gray-100 data-highlighted:!text-white',
  itemLabel: '!text-gray-100',
}

const rates: Record<string, { base: number; turnaround: string }> = {
  business_cards: { base: 1.8, turnaround: '1-2 days' },
  flyers: { base: 1.2, turnaround: 'Same day' },
  brochures: { base: 3.5, turnaround: '2-3 days' },
  stickers: { base: 2.8, turnaround: '1-2 days' },
  banners: { base: 8.0, turnaround: '2-3 days' },
  receipt_books: { base: 6.0, turnaround: '3-5 days' },
}

const gsmMult: Record<number, number> = {
  80: 0.8,
  100: 1.0,
  130: 1.1,
  150: 1.2,
  250: 1.35,
  300: 1.5,
  350: 1.7,
}

const sizeMult: Record<string, number> = {
  a4: 1.0,
  a5: 0.65,
  a6: 0.5,
  a7: 0.35,
  bcards: 0.35,
  letter: 1.05,
  dl: 0.55,
  a3: 1.6,
  custom: 1.2,
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
const selectedFinishingIds = ref<string[]>([])

const sizeOptionsForProduct = computed(() => getSizeOptionsForProduct(product.value))
const qtyOptionsForProduct = computed(() => getQtyOptionsForProduct(product.value))
const qtySelectItems = computed(() =>
  qtyOptionsForProduct.value.map((value) => ({ value, label: value.toLocaleString() })),
)
const gsmOptionsForProduct = computed(() => getGsmOptionsForProduct(product.value))
const gsmSelectItems = computed(() =>
  gsmOptionsForProduct.value.map((value) => ({ value, label: `${value} gsm` })),
)

const availableFinishingForProduct = computed(() => {
  const config = getProductConfig(product.value)
  const allowedIds = config?.finishingIds
  if (!allowedIds?.length) {
    return HERO_FINISHING_SERVICES.filter((service) => appliesToProduct(service, product.value))
  }
  return HERO_FINISHING_SERVICES.filter((service) =>
    allowedIds.includes(service.id) && appliesToProduct(service, product.value),
  )
})

const finishingGroups = computed(() => {
  const relevant = availableFinishingForProduct.value
  const lamination = relevant.filter((service) => service.id.startsWith('lamination_'))
  const other = relevant.filter((service) => !service.id.startsWith('lamination_'))
  const groups: Array<{ label: string; options: HeroFinishingService[] }> = []
  if (lamination.length) groups.push({ label: 'Lamination', options: lamination })
  if (other.length) groups.push({ label: 'Other finishing', options: other })
  return groups
})

const hasLaminationOptions = computed(() =>
  finishingGroups.value.some((group) => group.label === 'Lamination'),
)

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
  const service = HERO_FINISHING_SERVICES.find((entry) => entry.id === id)
  if (!service) return

  if (selectedFinishingIds.value.includes(id)) {
    selectedFinishingIds.value = selectedFinishingIds.value.filter((entry) => entry !== id)
    return
  }

  let nextSelection = [...selectedFinishingIds.value]
  if (service.family) {
    nextSelection = nextSelection.filter((selectedId) => {
      const selected = HERO_FINISHING_SERVICES.find((entry) => entry.id === selectedId)
      return selected?.family !== service.family
    })
  }

  selectedFinishingIds.value = [...nextSelection, id]
}

const copiesPerSheet = computed(() => {
  if (size.value === 'bcards') return 10
  if (size.value === 'a6') return 4
  if (size.value === 'a7') return 8
  if (size.value === 'dl') return 3
  return 2
})

const qtyNum = computed(() =>
  (typeof qty.value === 'string' ? parseInt(qty.value, 10) : qty.value) || 500,
)
const sheetsEst = computed(() => Math.max(1, Math.ceil(qtyNum.value / copiesPerSheet.value)))

const printCost = computed(() => {
  const rate = rates[product.value] ?? rates.business_cards
  const colorValue = typeof color.value === 'string' ? parseFloat(color.value) : color.value
  const sidesValue = typeof sides.value === 'string' ? parseInt(sides.value, 10) : sides.value
  const gsmValue = typeof gsm.value === 'string' ? parseInt(gsm.value, 10) : gsm.value

  const base =
    rate.base *
    qtyNum.value *
    (gsmMult[gsmValue] ?? 1.5) *
    (sizeMult[size.value] ?? 1) *
    (colorValue || 1) *
    (sidesMult[sidesValue] ?? 1.75)

  return Math.round(base)
})

const finishingBreakdown = computed(() => {
  const lines: { id: string; label: string; cost: number }[] = []
  for (const id of selectedFinishingIds.value) {
    const service = HERO_FINISHING_SERVICES.find((entry) => entry.id === id)
    if (!service || !appliesToProduct(service, product.value)) continue
    const cost = computeServiceCost(service, sheetsEst.value, qtyNum.value)
    lines.push({ id: service.id, label: service.label, cost })
  }
  return lines
})

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

const primaryCtaTo = computed(() => `/locations/${locationSlug.value}`)
const primaryCtaLabel = computed(() => {
  const label = locationMeta.value?.label ?? 'your area'
  return `Find shops in ${label}`
})

const secondaryCtaTo = '/shops'
const secondaryCtaLabel = 'Request this quote'
const tertiaryCtaTo = '/shops'
const tertiaryCtaLabel = 'Compare print shops'

const productLabel = computed(() =>
  productOptions.find((entry) => entry.value === product.value)?.label ?? product.value,
)
const sizeLabel = computed(() =>
  sizeOptionsForProduct.value.find((entry) => entry.value === size.value)?.label ?? size.value,
)
const colorLabel = computed(() => {
  const value = typeof color.value === 'string' ? parseFloat(color.value) : color.value
  if (value >= 1) return 'Full colour'
  if (value >= 0.6) return '1 colour'
  return 'B&W'
})

const selectedFinishingLabels = computed(() =>
  selectedFinishingIds.value
    .map((id) => HERO_FINISHING_SERVICES.find((service) => service.id === id)?.label)
    .filter(Boolean) as string[],
)

const outputSummaryLines = computed(() => {
  const lines: string[] = []
  const locationLabel = locationMeta.value?.label ?? 'your area'
  lines.push(`${qtyNum.value.toLocaleString()} ${sizeLabel.value} ${productLabel.value.toLowerCase()}`)
  lines.push(`${colorLabel.value} - ${sides.value === 2 ? 'double-sided' : 'single-sided'} - ${gsm.value} gsm`)
  if (selectedFinishingLabels.value.length) {
    lines.push(selectedFinishingLabels.value.join(' - '))
  }
  lines.push(`Available from ${nearbyShopsCount.value} shops in ${locationLabel}`)
  return lines
})

const totalHelperLine = computed(() => {
  const locationLabel = locationMeta.value?.label ?? 'your area'
  return `Compare shops serving ${locationLabel}`
})

function formatKES(value: number): string {
  return `KES ${Math.round(value).toLocaleString('en-KE')}`
}
</script>
