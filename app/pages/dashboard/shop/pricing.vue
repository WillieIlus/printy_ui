<template>
  <DashboardShell sidebar-tone="dark">
    <template #sidebar>
      <ShopSidebarNav />
    </template>

    <div class="space-y-6">
      <DashboardTopBar
        eyebrow="Print shop"
        title="Pricing rules"
        description="Pricing rules help Printy calculate accurate shop-specific prices instead of sending every job as a manual quote."
        action-label="Add pricing rule"
        @action="openAddForm"
      />

      <div class="grid gap-4 xl:grid-cols-[1.8fr_1fr]">
        <div class="rounded-3xl border border-[var(--p-primary)]/15 bg-[var(--p-primary)]/6 px-5 py-5">
          <div class="flex items-start gap-4">
            <div class="mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-2xl bg-[var(--p-primary)]/12 text-[var(--p-primary)]">
              <Icon name="lucide:calculator" class="size-5" />
            </div>
            <div class="space-y-2">
              <p class="text-sm font-semibold text-[var(--p-text)]">Calculator connection</p>
              <p class="text-sm leading-6 text-[var(--p-text-muted)]">
                These rules control print charges by machine, sheet size, and color mode. Paper pricing still comes from
                your <NuxtLink class="font-semibold text-[var(--p-primary)] underline-offset-2 hover:underline" to="/dashboard/shop/materials">papers &amp; materials</NuxtLink>
                setup, and duplex pricing can use either an override or surcharge logic.
              </p>
              <div class="flex flex-wrap gap-2 text-xs">
                <span class="rounded-full bg-white/70 px-3 py-1 font-medium text-[var(--p-text)]">
                  Endpoint: `machines/&lt;id&gt;/printing-rates/`
                </span>
                <span class="rounded-full bg-white/70 px-3 py-1 font-medium text-[var(--p-text)]">
                  Public read: `shops/&lt;slug&gt;/rate-card/`
                </span>
              </div>
            </div>
          </div>
        </div>

        <div class="rounded-3xl border border-[var(--p-border)] bg-[var(--p-surface)] px-5 py-5">
          <div class="flex items-center justify-between gap-3">
            <div>
              <p class="text-sm font-semibold text-[var(--p-text)]">Setup progress</p>
              <p class="mt-1 text-sm text-[var(--p-text-muted)]">
                {{ setupProgressMessage }}
              </p>
            </div>
            <span
              class="rounded-full px-3 py-1 text-xs font-semibold"
              :class="setupStatus?.has_pricing ? 'bg-green-500/10 text-green-600' : 'bg-amber-500/10 text-amber-700'"
            >
              {{ setupStatus?.has_pricing ? 'Pricing ready' : 'Needs pricing' }}
            </span>
          </div>
        </div>
      </div>

      <div class="grid gap-4 md:grid-cols-3">
        <div class="rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface)] px-5 py-4">
          <p class="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--p-text-muted)]">Rules</p>
          <p class="mt-2 text-2xl font-semibold text-[var(--p-text)]">{{ rules.length }}</p>
          <p class="mt-1 text-sm text-[var(--p-text-muted)]">Active pricing combinations across your machines.</p>
        </div>
        <div class="rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface)] px-5 py-4">
          <p class="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--p-text-muted)]">Machines covered</p>
          <p class="mt-2 text-2xl font-semibold text-[var(--p-text)]">{{ coveredMachineCount }}</p>
          <p class="mt-1 text-sm text-[var(--p-text-muted)]">Machines with at least one printing rule.</p>
        </div>
        <div class="rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface)] px-5 py-4">
          <p class="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--p-text-muted)]">Calculator preview</p>
          <p class="mt-2 text-2xl font-semibold text-[var(--p-text)]">{{ calculatorPreviewLabel }}</p>
          <p class="mt-1 text-sm text-[var(--p-text-muted)]">{{ calculatorStatusMessage }}</p>
        </div>
      </div>

      <div
        v-if="loading"
        class="space-y-3"
      >
        <div v-for="i in 4" :key="i" class="h-24 animate-pulse rounded-2xl bg-[var(--p-surface)]" />
      </div>

      <div
        v-else-if="loadError"
        class="rounded-2xl border border-[var(--p-error)]/30 bg-[var(--p-error-soft)] px-5 py-4 text-sm text-[var(--p-error)]"
      >
        <p class="font-semibold">Could not load pricing rules.</p>
        <p class="mt-1">{{ loadError }}</p>
        <BaseButton class="mt-3" size="sm" variant="ghost" @click="loadPricingPage">Retry</BaseButton>
      </div>

      <template v-else>
        <div
          v-if="machines.length === 0 && !showForm"
          class="rounded-3xl border border-dashed border-[var(--p-border)] bg-[var(--p-surface)]/40 px-8 py-14 text-center"
        >
          <div class="mx-auto mb-4 flex size-12 items-center justify-center rounded-2xl bg-[var(--p-primary)]/8 text-[var(--p-primary)]">
            <Icon name="lucide:printer" class="size-6" />
          </div>
          <p class="text-base font-semibold text-[var(--p-text)]">Add a machine before creating pricing rules.</p>
          <p class="mt-2 text-sm text-[var(--p-text-muted)]">
            Pricing rules are machine-based, so Printy needs at least one press or printer first.
          </p>
          <div class="mt-6 flex flex-wrap items-center justify-center gap-3">
            <BaseButton size="sm" variant="primary" to="/dashboard/shop/setup">Open shop setup</BaseButton>
            <BaseButton size="sm" variant="ghost" @click="loadPricingPage">Retry</BaseButton>
          </div>
        </div>

        <div
          v-else-if="rules.length === 0 && !showForm"
          class="rounded-3xl border border-dashed border-[var(--p-border)] bg-[var(--p-surface)]/40 px-8 py-14 text-center"
        >
          <div class="mx-auto mb-4 flex size-12 items-center justify-center rounded-2xl bg-[var(--p-primary)]/8 text-[var(--p-primary)]">
            <Icon name="lucide:printer" class="size-6" />
          </div>
          <p class="text-base font-semibold text-[var(--p-text)]">Add your first pricing rule</p>
          <p class="mt-2 text-sm text-[var(--p-text-muted)]">Start with your most common paper and print side.</p>
          <p class="mx-auto mt-2 max-w-xl text-sm leading-6 text-[var(--p-text-muted)]">
            This pricing endpoint does not store a direct paper/material foreign key, so your paper stock stays on the papers page
            while pricing rules handle machine, side, and color charges.
          </p>
          <BaseButton class="mt-6" size="sm" variant="primary" @click="openAddForm">Add pricing rule</BaseButton>
        </div>

        <div v-else class="space-y-3">
          <div
            v-for="rule in rules"
            :key="rule.id ?? `${rule.machine}-${rule.sheet_size}-${rule.color_mode}`"
            class="rounded-3xl border border-[var(--p-border)] bg-[var(--p-surface)] px-5 py-5"
            :class="editingRule?.id === rule.id ? 'border-[var(--p-primary)]/40 bg-[var(--p-primary)]/[0.04]' : ''"
          >
            <div v-if="pendingAction?.id === rule.id" class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p class="text-sm font-semibold text-[var(--p-text)]">
                  {{ pendingAction?.action === 'delete' ? 'Delete this pricing rule?' : `${rule.is_active ? 'Deactivate' : 'Activate'} this pricing rule?` }}
                </p>
                <p class="mt-1 text-sm text-[var(--p-text-muted)]">
                  {{ pendingAction?.action === 'delete'
                    ? 'Deleting removes this rule entirely from the calculator.'
                    : (rule.is_active
                      ? 'Deactivated rules stop participating in calculator pricing.'
                      : 'Reactivating will make this rule available to calculator pricing again.') }}
                </p>
              </div>
              <div class="flex items-center gap-2">
                <BaseButton size="sm" variant="ghost" :disabled="actionLoading" @click="pendingAction = null">Cancel</BaseButton>
                <BaseButton
                  size="sm"
                  variant="primary"
                  :loading="actionLoading"
                  :class="pendingAction?.action === 'delete' ? 'bg-[var(--p-error)]!' : ''"
                  @click="confirmPendingAction(rule)"
                >
                  {{ pendingAction?.action === 'delete' ? 'Yes, delete' : (rule.is_active ? 'Yes, deactivate' : 'Yes, activate') }}
                </BaseButton>
              </div>
            </div>

            <div v-else class="space-y-4">
              <div class="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div class="space-y-3">
                  <div class="flex flex-wrap items-center gap-2">
                    <span class="text-base font-semibold text-[var(--p-text)]">
                      {{ machineName(rule.machine) }}
                    </span>
                    <span class="rounded-full bg-[var(--p-primary)]/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[var(--p-primary)]">
                      {{ rule.sheet_size }}
                    </span>
                    <span class="rounded-full bg-[var(--p-surface-muted)] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[var(--p-text-muted)]">
                      {{ colorModeLabel(rule.color_mode) }}
                    </span>
                    <span
                      class="rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider"
                      :class="rule.is_active ? 'bg-green-500/10 text-green-600' : 'bg-[var(--p-border)] text-[var(--p-text-muted)]'"
                    >
                      {{ rule.is_active ? 'Active' : 'Inactive' }}
                    </span>
                    <span
                      v-if="rule.is_default"
                      class="rounded-full bg-sky-500/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-sky-600"
                    >
                      Default
                    </span>
                  </div>

                  <div class="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                    <div class="rounded-2xl bg-[var(--p-surface-muted)]/70 px-4 py-3">
                      <p class="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--p-text-muted)]">Print side</p>
                      <p class="mt-1 text-sm font-semibold text-[var(--p-text)]">Front / simplex</p>
                      <p class="mt-1 text-sm text-[var(--p-text-muted)]">
                        KES {{ currency(rule.selling_price_per_side) }} per side
                      </p>
                    </div>
                    <div class="rounded-2xl bg-[var(--p-surface-muted)]/70 px-4 py-3">
                      <p class="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--p-text-muted)]">Duplex / back print</p>
                      <p class="mt-1 text-sm font-semibold text-[var(--p-text)]">
                        {{ rule.selling_price_duplex_per_sheet ? `KES ${currency(rule.selling_price_duplex_per_sheet)} per sheet` : 'Auto from per-side price' }}
                      </p>
                      <p class="mt-1 text-sm text-[var(--p-text-muted)]">
                        {{ duplexSummary(rule) }}
                      </p>
                    </div>
                    <div class="rounded-2xl bg-[var(--p-surface-muted)]/70 px-4 py-3">
                      <p class="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--p-text-muted)]">Paper / minimums</p>
                      <p class="mt-1 text-sm font-semibold text-[var(--p-text)]">Configured elsewhere</p>
                      <p class="mt-1 text-sm text-[var(--p-text-muted)]">
                        Paper/material FK and minimum charge/quantity are not on this printing-rate endpoint.
                      </p>
                    </div>
                  </div>
                </div>

                <div class="flex shrink-0 flex-wrap items-center gap-2">
                  <BaseButton size="sm" variant="secondary" @click="openEditForm(rule)">Edit</BaseButton>
                  <BaseButton
                    size="sm"
                    variant="ghost"
                    :disabled="rule.id == null"
                    @click="requestAction(rule, 'toggle')"
                  >
                    {{ rule.is_active ? 'Deactivate' : 'Activate' }}
                  </BaseButton>
                  <BaseButton
                    size="sm"
                    variant="ghost"
                    class="text-[var(--p-error)]"
                    :disabled="rule.id == null"
                    @click="requestAction(rule, 'delete')"
                  >
                    Delete
                  </BaseButton>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          v-if="showForm"
          ref="formPanelRef"
          class="rounded-3xl border border-[var(--p-border)] bg-[var(--p-surface)] p-6 md:p-8"
        >
          <div class="mb-6 flex items-center justify-between gap-3">
            <div>
              <h2 class="text-base font-semibold text-[var(--p-text)]">
                {{ formMode === 'edit' ? 'Edit pricing rule' : 'Add pricing rule' }}
              </h2>
              <p class="mt-1 text-sm text-[var(--p-text-muted)]">
                This maps to the backend printing-rate serializer. Unsupported fields stay clearly documented below.
              </p>
            </div>
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

            <div class="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              <BaseSelect
                v-model="form.machine"
                label="Machine"
                :options="machineOptions"
                :error="fieldErrors.machine"
                required
              />
              <BaseSelect
                v-model="form.sheet_size"
                label="Sheet size"
                :options="sheetSizeOptions"
                :error="fieldErrors.sheet_size"
                required
              />
              <BaseSelect
                v-model="form.color_mode"
                label="Color mode"
                :options="colorModeOptions"
                :error="fieldErrors.color_mode"
                required
              />
              <BaseInput
                v-model="form.selling_price_per_side"
                label="Price per sheet side (KES)"
                type="number"
                placeholder="e.g. 15"
                :error="fieldErrors.selling_price_per_side"
                required
              />
              <BaseInput
                v-model="form.selling_price_duplex_per_sheet"
                label="Duplex / both-sides price (optional)"
                type="number"
                placeholder="Leave blank to auto-calculate"
              />
              <BaseInput
                v-model="form.duplex_surcharge"
                label="Duplex surcharge (KES)"
                type="number"
                placeholder="e.g. 5"
                :error="fieldErrors.duplex_surcharge"
              />
              <BaseInput
                v-model="form.duplex_surcharge_min_gsm"
                label="Duplex surcharge min GSM (optional)"
                type="number"
                placeholder="e.g. 130"
                :error="fieldErrors.duplex_surcharge_min_gsm"
              />
            </div>

            <div class="grid gap-3 lg:grid-cols-2">
              <label class="flex cursor-pointer items-start gap-3 rounded-2xl border border-[var(--p-border)] px-4 py-3">
                <input v-model="form.duplex_surcharge_enabled" type="checkbox" class="mt-1 size-4" />
                <span>
                  <span class="block text-sm font-medium text-[var(--p-text)]">Enable duplex surcharge rule</span>
                  <span class="mt-1 block text-sm text-[var(--p-text-muted)]">
                    Uses `duplex_surcharge` and optional GSM threshold when both sides are printed.
                  </span>
                </span>
              </label>
              <label class="flex cursor-pointer items-start gap-3 rounded-2xl border border-[var(--p-border)] px-4 py-3">
                <input v-model="form.is_default" type="checkbox" class="mt-1 size-4" />
                <span>
                  <span class="block text-sm font-medium text-[var(--p-text)]">Make default machine rule</span>
                  <span class="mt-1 block text-sm text-[var(--p-text-muted)]">
                    Backend keeps one default rule per machine and uses it as a fallback when no exact rate is found.
                  </span>
                </span>
              </label>
              <label class="flex cursor-pointer items-start gap-3 rounded-2xl border border-[var(--p-border)] px-4 py-3 lg:col-span-2">
                <input v-model="form.is_active" type="checkbox" class="mt-1 size-4" />
                <span>
                  <span class="block text-sm font-medium text-[var(--p-text)]">Rule is active</span>
                  <span class="mt-1 block text-sm text-[var(--p-text-muted)]">
                    Inactive rules stay saved but are excluded from pricing resolution.
                  </span>
                </span>
              </label>
            </div>

            <div class="rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface-muted)]/60 px-4 py-4">
              <p class="text-sm font-semibold text-[var(--p-text)]">Unsupported backend fields on this endpoint</p>
              <p class="mt-2 text-sm leading-6 text-[var(--p-text-muted)]">
                Direct paper/material selection, front-vs-back side rules, quantity tiers, and minimum charges are not stored on
                `machines/&lt;id&gt;/printing-rates/`. Paper pricing lives on the papers page, and volume discounts live on
                `shops/&lt;slug&gt;/pricing/discounts/`.
              </p>
            </div>

            <div class="flex items-center gap-3 pt-2">
              <BaseButton type="submit" variant="primary" :loading="submitting">
                {{ formMode === 'edit' ? 'Save changes' : 'Add pricing rule' }}
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
import { storeToRefs } from 'pinia'
import BaseButton from '~/components/ui/BaseButton.vue'
import BaseInput from '~/components/ui/BaseInput.vue'
import BaseSelect from '~/components/ui/BaseSelect.vue'
import ShopSidebarNav from '~/components/dashboard/shop/ShopSidebarNav.vue'
import DashboardShell from '~/components/dashboard/shared/DashboardShell.vue'
import DashboardTopBar from '~/components/dashboard/shared/DashboardTopBar.vue'
import { useNotification } from '~/composables/useNotification'
import { useSetupStatusStore } from '~/stores/setupStatus'
import { usePricingStore } from '~/stores/pricing'
import { useShopStore } from '~/stores/shop'
import { API } from '~/shared/api-paths'
import { parseApiError } from '~/utils/api-error'
import type { PrintingPrice } from '~/shared/types'

