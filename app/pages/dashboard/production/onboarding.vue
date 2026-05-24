<template>
  <RoleDashboardFrame
    title="Production Onboarding"
    badge="Production"
    :name="displayName"
    :initials="initials"
    subtitle="Set up your print shop"
    breadcrumb-root="Dashboard"
    :nav-items="navItems"
    support-title="Need this later?"
    support-copy="You can return to onboarding any time to update your shop profile, papers, pricing, and launch state."
    support-action="Open Dashboard"
    support-to="/dashboard/production"
    @logout="auth.logout()"
  >
    <BaseAlert
      v-if="pageError"
      variant="error"
      title="Production onboarding could not load."
      :message="pageError"
    />

    <DashboardSection v-if="isBooting" title="Loading onboarding" subtitle="Preparing your production setup context.">
      <div class="p-6">
        <BaseCard variant="soft" padding="lg" radius="xl">
          <p class="text-sm text-slate-600">Loading shop, paper, pricing, and finishing data...</p>
        </BaseCard>
      </div>
    </DashboardSection>

    <DashboardSection v-else title="Set up your print shop" subtitle="Four guided steps. Stay on one page and keep moving.">
      <div class="border-b border-slate-100 px-6 py-5">
        <div class="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p class="text-sm font-bold text-slate-900">Step {{ activeStep }} of {{ totalSteps }}</p>
            <p class="mt-1 text-sm text-slate-500">{{ activeStepTitle }}</p>
          </div>
          <div class="flex items-center gap-2">
            <div
              v-for="step in steps"
              :key="step.value"
              class="h-2.5 w-14 rounded-full"
              :class="step.value <= activeStep ? 'bg-[#e13515]' : 'bg-slate-200'"
            />
          </div>
        </div>
      </div>

      <div class="space-y-6 p-6">
        <BaseAlert
          v-if="successMessage"
          variant="success"
          title="Saved"
          :message="successMessage"
        />

        <div v-show="activeStep === 1" class="grid gap-6 xl:grid-cols-[1.08fr_0.92fr]">
          <div class="space-y-4">
            <div class="grid gap-4 md:grid-cols-2">
              <BaseInput v-model="shopForm.name" label="Shop name" required :error="shopErrors.name" variant="dashboard" />
              <BaseInput v-model="shopForm.phone_number" label="Phone / WhatsApp" required :error="shopErrors.phone_number" variant="dashboard" />
              <BaseInput v-model="shopForm.city" label="Location / area in Nairobi" required :error="shopErrors.city" variant="dashboard" />
              <BaseInput v-model="shopForm.service_area" label="Pickup or delivery area" required :error="shopErrors.service_area" variant="dashboard" />
            </div>
            <BaseTextarea v-model="shopForm.description" label="Short description" variant="dashboard" :maxlength="200" :error="shopErrors.description" />

            <div class="rounded-2xl border border-slate-200 bg-white px-4 py-4">
              <div class="space-y-3">
                <div>
                  <p class="text-sm font-bold text-slate-900">Delivery available?</p>
                  <p class="mt-1 text-sm text-slate-500">Tell Printy whether this shop can handle delivery handoff.</p>
                </div>
                <div class="flex flex-wrap gap-4">
                  <label class="inline-flex items-center gap-2 text-sm font-semibold text-slate-700">
                    <input v-model="shopForm.offers_delivery" :value="false" type="radio" name="offers_delivery" class="h-4 w-4 border-slate-300 text-[#e13515] focus:ring-[#e13515]">
                    Collection only
                  </label>
                  <label class="inline-flex items-center gap-2 text-sm font-semibold text-slate-700">
                    <input v-model="shopForm.offers_delivery" :value="true" type="radio" name="offers_delivery" class="h-4 w-4 border-slate-300 text-[#e13515] focus:ring-[#e13515]">
                    Yes, we deliver
                  </label>
                </div>
              </div>
            </div>
          </div>

          <BaseCard variant="soft" padding="lg" radius="xl" class="space-y-4">
            <div>
              <p class="text-xs font-bold uppercase tracking-[0.18em] text-[#e13515]">Step 1</p>
              <h3 class="mt-2 text-xl font-black text-slate-950">Create the real shop record first.</h3>
            </div>
            <ul class="space-y-3 text-sm text-slate-600">
              <li>This saves directly to the production shop endpoint.</li>
              <li>The returned shop slug is reused for paper stock and finishing endpoints.</li>
              <li>If the user refreshes later, this step rehydrates from the saved shop and current rate-card setup.</li>
            </ul>
          </BaseCard>
        </div>

        <div v-show="activeStep === 2" class="space-y-5">
          <div class="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p class="text-lg font-bold text-slate-950">Paper stock</p>
              <p class="text-sm text-slate-500">Start with two rows. Each row saves independently, and failures stay inline.</p>
            </div>
            <BaseButton variant="secondary" size="sm" :disabled="paperRows.length >= 10" @click="addPaperRow">Add paper row</BaseButton>
          </div>

          <div class="space-y-4">
            <BaseCard v-for="row in paperRows" :key="row.localId" variant="bordered" padding="lg" radius="xl">
              <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
                <BaseInput v-model="row.name" label="Paper name" variant="dashboard" :error="row.errors.name" />
                <BaseSelect v-model="row.sheet_size" label="Size" :options="sheetSizeOptions" variant="dashboard" :error="row.errors.sheet_size" />
                <BaseInput v-model="row.gsm" type="number" min="1" label="GSM" variant="dashboard" :error="row.errors.gsm" />
                <BaseInput v-model="row.cost_per_sheet" type="number" min="0" step="0.01" label="Cost per sheet (KES)" variant="dashboard" :error="row.errors.cost_per_sheet" />
                <BaseInput v-model="row.quantity_in_stock" type="number" min="0" step="1" label="Qty in stock" variant="dashboard" :error="row.errors.quantity_in_stock" />
              </div>
              <div class="mt-4 flex flex-wrap items-center justify-between gap-3">
                <label class="inline-flex items-center gap-2 text-sm font-medium text-slate-700">
                  <input v-model="row.is_active" type="checkbox" class="h-4 w-4 rounded border-slate-300 text-[#e13515] focus:ring-[#e13515]">
                  In stock / active
                </label>
                <div class="flex items-center gap-2">
                  <span v-if="row.saving" class="text-xs font-semibold text-slate-500">Saving...</span>
                  <span v-else-if="row.saved" class="text-xs font-semibold text-green-600">Saved</span>
                  <BaseButton variant="ghost" size="sm" :disabled="paperRows.length <= 1" @click="removePaperRow(row.localId)">Remove</BaseButton>
                </div>
              </div>
              <BaseAlert v-if="row.errorMessage" class="mt-4" variant="error" :message="row.errorMessage" />
            </BaseCard>
          </div>
        </div>

        <div v-show="activeStep === 3" class="grid gap-6 xl:grid-cols-[1.12fr_0.88fr]">
          <div class="space-y-4">
            <div class="flex items-center justify-between gap-3">
              <div>
                <p class="text-lg font-bold text-slate-950">Pricing</p>
                <p class="text-sm text-slate-500">Enable paper types and enter raw production prices. Preview updates automatically.</p>
                <p class="mt-1 text-xs font-medium text-slate-500">Suggested from market defaults - edit to match your shop.</p>
              </div>
              <span v-if="previewLoading" class="text-xs font-semibold text-slate-500">Refreshing preview...</span>
            </div>

            <div class="space-y-3">
              <BaseCard v-for="row in pricingRows" :key="row.key || row.id" variant="bordered" padding="lg" radius="xl">
                <div class="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p class="text-sm font-bold text-slate-900">{{ row.label || row.paper_name || row.key }}</p>
                    <p class="mt-1 text-xs text-slate-500">{{ row.size || 'SRA3/A3' }} · {{ row.category || row.paper_type || 'Paper stock' }}</p>
                  </div>
                  <label class="inline-flex items-center gap-2 text-sm font-medium text-slate-700">
                    <input v-model="row.active" type="checkbox" class="h-4 w-4 rounded border-slate-300 text-[#e13515] focus:ring-[#e13515]">
                    Enable
                  </label>
                </div>
                <div class="mt-4 grid gap-4 md:grid-cols-2">
                  <BaseInput v-model="row.paper_base_price" type="number" min="0" step="0.01" label="Paper base price (KES)" variant="dashboard" />
                  <BaseInput :model-value="paperPreviewRow(row).formula_shop_visible?.single || ''" label="Shop formula" variant="dashboard" disabled />
                </div>
                <div class="mt-4 grid gap-3 md:grid-cols-2">
                  <div class="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                    <p class="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">Single-sided total</p>
                    <p class="mt-2 text-sm font-bold text-slate-900">KES {{ paperPreviewRow(row).manager_visible_single_total || '0.00' }}</p>
                  </div>
                  <div class="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                    <p class="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">Double-sided total</p>
                    <p class="mt-2 text-sm font-bold text-slate-900">
                      {{ paperPreviewRow(row).double_sided_enabled === false ? 'Single-sided only' : `KES ${paperPreviewRow(row).manager_visible_double_total || '0.00'}` }}
                    </p>
                  </div>
                </div>
                <div v-if="paperPreviewRow(row).warnings?.length" class="mt-4 space-y-2">
                  <BaseAlert v-for="warning in paperPreviewRow(row).warnings" :key="warning" variant="warning" :message="warning" />
                </div>
              </BaseCard>
            </div>
          </div>

          <BaseCard variant="soft" padding="lg" radius="xl" class="space-y-4">
            <div>
              <p class="text-xs font-bold uppercase tracking-[0.18em] text-[#e13515]">Trust moment</p>
              <h3 class="mt-2 text-xl font-black text-slate-950">With these prices you can offer:</h3>
            </div>
            <BaseAlert v-if="previewError" variant="error" :message="previewError" />
            <div v-else class="space-y-3">
              <div v-for="product in capabilityPreviewRows" :key="product.key" class="rounded-2xl border border-slate-200 bg-white px-4 py-3">
                <div class="flex items-start justify-between gap-3">
                  <div>
                    <p class="text-sm font-bold text-slate-900">{{ product.label }}</p>
                    <p v-if="product.detail" class="mt-1 text-xs text-slate-500">{{ product.detail }}</p>
                  </div>
                  <p class="text-sm font-black text-slate-900">{{ product.priceText }}</p>
                </div>
              </div>
              <BaseAlert v-if="exampleQuoteSummary" variant="default" :title="exampleQuoteSummary.title" :message="exampleQuoteSummary.message" />
              <BaseAlert v-if="!capabilityPreviewRows.length && !previewLoading" variant="warning" message="Capability preview is limited until at least one paper price is enabled." />
            </div>
          </BaseCard>
        </div>

        <div v-show="activeStep === 4" class="grid gap-6 xl:grid-cols-[1.08fr_0.92fr]">
          <div class="space-y-4">
            <BaseCard variant="bordered" padding="lg" radius="xl">
              <p class="text-sm font-bold text-slate-900">Shop summary</p>
              <div class="mt-3 space-y-2 text-sm text-slate-600">
                <p><span class="font-semibold text-slate-800">Shop:</span> {{ shopForm.name || 'Not saved yet' }}</p>
                <p><span class="font-semibold text-slate-800">Location:</span> {{ shopForm.service_area || shopForm.city || 'Not set' }}</p>
                <p><span class="font-semibold text-slate-800">Papers added:</span> {{ savedPaperCount }}</p>
                <p><span class="font-semibold text-slate-800">Products enabled:</span> {{ activePricingCount }}</p>
                <p><span class="font-semibold text-slate-800">Delivery available:</span> {{ shopForm.offers_delivery ? 'Yes' : 'No' }}</p>
              </div>
            </BaseCard>

            <BaseCard variant="bordered" padding="lg" radius="xl">
              <p class="text-sm font-bold text-slate-900">Estimated price range</p>
              <div class="mt-3 space-y-3">
                <div v-if="estimatedPriceRangeText" class="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
                  <p class="text-sm font-black text-slate-950">{{ estimatedPriceRangeText }}</p>
                  <p class="mt-1 text-xs text-slate-500">Derived from the current live preview response.</p>
                </div>
                <div v-for="product in capabilityPreviewRows" :key="`review-${product.key}`" class="rounded-2xl border border-slate-200 bg-white px-4 py-3">
                  <p class="text-sm font-bold text-slate-900">{{ product.label }}</p>
                  <p class="mt-1 text-xs text-slate-500">{{ product.priceText }}</p>
                </div>
              </div>
            </BaseCard>

            <BaseCard variant="bordered" padding="lg" radius="xl" class="space-y-4">
              <div class="flex items-center justify-between gap-3">
                <div>
                  <p class="text-sm font-bold text-slate-900">Finishings</p>
                  <p class="mt-1 text-xs text-slate-500">Optional but useful for the first capability preview.</p>
                </div>
              </div>
              <div class="space-y-3">
                <BaseCard v-for="row in finishingRows" :key="row.key || row.id" variant="soft" padding="md" radius="xl">
                  <div class="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <p class="text-sm font-bold text-slate-900">{{ row.label || row.name }}</p>
                      <p class="mt-1 text-xs text-slate-500">{{ finishingPricingLabel(row) }}</p>
                    </div>
                    <label class="inline-flex items-center gap-2 text-sm font-medium text-slate-700">
                      <input v-model="row.active" type="checkbox" class="h-4 w-4 rounded border-slate-300 text-[#e13515] focus:ring-[#e13515]">
                      Enable
                    </label>
                  </div>
                  <div class="mt-4 grid gap-4 md:grid-cols-2">
                    <BaseInput v-model="row.price" type="number" min="0" step="0.01" label="Price (KES)" variant="dashboard" />
                    <BaseInput :model-value="finishingPreviewLabel(row)" label="Pricing rule" variant="dashboard" disabled />
                  </div>
                  <p v-if="row.minimum_charge" class="mt-3 text-xs text-slate-500">Minimum charge: KES {{ row.minimum_charge }}</p>
                  <p v-if="finishingPreviewRow(row).shop_visible_formula" class="mt-2 text-xs text-slate-600">{{ finishingPreviewRow(row).shop_visible_formula }}</p>
                  <BaseAlert v-if="row.errorMessage" class="mt-4" variant="error" :message="row.errorMessage" />
                </BaseCard>
              </div>
            </BaseCard>
          </div>

          <BaseCard variant="soft" padding="lg" radius="xl" class="space-y-4">
            <div>
              <p class="text-xs font-bold uppercase tracking-[0.18em] text-[#e13515]">Go live</p>
              <h3 class="mt-2 text-xl font-black text-slate-950">Ready to start receiving jobs</h3>
            </div>
            <div v-if="setupSummary" class="space-y-2 text-sm text-slate-600">
              <p><span class="font-semibold text-slate-800">Products unlocked:</span> {{ setupSummary.products_unlocked ?? capabilityPreviewRows.length }}</p>
              <p><span class="font-semibold text-slate-800">Pricing items added:</span> {{ setupSummary.pricing_items_added ?? activePricingCount }}</p>
            </div>
            <BaseButton block size="lg" :loading="completingOnboarding" @click="finishOnboarding">Go live - start receiving jobs</BaseButton>
          </BaseCard>
        </div>

        <div class="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
          <BaseButton v-if="activeStep > 1" variant="secondary" @click="goBack">Back</BaseButton>
          <span v-else />
          <BaseButton
            v-if="activeStep < totalSteps"
            :loading="stepLoading"
            @click="handleContinue"
          >
            Continue
          </BaseButton>
        </div>
      </div>
    </DashboardSection>
  </RoleDashboardFrame>
