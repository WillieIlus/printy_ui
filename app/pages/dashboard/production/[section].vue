<template>
  <RoleDashboardFrame
    title="Production Workspace"
    badge="Production"
    :name="displayName"
    :initials="initials"
    subtitle="Role-specific production flows"
    breadcrumb-root="Dashboard"
    :nav-items="navItems"
    support-title="Production workspace"
    support-copy="Production pricing, stock, and finishings stay attached to your own shop."
    support-action="Overview"
    support-to="/dashboard/production"
    @logout="auth.logout()"
  >
    <BaseAlert v-if="pageError" variant="error" title="Production workspace could not load." :message="pageError" />

    <DashboardSection v-if="section === 'assignments'" title="Production Assignments" subtitle="Incoming work, active jobs, and payout-safe status tracking.">
      <div class="space-y-5 p-6">
        <div class="flex flex-wrap items-center gap-3">
          <button
            class="rounded-full px-4 py-2 text-sm font-semibold transition"
            :class="activeAssignmentTab === 'incoming' ? 'bg-[#101828] text-white' : 'bg-slate-100 text-slate-600'"
            @click="activeAssignmentTab = 'incoming'"
          >
            Incoming
          </button>
          <button
            class="rounded-full px-4 py-2 text-sm font-semibold transition"
            :class="activeAssignmentTab === 'in_progress' ? 'bg-[#101828] text-white' : 'bg-slate-100 text-slate-600'"
            @click="activeAssignmentTab = 'in_progress'"
          >
            In Progress
          </button>
          <button
            class="rounded-full px-4 py-2 text-sm font-semibold transition"
            :class="activeAssignmentTab === 'done' ? 'bg-[#101828] text-white' : 'bg-slate-100 text-slate-600'"
            @click="activeAssignmentTab = 'done'"
          >
            Done
          </button>
        </div>

        <BaseAlert v-if="assignmentError" variant="error" :message="assignmentError" />

        <div v-if="assignmentCards.length" class="grid gap-4 xl:grid-cols-2">
          <BaseCard v-for="card in assignmentCards" :key="card.id" variant="bordered" padding="lg" radius="xl" class="space-y-4">
            <div class="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">{{ card.reference }}</p>
                <h3 class="mt-2 text-lg font-black text-slate-950">{{ card.title }}</h3>
                <p class="mt-2 text-sm text-slate-600">{{ card.specSummary }}</p>
              </div>
              <span class="rounded-full px-3 py-1 text-xs font-semibold" :class="card.badgeClass">
                {{ card.statusLabel }}
              </span>
            </div>

            <div class="grid gap-3 md:grid-cols-2">
              <div class="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                <p class="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">Current step</p>
                <p class="mt-2 text-sm font-bold text-slate-900">{{ card.currentStep }}</p>
              </div>
              <div class="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                <p class="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">Payment</p>
                <p class="mt-2 text-sm font-bold text-slate-900">{{ card.paymentBadge }}</p>
              </div>
              <div class="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                <p class="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">Deadline</p>
                <p class="mt-2 text-sm font-bold text-slate-900">{{ card.deadline }}</p>
              </div>
              <div class="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                <p class="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">Your payout</p>
                <p class="mt-2 text-sm font-bold text-slate-900">{{ card.productionAmount }}</p>
              </div>
            </div>

            <div class="flex justify-end">
              <NuxtLink
                :to="`/dashboard/production/assignments/${card.id}`"
                class="inline-flex items-center rounded-xl bg-[#101828] px-4 py-2 text-sm font-semibold text-white"
              >
                View job
              </NuxtLink>
            </div>
          </BaseCard>
        </div>

        <DashboardEmptyState
          v-else-if="!loading"
          :title="activeAssignmentTab === 'incoming' ? 'No incoming jobs.' : activeAssignmentTab === 'in_progress' ? 'No jobs in progress.' : 'No completed jobs yet.'"
          description="Assignments will appear here as soon as they are dispatched to your shop."
        />
      </div>
    </DashboardSection>

    <DashboardSection v-else-if="!currentShopSlug && isManagedSection" :title="sectionTitle" subtitle="This section needs a shop context first.">
      <DashboardEmptyState
        title="Create your shop first"
        description="Production setup is not complete yet. Start with the guided setup route so papers, pricing, and finishings can attach to a real shop."
        action-label="Start Setup"
        action-to="/dashboard/production/onboarding"
      />
    </DashboardSection>

    <DashboardSection v-else-if="section === 'paper-stock'" title="Paper Stock" subtitle="Add paper, edit existing stock, and adjust quantities inline.">
      <div class="space-y-4 p-6">
        <div class="flex flex-wrap items-center justify-between gap-3">
          <BaseAlert v-if="sectionSuccess" variant="success" :message="sectionSuccess" />
          <BaseButton variant="primary" size="sm" @click="toggleAddPaperForm">
            {{ showAddPaperForm ? 'Close add form' : 'Add paper' }}
          </BaseButton>
        </div>

        <BaseCard v-if="showAddPaperForm" variant="soft" padding="lg" radius="xl" class="space-y-4">
          <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            <BaseInput v-model="paperDraft.name" label="Paper name" variant="dashboard" :error="paperDraftErrors.name" />
            <BaseInput v-model="paperDraft.gsm" type="number" min="1" label="GSM" variant="dashboard" :error="paperDraftErrors.gsm" />
            <BaseSelect v-model="paperDraft.sheet_size" label="Size" :options="sheetSizeOptions" variant="dashboard" :error="paperDraftErrors.sheet_size" />
            <BaseInput v-model="paperDraft.cost" type="number" min="0" step="0.01" label="Cost per sheet (KES)" variant="dashboard" :error="paperDraftErrors.cost" />
            <BaseInput v-model="paperDraft.quantity" type="number" min="0" step="1" label="Qty in stock" variant="dashboard" />
          </div>
          <div class="flex flex-wrap items-center justify-between gap-3">
            <label class="inline-flex items-center gap-2 text-sm font-medium text-slate-700">
              <input v-model="paperDraft.is_active" type="checkbox" class="h-4 w-4 rounded border-slate-300 text-[#e13515] focus:ring-[#e13515]">
              Active / available for quoting
            </label>
            <div class="flex items-center gap-2">
              <BaseButton variant="secondary" size="sm" @click="toggleAddPaperForm">Cancel</BaseButton>
              <BaseButton size="sm" :loading="savingPaperDraft" @click="saveNewPaper">Save paper</BaseButton>
            </div>
          </div>
        </BaseCard>

        <div v-if="paperRows.length" class="space-y-4">
          <BaseCard v-for="paper in paperRows" :key="paper.id" variant="bordered" padding="lg" radius="xl">
            <div v-if="editingPaperId === paper.id" class="space-y-4">
              <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
                <BaseInput v-model="paperEditDraft.name" label="Paper name" variant="dashboard" :error="paperEditErrors.name" />
                <BaseInput v-model="paperEditDraft.gsm" type="number" min="1" label="GSM" variant="dashboard" :error="paperEditErrors.gsm" />
                <BaseSelect v-model="paperEditDraft.sheet_size" label="Size" :options="sheetSizeOptions" variant="dashboard" :error="paperEditErrors.sheet_size" />
                <BaseInput v-model="paperEditDraft.cost" type="number" min="0" step="0.01" label="Cost per sheet (KES)" variant="dashboard" :error="paperEditErrors.cost" />
                <BaseInput v-model="paperEditDraft.quantity" type="number" min="0" step="1" label="Qty in stock" variant="dashboard" />
              </div>
              <div class="flex flex-wrap items-center justify-between gap-3">
                <label class="inline-flex items-center gap-2 text-sm font-medium text-slate-700">
                  <input v-model="paperEditDraft.is_active" type="checkbox" class="h-4 w-4 rounded border-slate-300 text-[#e13515] focus:ring-[#e13515]">
                  Active / available for quoting
                </label>
                <div class="flex items-center gap-2">
                  <BaseButton variant="secondary" size="sm" @click="cancelPaperEdit">Cancel</BaseButton>
                  <BaseButton size="sm" :loading="updatingPaperId === paper.id" @click="savePaperEdit(paper.id)">Save</BaseButton>
                </div>
              </div>
            </div>

            <div v-else class="space-y-4">
              <div class="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p class="text-sm font-bold text-slate-900">{{ paper.display_name || paper.name }}</p>
                  <p class="mt-1 text-xs text-slate-500">{{ paper.sheet_size }} · {{ paper.gsm }}gsm</p>
                </div>
                <div class="flex flex-wrap items-center gap-2 text-xs font-semibold">
                  <span class="rounded-full px-3 py-1" :class="paper.is_active ? 'bg-green-50 text-green-700' : 'bg-slate-100 text-slate-500'">
                    {{ paper.is_active ? 'Active' : 'Inactive' }}
                  </span>
                  <BaseButton variant="ghost" size="sm" @click="startPaperEdit(paper)">Edit</BaseButton>
                  <BaseButton variant="secondary" size="sm" @click="openAdjustPaper(paper.id)">Adjust stock</BaseButton>
                </div>
              </div>

              <div class="grid gap-3 md:grid-cols-4">
                <div class="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <p class="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">Qty in stock</p>
                  <p class="mt-2 text-sm font-bold text-slate-900">{{ paper.quantity_in_stock ?? 0 }}</p>
                </div>
                <div class="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <p class="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">Buying price</p>
                  <p class="mt-2 text-sm font-bold text-slate-900">KES {{ paper.buying_price || '0.00' }}</p>
                </div>
              </div>

              <div v-if="adjustingPaperId === paper.id" class="flex flex-wrap items-end gap-3">
                <div class="min-w-[180px]">
                  <BaseInput v-model="stockAdjustment" type="number" step="1" label="Adjustment (+/-)" variant="dashboard" />
                </div>
                <BaseButton size="sm" :loading="adjustingStock" @click="saveStockAdjustment(paper.id)">Apply</BaseButton>
                <BaseButton variant="secondary" size="sm" @click="closeAdjustPaper">Cancel</BaseButton>
              </div>
            </div>
          </BaseCard>
        </div>

        <DashboardEmptyState v-else title="No paper stock yet" description="Add your first stock row so Printy knows what your shop can produce." />
      </div>
    </DashboardSection>

    <DashboardSection v-else-if="section === 'pricing'" title="Production Pricing" subtitle="Edit your MVP rate card and preview what products Printy can expose from it.">
      <div class="grid gap-6 p-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div class="space-y-3">
          <BaseAlert v-if="sectionSuccess" variant="success" :message="sectionSuccess" />
          <p class="text-xs font-medium text-slate-500">Suggested from market defaults - edit to match your shop.</p>
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
            <div v-if="paperPreviewRow(row).sample_job_previews?.length" class="mt-4 space-y-3">
              <div v-for="sample in paperPreviewRow(row).sample_job_previews" :key="sample.label" class="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
                <p class="text-sm font-bold text-slate-900">{{ sample.label }}</p>
                <p class="mt-1 text-xs text-slate-500">Pieces per SRA3: {{ sample.pieces_per_sheet }} · Sheets needed: {{ sample.sheets_needed }}</p>
                <p class="mt-2 text-xs text-slate-600">Single-sided: KES {{ sample.single_sided_production || '0.00' }}</p>
                <p class="mt-1 text-xs text-slate-600" v-if="sample.double_sided_production">Double-sided: KES {{ sample.double_sided_production }}</p>
                <p class="mt-1 text-xs text-slate-600" v-if="sample.finishing_estimate">Finishing estimate: KES {{ sample.finishing_estimate }}</p>
              </div>
            </div>
          </BaseCard>

          <div class="flex justify-end">
            <BaseButton :loading="savingPricing" @click="savePricing">Save pricing</BaseButton>
          </div>
        </div>

        <BaseCard variant="soft" padding="lg" radius="xl" class="space-y-4">
          <div class="flex items-center justify-between gap-3">
            <div>
              <p class="text-xs font-bold uppercase tracking-[0.18em] text-[#e13515]">Capability preview</p>
              <h3 class="mt-2 text-xl font-black text-slate-950">Products you can offer</h3>
            </div>
            <span v-if="previewLoading" class="text-xs font-semibold text-slate-500">Refreshing...</span>
          </div>
          <BaseAlert v-if="previewError" variant="error" :message="previewError" />
          <div v-else class="space-y-3">
            <div v-for="product in previewProducts" :key="product.key || product.label" class="rounded-2xl border border-slate-200 bg-white px-4 py-3">
              <p class="text-sm font-bold text-slate-900">{{ product.label }}</p>
              <p class="mt-1 text-xs text-slate-500">{{ product.reason }}</p>
            </div>
            <BaseAlert v-if="exampleQuoteMessage" variant="default" :message="exampleQuoteMessage" />
          </div>
        </BaseCard>
      </div>
    </DashboardSection>

    <DashboardSection v-else-if="section === 'finishings'" title="Finishings" subtitle="Manage the small finishing rule set used by the MVP production flow.">
      <div class="space-y-4 p-6">
        <BaseAlert v-if="sectionSuccess" variant="success" :message="sectionSuccess" />
        <BaseCard v-for="row in finishingRows" :key="row.key || row.id" variant="bordered" padding="lg" radius="xl">
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
        <div class="flex justify-end">
          <BaseButton :loading="savingFinishings" @click="saveFinishings">Save finishings</BaseButton>
        </div>
      </div>
    </DashboardSection>

    <DashboardSection v-else :title="sectionTitle" subtitle="Role-specific production view">
      <BaseTable :columns="columns" :rows="rows" :loading="loading" :empty-text="emptyText" variant="dashboard" />
      <DashboardEmptyState v-if="!loading && isUiOnly" title="UI-only section" description="This route exists, but the backend action set for this section is not implemented yet." />
    </DashboardSection>
  </RoleDashboardFrame>
