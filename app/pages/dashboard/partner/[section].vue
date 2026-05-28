<template>
  <RoleDashboardFrame
    title="Partner Workspace"
    badge="Partner"
    :name="displayName"
    :initials="initials"
    subtitle="Role-specific partner flows"
    breadcrumb-root="Dashboard"
    :nav-items="navItems"
    support-title="Partner workspace"
    support-copy="Partner quote, client, and production-shop flows stay separate from client and production routes."
    support-action="Overview"
    support-to="/dashboard/partner"
    @logout="auth.logout()"
  >
    <template v-if="!hasId">
      <BaseAlert v-if="pageError" variant="error" title="Partner workspace could not load." :message="pageError" />
      <BaseAlert v-else-if="toastMessage" class="mb-6" variant="success" :message="toastMessage" />

      <template v-if="section === 'quotes'">
        <DashboardPageHeader eyebrow="Partner Quotes" title="Quotes" subtitle="Create client-facing quotes from production pricing and track the full brokered workflow.">
        <template #actions>
          <BaseButton variant="primary" size="md" @click="openQuotePanel">Manual quote</BaseButton>
        </template>
      </DashboardPageHeader>

      <DashboardSection title="Quotes" subtitle="Client | Product | Client pays | Your margin | Status | Date">
        <DashboardEmptyState
          v-if="!quotesLoading && !quoteRows.length"
          title="No quotes yet. Create your first quote for a client."
          action-label="New quote"
          @click="openQuotePanel"
        >
          <template #action>
            <BaseButton variant="secondary" size="sm" @click="openQuotePanel">New quote</BaseButton>
          </template>
        </DashboardEmptyState>

        <BaseTable
          v-else
          :columns="quoteColumns"
          :rows="quoteRows"
          :loading="quotesLoading"
          empty-text="No quotes yet. Create your first quote for a client."
          variant="dashboard"
          :row-action="openQuoteDetail"
        >
          <template #cell-status="{ value }">
            <span class="inline-flex rounded-full px-3 py-1 text-xs font-semibold" :class="statusBadgeClass(value)">
              {{ partnerStatusLabel(value) }}
            </span>
          </template>
          <template #cell-next_action="{ row, value }">
            <button type="button" class="font-semibold text-[#175cd3] hover:text-[#1849a9]" @click.stop="openQuoteDetail(row)">
              {{ value }}
            </button>
          </template>
        </BaseTable>
      </DashboardSection>

      <Transition
        enter-active-class="transition-opacity duration-200"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition-opacity duration-200"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <button
          v-if="quotePanelOpen"
          type="button"
          class="fixed inset-0 z-40 bg-slate-950/35"
          aria-label="Close new quote panel"
          @click="closeQuotePanel"
        />
      </Transition>

      <Transition
        enter-active-class="transform transition duration-300 ease-out"
        enter-from-class="translate-x-full"
        enter-to-class="translate-x-0"
        leave-active-class="transform transition duration-200 ease-in"
        leave-from-class="translate-x-0"
        leave-to-class="translate-x-full"
      >
        <aside
          v-if="quotePanelOpen"
          class="fixed right-0 top-0 z-50 flex h-screen w-full max-w-4xl flex-col overflow-hidden border-l border-slate-200 bg-white shadow-2xl"
        >
          <div class="flex items-center justify-between border-b border-slate-200 px-6 py-5">
            <div>
              <p class="text-sm font-medium text-slate-400">Partner Quote Builder</p>
              <h2 class="text-xl font-bold text-slate-900">New quote</h2>
            </div>
            <button type="button" class="rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-600" @click="closeQuotePanel">
              X
            </button>
          </div>

          <div class="border-b border-slate-200 px-6 py-4">
            <div class="flex flex-wrap gap-2">
              <button
                v-for="pill in quoteStepPills"
                :key="pill.value"
                type="button"
                class="rounded-full px-4 py-2 text-sm font-semibold transition-colors"
                :class="quotePanelStep === pill.value ? 'bg-[#101828] text-white' : 'bg-slate-100 text-slate-500'"
                @click="goToStep(pill.value)"
              >
                {{ pill.label }}
              </button>
            </div>
          </div>

          <div class="flex-1 overflow-y-auto px-6 py-6">
            <BaseAlert v-if="panelError" class="mb-5" variant="error" :message="panelError" />

            <template v-if="quotePanelStep === 2">
              <div class="space-y-6">
                <div>
                  <h3 class="text-lg font-semibold text-slate-900">{{ isAssignedRequestMode ? 'Step 2 - Assigned client' : 'Step 2 - Select or add client' }}</h3>
                  <p class="mt-1 text-sm text-slate-500">{{ isAssignedRequestMode ? 'This request already has a client attached. Review it, then continue to send.' : 'Choose an existing client or add lightweight client details after pricing is confirmed.' }}</p>
                </div>

                <div v-if="!isAssignedRequestMode" class="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                  <BaseInput
                    v-model="clientSearchQuery"
                    label="Search by name or phone"
                    placeholder="Search by name or phone"
                    variant="dashboard"
                  />
                  <p v-if="clientSearchError" class="mt-3 text-sm font-medium text-[#b42318]">
                    {{ clientSearchError }}
                  </p>

                  <div v-if="clientSearchResults.length" class="mt-3 rounded-2xl border border-slate-200 bg-white">
                    <button
                      v-for="client in clientSearchResults"
                      :key="client.id"
                      type="button"
                      class="flex w-full items-center justify-between border-b border-slate-100 px-4 py-3 text-left last:border-b-0 hover:bg-slate-50"
                      @click="selectClient(client)"
                    >
                      <span class="font-semibold text-slate-800">{{ client.name || 'Client' }}</span>
                      <span class="text-sm text-slate-500">{{ client.phone || client.email || `Client #${client.id}` }}</span>
                    </button>
                  </div>

                  <div v-if="selectedClient" class="mt-4 flex flex-wrap items-center gap-3">
                    <span class="inline-flex items-center gap-2 rounded-full bg-[#fef3f2] px-4 py-2 text-sm font-semibold text-[#b42318]">
                      {{ selectedClient.name || 'Client' }} · {{ selectedClient.phone || selectedClient.email || `Client #${selectedClient.id}` }}
                    </span>
                    <button type="button" class="text-sm font-semibold text-slate-500" @click="selectedClient = null">
                      Remove
                    </button>
                  </div>
                </div>

                <div v-if="!isAssignedRequestMode" class="rounded-2xl border border-dashed border-slate-300 p-5">
                  <button type="button" class="text-sm font-semibold text-[#e13515]" @click="showNewClientForm = !showNewClientForm">
                    + New client
                  </button>
                  <div v-if="showNewClientForm" class="mt-4 grid gap-4 md:grid-cols-2">
                    <BaseInput v-model="newClientForm.name" label="Name" variant="dashboard" />
                    <BaseInput v-model="newClientForm.phone" label="WhatsApp / phone" variant="dashboard" />
                    <BaseInput v-model="newClientForm.email" label="Email" variant="dashboard" />
                    <BaseInput v-model="newClientForm.company" label="Company" variant="dashboard" />
                  </div>
                  <p v-if="showNewClientForm" class="mt-3 text-sm text-slate-500">
                    Email is required when you send. You can still skip this step and save a draft first.
                  </p>
                </div>

                <div v-if="isAssignedRequestMode" class="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                  <p class="text-sm font-semibold text-slate-900">Assigned client</p>
                  <p class="mt-2 text-sm text-slate-600">{{ reviewClientLabel }}</p>
                </div>
              </div>
            </template>

            <template v-else-if="quotePanelStep === 1">
              <div class="space-y-6">
                <div>
                  <h3 class="text-lg font-semibold text-slate-900">{{ isAssignedRequestMode ? 'Step 1 - Choose production source' : 'Step 1 - Job specs + price preview' }}</h3>
                  <p class="mt-1 text-sm text-slate-500">{{ isAssignedRequestMode ? 'Printy found shops that can produce this job. Choose one to base your client quote on.' : 'Fetch production pricing, then adjust your markup locally.' }}</p>
                </div>

                <div class="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
                  <div class="space-y-4">
                    <div v-if="isAssignedRequestMode" class="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                      <p class="text-sm font-semibold text-slate-900">Job specs summary</p>
                      <p class="mt-2 text-sm text-slate-600">{{ reviewJobLabel }}</p>
                      <p class="mt-1 text-sm text-slate-600">{{ reviewSpecsLabel }}</p>
                    </div>
                    <BaseSelect v-model="quoteSpecs.product_type" label="Product type" :options="productTypeOptions" variant="dashboard" />
                    <BaseSelect v-model="quoteSpecs.finished_size" label="Size" :options="sizeOptions" variant="dashboard" />
                    <BaseInput v-model="quoteSpecs.quantity" type="number" min="1" label="Quantity" variant="dashboard" />
                    <BaseSelect v-model="quoteSpecs.paper_stock" label="Paper" :options="paperOptions" variant="dashboard" />
                    <BaseSelect v-model="quoteSpecs.print_sides" label="Sides" :options="sideOptions" variant="dashboard" />
                    <BaseSelect v-model="quoteSpecs.color_mode" label="Colour mode" :options="colorModeOptions" variant="dashboard" />
                    <BaseSelect v-model="quoteSpecs.lamination" label="Finishing" :options="finishingOptions" variant="dashboard" />
                    <BaseSelect v-model="quoteSpecs.urgency_type" label="Turnaround" :options="turnaroundOptions" variant="dashboard" />
                    <BaseTextarea v-model="quoteSpecs.note" label="Notes" placeholder="Optional client-facing note" variant="dashboard" />

                    <BaseSelect
                      v-if="previewShopOptions.length"
                      v-model="selectedPreviewShopId"
                      label="Print shop"
                      :options="previewShopOptions"
                      variant="dashboard"
                    />

                    <BaseButton variant="primary" size="md" :loading="previewLoading" @click="loadProductionPreview">
                      {{ productionActionLabel }}
                    </BaseButton>

                    <div v-if="productionMatches.length" class="space-y-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                      <div class="flex items-center justify-between gap-3">
                        <p class="text-sm font-semibold text-slate-900">{{ isAssignedRequestMode ? 'Choose production source' : 'Matched production shops' }}</p>
                        <p class="text-xs text-slate-500">{{ productionMatches.length }} checked</p>
                      </div>
                      <button
                        v-for="shop in productionMatches"
                        :key="shop.shop_id"
                        type="button"
                        class="w-full rounded-2xl border p-4 text-left transition-colors"
                        :class="[
                          productionStatusTone(shop),
                          String(selectedPreviewShop?.shop_id || '') === String(shop.shop_id) ? 'ring-2 ring-[#e13515]' : '',
                        ]"
                        @click="selectedPreviewShop = shop"
                      >
                        <div class="flex flex-wrap items-start justify-between gap-3">
                          <div>
                            <div class="flex flex-wrap items-center gap-2">
                              <p class="text-sm font-bold text-slate-900">{{ shop.shop_display_name }}</p>
                              <span v-if="shop.recommendation_label" class="rounded-full bg-white px-2 py-1 text-[11px] font-semibold text-slate-600">
                                {{ shop.recommendation_label }}
                              </span>
                            </div>
                            <p v-if="shop.location_summary" class="mt-1 text-xs text-slate-500">{{ shop.location_summary }}</p>
                            <p v-if="shop.estimated_turnaround" class="mt-1 text-xs text-slate-500">Turnaround: {{ shop.estimated_turnaround }}</p>
                          </div>
                          <div class="text-right">
                            <p class="text-sm font-bold text-slate-900">
                              {{ shop.production_cost ? formatMoney(shop.production_cost) : 'Price unavailable' }}
                            </p>
                            <p class="mt-1 text-xs text-slate-500">{{ shopSelectLabel(shop) }}</p>
                          </div>
                        </div>
                        <p v-if="shop.explanation || shop.reason" class="mt-3 text-sm text-slate-600">{{ shop.explanation || shop.reason }}</p>
                        <p v-if="shop.available_reasons?.length" class="mt-2 text-xs text-slate-500">
                          {{ shop.available_reasons.join(' • ') }}
                        </p>
                        <p v-if="shop.missing_requirements?.length" class="mt-2 text-xs font-medium text-amber-700">
                          Missing: {{ missingRequirementsText(shop) }}
                        </p>
                      </button>
                    </div>
                    <div v-if="missingSpecFields.length" class="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                      Missing specs: {{ missingSpecFields.map(specFieldLabel).join(', ') }}
                    </div>
                    <div v-if="noPricedShopOptions" class="rounded-2xl border border-slate-200 bg-white px-4 py-4 text-sm text-slate-600">
                      No shop can price this job exactly yet. Complete missing specs or confirm shop pricing setup, then run production options again.
                    </div>
                  </div>

                  <div class="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                    <p class="text-sm font-semibold uppercase tracking-[0.16em] text-slate-400">Price breakdown</p>

                    <div v-if="previewData" class="mt-5 space-y-3 rounded-2xl border border-slate-200 bg-white p-5">
                      <div class="flex items-center justify-between text-sm">
                        <span class="text-slate-500">Production cost</span>
                        <span class="font-semibold text-slate-900">{{ formatMoney(productionBase) }}</span>
                      </div>
                      <div>
                        <label class="text-sm font-semibold text-slate-700">Your markup (%)</label>
                        <div class="mt-2 flex items-center gap-3">
                          <input v-model="markupRate" type="number" min="5" max="200" step="1" class="w-28 rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900" />
                          <span class="text-sm text-slate-500">= {{ formatMoney(markupAmount) }}</span>
                        </div>
                        <p class="mt-2 text-xs text-slate-500">Enter your markup (5% - 200%).</p>
                        <p v-if="markupHighWarning" class="mt-2 text-sm font-medium text-amber-700">{{ markupHighWarning }}</p>
                      </div>
                      <div class="flex items-center justify-between text-sm">
                        <span class="text-slate-500">Printy fee</span>
                        <span class="font-semibold text-slate-900">{{ formatMoney(platformFeeAmount) }}</span>
                      </div>
                      <div class="border-t border-slate-200 pt-3">
                        <div class="flex items-center justify-between text-base font-bold text-slate-950">
                          <span>Client pays</span>
                          <span>{{ formatMoney(clientTotalAmount) }}</span>
                        </div>
                      </div>
                    </div>

                    <p v-if="previewData" class="mt-4 text-sm text-slate-500">Your earnings: {{ formatMoney(markupAmount) }}</p>
                    <p v-if="previewData?.summary" class="mt-2 text-sm text-slate-500">{{ previewData.summary }}</p>
                    <p v-if="selectedPreviewShopLabel" class="mt-2 text-sm text-slate-500">Production source: {{ selectedPreviewShopLabel }}</p>
                    <p v-if="selectedPreviewShop?.missing_requirements?.length && !previewData" class="mt-2 text-sm text-slate-500">
                      Missing requirements: {{ missingRequirementsText(selectedPreviewShop) }}
                    </p>
                    <p v-if="previewWarning" class="mt-4 text-sm font-medium text-amber-700">{{ previewWarning }}</p>
                    <p v-if="previewData" class="mt-4 text-xs text-slate-400">Final amounts confirmed when quote is created.</p>

                    <div v-if="!previewData" class="mt-5 rounded-2xl border border-dashed border-slate-300 bg-white p-5 text-sm text-slate-500">
                      {{ isAssignedRequestMode ? 'Choose a priced production option to unlock the markup panel.' : 'Price preview appears here after the production preview call succeeds.' }}
                    </div>
                  </div>
                </div>
              </div>
            </template>

            <template v-else>
              <div class="space-y-6">
                <div>
                  <h3 class="text-lg font-semibold text-slate-900">Step 3 - Review and send</h3>
                  <p class="mt-1 text-sm text-slate-500">Confirm the client, specs, and final price before sending.</p>
                </div>

                <div class="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                  <div class="grid gap-4 md:grid-cols-2">
                    <div class="rounded-2xl border border-slate-200 bg-white p-4">
                      <p class="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Client</p>
                      <p class="mt-2 text-sm font-semibold text-slate-900">{{ reviewClientLabel }}</p>
                    </div>
                    <div class="rounded-2xl border border-slate-200 bg-white p-4">
                      <p class="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Job</p>
                      <p class="mt-2 text-sm font-semibold text-slate-900">{{ reviewJobLabel }}</p>
                    </div>
                    <div class="rounded-2xl border border-slate-200 bg-white p-4 md:col-span-2">
                      <p class="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Specs</p>
                      <p class="mt-2 text-sm font-semibold text-slate-900">{{ reviewSpecsLabel }}</p>
                    </div>
                    <div class="rounded-2xl border border-slate-200 bg-white p-4">
                      <p class="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Client pays</p>
                      <p class="mt-2 text-sm font-semibold text-slate-900">{{ formatMoney(clientTotalAmount) }}</p>
                    </div>
                    <div class="rounded-2xl border border-slate-200 bg-white p-4">
                      <p class="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Your margin</p>
                      <p class="mt-2 text-sm font-semibold text-slate-900">{{ formatMoney(markupAmount) }}</p>
                    </div>
                    <div class="rounded-2xl border border-slate-200 bg-white p-4 md:col-span-2">
                      <p class="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Production source</p>
                      <p class="mt-2 text-sm font-semibold text-slate-900">{{ reviewShopLabel }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </template>
          </div>

          <div class="border-t border-slate-200 px-6 py-4">
            <div class="flex flex-wrap items-center justify-between gap-3">
              <BaseButton v-if="quotePanelStep > 1" variant="secondary" size="md" @click="quotePanelStep = Math.max(1, quotePanelStep - 1)">Back</BaseButton>
              <div class="ml-auto flex flex-wrap items-center gap-3">
                <BaseButton v-if="quotePanelStep === 1" variant="primary" size="md" :disabled="!canContinueStepOne" @click="quotePanelStep = 2">Continue</BaseButton>
                <BaseButton v-else-if="quotePanelStep === 2" variant="primary" size="md" @click="continueFromClientStep">Continue</BaseButton>
                <template v-else>
                  <BaseButton v-if="!isAssignedRequestMode" variant="secondary" size="md" :loading="draftSaveLoading" :disabled="!canSaveDraft" @click="savePartnerQuoteDraft">Save as draft</BaseButton>
                  <BaseButton variant="primary" size="md" :loading="sendLoading" :disabled="!canSendQuote" @click="submitPartnerQuote">Send quote to client</BaseButton>
                </template>
              </div>
            </div>
          </div>
        </aside>
        </Transition>
      </template>

      <template v-else>
        <DashboardSection :title="sectionTitle" subtitle="Role-specific partner view">
          <BaseTable :columns="columns" :rows="rows" :loading="loading" :empty-text="emptyText" variant="dashboard" />
          <DashboardEmptyState v-if="!loading && isUiOnly" title="UI-only section" description="This route exists, but the backend action set for this section is not implemented yet." />
        </DashboardSection>
      </template>
    </template>
    <NuxtPage v-else />
  </RoleDashboardFrame>
</template>

<script setup lang="ts">
import BaseAlert from '~/components/base/BaseAlert.vue'
import BaseButton from '~/components/base/BaseButton.vue'
import BaseInput from '~/components/base/BaseInput.vue'
import BaseSelect from '~/components/base/BaseSelect.vue'
import BaseTable from '~/components/base/BaseTable.vue'
import BaseTextarea from '~/components/base/BaseTextarea.vue'
import DashboardEmptyState from '~/components/dashboard/DashboardEmptyState.vue'
import DashboardPageHeader from '~/components/dashboard/DashboardPageHeader.vue'
import DashboardSection from '~/components/dashboard/DashboardSection.vue'
import RoleDashboardFrame from '~/components/dashboard/RoleDashboardFrame.vue'
import { fetchCalculatorConfig } from '~/services/calculator'
import { useDashboardApi } from '~/services/dashboard'
import { createAssignedManagerQuote, createPartnerClient, createPartnerQuote, fetchAssignedRequestShopOptions, fetchPartnerProductionMatches, getPartnerQuoteDetail, getPartnerQuotes, previewPartnerQuote, searchPartnerClients, sendPartnerQuoteToClient } from '~/services/partner'
import { getApiErrorMessage, normalizeApiList } from '~/shared/api'

definePageMeta({ layout: false, middleware: 'auth' })

const auth = useAuthStore()
const router = useRouter()
const { fetchDashboardSection } = useDashboardApi()
if (!auth.canAccessPartnerDashboard) {
  await navigateTo(auth.homeRoute)
}

const route = useRoute()
const hasId = computed(() => !!route.params.id)
const section = computed(() => String(route.params.section || 'quotes'))
const displayName = computed(() => auth.user?.name || auth.user?.email || 'Partner')
const initials = computed(() => displayName.value.split(' ').map(part => part[0]).join('').slice(0, 2).toUpperCase() || 'PT')
const loading = ref(true)
const quotesLoading = ref(true)
const pageError = ref('')
const toastMessage = ref('')
const payload = ref<any>(null)
const rows = ref<Array<Record<string, any>>>([])
const quoteRows = ref<Array<Record<string, any>>>([])
const quotePanelOpen = ref(false)
const quotePanelStep = ref(1)
const panelError = ref('')
const config = ref<Record<string, any> | null>(null)
const previewLoading = ref(false)
const sendLoading = ref(false)
const clientCreateLoading = ref(false)
const draftSaveLoading = ref(false)
const previewData = ref<Record<string, any> | null>(null)
const rawPricingPreview = ref<Record<string, any> | null>(null)
const productionMatches = ref<Array<Record<string, any>>>([])
const selectedPreviewShop = ref<Record<string, any> | null>(null)
const previewRefreshToken = ref(0)
const previewWarning = ref('')
const assignedRequestContext = ref<Record<string, any> | null>(null)
const clientSearchQuery = ref('')
const clientSearchResults = ref<Array<Record<string, any>>>([])
const clientSearchError = ref('')
const selectedClient = ref<Record<string, any> | null>(null)
const showNewClientForm = ref(false)
const searchLoading = ref(false)
const markupRate = ref('30')
const newClientForm = reactive({
  name: '',
  phone: '',
  email: '',
  company: '',
})
const quoteSpecs = reactive({
  product_type: 'business_card',
  finished_size: '',
  quantity: '100',
  paper_stock: '',
  print_sides: 'SIMPLEX',
  color_mode: 'COLOR',
  lamination: 'none',
  urgency_type: 'standard',
  note: '',
})
let searchTimer: ReturnType<typeof setTimeout> | null = null
let previewRefreshTimer: ReturnType<typeof setTimeout> | null = null

const quoteColumns = [
  { key: 'client', label: 'Client' },
  { key: 'product', label: 'Product' },
  { key: 'client_pays', label: 'Client pays' },
  { key: 'your_margin', label: 'Your margin' },
  { key: 'status', label: 'Status' },
  { key: 'date', label: 'Date' },
  { key: 'next_action', label: 'Action' },
]

const quoteStepPills = [
  { value: 1, label: '1. Specs + Price' },
  { value: 2, label: '2. Client' },
  { value: 3, label: '3. Review + Send' },
]

const sectionTitleMap: Record<string, string> = {
  jobs: 'Partner Jobs',
  clients: 'Partner Clients',
  'production-shops': 'Production Shops',
  payments: 'Partner Payments',
  markups: 'Markups',
  samples: 'Samples',
  settings: 'Settings',
}
const sectionTitle = computed(() => sectionTitleMap[section.value] || 'Partner Section')
const isUiOnly = computed(() => !payload.value)
const emptyText = computed(() => isUiOnly.value ? 'This section is UI-only right now.' : `No ${section.value} yet.`)
const columns = computed(() => {
  if (section.value === 'clients') return [{ key: 'name', label: 'Client' }]
  if (section.value === 'production-shops') return [{ key: 'name', label: 'Shop' }, { key: 'slug', label: 'Slug' }]
  if (section.value === 'payments') return [{ key: 'reference', label: 'Reference' }, { key: 'partner_commission', label: 'Partner Commission' }, { key: 'status', label: 'Status' }]
  return [{ key: 'reference', label: 'Reference' }, { key: 'status', label: 'Status' }, { key: 'client_name', label: 'Client' }]
})
const navItems = computed(() => [
  { label: 'Overview', to: '/dashboard/partner' },
  { label: 'Quotes', to: '/dashboard/partner/quotes', active: section.value === 'quotes' },
  { label: 'Jobs', to: '/dashboard/partner/jobs', active: section.value === 'jobs' },
  { label: 'Clients', to: '/dashboard/partner/clients', active: section.value === 'clients' },
  { label: 'Shops', to: '/dashboard/partner/production-shops', active: section.value === 'production-shops' },
  { label: 'Rate Card', to: '/dashboard/partner/rate-card' },
  { label: 'Messages', to: '/dashboard/partner/messages' },
])

const productTypeOptions = computed(() => (config.value?.products || config.value?.product_types || []).map((item: Record<string, any>) => ({
  label: item.label,
  value: item.key,
})))
const selectedProduct = computed(() => (config.value?.products || config.value?.product_types || []).find((item: Record<string, any>) => item.key === quoteSpecs.product_type) || null)
const sizeOptions = computed(() => ((selectedProduct.value?.size_options || selectedProduct.value?.sizes || []) as Array<Record<string, any>>).map(item => ({
  label: item.label,
  value: item.id || item.value,
})))
const paperOptions = computed(() => ((selectedProduct.value?.paper_stocks || selectedProduct.value?.paper_options || config.value?.paper_stocks || []) as Array<Record<string, any>>).map(item => ({
  label: item.label || item.display_name || item.paper_name,
  value: item.key || item.id || item.value,
})))
const colorModeOptions = computed(() => ((selectedProduct.value?.color_mode_options || config.value?.color_modes || [
  { label: 'Full color', value: 'COLOR' },
  { label: 'Black & white', value: 'BW' },
]) as Array<Record<string, any>>).map(item => ({
  label: item.label,
  value: item.value,
})))
const sideOptions = [
  { label: 'Single-sided', value: 'SIMPLEX' },
  { label: 'Double-sided', value: 'DUPLEX' },
]
const finishingOptions = [
  { label: 'None', value: 'none' },
  { label: 'Matt lamination', value: 'matt-lamination' },
  { label: 'Gloss lamination', value: 'gloss-lamination' },
]
const turnaroundOptions = [
  { label: 'Standard', value: 'standard' },
  { label: 'Express', value: 'express' },
  { label: 'Same day', value: 'same_day' },
]

const productionBase = computed(() => Number(previewData.value?.production_estimate || 0))
const platformFeePercent = computed(() => Number(previewData.value?.platform_service_percent || 30))
const markupRateNumber = computed(() => Math.max(0, Number(markupRate.value || 0)))
const markupAmount = computed(() => roundMoney(productionBase.value * markupRateNumber.value / 100))
const platformFeeAmount = computed(() => roundMoney(productionBase.value * platformFeePercent.value / 100))
const clientTotalAmount = computed(() => roundMoney(productionBase.value + markupAmount.value + platformFeeAmount.value))
const markupHighWarning = computed(() => markupRateNumber.value > 100 ? 'Your client will pay more than double production cost. Are you sure?' : '')
const isAssignedRequestMode = computed(() => Boolean(assignedRequestContext.value?.id))
const selectedPreviewShopLabel = computed(() => selectedPreviewShop.value?.shop_display_name || selectedPreviewShop.value?.shop_slug || '')
const newClientHasAnyValue = computed(() => Boolean(
  newClientForm.name.trim()
  || newClientForm.phone.trim()
  || newClientForm.email.trim()
  || newClientForm.company.trim(),
))
const previewShopOptions = computed(() => (productionMatches.value as Array<Record<string, any>>)
  .filter(shop => shop?.shop_id)
  .map(shop => ({
    label: shop.shop_display_name || shop.shop_slug || `Shop #${shop.shop_id}`,
    value: String(shop.shop_id),
  })))
const selectedPreviewShopId = computed({
  get: () => selectedPreviewShop.value?.shop_id ? String(selectedPreviewShop.value.shop_id) : '',
  set: (value: string) => {
    const nextShop = productionMatches.value
      .find(shop => String(shop?.shop_id || '') === String(value))
    selectedPreviewShop.value = nextShop || null
  },
})
const hasValidProductionBase = computed(() => productionBase.value > 0)
const hasPricedSelectedShop = computed(() => Boolean(selectedPreviewShop.value?.shop_id && selectedPreviewShop.value?.price_status === 'priced'))
const canContinueFromPreview = computed(() => Boolean(previewData.value && hasValidProductionBase.value && clientTotalAmount.value > 0 && hasPricedSelectedShop.value))
const canContinueStepOne = computed(() => canContinueFromPreview.value)
const canSaveDraft = computed(() => !isAssignedRequestMode.value && canContinueFromPreview.value)
const hasClientForSend = computed(() => Boolean(
  isAssignedRequestMode.value
  || selectedClient.value?.id
  || newClientForm.email.trim(),
))
const canSendQuote = computed(() => Boolean(
  hasClientForSend.value
  && rawPricingPreview.value
  && previewData.value
  && selectedPreviewShop.value?.shop_id
  && hasValidProductionBase.value
  && clientTotalAmount.value > 0,
))
const missingSpecFields = computed(() => Array.isArray(rawPricingPreview.value?.missing_fields) ? rawPricingPreview.value.missing_fields : [])
const noPricedShopOptions = computed(() => productionMatches.value.length > 0 && !productionMatches.value.some(shop => shop?.price_status === 'priced'))
const productionActionLabel = computed(() => isAssignedRequestMode.value ? 'Find production options' : 'Get production prices')
const reviewShopLabel = computed(() => selectedPreviewShop.value?.shop_display_name || 'No production shop selected')
const reviewClientLabel = computed(() => {
  if (assignedRequestContext.value) {
    return assignedRequestContext.value.client_label || 'Assigned client'
  }
  if (selectedClient.value) {
    return `${selectedClient.value.name || 'Client'} · ${selectedClient.value.phone || selectedClient.value.email || `Client #${selectedClient.value.id}`}`
  }
  if (newClientHasAnyValue.value) {
    return `${newClientForm.name.trim() || newClientForm.company.trim() || 'New client'} · ${newClientForm.phone.trim() || newClientForm.email.trim() || 'Draft details'}`
  }
  return 'No client selected'
})
const reviewJobLabel = computed(() => {
  const productLabel = productTypeOptions.value.find((option: { label: string; value: string | number }) => option.value === quoteSpecs.product_type)?.label || quoteSpecs.product_type
  const sizeLabel = sizeOptions.value.find((option: { label: string; value: string | number }) => option.value === quoteSpecs.finished_size)?.label || quoteSpecs.finished_size
  return `${productLabel} · ${quoteSpecs.quantity} qty · ${sizeLabel}`
})
const reviewSpecsLabel = computed(() => {
  const paperLabel = paperOptions.value.find((option: { label: string; value: string | number }) => option.value === quoteSpecs.paper_stock)?.label || quoteSpecs.paper_stock
  const colorLabel = colorModeOptions.value.find((option: { label: string; value: string | number }) => option.value === quoteSpecs.color_mode)?.label || quoteSpecs.color_mode
  const finishingLabel = finishingOptions.find((option: { label: string; value: string }) => option.value === quoteSpecs.lamination)?.label || 'None'
  return `${quoteSpecs.print_sides === 'DUPLEX' ? 'Double-sided' : 'Single-sided'} · ${colorLabel} · ${paperLabel} · ${finishingLabel}`
})

function roundMoney(value: number) {
  return Number(Number(value || 0).toFixed(2))
}

function formatMoney(value: number | string | null | undefined) {
  const amount = Number(value || 0)
  if (!Number.isFinite(amount) || amount <= 0) {
    return 'KES 0.00'
  }
  return `KES ${amount.toLocaleString('en-KE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

function productionStatusTone(row: Record<string, any>) {
  if (row?.can_produce && row?.price_available) return 'border-green-200 bg-green-50/60'
  if (row?.can_produce) return 'border-amber-200 bg-amber-50/60'
  return 'border-slate-200 bg-slate-50'
}

function missingRequirementsText(row: Record<string, any>) {
  const values = Array.isArray(row?.missing_requirements) ? row.missing_requirements : []
  if (!values.length) return 'No missing requirements'
  return values.map((value: string) => String(value).replace(/_/g, ' ')).join(', ')
}

function specFieldLabel(value: unknown) {
  return String(value || '')
    .replace(/_/g, ' ')
    .replace(/\b\w/g, char => char.toUpperCase())
}

function shopSelectLabel(row: Record<string, any>) {
  if (row?.price_status === 'priced') return 'Select this shop'
  if (row?.price_status === 'missing_specs') return 'Missing specs'
  if (row?.price_status === 'missing_pricing') return 'Needs pricing setup'
  return 'Unavailable'
}

function productSummary(row: Record<string, any>) {
  const latestSnapshot = row.latest_response?.response_snapshot || row.detail?.latest_response?.response_snapshot || {}
  const requestSnapshot = row.request_snapshot || row.detail?.request_snapshot || row.detail?.latest_response?.quote_request?.request_snapshot || {}
  const calculatorInputs = requestSnapshot.calculator_inputs && typeof requestSnapshot.calculator_inputs === 'object'
    ? requestSnapshot.calculator_inputs
    : {}
  return latestSnapshot.product_label
    || requestSnapshot.product_label
    || requestSnapshot.product_type
    || calculatorInputs.product_type
    || row.reference
    || 'Quote'
}

function derivePartnerStatus(detail: Record<string, any> | null, listRow: Record<string, any>) {
  const job = detail?.managed_job || null
  const paymentStatus = String(job?.payment_status || '').toLowerCase()
  const assignmentStatus = String(job?.assignment_status || '').toLowerCase()
  const jobStatus = String(job?.status || '').toLowerCase()
  if (['completed', 'delivered'].includes(jobStatus)) return 'complete'
  if (job?.dispatched_at || assignmentStatus === 'assignment_pending' || assignmentStatus === 'assigned' || assignmentStatus === 'accepted') return 'dispatched'
  if (['confirmed', 'release_ready', 'paid'].includes(paymentStatus)) return 'paid'
  if (job?.id) return 'accepted'
  if (!hasListResponse(detail || listRow)) return 'awaiting_response'
  return String(listRow.status || 'draft').toLowerCase()
}

function statusBadgeClass(status: string) {
  const value = String(status || '').toLowerCase()
  if (value === 'sent') return 'bg-amber-50 text-amber-700'
  if (value === 'awaiting_response' || value === 'submitted') return 'bg-slate-100 text-slate-700'
  if (value === 'accepted') return 'bg-green-50 text-green-700'
  if (value === 'paid') return 'bg-green-100 text-green-800'
  if (value === 'dispatched') return 'bg-blue-50 text-blue-700'
  if (value === 'complete') return 'bg-teal-50 text-teal-700'
  return 'bg-slate-100 text-slate-600'
}

function partnerStatusLabel(status: string) {
  return String(status || 'draft')
    .replace(/[_-]+/g, ' ')
    .replace(/\b\w/g, char => char.toUpperCase())
}

function openQuoteDetail(row: Record<string, any>) {
  navigateTo(`/dashboard/partner/quotes/${row.quote_request_id || row.id}`)
}

function hasListResponse(row: Record<string, any> | null) {
  return Boolean(row?.latest_response?.id)
}

async function prepareAssignedRequest(requestId: string | number) {
  panelError.value = ''
  previewWarning.value = ''
  toastMessage.value = ''
  await loadCalculatorConfig()
  const payload = await getPartnerQuoteDetail(requestId)
  const detail = payload?.quote || null
  if (!detail) {
    throw new Error('Assigned request could not be loaded.')
  }
  const snapshot = detail.request_snapshot && typeof detail.request_snapshot === 'object' ? detail.request_snapshot : {}
  const calculatorInputs = snapshot.calculator_inputs && typeof snapshot.calculator_inputs === 'object'
    ? snapshot.calculator_inputs as Record<string, any>
    : {}
  assignedRequestContext.value = {
    id: detail.id,
    client_label: detail.client_name
      ? `${detail.client_name} · ${detail.client_phone || detail.client_email || detail.request_reference || `Request #${detail.id}`}`
      : detail.request_reference || `Request #${detail.id}`,
  }
  selectedClient.value = null
  showNewClientForm.value = false
  quoteSpecs.product_type = String(snapshot.product_type || calculatorInputs.product_type || quoteSpecs.product_type)
  quoteSpecs.finished_size = String(snapshot.finished_size || snapshot.size_label || calculatorInputs.finished_size || '')
  quoteSpecs.quantity = String(snapshot.quantity || calculatorInputs.quantity || quoteSpecs.quantity)
  quoteSpecs.paper_stock = String(snapshot.paper_stock || calculatorInputs.paper_stock || '')
  quoteSpecs.print_sides = String(snapshot.print_sides || calculatorInputs.print_sides || 'SIMPLEX')
  quoteSpecs.color_mode = String(snapshot.color_mode || calculatorInputs.color_mode || 'COLOR')
  quoteSpecs.lamination = String(snapshot.lamination || calculatorInputs.lamination || 'none')
  quoteSpecs.urgency_type = String(snapshot.urgency_type || calculatorInputs.urgency_type || 'standard')
  quoteSpecs.note = String(snapshot.custom_brief || detail.notes || '')
  rawPricingPreview.value = null
  previewData.value = null
  productionMatches.value = []
  selectedPreviewShop.value = null
  markupRate.value = '30'
  quotePanelOpen.value = true
  quotePanelStep.value = 1
  await loadProductionPreview()
}

