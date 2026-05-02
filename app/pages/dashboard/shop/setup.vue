<template>
  <DashboardShell sidebar-tone="dark">
    <template #sidebar>
      <ShopSidebarNav />
    </template>

    <div class="space-y-6">
      <DashboardTopBar
        eyebrow="Print shop"
        title="Quote-readiness setup"
        description="See exactly what your shop needs next so buyers can trust your profile and Printy can price real jobs."
      />

      <div class="rounded-3xl border border-[var(--p-border)] bg-[var(--p-surface)] p-6">
        <div class="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div class="max-w-2xl space-y-2">
            <p class="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--p-primary)]">Readiness summary</p>
            <h2 class="text-2xl font-semibold text-[var(--p-text)]">Know what to finish before buyers send requests</h2>
            <p class="text-sm leading-6 text-[var(--p-text-muted)]">
              Buyers use this to decide whether your shop looks trustworthy before sending a request. Printy uses your rate card to match and price work.
            </p>
          </div>
          <button
            type="button"
            class="inline-flex items-center justify-center rounded-xl border border-[var(--p-border)] px-4 py-2 text-sm font-semibold text-[var(--p-text)] transition hover:bg-[var(--p-bg-soft)]"
            :disabled="loading"
            @click="loadStatus"
          >
            Refresh status
          </button>
        </div>
      </div>

      <div v-if="loading" class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div v-for="i in 4" :key="i" class="h-32 animate-pulse rounded-3xl bg-[var(--p-surface)]" />
      </div>

      <div
        v-else-if="loadError"
        class="rounded-3xl border border-[var(--p-error)]/30 bg-[var(--p-error-soft)] px-5 py-4 text-sm text-[var(--p-error)]"
      >
        <p class="font-semibold">Could not load setup status.</p>
        <p class="mt-1">{{ loadError }}</p>
        <button class="mt-3 text-xs font-semibold underline" type="button" @click="loadStatus">Retry</button>
      </div>

      <template v-else-if="status">
        <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <section
            v-for="card in summaryCards"
            :key="card.title"
            class="rounded-3xl border border-[var(--p-border)] bg-[var(--p-surface)] p-5"
          >
            <p class="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--p-text-muted)]">{{ card.title }}</p>
            <p class="mt-3 text-2xl font-semibold text-[var(--p-text)]">{{ card.value }}</p>
            <p class="mt-2 text-sm leading-6 text-[var(--p-text-muted)]">{{ card.detail }}</p>
          </section>
        </div>

        <div class="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
          <section class="rounded-3xl border border-[var(--p-border)] bg-[var(--p-surface)] p-6">
            <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div class="space-y-1">
                <p class="text-sm font-semibold text-[var(--p-text)]">Next best action</p>
                <p class="text-sm text-[var(--p-text-muted)]">
                  {{ nextActionText }}
                </p>
              </div>
              <NuxtLink
                :to="status.next_url"
                class="inline-flex items-center justify-center rounded-xl bg-[var(--p-primary)] px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
              >
                {{ nextActionLabel }}
              </NuxtLink>
            </div>

            <div class="mt-6 h-3 overflow-hidden rounded-full bg-[var(--p-bg-soft)]">
              <div class="h-full rounded-full bg-[var(--p-primary)] transition-all duration-500" :style="{ width: `${status.setup_percent ?? 0}%` }" />
            </div>
            <div class="mt-3 flex flex-wrap gap-3 text-sm text-[var(--p-text-muted)]">
              <span>{{ status.setup_percent ?? 0 }}% overall readiness</span>
              <span>{{ status.completed_steps.length }} of {{ totalSteps }} checklist items ready</span>
            </div>

            <div class="mt-6 grid gap-3 sm:grid-cols-2">
              <div
                v-for="item in readinessBadges"
                :key="item.label"
                class="rounded-2xl border px-4 py-3"
                :class="item.ready ? 'border-green-500/20 bg-green-500/5' : 'border-[var(--p-border)] bg-[var(--p-bg-soft)]'"
              >
                <p class="text-sm font-semibold text-[var(--p-text)]">{{ item.label }}</p>
                <p class="mt-1 text-sm text-[var(--p-text-muted)]">{{ item.detail }}</p>
              </div>
            </div>
          </section>

          <section class="rounded-3xl border border-[var(--p-border)] bg-[var(--p-surface)] p-6">
            <div class="space-y-1">
              <p class="text-sm font-semibold text-[var(--p-text)]">Rate-card completeness</p>
              <p class="text-sm text-[var(--p-text-muted)]">Products are optional. Your rate card is what powers matching and quoting.</p>
            </div>
            <p class="mt-4 text-3xl font-semibold text-[var(--p-text)]">{{ status.rate_card_completeness ?? 0 }}%</p>

            <div class="mt-5 space-y-3">
              <div
                v-for="item in rateCardItems"
                :key="item.key"
                class="rounded-2xl border border-[var(--p-border)] bg-[var(--p-bg-soft)] p-4"
              >
                <div class="flex items-start justify-between gap-3">
                  <div>
                    <p class="text-sm font-semibold text-[var(--p-text)]">{{ item.label }}</p>
                    <p class="mt-1 text-sm text-[var(--p-text-muted)]">{{ item.detail }}</p>
                  </div>
                  <span
                    class="rounded-full px-2.5 py-1 text-xs font-semibold"
                    :class="item.ready ? 'bg-green-500/10 text-green-700' : 'bg-amber-500/10 text-amber-700'"
                  >
                    {{ item.ready ? 'Ready' : 'Needs action' }}
                  </span>
                </div>
                <NuxtLink
                  :to="item.url"
                  class="mt-3 inline-flex text-xs font-semibold text-[var(--p-primary)] underline-offset-2 hover:underline"
                >
                  {{ item.cta }}
                </NuxtLink>
              </div>
            </div>
          </section>
        </div>

        <div class="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
          <section class="rounded-3xl border border-[var(--p-border)] bg-[var(--p-surface)] p-6">
            <div class="space-y-1">
              <p class="text-sm font-semibold text-[var(--p-text)]">Setup checklist</p>
              <p class="text-sm text-[var(--p-text-muted)]">Each item links straight to the page where you can fix it.</p>
            </div>

            <div class="mt-5 space-y-3">
              <article
                v-for="step in status.steps ?? []"
                :key="step.key"
                class="rounded-2xl border p-4"
                :class="step.done ? 'border-green-500/20 bg-green-500/5' : step.key === status.next_step ? 'border-[var(--p-primary)]/25 bg-[var(--p-primary)]/5' : 'border-[var(--p-border)] bg-[var(--p-bg-soft)]'"
              >
                <div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div class="flex items-start gap-3">
                    <span
                      class="mt-0.5 inline-flex size-6 items-center justify-center rounded-full text-xs font-semibold"
                      :class="step.done ? 'bg-green-600 text-white' : 'bg-[var(--p-surface)] text-[var(--p-text-muted)] ring-1 ring-inset ring-[var(--p-border)]'"
                    >
                      <Icon :name="step.done ? 'lucide:check' : 'lucide:arrow-right'" class="size-3.5" />
                    </span>
                    <div class="space-y-1">
                      <div class="flex flex-wrap items-center gap-2">
                        <p class="text-sm font-semibold text-[var(--p-text)]">{{ step.label }}</p>
                        <span
                          class="rounded-full px-2.5 py-1 text-xs font-semibold"
                          :class="step.done ? 'bg-green-500/10 text-green-700' : step.key === status.next_step ? 'bg-[var(--p-primary)]/10 text-[var(--p-primary)]' : 'bg-amber-500/10 text-amber-700'"
                        >
                          {{ step.done ? 'Ready' : step.key === status.next_step ? 'Do this next' : 'Pending' }}
                        </span>
                      </div>
                      <p class="text-sm text-[var(--p-text-muted)]">
                        {{ step.done ? 'This part of your setup is already in place.' : step.blocking_reason }}
                      </p>
                    </div>
                  </div>
                  <NuxtLink
                    :to="step.cta_url"
                    class="inline-flex shrink-0 items-center justify-center rounded-xl border px-4 py-2 text-sm font-semibold transition"
                    :class="step.done ? 'border-[var(--p-border)] text-[var(--p-text)] hover:bg-[var(--p-bg-soft)]' : 'border-[var(--p-primary)] bg-[var(--p-primary)] text-white hover:opacity-90'"
                  >
                    {{ step.cta_label }}
                  </NuxtLink>
                </div>
              </article>
            </div>
          </section>

          <section class="space-y-4">
            <div
              v-if="status.warnings?.length"
              class="rounded-3xl border border-amber-400/30 bg-amber-50 p-5 text-sm text-amber-900"
            >
              <p class="font-semibold">Heads up</p>
              <div class="mt-3 space-y-2">
                <p v-for="warning in status.warnings" :key="warning">{{ warning }}</p>
              </div>
            </div>

            <div class="rounded-3xl border border-[var(--p-border)] bg-[var(--p-surface)] p-5">
              <p class="text-sm font-semibold text-[var(--p-text)]">Recommended improvements</p>
              <div class="mt-4 space-y-3">
                <div
                  v-for="item in recommendationsWithLinks"
                  :key="`${item.text}-${item.url}`"
                  class="rounded-2xl border border-[var(--p-border)] bg-[var(--p-bg-soft)] p-4"
                >
                  <p class="text-sm text-[var(--p-text-muted)]">{{ item.text }}</p>
                  <NuxtLink :to="item.url" class="mt-2 inline-flex text-xs font-semibold text-[var(--p-primary)] underline-offset-2 hover:underline">
                    {{ item.label }}
                  </NuxtLink>
                </div>
                <p v-if="!recommendationsWithLinks.length" class="text-sm text-[var(--p-text-muted)]">
                  Your setup guidance is clear. Refresh after any rate-card changes if you want to confirm readiness again.
                </p>
              </div>
            </div>
          </section>
        </div>
      </template>
    </div>
  </DashboardShell>