</template>

<script setup lang="ts">
import BaseAlert from '~/components/base/BaseAlert.vue'
import BaseButton from '~/components/base/BaseButton.vue'
import BaseCard from '~/components/base/BaseCard.vue'
import BaseInput from '~/components/base/BaseInput.vue'
import BaseSelect from '~/components/base/BaseSelect.vue'
import BaseTextarea from '~/components/base/BaseTextarea.vue'
import DashboardSection from '~/components/dashboard/DashboardSection.vue'
import RoleDashboardFrame from '~/components/dashboard/RoleDashboardFrame.vue'
import { useForShopsApi } from '~/services/for-shops'
import { useShopsApi, type FinishingRateRecord, type PaperRecord, type ShopRecord } from '~/services/shops'
import { getApiErrorMessage } from '~/shared/api'

definePageMeta({
  layout: false,
  middleware: 'auth',
})

useHead({
  title: 'Printy - Production Onboarding',
})

type PaperDraft = {
  localId: string
  id?: number
  name: string
  gsm: string
  sheet_size: string
  cost_per_sheet: string
  quantity_in_stock: string
  is_active: boolean
  saving: boolean
  saved: boolean
  errorMessage: string
  errors: Record<string, string>
}

type PricingRow = Record<string, any>
type FinishingRow = Record<string, any> & { errorMessage?: string }