</template>

<script setup lang="ts">
import BaseAlert from '~/components/base/BaseAlert.vue'
import BaseButton from '~/components/base/BaseButton.vue'
import BaseCard from '~/components/base/BaseCard.vue'
import BaseInput from '~/components/base/BaseInput.vue'
import BaseSelect from '~/components/base/BaseSelect.vue'
import BaseTable from '~/components/base/BaseTable.vue'
import DashboardEmptyState from '~/components/dashboard/DashboardEmptyState.vue'
import DashboardSection from '~/components/dashboard/DashboardSection.vue'
import RoleDashboardFrame from '~/components/dashboard/RoleDashboardFrame.vue'
import { useForShopsApi } from '~/services/for-shops'
import { useDashboardApi } from '~/services/dashboard'
import { fetchManagedJobSettlement } from '~/services/jobs'
import { getAssignments } from '~/services/production'
import { useShopsApi, type FinishingRateRecord, type PaperRecord } from '~/services/shops'
import { getApiErrorMessage } from '~/shared/api'

definePageMeta({ layout: false, middleware: 'auth' })

const auth = useAuthStore()
const { fetchForShopsConfig, previewForShops } = useForShopsApi()
const { fetchDashboardSection } = useDashboardApi()
const {
  createShopFinishingRate,
  createShopPaper,
  fetchMyShops,
  fetchShopRateCardSetup,
  listShopFinishingRates,
  listShopPapers,
  saveShopRateCardSetup,
  updateShopFinishingRate,
  updateShopPaper,
  adjustShopPaper,
} = useShopsApi()
if (!auth.canAccessProductionDashboard) {
  await navigateTo(auth.homeRoute)
}