function openQuotePanel() {
  toastMessage.value = ''
  panelError.value = ''
  previewWarning.value = ''
  clientSearchError.value = ''
  assignedRequestContext.value = null
  quotePanelOpen.value = true
  quotePanelStep.value = 1
}

function closeQuotePanel() {
  quotePanelOpen.value = false
  quotePanelStep.value = 1
  panelError.value = ''
  selectedClient.value = null
  showNewClientForm.value = false
  clientSearchQuery.value = ''
  clientSearchError.value = ''
  clientSearchResults.value = []
  previewData.value = null
  rawPricingPreview.value = null
  productionMatches.value = []
  selectedPreviewShop.value = null
  assignedRequestContext.value = null
  markupRate.value = '30'
  Object.assign(newClientForm, {
    name: '',
    phone: '',
    email: '',
    company: '',
  })
}

function goToStep(step: number) {
  if (step <= quotePanelStep.value || (step === 2 && canContinueStepOne.value) || (step === 3 && canContinueStepOne.value)) {
    quotePanelStep.value = step
  }
}

function selectClient(client: Record<string, any>) {
  selectedClient.value = {
    ...client,
    id: client.client_id || client.id,
    client_id: client.client_id || client.id,
  }
  showNewClientForm.value = false
  panelError.value = ''
}