definePageMeta({
  layout: 'dashboard',
})

type MachineOption = {
  id: number
  name: string
  machine_type?: string
  is_active?: boolean
}

type RateCardPreview = {
  printing_prices?: unknown[]
}

type RuleAction = 'toggle' | 'delete'

type RuleForm = {
  machine: string
  sheet_size: string
  color_mode: string
  selling_price_per_side: string
  selling_price_duplex_per_sheet: string
  duplex_surcharge: string
  duplex_surcharge_enabled: boolean
  duplex_surcharge_min_gsm: string
  is_active: boolean
  is_default: boolean
}

const notification = useNotification()
const shopStore = useShopStore()
const pricingStore = usePricingStore()
const setupStatusStore = useSetupStatusStore()
const { printingPrices } = storeToRefs(pricingStore)
const { status: setupStatus } = storeToRefs(setupStatusStore)

const shopSlug = computed(() => shopStore.selectedShopSlug ?? null)

const loading = ref(false)
const loadError = ref('')
const submitting = ref(false)
const formError = ref('')
const actionLoading = ref(false)
const showForm = ref(false)
const formMode = ref<'add' | 'edit'>('add')
const editingRule = ref<PrintingPrice | null>(null)
const formPanelRef = ref<HTMLElement | null>(null)

const machines = ref<MachineOption[]>([])
const publicRateCard = ref<RateCardPreview | null>(null)
const calculatorError = ref('')
const pendingAction = ref<{ id: number; action: RuleAction } | null>(null)