const route = useRoute()
const section = computed(() => String(route.params.section || 'jobs'))
const displayName = computed(() => auth.user?.name || auth.user?.email || 'Production')
const initials = computed(() => displayName.value.split(' ').map(part => part[0]).join('').slice(0, 2).toUpperCase() || 'PD')
const loading = ref(true)
const pageError = ref('')
const payload = ref<any>(null)
const currentShopSlug = ref('')
const sectionSuccess = ref('')

const sheetSizeOptions = [
  { label: 'SRA3', value: 'SRA3' },
  { label: 'A3', value: 'A3' },
  { label: 'A4', value: 'A4' },
  { label: 'A5', value: 'A5' },
  { label: 'Custom', value: 'Custom' },
]

const finishingPricingOptions = [
  { label: 'Per side', value: 'per_side' },
  { label: 'Per piece', value: 'per_piece' },
  { label: 'Per job', value: 'per_job' },
]

const isManagedSection = computed(() => ['paper-stock', 'pricing', 'finishings'].includes(section.value))
const sectionTitleMap: Record<string, string> = {
  assignments: 'Production Assignments',
  jobs: 'Production Jobs',
  pricing: 'Production Pricing',
  'paper-stock': 'Paper Stock',
  finishings: 'Finishings',
  payments: 'Production Payments',
}
const sectionTitle = computed(() => sectionTitleMap[section.value] || 'Production Section')

