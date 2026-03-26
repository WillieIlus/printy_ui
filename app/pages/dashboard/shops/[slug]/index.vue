<template>
  <div class="space-y-6">
    <DashboardPageHeader
      :title="shopStore.currentShop?.name || 'Shop workspace'"
      subtitle="This shop page now behaves like the main quoting desk for the selected shop."
    />

    <QuotesBackendQuoteCalculator
      v-if="slug"
      :fixed-shop-slug="slug"
      eyebrow="Shop Workspace"
      title="Quick quote workbench"
      description="Use the backend preview, then move to the quote inbox actions below."
      mode="shop"
      @draft-saved="refreshPage"
      @draft-sent="refreshPage"
    />

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

onMounted(async () => {
  await refreshPage()
})

async function refreshPage() {
  await Promise.all([
    shopStore.ensureActiveShop(slug.value),
    setupStore.fetchStatus(slug.value),
    quoteInboxStore.fetchDashboard(),
  ])
}

const setupCards = computed(() => [
  { label: 'Materials', value: setupStore.status?.has_materials ? 'Ready' : 'Missing' },
  { label: 'Pricing', value: setupStore.status?.has_pricing ? 'Ready' : 'Missing' },
  { label: 'Finishing', value: setupStore.status?.has_finishing ? 'Ready' : 'Missing' },
  { label: 'Products', value: setupStore.status?.has_products ? 'Ready' : 'Missing' },
])
</script>
