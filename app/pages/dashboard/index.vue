<template>
  <div class="col-span-12 space-y-6 pb-2">
    <section class="relative overflow-hidden rounded-[34px] border border-white/12 bg-[linear-gradient(145deg,rgba(15,23,42,0.92),rgba(10,15,26,0.82))] p-6 shadow-[0_22px_80px_rgba(0,0,0,0.35)] backdrop-blur-2xl sm:p-7 lg:p-8">
      <div class="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(251,146,60,0.18),transparent_24%),radial-gradient(circle_at_80%_20%,rgba(59,130,246,0.12),transparent_24%),radial-gradient(circle_at_bottom_right,rgba(15,23,42,0.5),transparent_30%)]" />
      <div class="relative flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
        <div class="max-w-4xl space-y-4">
          <div class="flex flex-wrap items-center gap-2">
            <span class="inline-flex items-center gap-2 rounded-full border border-orange-400/25 bg-orange-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.28em] text-orange-200">
              <span class="h-2 w-2 rounded-full bg-orange-300" />
              Print Operations Hub
            </span>
            <span class="inline-flex items-center rounded-full border border-white/10 bg-white/[0.06] px-3 py-1 text-xs text-slate-300">
              {{ activeShop ? `Active shop: ${activeShop.name}` : 'No active shop yet' }}
            </span>
          </div>

          <div class="space-y-3">
            <h1 class="max-w-3xl text-3xl font-semibold tracking-tight text-white sm:text-4xl">{{ welcomeTitle }}</h1>
            <p class="max-w-3xl text-sm leading-7 text-slate-300 sm:text-base">{{ helperSubtitle }}</p>
          </div>

          <div class="grid gap-3 sm:grid-cols-3">
            <div class="rounded-[24px] border border-white/10 bg-white/[0.07] p-4 backdrop-blur-xl">
              <p class="text-[11px] uppercase tracking-[0.24em] text-slate-500">Readiness</p>
              <div class="mt-3 flex items-end justify-between gap-3">
                <div>
                  <p class="text-3xl font-semibold text-white">{{ readinessScore }}%</p>
                  <p class="mt-1 text-sm text-slate-300">{{ readinessLabel }}</p>
                </div>
                <UIcon name="i-lucide-gauge" class="h-5 w-5 text-orange-300" />
              </div>
            </div>

            <div class="rounded-[24px] border border-white/10 bg-white/[0.07] p-4 backdrop-blur-xl">
              <p class="text-[11px] uppercase tracking-[0.24em] text-slate-500">Next best step</p>
              <p class="mt-3 text-base font-semibold text-white">{{ nextStepLabel }}</p>
              <p class="mt-1 text-sm leading-6 text-slate-300">{{ nextStepDescription }}</p>
            </div>

            <div class="rounded-[24px] border border-white/10 bg-white/[0.07] p-4 backdrop-blur-xl">
              <p class="text-[11px] uppercase tracking-[0.24em] text-slate-500">Operational signal</p>
              <p class="mt-3 text-base font-semibold text-white">{{ operationalSignal.title }}</p>
              <p class="mt-1 text-sm leading-6 text-slate-300">{{ operationalSignal.description }}</p>
            </div>
          </div>
        </div>

        <div class="grid gap-3 sm:grid-cols-2 xl:w-[26rem]">
          <NuxtLink
            v-for="action in heroActions"
            :key="action.label"
            :to="action.to"
            class="rounded-[26px] border p-4 transition duration-200"
            :class="action.emphasis ? 'border-orange-400/30 bg-orange-500/[0.12] hover:bg-orange-500/[0.16]' : 'border-white/10 bg-white/[0.06] hover:border-white/15 hover:bg-white/[0.09]'"
          >
            <div class="flex items-start gap-3">
              <div class="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border"
                :class="action.emphasis ? 'border-orange-300/25 bg-orange-500/15 text-orange-100' : 'border-white/10 bg-white/10 text-slate-100'">
                <UIcon :name="action.icon" class="h-5 w-5" />
              </div>
              <div class="min-w-0">
                <p class="text-sm font-semibold text-white">{{ action.label }}</p>
                <p class="mt-1 text-sm leading-6 text-slate-300">{{ action.description }}</p>
              </div>
            </div>
          </NuxtLink>
        </div>
      </div>
    </section>

    <section class="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
      <article v-for="metric in kpiCards" :key="metric.label" class="rounded-[28px] border border-white/10 bg-white/[0.06] p-5 shadow-[0_16px_50px_rgba(0,0,0,0.18)] backdrop-blur-xl">
        <div class="flex items-start justify-between gap-3">
          <div class="space-y-1">
            <p class="text-[11px] uppercase tracking-[0.26em] text-slate-500">{{ metric.label }}</p>
            <p class="text-3xl font-semibold text-white">{{ metric.value }}</p>
          </div>
          <div class="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/10">
            <UIcon :name="metric.icon" class="h-5 w-5" :class="metric.iconClass" />
          </div>
        </div>
        <p class="mt-4 text-sm leading-6 text-slate-300">{{ metric.description }}</p>
      </article>
    </section>

    <div class="grid gap-6 xl:grid-cols-[1.45fr_1fr]">
      <div class="space-y-6">
        <DashboardFormSection title="Setup Checklist" description="Finish the core setup once so quoting, stock decisions, and routing reflect what your print shop can actually produce.">
          <template #actions>
            <UButton :to="nextStepRoute" color="primary" variant="soft" class="justify-center">
              <UIcon name="i-lucide-arrow-up-right" class="mr-2 h-4 w-4" />
              Continue setup
            </UButton>
          </template>

          <div class="grid gap-3">
            <div v-for="item in checklist" :key="item.label" class="rounded-[26px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.04))] p-4 backdrop-blur-xl">
              <div class="flex items-start gap-3">
                <div class="mt-0.5 flex h-11 w-11 items-center justify-center rounded-2xl border"
                  :class="item.done ? 'border-emerald-400/25 bg-emerald-500/12 text-emerald-200' : 'border-orange-400/20 bg-orange-500/10 text-orange-200'">
                  <UIcon :name="item.done ? 'i-lucide-check' : item.icon" class="h-5 w-5" />
                </div>
                <div class="min-w-0 flex-1">
                  <div class="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p class="text-sm font-semibold text-white">{{ item.label }}</p>
                      <p class="mt-1 text-sm leading-6 text-slate-300">{{ item.description }}</p>
                    </div>
                    <UBadge :color="item.done ? 'success' : 'warning'" variant="soft" size="sm">{{ item.done ? 'Complete' : 'Pending' }}</UBadge>
                  </div>
                  <div class="mt-3 flex flex-wrap items-center gap-3">
                    <NuxtLink v-if="!item.done" :to="item.to" class="inline-flex items-center gap-2 text-sm font-medium text-orange-200 transition hover:text-orange-100">
                      {{ item.action }}
                      <UIcon name="i-lucide-arrow-right" class="h-4 w-4" />
                    </NuxtLink>
                    <span v-else class="text-sm text-emerald-200/90">{{ item.completeNote }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </DashboardFormSection>

        <div class="grid gap-6 lg:grid-cols-2">
          <DashboardFormSection title="Quick Actions" description="Operational shortcuts for the next few minutes, not generic admin links.">
            <div class="grid gap-3">
              <NuxtLink v-for="action in quickActions" :key="action.label" :to="action.to" class="rounded-[24px] border border-white/10 bg-white/[0.06] p-4 transition hover:border-orange-300/30 hover:bg-orange-500/10">
                <div class="flex items-start gap-3">
                  <div class="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-orange-400/20 bg-orange-500/10">
                    <UIcon :name="action.icon" class="h-5 w-5 text-orange-200" />
                  </div>
                  <div class="min-w-0">
                    <p class="text-sm font-semibold text-white">{{ action.label }}</p>
                    <p class="mt-1 text-sm leading-6 text-slate-300">{{ action.description }}</p>
                  </div>
                </div>
              </NuxtLink>
            </div>
          </DashboardFormSection>

          <DashboardFormSection title="Guidance Cards" description="Short operational guidance based on what is configured right now.">
            <div class="space-y-3">
              <DashboardInfoCard v-for="card in guidanceCards" :key="card.title" :title="card.title" :description="card.description" :icon="card.icon" :tone="card.tone" />
            </div>
          </DashboardFormSection>
        </div>
      </div>

      <div class="space-y-6">
        <DashboardFormSection title="Recent Activity" description="Latest visible records in the active shop so you can confirm setup is moving in the right direction.">
          <div v-if="recentItems.length" class="space-y-3">
            <article v-for="item in recentItems" :key="`${item.type}-${item.id}`" class="rounded-[24px] border border-white/10 bg-white/[0.06] p-4 backdrop-blur-xl">
              <div class="flex items-start justify-between gap-3">
                <div>
                  <p class="text-sm font-semibold text-white">{{ item.title }}</p>
                  <p class="mt-1 text-[11px] uppercase tracking-[0.24em] text-slate-500">{{ item.caption }}</p>
                </div>
                <div class="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/10">
                  <UIcon :name="item.icon" class="h-4 w-4 text-orange-200" />
                </div>
              </div>
              <p class="mt-3 text-sm leading-6 text-slate-300">{{ item.description }}</p>
            </article>
          </div>
          <DashboardEmptyStateCard v-else title="Nothing has moved through this workspace yet" description="Start with a shop, then add one machine and one product. Once setup records exist, this panel becomes a fast sanity check before you quote live jobs." icon="i-lucide-activity">
            <UButton :to="nextStepRoute" color="primary" class="justify-center">{{ nextStepAction }}</UButton>
          </DashboardEmptyStateCard>
        </DashboardFormSection>

        <DashboardFormSection title="Workspace Pulse" description="A believable operational read on how prepared this workspace is for day-to-day print work.">
          <div class="space-y-3">
            <div v-for="signal in workspaceSignals" :key="signal.label" class="rounded-[24px] border border-white/10 bg-white/[0.06] p-4 backdrop-blur-xl">
              <div class="flex items-center justify-between gap-3">
                <div>
                  <p class="text-sm font-semibold text-white">{{ signal.label }}</p>
                  <p class="mt-1 text-sm leading-6 text-slate-300">{{ signal.description }}</p>
                </div>
                <UBadge :color="signal.badgeColor" variant="soft" size="sm">{{ signal.badge }}</UBadge>
              </div>
            </div>
          </div>
        </DashboardFormSection>

        <DashboardFormSection title="Attention Needed" description="Empty states should still be useful. This block calls out the operational gaps that matter most.">
          <div v-if="attentionCards.length" class="space-y-3">
            <div v-for="card in attentionCards" :key="card.title" class="rounded-[24px] border border-orange-400/20 bg-orange-500/[0.08] p-4 backdrop-blur-xl">
              <div class="flex items-start gap-3">
                <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-orange-400/20 bg-orange-500/12">
                  <UIcon :name="card.icon" class="h-4 w-4 text-orange-200" />
                </div>
                <div class="min-w-0 flex-1">
                  <p class="text-sm font-semibold text-white">{{ card.title }}</p>
                  <p class="mt-1 text-sm leading-6 text-slate-300">{{ card.description }}</p>
                  <NuxtLink :to="card.to" class="mt-3 inline-flex items-center gap-2 text-sm font-medium text-orange-200 hover:text-orange-100">
                    {{ card.action }}
                    <UIcon name="i-lucide-arrow-right" class="h-4 w-4" />
                  </NuxtLink>
                </div>
              </div>
            </div>
          </div>
          <DashboardEmptyStateCard v-else title="Core setup is in place" description="This workspace has the basics covered. The next useful move is refining price coverage, publishing more products, or tightening stock controls." icon="i-lucide-badge-check">
            <UButton to="/dashboard/pricing" color="primary" variant="soft" class="justify-center">Review pricing</UButton>
          </DashboardEmptyStateCard>
        </DashboardFormSection>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  listFinishingRatesBySlug,
  listMachinesBySlug,
  listMaterialsBySlug,
  listPapersBySlug,
  listProductsBySlug,
  type FinishingRate,
  type Machine,
  type Material,
  type Paper,
  type Product,
} from '~/services/seller'
import { useSetupStatus } from '~/composables/useSetupStatus'
import { useAuthStore } from '~/stores/auth'
import { useSellerStore } from '~/stores/seller'