const paperRows = ref<PaperRecord[]>([])
const pricingRows = ref<Array<Record<string, any>>>([])
const finishingRows = ref<Array<Record<string, any>>>([])
const productionAssignments = ref<Array<Record<string, any>>>([])
const productionJobs = ref<Array<Record<string, any>>>([])
const assignmentSettlements = ref<Record<string, Record<string, any> | null>>({})
const assignmentError = ref('')
const activeAssignmentTab = ref<'incoming' | 'in_progress' | 'done'>('incoming')
const setupState = ref<Record<string, any> | null>(null)
const builderConfig = ref<Record<string, any> | null>(null)
const existingFinishings = ref<FinishingRateRecord[]>([])
const previewState = ref<Record<string, any> | null>(null)
const previewLoading = ref(false)
const previewError = ref('')
const savingPricing = ref(false)
const savingFinishings = ref(false)
const savingPaperDraft = ref(false)
const updatingPaperId = ref<number | null>(null)
const adjustingPaperId = ref<number | null>(null)
const adjustingStock = ref(false)
const stockAdjustment = ref('0')
const showAddPaperForm = ref(false)
const editingPaperId = ref<number | null>(null)

const paperDraft = reactive({
  name: '',
  gsm: '',
  sheet_size: 'SRA3',
  cost: '',
  quantity: '',
  is_active: true,
})
const paperDraftErrors = reactive<Record<string, string>>({})
const paperEditDraft = reactive({
  name: '',
  gsm: '',
  sheet_size: 'SRA3',
  cost: '',
  quantity: '',
  is_active: true,
})
const paperEditErrors = reactive<Record<string, string>>({})

