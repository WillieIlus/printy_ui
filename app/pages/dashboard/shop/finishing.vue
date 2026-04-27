<template>
  <DashboardShell sidebar-tone="dark">
    <template #sidebar>
      <ShopSidebarNav />
    </template>

    <div class="space-y-6">
      <DashboardTopBar
        eyebrow="Print shop"
        title="Finishing"
        description="Add lamination, cutting, rounded corners, binding, folding, mounting, eyelets, and other finishing rates your shop can price."
        action-label="Add finishing"
        @action="openAddForm"
      />

      <div class="grid gap-4 xl:grid-cols-[1.8fr_1fr]">
        <div class="rounded-3xl border border-[var(--p-primary)]/15 bg-[var(--p-primary)]/6 px-5 py-5">
          <div class="flex items-start gap-4">
            <div class="mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-2xl bg-[var(--p-primary)]/12 text-[var(--p-primary)]">
              <Icon name="lucide:scissors-line-dashed" class="size-5" />
            </div>
            <div class="space-y-2">
              <p class="text-sm font-semibold text-[var(--p-text)]">Buyer-safe finishing status</p>
              <p class="text-sm leading-6 text-[var(--p-text-muted)]">
                Active finishing rates help Printy tell buyers what your shop can price immediately, what is a common add-on,
                and what still needs manual confirmation.
              </p>
              <div class="flex flex-wrap gap-2 text-xs">
                <span class="rounded-full bg-white/70 px-3 py-1 font-medium text-[var(--p-text)]">Available</span>
                <span class="rounded-full bg-white/70 px-3 py-1 font-medium text-[var(--p-text)]">Needs confirmation</span>
                <span class="rounded-full bg-white/70 px-3 py-1 font-medium text-[var(--p-text)]">Price not listed yet</span>
                <span class="rounded-full bg-white/70 px-3 py-1 font-medium text-[var(--p-text)]">Common add-on</span>
              </div>
            </div>
          </div>
        </div>

        <div class="rounded-3xl border border-[var(--p-border)] bg-[var(--p-surface)] px-5 py-5">
          <p class="text-sm font-semibold text-[var(--p-text)]">Calculator matching</p>
          <p class="mt-1 text-sm text-[var(--p-text-muted)]">{{ calculatorSummary }}</p>
          <div class="mt-4 flex flex-wrap gap-2 text-xs">
            <span class="rounded-full bg-green-500/10 px-3 py-1 font-semibold text-green-600">
              {{ integratedCount }} integrated
            </span>
            <span class="rounded-full bg-amber-500/10 px-3 py-1 font-semibold text-amber-700">
              {{ confirmationCount }} need confirmation
            </span>
          </div>
        </div>
      </div>

      <div class="grid gap-4 md:grid-cols-3">
        <div class="rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface)] px-5 py-4">
          <p class="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--p-text-muted)]">Finishings</p>
          <p class="mt-2 text-2xl font-semibold text-[var(--p-text)]">{{ finishings.length }}</p>
          <p class="mt-1 text-sm text-[var(--p-text-muted)]">Saved rates across lamination, cutting, binding, and more.</p>
        </div>
        <div class="rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface)] px-5 py-4">
          <p class="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--p-text-muted)]">Active</p>
          <p class="mt-2 text-2xl font-semibold text-[var(--p-text)]">{{ activeCount }}</p>
          <p class="mt-1 text-sm text-[var(--p-text-muted)]">Rates currently available for quoting or matching.</p>
        </div>
        <div class="rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface)] px-5 py-4">
          <p class="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--p-text-muted)]">Common add-ons</p>
          <p class="mt-2 text-2xl font-semibold text-[var(--p-text)]">{{ commonAddonCount }}</p>
          <p class="mt-1 text-sm text-[var(--p-text-muted)]">Popular add-ons like lamination, cutting, and rounded corners.</p>
        </div>
      </div>

      <div v-if="loading" class="space-y-3">
        <div v-for="i in 4" :key="i" class="h-28 animate-pulse rounded-2xl bg-[var(--p-surface)]" />
      </div>

      <div
        v-else-if="loadError"
        class="rounded-2xl border border-[var(--p-error)]/30 bg-[var(--p-error-soft)] px-5 py-4 text-sm text-[var(--p-error)]"
      >
        <p class="font-semibold">Could not load finishing rates.</p>
        <p class="mt-1">{{ loadError }}</p>
        <BaseButton class="mt-3" size="sm" variant="ghost" @click="loadFinishingPage">Retry</BaseButton>
      </div>

      <template v-else>
        <div
          v-if="finishings.length === 0 && !showForm"
          class="rounded-3xl border border-dashed border-[var(--p-border)] bg-[var(--p-surface)]/40 px-8 py-14 text-center"
        >
          <div class="mx-auto mb-4 flex size-12 items-center justify-center rounded-2xl bg-[var(--p-primary)]/8 text-[var(--p-primary)]">
            <Icon name="lucide:sparkles" class="size-6" />
          </div>
          <p class="text-base font-semibold text-[var(--p-text)]">Add finishing prices</p>
          <p class="mx-auto mt-2 max-w-xl text-sm leading-6 text-[var(--p-text-muted)]">
            Finishing rates help Printy tell buyers what your shop can price immediately.
          </p>
          <BaseButton class="mt-6" size="sm" variant="primary" @click="openAddForm">Add finishing prices</BaseButton>
        </div>

        <div v-else class="space-y-3">
          <div
            v-for="finishing in finishings"
            :key="finishing.id"
            class="rounded-3xl border border-[var(--p-border)] bg-[var(--p-surface)] px-5 py-5"
            :class="editingFinishing?.id === finishing.id ? 'border-[var(--p-primary)]/40 bg-[var(--p-primary)]/[0.04]' : ''"
          >
            <div v-if="pendingAction?.id === finishing.id" class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p class="text-sm font-semibold text-[var(--p-text)]">
                  {{ pendingAction.action === 'delete' ? 'Delete this finishing rate?' : `${finishing.is_active ? 'Deactivate' : 'Activate'} this finishing rate?` }}
                </p>
                <p class="mt-1 text-sm text-[var(--p-text-muted)]">
                  {{ pendingAction.action === 'delete'
                    ? 'Deleting removes this pricing rule entirely.'
                    : (finishing.is_active
                      ? 'Deactivating keeps the record but removes it from immediate matching.'
                      : 'Reactivating makes the finishing rate available again.') }}
                </p>
              </div>
              <div class="flex items-center gap-2">
                <BaseButton size="sm" variant="ghost" :disabled="actionLoading" @click="pendingAction = null">Cancel</BaseButton>
                <BaseButton
                  size="sm"
                  variant="primary"
                  :loading="actionLoading"
                  :class="pendingAction.action === 'delete' ? 'bg-[var(--p-error)]!' : ''"
                  @click="confirmPendingAction(finishing)"
                >
                  {{ pendingAction.action === 'delete' ? 'Yes, delete' : (finishing.is_active ? 'Yes, deactivate' : 'Yes, activate') }}
                </BaseButton>
              </div>
            </div>

            <div v-else class="space-y-4">
              <div class="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div class="space-y-3">
                  <div class="flex flex-wrap items-center gap-2">
                    <span class="text-base font-semibold text-[var(--p-text)]">{{ finishing.name }}</span>
                    <span v-if="finishing.category_detail?.name" class="rounded-full bg-[var(--p-primary)]/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[var(--p-primary)]">
                      {{ finishing.category_detail.name }}
                    </span>
                    <span
                      class="rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider"
                      :class="finishing.is_active ? 'bg-green-500/10 text-green-600' : 'bg-[var(--p-border)] text-[var(--p-text-muted)]'"
                    >
                      {{ finishing.is_active ? 'Active' : 'Inactive' }}
                    </span>
                    <span
                      class="rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider"
                      :class="statusTone(finishingMeta(finishing).buyerStatus)"
                    >
                      {{ finishingMeta(finishing).buyerStatus }}
                    </span>
                    <span
                      v-if="finishingMeta(finishing).isCommonAddon"
                      class="rounded-full bg-sky-500/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-sky-600"
                    >
                      Common add-on
                    </span>
                  </div>

                  <div class="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                    <div class="rounded-2xl bg-[var(--p-surface-muted)]/70 px-4 py-3">
                      <p class="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--p-text-muted)]">Billing basis</p>
                      <p class="mt-1 text-sm font-semibold text-[var(--p-text)]">{{ billingBasisLabel(finishing.billing_basis) }}</p>
                      <p class="mt-1 text-sm text-[var(--p-text-muted)]">{{ chargeUnitLabel(finishing.charge_unit) }}{{ finishing.display_unit_label ? ` · ${finishing.display_unit_label}` : '' }}</p>
                    </div>
                    <div class="rounded-2xl bg-[var(--p-surface-muted)]/70 px-4 py-3">
                      <p class="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--p-text-muted)]">Price / rate</p>
                      <p class="mt-1 text-sm font-semibold text-[var(--p-text)]">KES {{ currency(finishing.price) }}</p>
                      <p class="mt-1 text-sm text-[var(--p-text-muted)]">{{ rateSummary(finishing) }}</p>
                    </div>
                    <div class="rounded-2xl bg-[var(--p-surface-muted)]/70 px-4 py-3">
                      <p class="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--p-text-muted)]">Applies to</p>
                      <p class="mt-1 text-sm font-semibold text-[var(--p-text)]">{{ appliesToHeadline(finishing) }}</p>
                      <p class="mt-1 text-sm text-[var(--p-text-muted)]">{{ appliesToDetail(finishing) }}</p>
                    </div>
                  </div>

                  <div class="space-y-1">
                    <p class="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--p-text-muted)]">Matching key</p>
                    <div class="flex flex-wrap items-center gap-2 text-sm">
                      <code class="rounded-lg bg-[var(--p-surface-muted)] px-2.5 py-1 text-[var(--p-text)]">{{ finishing.slug || 'auto-generated' }}</code>
                      <span class="text-[var(--p-text-muted)]">{{ integrationMessage(finishing) }}</span>
                    </div>
                  </div>

                  <p v-if="finishing.help_text" class="text-sm leading-6 text-[var(--p-text-muted)]">
                    {{ finishing.help_text }}
                  </p>
                </div>

                <div class="flex shrink-0 flex-wrap items-center gap-2">
                  <BaseButton size="sm" variant="secondary" @click="openEditForm(finishing)">Edit</BaseButton>
                  <BaseButton size="sm" variant="ghost" @click="requestAction(finishing, 'toggle')">
                    {{ finishing.is_active ? 'Deactivate' : 'Activate' }}
                  </BaseButton>
                  <BaseButton size="sm" variant="ghost" class="text-[var(--p-error)]" @click="requestAction(finishing, 'delete')">
                    Delete
                  </BaseButton>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-if="showForm" ref="formPanelRef" class="rounded-3xl border border-[var(--p-border)] bg-[var(--p-surface)] p-6 md:p-8">
          <div class="mb-6 flex items-center justify-between">
            <h2 class="text-base font-semibold text-[var(--p-text)]">
              {{ formMode === 'edit' ? 'Edit finishing rate' : 'Add finishing rate' }}
            </h2>
            <button type="button" class="text-[var(--p-text-muted)] hover:text-[var(--p-text)]" @click="closeForm">
              <Icon name="lucide:x" class="size-5" />
            </button>
          </div>

          <form class="space-y-5" novalidate @submit.prevent="submitForm">
            <div
              v-if="formError"
              class="rounded-xl border border-[var(--p-error)]/30 bg-[var(--p-error-soft)] px-4 py-3 text-sm text-[var(--p-error)]"
            >
              {{ formError }}
            </div>

            <div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              <BaseInput
                v-model="form.name"
                label="Finishing name"
                placeholder="e.g. Gloss lamination"
                :error="fieldErrors.name"
                required
              />

              <BaseInput
                v-model="form.slug"
                label="Matching key / slug"
                placeholder="e.g. lamination, corner_rounding"
                hint="Used for calculator matching. Leave blank to auto-generate from the name."
                :error="fieldErrors.slug"
              />

              <BaseSelect
                v-model="form.category"
                label="Category / type"
                :options="categoryOptions"
                :error="fieldErrors.category"
              />

              <BaseSelect
                v-model="form.charge_unit"
                label="Charging unit"
                :options="chargeUnitOptions"
                :error="fieldErrors.charge_unit"
                required
              />

              <BaseSelect
                v-model="form.billing_basis"
                label="Billing basis"
                :options="billingBasisOptions"
                :error="fieldErrors.billing_basis"
                required
              />

              <BaseSelect
                v-model="form.side_mode"
                label="Side handling"
                :options="sideModeOptions"
                :error="fieldErrors.side_mode"
                required
              />

              <BaseInput
                v-model="form.price"
                label="Price / rate (KES)"
                type="number"
                step="0.01"
                placeholder="e.g. 12.00"
                :error="fieldErrors.price"
                required
              />

              <BaseInput
                v-model="form.double_side_price"
                label="Both-side price (optional)"
                type="number"
                step="0.01"
                placeholder="e.g. 20.00"
                :error="fieldErrors.double_side_price"
              />

              <BaseInput
                v-model="form.setup_fee"
                label="Setup fee (optional)"
                type="number"
                step="0.01"
                placeholder="e.g. 100.00"
                :error="fieldErrors.setup_fee"
              />

              <BaseInput
                v-model="form.minimum_charge"
                label="Minimum charge (optional)"
                type="number"
                step="0.01"
                placeholder="e.g. 250.00"
                :error="fieldErrors.minimum_charge"
              />

              <BaseInput
                v-model="form.min_qty"
                label="Minimum quantity (optional)"
                type="number"
                placeholder="e.g. 100"
                :error="fieldErrors.min_qty"
              />

              <BaseInput
                v-model="form.display_unit_label"
                label="Display unit label (optional)"
                placeholder="e.g. per sheet"
                :error="fieldErrors.display_unit_label"
              />
            </div>

            <BaseInput
              v-model="form.applies_to"
              label="Applies to products / jobs"
              placeholder="e.g. business_card, flyer, booklet"
              hint="Optional comma-separated keys. Leave blank to let Printy infer from the matching key."
              :error="fieldErrors.applies_to_product_types"
            />

            <label class="flex flex-col gap-2 text-sm text-[var(--p-text-muted)]">
              <span class="font-medium text-[var(--p-text)]">Notes</span>
              <textarea
                v-model="form.help_text"
                rows="4"
                class="min-h-28 rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface)] px-4 py-3 text-[var(--p-text)] outline-none transition placeholder:text-[var(--p-text-soft)] focus:border-[var(--p-primary)] focus:ring-4 focus:ring-[color:var(--p-primary-soft)]"
                placeholder="Explain how this finishing is priced or when it applies."
              />
              <p v-if="fieldErrors.help_text" class="text-xs font-medium text-[var(--p-error)]">{{ fieldErrors.help_text }}</p>
            </label>

            <label class="flex cursor-pointer items-center gap-3">
              <div
                class="relative h-5 w-9 rounded-full transition-colors"
                :class="form.is_active ? 'bg-[var(--p-primary)]' : 'bg-[var(--p-border)]'"
                @click="form.is_active = !form.is_active"
              >
                <div
                  class="absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform"
                  :class="form.is_active ? 'translate-x-4' : 'translate-x-0.5'"
                />
              </div>
              <span class="text-sm font-medium text-[var(--p-text)]">Available for quoting</span>
            </label>

            <div class="flex items-center gap-3 pt-2">
              <BaseButton type="submit" variant="primary" :loading="submitting">
                {{ formMode === 'edit' ? 'Save changes' : 'Add finishing' }}
              </BaseButton>
              <BaseButton type="button" variant="ghost" :disabled="submitting" @click="closeForm">Cancel</BaseButton>
            </div>
          </form>
        </div>
      </template>
    </div>
  </DashboardShell>