async function continueFromClientStep() {
  panelError.value = ''
  quotePanelStep.value = 3
}

function applySpecDefaults() {
  if (!quoteSpecs.finished_size && sizeOptions.value[0]) {
    quoteSpecs.finished_size = String(sizeOptions.value[0].value)
  }
  if (!quoteSpecs.paper_stock && paperOptions.value[0]) {
    quoteSpecs.paper_stock = String(paperOptions.value[0].value)
  }
}

async function loadQuotesSection() {
  quotesLoading.value = true
  pageError.value = ''
  try {
    const list = await getPartnerQuotes()
    const detailedRows = list.map((row) => {
      const pricing = row.latest_response?.response_snapshot?.customer_pricing || {}
      const derivedStatus = derivePartnerStatus(row, row)
      return {
        id: row.id,
        quote_request_id: row.id,
        client: row.customer_name || 'Client',
        product: productSummary(row),
        client_pays: hasListResponse(row)
          ? formatMoney(pricing.final_client_price || pricing.estimated_total || row.managed_job?.pricing?.client_total || 0)
          : 'Awaiting quote',
        your_margin: hasListResponse(row)
          ? formatMoney(pricing.broker_margin_amount || 0)
          : 'Pending',
        status: derivedStatus,
        date: formatDate(row.created_at || row.updated_at),
        next_action: hasListResponse(row) ? 'Open quote' : 'Review request',
      }
    })
    quoteRows.value = detailedRows
  } catch (error: unknown) {
    pageError.value = getApiErrorMessage(error, 'Partner quotes are unavailable right now.')
  } finally {
    quotesLoading.value = false
    loading.value = false
  }
}

