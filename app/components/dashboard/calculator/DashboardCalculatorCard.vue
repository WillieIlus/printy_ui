<template>
  <div class="grid gap-6 lg:grid-cols-[1fr_400px]">
    <!-- Form Side -->
    <div class="space-y-6">
      <BasePanel variant="display" class="p-6">
        <div class="grid gap-6 md:grid-cols-2">
          <!-- Job Type -->
          <div class="space-y-4">
            <BaseSelect
              id="job-type"
              label="Job type"
              :model-value="selectedProductType"
              :options="productOptions"
              @update:model-value="store.selectProduct"
            />
            
            <BaseInput
              id="quantity"
              label="Quantity"
              type="number"
              min="1"
              :model-value="String(form.quantity || '')"
              @update:model-value="(v) => store.setField('quantity', v ? Number(v) : null)"
            />
          </div>

          <!-- Paper -->
          <div class="space-y-4">
            <BaseSelect
              id="paper-id"
              label="Paper / Material"
              :model-value="String(form.paper_id || '')"
              :options="paperOptions"
              @update:model-value="(v) => store.setField('paper_id', v)"
            />
            
            <div class="grid grid-cols-2 gap-4">
              <BaseSelect
                id="color-mode"
                label="Color"
                :model-value="String(form.color_mode || 'COLOR')"
                :options="[
                  { label: 'Color', value: 'COLOR' },
                  { label: 'B&W', value: 'BW' }
                ]"
                @update:model-value="(v) => store.setField('color_mode', v)"
              />
              <BaseSelect
                id="sides"
                label="Sides"
                :model-value="String(form.sides || 'SIMPLEX')"
                :options="[
                  { label: 'One-sided', value: 'SIMPLEX' },
                  { label: 'Two-sided', value: 'DUPLEX' }
                ]"
                @update:model-value="(v) => store.setField('sides', v)"
              />
            </div>
          </div>
        </div>

        <!-- Size -->
        <div class="mt-6 border-t border-[var(--p-border)] pt-6">
          <p class="mb-4 text-xs font-semibold uppercase tracking-wider text-[var(--p-text-muted)]">Dimensions (mm)</p>
          <div class="grid gap-4 md:grid-cols-3">
            <BaseInput
              id="width"
              label="Finished Width"
              type="number"
              min="1"
              :model-value="String(form.width_mm || '')"
              @update:model-value="(v) => store.setField('width_mm', v ? Number(v) : null)"
            />
            <BaseInput
              id="height"
              label="Finished Height"
              type="number"
              min="1"
              :model-value="String(form.height_mm || '')"
              @update:model-value="(v) => store.setField('height_mm', v ? Number(v) : null)"
            />
            <BaseInput
              id="bleed"
              label="Bleed (mm)"
              type="number"
              min="0"
              :model-value="String(form.bleed_mm || '3')"
              @update:model-value="(v) => store.setField('bleed_mm', v ? Number(v) : 0)"
            />
          </div>
        </div>
      </BasePanel>

      <!-- Finishings -->
      <BasePanel variant="display" class="p-6">
        <p class="mb-4 text-sm font-semibold text-[var(--p-text)]">Finishings</p>
        <div v-if="availableFinishings.length" class="grid gap-3 md:grid-cols-2">
          <label
            v-for="fin in availableFinishings"
            :key="fin.id"
            class="flex items-start gap-3 rounded-xl border border-[var(--p-border)] p-3 transition hover:bg-[var(--p-bg-soft)] cursor-pointer"
          >
            <BaseCheckbox
              :model-value="isFinishingSelected(fin.id)"
              @update:model-value="(v) => toggleFinishing(fin.id, v)"
            />
            <div class="space-y-0.5">
              <p class="text-sm font-medium">{{ fin.name }}</p>
              <p class="text-xs text-[var(--p-text-muted)]">{{ fin.charge_by }} • {{ fin.price }}</p>
            </div>
          </label>
        </div>
        <div v-else class="py-4 text-center">
          <p class="text-sm text-[var(--p-text-muted)]">No active finishings found in your setup.</p>
          <NuxtLink to="/dashboard/shop/finishing" class="mt-2 text-xs font-semibold text-[var(--p-primary)]">Add finishings</NuxtLink>
        </div>
      </BasePanel>
    </div>

    <!-- Results Side -->
    <div class="space-y-6">
      <BasePanel variant="console" class="p-6 sticky top-6">
        <div v-if="previewLoading" class="flex flex-col items-center justify-center py-12 text-center">
          <Icon name="lucide:loader-2" class="size-8 animate-spin text-[var(--p-primary)]" />
          <p class="mt-4 text-sm font-medium">Calculating quote...</p>
        </div>

        <div v-else-if="preview" class="space-y-6">
          <div class="text-center">
            <p class="text-xs font-bold uppercase tracking-widest text-[var(--p-primary)]">Quote Total</p>
            <h2 class="mt-2 text-4xl font-bold tracking-tight">{{ preview.currency }} {{ preview.total }}</h2>
            <p v-if="preview.price_mode === 'estimate'" class="mt-1 text-xs text-amber-600 font-semibold uppercase">Estimated price</p>
          </div>

          <!-- Breakdown -->
          <div class="space-y-3">
            <p class="text-xs font-bold uppercase tracking-widest text-[var(--p-text-muted)]">Breakdown</p>
            <div class="space-y-2">
              <div
                v-for="(line, idx) in preview.pricing_breakdown?.lines || []"
                :key="idx"
                class="flex items-start justify-between gap-4 text-sm"
              >
                <div class="space-y-0.5">
                  <p class="font-medium">{{ line.label }}</p>
                  <p v-if="line.formula" class="text-[10px] text-[var(--p-text-muted)] font-mono">{{ line.formula }}</p>
                </div>
                <p class="font-semibold">{{ line.amount }}</p>
              </div>
            </div>
          </div>

          <!-- Production Readout -->
          <div v-if="preview.production_preview" class="rounded-2xl bg-[var(--p-bg-soft)] p-4 space-y-3">
             <p class="text-[10px] font-bold uppercase tracking-widest text-[var(--p-text-muted)]">Production Readout</p>
             <div class="grid grid-cols-2 gap-4 text-xs">
                <div>
                   <p class="text-[var(--p-text-muted)]">Parent sheet</p>
                   <p class="font-semibold">{{ preview.production_preview.parent_sheet }}</p>
                </div>
                <div>
                   <p class="text-[var(--p-text-muted)]">Yield</p>
                   <p class="font-semibold">{{ preview.production_preview.pieces_per_sheet }} up</p>
                </div>
                <div>
                   <p class="text-[var(--p-text-muted)]">SRA3 Sheets</p>
                   <p class="font-semibold">{{ preview.production_preview.sheets_required }} sheets</p>
                </div>
                <div>
                   <p class="text-[var(--p-text-muted)]">Cutting</p>
                   <p class="font-semibold">{{ preview.production_preview.cutting_required ? 'Yes' : 'No' }}</p>
                </div>
             </div>
          </div>

          <!-- Warnings -->
          <div v-if="preview.warnings?.length" class="space-y-2">
             <div v-for="w in preview.warnings" :key="w" class="flex gap-2 rounded-xl bg-amber-50 p-3 text-xs text-amber-800 border border-amber-200">
                <Icon name="lucide:alert-triangle" class="size-4 shrink-0" />
                <span>{{ w }}</span>
             </div>
          </div>

          <!-- Actions -->
          <div class="grid grid-cols-2 gap-3 pt-4 border-t border-[var(--p-border)]">
             <BaseButton variant="secondary" size="sm" class="w-full" @click="copySummary">
                <Icon name="lucide:copy" class="mr-2 size-4" />
                Copy
             </BaseButton>
             <BaseButton variant="primary" size="sm" class="w-full" @click="saveDraft">
                Save Draft
             </BaseButton>
          </div>
        </div>

        <div v-else-if="previewError" class="py-12 text-center px-4">
           <Icon name="lucide:alert-circle" class="size-8 text-red-500 mx-auto" />
           <p class="mt-4 text-sm font-semibold text-red-600">{{ previewError }}</p>
           <p class="mt-2 text-xs text-[var(--p-text-muted)]">Please ensure you have machines and papers set up for this size and color mode.</p>
           <BaseButton variant="outline" size="sm" class="mt-6" @click="store.fetchPreview">Retry</BaseButton>
        </div>

        <div v-else class="flex flex-col items-center justify-center py-12 text-center px-6">
          <Icon name="lucide:calculator" class="size-12 text-[var(--p-border)]" />
          <p class="mt-4 text-sm font-medium text-[var(--p-text-muted)]">Enter quantity and select a paper to see your live rate card quote.</p>
        </div>
      </BasePanel>
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useDashboardCalculatorStore } from '~/stores/dashboardCalculator'
import { useShopStore } from '~/stores/shop'
import { fetchShopRateCardForCalculator } from '~/services/calculator'

