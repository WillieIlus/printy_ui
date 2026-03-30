<template>
  <div class="min-h-screen bg-[var(--p-surface)]">
    <main class="mx-auto max-w-7xl space-y-8 px-4 py-10 sm:px-6 lg:px-8">
      <QuotesBackendQuoteCalculator
        title="Prepare a quote draft"
        description="This uses the backend preview path directly. Save drafts, send them to selected shops, and keep pricing logic out of the browser."
        eyebrow="Client Drafts"
        mode="client"
        @draft-saved="refreshWorkspace"
        @draft-sent="refreshWorkspace"
      />

      <section class="rounded-lg border border-[var(--p-border)] bg-[var(--p-surface)] p-6 shadow-sm">
        <div class="flex items-start justify-between gap-4">
          <div>
            <p class="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--p-text-muted)]">Saved Drafts</p>
            <h2 class="mt-2 text-2xl font-semibold text-[var(--p-text)]">Draft history</h2>
            <p class="mt-2 text-sm text-[var(--p-text-muted)]">Saved draft records come from the backend calculator draft endpoints.</p>
          </div>
          <UButton variant="soft" :loading="quoteInboxStore.loading" @click="refreshWorkspace">Refresh</UButton>
        </div>

        <div v-if="quoteInboxStore.loading && !quoteInboxStore.drafts.length" class="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <div v-for="index in 3" :key="index" class="h-36 animate-pulse rounded-2xl bg-[var(--p-surface-sunken)]" />
        </div>

        <div v-else-if="!quoteInboxStore.drafts.length" class="mt-6 rounded-2xl border border-dashed border-[var(--p-border)] bg-[var(--p-surface-sunken)] p-8 text-center text-[var(--p-text-muted)]">
          No drafts yet. Save a draft from the calculator above.
        </div>

        <div v-else class="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <article
            v-for="draft in quoteInboxStore.drafts"
            :key="draft.id"
            class="rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface-sunken)] p-5"
          >
            <div class="flex items-start justify-between gap-3">
              <div>
                <p class="text-sm font-semibold text-[var(--p-text)]">{{ draft.title || draft.draft_reference || `Draft #${draft.id}` }}</p>
                <p class="mt-1 text-sm text-[var(--p-text-muted)]">{{ draft.request_details_snapshot?.customer_name || 'No customer name yet' }}</p>
              </div>
              <UBadge variant="soft" :color="draftBadgeColor(draft.status)">{{ draft.status }}</UBadge>
            </div>
            <div class="mt-4 grid gap-3 sm:grid-cols-2">
              <div class="rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface)] p-3">
                <p class="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--p-text-muted)]">Shop</p>
                <p class="mt-2 text-sm text-[var(--p-text)]">{{ draft.shop_name || draft.shop_slug || 'Unassigned' }}</p>
              </div>
              <div class="rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface)] p-3">
                <p class="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--p-text-muted)]">Preview total</p>
                <p class="mt-2 text-sm font-semibold text-[var(--p-text)]">{{ draft.pricing_snapshot?.totals?.grand_total || 'Awaiting preview' }}</p>
              </div>
            </div>
            <div v-if="draftProduction(draft).piecesPerSheet || draftProduction(draft).sheetsNeeded" class="mt-4 grid gap-3 sm:grid-cols-2">
              <div class="rounded-2xl border border-flamingo-200 bg-[var(--p-surface)] p-3">
                <p class="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--p-text-muted)]">Pcs per sheet</p>
                <p class="mt-2 text-lg font-extrabold text-[var(--p-text)]">{{ draftProduction(draft).piecesPerSheet }}</p>
              </div>
              <div class="rounded-2xl border border-flamingo-200 bg-[var(--p-surface)] p-3">
                <p class="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--p-text-muted)]">Sheets needed</p>
                <p class="mt-2 text-lg font-extrabold text-flamingo-600">{{ draftProduction(draft).sheetsNeeded }}</p>
              </div>
            </div>
            <div v-if="availableShops.length" class="mt-4 space-y-3">
              <p class="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--p-text-muted)]">Selected shops</p>
              <QuotesShopSelectionChips
                :shops="availableShops.map(shop => ({ slug: shop.slug, label: shop.name }))"
                :selected-slugs="selectedDraftShopSlugs[draft.id] ?? []"
                @toggle="toggleDraftShop(draft.id, $event)"
              />
              <UButton
                size="sm"
                color="primary"
                :loading="sendingDraftId === draft.id"
                :disabled="draft.status !== 'draft' || !(selectedDraftShopIds(draft).length)"
                @click="sendSavedDraftRequest(draft)"
              >
                {{ draft.status === 'draft' ? 'Send request to selected shops' : 'Request already sent' }}
              </UButton>
            </div>
          </article>
        </div>
      </section>

      <section class="rounded-lg border border-[var(--p-border)] bg-[var(--p-surface)] p-6 shadow-sm">
        <div class="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p class="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--p-text-muted)]">Sent Requests</p>
            <h2 class="mt-2 text-2xl font-semibold text-[var(--p-text)]">Shop responses</h2>
            <p class="mt-2 text-sm text-[var(--p-text-muted)]">
              Statuses below are derived from backend quote request and quote response endpoints.
            </p>
          </div>
          <div class="flex flex-wrap gap-2">
            <UButton variant="soft" to="/quotes">Open full requests</UButton>
            <UButton variant="soft" :loading="quoteInboxStore.loading" @click="refreshWorkspace">Refresh</UButton>
          </div>
        </div>

        <div class="mt-5 flex flex-wrap gap-2">
          <UButton
            v-for="tab in statusTabs"
            :key="tab.value"
            :variant="statusFilter === tab.value ? 'solid' : 'soft'"
            :color="statusFilter === tab.value ? 'primary' : 'neutral'"
            @click="statusFilter = tab.value"
          >
            {{ tab.label }} <span class="ml-1 opacity-75">{{ tab.count }}</span>
          </UButton>
        </div>

        <div v-if="quoteInboxStore.loading && !quoteInboxStore.clientRequests.length" class="mt-6 grid gap-4 md:grid-cols-2">
          <div v-for="index in 4" :key="index" class="h-40 animate-pulse rounded-2xl bg-[var(--p-surface-sunken)]" />
        </div>

        <div v-else-if="!filteredRequests.length" class="mt-6 rounded-2xl border border-dashed border-[var(--p-border)] bg-[var(--p-surface-sunken)] p-8 text-center text-[var(--p-text-muted)]">
          No requests in this status yet.
        </div>

        <div v-else class="mt-6 grid gap-4 md:grid-cols-2">
          <article
            v-for="request in filteredRequests"
            :key="request.id"
            class="rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface-sunken)] p-5"
          >
            <div class="flex items-start justify-between gap-3">
              <div class="min-w-0">
                <p class="text-sm font-semibold text-[var(--p-text)]">{{ request.shop_name }}</p>
                <p class="mt-1 text-sm text-[var(--p-text-muted)]">{{ request.customer_name || 'No customer name' }}</p>
              </div>
              <UBadge variant="soft" :color="requestBadgeColor(request.response_status)">{{ request.response_status }}</UBadge>
            </div>

            <div class="mt-4 grid gap-3 sm:grid-cols-2">
              <div class="rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface)] p-3">
                <p class="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--p-text-muted)]">Latest total</p>
                <p class="mt-2 text-sm font-semibold text-[var(--p-text)]">{{ request.latest_response?.total || request.latest_sent_quote?.total || 'Awaiting shop response' }}</p>
              </div>
              <div class="rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface)] p-3">
                <p class="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--p-text-muted)]">Turnaround</p>
                <p class="mt-2 text-sm text-[var(--p-text)]">{{ request.latest_sent_quote?.turnaround_days ? `${request.latest_sent_quote.turnaround_days} day(s)` : 'On request' }}</p>
              </div>
            </div>

            <div class="mt-4 flex items-center justify-between gap-3">
              <p class="text-xs uppercase tracking-[0.12em] text-[var(--p-text-muted)]">
                {{ formatRequestDate(request.updated_at || request.created_at) }}
              </p>
              <UButton variant="soft" :to="`/quotes/${request.id}`">Open request</UButton>
            </div>
          </article>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import type { QuoteDraft } from '~/shared/types/buyer'