async function loadGenericSection() {
  loading.value = true
  pageError.value = ''
  try {
    payload.value = await fetchDashboardSection('partner', section.value)
    rows.value = normalizeApiList(payload.value?.results || [])
  } catch (error: unknown) {
    pageError.value = getApiErrorMessage(error, 'Partner dashboard section is unavailable right now.')
  } finally {
    loading.value = false
  }
}

async function loadCalculatorConfig() {
  if (config.value) {
    return
  }
  config.value = await fetchCalculatorConfig()
  applySpecDefaults()
}

async function loadProductionPreview() {
  panelError.value = ''
  previewWarning.value = ''
  try {
    previewLoading.value = true
    await loadCalculatorConfig()
    const payload = {
      product_type: quoteSpecs.product_type,
      quantity: Number(quoteSpecs.quantity || 0),
      finished_size: quoteSpecs.finished_size,
      print_sides: quoteSpecs.print_sides,
      color_mode: quoteSpecs.color_mode,
      paper_stock: quoteSpecs.paper_stock,
      lamination: quoteSpecs.lamination,
      urgency_type: quoteSpecs.urgency_type,
      note: quoteSpecs.note,
    }
    const matchResponse = assignedRequestContext.value?.id
      ? await fetchAssignedRequestShopOptions(assignedRequestContext.value.id, payload)
      : await fetchPartnerProductionMatches(payload)
    productionMatches.value = Array.isArray(matchResponse?.results) ? matchResponse.results : []
    rawPricingPreview.value = matchResponse?.pricing_snapshot || null
    selectedPreviewShop.value = productionMatches.value.find(shop => shop?.can_produce && shop?.price_available) || productionMatches.value[0] || null
    if (Array.isArray(matchResponse?.missing_fields) && matchResponse.missing_fields.length) {
      previewWarning.value = `Complete these specs to unlock exact pricing: ${matchResponse.missing_fields.map(specFieldLabel).join(', ')}`
    }
    if (!selectedPreviewShop.value?.shop_id) {
      previewWarning.value = matchResponse?.summary || 'The production preview did not return a selectable shop.'
      previewData.value = null
      return
    }
    if (!selectedPreviewShop.value?.can_produce || !selectedPreviewShop.value?.price_available) {
      previewWarning.value = selectedPreviewShop.value?.reason || 'Production price is not available yet. Choose a shop with pricing or adjust specs.'
      previewData.value = null
      return
    }
    await refreshPartnerPreview()
  } catch (error: unknown) {
    panelError.value = getApiErrorMessage(error, 'We could not fetch the production preview.')
  } finally {
    previewLoading.value = false
  }
}