</template>

<script setup lang="ts">
import DashboardShell from '~/components/dashboard/shared/DashboardShell.vue'
import DashboardTopBar from '~/components/dashboard/shared/DashboardTopBar.vue'
import ShopSidebarNav from '~/components/dashboard/shop/ShopSidebarNav.vue'
import { useSetupStatusStore } from '~/stores/setupStatus'
import { useShopStore } from '~/stores/shop'

definePageMeta({ layout: 'dashboard' })

type SetupStep = {
  key: string
  label: string
  done: boolean
  accessible: boolean
  cta_label: string
  cta_url: string
  blocking_reason: string
}

const shopStore = useShopStore()
const setupStatusStore = useSetupStatusStore()

const shopSlug = computed(() => shopStore.selectedShopSlug)
const status = computed(() => setupStatusStore.status)
const loading = ref(false)
const loadError = ref('')

const totalSteps = computed(() => status.value?.steps?.length ?? 6)

const summaryCards = computed(() => {
  const current = status.value
  if (!current) return []

  return [
    {
      title: 'Overall readiness',
      value: `${current.setup_percent ?? 0}%`,
      detail: current.shop_profile_complete
        ? 'Your trust details are in place.'
        : 'Profile details still need attention before buyers see a complete shop.',
    },
    {
      title: 'Rate card',
      value: `${current.rate_card_completeness ?? 0}%`,
      detail: `${current.materials_count ?? 0} material entries, ${current.pricing_rules_count ?? 0} pricing rules, ${current.finishing_rates_count ?? 0} finishing rates.`,
    },
    {
      title: 'Buyer requests',
      value: current.can_receive_requests ? 'Enabled' : 'Not yet',
      detail: current.can_receive_requests
        ? 'Buyers can send requests to this shop.'
        : 'Publish your shop and keep request settings enabled to receive buyer requests.',
    },
    {
      title: 'Instant pricing',
      value: current.can_price_requests ? 'Ready' : 'Needs setup',
      detail: current.can_price_requests
        ? 'Printy can price matched jobs from your current rate card.'
        : 'Add papers and pricing rules so matched jobs can be estimated accurately.',
    },
  ]
})

