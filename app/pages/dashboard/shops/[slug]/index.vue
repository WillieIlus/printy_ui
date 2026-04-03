<template>
  <div class="space-y-6">
    <DashboardPageHeader
      :title="shopStore.currentShop?.name || 'Shop workspace'"
      subtitle="This shop page now behaves like the main quoting desk for the selected shop."
    />

    <QuotesCalculatorHub v-if="slug">
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
    </QuotesCalculatorHub>

    <section class="rounded-3xl border border-[var(--p-border)] bg-[var(--p-surface)] p-6 shadow-sm">
      <div class="flex items-start justify-between gap-4">
        <div>
          <p class="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--p-text-muted)]">Setup Status</p>
          <h2 class="mt-2 text-2xl font-semibold text-[var(--p-text)]">Backend progression</h2>
          <p class="mt-2 text-sm text-[var(--p-text-muted)]">{{ setupStore.status?.next_url || 'Setup complete.' }}</p>
        </div>
        <UButton v-if="setupStore.status?.next_url" :to="setupStore.status.next_url" variant="soft">Open next step</UButton>
      </div>

      <div class="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <article
          v-for="step in setupCards"
          :key="step.label"
          class="rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface-sunken)] p-4"
        >
          <p class="text-sm font-semibold text-[var(--p-text)]">{{ step.label }}</p>
          <p class="mt-2 text-sm text-[var(--p-text-muted)]">{{ step.value }}</p>
        </article>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import type { IncomingRequestDetail } from '~/shared/types/incomingRequest'
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

const prefillRequest = computed(() => {
  const source = prefillSourceRequest.value
  const item = source?.items?.[0]
  if (!source || !item) return null
  return {
    requestId: source.id,
    itemId: item.id,
    shopSlug: slug.value,
    workspaceMode: item.item_type === 'CUSTOM' ? 'custom' : 'catalog',
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
    colorMode: item.color_mode === 'BW' ? 'BW' : 'COLOR',
    sides: item.sides === 'DUPLEX' ? 'DUPLEX' : 'SIMPLEX',
    finishings: (item.finishings ?? []).map(finishing => ({
      finishing_rate_id: finishing.finishing_rate,
      selected_side: 'both' as const,
    })),
  }
})

const setupCards = computed(() => [
  { label: 'Machines', value: setupStore.status?.has_machines ? 'Ready' : 'Missing' },
  { label: 'Papers', value: setupStore.status?.has_papers ? 'Ready' : 'Missing' },
  { label: 'Pricing', value: setupStore.status?.has_pricing ? 'Ready' : 'Missing' },
  { label: 'Finishing', value: setupStore.status?.has_finishing ? 'Ready' : 'Missing' },
  { label: 'Products', value: setupStore.status?.has_products ? 'Ready' : 'Missing' },
])

watch(() => route.query.requestId, () => {
  void loadPrefillRequest()
})
</script>
