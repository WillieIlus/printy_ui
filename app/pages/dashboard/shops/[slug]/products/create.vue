<template>
  <div class="col-span-12 space-y-6">
    <DashboardPageHeader
      title="Create a Product"
      subtitle="Guide Printy through the finished size, print rules, parent sheet logic, and finishing assumptions your shop uses for real production."
    >
      <template #actions>
        <UButton :to="`/dashboard/shops/${slug}/products`" variant="soft">Back to Products</UButton>
      </template>
    </DashboardPageHeader>

    <div class="grid gap-6 xl:grid-cols-[1.3fr_0.8fr]">
      <form ref="formRef" class="space-y-6" @submit.prevent="submitForm">
        <DashboardFormSection title="Product Basics" description="Start with a product your team already understands and can produce today.">
          <div class="grid gap-5 md:grid-cols-2">
            <div class="space-y-2 md:col-span-2">
              <label class="block text-sm font-medium text-white">Product Name</label>
              <UInput v-model="form.name" placeholder="Business Cards" size="xl" :class="fieldClass('name')" />
              <DashboardInlineError :message="fieldError('name')" />
            </div>

            <div class="space-y-2">
              <label class="block text-sm font-medium text-white">Use Example</label>
              <USelectMenu
                v-model="selectedExample"
                :items="exampleOptions"
                value-key="value"
                label-key="label"
                placeholder="Choose a realistic product example"
                size="xl"
              />
              <DashboardFieldHint text="Choosing an example pre-fills dimensions and common production defaults. You can still edit everything." />
            </div>

            <div class="space-y-2">
              <label class="block text-sm font-medium text-white">Pricing Mode</label>
              <USelectMenu
                v-model="form.pricing_mode"
                :items="pricingModes"
                value-key="value"
                label-key="label"
                size="xl"
                portal="body"
                :class="fieldClass('pricing_mode')"
              />
              <DashboardFieldHint text="Sheet products use parent sheet imposition. Large-format products use area-based pricing." />
              <DashboardInlineError :message="fieldError('pricing_mode')" />
            </div>

            <div class="space-y-2 md:col-span-2">
              <label class="block text-sm font-medium text-white">Description</label>
              <UTextarea v-model="form.description" :rows="4" placeholder="Premium matt laminated business cards printed on 350gsm stock for walk-in clients and sales teams." />
            </div>
          </div>
        </DashboardFormSection>

        <DashboardFormSection title="Print Specifications" description="These settings define the finished item buyers order, not the parent sheet it starts from.">
          <div class="grid gap-5 md:grid-cols-2">
            <div class="space-y-2">
              <label class="block text-sm font-medium text-white">Finished Width (mm)</label>
              <UInput v-model="form.default_finished_width_mm" type="number" placeholder="90" size="xl" :class="fieldClass('default_finished_width_mm')" />
              <DashboardInlineError :message="fieldError('default_finished_width_mm') || errors.finished_width" />
            </div>
            <div class="space-y-2">
              <label class="block text-sm font-medium text-white">Finished Height (mm)</label>
              <UInput v-model="form.default_finished_height_mm" type="number" placeholder="54" size="xl" :class="fieldClass('default_finished_height_mm')" />
              <DashboardInlineError :message="fieldError('default_finished_height_mm') || errors.finished_height" />
            </div>
            <div class="space-y-2">
              <label class="block text-sm font-medium text-white">Bleed (mm)</label>
              <UInput v-model="form.default_bleed_mm" type="number" placeholder="3" size="xl" />
            </div>
            <div class="space-y-2">
              <label class="block text-sm font-medium text-white">Minimum Quantity</label>
              <UInput v-model="form.min_quantity" type="number" placeholder="100" size="xl" />
            </div>
            <div class="space-y-2">
              <label class="block text-sm font-medium text-white">Default Sides</label>
              <USelectMenu v-model="form.default_sides" :items="sidesOptions" value-key="value" label-key="label" size="xl" portal="body" />
            </div>
            <div class="space-y-2">
              <label class="block text-sm font-medium text-white">Turnaround (business days)</label>
              <UInput v-model="form.turnaround_days" type="number" placeholder="2" size="xl" />
            </div>
          </div>
        </DashboardFormSection>

        <DashboardFormSection title="Paper / Parent Sheet Logic" description="Default paper means the parent sheet this product is usually imposed on, such as SRA3. Stock paper means the actual paper you keep in the shop for costing.">
          <div class="grid gap-5 md:grid-cols-2">
            <div class="space-y-2">
              <label class="block text-sm font-medium text-white">Default Parent Sheet</label>
              <USelectMenu
                v-model="form.default_sheet_size"
                :items="sheetSizeOptions"
                value-key="value"
                label-key="label"
                size="xl"
                portal="body"
              />
              <DashboardFieldHint text="Example: business cards often start from SRA3 stock, then multiple finished cards are imposed on each sheet." />
              <DashboardInlineError :message="fieldError('default_sheet_size')" />
            </div>

            <div class="space-y-2">
              <label class="block text-sm font-medium text-white">Recommended Machine</label>
              <USelectMenu
                v-model="form.default_machine"
                :items="machineOptions"
                value-key="value"
                label-key="label"
                placeholder="Optional machine default"
                size="xl"
                portal="body"
              />
              <DashboardFieldHint text="Optional today. It helps keep product assumptions tied to an actual press." />
              <DashboardInlineError :message="fieldError('default_machine')" />
            </div>

            <div class="space-y-2 md:col-span-2">
              <label class="block text-sm font-medium text-white">Allowed Parent Sheets</label>
              <div class="grid gap-2 sm:grid-cols-2">
                <label
                  v-for="sheet in sheetSizeOptions"
                  :key="sheet.value"
                  class="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200"
                >
                  <UCheckbox :model-value="form.allowed_sheet_sizes.includes(sheet.value)" @update:model-value="toggleSheet(sheet.value)" />
                  <span>{{ sheet.label }}</span>
                </label>
              </div>
              <DashboardFieldHint text="Allowed sheets define the parent sheet sizes this product may use. Leave several selected if your shop can produce the job on more than one parent sheet." />
            </div>

            <div class="space-y-2">
              <label class="block text-sm font-medium text-white">Estimated Fit on Parent Sheet</label>
              <div class="rounded-2xl border border-white/10 bg-slate-950/45 p-4">
                <p class="text-lg font-semibold text-white">{{ impositionPreview.fitCount }} up</p>
                <p class="mt-1 text-sm leading-6 text-slate-300">{{ impositionPreview.summary }}</p>
              </div>
            </div>

            <div class="space-y-2">
              <label class="block text-sm font-medium text-white">Parent Sheets Needed for 1,000 pcs</label>
              <div class="rounded-2xl border border-white/10 bg-slate-950/45 p-4">
                <p class="text-lg font-semibold text-white">{{ impositionPreview.parentSheets }}</p>
                <p class="mt-1 text-sm leading-6 text-slate-300">
                  This estimate helps downstream costing, print charges, and finishing quantities derive from the parent sheet count.
                </p>
              </div>
            </div>
          </div>
        </DashboardFormSection>

        <DashboardFormSection title="Pricing / Production Rules" description="These rules stop unsuitable stock or oversized jobs from appearing as valid options.">
          <div class="grid gap-5 md:grid-cols-2">
            <div class="space-y-2">
              <label class="block text-sm font-medium text-white">Minimum GSM</label>
              <UInput v-model="form.min_gsm" type="number" placeholder="250" size="xl" />
              <DashboardInlineError :message="fieldError('min_gsm')" />
            </div>
            <div class="space-y-2">
              <label class="block text-sm font-medium text-white">Maximum GSM</label>
              <UInput v-model="form.max_gsm" type="number" placeholder="350" size="xl" />
              <DashboardInlineError :message="fieldError('max_gsm')" />
            </div>
            <div class="space-y-2">
              <label class="block text-sm font-medium text-white">Max Finished Width (mm)</label>
              <UInput v-model="form.max_width_mm" type="number" placeholder="90" size="xl" />
              <DashboardInlineError :message="fieldError('max_width_mm')" />
            </div>
            <div class="space-y-2">
              <label class="block text-sm font-medium text-white">Max Finished Height (mm)</label>
              <UInput v-model="form.max_height_mm" type="number" placeholder="54" size="xl" />
              <DashboardInlineError :message="fieldError('max_height_mm')" />
            </div>
            <label class="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200">
              <UCheckbox v-model="form.allow_simplex" />
              <span>Allow simplex jobs</span>
            </label>
            <label class="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200">
              <UCheckbox v-model="form.allow_duplex" />
              <span>Allow duplex jobs</span>
            </label>
          </div>
        </DashboardFormSection>

        <DashboardFormSection title="Finishing Options" description="Finishing can stay simple at first. The important part is telling the team what usually happens after print.">
          <div class="grid gap-2 sm:grid-cols-2">
            <label
              v-for="option in finishingOptions"
              :key="option.id"
              class="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200"
            >
              <UCheckbox :model-value="selectedFinishingIds.includes(option.id)" @update:model-value="toggleFinishing(option.id)" />
              <span>{{ option.name }}</span>
            </label>
          </div>
          <DashboardFieldHint text="Finishing selections are sent to the backend as finishing_rate IDs instead of UI-only labels." />
        </DashboardFormSection>

        <UAlert
          v-if="submitError"
          color="error"
          variant="soft"
          title="We could not save this product yet."
          :description="submitError"
          icon="i-lucide-alert-circle"
        />

        <div class="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <UButton color="neutral" variant="outline" @click="goBack">Cancel</UButton>
          <DashboardLoadingButton type="submit" color="primary" :loading="saving" :disabled="!canSubmit">
            Create Product
          </DashboardLoadingButton>
        </div>
      </form>

      <div class="space-y-6">
        <DashboardInfoCard
          title="How imposition works"
          description="Finished size is the piece you hand to the customer. Parent sheet is the larger stock sheet you print first. Printy estimates how many finished pieces fit on that parent sheet, then uses that fit count to estimate parent sheets needed."
          icon="i-lucide-layout-template"
          tone="orange"
        />
        <DashboardInfoCard
          title="Stock paper vs default paper"
          description="Stock paper is the real paper you keep in inventory. Default paper size is the parent sheet you want this product to prefer when quoting and costing."
          icon="i-lucide-file-stack"
          tone="blue"
        />
        <DashboardInfoCard
          title="Good first products"
          description="Business cards, flyers, brochures, roll-up banners, booklets, and stickers are practical first products because the team already understands the production path."
          icon="i-lucide-lightbulb"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { createProductBySlug, listFinishingRatesBySlug, listMachinesBySlug, listProductsBySlug, type FinishingRate, type Machine } from '~/services/seller'
