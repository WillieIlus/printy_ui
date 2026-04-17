<template>
  <div class="space-y-6">
    <DashboardPageHeader
      :title="shopStore.currentShop?.name || 'Shop workspace'"
      subtitle="This shop page now behaves like the main quoting desk for the selected shop."
    />

    <details v-if="slug" class="group overflow-hidden rounded-3xl border border-[var(--p-border)] bg-[var(--p-surface)] shadow-sm">
      <summary class="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-5 marker:hidden">
        <div>
          <p class="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--p-text-muted)]">Shared calculator</p>
          <p class="mt-2 text-lg font-semibold text-[var(--p-text)]">Open quote workbench</p>
          <p class="mt-1 text-sm text-[var(--p-text-muted)]">Same calculator families, same backend pricing contracts, collapsed here until the team needs the workspace.</p>
        </div>
        <span class="inline-flex shrink-0 items-center gap-1.5 rounded-xl border border-flamingo-500 bg-flamingo-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:border-flamingo-400 hover:bg-flamingo-400 group-open:border-[var(--p-border)] group-open:bg-transparent group-open:text-[var(--p-text-muted)] group-open:hover:bg-[var(--p-surface)]">
          <span class="group-open:hidden">Open calculator</span>
          <span class="hidden group-open:inline">Collapse</span>
          <UIcon name="i-lucide-chevron-down" class="h-4 w-4 shrink-0 transition-transform duration-200 group-open:rotate-180" />
        </span>
      </summary>
      <div class="border-t border-[var(--p-border)] px-6 py-6">
        <QuotesCalculatorHub>
          <template #flat>
            <QuotesBackendQuoteCalculator
              :fixed-shop-slug="slug"
              :prefill-request="prefillRequest"
              eyebrow="Shop Workspace"
              title="Quick quote workbench"
              description="Use the backend preview, then move to the quote inbox actions below."
              mode="shop"
              @draft-saved="refreshPage"
              @draft-sent="refreshPage"
            />
          </template>
          <template #booklet>
            <QuotesBookletCalculator
              :fixed-shop-slug="slug"
              :fixed-shop-name="shopStore.currentShop?.name || slug"
              eyebrow="Shop Workspace Booklet"
              title="Booklet quote workbench"
              description="Use the backend booklet preview, then move to the quote inbox actions below."
            />
          </template>
          <template #large_format>
            <QuotesLargeFormatCalculator
              :fixed-shop-slug="slug"
              :fixed-shop-name="shopStore.currentShop?.name || slug"
              eyebrow="Shop Workspace Large Format"
              title="Large-format quote workbench"
              description="Use the backend large-format preview, then move to the quote inbox actions below."
            />
          </template>
        </QuotesCalculatorHub>
      </div>
    </details>

    <section class="rounded-3xl border border-[var(--p-border)] bg-[var(--p-surface)] p-6 shadow-sm">
      <div class="flex items-start justify-between gap-4">
        <div>
          <p class="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--p-text-muted)]">Setup Status</p>
          <h2 class="mt-2 text-2xl font-semibold text-[var(--p-text)]">Guided onboarding</h2>
          <p class="mt-2 text-sm text-[var(--p-text-muted)]">{{ setupSummary }}</p>
        </div>
        <UButton v-if="nextSetupRoute" :to="nextSetupRoute" variant="soft">{{ nextSetupLabel }}</UButton>
      </div>

      <div class="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        <article
          v-for="step in setupCards"
          :key="step.label"
          class="rounded-2xl border p-4"
          :class="setupCardClass(step.state)"
        >
          <div class="flex items-center justify-between gap-3">
            <p class="text-sm font-semibold text-[var(--p-text)]">{{ step.label }}</p>
            <UBadge :color="step.state === 'complete' ? 'success' : step.state === 'current' ? 'warning' : 'neutral'" variant="soft" size="xs">
              {{ step.state === 'complete' ? 'Complete' : step.state === 'current' ? 'Current' : 'Blocked' }}
            </UBadge>
          </div>
          <p class="mt-2 text-sm text-[var(--p-text-muted)]">{{ step.helper }}</p>
          <UButton :to="step.ctaTo" :variant="step.state === 'current' ? 'solid' : 'soft'" :color="step.state === 'complete' ? 'success' : step.state === 'current' ? 'warning' : 'neutral'" class="mt-4">
            {{ step.ctaLabel }}
          </UButton>
        </article>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import type { IncomingRequestDetail } from '~/shared/types/incomingRequest'