</template>

<script setup lang="ts">
import type { ShopFinishingCategory, ShopFinishingRate, ShopFinishingRatePayload } from '~/composables/useShopFinishings'
import type { CalculatorConfigResponse } from '~/types/api/calculator'
import BaseButton from '~/components/ui/BaseButton.vue'
import BaseInput from '~/components/ui/BaseInput.vue'
import BaseSelect from '~/components/ui/BaseSelect.vue'
import ShopSidebarNav from '~/components/dashboard/shop/ShopSidebarNav.vue'
import DashboardShell from '~/components/dashboard/shared/DashboardShell.vue'
import DashboardTopBar from '~/components/dashboard/shared/DashboardTopBar.vue'
import { useShopStore } from '~/stores/shop'
import { useSetupStatusStore } from '~/stores/setupStatus'
import { useShopFinishings } from '~/composables/useShopFinishings'
import { useNotification } from '~/composables/useNotification'
import { fetchCalculatorConfig } from '~/services/calculator'
import { extractApiFeedback } from '~/utils/api-feedback'
import { parseApiError } from '~/utils/api-error'

definePageMeta({ layout: 'dashboard' })

type BuyerStatus = 'Available' | 'Needs confirmation' | 'Price not listed yet'
type PendingAction = { id: number, action: 'toggle' | 'delete' }
type FieldErrorKey =
  | 'name'
  | 'slug'
  | 'category'
  | 'charge_unit'
  | 'billing_basis'
  | 'side_mode'
  | 'price'
  | 'double_side_price'
  | 'setup_fee'
  | 'minimum_charge'
  | 'min_qty'
  | 'display_unit_label'
  | 'applies_to_product_types'
  | 'help_text'