const fieldErrors = reactive({
  machine: '',
  sheet_size: '',
  color_mode: '',
  selling_price_per_side: '',
  duplex_surcharge: '',
  duplex_surcharge_min_gsm: '',
})

const sheetSizeOptions = [
  { value: 'A4', label: 'A4' },
  { value: 'A3', label: 'A3' },
  { value: 'SRA3', label: 'SRA3' },
  { value: 'A2', label: 'A2' },
  { value: 'A1', label: 'A1' },
  { value: 'A0', label: 'A0' },
  { value: 'B5', label: 'B5' },
  { value: 'B4', label: 'B4' },
  { value: 'CUSTOM', label: 'Custom' },
]

const colorModeOptions = [
  { value: 'BW', label: 'Black & white' },
  { value: 'COLOR', label: 'Color' },
]

const machineOptions = computed(() => machines.value.map((machine) => ({
  value: String(machine.id),
  label: machine.machine_type ? `${machine.name} (${machine.machine_type})` : machine.name,
})))

const rules = computed(() => {
  return [...printingPrices.value]
    .sort((a, b) => {
      const machineCompare = machineName(a.machine).localeCompare(machineName(b.machine))
      if (machineCompare !== 0) return machineCompare
      return `${a.sheet_size}-${a.color_mode}`.localeCompare(`${b.sheet_size}-${b.color_mode}`)
    })
})

