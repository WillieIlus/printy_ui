<template>
  <div class="min-h-screen bg-[#f7f8fa] font-[Montserrat] text-[#101828]">
    <nav class="sticky top-0 z-40 border-b border-gray-200 bg-white/95 backdrop-blur">
      <div class="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <NuxtLink to="/" class="flex items-center gap-3 transition-opacity hover:opacity-90">
          <div class="flex h-8 w-8 items-center justify-center overflow-hidden rounded-lg bg-[#e13515]">
            <img src="/assets/logo-mark/light/printy-logo-mark-01.svg" alt="" class="h-full w-full object-cover">
          </div>
          <img src="/assets/word-mark/dark/printy-word-mark-03.svg" alt="Printy" class="h-4 w-auto">
          <span class="hidden rounded-full border border-[#e13515]/20 bg-[#fff1ee] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.22em] text-[#e13515] sm:inline-flex">
            For Shop Owners
          </span>
        </NuxtLink>

        <div class="flex items-center gap-3">
          <NuxtLink to="/auth/login" class="text-sm font-medium text-gray-500 transition-colors hover:text-gray-900">
            Login
          </NuxtLink>
          <NuxtLink
            :to="{ path: '/auth/signup', query: { role: 'shop_owner', redirect: '/for-shops' } }"
            class="rounded-full bg-[#e13515] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#c42e11]"
          >
            Claim Spot
          </NuxtLink>
        </div>
      </div>
    </nav>

    <main class="mx-auto max-w-6xl px-4 py-10 md:py-14">
      <section class="mb-8 max-w-3xl">
        <p class="text-[11px] font-bold uppercase tracking-[0.3em] text-[#e13515]">Printy rate setup</p>
        <h1 class="mt-3 text-3xl font-black tracking-tight md:text-5xl">
          Configure your shop rates from a real business card job.
        </h1>
        <p class="mt-4 text-base leading-7 text-gray-600">
          Adjust paper, printing, lamination, and cutting. Printy shows the production cost live.
        </p>
      </section>

      <section class="rounded-[2rem] border border-[#162033] bg-[linear-gradient(135deg,#0f1728_0%,#172033_56%,#1d2a43_100%)] p-5 text-white shadow-[0_28px_80px_-48px_rgba(15,23,42,0.85)] md:p-6">
        <div
          v-if="configLoading"
          class="flex h-40 items-center justify-center rounded-[1.6rem] border border-white/10 bg-white/5 p-6 text-sm text-slate-300"
        >
          <div class="flex items-center gap-2">
            <Icon name="lucide:loader-2" class="size-4 animate-spin" />
            <span>Loading calculator options...</span>
          </div>
        </div>

        <div
          v-else-if="configError"
          class="rounded-[1.6rem] border border-red-400/40 bg-red-500/10 px-4 py-4 text-sm text-red-100"
        >
          {{ configError }}
        </div>

        <div
          v-else-if="!publicConfig"
          class="rounded-[1.6rem] border border-amber-400/30 bg-amber-500/10 px-4 py-4 text-sm text-amber-100"
        >
          Business Cards onboarding is not available right now.
        </div>

        <div v-else class="space-y-6">
          <div class="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p class="text-[10px] font-bold uppercase tracking-[0.3em] text-[#ff8b74]">Step 1 of 3</p>
              <h2 class="mt-2 text-2xl font-black text-white md:text-[2rem]">{{ publicConfig.preset.title }}</h2>
              <p class="mt-2 max-w-2xl text-sm leading-6 text-slate-300">
                Start with one standard business card job and tune your rates against live market data from existing shops.
              </p>
            </div>
            <div class="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-300">
              <p class="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">Preset</p>
              <p class="mt-2 font-semibold text-white">300gsm Art Card - SRA3 - Full color - Duplex - Matte lamination - Cutting</p>
            </div>
          </div>

          <div class="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
            <div class="space-y-5 rounded-[1.6rem] border border-white/10 bg-white/5 p-5">
              <div class="grid gap-4 md:grid-cols-[220px_minmax(0,1fr)] md:items-end">
                <div>
                  <label class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Pieces requested</label>
                  <div class="mt-2 flex gap-2">
                    <button
                      v-for="option in quantityOptions"
                      :key="option"
                      type="button"
                      class="rounded-full px-4 py-2 text-sm font-semibold transition"
                      :class="quantity === option ? 'bg-[#e13515] text-white' : 'border border-white/10 bg-[#0c1422] text-slate-300 hover:border-white/30 hover:text-white'"
                      @click="quantity = option"
                    >
                      {{ option }} pcs
                    </button>
                  </div>
                </div>

                <div class="grid gap-3 sm:grid-cols-3">
                  <div class="rounded-2xl border border-white/10 bg-[#0c1422] px-4 py-3 text-sm text-slate-300">
                    <p class="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">Cards / SRA3</p>
                    <p class="mt-2 text-lg font-bold text-white">{{ publicConfig.imposition.items_per_sheet ?? '-' }}</p>
                  </div>
                  <div class="rounded-2xl border border-white/10 bg-[#0c1422] px-4 py-3 text-sm text-slate-300">
                    <p class="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">Press sheet</p>
                    <p class="mt-2 text-lg font-bold text-white">{{ publicConfig.imposition.press_sheet }}</p>
                  </div>
                  <div class="rounded-2xl border border-white/10 bg-[#0c1422] px-4 py-3 text-sm text-slate-300">
                    <p class="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">Sheets needed</p>
                    <p class="mt-2 text-lg font-bold text-white">{{ preview?.imposition?.sheets_needed ?? '-' }}</p>
                  </div>
                </div>
              </div>

              <div class="space-y-4">
                <div
                  v-for="field in publicConfig.fields"
                  :key="field.key"
                  class="rounded-2xl border border-white/10 bg-[#0c1422] p-4"
                >
                  <p class="text-sm font-semibold text-white">{{ field.label }}</p>
                  <p class="mt-1 text-sm text-slate-300">{{ field.unit }}</p>

                  <div class="mt-4 flex items-center gap-2">
                    <span class="text-sm font-semibold text-slate-300">KES</span>
                    <input
                      v-model="fieldValues[field.key]"
                      type="number"
                      min="0"
                      step="0.01"
                      class="w-full rounded-xl border border-white/10 bg-[#07111d] px-3 py-2 text-sm font-semibold text-white outline-none transition focus:border-[#e13515]"
                    >
                  </div>

                  <p class="mt-3 text-xs text-slate-400">{{ marketGuide(field) }}</p>
                  <p v-if="fieldError(field.key)" class="mt-2 text-xs text-red-300">{{ fieldError(field.key) }}</p>
                </div>
              </div>

              <div
                v-if="authStatusMessage"
                class="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200"
              >
                {{ authStatusMessage }}
              </div>

              <div v-if="saveMessage" class="rounded-2xl border border-green-400/30 bg-green-500/10 px-4 py-3 text-sm text-green-200">
                {{ saveMessage }}
              </div>

              <div v-if="saveError" class="rounded-2xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                {{ saveError }}
              </div>

              <div class="flex flex-wrap gap-3">
                <button
                  type="button"
                  class="rounded-full bg-[#e13515] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#c42e11] disabled:cursor-not-allowed disabled:opacity-60"
                  :disabled="saveLoading || hasFieldErrors"
                  @click="handleSaveClick"
                >
                  {{ saveLoading ? 'Saving...' : 'Save my shop rates' }}
                </button>
                <button
                  type="button"
                  class="rounded-full border border-white/20 px-5 py-3 text-sm font-semibold text-white transition hover:border-white/40 disabled:cursor-not-allowed disabled:opacity-60"
                  :disabled="saveLoading || hasFieldErrors"
                  @click="handleClaimClick"
                >
                  Claim my shop spot
                </button>
              </div>
            </div>

            <div class="space-y-4 rounded-[1.6rem] border border-white/10 bg-[#0c1422] p-5">
              <div class="flex items-center justify-between gap-3">
                <div>
                  <p class="text-[10px] font-bold uppercase tracking-[0.3em] text-[#ff8b74]">Live backend preview</p>
                  <h3 class="mt-2 text-lg font-bold text-white">Production readout</h3>
                </div>
                <button
                  type="button"
                  class="rounded-full border border-white/10 px-3 py-1.5 text-xs font-semibold text-slate-300 transition hover:border-white/30 hover:text-white disabled:opacity-50"
                  :disabled="previewLoading"
                  @click="fetchPreview"
                >
                  {{ previewLoading ? 'Refreshing...' : 'Refresh' }}
                </button>
              </div>

              <div
                v-if="previewLoading && !preview"
                class="flex min-h-[180px] items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-sm text-slate-300"
              >
                <div class="flex items-center gap-2">
                  <Icon name="lucide:loader-2" class="size-4 animate-spin" />
                  <span>Loading live preview...</span>
                </div>
              </div>

              <div v-else-if="previewError" class="rounded-2xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                {{ previewError }}
              </div>

              <div v-else-if="preview" class="space-y-4">
                <div class="grid gap-3 sm:grid-cols-2">
                  <div class="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <p class="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">Production cost</p>
                    <p class="mt-2 text-2xl font-black text-white">{{ formatKes(preview.production_cost) }}</p>
                  </div>
                  <div class="rounded-2xl border border-[#e13515]/30 bg-[#e13515]/10 p-4">
                    <p class="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#ffb3a4]">Suggested selling price</p>
                    <p class="mt-2 text-2xl font-black text-white">{{ formatKes(preview.suggested_selling_price) }}</p>
                  </div>
                </div>

                <div class="grid gap-3 sm:grid-cols-3">
                  <div class="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <p class="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">Pieces / SRA3 sheet</p>
                    <p class="mt-2 text-xl font-bold text-white">{{ preview.imposition?.items_per_sheet ?? '-' }}</p>
                  </div>
                  <div class="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <p class="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">SRA3 sheets needed</p>
                    <p class="mt-2 text-xl font-bold text-white">{{ preview.imposition?.sheets_needed ?? '-' }}</p>
                  </div>
                  <div class="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <p class="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">Press sheet</p>
                    <p class="mt-2 text-xl font-bold text-white">{{ preview.imposition?.press_sheet ?? '-' }}</p>
                  </div>
                </div>

                <div class="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p class="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">Breakdown</p>
                  <div class="mt-3 space-y-3">
                    <div
                      v-for="item in preview.breakdown"
                      :key="item.key"
                      class="flex items-start justify-between gap-3 border-b border-white/10 pb-3 last:border-b-0 last:pb-0"
                    >
                      <div>
                        <p class="text-sm font-semibold text-white">{{ item.label }}</p>
                        <p class="mt-1 text-xs text-slate-400">
                          {{ formatKes(item.rate) }} x {{ item.quantity ?? '-' }}
                        </p>
                      </div>
                      <p class="text-sm font-bold text-white">{{ formatKes(item.total) }}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div v-else class="rounded-2xl border border-white/10 bg-white/5 px-4 py-5 text-sm text-slate-400">
                Edit a rate to load the live backend breakdown.
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import { API } from '~/shared/api-paths'
import { useApi, usePublicApiNoAuth } from '~/shared/api'
import { useAuthStore } from '~/stores/auth'
import { useShopStore } from '~/stores/shop'
import { parseApiError } from '~/utils/api-error'

definePageMeta({ layout: false })

useSeoMeta({
  title: 'For Print Shop Owners - Printy',
  description: 'Configure your first Printy shop rates using a live business card calculator.',
  ogTitle: 'For Print Shop Owners - Printy',
  ogDescription: 'Configure your first Printy shop rates using a live business card calculator.',
})

type PublicField = {
  key: string
  label: string
  unit: string
  value: string | null
  market?: {
    min: string | null
    max: string | null
    median: string | null
    mean: string | null
  }
}

type PublicConfig = {
  preset: {
    key: string
    title: string
    quantity_default: number
    quantity_options: number[]
  }
  imposition: {
    press_sheet: string
    items_per_sheet: number | null
  }
  fields: PublicField[]
}

type PreviewLineItem = {
  key: string
  label: string
  rate: string | null
  quantity: number | string | null
  total: string | null
}

type PublicPreview = {
  preset_key: string
  quantity: number
  imposition: {
    press_sheet: string
    items_per_sheet: number | null
    sheets_needed: number | null
  }
  breakdown: PreviewLineItem[]
  production_cost: string | null
  suggested_selling_price: string | null
}

type PendingDraft = {
  intent: 'save' | 'claim'
  quantity: number
  values: Record<string, string>
}

const PUBLIC_DRAFT_KEY = 'printy-for-shops-public-draft-v1'

const PUBLIC_TO_AUTH_FIELD_MAP: Record<string, string> = {
  paper_300gsm_sra3: 'business_cards_paper_price',
  print_single_side: 'business_cards_print_single_price',
  print_double_side: 'business_cards_print_double_price',
  surcharge: 'business_cards_duplex_surcharge',
  matte_lamination: 'business_cards_lamination_price',
  cutting: 'business_cards_cutting_price',
}

const authStore = useAuthStore()
const shopStore = useShopStore()
const publicApi = usePublicApiNoAuth()
const api = useApi()
const router = useRouter()

const publicConfig = ref<PublicConfig | null>(null)
const configLoading = ref(false)
const configError = ref<string | null>(null)

const quantity = ref(500)
const fieldValues = reactive<Record<string, string>>({})

const previewLoading = ref(false)
const previewError = ref<string | null>(null)
const preview = ref<PublicPreview | null>(null)

const saveLoading = ref(false)
const saveError = ref<string | null>(null)
const saveMessage = ref<string | null>(null)
const authStatusMessage = ref<string | null>(null)

const pendingDraft = ref<PendingDraft | null>(null)
const resumeAttempted = ref(false)

let previewTimer: ReturnType<typeof setTimeout> | null = null

const isAuthenticated = computed(() => authStore.isAuthenticated)
const quantityOptions = computed(() => publicConfig.value?.preset.quantity_options ?? [100, 500])
const hasFieldErrors = computed(() => publicConfig.value?.fields.some(field => Boolean(fieldError(field.key))) ?? false)

function readPendingDraft(): PendingDraft | null {
  if (!import.meta.client) return null
  const raw = window.sessionStorage.getItem(PUBLIC_DRAFT_KEY)
  if (!raw) return null
  try {
    const parsed = JSON.parse(raw) as PendingDraft
    if (!parsed || typeof parsed !== 'object' || !parsed.values) return null
    return parsed
  } catch {
    return null
  }
}

function persistPendingDraft(intent: 'save' | 'claim') {
  if (!import.meta.client) return
  const draft: PendingDraft = {
    intent,
    quantity: quantity.value,
    values: Object.fromEntries(Object.entries(fieldValues).map(([key, value]) => [key, value ?? ''])),
  }
  pendingDraft.value = draft
  window.sessionStorage.setItem(PUBLIC_DRAFT_KEY, JSON.stringify(draft))
}

function clearPendingDraft() {
  pendingDraft.value = null
  if (import.meta.client) {
    window.sessionStorage.removeItem(PUBLIC_DRAFT_KEY)
  }
}

function restorePendingDraft() {
  pendingDraft.value = readPendingDraft()
}

function fieldError(fieldKey: string) {
  const raw = fieldValues[fieldKey]
  if (raw === '' || raw == null) return ''
  const amount = Number(raw)
  if (!Number.isFinite(amount)) return 'Enter a valid numeric amount.'
  if (amount < 0) return 'Value cannot be negative.'
  return ''
}

function marketGuide(field: PublicField) {
  const market = field.market
  if (!market || (!market.min && !market.max && !market.median && !market.mean)) {
    return 'No market guide yet'
  }
  const parts: string[] = []
  if (market.min && market.max) {
    parts.push(`Market range ${formatKes(market.min)}-${formatKes(market.max)}`)
  }
  if (market.median) {
    parts.push(`Median ${formatKes(market.median)}`)
  }
  if (market.mean) {
    parts.push(`Mean ${formatKes(market.mean)}`)
  }
  return parts.join(' - ') || 'No market guide yet'
}

function formatKes(value: string | number | null | undefined) {
  if (value == null || value === '') return 'KES -'
  const amount = Number(value)
  if (!Number.isFinite(amount)) return `KES ${value}`
  return `KES ${amount.toLocaleString('en-KE', {
    minimumFractionDigits: Number.isInteger(amount) ? 0 : 2,
    maximumFractionDigits: 2,
  })}`
}

function normalizeValue(value: string) {
  return value === '' ? null : value
}

function applyConfigDefaults() {
  if (!publicConfig.value) return

  const draft = pendingDraft.value
  quantity.value = draft?.quantity ?? publicConfig.value.preset.quantity_default ?? 500

  for (const field of publicConfig.value.fields) {
    fieldValues[field.key] = draft?.values?.[field.key] ?? field.value ?? ''
  }
}

function previewPayload() {
  return {
    preset_key: publicConfig.value?.preset.key ?? 'business_cards',
    quantity: quantity.value,
    rates: Object.fromEntries(
      (publicConfig.value?.fields ?? []).map(field => [field.key, normalizeValue(fieldValues[field.key] ?? '')]),
    ),
  }
}

function savePayload() {
  return {
    step_key: 'business_cards',
    quantity: quantity.value,
    values: Object.entries(PUBLIC_TO_AUTH_FIELD_MAP).map(([publicKey, authKey]) => ({
      key: authKey,
      value: normalizeValue(fieldValues[publicKey] ?? ''),
    })),
  }
}

async function loadPublicConfig() {
  configLoading.value = true
  configError.value = null
  try {
    publicConfig.value = await publicApi<PublicConfig>(API.forShopsRateWizardPublicConfig(), {
      method: 'GET',
    })
    applyConfigDefaults()
    queuePreview()
  } catch (error: unknown) {
    publicConfig.value = null
    configError.value = error instanceof Error
      ? error.message
      : parseApiError(error, 'Calculator data is unavailable right now. Check your backend connection and try again.')
  } finally {
    configLoading.value = false
  }
}

async function fetchPreview() {
  if (!publicConfig.value || hasFieldErrors.value) {
    preview.value = null
    return
  }

  previewLoading.value = true
  previewError.value = null
  try {
    preview.value = await publicApi<PublicPreview>(API.forShopsRateWizardPublicPreview(), {
      method: 'POST',
      body: previewPayload(),
      timeout: 20000,
    })
  } catch (error: unknown) {
    preview.value = null
    previewError.value = error instanceof Error
      ? error.message
      : parseApiError(error, 'Failed to fetch preview.')
  } finally {
    previewLoading.value = false
  }
}

function queuePreview() {
  if (previewTimer) clearTimeout(previewTimer)
  previewTimer = setTimeout(() => {
    fetchPreview()
  }, 350)
}

async function ensureShopContext() {
  if (!isAuthenticated.value) return false
  await shopStore.fetchMyShops().catch(() => {})
  return (shopStore.myShops?.length ?? 0) > 0
}

async function saveRates(intent: 'save' | 'claim', options: { silent?: boolean } = {}) {
  const silent = options.silent ?? false
  if (hasFieldErrors.value) return false

  saveLoading.value = true
  if (!silent) {
    saveError.value = null
    saveMessage.value = null
  }

  try {
    const hasShop = await ensureShopContext()
    if (!hasShop) {
      persistPendingDraft(intent)
      authStatusMessage.value = 'Create your shop to finish saving these rates. Your entered values are still here.'
      await router.push('/dashboard/shops/create')
      return false
    }

    await api(API.forShopsRateWizardSaveStep(), {
      method: 'POST',
      body: savePayload(),
    })

    clearPendingDraft()
    authStatusMessage.value = null
    saveMessage.value = intent === 'claim'
      ? 'Your business card rates were saved. Continue in your dashboard to finish shop setup.'
      : 'Your business card rates were saved to your shop.'

    if (intent === 'claim') {
      await router.push('/dashboard')
    }
    return true
  } catch (error: unknown) {
    saveError.value = error instanceof Error
      ? error.message
      : parseApiError(error, 'Failed to save your rates.')
    return false
  } finally {
    saveLoading.value = false
  }
}

async function resumePendingSave() {
  if (resumeAttempted.value || !pendingDraft.value || !isAuthenticated.value) return
  resumeAttempted.value = true

  const hasShop = await ensureShopContext()
  if (!hasShop) {
    authStatusMessage.value = 'Create your shop to finish saving these rates. Your entered values are still here.'
    return
  }

  await saveRates(pendingDraft.value.intent, { silent: true })
}

async function startAuthFlow(intent: 'save' | 'claim') {
  persistPendingDraft(intent)
  await router.push({
    path: intent === 'claim' ? '/auth/signup' : '/auth/login',
    query: {
      role: 'shop_owner',
      redirect: '/for-shops',
    },
  })
}

async function handleSaveClick() {
  if (!isAuthenticated.value) {
    await startAuthFlow('save')
    return
  }
  await saveRates('save')
}

async function handleClaimClick() {
  if (!isAuthenticated.value) {
    await startAuthFlow('claim')
    return
  }
  await saveRates('claim')
}

watch(
  () => [quantity.value, ...Object.values(fieldValues)],
  () => {
    saveMessage.value = null
    if (!publicConfig.value || configLoading.value || configError.value) return
    queuePreview()
  },
)

watch(isAuthenticated, async (authenticated) => {
  if (!authenticated) return
  await resumePendingSave()
}, { immediate: true })

onMounted(async () => {
  restorePendingDraft()
  await loadPublicConfig()
  await resumePendingSave()
})

onBeforeUnmount(() => {
  if (previewTimer) clearTimeout(previewTimer)
})
</script>