const shopStore = useShopStore()
const setupStatusStore = useSetupStatusStore()
const notification = useNotification()
const shopSlug = computed(() => shopStore.selectedShopSlug ?? null)
const { list, listCategories, create, update, remove } = useShopFinishings(shopSlug)

const finishings = ref<ShopFinishingRate[]>([])
const categories = ref<ShopFinishingCategory[]>([])
const calculatorConfig = ref<CalculatorConfigResponse | null>(null)
const loading = ref(false)
const loadError = ref('')

const showForm = ref(false)
const formMode = ref<'add' | 'edit'>('add')
const editingFinishing = ref<ShopFinishingRate | null>(null)
const submitting = ref(false)
const formError = ref('')
const actionLoading = ref(false)
const pendingAction = ref<PendingAction | null>(null)
const formPanelRef = ref<HTMLElement | null>(null)

const fieldErrors = reactive<Record<FieldErrorKey, string>>({
  name: '',
  slug: '',
  category: '',
  charge_unit: '',
  billing_basis: '',
  side_mode: '',
  price: '',
  double_side_price: '',
  setup_fee: '',
  minimum_charge: '',
  min_qty: '',
  display_unit_label: '',
  applies_to_product_types: '',
  help_text: '',
})

const defaultForm = () => ({
  name: '',
  slug: '',
  category: '',
  charge_unit: 'PER_PIECE',
  billing_basis: 'per_piece',
  side_mode: 'ignore_sides',
  price: '' as string | number,
  double_side_price: '' as string | number,
  setup_fee: '' as string | number,
  minimum_charge: '' as string | number,
  min_qty: '' as string | number,
  display_unit_label: '',
  applies_to: '',
  help_text: '',
  is_active: true,
})

