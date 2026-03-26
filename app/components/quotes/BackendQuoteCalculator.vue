<template>
  <section :id="anchorId" class="rounded-[2rem] border border-[var(--p-border)] bg-[var(--p-surface)] p-6 shadow-sm">
    <div class="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
      <div>
        <p class="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--p-text-muted)]">{{ eyebrow }}</p>
        <h2 class="mt-2 text-2xl font-semibold text-[var(--p-text)]">{{ title }}</h2>
        <p class="mt-2 max-w-3xl text-sm leading-6 text-[var(--p-text-muted)]">{{ description }}</p>
      </div>
      <div class="flex flex-wrap gap-2">
        <UButton color="primary" :loading="calculatorStore.previewLoading" @click="previewQuote">Preview</UButton>
        <UButton variant="soft" :disabled="!calculatorStore.preview" @click="saveDraft">Save draft</UButton>
        <UButton variant="soft" :disabled="!calculatorStore.preview" @click="sendDraft">Send to shop</UButton>
        <UButton variant="soft" :disabled="!calculatorStore.preview" @click="copyPreview">Copy</UButton>
        <UButton variant="soft" :disabled="!calculatorStore.preview" @click="shareWhatsApp">WhatsApp</UButton>
        <UButton variant="soft" :disabled="!calculatorStore.preview" @click="printPreview">PDF</UButton>
      </div>
    </div>

    <div class="mt-6 grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
      <form ref="formRef" class="space-y-6" @submit.prevent="previewQuote">
        <div class="grid gap-4 md:grid-cols-2">
          <label v-if="allowShopSelection" class="space-y-2 md:col-span-2">
            <span class="text-sm font-medium text-[var(--p-text)]">Shop</span>
            <USelectMenu
              v-model="selectedShopSlug"
              :items="shopOptions"
              value-key="value"
              label-key="label"
              class="w-full"
              portal="body"
            />
          </label>

          <label class="space-y-2">
            <span class="text-sm font-medium text-[var(--p-text)]">Enquirer</span>
            <UInput v-model="contactName" placeholder="Client or company name" />
          </label>
          <label class="space-y-2">
            <span class="text-sm font-medium text-[var(--p-text)]">Phone / contact</span>
            <UInput v-model="contactPhone" placeholder="+254..." />
          </label>

          <label class="space-y-2 md:col-span-2">
            <span class="text-sm font-medium text-[var(--p-text)]">Product</span>
            <USelectMenu
              v-model="selectedProductId"
              :items="productOptions"
              value-key="value"
              label-key="label"
              class="w-full"
              portal="body"
            />
          </label>

          <label class="space-y-2">
            <span class="text-sm font-medium text-[var(--p-text)]">Quantity</span>
            <UInput v-model="quantity" type="number" min="1" />
          </label>
          <label class="space-y-2">
            <span class="text-sm font-medium text-[var(--p-text)]">Sides</span>
            <USelectMenu v-model="sides" :items="sidesOptions" value-key="value" label-key="label" portal="body" class="w-full" />
          </label>

          <label class="space-y-2">
            <span class="text-sm font-medium text-[var(--p-text)]">Paper</span>
            <USelectMenu v-model="selectedPaperId" :items="paperOptions" value-key="value" label-key="label" portal="body" class="w-full" />
          </label>
          <label class="space-y-2">
            <span class="text-sm font-medium text-[var(--p-text)]">Machine</span>
            <USelectMenu v-model="selectedMachineId" :items="machineOptions" value-key="value" label-key="label" portal="body" class="w-full" />
          </label>
        </div>

        <div class="space-y-3">
          <div class="flex items-center justify-between gap-3">
            <div>
              <p class="text-sm font-medium text-[var(--p-text)]">Finishing</p>
              <p class="text-sm text-[var(--p-text-muted)]">Use backend finishing rules. Lamination stays per sheet per side.</p>
            </div>
          </div>
          <div class="grid gap-3 md:grid-cols-2">
            <article
              v-for="finishing in finishingOptions"
              :key="finishing.id"
              class="rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface-sunken)] p-4"
            >
              <label class="flex items-start gap-3">
                <UCheckbox
                  :model-value="selectedFinishings.some((entry) => entry.finishing_rate_id === finishing.id)"
                  @update:model-value="toggleFinishing(finishing)"
                />
                <div class="min-w-0">
                  <p class="text-sm font-medium text-[var(--p-text)]">{{ finishing.name }}</p>
                  <p class="mt-1 text-xs uppercase tracking-[0.12em] text-[var(--p-text-muted)]">
                    {{ finishing.billing_basis || finishing.charge_unit || 'backend rule' }}
                  </p>
                  <p v-if="finishing.help_text || finishing.display_unit_label" class="mt-2 text-sm text-[var(--p-text-muted)]">
                    {{ finishing.help_text || finishing.display_unit_label }}
                  </p>
                </div>
              </label>
              <div v-if="selectedFinishings.some((entry) => entry.finishing_rate_id === finishing.id) && isLamination(finishing)" class="mt-3">
                <USelectMenu
                  :model-value="selectedFinishingSide(finishing.id)"
                  :items="laminationSides"
                  value-key="value"
                  label-key="label"
                  portal="body"
                  class="w-full"
                  @update:model-value="updateFinishingSide(finishing.id, $event)"
                />
              </div>
            </article>
          </div>
        </div>

        <label class="space-y-2">
          <span class="text-sm font-medium text-[var(--p-text)]">Notes</span>
          <UTextarea v-model="notes" :rows="4" placeholder="Turnaround, delivery notes, or customer context" />
        </label>
      </form>

      <QuotesCalculationBreakdownCard :preview="calculatorStore.preview" />
    </div>
  </section>