const coveredMachineCount = computed(() => {
  return new Set(rules.value.map(rule => rule.machine).filter(Boolean)).size
})

const calculatorPreviewLabel = computed(() => {
  if (calculatorError.value) return 'Unavailable'
  return (publicRateCard.value?.printing_prices?.length ?? 0) > 0 ? 'Connected' : 'Pending'
})

const calculatorStatusMessage = computed(() => {
  if (calculatorError.value) return calculatorError.value
  if ((publicRateCard.value?.printing_prices?.length ?? 0) > 0) {
    return 'The public rate-card endpoint is returning printing prices for calculator consumers.'
  }
  return 'No printing prices are visible on the public rate-card yet.'
})

const setupProgressMessage = computed(() => {
  if (!setupStatus.value) return 'Refresh after saving to update shop setup completeness.'
  return setupStatus.value.blocking_reason || 'Pricing setup is complete for this shop.'
})

function defaultForm(): RuleForm {
  return {
    machine: machineOptions.value[0]?.value ?? '',
    sheet_size: 'A4',
    color_mode: 'BW',
    selling_price_per_side: '',
    selling_price_duplex_per_sheet: '',
    duplex_surcharge: '0',
    duplex_surcharge_enabled: false,
    duplex_surcharge_min_gsm: '',
    is_active: true,
    is_default: false,
  }
}