import { useNotification } from '~/composables/useNotification'
import { useAnchoredForm } from '~/composables/useAnchoredForm'
import { useSetupStatusStore } from '~/stores/setupStatus'
import { extractApiFeedback } from '~/utils/api-feedback'
import { normalizeNumberValue, normalizeSelectValue, normalizeTextValue } from '~/utils/payload'

definePageMeta({
  layout: 'dashboard',
  middleware: ['auth', 'shop-owner'],
})

interface ExampleConfig {
  name: string
  description: string
  pricing_mode: 'SHEET' | 'LARGE_FORMAT'
  default_finished_width_mm: number
  default_finished_height_mm: number
  default_sheet_size: string
  min_quantity: number
  min_gsm?: number
  max_gsm?: number
  turnaround_days?: number
  default_sides: 'SIMPLEX' | 'DUPLEX'
}

const route = useRoute()
const notification = useNotification()
const slug = computed(() => route.params.slug as string)

const saving = ref(false)
const submitError = ref('')
const formFieldErrors = ref<Record<string, string>>({})
const selectedFinishingIds = ref<number[]>([])
const machines = ref<Machine[]>([])
const finishingOptions = ref<FinishingRate[]>([])
const formRef = ref<HTMLElement | null>(null)
const { scrollToFirstInvalid } = useAnchoredForm()
const setupStatusStore = useSetupStatusStore()