function buildCalculatorInputsSnapshot() {
  return {
    product_type: quoteSpecs.product_type,
    quantity: Number(quoteSpecs.quantity || 0),
    finished_size: quoteSpecs.finished_size,
    paper_stock: quoteSpecs.paper_stock,
    print_sides: quoteSpecs.print_sides,
    color_mode: quoteSpecs.color_mode,
    lamination: quoteSpecs.lamination,
    urgency_type: quoteSpecs.urgency_type,
  }
}

function buildPartnerQuotePayload(overrides: Record<string, any> = {}) {
  return {
    shop: selectedPreviewShop.value?.shop_id,
    title: `${reviewJobLabel.value} for ${selectedClient.value?.name || newClientForm.name.trim() || 'client'}`,
    client_id: selectedClient.value?.client_id || selectedClient.value?.id || null,
    client_name: selectedClient.value?.name || newClientForm.name.trim(),
    client_email: selectedClient.value?.email || newClientForm.email.trim(),
    client_phone: selectedClient.value?.phone || newClientForm.phone.trim(),
    client_company: selectedClient.value?.company || newClientForm.company.trim(),
    calculator_inputs_snapshot: buildCalculatorInputsSnapshot(),
    pricing_snapshot: rawPricingPreview.value,
    partner_markup: markupAmount.value.toFixed(2),
    note: quoteSpecs.note,
    ...overrides,
  }
}

