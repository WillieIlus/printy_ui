<template>
  <div class="min-h-screen bg-[var(--p-surface)]">
    <main class="mx-auto max-w-7xl space-y-8 px-4 py-10 sm:px-6 lg:px-8">
      <section class="rounded-[2rem] border border-[var(--p-border)] bg-[var(--p-surface)] p-8 shadow-sm">
        <p class="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--p-text-muted)]">Client Workspace</p>
        <h1 class="mt-3 text-4xl font-semibold tracking-tight text-[var(--p-text)]">Quote drafts</h1>
        <p class="mt-3 max-w-3xl text-base leading-7 text-[var(--p-text-muted)]">
          Preview prices from the backend, save prepared drafts, then send them to shops without guessing totals or quote states in the browser.
        </p>
      </section>

      <QuotesBackendQuoteCalculator
        title="Prepare a quote draft"
        description="Use the same backend preview path as the homepage and dashboard. Totals and finishing breakdowns come directly from the API."
        eyebrow="Client Drafts"
        mode="client"
        @draft-saved="handleDraftSaved"
        @draft-sent="handleDraftSent"
      />

      <section class="rounded-[2rem] border border-[var(--p-border)] bg-[var(--p-surface)] p-6 shadow-sm">
        <div class="flex items-start justify-between gap-4">
          <div>
            <p class="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--p-text-muted)]">Saved Drafts</p>
            <h2 class="mt-2 text-2xl font-semibold text-[var(--p-text)]">Backend draft history</h2>
          </div>
          <UButton variant="soft" @click="refreshDrafts">Refresh</UButton>
        </div>

        <div v-if="quoteInboxStore.loading && !quoteInboxStore.drafts.length" class="mt-6 grid gap-4 md:grid-cols-2">
          <div v-for="index in 4" :key="index" class="h-36 animate-pulse rounded-2xl bg-[var(--p-surface-sunken)]" />
        </div>

        <div v-else-if="!quoteInboxStore.drafts.length" class="mt-6 rounded-2xl border border-dashed border-[var(--p-border)] bg-[var(--p-surface-sunken)] p-8 text-center text-[var(--p-text-muted)]">
          No drafts yet. Save a backend draft from the calculator above.
        </div>

        <div v-else class="mt-6 grid gap-4 md:grid-cols-2">
          <article
            v-for="draft in quoteInboxStore.drafts"
            :key="draft.id"
            class="rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface-sunken)] p-5"
          >
            <div class="flex items-start justify-between gap-3">
              <div>
                <p class="text-sm font-semibold text-[var(--p-text)]">{{ draft.title || draft.draft_reference || `Draft #${draft.id}` }}</p>
                <p class="mt-1 text-sm text-[var(--p-text-muted)]">{{ draft.status }}</p>
              </div>
              <UBadge variant="soft" :color="badgeColor(draft.status)">{{ draft.status }}</UBadge>
            </div>
            <p class="mt-4 text-sm text-[var(--p-text-muted)]">
              {{ draft.pricing_snapshot?.totals?.grand_total || 'Awaiting preview total' }}
            </p>
            <p class="mt-2 text-sm text-[var(--p-text-muted)]">
              {{ draft.request_details_snapshot?.customer_name || 'No customer name yet' }}
            </p>
          </article>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'
import { useQuoteInboxStore } from '~/stores/quoteInbox'

definePageMeta({
  layout: 'default',
  middleware: ['auth'],
})

const authStore = useAuthStore()
const quoteInboxStore = useQuoteInboxStore()

watchEffect(() => {
  if (authStore.isShopOwner) {
    navigateTo('/dashboard')
  }
})

onMounted(async () => {
  await refreshDrafts()
})

async function refreshDrafts() {
  if (!authStore.isClient) return
  await quoteInboxStore.fetchDrafts()
}

function handleDraftSaved() {
  refreshDrafts()
}

function handleDraftSent() {
  refreshDrafts()
}

function badgeColor(status: string) {
  if (status === 'accepted') return 'success'
  if (status === 'rejected') return 'error'
  if (status === 'modified') return 'warning'
  return 'neutral'
}
</script>