let previewTimer: ReturnType<typeof setTimeout> | null = null

function clearObject(object: Record<string, string>) {
  for (const key of Object.keys(object)) {
    delete object[key]
  }
}

function inferPaperCategory(name: string, gsm: number | string) {
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

function normalizePricingRows() {
  pricingRows.value = JSON.parse(JSON.stringify(setupState.value?.paper_rows || builderConfig.value?.paper_rows || []))
}

function normalizeFinishingRows() {
  const rows = JSON.parse(JSON.stringify(setupState.value?.finishing_rows || builderConfig.value?.finishing_rows || []))
  const persistedByName = new Map(existingFinishings.value.map(item => [item.name.toLowerCase(), item]))
  finishingRows.value = rows.map((row: Record<string, any>) => ({
    ...row,
    pricing_type: inferFinishingPricingType(row, persistedByName.get(String(row.name || row.label || '').toLowerCase()) || null),
  }))
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
    previewState.value = await previewForShops({
      paper_rows: serializePaperRows(pricingRows.value),
      finishing_rows: serializeFinishingRows(finishingRows.value),
    })
  } catch (error: unknown) {
    previewError.value = getApiErrorMessage(error, 'Live capability preview is unavailable right now.')
  } finally {
    previewLoading.value = false
  }
}

function paperPayloadFromDraft(source: typeof paperDraft | typeof paperEditDraft) {
  return {
    name: source.name.trim(),
    sheet_size: source.sheet_size,
    gsm: Number(source.gsm),
    category: inferPaperCategory(source.name, source.gsm),
    paper_type: inferPaperType(source.name),
    buying_price: Number(source.cost || 0).toFixed(2),
    selling_price: Number(source.cost || 0).toFixed(2),
    quantity_in_stock: source.quantity === '' ? 0 : Number(source.quantity),
    is_active: source.is_active,
    available_for_quoting: source.is_active,
  }
}