const auth = useAuthStore()
const { previewForShops, fetchForShopsConfig } = useForShopsApi()
const {
  completeShopRateCardSetup,
  createShop,
  createShopFinishingRate,
  createShopPaper,
  fetchMyShops,
  fetchShopRateCardSetup,
  listShopFinishingRates,
  listShopPapers,
  saveShopRateCardSetup,
  updateShop,
  updateShopFinishingRate,
  updateShopPaper,
} = useShopsApi()
if (!auth.canAccessProductionDashboard) {
  await navigateTo(auth.homeRoute)
}

const route = useRoute()
const displayName = computed(() => auth.user?.name || auth.user?.email || 'Production')
const initials = computed(() => displayName.value.split(' ').map(part => part[0]).join('').slice(0, 2).toUpperCase() || 'PD')

const steps = [
  { value: 1, key: 'shop', label: 'Shop profile' },
  { value: 2, key: 'paper-stock', label: 'Paper stock' },
  { value: 3, key: 'pricing', label: 'Pricing' },
  { value: 4, key: 'review', label: 'Review and go live' },
]

const totalSteps = steps.length
const requestedStep = String(route.query.step || '').toLowerCase()
const initialStep = Math.max(1, steps.find(step => step.key === requestedStep)?.value || 1)
const activeStep = ref(initialStep)
const activeStepTitle = computed(() => steps.find(step => step.value === activeStep.value)?.label || 'Onboarding')