</template>

<script setup lang="ts">
import { API } from '~/shared/api-paths'
import type { QuoteDraft } from '~/shared/types/buyer'
import { normalizeNumberValue, normalizeOptionalText, normalizeSelectValue } from '~/utils/payload'

const props = withDefaults(defineProps<{
  title: string
  description: string
  eyebrow?: string
  mode?: 'hero' | 'client' | 'shop'
  fixedShopSlug?: string | null
  anchorId?: string
}>(), {
  eyebrow: 'Quote Calculator',
  mode: 'client',
  fixedShopSlug: null,
  anchorId: 'quote-calculator',
})

const emit = defineEmits<{
  draftSaved: [draft: QuoteDraft]
  draftSent: [requests: QuoteDraft[]]
}>()

const authStore = useAuthStore()
const shopStore = useShopStore()
const calculatorStore = useCalculatorStore()
const quoteInboxStore = useQuoteInboxStore()
const { scrollToFirstInvalid } = useAnchoredForm()
const toast = useToast()
const formRef = ref<HTMLElement | null>(null)

const contactName = ref('')
const contactPhone = ref('')
const notes = ref('')
const selectedShopSlug = ref<string | null>(props.fixedShopSlug ?? null)
const selectedProductId = ref<number | null>(null)
const selectedPaperId = ref<number | null>(null)
const selectedMachineId = ref<number | null>(null)
const quantity = ref<number | null>(100)
const sides = ref<'SIMPLEX' | 'DUPLEX'>('SIMPLEX')
const selectedFinishings = ref<Array<{ finishing_rate_id: number; selected_side: 'front' | 'back' | 'both' }>>([])

const shopOptions = ref<Array<{ label: string; value: string }>>([])
const productOptions = ref<Array<{ label: string; value: number }>>([])
const paperOptions = ref<Array<{ label: string; value: number }>>([])
const machineOptions = ref<Array<{ label: string; value: number }>>([])
const finishingOptions = ref<Array<Record<string, any>>>([])
const activeShopId = ref<number | null>(null)

const allowShopSelection = computed(() => !props.fixedShopSlug)
const sidesOptions = [
  { label: 'Front only', value: 'SIMPLEX' },
  { label: 'Both sides', value: 'DUPLEX' },
]

const laminationSides = [
  { label: 'Front only', value: 'front' },
  { label: 'Back only', value: 'back' },
  { label: 'Both sides', value: 'both' },
]

watch(selectedShopSlug, async (slug) => {
  if (!slug) return
  await loadShopResources(slug)
}, { immediate: true })

