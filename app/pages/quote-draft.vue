<template>
  <div class="min-h-screen bg-[var(--p-surface)]">
    <main class="mx-auto max-w-7xl space-y-8 px-4 py-10 sm:px-6 lg:px-8">
      <QuotesCalculatorHub>
        <template #flat>
          <QuotesBackendQuoteCalculator
            title="Requests & quotes workspace"
            description="Build a request, send it to shops, and come back here to track replies, quotes, and next steps."
            eyebrow="Client Workspace"
            mode="client"
            @draft-saved="refreshWorkspace"
            @draft-sent="refreshWorkspace"
          />
        </template>
        <template #booklet>
          <QuotesBookletCalculator
            title="Booklet requests & quotes workspace"
            description="Build a booklet request, save it into your workspace, and keep tracking replies and quotes here."
            eyebrow="Client Workspace"
          />
        </template>
      </QuotesCalculatorHub>

      <section class="rounded-lg border border-[var(--p-border)] bg-[var(--p-surface)] p-6 shadow-sm">
        <div class="flex items-start justify-between gap-4">
          <div>
            <p class="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--p-text-muted)]">Saved requests</p>
            <h2 class="mt-2 text-2xl font-semibold text-[var(--p-text)]">Drafts you can still send</h2>
            <p class="mt-2 text-sm text-[var(--p-text-muted)]">These are unfinished or unsent request drafts saved from the calculator.</p>
          </div>
          <UButton variant="soft" :loading="quoteInboxStore.loading" @click="refreshWorkspace">Refresh</UButton>
        </div>

        <div v-if="quoteInboxStore.loading && !quoteInboxStore.drafts.length" class="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <div v-for="index in 3" :key="index" class="h-36 animate-pulse rounded-2xl bg-[var(--p-surface-sunken)]" />
        </div>

        <div v-else-if="!quoteInboxStore.drafts.length" class="mt-6 rounded-2xl border border-dashed border-[var(--p-border)] bg-[var(--p-surface-sunken)] p-8 text-center text-[var(--p-text-muted)]">
          No saved drafts yet. Start a request above and it will appear here until you send it.
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
                <p class="mt-2 text-sm font-semibold text-[var(--p-text)]">{{ draftPreviewTotal(draft) }}</p>
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
                {{ draftSendLabel(draft) }}
              </UButton>
            </div>
          </article>
        </div>
      </section>

      <section class="rounded-lg border border-[var(--p-border)] bg-[var(--p-surface)] p-6 shadow-sm">
        <div class="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p class="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--p-text-muted)]">Tracking</p>
            <h2 class="mt-2 text-2xl font-semibold text-[var(--p-text)]">Requests and received quotes</h2>
            <p class="mt-2 text-sm text-[var(--p-text-muted)]">
              After you send a request, this is where you follow shop replies, received quotes, and final outcomes.
            </p>
          </div>
          <div class="flex flex-wrap gap-2">
            <UButton variant="soft" to="/quotes">Open full request list</UButton>
            <UButton variant="soft" :loading="quoteInboxStore.loading" @click="refreshWorkspace">Refresh</UButton>
          </div>
        </div>

        <div class="mt-5 grid gap-3 md:grid-cols-3">
          <article class="rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface-sunken)] p-4">
            <p class="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--p-text-muted)]">New Quotes</p>
            <p class="mt-2 text-2xl font-extrabold text-[var(--p-text)]">{{ activityBadgesStore.summary.client.new_quotes }}</p>
            <p class="mt-1 text-sm text-[var(--p-text-muted)]">Fresh quotes sent by shops.</p>
          </article>
          <article class="rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface-sunken)] p-4">
            <p class="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--p-text-muted)]">Shop Replies</p>
            <p class="mt-2 text-2xl font-extrabold text-[var(--p-text)]">{{ activityBadgesStore.summary.client.shop_replies }}</p>
            <p class="mt-1 text-sm text-[var(--p-text-muted)]">Requests waiting for your answer.</p>
          </article>
          <article class="rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface-sunken)] p-4">
            <p class="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--p-text-muted)]">Request Updates</p>
            <p class="mt-2 text-2xl font-extrabold text-[var(--p-text)]">{{ activityBadgesStore.summary.client.request_updates }}</p>
            <p class="mt-1 text-sm text-[var(--p-text-muted)]">Declines or other request changes.</p>
          </article>
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
                <p class="mt-2 text-sm text-[var(--p-text)]">{{ request.latest_sent_quote?.human_ready_text || (request.latest_sent_quote?.turnaround_hours ? `${request.latest_sent_quote.turnaround_hours} working hour(s)` : 'On request') }}</p>
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
import { useToast } from '#imports'
import type { QuoteDraft } from '~/shared/types/buyer'
import QuotesShopSelectionChips from '~/components/quotes/ShopSelectionChips.vue'
import { useQuoteRequestBlast } from '~/composables/useQuoteRequestBlast'
import { listShops } from '~/services/public'
import { getPostLoginRedirectPath } from '~/composables/useAuth'
import { buildQuoteRequestSendSummary, getQuoteRequestSendLabel, getQuoteRequestSendToast } from '~/shared/quoteRequestSend'
import { useActivityBadgesStore } from '~/stores/activityBadges'
import { useAuthStore } from '~/stores/auth'
import { useQuoteInboxStore } from '~/stores/quoteInbox'
import { extractProductionDetails } from '~/utils/productionDetails'

definePageMeta({
  layout: 'default',
  middleware: ['auth'],
})

const authStore = useAuthStore()
const activityBadgesStore = useActivityBadgesStore()
const quoteInboxStore = useQuoteInboxStore()
const { sendSavedDraft } = useQuoteRequestBlast()
const toast = useToast()
const statusFilter = ref<'pending' | 'modified' | 'accepted' | 'rejected' | 'all'>('pending')
const availableShops = ref<Array<{ id: number; name: string; slug: string }>>([])
const selectedDraftShopSlugs = ref<Record<number, string[]>>({})
const sendingDraftId = ref<number | null>(null)
const sentDraftSummaries = ref<Record<number, { shopCount: number; requestIds: number[] }>>({})

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
    activityBadgesStore.fetchSummary(),
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

function draftPreviewTotal(draft: QuoteDraft) {
  const snapshot = draft.pricing_snapshot as { totals?: { grand_total?: string } } | null | undefined
  return snapshot?.totals?.grand_total || 'Awaiting preview'
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
      sentDraftSummaries.value = {
        ...sentDraftSummaries.value,
        [draft.id]: buildQuoteRequestSendSummary(requests),
      }
      const successToast = getQuoteRequestSendToast(sentDraftSummaries.value[draft.id] ?? null)
      toast.add({ title: successToast.title, description: successToast.description, color: 'success' })
      await refreshWorkspace()
    }
  } catch (error) {
    toast.add({ title: 'Error', description: error instanceof Error ? error.message : 'Could not send this draft.', color: 'error' })
  } finally {
    sendingDraftId.value = null
  }
}

function draftSendLabel(draft: QuoteDraft) {
  const sharedLabel = getQuoteRequestSendLabel(sentDraftSummaries.value[draft.id] ?? null, sendingDraftId.value === draft.id)
  if (sharedLabel) return sharedLabel
  return draft.status === 'draft' ? 'Send request to selected shops' : 'Request already sent'
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