const navItems = computed(() => [
  { label: 'Overview', to: '/dashboard/production' },
  { label: 'Onboarding', to: '/dashboard/production/onboarding', active: true },
  { label: 'Paper', to: '/dashboard/production/paper-stock' },
  { label: 'Pricing', to: '/dashboard/production/pricing' },
  { label: 'Finishings', to: '/dashboard/production/finishings' },
  { label: 'Messages', to: '/dashboard/production/messages' },
])

const sheetSizeOptions = [
  { label: 'A4', value: 'A4' },
  { label: 'A3', value: 'A3' },
  { label: 'A5', value: 'A5' },
  { label: 'SRA3', value: 'SRA3' },
  { label: 'Custom', value: 'Custom' },
]

const finishingPricingOptions = [
  { label: 'Per side', value: 'per_side' },
  { label: 'Per piece', value: 'per_piece' },
  { label: 'Per job', value: 'per_job' },
]

const pageError = ref('')
const successMessage = ref('')
const stepLoading = ref(false)
const previewLoading = ref(false)
const previewError = ref('')
const completingOnboarding = ref(false)
const isBooting = ref(true)

const currentShop = ref<ShopRecord | null>(null)
const currentShopSlug = computed(() => currentShop.value?.slug || '')
const existingPapers = ref<PaperRecord[]>([])
const existingFinishings = ref<FinishingRateRecord[]>([])
const setupState = ref<Record<string, any> | null>(null)
const previewState = ref<Record<string, any> | null>(null)
const builderConfig = ref<Record<string, any> | null>(null)

const shopForm = reactive({
  name: '',
  city: '',
  phone_number: '',
  service_area: '',
  description: '',
  delivery_available: false,
  offers_delivery: false,
})
const shopErrors = reactive<Record<string, string>>({})

const paperRows = ref<PaperDraft[]>([])
const pricingRows = ref<PricingRow[]>([])
const finishingRows = ref<FinishingRow[]>([])

let previewTimer: ReturnType<typeof setTimeout> | null = null