definePageMeta({
  layout: 'dashboard',
  middleware: ['auth', 'setup-guard'],
})

const authStore = useAuthStore()
const sellerStore = useSellerStore()
const { refresh: refreshSetup } = useSetupStatus()

const machines = ref<Machine[]>([])
const papers = ref<Paper[]>([])
const products = ref<Product[]>([])
const materials = ref<Material[]>([])
const finishingRates = ref<FinishingRate[]>([])

const activeShop = computed(() => sellerStore.shops[0] ?? null)
const firstName = computed(() => authStore.user?.name?.trim()?.split(' ')[0] ?? '')
const activeMachineCount = computed(() => machines.value.filter(machine => machine.is_active !== false).length)
const inStockPaperCount = computed(() => papers.value.filter(paper => (paper.quantity_in_stock ?? 0) > 0).length)
const lowStockPaperCount = computed(() => papers.value.filter((paper) => {
  if (paper.quantity_in_stock == null || paper.reorder_level == null) return false
  return paper.quantity_in_stock <= paper.reorder_level
}).length)
const publishedProductCount = computed(() => products.value.filter(product => product.status === 'published' || product.is_active).length)
const activeFinishingCount = computed(() => finishingRates.value.filter(rate => rate.is_active !== false).length)
const activeMaterialCount = computed(() => materials.value.filter(material => material.is_active !== false).length)