const form = reactive(defaultForm())

const billingBasisOptions = [
  { value: 'per_sheet', label: 'Per sheet' },
  { value: 'per_piece', label: 'Per piece' },
  { value: 'flat_per_job', label: 'Flat job' },
  { value: 'flat_per_group', label: 'Flat group' },
  { value: 'flat_per_line', label: 'Flat line' },
]

const chargeUnitOptions = [
  { value: 'PER_PIECE', label: 'Per piece' },
  { value: 'PER_SIDE', label: 'Per side' },
  { value: 'PER_SHEET', label: 'Per sheet' },
  { value: 'PER_SQM', label: 'Per square meter' },
  { value: 'FLAT', label: 'Flat amount' },
]

const sideModeOptions = [
  { value: 'ignore_sides', label: 'Ignore sides' },
  { value: 'per_selected_side', label: 'Price one side / both sides differently' },
]

const commonAddonKeys = new Set(['lamination', 'cover_lamination', 'corner_rounding', 'cutting', 'folding', 'binding', 'stitching'])

const categoryOptions = computed(() => [
  { value: '', label: 'No category' },
  ...categories.value.map(category => ({ value: String(category.id), label: category.name })),
])

const activeCount = computed(() => finishings.value.filter(item => item.is_active).length)
const integratedCount = computed(() => finishings.value.filter(item => finishingMeta(item).isIntegrated && item.is_active).length)
const confirmationCount = computed(() => finishings.value.filter(item => finishingMeta(item).buyerStatus === 'Needs confirmation').length)
const commonAddonCount = computed(() => finishings.value.filter(item => finishingMeta(item).isCommonAddon).length)