function createPaperDraft(overrides: Partial<PaperDraft> = {}): PaperDraft {
  return {
    localId: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    name: '',
    gsm: '',
    sheet_size: 'SRA3',
    cost_per_sheet: '',
    quantity_in_stock: '',
    is_active: true,
    saving: false,
    saved: false,
    errorMessage: '',
    errors: {},
    ...overrides,
  }
}

function normalizeShopForm(shop: ShopRecord | null, setup: Record<string, any> | null) {
  const shopDetails = setup?.shop_details || {}
  shopForm.name = shop?.name || shopDetails.shop_name || ''
  shopForm.city = shop?.city || shop?.service_area || shopDetails.location_area || ''
  shopForm.phone_number = shop?.public_whatsapp_number || shop?.phone_number || shopDetails.whatsapp_number || ''
  shopForm.service_area = shop?.service_area || shopDetails.location_area || shop?.city || ''
  shopForm.description = shop?.description || ''
  const offersDelivery = Boolean(
    shop?.delivery_available
    ?? shopDetails.delivery_available
    ?? shop?.offers_delivery
    ?? false
  )
  shopForm.delivery_available = offersDelivery
  shopForm.offers_delivery = offersDelivery
}

function normalizePaperRows(papers: PaperRecord[]) {
  if (papers.length > 0) {
    paperRows.value = papers.map((paper) => createPaperDraft({
      id: paper.id,
      name: paper.name || paper.display_name || '',
      gsm: paper.gsm ? String(paper.gsm) : '',
      sheet_size: paper.sheet_size || 'SRA3',
      cost_per_sheet: String(paper.buying_price ?? paper.selling_price ?? ''),
      quantity_in_stock: paper.quantity_in_stock === undefined || paper.quantity_in_stock === null ? '' : String(paper.quantity_in_stock),
      is_active: Boolean(paper.is_active),
      saved: true,
    }))
    return
  }

  paperRows.value = [createPaperDraft(), createPaperDraft()]
}

function normalizePricingRows() {
  pricingRows.value = JSON.parse(JSON.stringify(setupState.value?.paper_rows || builderConfig.value?.paper_rows || []))
}

function normalizeFinishingRows() {
  const rows = JSON.parse(JSON.stringify(setupState.value?.finishing_rows || builderConfig.value?.finishing_rows || []))
  const persistedByName = new Map(existingFinishings.value.map(item => [item.name.toLowerCase(), item]))
  finishingRows.value = rows.map((row: FinishingRow) => ({
    ...row,
    pricing_type: inferFinishingPricingType(row, persistedByName.get(String(row.name || row.label || '').toLowerCase()) || null),
  }))
}

function buildShopPayload() {
  return {
    name: shopForm.name.trim(),
    business_email: auth.user?.email || '',
    address_line: shopForm.service_area.trim() || shopForm.city.trim(),
    city: shopForm.city.trim(),
    state: 'Nairobi',
    country: 'Kenya',
    zip_code: '00100',
    phone_number: shopForm.phone_number.trim(),
    public_whatsapp_number: shopForm.phone_number.trim(),
    service_area: shopForm.service_area.trim(),
    description: shopForm.description.trim(),
    delivery_available: shopForm.offers_delivery,
    offers_delivery: shopForm.offers_delivery,
    is_public: false,
  }
}

function inferPaperCategory(name: string, gsm: string) {
  const normalized = `${name} ${gsm}`.toLowerCase()
  if (normalized.includes('sticker') || normalized.includes('tictac')) return 'sticker'
  if (normalized.includes('ivory')) return 'ivory'
  if (normalized.includes('board')) return 'cover_board'
  if (normalized.includes('art card') || normalized.includes('artcard')) return 'artcard'
  if (normalized.includes('gloss')) return 'gloss'
  return 'matt'
}

function inferPaperType(name: string) {
  const normalized = name.toLowerCase()
  if (normalized.includes('gloss')) return 'GLOSS'
  if (normalized.includes('sticker') || normalized.includes('tictac')) return 'STICKER'
  if (normalized.includes('bond')) return 'BOND'
  return 'MATTE'
}

function validatePaperRow(row: PaperDraft) {
  row.errors = {}
  row.errorMessage = ''
  if (!row.name.trim()) row.errors.name = 'Paper name is required.'
  if (!row.sheet_size.trim()) row.errors.sheet_size = 'Choose a size.'
  if (!row.gsm || Number(row.gsm) <= 0) row.errors.gsm = 'Enter a valid GSM.'
  if (row.cost_per_sheet === '' || Number(row.cost_per_sheet) < 0) row.errors.cost_per_sheet = 'Enter a valid cost per sheet.'
  if (row.quantity_in_stock === '' || Number(row.quantity_in_stock) < 0) row.errors.quantity_in_stock = 'Enter a valid quantity.'
  return Object.keys(row.errors).length === 0
}

function paperPayload(row: PaperDraft) {
  return {
    name: row.name.trim(),
    sheet_size: row.sheet_size,
    gsm: Number(row.gsm),
    category: inferPaperCategory(row.name, row.gsm),
    paper_type: inferPaperType(row.name),
    buying_price: Number(row.cost_per_sheet || 0).toFixed(2),
    selling_price: Number(row.cost_per_sheet || 0).toFixed(2),
    quantity_in_stock: row.quantity_in_stock === '' ? 0 : Number(row.quantity_in_stock),
    is_active: row.is_active,
    available_for_quoting: row.is_active,
  }
}