const readinessBadges = computed(() => {
  const current = status.value
  if (!current) return []

  return [
    {
      label: 'Public shop details',
      ready: Boolean(current.shop_profile_complete),
      detail: current.shop_profile_complete ? 'Where buyers can find you is already clear.' : 'Complete your profile so buyers trust your shop.',
    },
    {
      label: 'Turnaround guidance',
      ready: Boolean(current.turnaround_configured),
      detail: current.turnaround_configured ? 'How fast you usually respond is already visible.' : 'Add a turnaround statement so buyers know what to expect.',
    },
    {
      label: 'Published visibility',
      ready: Boolean(current.shop_published),
      detail: current.shop_published ? 'Your shop can appear publicly.' : 'Publish your shop when you are ready for buyer traffic.',
    },
    {
      label: 'Request handling',
      ready: Boolean(current.can_receive_requests),
      detail: current.can_receive_requests ? 'Requests can reach your shop.' : 'Requests stay off until your shop is published and request support is enabled.',
    },
  ]
})

const rateCardItems = computed(() => {
  const current = status.value
  if (!current) return []

  return [
    {
      key: 'materials',
      label: 'Papers and materials',
      ready: Boolean(current.has_materials),
      detail: current.has_materials
        ? `${current.materials_count ?? 0} active entries available for matching.`
        : 'Add papers so Printy can match your shop to real jobs.',
      url: '/dashboard/shop/materials',
      cta: 'Open materials',
    },
    {
      key: 'pricing',
      label: 'Pricing rules',
      ready: Boolean(current.has_pricing_rules),
      detail: current.has_pricing_rules
        ? `${current.pricing_rules_count ?? 0} active machine pricing rules available.`
        : 'Add pricing rules so buyers can see accurate estimates.',
      url: '/dashboard/shop/pricing',
      cta: 'Open pricing',
    },
    {
      key: 'finishing',
      label: 'Finishing rates',
      ready: Boolean(current.has_finishing_rates),
      detail: current.has_finishing_rates
        ? `${current.finishing_rates_count ?? 0} finishing rates are ready.`
        : 'Add finishing rates to reduce manual confirmation.',
      url: '/dashboard/shop/finishing',
      cta: 'Open finishing',
    },
    {
      key: 'turnaround',
      label: 'Turnaround communication',
      ready: Boolean(current.turnaround_configured),
      detail: current.turnaround_configured
        ? 'Buyers can already see how fast you usually respond.'
        : 'Add a turnaround statement so buyers know expected timing.',
      url: '/dashboard/shop/profile',
      cta: 'Open profile',
    },
  ]
})