const welcomeTitle = computed(() => {
  if (firstName.value && activeShop.value) return `Welcome back, ${firstName.value}. ${activeShop.value.name} is your production desk today.`
  if (firstName.value) return `Welcome back, ${firstName.value}. Let's get your print operation production-ready.`
  if (activeShop.value) return `${activeShop.value.name} is your production desk today.`
  return 'Build a print operation dashboard that feels ready for live work.'
})

const helperSubtitle = computed(() => {
  if (!sellerStore.shops.length) {
    return 'Start by registering your print business, then connect machines, parent sheets, products, and pricing so every quote has real operational logic behind it.'
  }
  if (!activeMachineCount.value || !products.value.length) {
    return 'This dashboard should answer a practical question immediately: can this shop quote and route real jobs today? Finish the missing setup blocks below to get there.'
  }
  return 'Track the basics that matter most for a working print shop: equipment readiness, stock coverage, product availability, and the next setup gaps likely to slow down quoting.'
})

const readinessChecks = computed(() => ([
  sellerStore.shops.length > 0,
  activeMachineCount.value > 0,
  papers.value.length > 0,
  products.value.length > 0,
  activeMaterialCount.value > 0,
  activeFinishingCount.value > 0,
]))

const readinessScore = computed(() => Math.round((readinessChecks.value.filter(Boolean).length / readinessChecks.value.length) * 100))