async function ensureSelectedClientForSend() {
  if (assignedRequestContext.value || selectedClient.value?.id) {
    return selectedClient.value
  }
  if (!newClientForm.email.trim()) {
    throw new Error('Client email is required before sending this quote.')
  }
  clientCreateLoading.value = true
  try {
    const createdClient = await createPartnerClient({
      name: newClientForm.name.trim(),
      phone: newClientForm.phone.trim(),
      email: newClientForm.email.trim(),
      company: newClientForm.company.trim(),
    })
    selectClient(createdClient)
    clientSearchError.value = ''
    return createdClient
  } finally {
    clientCreateLoading.value = false
  }
}

async function savePartnerQuoteDraft() {
  if (!selectedPreviewShop.value?.shop_id || !rawPricingPreview.value || !hasValidProductionBase.value || clientTotalAmount.value <= 0) {
    panelError.value = 'Production price is not available yet. Choose a shop with pricing or adjust specs.'
    return
  }

  panelError.value = ''
  draftSaveLoading.value = true
  try {
    await createPartnerQuote(buildPartnerQuotePayload({ save_as_draft: true }))
    toastMessage.value = 'Draft quote saved'
    closeQuotePanel()
    await loadQuotesSection()
  } catch (error: unknown) {
    panelError.value = getApiErrorMessage(error, 'We could not save this draft yet.')
  } finally {
    draftSaveLoading.value = false
  }
}