const nextActionText = computed(() => status.value?.blocking_reason || 'Your next best action is ready below.')

const nextActionLabel = computed(() => {
  const currentStep = status.value?.steps?.find((step: SetupStep) => step.key === status.value?.next_step)
  return currentStep?.cta_label || 'Continue setup'
})

const recommendationLinkMap: Record<string, { url: string, label: string }> = {
  profile: { url: '/dashboard/shop/profile', label: 'Open profile' },
  materials: { url: '/dashboard/shop/materials', label: 'Open materials' },
  pricing: { url: '/dashboard/shop/pricing', label: 'Open pricing' },
  finishing: { url: '/dashboard/shop/finishing', label: 'Open finishing' },
  turnaround: { url: '/dashboard/shop/profile', label: 'Open profile' },
  publish: { url: '/dashboard/shop/profile', label: 'Open profile' },
}

const recommendationsWithLinks = computed(() => {
  const current = status.value
  if (!current) return []

  const stepsByKey = new Map((current.steps ?? []).map((step: SetupStep) => [step.key, step]))
  return (current.recommendations ?? []).map((text) => {
    const matchingKey = current.pending_steps.find((key) => {
      const step = stepsByKey.get(key)
      return step?.blocking_reason === text
    }) || current.next_step
    const fallback = recommendationLinkMap[matchingKey] || { url: current.next_url, label: 'Continue setup' }
    const step = stepsByKey.get(matchingKey)
    return {
      text,
      url: step?.cta_url || fallback.url,
      label: step?.cta_label || fallback.label,
    }
  })
})

async function loadStatus() {
  loading.value = true
  loadError.value = ''
  try {
    await setupStatusStore.fetchStatus(shopSlug.value)
  }
  catch (err: unknown) {
    loadError.value = err instanceof Error ? err.message : 'Failed to load setup status.'
  }
  finally {
    loading.value = false
  }
}

onMounted(loadStatus)
watch(shopSlug, loadStatus)
</script>