const calculatorSummary = computed(() => {
  if (!calculatorConfig.value) return 'Calculator configuration could not be loaded, so matching status may be incomplete.'
  if (integratedCount.value === 0) return 'No active finishing rate is currently mapped to a calculator finishing key.'
  if (confirmationCount.value === 0) return 'Your active finishings already map cleanly to the calculator configuration.'
  return `${integratedCount.value} active finishings map to calculator keys. ${confirmationCount.value} still rely on manual confirmation.`
})

function resetFieldErrors() {
  for (const key of Object.keys(fieldErrors) as FieldErrorKey[]) {
    fieldErrors[key] = ''
  }
}

function slugifyValue(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
}

function toOptionalNumber(value: string | number): number | null {
  if (value === '' || value == null) return null
  const parsed = typeof value === 'number' ? value : Number(value)
  return Number.isFinite(parsed) ? parsed : null
}

function normalizeAppliesTo(value: string): string[] | null {
  const rows = value
    .split(',')
    .map(item => slugifyValue(item))
    .filter(Boolean)
  return rows.length ? Array.from(new Set(rows)) : null
}

function validateForm(): boolean {
  resetFieldErrors()
  let valid = true

  if (!form.name.trim()) {
    fieldErrors.name = 'Enter a finishing name.'
    valid = false
  }

  const slug = form.slug.trim() ? slugifyValue(form.slug) : slugifyValue(form.name)
  if (!slug) {
    fieldErrors.slug = 'Enter a usable matching key.'
    valid = false
  }

  if (!form.charge_unit) {
    fieldErrors.charge_unit = 'Select a charging unit.'
    valid = false
  }

  if (!form.billing_basis) {
    fieldErrors.billing_basis = 'Select a billing basis.'
    valid = false
  }

  if (!form.side_mode) {
    fieldErrors.side_mode = 'Select how sides are handled.'
    valid = false
  }

  if (toOptionalNumber(form.price) == null || Number(form.price) <= 0) {
    fieldErrors.price = 'Enter a valid rate.'
    valid = false
  }

  if (form.double_side_price !== '' && (toOptionalNumber(form.double_side_price) == null || Number(form.double_side_price) <= 0)) {
    fieldErrors.double_side_price = 'Enter a valid both-side price or leave blank.'
    valid = false
  }

  if (form.setup_fee !== '' && (toOptionalNumber(form.setup_fee) == null || Number(form.setup_fee) < 0)) {
    fieldErrors.setup_fee = 'Setup fee must be 0 or higher.'
    valid = false
  }

  if (form.minimum_charge !== '' && (toOptionalNumber(form.minimum_charge) == null || Number(form.minimum_charge) < 0)) {
    fieldErrors.minimum_charge = 'Minimum charge must be 0 or higher.'
    valid = false
  }

  if (form.min_qty !== '' && (toOptionalNumber(form.min_qty) == null || Number(form.min_qty) < 0)) {
    fieldErrors.min_qty = 'Minimum quantity must be 0 or higher.'
    valid = false
  }

  return valid
}