const exampleOptions = [
  { label: 'Business Cards', value: 'business_cards' },
  { label: 'Flyers', value: 'flyers' },
  { label: 'Brochures', value: 'brochures' },
  { label: 'Roll Up Banners', value: 'roll_up_banners' },
  { label: 'Booklets', value: 'booklets' },
  { label: 'Stickers', value: 'stickers' },
]

const examples: Record<string, ExampleConfig> = {
  business_cards: {
    name: 'Business Cards',
    description: 'Premium business cards for walk-ins, teams, and small business orders.',
    pricing_mode: 'SHEET',
    default_finished_width_mm: 90,
    default_finished_height_mm: 54,
    default_sheet_size: 'SRA3',
    min_quantity: 100,
    min_gsm: 250,
    max_gsm: 350,
    turnaround_days: 2,
    default_sides: 'DUPLEX',
  },
  flyers: {
    name: 'Flyers',
    description: 'Promotional flyers for events, launches, and local campaigns.',
    pricing_mode: 'SHEET',
    default_finished_width_mm: 210,
    default_finished_height_mm: 297,
    default_sheet_size: 'SRA3',
    min_quantity: 100,
    min_gsm: 130,
    max_gsm: 170,
    turnaround_days: 2,
    default_sides: 'SIMPLEX',
  },
  brochures: {
    name: 'Brochures',
    description: 'Folded marketing brochures for sales kits and product information.',
    pricing_mode: 'SHEET',
    default_finished_width_mm: 210,
    default_finished_height_mm: 297,
    default_sheet_size: 'SRA3',
    min_quantity: 100,
    min_gsm: 130,
    max_gsm: 170,
    turnaround_days: 3,
    default_sides: 'DUPLEX',
  },
  roll_up_banners: {
    name: 'Roll Up Banners',
    description: 'Portable event banners produced on large-format media.',
    pricing_mode: 'LARGE_FORMAT',
    default_finished_width_mm: 850,
    default_finished_height_mm: 2000,
    default_sheet_size: '',
    min_quantity: 1,
    turnaround_days: 2,
    default_sides: 'SIMPLEX',
  },
  booklets: {
    name: 'Booklets',
    description: 'Short-run booklets for profiles, reports, and event guides.',
    pricing_mode: 'SHEET',
    default_finished_width_mm: 210,
    default_finished_height_mm: 297,
    default_sheet_size: 'SRA3',
    min_quantity: 50,
    min_gsm: 80,
    max_gsm: 170,
    turnaround_days: 4,
    default_sides: 'DUPLEX',
  },
  stickers: {
    name: 'Stickers',
    description: 'Cut stickers for packaging, branding, and promo items.',
    pricing_mode: 'SHEET',
    default_finished_width_mm: 80,
    default_finished_height_mm: 50,
    default_sheet_size: 'SRA3',
    min_quantity: 50,
    turnaround_days: 2,
    default_sides: 'SIMPLEX',
  },
}