const form = reactive<RuleForm>(defaultForm())

function colorModeLabel(colorMode?: string | null) {
  return colorMode === 'COLOR' ? 'Color' : 'B/W'
}

function machineName(machineId?: number | null) {
  if (machineId == null) return 'Unknown machine'
  return machines.value.find(machine => machine.id === machineId)?.name ?? `Machine #${machineId}`
}

function currency(value?: string | number | null) {
  if (value == null || value === '') return '0.00'
  const numeric = typeof value === 'number' ? value : Number(value)
  if (!Number.isFinite(numeric)) return String(value)
  return numeric.toFixed(2)
}

function duplexSummary(rule: PrintingPrice) {
  if (rule.duplex_surcharge_enabled) {
    const threshold = rule.duplex_surcharge_min_gsm ? ` from ${rule.duplex_surcharge_min_gsm}gsm` : ''
    return `Adds KES ${currency(rule.duplex_surcharge)}${threshold}.`
  }
  return `Surcharge ${Number(rule.duplex_surcharge ?? 0) > 0 ? 'saved but disabled' : 'not configured'}.`
}

function resetFieldErrors() {
  fieldErrors.machine = ''
  fieldErrors.sheet_size = ''
  fieldErrors.color_mode = ''
  fieldErrors.selling_price_per_side = ''
  fieldErrors.duplex_surcharge = ''
  fieldErrors.duplex_surcharge_min_gsm = ''
}