const readinessLabel = computed(() => {
  if (readinessScore.value >= 84) return 'Strong production base'
  if (readinessScore.value >= 50) return 'Usable, but setup gaps remain'
  return 'Early setup stage'
})

const nextStepRoute = computed(() => {
  if (!sellerStore.shops.length) return '/dashboard/shops/create'
  if (!activeMachineCount.value) return activeShop.value ? `/dashboard/shops/${activeShop.value.slug}/machines` : '/dashboard/machines'
  if (!papers.value.length) return '/dashboard/papers'
  if (!products.value.length) return activeShop.value ? `/dashboard/shops/${activeShop.value.slug}/products/create` : '/dashboard/products'
  if (!activeMaterialCount.value) return activeShop.value ? `/dashboard/shops/${activeShop.value.slug}/materials` : '/dashboard/materials'
  if (!activeFinishingCount.value) return '/dashboard/finishing'
  return '/dashboard/pricing'
})

const nextStepLabel = computed(() => {
  if (!sellerStore.shops.length) return 'Register your first shop'
  if (!activeMachineCount.value) return 'Add at least one machine'
  if (!papers.value.length) return 'Define parent sheet stock'
  if (!products.value.length) return 'Create your first product'
  if (!activeMaterialCount.value) return 'Add billable materials'
  if (!activeFinishingCount.value) return 'Configure finishing services'
  return 'Tighten pricing coverage'
})