function buildShopDetailsPayload() {
  return {
    shop_name: shopForm.name.trim(),
    whatsapp_number: shopForm.phone_number.trim(),
    location_area: shopForm.service_area.trim() || shopForm.city.trim(),
    delivery_available: shopForm.offers_delivery,
  }
}

function buildPreviewPayload() {
  return {
    paper_rows: serializePaperRows(pricingRows.value),
    finishing_rows: serializeFinishingRows(finishingRows.value),
  }
}

function schedulePreview() {
  if (previewTimer) {
    clearTimeout(previewTimer)
  }
  previewTimer = setTimeout(() => {
    void refreshPreview()
  }, 600)
}

async function refreshPreview() {
  previewLoading.value = true
  previewError.value = ''
  try {
    previewState.value = await previewForShops(buildPreviewPayload())
  } catch (error: unknown) {
    previewError.value = getApiErrorMessage(error, 'Live capability preview is unavailable right now.')
  } finally {
    previewLoading.value = false
  }
}

function formatKes(value: unknown) {
  if (value === null || value === undefined || value === '') {
    return ''
  }
  const amount = Number(String(value).replace(/[^0-9.-]/g, ''))
  if (!Number.isFinite(amount)) {
    return ''
  }
  return `KES ${new Intl.NumberFormat('en-KE').format(Math.round(amount))}`
}

function extractPriceRange(source: Record<string, any>) {
  const min = source.market_price_min ?? source.min_price ?? source.price_min ?? source.low_price
  const max = source.market_price_max ?? source.max_price ?? source.price_max ?? source.high_price
  const exact = source.market_price ?? source.client_price ?? source.price ?? source.estimated_total
  if (min !== undefined && max !== undefined) {
    const left = formatKes(min)
    const right = formatKes(max)
    return left && right ? `${left} - ${right}` : ''
  }
  return formatKes(exact)
}

const previewProducts = computed(() => {
  const summary = (previewState.value?.summary || setupState.value?.summary || {}) as Record<string, any>
  return Array.isArray(summary.unlocked_products) ? summary.unlocked_products.slice(0, 6) : []
})

const setupSummary = computed(() => (previewState.value?.summary || setupState.value?.summary || null) as Record<string, any> | null)
const activePricingCount = computed(() => pricingRows.value.filter(row => row.active).length)
const savedPaperCount = computed(() => paperRows.value.filter(row => row.saved || row.id).length)
const exampleQuoteSummary = computed(() => {
  const exampleQuote = (previewState.value?.example_quote || setupState.value?.example_quote || null) as Record<string, any> | null
  if (!exampleQuote) {
    return null
  }
  return {
    title: exampleQuote.title || 'Example quote',
    message: exampleQuote.status_text || `Estimated raw production cost: ${exampleQuote.production_cost || 'Pending'}`,
  }
})

const capabilityPreviewRows = computed(() => {
  const exampleQuote = (previewState.value?.example_quote || setupState.value?.example_quote || null) as Record<string, any> | null
  const rows = previewProducts.value.map((product, index) => {
    const record = product as Record<string, any>
    return {
      key: String(record.key || record.slug || record.label || index),
      label: String(record.label || record.name || record.product_type || 'Available product'),
      detail: String(record.reason || record.size || record.paper_label || '').trim(),
      priceText: extractPriceRange(record) || 'Estimated from active rate card',
    }
  })

  if (rows.length > 0) {
    return rows
  }

  if (exampleQuote) {
    return [{
      key: 'example-quote',
      label: String(exampleQuote.title || exampleQuote.paper_label || 'Preview quote'),
      detail: String(exampleQuote.status_text || '').trim(),
      priceText: extractPriceRange(exampleQuote) || formatKes(exampleQuote.production_cost) || 'Pending',
    }]
  }

  return []
})

const estimatedPriceRangeText = computed(() => {
  const prices = capabilityPreviewRows.value
    .map(row => row.priceText)
    .filter(Boolean)
  return prices.length ? prices[0] : ''
})

function clearShopErrors() {
  for (const key of Object.keys(shopErrors)) {
    delete shopErrors[key]
  }
}

function readFieldErrors(error: unknown) {
  const data = (error as { data?: unknown })?.data || {}
  return typeof data === 'object' && data ? data as Record<string, unknown> : {}
}

function inferFinishingPricingType(row: Record<string, any>, persisted?: Record<string, any> | null) {
  const source = persisted || row
  const name = String(source?.name || row?.name || row?.label || '').toLowerCase()
  const billingBasis = String(source?.billing_basis || row?.billing_basis || row?.pricing_mode || '').toLowerCase()
  const sideMode = String(source?.side_mode || row?.side_mode || '').toLowerCase()
  const chargeUnit = String(source?.charge_unit || row?.charge_unit || '').toUpperCase()
  if (sideMode === 'per_selected_side' || chargeUnit === 'PER_SIDE' || chargeUnit === 'PER_SIDE_PER_SHEET' || name.includes('lamination')) {
    return 'per_side'
  }
  if (billingBasis.startsWith('flat_') || chargeUnit === 'FLAT' || name.includes('cutting')) {
    return 'per_job'
  }
  return 'per_piece'
}