const pricingModes = [
  { label: 'Sheet Product', value: 'SHEET' },
  { label: 'Large Format', value: 'LARGE_FORMAT' },
]

const sidesOptions = [
  { label: 'Simplex', value: 'SIMPLEX' },
  { label: 'Duplex', value: 'DUPLEX' },
]

const sheetSizeOptions = [
  { label: 'A4', value: 'A4' },
  { label: 'A3', value: 'A3' },
  { label: 'SRA3', value: 'SRA3' },
  { label: 'SRA4', value: 'SRA4' },
  { label: 'B2', value: 'B2' },
]

const selectedExample = ref<string | undefined>(undefined)
const form = reactive({
  name: '',
  description: '',
  pricing_mode: 'SHEET',
  default_finished_width_mm: '90',
  default_finished_height_mm: '54',
  default_bleed_mm: '3',
  default_sides: 'DUPLEX',
  min_quantity: '100',
  turnaround_days: '2',
  default_sheet_size: 'SRA3',
  default_machine: undefined as number | undefined,
  allowed_sheet_sizes: ['SRA3'],
  min_gsm: '250',
  max_gsm: '350',
  max_width_mm: '',
  max_height_mm: '',
  allow_simplex: true,
  allow_duplex: true,
})

const machineOptions = computed(() => machines.value.map(machine => ({
  label: machine.name,
  value: machine.id,
})))