function getSelectedShopSubtotal() {
  const shopPreview = ((rawPricingPreview.value?.selected_shops || []) as Array<Record<string, any>>)
    .find(shop => String(shop?.id || '') === String(selectedPreviewShop.value?.shop_id || ''))
  return Number(
    shopPreview?.preview?.totals?.shop_total
    || shopPreview?.preview?.totals?.grand_total
    || selectedPreviewShop.value?.production_cost
    || 0,
  )
}

async function refreshPartnerPreview() {
  if (!rawPricingPreview.value || !selectedPreviewShop.value?.shop_id) {
    previewData.value = null
    return
  }

  if (!selectedPreviewShop.value?.can_produce || !selectedPreviewShop.value?.price_available) {
    previewData.value = null
    previewWarning.value = selectedPreviewShop.value?.reason || 'Production price is not available yet. Choose a shop with pricing or adjust specs.'
    return
  }

  const productionSubtotal = getSelectedShopSubtotal()
  if (!(productionSubtotal > 0)) {
    previewData.value = null
    previewWarning.value = 'Production price is not available yet. Choose a shop with pricing or adjust specs.'
    return
  }

  const requestToken = ++previewRefreshToken.value
  previewWarning.value = ''
  const markupAmountValue = roundMoney(productionSubtotal * markupRateNumber.value / 100)
  const response = await previewPartnerQuote({
    shop: selectedPreviewShop.value.shop_id,
    pricing_snapshot: rawPricingPreview.value,
    partner_markup: markupAmountValue.toFixed(2),
  })

  if (requestToken !== previewRefreshToken.value) {
    return
  }

  previewData.value = response
  if (Number(response?.production_estimate || 0) <= 0) {
    previewWarning.value = 'Production price is not available yet. Choose a shop with pricing or adjust specs.'
  }
}