import QuotesShopSelectionChips from '~/components/quotes/ShopSelectionChips.vue'
import { useQuoteRequestBlast } from '~/composables/useQuoteRequestBlast'
import { listShops } from '~/services/public'
import { getPostLoginRedirectPath } from '~/composables/useAuth'
import { useAuthStore } from '~/stores/auth'
import { useQuoteInboxStore } from '~/stores/quoteInbox'
import { extractProductionDetails } from '~/utils/productionDetails'

definePageMeta({
  layout: 'default',
  middleware: ['auth'],
})

const authStore = useAuthStore()
const quoteInboxStore = useQuoteInboxStore()
const { sendSavedDraft } = useQuoteRequestBlast()
const toast = useToast()
const statusFilter = ref<'pending' | 'modified' | 'accepted' | 'rejected' | 'all'>('pending')
const availableShops = ref<Array<{ id: number; name: string; slug: string }>>([])
const selectedDraftShopSlugs = ref<Record<number, string[]>>({})
const sendingDraftId = ref<number | null>(null)

watchEffect(() => {
  if (!authStore.isClient && authStore.isAuthenticated) {
    navigateTo(getPostLoginRedirectPath(authStore.user, false))
  }
})

onMounted(async () => {
  await refreshWorkspace()
})

async function refreshWorkspace() {
  if (!authStore.isClient) return
  await Promise.all([
    loadAvailableShops(),
    quoteInboxStore.fetchDrafts(),
    quoteInboxStore.fetchClientRequests(),
  ])
}