function buildPayload(): ShopFinishingRatePayload {
  return {
    name: form.name.trim(),
    slug: form.slug.trim() ? slugifyValue(form.slug) : slugifyValue(form.name),
    category: form.category ? Number(form.category) : null,
    charge_unit: form.charge_unit,
    billing_basis: form.billing_basis,
    side_mode: form.side_mode,
    price: Number(form.price),
    double_side_price: toOptionalNumber(form.double_side_price),
    setup_fee: toOptionalNumber(form.setup_fee),
    minimum_charge: toOptionalNumber(form.minimum_charge),
    min_qty: toOptionalNumber(form.min_qty),
    display_unit_label: form.display_unit_label.trim(),
    applies_to_product_types: normalizeAppliesTo(form.applies_to),
    help_text: form.help_text.trim(),
    is_active: form.is_active,
  }
}

function openAddForm() {
  Object.assign(form, defaultForm())
  editingFinishing.value = null
  formMode.value = 'add'
  formError.value = ''
  resetFieldErrors()
  showForm.value = true
  nextTick(() => formPanelRef.value?.scrollIntoView({ behavior: 'smooth', block: 'start' }))
}

function openEditForm(finishing: ShopFinishingRate) {
  Object.assign(form, {
    name: finishing.name,
    slug: finishing.slug,
    category: finishing.category ? String(finishing.category) : '',
    charge_unit: finishing.charge_unit,
    billing_basis: finishing.billing_basis,
    side_mode: finishing.side_mode,
    price: finishing.price,
    double_side_price: finishing.double_side_price ?? '',
    setup_fee: finishing.setup_fee ?? '',
    minimum_charge: finishing.minimum_charge ?? '',
    min_qty: finishing.min_qty ?? '',
    display_unit_label: finishing.display_unit_label ?? '',
    applies_to: (finishing.applies_to_product_types ?? []).join(', '),
    help_text: finishing.help_text ?? '',
    is_active: finishing.is_active,
  })
  editingFinishing.value = finishing
  formMode.value = 'edit'
  formError.value = ''
  resetFieldErrors()
  showForm.value = true
  nextTick(() => formPanelRef.value?.scrollIntoView({ behavior: 'smooth', block: 'start' }))
}

function closeForm() {
  showForm.value = false
  editingFinishing.value = null
  formMode.value = 'add'
}