async function submitPartnerQuote() {
  if (!selectedPreviewShop.value?.shop_id || !rawPricingPreview.value || !hasValidProductionBase.value || clientTotalAmount.value <= 0) {
    panelError.value = 'Production price is not available yet. Choose a shop with pricing or adjust specs.'
    return
  }

  panelError.value = ''
  sendLoading.value = true
  try {
    if (assignedRequestContext.value?.id) {
      await createAssignedManagerQuote(assignedRequestContext.value.id, {
        shop: selectedPreviewShop.value.shop_id,
        pricing_snapshot: rawPricingPreview.value,
        partner_markup: markupAmount.value.toFixed(2),
        note: quoteSpecs.note,
      })
      toastMessage.value = 'Quote sent to the assigned client'
      closeQuotePanel()
      await loadQuotesSection()
      return
    }
    const clientRecord = await ensureSelectedClientForSend()
    const draftResponse = await createPartnerQuote(buildPartnerQuotePayload({
      save_as_draft: true,
      client_id: clientRecord?.client_id || clientRecord?.id || null,
    }))
    await sendPartnerQuoteToClient(draftResponse.quote_request_id, {
      broker_margin_type: 'fixed',
      broker_margin_value: markupAmount.value.toFixed(2),
      note: quoteSpecs.note,
    })
    toastMessage.value = `Quote sent to ${clientRecord?.name || 'client'}`
    closeQuotePanel()
    await loadQuotesSection()
  } catch (error: unknown) {
    panelError.value = getApiErrorMessage(error, 'We could not send this partner quote.')
  } finally {
    sendLoading.value = false
  }
}

function formatDate(value: unknown) {
  if (!value) {
    return 'Recent'
  }
  const date = new Date(String(value))
  if (Number.isNaN(date.getTime())) {
    return 'Recent'
  }
  return new Intl.DateTimeFormat('en-KE', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date)
}

watch(selectedProduct, () => {
  applySpecDefaults()
})

watch(() => selectedPreviewShop.value?.shop_id, async (shopId, previousShopId) => {
  if (!shopId || shopId === previousShopId || !rawPricingPreview.value || previousShopId === undefined) {
    return
  }
  previewLoading.value = true
  panelError.value = ''
  try {
    await refreshPartnerPreview()
  } catch (error: unknown) {
    panelError.value = getApiErrorMessage(error, 'We could not refresh the production preview.')
  } finally {
    previewLoading.value = false
  }
})

watch(markupRate, (value) => {
  markupRate.value = String(Math.min(200, Math.max(5, Number(value || 0) || 0)))
  if (!rawPricingPreview.value || !selectedPreviewShop.value?.shop_id) {
    return
  }
  if (previewRefreshTimer) {
    clearTimeout(previewRefreshTimer)
  }
  previewRefreshTimer = setTimeout(async () => {
    previewLoading.value = true
    panelError.value = ''
    try {
      await refreshPartnerPreview()
    } catch (error: unknown) {
      panelError.value = getApiErrorMessage(error, 'We could not refresh the production preview.')
    } finally {
      previewLoading.value = false
    }
  }, 250)
})

watch(clientSearchQuery, (value) => {
  if (searchTimer) {
    clearTimeout(searchTimer)
  }
  clientSearchError.value = ''
  const normalizedQuery = String(value || '').trim()
  if (section.value !== 'quotes' || !quotePanelOpen.value || normalizedQuery.length < 2) {
    clientSearchResults.value = []
    searchLoading.value = false
    return
  }
  searchTimer = setTimeout(async () => {
    searchLoading.value = true
    try {
      clientSearchResults.value = await searchPartnerClients(normalizedQuery)
    } catch (error: unknown) {
      clientSearchResults.value = []
      clientSearchError.value = getApiErrorMessage(error, 'Partner clients could not load.')
    } finally {
      searchLoading.value = false
    }
  }, 400)
})

watch(
  () => [section.value, quotePanelOpen.value, route.query.prepare, hasId.value] as const,
  async ([currentSection, panelOpen, prepareId, isDetailRoute]) => {
    if (currentSection !== 'quotes' || panelOpen || isDetailRoute || typeof prepareId !== 'string' || !prepareId) {
      return
    }
    panelError.value = ''
    try {
      await prepareAssignedRequest(prepareId)
      await router.replace({ query: { ...route.query, prepare: undefined } })
    } catch (error: unknown) {
      panelError.value = getApiErrorMessage(error, 'Assigned request could not be prepared.')
    }
  },
  { immediate: true },
)

try {
  if (section.value === 'quotes') {
    await loadCalculatorConfig()
    await loadQuotesSection()
  } else {
    await loadGenericSection()
  }
} catch (error: unknown) {
  pageError.value = getApiErrorMessage(error, 'Partner workspace could not load.')
  loading.value = false
  quotesLoading.value = false
}
</script>