const nextStepDescription = computed(() => {
  if (!sellerStore.shops.length) return 'Nothing else matters until the workspace exists.'
  if (!activeMachineCount.value) return 'Machines unlock realistic sheet limits, costing, and routing.'
  if (!papers.value.length) return 'Paper setup gives quoting a real parent sheet to work from.'
  if (!products.value.length) return 'Products turn raw setup into sellable print jobs.'
  if (!activeMaterialCount.value) return 'Materials help capture extras like lamination, vinyl, or adhesive costs.'
  if (!activeFinishingCount.value) return 'Finishing rates make post-press costs operational instead of manual.'
  return 'Your core setup exists. Refine pricing before you scale product coverage.'
})

const nextStepAction = computed(() => {
  if (!sellerStore.shops.length) return 'Register shop'
  if (!activeMachineCount.value) return 'Add machine'
  if (!papers.value.length) return 'Add papers'
  if (!products.value.length) return 'Create product'
  if (!activeMaterialCount.value) return 'Add materials'
  if (!activeFinishingCount.value) return 'Add finishing'
  return 'Review pricing'
})

const operationalSignal = computed(() => {
  if (!sellerStore.shops.length) {
    return {
      title: 'Workspace not opened yet',
      description: 'Create the first shop so Printy can attach stock, machines, products, and pricing to a real business.',
    }
  }
  if (readinessScore.value < 50) {
    return {
      title: 'Setup is still blocking live quoting',
      description: 'The basics are not fully connected yet, so pricing and routing will still require too many manual checks.',
    }
  }
  if (lowStockPaperCount.value > 0) {
    return {
      title: `${lowStockPaperCount.value} paper line${lowStockPaperCount.value === 1 ? '' : 's'} need stock attention`,
      description: 'Low stock does not stop setup, but it can break fulfillment confidence once orders start landing.',
    }
  }
  return {
    title: 'Core production logic looks usable',
    description: 'The shop has enough structure to support believable quotes and product setup without feeling like a placeholder workspace.',
  }
})

const heroActions = computed(() => {
  const machineRoute = activeShop.value ? `/dashboard/shops/${activeShop.value.slug}/machines` : '/dashboard/machines'
  const productRoute = activeShop.value ? `/dashboard/shops/${activeShop.value.slug}/products/create` : '/dashboard/products'

  return [
    { label: 'Register shop', description: 'Create or add another print location with its own setup.', to: '/dashboard/shops/create', icon: 'i-lucide-store', emphasis: !sellerStore.shops.length },
    { label: 'Add machine', description: 'Capture real equipment before pricing more jobs.', to: machineRoute, icon: 'i-lucide-printer', emphasis: !activeMachineCount.value },
    { label: 'Create product', description: 'Turn production rules into something your team can sell.', to: productRoute, icon: 'i-lucide-package', emphasis: !products.value.length },
    { label: 'Review pricing', description: 'Check paper, finishing, and rate coverage for quoting.', to: '/dashboard/pricing', icon: 'i-lucide-wallet', emphasis: false },
  ]
})