function requestAction(finishing: ShopFinishingRate, action: PendingAction['action']) {
  pendingAction.value = { id: finishing.id, action }
}

async function confirmPendingAction(finishing: ShopFinishingRate) {
  actionLoading.value = true
  try {
    if (pendingAction.value?.action === 'delete') {
      await remove(finishing.id)
      finishings.value = finishings.value.filter(item => item.id !== finishing.id)
      await refreshSetupStatus()
      notification.success('Finishing removed.', 'Removed')
    }
    else {
      const updated = await update(finishing.id, { is_active: !finishing.is_active })
      const index = finishings.value.findIndex(item => item.id === updated.id)
      if (index >= 0) finishings.value[index] = updated
      await refreshSetupStatus()
      notification.success(updated.is_active ? 'Finishing activated.' : 'Finishing deactivated.', 'Saved')
    }
  }
  catch (err: unknown) {
    notification.error(parseApiError(err, 'Could not update finishing rate.'), 'Error')
  }
  finally {
    actionLoading.value = false
    pendingAction.value = null
  }
}

function normalizeFinishingKeys(finishing: ShopFinishingRate): string[] {
  const raw = [
    finishing.slug,
    finishing.category_detail?.slug,
    finishing.name,
    ...(finishing.applies_to_product_types ?? []),
  ]
  const normalized = raw
    .flatMap((value) => {
      const slug = slugifyValue(value || '')
      if (!slug) return []
      const aliases = aliasMap[slug] ?? []
      return [slug, ...aliases]
    })
  return Array.from(new Set(normalized))
}

const aliasMap: Record<string, string[]> = {
  gloss_lamination: ['lamination', 'cover_lamination'],
  matte_lamination: ['lamination', 'cover_lamination'],
  matt_lamination: ['lamination', 'cover_lamination'],
  lamination: ['cover_lamination'],
  rounded_corners: ['corner_rounding'],
  rounded_corner: ['corner_rounding'],
  round_corner: ['corner_rounding'],
  corner_rounding: ['rounded_corners'],
  eyelets: ['eyelet'],
  eyelet: ['eyelets'],
  saddle_stitch: ['stitching', 'binding'],
}

function matchedCalculatorKeys(finishing: ShopFinishingRate): string[] {
  const allowed = new Set(
    (calculatorConfig.value?.products ?? [])
      .flatMap(product => product.allowed_finishings ?? [])
      .map(value => slugifyValue(value)),
  )
  return normalizeFinishingKeys(finishing).filter(key => allowed.has(key))
}

function finishingMeta(finishing: ShopFinishingRate) {
  const keys = matchedCalculatorKeys(finishing)
  const priceMissing = !finishing.price || Number(finishing.price) <= 0
  const isIntegrated = keys.length > 0
  const isCommonAddon = normalizeFinishingKeys(finishing).some(key => commonAddonKeys.has(key))
  let buyerStatus: BuyerStatus = 'Needs confirmation'
  if (priceMissing) buyerStatus = 'Price not listed yet'
  else if (finishing.is_active && isIntegrated) buyerStatus = 'Available'
  else if (!finishing.is_active) buyerStatus = 'Needs confirmation'
  return { isIntegrated, matchedKeys: keys, isCommonAddon, buyerStatus }
}

function productLabelsForFinishing(finishing: ShopFinishingRate): string[] {
  const configured = finishing.applies_to_product_types ?? []
  if (configured.length) {
    return configured.map(key => productLabel(key))
  }
  const matchedKeys = new Set(matchedCalculatorKeys(finishing))
  return (calculatorConfig.value?.products ?? [])
    .filter(product => (product.allowed_finishings ?? []).some(key => matchedKeys.has(slugifyValue(key))))
    .map(product => product.label)
}

function productLabel(key: string): string {
  const product = (calculatorConfig.value?.products ?? []).find(item => item.key === key)
  if (product) return product.label
  return key.replace(/_/g, ' ')
}

function billingBasisLabel(value: string): string {
  return billingBasisOptions.find(option => option.value === value)?.label ?? value
}

function chargeUnitLabel(value: string): string {
  return chargeUnitOptions.find(option => option.value === value)?.label ?? value
}

function currency(value: string | number | null | undefined): string {
  if (value == null || value === '') return '0.00'
  const parsed = typeof value === 'number' ? value : Number(value)
  return Number.isFinite(parsed) ? parsed.toFixed(2) : String(value)
}