function finishingPricingLabel(row: Record<string, any>) {
  if (row.pricing_type === 'per_side') return 'Priced per side'
  if (row.pricing_type === 'per_job') return 'Priced per job'
  return 'Priced per piece'
}

function finishingPreviewLabel(row: Record<string, any>) {
  return String(row.pricing_mode || row.unit || finishingPricingLabel(row)).replace(/_/g, ' ')
}

function serializePaperRows(rows: Array<Record<string, any>>) {
  return rows.map(row => ({
    key: row.key,
    id: row.id,
    label: row.label,
    paper_name: row.paper_name,
    gsm: row.gsm,
    paper_type: row.paper_type,
    category: row.category,
    size: row.size,
    paper_base_price: row.paper_base_price,
    single_print_base: row.single_print_base,
    double_print_base: row.double_print_base,
    heavy_paper_surcharge: row.heavy_paper_surcharge,
    surcharge_threshold_gsm: row.surcharge_threshold_gsm,
    active: Boolean(row.active),
  }))
}

function serializeFinishingRows(rows: Array<Record<string, any>>) {
  return rows.map(row => ({
    key: row.key,
    id: row.id,
    label: row.label,
    name: row.name,
    pricing_mode: row.pricing_mode,
    unit: row.unit,
    price: row.price,
    minimum_charge: row.minimum_charge,
    active: Boolean(row.active),
  }))
}

function paperPreviewRow(row: Record<string, any>) {
  const source = Array.isArray(previewState.value?.paper_rows) ? previewState.value?.paper_rows : setupState.value?.paper_rows
  return source?.find((item: Record<string, any>) => item.key === row.key) || row
}

function finishingPreviewRow(row: Record<string, any>) {
  const source = Array.isArray(previewState.value?.finishing_rows) ? previewState.value?.finishing_rows : setupState.value?.finishing_rows
  return source?.find((item: Record<string, any>) => item.key === row.key) || row
}

async function loadSetupContext() {
  pageError.value = ''
  try {
    const [shops, config] = await Promise.all([
      fetchMyShops(),
      fetchForShopsConfig(),
    ])
    builderConfig.value = config
    currentShop.value = shops.find(shop => shop?.is_active !== false) || shops[0] || null

    if (currentShop.value?.slug) {
      const [setup, papers, finishings] = await Promise.all([
        fetchShopRateCardSetup(currentShop.value.slug),
        listShopPapers(currentShop.value.slug),
        listShopFinishingRates(currentShop.value.slug),
      ])
      setupState.value = setup
      existingPapers.value = papers
      existingFinishings.value = finishings
    }

    normalizeShopForm(currentShop.value, setupState.value)
    normalizePaperRows(existingPapers.value)
    normalizePricingRows()
    normalizeFinishingRows()
    await refreshPreview()
  } catch (error: unknown) {
    pageError.value = getApiErrorMessage(error, 'Production onboarding could not load its current shop context.')
    if (!paperRows.value.length) {
      normalizePaperRows([])
    }
    if (!pricingRows.value.length) {
      normalizePricingRows()
    }
    if (!finishingRows.value.length) {
      normalizeFinishingRows()
    }
  } finally {
    isBooting.value = false
  }
}

watch(
  () => [pricingRows.value, finishingRows.value].map(value => JSON.stringify(value)).join('|'),
  () => {
    if (!isBooting.value && activeStep.value >= 3) {
      schedulePreview()
    }
  },
)

function goBack() {
  successMessage.value = ''
  activeStep.value = Math.max(1, activeStep.value - 1)
}

function addPaperRow() {
  if (paperRows.value.length >= 10) {
    return
  }
  paperRows.value.push(createPaperDraft())
}

function removePaperRow(localId: string) {
  paperRows.value = paperRows.value.filter(row => row.localId !== localId)
}

async function saveShopStep() {
  clearShopErrors()
  successMessage.value = ''

  if (!shopForm.name.trim()) shopErrors.name = 'Shop name is required.'
  if (!shopForm.phone_number.trim()) shopErrors.phone_number = 'Phone / WhatsApp is required.'
  if (!shopForm.city.trim()) shopErrors.city = 'Location is required.'
  if (!shopForm.service_area.trim()) shopErrors.service_area = 'Area is required.'
  if (shopForm.description.length > 200) shopErrors.description = 'Keep the description under 200 characters.'
  if (Object.keys(shopErrors).length > 0) {
    throw new Error('Please complete the required shop fields.')
  }

  const payload = buildShopPayload()
  try {
    if (currentShopSlug.value) {
      currentShop.value = await updateShop(currentShopSlug.value, payload)
    } else {
      currentShop.value = await createShop(payload)
      await auth.fetchMe()
    }
    setupState.value = await fetchShopRateCardSetup(currentShop.value.slug)
    normalizeShopForm(currentShop.value, setupState.value)
    successMessage.value = 'Shop profile saved.'
  } catch (error: unknown) {
    const fieldErrors = readFieldErrors(error)
    if (Array.isArray(fieldErrors.name)) shopErrors.name = String(fieldErrors.name[0])
    if (Array.isArray(fieldErrors.city)) shopErrors.city = String(fieldErrors.city[0])
    if (Array.isArray(fieldErrors.phone_number)) shopErrors.phone_number = String(fieldErrors.phone_number[0])
    if (Array.isArray(fieldErrors.service_area)) shopErrors.service_area = String(fieldErrors.service_area[0])
    throw error
  }
}