const errors = computed(() => ({
  name: form.name.trim() ? null : 'Product name is required.',
  finished_width: Number(form.default_finished_width_mm) > 0 ? null : 'Finished width must be greater than zero.',
  finished_height: Number(form.default_finished_height_mm) > 0 ? null : 'Finished height must be greater than zero.',
}))

const canSubmit = computed(() => Object.values(errors.value).every(value => !value))

const impositionPreview = computed(() => {
  const sizeMap: Record<string, { width: number; height: number }> = {
    A4: { width: 210, height: 297 },
    A3: { width: 297, height: 420 },
    SRA3: { width: 320, height: 450 },
    SRA4: { width: 225, height: 320 },
    B2: { width: 500, height: 707 },
  }

  const parent = sizeMap[form.default_sheet_size] || sizeMap.SRA3 || { width: 320, height: 450 }
  const width = Number(form.default_finished_width_mm) || 0
  const height = Number(form.default_finished_height_mm) || 0
  const bleed = Number(form.default_bleed_mm) || 0
  const quantity = 1000

  if (form.pricing_mode !== 'SHEET' || !width || !height) {
    return {
      fitCount: 0,
      parentSheets: 0,
      summary: 'Large-format products price by area rather than parent-sheet imposition.',
    }
  }

  const effectiveWidth = width + (bleed * 2)
  const effectiveHeight = height + (bleed * 2)
  const normal = Math.floor(parent.width / effectiveWidth) * Math.floor(parent.height / effectiveHeight)
  const rotated = Math.floor(parent.width / effectiveHeight) * Math.floor(parent.height / effectiveWidth)
  const fitCount = Math.max(1, normal, rotated)
  const parentSheets = Math.ceil(quantity / fitCount)

  return {
    fitCount,
    parentSheets,
    summary: `${fitCount} finished pieces fit on ${form.default_sheet_size || 'the selected parent sheet'}, so 1,000 pieces need about ${parentSheets} parent sheets before spoilage and finishing allowances.`,
  }
})

watch(selectedExample, (value) => {
  if (!value || !examples[value]) return
  const example = examples[value]
  form.name = example.name
  form.description = example.description
  form.pricing_mode = example.pricing_mode
  form.default_finished_width_mm = String(example.default_finished_width_mm)
  form.default_finished_height_mm = String(example.default_finished_height_mm)
  form.default_sheet_size = example.default_sheet_size
  form.min_quantity = String(example.min_quantity)
  form.turnaround_days = String(example.turnaround_days ?? '')
  form.default_sides = example.default_sides
  form.min_gsm = example.min_gsm != null ? String(example.min_gsm) : ''
  form.max_gsm = example.max_gsm != null ? String(example.max_gsm) : ''
  form.allowed_sheet_sizes = example.default_sheet_size ? [example.default_sheet_size] : []
})

function toggleSheet(sheet: string) {
  if (form.allowed_sheet_sizes.includes(sheet)) {
    form.allowed_sheet_sizes = form.allowed_sheet_sizes.filter(item => item !== sheet)
    return
  }
  form.allowed_sheet_sizes = [...form.allowed_sheet_sizes, sheet]
}