const kpiCards = computed(() => [
  {
    label: 'Live Shops',
    value: sellerStore.shops.length,
    icon: 'i-lucide-store',
    iconClass: 'text-orange-200',
    description: sellerStore.shops.length ? `${sellerStore.shops.length} workspace${sellerStore.shops.length === 1 ? '' : 's'} connected to your seller account.` : 'No shop workspace exists yet.',
  },
  {
    label: 'Active Machines',
    value: activeMachineCount.value,
    icon: 'i-lucide-printer',
    iconClass: 'text-sky-200',
    description: activeMachineCount.value ? 'Equipment is available for routing and production planning.' : 'Add at least one machine to anchor real production limits.',
  },
  {
    label: 'Product Catalog',
    value: publishedProductCount.value,
    icon: 'i-lucide-package',
    iconClass: 'text-emerald-200',
    description: publishedProductCount.value ? 'Products are available to structure quoting around real outputs.' : 'No usable products exist yet.',
  },
  {
    label: 'Stock Papers',
    value: inStockPaperCount.value,
    icon: 'i-lucide-file-stack',
    iconClass: 'text-amber-200',
    description: papers.value.length ? `${lowStockPaperCount.value} low-stock paper line${lowStockPaperCount.value === 1 ? '' : 's'} flagged.` : 'No parent sheet stock has been added yet.',
  },
  {
    label: 'Post-Press Coverage',
    value: activeFinishingCount.value,
    icon: 'i-lucide-scissors',
    iconClass: 'text-rose-200',
    description: activeFinishingCount.value ? `${activeMaterialCount.value} active material line${activeMaterialCount.value === 1 ? '' : 's'} supporting extra job costs.` : 'Finishing services are still manual.',
  },
])

const checklist = computed(() => {
  const machineRoute = activeShop.value ? `/dashboard/shops/${activeShop.value.slug}/machines` : '/dashboard/machines'
  const productRoute = activeShop.value ? `/dashboard/shops/${activeShop.value.slug}/products/create` : '/dashboard/products'
  const materialRoute = activeShop.value ? `/dashboard/shops/${activeShop.value.slug}/materials` : '/dashboard/materials'

  return [
    {
      label: 'Register a shop workspace',
      description: 'A shop is the operational container for pricing, stock, products, and customer-facing setup.',
      done: sellerStore.shops.length > 0,
      to: '/dashboard/shops/create',
      action: 'Create shop',
      icon: 'i-lucide-store',
      completeNote: `${sellerStore.shops.length} shop workspace${sellerStore.shops.length === 1 ? '' : 's'} connected.`,
    },
    {
      label: 'Connect production machines',
      description: 'Machines define what sheet sizes, runs, and production plans are realistic.',
      done: activeMachineCount.value > 0,
      to: machineRoute,
      action: 'Add machine',
      icon: 'i-lucide-printer',
      completeNote: `${activeMachineCount.value} active machine${activeMachineCount.value === 1 ? '' : 's'} configured.`,
    },
    {
      label: 'Define parent sheet stock',
      description: 'Stock papers such as SRA3 or A3 help products estimate fit count and sheet usage more reliably.',
      done: papers.value.length > 0,
      to: '/dashboard/papers',
      action: 'Add papers',
      icon: 'i-lucide-file-stack',
      completeNote: `${papers.value.length} paper line${papers.value.length === 1 ? '' : 's'} available.`,
    },
    {
      label: 'Create sellable products',
      description: 'Products tie sizes, sides, stock rules, and machine assumptions into repeatable job setups.',
      done: products.value.length > 0,
      to: productRoute,
      action: 'Create product',
      icon: 'i-lucide-package',
      completeNote: `${products.value.length} product${products.value.length === 1 ? '' : 's'} configured.`,
    },
    {
      label: 'Attach materials and finishing',
      description: 'Materials and finishing rates move extras like lamination, eyelets, cutting, or binding out of guesswork.',
      done: activeMaterialCount.value > 0 || activeFinishingCount.value > 0,
      to: materialRoute,
      action: 'Add materials',
      icon: 'i-lucide-layers',
      completeNote: `${activeMaterialCount.value + activeFinishingCount.value} material/finishing line${activeMaterialCount.value + activeFinishingCount.value === 1 ? '' : 's'} configured.`,
    },
  ]
})