function validatePaperDraft(source: typeof paperDraft | typeof paperEditDraft, target: Record<string, string>) {
  clearObject(target)
  if (!source.name.trim()) target.name = 'Paper name is required.'
  if (!source.gsm || Number(source.gsm) <= 0) target.gsm = 'Enter a valid GSM.'
  if (!source.sheet_size.trim()) target.sheet_size = 'Choose a size.'
  if (source.cost === '' || Number(source.cost) < 0) target.cost = 'Enter a valid cost.'
  return Object.keys(target).length === 0
}

function toggleAddPaperForm() {
  showAddPaperForm.value = !showAddPaperForm.value
  if (!showAddPaperForm.value) {
    clearObject(paperDraftErrors)
  }
}

async function loadManagedContext() {
  if (section.value === 'assignments') {
    assignmentError.value = ''
    const assignments = await getAssignments()
    const jobsPayload = await fetchDashboardSection('production', 'jobs')
    productionAssignments.value = assignments
    productionJobs.value = Array.isArray(jobsPayload?.results) ? jobsPayload.results : []
    const settlementEntries = await Promise.all(
      assignments.map(async (assignment) => {
        try {
          const settlement = await fetchManagedJobSettlement(assignment.managed_job)
          return [String(assignment.managed_job), settlement] as const
        } catch {
          return [String(assignment.managed_job), null] as const
        }
      }),
    )
    assignmentSettlements.value = Object.fromEntries(settlementEntries)
    return
  }

  const shops = await fetchMyShops()
  currentShopSlug.value = shops.find(shop => shop?.is_active !== false)?.slug || shops[0]?.slug || ''
  if (!currentShopSlug.value) {
    return
  }

  if (section.value === 'paper-stock') {
    paperRows.value = await listShopPapers(currentShopSlug.value)
    return
  }

  if (section.value === 'pricing' || section.value === 'finishings') {
    const [setup, config, finishings] = await Promise.all([
      fetchShopRateCardSetup(currentShopSlug.value),
      fetchForShopsConfig(),
      listShopFinishingRates(currentShopSlug.value),
    ])
    setupState.value = setup
    builderConfig.value = config
    existingFinishings.value = finishings
    normalizePricingRows()
    normalizeFinishingRows()
    await refreshPreview()
    return
  }

  payload.value = await fetchDashboardSection('production', section.value)
}

try {
  await loadManagedContext()
} catch (error: unknown) {
  pageError.value = getApiErrorMessage(error, 'Production dashboard section is unavailable right now.')
} finally {
  loading.value = false
}

watch(
  () => section.value === 'pricing' ? JSON.stringify(pricingRows.value) : section.value === 'finishings' ? JSON.stringify(finishingRows.value) : '',
  () => {
    if (section.value === 'pricing' || section.value === 'finishings') {
      schedulePreview()
    }
  },
)

const isUiOnly = computed(() => !payload.value)
const rows = computed(() => Array.isArray(payload.value?.results) ? payload.value.results : [])
const emptyText = computed(() => isUiOnly.value ? 'This section is UI-only right now.' : `No ${section.value} yet.`)
const columns = computed(() => {
  if (section.value === 'payments') return [{ key: 'reference', label: 'Reference' }, { key: 'production_amount', label: 'Production Amount' }, { key: 'status', label: 'Status' }]
  return [{ key: 'reference', label: 'Reference' }, { key: 'status', label: 'Status' }, { key: 'payment_status', label: 'Payment' }]
})

const navItems = computed(() => [
  { label: 'Overview', to: '/dashboard/production' },
  { label: 'Onboarding', to: '/dashboard/production/onboarding' },
  { label: 'Assignments', to: '/dashboard/production/assignments', active: section.value === 'assignments' },
  { label: 'Jobs', to: '/dashboard/production/jobs', active: section.value === 'jobs' },
  { label: 'Paper', to: '/dashboard/production/paper-stock', active: section.value === 'paper-stock' },
  { label: 'Pricing', to: '/dashboard/production/pricing', active: section.value === 'pricing' },
  { label: 'Finishings', to: '/dashboard/production/finishings', active: section.value === 'finishings' },
  { label: 'Messages', to: '/dashboard/production/messages' },
])

const previewProducts = computed(() => {
  const summary = (previewState.value?.summary || setupState.value?.summary || {}) as Record<string, any>
  return Array.isArray(summary.unlocked_products) ? summary.unlocked_products.slice(0, 6) : []
})