import { useSetupFlow } from '~/composables/useSetupFlow'
import { useShopStore } from '~/stores/shop'
import { useQuoteInboxStore } from '~/stores/quoteInbox'
import { useSetupStatusStore } from '~/stores/setupStatus'

definePageMeta({
  layout: 'dashboard',
  middleware: ['auth', 'shop-owner'],
})

const route = useRoute()
const slug = computed(() => String(route.params.slug || ''))
const shopStore = useShopStore()
const setupStore = useSetupStatusStore()
const quoteInboxStore = useQuoteInboxStore()
const incomingRequests = useIncomingRequests(slug)
const prefillSourceRequest = ref<IncomingRequestDetail | null>(null)
const setupFlow = useSetupFlow(slug)

interface ShopQuotePrefillRequest {
  requestId: number
  itemId: number
  shopSlug: string
  workspaceMode: 'catalog' | 'custom'
  contactName?: string
  contactPhone?: string
  contactEmail?: string
  notes?: string
  customProductTitle?: string
  customProductSpec?: string
  quantity?: number | null
  widthMm?: number | null
  heightMm?: number | null
  turnaroundDays?: number | null
  productId?: number | null
  paperId?: number | null
  machineId?: number | null
  colorMode?: 'BW' | 'COLOR'
  sides?: 'SIMPLEX' | 'DUPLEX'
  finishings?: Array<{ finishing_rate_id: number; selected_side: 'front' | 'back' | 'both' }>
}

onMounted(async () => {
  await refreshPage()
})

async function refreshPage() {
  await Promise.all([
    shopStore.ensureActiveShop(slug.value),
    setupStore.fetchStatus(slug.value),
    quoteInboxStore.fetchDashboard(),
  ])
  await loadPrefillRequest()
}

async function loadPrefillRequest() {
  const requestId = Number(route.query.requestId)
  if (!requestId || Number.isNaN(requestId)) {
    prefillSourceRequest.value = null
    return
  }
  try {
    prefillSourceRequest.value = await incomingRequests.get(requestId)
  } catch {
    prefillSourceRequest.value = null
  }
}

const prefillRequest = computed<ShopQuotePrefillRequest | null>(() => {
  const source = prefillSourceRequest.value
  const item = source?.items?.[0]
  if (!source || !item) return null
  const colorMode = (item.color_mode === 'BW' ? 'BW' : 'COLOR') as 'BW' | 'COLOR'
  const sides = (item.sides === 'DUPLEX' ? 'DUPLEX' : 'SIMPLEX') as 'SIMPLEX' | 'DUPLEX'

  return {
    requestId: source.id,
    itemId: item.id,
    shopSlug: slug.value,
    workspaceMode: (item.item_type === 'CUSTOM' ? 'custom' : 'catalog') as 'custom' | 'catalog',
    contactName: source.customer_name || '',
    contactPhone: source.customer_phone || '',
    contactEmail: source.customer_email || '',
    notes: source.notes || '',
    customProductTitle: item.title || item.product_name || '',
    customProductSpec: item.spec_text || '',
    quantity: item.quantity || null,
    widthMm: item.chosen_width_mm ?? null,
    heightMm: item.chosen_height_mm ?? null,
    turnaroundDays: 2,
    productId: item.product ?? null,
    paperId: item.paper ?? null,
    machineId: (item as Record<string, unknown>).machine ? Number((item as Record<string, unknown>).machine) : null,
    colorMode,
    sides,
    finishings: (item.finishings ?? []).map(finishing => ({
      finishing_rate_id: finishing.finishing_rate,
      selected_side: 'both' as const,
    })),
  }
})

const setupCards = computed(() => setupFlow.value.steps)
const setupSummary = computed(() => `${setupFlow.value.completedCount} of ${setupFlow.value.steps.length} onboarding steps complete`)
const nextSetupRoute = computed(() => setupFlow.value.nextRequiredRoute)
const nextSetupLabel = computed(() => setupFlow.value.nextRequiredStep ? 'Complete next step' : 'Review setup')

watch(() => route.query.requestId, () => {
  void loadPrefillRequest()
})

function setupCardClass(state: 'complete' | 'current' | 'blocked') {
  if (state === 'complete') return 'border-emerald-300/45 bg-[color:color-mix(in_oklab,var(--p-surface)_88%,rgb(16_185_129)_8%)]'
  if (state === 'current') return 'border-amber-300/70 bg-[color:color-mix(in_oklab,var(--p-surface)_84%,rgb(245_158_11)_12%)]'
  return 'border-[var(--p-border)] bg-[var(--p-surface-sunken)]'
}
</script>