function resetForm() {
  Object.assign(form, defaultForm())
  formError.value = ''
  editingRule.value = null
  formMode.value = 'add'
  resetFieldErrors()
}

function openAddForm() {
  if (machines.value.length === 0) {
    notification.error('Add a machine before creating pricing rules.', 'Machine required')
    return
  }
  resetForm()
  showForm.value = true
  nextTick(() => formPanelRef.value?.scrollIntoView({ behavior: 'smooth', block: 'start' }))
}

function openEditForm(rule: PrintingPrice) {
  Object.assign(form, {
    machine: rule.machine != null ? String(rule.machine) : '',
    sheet_size: rule.sheet_size ?? 'A4',
    color_mode: rule.color_mode ?? 'BW',
    selling_price_per_side: String(rule.selling_price_per_side ?? ''),
    selling_price_duplex_per_sheet: String(rule.selling_price_duplex_per_sheet ?? ''),
    duplex_surcharge: String(rule.duplex_surcharge ?? '0'),
    duplex_surcharge_enabled: Boolean(rule.duplex_surcharge_enabled),
    duplex_surcharge_min_gsm: rule.duplex_surcharge_min_gsm != null ? String(rule.duplex_surcharge_min_gsm) : '',
    is_active: Boolean(rule.is_active),
    is_default: Boolean(rule.is_default),
  })
  editingRule.value = rule
  formMode.value = 'edit'
  formError.value = ''
  resetFieldErrors()
  showForm.value = true
  nextTick(() => formPanelRef.value?.scrollIntoView({ behavior: 'smooth', block: 'start' }))
}

function requestAction(rule: PrintingPrice, action: RuleAction) {
  if (rule.id == null) return
  pendingAction.value = { id: rule.id, action }
}

function closeForm() {
  showForm.value = false
  resetForm()
}

function validateForm() {
  resetFieldErrors()
  let valid = true

  if (!form.machine) {
    fieldErrors.machine = 'Select a machine.'
    valid = false
  }
  if (!form.sheet_size) {
    fieldErrors.sheet_size = 'Select a sheet size.'
    valid = false
  }
  if (!form.color_mode) {
    fieldErrors.color_mode = 'Select a color mode.'
    valid = false
  }
  if (!form.selling_price_per_side || Number(form.selling_price_per_side) <= 0) {
    fieldErrors.selling_price_per_side = 'Enter a valid per-side print price.'
    valid = false
  }
  if (form.duplex_surcharge !== '' && Number(form.duplex_surcharge) < 0) {
    fieldErrors.duplex_surcharge = 'Duplex surcharge cannot be negative.'
    valid = false
  }
  if (form.duplex_surcharge_min_gsm !== '' && Number(form.duplex_surcharge_min_gsm) <= 0) {
    fieldErrors.duplex_surcharge_min_gsm = 'Minimum GSM must be greater than zero.'
    valid = false
  }
  if (form.selling_price_duplex_per_sheet !== '' && Number(form.selling_price_duplex_per_sheet) <= 0) {
    formError.value = 'Duplex override must be greater than zero when provided.'
    valid = false
  }

  return valid
}