function rateSummary(finishing: ShopFinishingRate): string {
  const parts: string[] = []
  if (finishing.double_side_price) parts.push(`Both sides: KES ${currency(finishing.double_side_price)}`)
  if (finishing.setup_fee) parts.push(`Setup: KES ${currency(finishing.setup_fee)}`)
  if (finishing.minimum_charge) parts.push(`Minimum: KES ${currency(finishing.minimum_charge)}`)
  if (finishing.min_qty) parts.push(`Min qty: ${finishing.min_qty}`)
  return parts.join(' · ') || 'Base rate only'
}

function appliesToHeadline(finishing: ShopFinishingRate): string {
  const labels = productLabelsForFinishing(finishing)
  if (!labels.length) return 'Needs confirmation'
  if (labels.length === 1) return labels[0] ?? 'Needs confirmation'
  return `${labels[0] ?? 'Needs confirmation'} +${labels.length - 1}`
}

function appliesToDetail(finishing: ShopFinishingRate): string {
  const labels = productLabelsForFinishing(finishing)
  if (!labels.length) return 'No explicit product mapping yet.'
  return labels.join(', ')
}

function integrationMessage(finishing: ShopFinishingRate): string {
  const meta = finishingMeta(finishing)
  if (!calculatorConfig.value) return 'Calculator config unavailable.'
  if (meta.matchedKeys.length) return `Calculator can see: ${meta.matchedKeys.join(', ')}`
  return 'No calculator finishing key matched yet.'
}

function statusTone(status: BuyerStatus) {
  if (status === 'Available') return 'bg-green-500/10 text-green-600'
  if (status === 'Price not listed yet') return 'bg-rose-500/10 text-rose-600'
  return 'bg-amber-500/10 text-amber-700'
}

async function loadFinishingPage() {
  loading.value = true
  loadError.value = ''
  try {
    if (!shopSlug.value) {
      await shopStore.ensureActiveShop()
    }
    const [finishingList, categoryList, config] = await Promise.all([
      list(),
      listCategories(),
      fetchCalculatorConfig().catch(() => null),
    ])
    finishings.value = finishingList.sort((a, b) => a.name.localeCompare(b.name))
    categories.value = categoryList
    calculatorConfig.value = config
  }
  catch (err: unknown) {
    loadError.value = parseApiError(err, 'Failed to load finishing rates.')
  }
  finally {
    loading.value = false
  }
}

async function refreshSetupStatus() {
  if (!shopSlug.value) return
  try {
    await setupStatusStore.fetchStatus(shopSlug.value)
  } catch {
    // Keep the page usable even if setup refresh fails.
  }
}

async function submitForm() {
  if (!validateForm()) return

  submitting.value = true
  formError.value = ''
  resetFieldErrors()

  try {
    const payload = buildPayload()
    if (formMode.value === 'edit' && editingFinishing.value) {
      const updated = await update(editingFinishing.value.id, payload)
      const index = finishings.value.findIndex(item => item.id === updated.id)
      if (index >= 0) finishings.value[index] = updated
      finishings.value.sort((a, b) => a.name.localeCompare(b.name))
      notification.success('Finishing updated.', 'Saved')
    }
    else {
      const created = await create(payload)
      finishings.value.unshift(created)
      finishings.value.sort((a, b) => a.name.localeCompare(b.name))
      notification.success('Finishing added.', 'Added')
    }
    await refreshSetupStatus()
    closeForm()
  }
  catch (err: unknown) {
    const feedback = extractApiFeedback(err, 'Could not save finishing rate.')
    formError.value = feedback.message
    const fieldMap: Record<string, FieldErrorKey> = {
      name: 'name',
      slug: 'slug',
      category: 'category',
      charge_unit: 'charge_unit',
      billing_basis: 'billing_basis',
      side_mode: 'side_mode',
      price: 'price',
      double_side_price: 'double_side_price',
      setup_fee: 'setup_fee',
      minimum_charge: 'minimum_charge',
      min_qty: 'min_qty',
      display_unit_label: 'display_unit_label',
      applies_to_product_types: 'applies_to_product_types',
      help_text: 'help_text',
    }
    for (const [key, value] of Object.entries(feedback.fieldErrors)) {
      const field = fieldMap[key]
      if (field) fieldErrors[field] = value
    }
  }
  finally {
    submitting.value = false
  }
}

onMounted(loadFinishingPage)
watch(shopSlug, () => {
  loadFinishingPage()
})
</script>