async function savePaperStep() {
  successMessage.value = ''
  if (!currentShopSlug.value) {
    throw new Error('Create the shop profile first.')
  }

  let successes = 0
  await Promise.all(paperRows.value.map(async (row) => {
    if (!validatePaperRow(row)) {
      row.errorMessage = 'This row has validation issues.'
      return
    }
    row.saving = true
    row.errorMessage = ''
    try {
      const saved = row.id
        ? await updateShopPaper(currentShopSlug.value, row.id, paperPayload(row))
        : await createShopPaper(currentShopSlug.value, paperPayload(row))
      row.id = saved.id
      row.saved = true
      row.saving = false
      row.errorMessage = ''
      successes += 1
    } catch (error: unknown) {
      row.saving = false
      row.saved = false
      row.errorMessage = getApiErrorMessage(error, 'This paper row could not be saved.')
    }
  }))

  if (successes === 0) {
    throw new Error('No paper rows were saved.')
  }

  successMessage.value = `${successes} paper row${successes === 1 ? '' : 's'} saved.`
}

async function savePricingState() {
  if (!currentShopSlug.value) {
    throw new Error('Create the shop profile first.')
  }
  setupState.value = await saveShopRateCardSetup({
    paper_rows: serializePaperRows(pricingRows.value),
    finishing_rows: serializeFinishingRows(finishingRows.value),
    shop_details: buildShopDetailsPayload(),
  }, currentShopSlug.value)
}

function finishingPayload(row: FinishingRow) {
  const base = {
    name: row.label || row.name,
    price: Number(row.price || 0).toFixed(2),
    is_active: Boolean(row.active),
  }
  if (row.pricing_type === 'per_side') {
    const price = Number(row.price || 0)
    return {
      ...base,
      charge_unit: 'PER_SHEET',
      billing_basis: 'per_sheet',
      side_mode: 'per_selected_side',
      double_side_price: (price * 2).toFixed(2),
      minimum_charge: '0.00',
      setup_fee: '0.00',
    }
  }
  if (row.pricing_type === 'per_piece') {
    return {
      ...base,
      charge_unit: 'PER_PIECE',
      billing_basis: 'per_piece',
      side_mode: 'ignore_sides',
      setup_fee: '0.00',
      minimum_charge: '0.00',
    }
  }
  return {
    ...base,
    charge_unit: 'FLAT',
    billing_basis: 'flat_per_job',
    side_mode: 'ignore_sides',
    setup_fee: '0.00',
    minimum_charge: '0.00',
  }
}

async function saveFinishingStep() {
  if (!currentShopSlug.value) {
    throw new Error('Create the shop profile first.')
  }

  const finishingsByName = new Map(existingFinishings.value.map(item => [item.name.toLowerCase(), item]))
  for (const row of finishingRows.value) {
    row.errorMessage = ''
    try {
      const match = finishingsByName.get(String(row.name || row.label || '').toLowerCase())
      if (match) {
        await updateShopFinishingRate(currentShopSlug.value, match.id, finishingPayload(row))
      } else if (row.active) {
        await createShopFinishingRate(currentShopSlug.value, finishingPayload(row))
      }
    } catch (error: unknown) {
      row.errorMessage = getApiErrorMessage(error, 'This finishing could not be saved.')
    }
  }

  if (finishingRows.value.some(row => row.active && row.errorMessage)) {
    throw new Error('One or more finishing rows failed to save.')
  }

  existingFinishings.value = await listShopFinishingRates(currentShopSlug.value)
}

async function handleContinue() {
  stepLoading.value = true
  pageError.value = ''
  try {
    if (activeStep.value === 1) {
      await saveShopStep()
    } else if (activeStep.value === 2) {
      await savePaperStep()
    } else if (activeStep.value === 3) {
      await savePricingState()
      successMessage.value = 'Pricing saved.'
    }
    activeStep.value = Math.min(totalSteps, activeStep.value + 1)
    if (activeStep.value >= 3) {
      await refreshPreview()
    }
  } catch (error: unknown) {
    pageError.value = getApiErrorMessage(error, 'This onboarding step could not be completed.')
  } finally {
    stepLoading.value = false
  }
}

async function finishOnboarding() {
  completingOnboarding.value = true
  pageError.value = ''
  try {
    await saveFinishingStep()
    await savePricingState()
    await completeShopRateCardSetup(currentShopSlug.value)
    await Promise.all([
      fetchMyShops(),
      listShopPapers(currentShopSlug.value),
      fetchShopRateCardSetup(currentShopSlug.value),
      auth.fetchMe(),
    ])
    await navigateTo('/dashboard/production')
  } catch (error: unknown) {
    pageError.value = getApiErrorMessage(error, 'Printy could not complete onboarding.')
  } finally {
    completingOnboarding.value = false
  }
}

onUnmounted(() => {
  if (previewTimer) {
    clearTimeout(previewTimer)
  }
})

onMounted(async () => {
  await loadSetupContext()
})
</script>