watch(selectedProductId, async (productId) => {
  if (!productId) return
  await loadProductOptions(productId)
}, { immediate: true })

onMounted(async () => {
  await loadShops()
})

async function loadShops() {
  const { $publicApi } = useNuxtApp()
  if (props.fixedShopSlug) {
    shopOptions.value = [{ label: props.fixedShopSlug, value: props.fixedShopSlug }]
    selectedShopSlug.value = props.fixedShopSlug
    return
  }
  const shops = await $publicApi<Array<{ id: number; slug: string; name: string }>>(API.publicShops())
  shopOptions.value = shops.map((shop) => ({ label: shop.name, value: shop.slug }))
  if (!selectedShopSlug.value) {
    selectedShopSlug.value = shopStore.selectedShopSlug ?? shopOptions.value[0]?.value ?? null
  }
}

async function loadShopResources(shopSlug: string) {
  const { $publicApi } = useNuxtApp()
  const catalogResponse = await $publicApi<{ shop: { id: number; slug: string; name: string }; products: Array<{ id: number; name: string }> }>(
    API.publicShopCatalog(shopSlug),
  )
  activeShopId.value = catalogResponse.shop.id
  productOptions.value = catalogResponse.products.map((product) => ({ label: product.name, value: product.id }))
  if (!selectedProductId.value) {
    selectedProductId.value = productOptions.value[0]?.value ?? null
  }
}

async function loadProductOptions(productId: number) {
  const { $publicApiNoAuth } = useNuxtApp()
  const detail = await $publicApiNoAuth<any>(API.publicProductOptions(productId))
  paperOptions.value = (detail.available_papers ?? []).map((paper: Record<string, unknown>) => ({
    label: `${paper.sheet_size} · ${paper.gsm}gsm · ${paper.paper_type}`,
    value: Number(paper.id),
  }))
  machineOptions.value = (detail.available_machines ?? []).map((machine: Record<string, unknown>) => ({
    label: String(machine.name),
    value: Number(machine.id),
  }))
  finishingOptions.value = detail.available_finishings ?? []
  selectedPaperId.value = selectedPaperId.value ?? paperOptions.value[0]?.value ?? null
  selectedMachineId.value = selectedMachineId.value ?? Number(detail.default_machine ?? machineOptions.value[0]?.value ?? null)
  sides.value = detail.default_sides === 'DUPLEX' ? 'DUPLEX' : 'SIMPLEX'
}

function toggleFinishing(finishing: Record<string, any>) {
  const existing = selectedFinishings.value.find((entry) => entry.finishing_rate_id === finishing.id)
  if (existing) {
    selectedFinishings.value = selectedFinishings.value.filter((entry) => entry.finishing_rate_id !== finishing.id)
    return
  }
  selectedFinishings.value = [
    ...selectedFinishings.value,
    {
      finishing_rate_id: Number(finishing.id),
      selected_side: isLamination(finishing) ? 'both' : 'both',
    },
  ]
}

function updateFinishingSide(finishingId: number, value: unknown) {
  const normalized = normalizeSelectValue<'front' | 'back' | 'both'>(value) ?? 'both'
  selectedFinishings.value = selectedFinishings.value.map((entry) =>
    entry.finishing_rate_id === finishingId ? { ...entry, selected_side: normalized } : entry,
  )
}

function selectedFinishingSide(finishingId: number) {
  return selectedFinishings.value.find((entry) => entry.finishing_rate_id === finishingId)?.selected_side ?? 'both'
}

function isLamination(finishing: Record<string, any>) {
  return `${finishing.slug || ''} ${finishing.name || ''}`.toLowerCase().includes('lamination')
}

function validateForm() {
  return Boolean(activeShopId.value && selectedProductId.value && selectedPaperId.value && selectedMachineId.value && normalizeNumberValue(quantity.value))
}