const exampleQuoteMessage = computed(() => {
  const exampleQuote = (previewState.value?.example_quote || setupState.value?.example_quote || null) as Record<string, any> | null
  return exampleQuote?.status_text || ''
})

const assignmentCards = computed(() => {
  const incomingStatuses = new Set(['pending', 'assigned'])
  const inProgressStatuses = new Set(['accepted', 'in_production', 'finishing'])
  const doneStatuses = new Set(['ready', 'completed'])
  return productionAssignments.value
    .filter((assignment) => {
      const status = String(assignment.status || '').toLowerCase()
      if (activeAssignmentTab.value === 'incoming') return incomingStatuses.has(status)
      if (activeAssignmentTab.value === 'in_progress') return inProgressStatuses.has(status)
      return doneStatuses.has(status)
    })
    .map((assignment) => {
      const job = productionJobs.value.find(item => String(item.id) === String(assignment.managed_job)) || null
      const settlement = assignmentSettlements.value[String(assignment.managed_job)] || null
      return {
        id: assignment.id,
        reference: job?.reference || assignment.managed_reference || `Assignment ${assignment.id}`,
        title: job?.title || 'Managed print job',
        specSummary: String(assignment.assignment_notes || '').trim() || 'Specs are not attached to this assignment payload yet.',
        productionAmount: formatMoney(assignment.payout_amount || settlement?.production_amount || job?.pricing?.production_total),
        deadline: formatDateTime(assignment.requested_deadline || assignment.due_at || job?.requested_deadline),
        paymentBadge: assignment.payment_confirmed ? '✓ Paid' : '⏳ Pending',
        currentStep: `→ ${assignment.production_stage_label || humanizeStatus(assignment.status)}`,
        statusLabel: humanizeStatus(assignment.status),
        badgeClass: activeAssignmentTab.value === 'incoming'
          ? 'bg-amber-50 text-amber-700'
          : activeAssignmentTab.value === 'in_progress'
            ? 'bg-blue-50 text-blue-700'
            : 'bg-teal-50 text-teal-700',
      }
    })
})

function humanizeStatus(value: unknown) {
  return String(value || 'pending')
    .replace(/[_-]+/g, ' ')
    .replace(/\b\w/g, letter => letter.toUpperCase())
}

function formatMoney(value: unknown) {
  const amount = Number(value)
  if (!Number.isFinite(amount) || amount <= 0) {
    return 'Awaiting payout total'
  }
  return `KES ${amount.toLocaleString('en-KE', { maximumFractionDigits: 2 })}`
}