function buildPayload() {
  return {
    machine: Number(form.machine),
    sheet_size: form.sheet_size,
    color_mode: form.color_mode,
    selling_price_per_side: form.selling_price_per_side,
    selling_price_duplex_per_sheet: form.selling_price_duplex_per_sheet || null,
    duplex_surcharge: form.duplex_surcharge || '0',
    duplex_surcharge_enabled: form.duplex_surcharge_enabled,
    duplex_surcharge_min_gsm: form.duplex_surcharge_min_gsm ? Number(form.duplex_surcharge_min_gsm) : null,
    is_active: form.is_active,
    is_default: form.is_default,
  }
}

async function fetchMachines(slug: string) {
  const { $api } = useNuxtApp()
  const response = await $api<MachineOption[] | { results?: MachineOption[] }>(API.shopMachines(slug))
  const list = Array.isArray(response) ? response : response?.results ?? []
  machines.value = list
}

async function refreshCalculatorConnection(slug: string) {
  calculatorError.value = ''
  try {
    const { $publicApi } = useNuxtApp()
    publicRateCard.value = await $publicApi<RateCardPreview>(API.shopRateCard(slug))
  } catch (err: unknown) {
    publicRateCard.value = null
    calculatorError.value = parseApiError(err, 'Could not verify public rate-card pricing.')
  }
}

async function refreshSetupProgress(slug: string) {
  try {
    await setupStatusStore.fetchStatus(slug)
  } catch {
    // Keep the page usable even if setup progress refresh fails.
  }
}

async function loadRequiredPricingData(slug: string) {
  await fetchMachines(slug)
  await Promise.all([
    refreshSetupProgress(slug),
    machines.value.length > 0 ? pricingStore.fetchPrintingPrices(slug) : Promise.resolve(),
  ])
}

async function loadPricingPage() {
  const activeShop = await shopStore.ensureActiveShop(shopSlug.value)
  const slug = activeShop?.slug ?? shopSlug.value
  if (!slug) {
    loadError.value = 'Select a shop before configuring pricing.'
    return
  }

  loading.value = true
  loadError.value = ''

  try {
    await loadRequiredPricingData(slug)
    await refreshCalculatorConnection(slug)
    if (!showForm.value && !editingRule.value) {
      Object.assign(form, defaultForm())
    }
  } catch (err: unknown) {
    loadError.value = parseApiError(err, 'Failed to load pricing rules.')
  } finally {
    loading.value = false
  }
}

async function postSaveRefresh(slug: string) {
  await Promise.all([
    loadRequiredPricingData(slug),
    refreshCalculatorConnection(slug),
  ])
}

async function submitForm() {
  formError.value = ''
  if (!validateForm()) return

  const slug = shopSlug.value
  if (!slug) {
    formError.value = 'No active shop selected.'
    return
  }

  submitting.value = true
  try {
    const payload = buildPayload()
    if (formMode.value === 'edit' && editingRule.value?.id) {
      await pricingStore.updatePrintingPrice(slug, editingRule.value.id, payload)
      notification.success('Pricing rule updated.', 'Saved')
    } else {
      await pricingStore.createPrintingPrice(slug, payload)
      notification.success('Pricing rule created.', 'Added')
    }
    await postSaveRefresh(slug)
    closeForm()
  } catch (err: unknown) {
    formError.value = parseApiError(err, 'Could not save pricing rule.')
  } finally {
    submitting.value = false
  }
}

async function confirmPendingAction(rule: PrintingPrice) {
  const slug = shopSlug.value
  if (!slug || !rule.id || !pendingAction.value) return

  actionLoading.value = true
  try {
    if (pendingAction.value.action === 'delete') {
      await pricingStore.deletePrintingPrice(slug, rule.id)
      notification.success('Pricing rule deleted.', 'Removed')
    } else {
      await pricingStore.updatePrintingPrice(slug, rule.id, { is_active: !rule.is_active })
      notification.success(rule.is_active ? 'Pricing rule deactivated.' : 'Pricing rule activated.', 'Saved')
    }
    await postSaveRefresh(slug)
    pendingAction.value = null
  } catch (err: unknown) {
    notification.error(parseApiError(err, 'Could not update the pricing rule.'), 'Pricing update failed')
  } finally {
    actionLoading.value = false
  }
}

onMounted(loadPricingPage)
watch(shopSlug, () => {
  pendingAction.value = null
  closeForm()
  loadPricingPage()
})
</script>