const store = useDashboardCalculatorStore()
const shopStore = useShopStore()
const { form, selectedProductType, productOptions, preview, previewLoading, previewError } = storeToRefs(store)

const rateCardData = ref<any>(null)

async function loadRateCard() {
  if (!shopStore.currentShop?.slug) return
  try {
    const data = await fetchShopRateCardForCalculator(shopStore.currentShop.slug)
    rateCardData.value = data
  } catch (e) {
    console.error('Failed to load shop rate card for calculator', e)
  }
}

const paperOptions = computed(() => {
  return (rateCardData.value?.papers || []).map((p: any) => ({
    label: `${p.paper_type} ${p.gsm}gsm (${p.sheet_size})`,
    value: String(p.id)
  }))
})

const availableFinishings = computed(() => {
  return (rateCardData.value?.finishing_rates || []).map((f: any) => ({
    id: f.id,
    name: f.name,
    price: f.price,
    charge_by: f.charge_unit
  }))
})

function isFinishingSelected(id: number) {
  const current = (form.value.finishings as any[]) || []
  return current.some(f => f.finishing_id === id)
}

function toggleFinishing(id: number, selected: boolean) {
  let current = [...((form.value.finishings as any[]) || [])]
  if (selected) {
    if (!current.some(f => f.finishing_id === id)) {
      current.push({ finishing_id: id, selected_side: 'both' })
    }
  } else {
    current = current.filter(f => f.finishing_id !== id)
  }
  store.setField('finishings', current)
}

function copySummary() {
  if (!preview.value) return
  const lines = [
    `Quote Summary: ${selectedProductType.value.replace(/_/g, ' ')}`,
    `Quantity: ${form.value.quantity}`,
    `Total: ${preview.value.currency} ${preview.value.total}`,
    '',
    'Breakdown:',
    ...(preview.value.pricing_breakdown?.lines || []).map(l => `- ${l.label}: ${l.amount}`),
    '',
    'Sent via Printy Dashboard'
  ]
  navigator.clipboard.writeText(lines.join('\n'))
  useNuxtApp().$toast?.success('Summary copied to clipboard')
}

function saveDraft() {
  useNuxtApp().$toast?.info('Save as draft coming soon!')
}

onMounted(async () => {
  await store.loadConfig()
  await loadRateCard()
})

watch(() => shopStore.currentShop?.slug, loadRateCard)
</script>