async function previewQuote() {
  if (!validateForm()) {
    scrollToFirstInvalid(formRef.value)
    toast.add({ title: 'Incomplete form', description: 'Pick a shop, product, paper, machine, and quantity before previewing.', color: 'warning' })
    return
  }
  calculatorStore.setContext({
    shopId: activeShopId.value,
    shopSlug: selectedShopSlug.value,
    productId: selectedProductId.value,
    quantity: normalizeNumberValue(quantity.value) ?? 100,
    paperId: selectedPaperId.value,
    machineId: selectedMachineId.value,
    sides: sides.value,
    finishings: selectedFinishings.value,
  })
  try {
    await calculatorStore.fetchPreview()
  } catch (error) {
    toast.add({ title: 'Preview failed', description: error instanceof Error ? error.message : 'Preview failed.', color: 'error' })
  }
}

async function saveDraft() {
  if (!calculatorStore.preview) return
  if (!authStore.isAuthenticated) {
    await navigateTo({ path: '/auth/login', query: { redirect: '/quote-draft' } })
    return
  }
  if (!authStore.isClient) {
    toast.add({ title: 'Preview only', description: 'This backend draft flow is currently client-only.', color: 'warning' })
    return
  }
  const draft = await quoteInboxStore.saveDraft({
    title: contactName.value || 'Saved draft',
    shop: activeShopId.value,
    selected_product: selectedProductId.value,
    calculator_inputs_snapshot: {
      quantity: normalizeNumberValue(quantity.value),
      paper: selectedPaperId.value,
      machine: selectedMachineId.value,
      sides: sides.value,
      finishings: selectedFinishings.value,
      notes: notes.value,
    },
    pricing_snapshot: calculatorStore.preview,
    request_details_snapshot: {
      customer_name: normalizeOptionalText(contactName.value),
      customer_phone: normalizeOptionalText(contactPhone.value),
      notes: normalizeOptionalText(notes.value),
    },
  })
  emit('draftSaved', draft)
  toast.add({ title: 'Draft saved', description: 'The backend stored this quote draft.', color: 'success' })
}

async function sendDraft() {
  if (!calculatorStore.preview) return
  if (!authStore.isAuthenticated) {
    await navigateTo({ path: '/auth/login', query: { redirect: '/quote-draft' } })
    return
  }
  if (!authStore.isClient) {
    toast.add({ title: 'Preview only', description: 'Sending backend drafts is currently client-only.', color: 'warning' })
    return
  }
  const draft = await quoteInboxStore.saveDraft({
    title: contactName.value || 'Prepared quote',
    shop: activeShopId.value,
    selected_product: selectedProductId.value,
    calculator_inputs_snapshot: {
      quantity: normalizeNumberValue(quantity.value),
      paper: selectedPaperId.value,
      machine: selectedMachineId.value,
      sides: sides.value,
      finishings: selectedFinishings.value,
      notes: notes.value,
    },
    pricing_snapshot: calculatorStore.preview,
    request_details_snapshot: {
      customer_name: normalizeOptionalText(contactName.value),
      customer_phone: normalizeOptionalText(contactPhone.value),
      notes: normalizeOptionalText(notes.value),
    },
  })
  const requests = await quoteInboxStore.sendDraft(draft.id, activeShopId.value ? [activeShopId.value] : [], {
    customer_name: normalizeOptionalText(contactName.value),
    customer_phone: normalizeOptionalText(contactPhone.value),
    notes: normalizeOptionalText(notes.value),
  })
  emit('draftSent', requests)
  toast.add({ title: 'Quote request sent', description: 'The backend created quote requests from this draft.', color: 'success' })
}

async function copyPreview() {
  const text = [
    `Total: ${calculatorStore.preview?.totals?.grand_total || calculatorStore.preview?.total || ''}`,
    `Paper: ${calculatorStore.preview?.paper?.label || ''}`,
    `Printing: ${calculatorStore.preview?.printing?.machine_name || ''}`,
  ].join('\n')
  await navigator.clipboard.writeText(text)
  toast.add({ title: 'Copied', description: 'Preview copied to the clipboard.', color: 'success' })
}

function shareWhatsApp() {
  const total = calculatorStore.preview?.totals?.grand_total || calculatorStore.preview?.total || ''
  const text = encodeURIComponent(`Quote preview\nCustomer: ${contactName.value || '-'}\nPhone: ${contactPhone.value || '-'}\nTotal: ${total}`)
  window.open(`https://wa.me/?text=${text}`, '_blank', 'noopener')
}

function printPreview() {
  window.print()
}
</script>