async function loadAvailableShops() {
  const shops = await listShops()
  availableShops.value = shops.map(shop => ({ id: shop.id, name: shop.name, slug: shop.slug }))
}

const statusTabs = computed(() => [
  { label: 'Pending', value: 'pending' as const, count: quoteInboxStore.clientRequests.filter(request => request.response_status === 'pending').length },
  { label: 'Modified', value: 'modified' as const, count: quoteInboxStore.clientRequests.filter(request => request.response_status === 'modified').length },
  { label: 'Accepted', value: 'accepted' as const, count: quoteInboxStore.clientRequests.filter(request => request.response_status === 'accepted').length },
  { label: 'Rejected', value: 'rejected' as const, count: quoteInboxStore.clientRequests.filter(request => request.response_status === 'rejected').length },
  { label: 'All', value: 'all' as const, count: quoteInboxStore.clientRequests.length },
])

const filteredRequests = computed(() => {
  if (statusFilter.value === 'all') return quoteInboxStore.clientRequests
  return quoteInboxStore.clientRequests.filter(request => request.response_status === statusFilter.value)
})

function draftBadgeColor(status: string) {
  if (status === 'accepted') return 'success'
  if (status === 'rejected') return 'error'
  if (status === 'modified') return 'warning'
  return 'neutral'
}

function requestBadgeColor(status: string) {
  if (status === 'accepted') return 'success'
  if (status === 'rejected') return 'error'
  if (status === 'modified') return 'warning'
  return 'neutral'
}

function draftProduction(draft: QuoteDraft) {
  return extractProductionDetails(draft.pricing_snapshot)
}

function defaultDraftShopSlugs(draft: QuoteDraft) {
  const snapshot = draft.request_details_snapshot ?? {}
  const fromSnapshot = Array.isArray(snapshot.selected_shop_slugs) ? snapshot.selected_shop_slugs.filter((value): value is string => typeof value === 'string') : []
  if (fromSnapshot.length) return fromSnapshot
  if (draft.shop_slug) return [draft.shop_slug]
  const fallbackShop = availableShops.value.find(shop => shop.id === draft.shop)
  return fallbackShop ? [fallbackShop.slug] : []
}

watch(
  () => [quoteInboxStore.drafts, availableShops.value] as const,
  () => {
    const nextState: Record<number, string[]> = { ...selectedDraftShopSlugs.value }
    for (const draft of quoteInboxStore.drafts) {
      if (!nextState[draft.id]?.length) {
        nextState[draft.id] = defaultDraftShopSlugs(draft)
      }
    }
    selectedDraftShopSlugs.value = nextState
  },
  { immediate: true, deep: true }
)

function toggleDraftShop(draftId: number, slug: string) {
  const current = selectedDraftShopSlugs.value[draftId] ?? []
  selectedDraftShopSlugs.value = {
    ...selectedDraftShopSlugs.value,
    [draftId]: current.includes(slug)
      ? current.filter(value => value !== slug)
      : [...current, slug],
  }
}

function selectedDraftShopIds(draft: QuoteDraft) {
  return (selectedDraftShopSlugs.value[draft.id] ?? [])
    .map(slug => availableShops.value.find(shop => shop.slug === slug)?.id ?? null)
    .filter((value): value is number => typeof value === 'number')
}

async function sendSavedDraftRequest(draft: QuoteDraft) {
  if (draft.status !== 'draft') return
  const shopIds = selectedDraftShopIds(draft)
  if (!shopIds.length) return
  sendingDraftId.value = draft.id
  try {
    const requests = await sendSavedDraft(
      draft.id,
      shopIds,
      {
        ...(draft.request_details_snapshot ?? {}),
        selected_shop_slugs: selectedDraftShopSlugs.value[draft.id] ?? [],
        selected_shop_ids: shopIds,
      }
    )
    if (requests?.length) {
      toast.add({ title: 'Request sent', description: requests.length === 1 ? 'The selected shop received this draft.' : `${requests.length} shops received this draft.`, color: 'success' })
      await refreshWorkspace()
    }
  } catch (error) {
    toast.add({ title: 'Error', description: error instanceof Error ? error.message : 'Could not send this draft.', color: 'error' })
  } finally {
    sendingDraftId.value = null
  }
}

function formatRequestDate(value?: string) {
  if (!value) return 'Recently'
  try {
    return new Intl.DateTimeFormat('en-KE', {
      day: 'numeric',
      month: 'short',
      hour: 'numeric',
      minute: '2-digit',
    }).format(new Date(value))
  } catch {
    return value
  }
}
</script>