const quickActions = computed(() => {
  const shopSlug = activeShop.value?.slug
  return [
    { label: 'Open shop setup', description: 'Review business details, hours, and workspace settings for the active shop.', to: shopSlug ? `/dashboard/shops/${shopSlug}` : '/dashboard/shops', icon: 'i-lucide-store' },
    { label: 'Add another paper stock', description: 'Useful when you need a new parent sheet, GSM range, or supplier line.', to: '/dashboard/papers', icon: 'i-lucide-plus-circle' },
    { label: 'Review machine coverage', description: 'Check whether the current machine list matches the jobs you want to quote.', to: shopSlug ? `/dashboard/shops/${shopSlug}/machines` : '/dashboard/machines', icon: 'i-lucide-settings-2' },
    { label: 'Expand product range', description: 'Add another repeatable product instead of calculating the next job from scratch.', to: shopSlug ? `/dashboard/shops/${shopSlug}/products/create` : '/dashboard/products', icon: 'i-lucide-package' },
  ]
})

const guidanceCards = computed(() => [
  {
    title: 'Machine readiness',
    description: activeMachineCount.value ? 'Your machine list exists. Keep max sheet sizes and GSM limits accurate so impossible jobs are rejected before pricing gets messy.' : 'No machines are configured yet. Add the press or printer you rely on most often first.',
    icon: 'i-lucide-cog',
    tone: 'blue' as const,
  },
  {
    title: 'Paper logic',
    description: papers.value.length ? 'Paper stock is present. Confirm the parent sheets you actually buy most often, not just the finished sizes customers ask for.' : 'No stock papers yet. Start with the parent sheet sizes your team pulls most often for common jobs.',
    icon: 'i-lucide-file-stack',
    tone: 'green' as const,
  },
  {
    title: 'Product reliability',
    description: products.value.length ? 'Products are configured. Review default sides, sheet sizes, and turnaround assumptions so quotes stay believable.' : 'Without products, every quote becomes a custom exception. Create your highest-frequency items first.',
    icon: 'i-lucide-box',
    tone: 'orange' as const,
  },
])

const recentItems = computed(() => {
  const latestShops = [...sellerStore.shops].slice(-1).reverse().map(shop => ({
    type: 'shop',
    id: shop.id,
    title: shop.name,
    caption: 'Shop workspace',
    description: 'Business workspace is available for machines, stock, pricing, and customer-facing setup.',
    icon: 'i-lucide-store',
  }))

  const latestMachines = [...machines.value].slice(-2).reverse().map(machine => ({
    type: 'machine',
    id: machine.id,
    title: machine.name,
    caption: 'Machine',
    description: `${machine.machine_type || 'Production machine'} is now part of routing and capability planning.`,
    icon: 'i-lucide-printer',
  }))

  const latestProducts = [...products.value].slice(-2).reverse().map(product => ({
    type: 'product',
    id: product.id,
    title: product.name,
    caption: 'Product',
    description: product.default_sheet_size ? `Defaults to ${product.default_sheet_size} for parent-sheet planning and faster quote setup.` : 'Ready for final paper, size, and finishing refinement.',
    icon: 'i-lucide-package',
  }))

  const latestPapers = [...papers.value].slice(-1).reverse().map(paper => ({
    type: 'paper',
    id: paper.id,
    title: `${paper.sheet_size} ${paper.gsm}gsm`,
    caption: 'Paper stock',
    description: paper.paper_type ? `${paper.paper_type} is available for costing and stock planning.` : 'Paper stock is connected to the active shop.',
    icon: 'i-lucide-file-stack',
  }))

  return [...latestShops, ...latestMachines, ...latestProducts, ...latestPapers].slice(0, 5)
})

