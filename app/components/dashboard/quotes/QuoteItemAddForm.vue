<template>
  <div class="rounded-xl border border-[var(--p-border)] bg-[var(--p-surface)] p-4 space-y-4">
    <h3 class="font-semibold text-[var(--p-text)]">Add item</h3>
    <form class="space-y-4" @submit.prevent="onSubmit">
      <UFormField label="Product" required>
        <USelectMenu
          v-model="selectedProductId"
          :items="productOptions"
          value-key="value"
          placeholder="Select product"
          class="w-full"
        />
      </UFormField>
      <div class="grid grid-cols-2 gap-4">
        <UFormField label="Quantity" required :hint="`Min ${minQty} pcs`">
          <UInput
            v-model.number="form.quantity"
            type="number"
            :min="minQty"
            :placeholder="String(minQty)"
            @blur="form.quantity = Math.max(minQty, form.quantity || minQty)"
          />
        </UFormField>
        <UFormField v-if="product?.pricing_mode === 'SHEET'" label="Paper">
          <USelectMenu
            v-model="selectedPaperId"
            :items="paperOptions"
            value-key="value"
            placeholder="Select paper"
            class="w-full"
          />
        </UFormField>
      </div>
      <div v-if="product?.pricing_mode === 'SHEET'" class="grid grid-cols-2 gap-4">
        <UFormField label="Machine">
          <USelectMenu
            v-model="selectedMachineId"
            :items="machineOptions"
            value-key="value"
            placeholder="Select machine"
            class="w-full"
          />
        </UFormField>
        <UFormField label="Sides">
          <USelectMenu
            v-model="form.sides"
            :items="[{ value: 'SIMPLEX', label: 'Single' }, { value: 'DUPLEX', label: 'Double' }]"
            value-key="value"
            class="w-full"
          />
        </UFormField>
      </div>
      <div v-if="product?.pricing_mode === 'SHEET'" class="grid grid-cols-2 gap-4">
        <UFormField label="Color">
          <USelectMenu
            v-model="form.color_mode"
            :items="[{ value: 'COLOR', label: 'Color' }, { value: 'BW', label: 'B&W' }]"
            value-key="value"
            class="w-full"
          />
        </UFormField>
      </div>
      <div v-if="product?.pricing_mode === 'LARGE_FORMAT'" class="grid grid-cols-2 gap-4">
        <UFormField label="Material">
          <USelectMenu
            v-model="selectedMaterialId"
            :items="materialOptions"
            value-key="value"
            placeholder="Select material"
            class="w-full"
          />
        </UFormField>
        <UFormField label="Width (mm)">
          <UInput v-model.number="form.chosen_width_mm" type="number" placeholder="600" />
        </UFormField>
        <UFormField label="Height (mm)">
          <UInput v-model.number="form.chosen_height_mm" type="number" placeholder="900" />
        </UFormField>
      </div>
      <div v-if="finishingRates.length">
        <label class="block text-sm font-medium text-[var(--p-text-dim)] mb-2">Finishing</label>
        <div class="flex flex-wrap gap-2">
          <UCheckbox
            v-for="fr in finishingRates"
            :key="fr.id"
            :model-value="(form.finishings ?? []).some(f => f.finishing_rate === fr.id)"
            :label="`${fr.name} (KES ${fr.price})`"
            @update:model-value="toggleFinishing(fr.id, !!$event)"
          />
        </div>
      </div>

      <!-- Live quote preview -->
      <div
        v-if="product?.pricing_mode === 'SHEET' && canPreview"
        class="rounded-xl border border-flamingo-200 dark:border-flamingo-800/50 bg-flamingo-50/50 dark:bg-flamingo-900/10 p-4 space-y-3"
      >
        <div v-if="calcError" class="text-sm text-red-600 dark:text-red-400">
          {{ calcError }}
        </div>
        <template v-else>
          <div class="flex items-baseline justify-between gap-4">
            <span class="text-sm font-medium text-[var(--p-text-muted)]">Suggested price</span>
            <span v-if="calcLoading" class="text-lg font-bold text-[var(--p-text)] animate-pulse">
              Calculating…
            </span>
            <span v-else-if="calcResult?.costs?.suggested_price" class="text-2xl font-bold text-flamingo-600 dark:text-flamingo-400">
              {{ formatKES(calcResult.costs.suggested_price) }}
            </span>
          </div>
          <div v-if="calcResult?.lead_time_estimate_hours && !calcLoading" class="text-sm text-[var(--p-text-dim)]">
            <UIcon name="i-lucide-clock" class="inline w-4 h-4 mr-1 align-middle" />
            ~{{ leadTimeLabel }} production time
          </div>
          <details class="group">
            <summary class="flex items-center gap-2 cursor-pointer text-sm text-[var(--p-text-muted)] hover:text-[var(--p-text-dim)] list-none">
              <UIcon name="i-lucide-chevron-right" class="w-4 h-4 transition-transform group-open:rotate-90" />
              Details
            </summary>
            <div v-if="calcResult && !calcLoading" class="mt-2 pl-6 border-l-2 border-[var(--p-border)] space-y-1 text-sm">
              <div class="flex justify-between">
                <span class="text-[var(--p-text-muted)]">Sheets required</span>
                <span class="text-[var(--p-text)]">{{ calcResult.sheets_required }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-[var(--p-text-muted)]">Paper cost</span>
                <span class="text-[var(--p-text)]">{{ formatKES(calcResult.costs.paper_cost) }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-[var(--p-text-muted)]">Print cost</span>
                <span class="text-[var(--p-text)]">{{ formatKES(calcResult.costs.print_cost) }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-[var(--p-text-muted)]">Finishing</span>
                <span class="text-[var(--p-text)]">{{ formatKES(calcResult.costs.finishing_cost) }}</span>
              </div>
            </div>
          </details>
        </template>
      </div>

      <div class="flex gap-2">
        <UButton type="submit" color="primary" :loading="props.loading">Add item</UButton>
        <UButton variant="soft" @click="$emit('cancel')">Cancel</UButton>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import type { StaffQuoteItemPayload } from '~/composables/useStaffQuotes'
import type { Product, Paper, FinishingRate } from '~/services/seller'
import { formatKES } from '~/utils/formatters'
import {
  listProductsBySlug,
  listPapersBySlug,
  listMachinesBySlug,
  listMaterialsBySlug,
  listFinishingRatesBySlug,
} from '~/services/seller'

const props = defineProps<{
  shopSlug: string
  loading?: boolean
}>()

const emit = defineEmits<{ submit: [payload: StaffQuoteItemPayload]; cancel: [] }>()

const products = ref<Product[]>([])
const papers = ref<Paper[]>([])
const machines = ref<{ id: number; name: string }[]>([])
const materials = ref<{ id: number; material_type: string; selling_price: string; unit: string }[]>([])
const finishingRates = ref<FinishingRate[]>([])

const selectedProductId = ref<number | null>(null)
const selectedPaperId = ref<number | null>(null)
const selectedMachineId = ref<number | null>(null)
const selectedMaterialId = ref<number | null>(null)

const form = reactive<StaffQuoteItemPayload>({
  item_type: 'PRODUCT',
  product: 0,
  quantity: 100,
  paper: null,
  material: null,
  chosen_width_mm: null,
  chosen_height_mm: null,
  sides: 'SIMPLEX',
  color_mode: 'COLOR',
  machine: null,
  finishings: [],
})

const product = computed(() => products.value.find(p => p.id === form.product))

const minQty = computed(() => product.value?.min_quantity ?? 100)

const { result: calcResult, loading: calcLoading, error: calcError, calculate: calcCalculate } = useCalculatorQuoteItem({ debounceMs: 450 })

const canPreview = computed(() => {
  if (!product.value || product.value.pricing_mode !== 'SHEET') return false
  const qty = form.quantity || 0
  if (qty < minQty.value) return false
  return !!(selectedPaperId.value ?? form.paper)
})

const leadTimeLabel = computed(() => {
  const h = calcResult.value?.lead_time_estimate_hours
  if (!h) return ''
  const n = parseFloat(h)
  if (n < 1) return `${Math.round(n * 60)} min`
  return `${n.toFixed(1)} hrs`
})

const productOptions = computed(() =>
  products.value.map(p => ({ value: p.id, label: `${p.name} (${p.pricing_mode})` }))
)
const paperOptions = computed(() =>
  papers.value.map(p => ({ value: p.id, label: `${p.sheet_size} ${p.gsm}gsm ${p.paper_type}` }))
)
const machineOptions = computed(() =>
  machines.value.map(m => ({ value: m.id, label: m.name }))
)
const materialOptions = computed(() =>
  materials.value.map(m => ({ value: m.id, label: `${m.material_type ?? m.id} (${m.unit})` }))
)

function toggleFinishing(id: number, checked: boolean) {
  const current = form.finishings ?? []
  if (checked) {
    form.finishings = [...current, { finishing_rate: id }]
  } else {
    form.finishings = current.filter(f => f.finishing_rate !== id)
  }
}

onMounted(async () => {
  const slug = props.shopSlug
  if (!slug) return
  try {
    const [prods, paps, macs, mats, fins] = await Promise.all([
      listProductsBySlug(slug),
      listPapersBySlug(slug),
      listMachinesBySlug(slug),
      listMaterialsBySlug(slug),
      listFinishingRatesBySlug(slug),
    ])
    products.value = prods
    papers.value = paps
    machines.value = macs
    materials.value = mats
    finishingRates.value = fins
  } catch {
    // ignore
  }
})

watch(selectedProductId, (v) => {
  form.product = v ?? 0
  const p = products.value.find(x => x.id === form.product)
  form.quantity = p?.min_quantity ?? 100
  if (papers.value.length && selectedPaperId.value == null) {
    selectedPaperId.value = papers.value[0]?.id ?? null
  }
})
watch(selectedPaperId, (v) => { form.paper = v ?? null })
watch(selectedMachineId, (v) => { form.machine = v ?? null })
watch(selectedMaterialId, (v) => { form.material = v ?? null })

watch(
  () => ({
    product_id: form.product,
    quantity: Math.max(minQty.value, form.quantity || minQty.value),
    paper_id: selectedPaperId.value ?? form.paper,
    machine_id: selectedMachineId.value ?? form.machine,
    sides: form.sides,
    color_mode: form.color_mode,
    finishing_ids: (form.finishings ?? []).map(f => f.finishing_rate),
  }),
  (input) => {
    if (canPreview.value && input.product_id && input.quantity > 0 && input.paper_id) {
      calcCalculate({
        product_id: input.product_id,
        quantity: input.quantity,
        paper_id: input.paper_id,
        machine_id: input.machine_id ?? undefined,
        sides: input.sides,
        color_mode: input.color_mode,
        finishing_ids: input.finishing_ids,
      })
    }
  },
  { deep: true, immediate: true }
)

function onSubmit() {
  if (!form.product) return
  form.quantity = Math.max(minQty.value, form.quantity || minQty.value)
  form.paper = selectedPaperId.value ?? null
  form.machine = selectedMachineId.value ?? null
  form.material = selectedMaterialId.value ?? null
  emit('submit', { ...form })
}
</script>