function toggleFinishing(optionId: number) {
  if (selectedFinishingIds.value.includes(optionId)) {
    selectedFinishingIds.value = selectedFinishingIds.value.filter(item => item !== optionId)
    return
  }
  selectedFinishingIds.value = [...selectedFinishingIds.value, optionId]
}

function toNullableNumber(value: unknown) {
  return normalizeNumberValue(value)
}

function fieldError(field: string) {
  return formFieldErrors.value[field] ?? null
}

function fieldClass(field: string) {
  return fieldError(field)
    ? 'ring-2 ring-orange-400/60 shadow-[0_0_0_8px_rgba(251,146,60,0.08)] animate-[pulse_3s_ease-in-out_infinite]'
    : ''
}

function goBack() {
  navigateTo(`/dashboard/shops/${slug.value}/products`)
}

async function submitForm() {
  submitError.value = ''
  formFieldErrors.value = {}
  if (!canSubmit.value) {
    submitError.value = 'Please check the highlighted product basics before saving.'
    scrollToFirstInvalid(formRef.value)
    return
  }

  saving.value = true

  try {
    await createProductBySlug(slug.value, {
      name: normalizeTextValue(form.name),
      description: normalizeTextValue(form.description),
      pricing_mode: normalizeSelectValue<'SHEET' | 'LARGE_FORMAT'>(form.pricing_mode) ?? 'SHEET',
      default_finished_width_mm: normalizeNumberValue(form.default_finished_width_mm) ?? 0,
      default_finished_height_mm: normalizeNumberValue(form.default_finished_height_mm) ?? 0,
      default_bleed_mm: normalizeNumberValue(form.default_bleed_mm) ?? 3,
      default_sides: normalizeSelectValue<'SIMPLEX' | 'DUPLEX'>(form.default_sides) ?? 'SIMPLEX',
      min_quantity: normalizeNumberValue(form.min_quantity) ?? 1,
      turnaround_days: toNullableNumber(form.turnaround_days),
      default_sheet_size: normalizeSelectValue<string>(form.pricing_mode) === 'SHEET' ? (normalizeSelectValue<string>(form.default_sheet_size) ?? '') : '',
      default_machine: normalizeSelectValue<number>(form.default_machine) ?? undefined,
      min_gsm: toNullableNumber(form.min_gsm),
      max_gsm: toNullableNumber(form.max_gsm),
      max_width_mm: toNullableNumber(form.max_width_mm),
      max_height_mm: toNullableNumber(form.max_height_mm),
      allowed_sheet_sizes: form.allowed_sheet_sizes,
      allow_simplex: form.allow_simplex,
      allow_duplex: form.allow_duplex,
      status: 'DRAFT',
      is_active: true,
      finishing_options: selectedFinishingIds.value.map((id) => ({
        finishing_rate: id,
        is_default: false,
      })),
    })

    await Promise.all([
      listProductsBySlug(slug.value),
      setupStatusStore.fetchStatus(slug.value),
    ])
    notification.success('Product created successfully. Review pricing readiness before publishing it.')
    await navigateTo(`/dashboard/shops/${slug.value}/products`)
  } catch (error) {
    const feedback = extractApiFeedback(error, 'We could not save this product yet.')
    submitError.value = feedback.message
    formFieldErrors.value = feedback.fieldErrors
    scrollToFirstInvalid(formRef.value)
  } finally {
    saving.value = false
  }
}

onMounted(async () => {
  try {
    const [loadedMachines, loadedFinishings] = await Promise.all([
      listMachinesBySlug(slug.value),
      listFinishingRatesBySlug(slug.value),
    ])
    machines.value = loadedMachines
    finishingOptions.value = loadedFinishings
  } catch {
    machines.value = []
    finishingOptions.value = []
  }
})
</script>