function formatDateTime(value: unknown) {
  if (!value) return 'No deadline set'
  const date = new Date(String(value))
  if (Number.isNaN(date.getTime())) return 'No deadline set'
  return new Intl.DateTimeFormat('en-KE', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(date)
}

function summarizePaymentState(value: unknown) {
  const status = String(value || 'pending').toLowerCase()
  if (status.includes('hold')) return 'On hold'
  if (status === 'release_ready') return 'Settlement pending release'
  if (status === 'confirmed' || status === 'paid') return 'Paid'
  return humanizeStatus(status)
}

async function saveNewPaper() {
  if (!currentShopSlug.value) return
  if (!validatePaperDraft(paperDraft, paperDraftErrors)) return
  savingPaperDraft.value = true
  sectionSuccess.value = ''
  try {
    await createShopPaper(currentShopSlug.value, paperPayloadFromDraft(paperDraft))
    paperRows.value = await listShopPapers(currentShopSlug.value)
    paperDraft.name = ''
    paperDraft.gsm = ''
    paperDraft.sheet_size = 'SRA3'
    paperDraft.cost = ''
    paperDraft.quantity = ''
    paperDraft.is_active = true
    showAddPaperForm.value = false
    sectionSuccess.value = 'Paper row added.'
  } catch (error: unknown) {
    pageError.value = getApiErrorMessage(error, 'Paper could not be added.')
  } finally {
    savingPaperDraft.value = false
  }
}

function startPaperEdit(paper: PaperRecord) {
  editingPaperId.value = paper.id
  paperEditDraft.name = paper.name || paper.display_name || ''
  paperEditDraft.gsm = paper.gsm ? String(paper.gsm) : ''
  paperEditDraft.sheet_size = paper.sheet_size || 'SRA3'
  paperEditDraft.cost = String(paper.buying_price ?? paper.selling_price ?? '')
  paperEditDraft.quantity = paper.quantity_in_stock === undefined || paper.quantity_in_stock === null ? '' : String(paper.quantity_in_stock)
  paperEditDraft.is_active = Boolean(paper.is_active)
  clearObject(paperEditErrors)
}

function cancelPaperEdit() {
  editingPaperId.value = null
  clearObject(paperEditErrors)
}

async function savePaperEdit(paperId: number) {
  if (!currentShopSlug.value) return
  if (!validatePaperDraft(paperEditDraft, paperEditErrors)) return
  updatingPaperId.value = paperId
  sectionSuccess.value = ''
  try {
    await updateShopPaper(currentShopSlug.value, paperId, paperPayloadFromDraft(paperEditDraft))
    paperRows.value = await listShopPapers(currentShopSlug.value)
    editingPaperId.value = null
    sectionSuccess.value = 'Paper row updated.'
  } catch (error: unknown) {
    pageError.value = getApiErrorMessage(error, 'Paper could not be updated.')
  } finally {
    updatingPaperId.value = null
  }
}

function openAdjustPaper(paperId: number) {
  adjustingPaperId.value = paperId
  stockAdjustment.value = '0'
}

function closeAdjustPaper() {
  adjustingPaperId.value = null
  stockAdjustment.value = '0'
}

async function saveStockAdjustment(paperId: number) {
  if (!currentShopSlug.value) return
  adjustingStock.value = true
  sectionSuccess.value = ''
  try {
    await adjustShopPaper(currentShopSlug.value, paperId, Number(stockAdjustment.value || 0))
    paperRows.value = await listShopPapers(currentShopSlug.value)
    sectionSuccess.value = 'Stock adjusted.'
    closeAdjustPaper()
  } catch (error: unknown) {
    pageError.value = getApiErrorMessage(error, 'Stock adjustment failed.')
  } finally {
    adjustingStock.value = false
  }
}

async function savePricing() {
  if (!currentShopSlug.value) return
  savingPricing.value = true
  sectionSuccess.value = ''
  try {
    setupState.value = await saveShopRateCardSetup({
      paper_rows: serializePaperRows(pricingRows.value),
      finishing_rows: serializeFinishingRows(finishingRows.value),
      shop_details: setupState.value?.shop_details || {},
    }, currentShopSlug.value)
    sectionSuccess.value = 'Pricing saved.'
  } catch (error: unknown) {
    pageError.value = getApiErrorMessage(error, 'Pricing could not be saved.')
  } finally {
    savingPricing.value = false
  }
}

function finishingPayload(row: Record<string, any>) {
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
      minimum_charge: '0.00',
      setup_fee: '0.00',
    }
  }
  return {
    ...base,
    charge_unit: 'FLAT',
    billing_basis: 'flat_per_job',
    side_mode: 'ignore_sides',
    minimum_charge: '0.00',
    setup_fee: '0.00',
  }
}

async function saveFinishings() {
  if (!currentShopSlug.value) return
  savingFinishings.value = true
  sectionSuccess.value = ''
  try {
    const byName = new Map(existingFinishings.value.map(item => [item.name.toLowerCase(), item]))
    for (const row of finishingRows.value) {
      row.errorMessage = ''
      const match = byName.get(String(row.name || row.label || '').toLowerCase())
      try {
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
    setupState.value = await saveShopRateCardSetup({
      paper_rows: serializePaperRows(pricingRows.value),
      finishing_rows: serializeFinishingRows(finishingRows.value),
      shop_details: setupState.value?.shop_details || {},
    }, currentShopSlug.value)
    sectionSuccess.value = 'Finishings saved.'
  } catch (error: unknown) {
    pageError.value = getApiErrorMessage(error, 'Finishings could not be saved.')
  } finally {
    savingFinishings.value = false
  }
}

onUnmounted(() => {
  if (previewTimer) {
    clearTimeout(previewTimer)
  }
})
</script>