const workspaceSignals = computed(() => [
  {
    label: 'Quoting foundation',
    description: products.value.length && activeMachineCount.value && papers.value.length ? 'Products, machines, and parent sheet stock are all present, which is enough to make quotes feel grounded.' : 'One or more core blocks are missing, so quoting still depends on manual judgement.',
    badge: products.value.length && activeMachineCount.value && papers.value.length ? 'Usable' : 'Blocked',
    badgeColor: products.value.length && activeMachineCount.value && papers.value.length ? 'success' as const : 'warning' as const,
  },
  {
    label: 'Stock awareness',
    description: papers.value.length ? (lowStockPaperCount.value ? `${lowStockPaperCount.value} paper line${lowStockPaperCount.value === 1 ? '' : 's'} have hit or fallen below reorder level.` : 'Paper stock exists and no visible reorder flags are triggered.') : 'No paper stock exists yet, so sheet-based costing has weak footing.',
    badge: papers.value.length ? (lowStockPaperCount.value ? 'Review' : 'Stable') : 'Missing',
    badgeColor: papers.value.length ? (lowStockPaperCount.value ? 'warning' as const : 'success' as const) : 'warning' as const,
  },
  {
    label: 'Post-press coverage',
    description: activeFinishingCount.value ? `${activeFinishingCount.value} finishing service${activeFinishingCount.value === 1 ? '' : 's'} configured for operational pricing.` : 'Finishing is not priced yet, so some jobs will still require manual overrides.',
    badge: activeFinishingCount.value ? 'Configured' : 'Manual',
    badgeColor: activeFinishingCount.value ? 'success' as const : 'warning' as const,
  },
])

const attentionCards = computed(() => {
  const cards = []
  const shopSlug = activeShop.value?.slug

  if (!sellerStore.shops.length) {
    cards.push({
      title: 'No shop workspace exists',
      description: 'Create the first shop before you spend time on pricing or products. It is the anchor for the rest of the dashboard.',
      action: 'Create shop',
      to: '/dashboard/shops/create',
      icon: 'i-lucide-store',
    })
  }

  if (sellerStore.shops.length && !activeMachineCount.value) {
    cards.push({
      title: 'No production machine is active',
      description: 'Without a machine, your products and pricing cannot reflect real capacity, maximum sheet size, or routing logic.',
      action: 'Add machine',
      to: shopSlug ? `/dashboard/shops/${shopSlug}/machines` : '/dashboard/machines',
      icon: 'i-lucide-printer',
    })
  }

  if (sellerStore.shops.length && !papers.value.length) {
    cards.push({
      title: 'No parent sheets are recorded',
      description: 'Quoting stays vague when the shop has no real stock paper sizes to estimate from.',
      action: 'Add papers',
      to: '/dashboard/papers',
      icon: 'i-lucide-file-stack',
    })
  }

  if (sellerStore.shops.length && !products.value.length) {
    cards.push({
      title: 'Nothing sellable is configured',
      description: 'Create one or two high-frequency products so the dashboard feels operational instead of empty.',
      action: 'Create product',
      to: shopSlug ? `/dashboard/shops/${shopSlug}/products/create` : '/dashboard/products',
      icon: 'i-lucide-package',
    })
  }

  if (lowStockPaperCount.value > 0) {
    cards.push({
      title: 'Low stock paper needs a decision',
      description: `${lowStockPaperCount.value} paper line${lowStockPaperCount.value === 1 ? '' : 's'} are at or below reorder level. Review quantities before they quietly become quoting problems.`,
      action: 'Review papers',
      to: '/dashboard/papers',
      icon: 'i-lucide-triangle-alert',
    })
  }

  return cards.slice(0, 3)
})

async function loadShopResources() {
  if (!activeShop.value) {
    machines.value = []
    papers.value = []
    products.value = []
    materials.value = []
    finishingRates.value = []
    return
  }

  const slug = activeShop.value.slug
  const [machineResult, paperResult, productResult, materialResult, finishingResult] = await Promise.allSettled([
    listMachinesBySlug(slug),
    listPapersBySlug(slug),
    listProductsBySlug(slug),
    listMaterialsBySlug(slug),
    listFinishingRatesBySlug(slug),
  ])

  machines.value = machineResult.status === 'fulfilled' ? machineResult.value : []
  papers.value = paperResult.status === 'fulfilled' ? paperResult.value : []
  products.value = productResult.status === 'fulfilled' ? productResult.value : []
  materials.value = materialResult.status === 'fulfilled' ? materialResult.value : []
  finishingRates.value = finishingResult.status === 'fulfilled' ? finishingResult.value : []
}

onMounted(async () => {
  await sellerStore.fetchShops()
  await Promise.allSettled([refreshSetup(), loadShopResources()])
})
</script>
