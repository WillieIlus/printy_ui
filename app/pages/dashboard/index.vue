<template>
  <div class="col-span-12 space-y-6 pb-2">
    <section class="relative overflow-hidden rounded-[34px] border border-[var(--p-border)] bg-[var(--p-surface)] p-6 shadow-sm sm:p-7 lg:p-8 dark:border-white/12 dark:bg-[linear-gradient(145deg,rgba(15,23,42,0.92),rgba(10,15,26,0.82))] dark:shadow-[0_22px_80px_rgba(0,0,0,0.35)] dark:backdrop-blur-2xl">
      <div class="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(240,82,36,0.10),transparent_26%),radial-gradient(circle_at_80%_20%,rgba(65,115,182,0.08),transparent_26%),radial-gradient(circle_at_bottom_right,rgba(16,24,40,0.04),transparent_32%)] dark:bg-[radial-gradient(circle_at_top_left,rgba(251,146,60,0.18),transparent_24%),radial-gradient(circle_at_80%_20%,rgba(59,130,246,0.12),transparent_24%),radial-gradient(circle_at_bottom_right,rgba(15,23,42,0.5),transparent_30%)]" />

      <div class="relative flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
        <div class="max-w-4xl space-y-4">
          <div class="flex flex-wrap items-center gap-2">
            <span class="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.28em] text-orange-700 dark:border-orange-400/25 dark:bg-orange-500/10 dark:text-orange-200">
              <span class="h-2 w-2 rounded-full bg-orange-500 dark:bg-orange-300" />
              Print Operations Hub
            </span>
            <span class="inline-flex items-center rounded-full border border-[var(--p-border)] bg-[var(--p-surface-sunken)] px-3 py-1 text-xs text-[var(--p-text-muted)] dark:border-white/10 dark:bg-white/[0.06] dark:text-slate-300">
              {{ activeShop ? `Active shop: ${activeShop.name}` : 'No active shop yet' }}
            </span>
          </div>

          <div class="space-y-3">
            <h1 class="max-w-3xl text-3xl font-semibold tracking-tight text-[var(--p-text)] sm:text-4xl dark:text-white">{{ welcomeTitle }}</h1>
            <p class="max-w-3xl text-sm leading-7 text-[var(--p-text-dim)] sm:text-base dark:text-slate-300">{{ helperSubtitle }}</p>
          </div>

          <div class="grid gap-3 sm:grid-cols-3">
            <div
              v-for="metric in heroMetrics"
              :key="metric.label"
              class="rounded-[24px] border border-[var(--p-border)] bg-[var(--p-surface-sunken)] p-4 dark:border-white/10 dark:bg-white/[0.07] dark:backdrop-blur-xl"
            >
              <p class="text-[11px] uppercase tracking-[0.24em] text-[var(--p-text-muted)] dark:text-slate-500">{{ metric.label }}</p>
              <div class="mt-3 flex items-end justify-between gap-3">
                <div>
                  <p class="text-3xl font-semibold text-[var(--p-text)] dark:text-white">{{ metric.value }}</p>
                  <p class="mt-1 text-sm text-[var(--p-text-dim)] dark:text-slate-300">{{ metric.description }}</p>
                </div>
                <UIcon :name="metric.icon" class="h-5 w-5" :class="metric.iconClass" />
              </div>
            </div>
          </div>
        </div>

        <div class="grid gap-3 sm:grid-cols-2 xl:w-[26rem]">
          <NuxtLink
            v-for="action in heroActions"
            :key="action.label"
            :to="action.to"
            class="rounded-[26px] border p-4 transition duration-200"
            :class="action.emphasis
              ? 'border-orange-200 bg-orange-50 hover:bg-orange-100 dark:border-orange-400/30 dark:bg-orange-500/[0.12] dark:hover:bg-orange-500/[0.16]'
              : 'border-[var(--p-border)] bg-[var(--p-surface-sunken)] hover:border-orange-200 hover:bg-orange-50 dark:border-white/10 dark:bg-white/[0.06] dark:hover:border-white/15 dark:hover:bg-white/[0.09]'"
          >
            <div class="flex items-start gap-3">
              <div
                class="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border"
                :class="action.emphasis
                  ? 'border-orange-200 bg-orange-100 text-orange-700 dark:border-orange-300/25 dark:bg-orange-500/15 dark:text-orange-100'
                  : 'border-[var(--p-border)] bg-[var(--p-surface)] text-[var(--p-text-dim)] dark:border-white/10 dark:bg-white/10 dark:text-slate-100'"
              >
                <UIcon :name="action.icon" class="h-5 w-5" />
              </div>
              <div class="min-w-0">
                <p class="text-sm font-semibold text-[var(--p-text)] dark:text-white">{{ action.label }}</p>
                <p class="mt-1 text-sm leading-6 text-[var(--p-text-dim)] dark:text-slate-300">{{ action.description }}</p>
              </div>
            </div>
          </NuxtLink>
        </div>
      </div>
    </section>

    <div class="grid gap-6 xl:grid-cols-[1.15fr_0.95fr]">
      <DashboardFormSection title="Quick Actions" description="Shortcuts for the next useful move, without repeating the same setup story in multiple places.">
        <div class="grid gap-3 sm:grid-cols-2">
          <NuxtLink
            v-for="action in quickActions"
            :key="action.label"
            :to="action.to"
            class="rounded-[24px] border border-[var(--p-border)] bg-[var(--p-surface-sunken)] p-4 transition hover:border-orange-200 hover:bg-orange-50 dark:border-white/10 dark:bg-white/[0.06] dark:hover:border-orange-300/30 dark:hover:bg-orange-500/10"
          >
            <div class="flex items-start gap-3">
              <div class="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-orange-200 bg-orange-50 dark:border-orange-400/20 dark:bg-orange-500/10">
                <UIcon :name="action.icon" class="h-5 w-5 text-orange-600 dark:text-orange-200" />
              </div>
              <div class="min-w-0">
                <p class="text-sm font-semibold text-[var(--p-text)] dark:text-white">{{ action.label }}</p>
                <p class="mt-1 text-sm leading-6 text-[var(--p-text-dim)] dark:text-slate-300">{{ action.description }}</p>
              </div>
            </div>
          </NuxtLink>
        </div>
      </DashboardFormSection>

      <DashboardFormSection :title="guidanceTitle" :description="guidanceDescription">
        <template #actions>
          <UButton :to="nextStepRoute" color="primary" variant="soft" class="justify-center">
            <UIcon name="i-lucide-arrow-up-right" class="mr-2 h-4 w-4" />
            {{ nextStepAction }}
          </UButton>
        </template>

        <div class="space-y-3">
          <article
            v-for="item in focusItems"
            :key="item.label"
            class="rounded-[24px] border border-[var(--p-border)] bg-[var(--p-surface-sunken)] p-4 dark:border-white/10 dark:bg-white/[0.06] dark:backdrop-blur-xl"
          >
            <div class="flex items-start gap-3">
              <div
                class="mt-0.5 flex h-11 w-11 items-center justify-center rounded-2xl border"
                :class="item.done
                  ? 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-400/25 dark:bg-emerald-500/12 dark:text-emerald-200'
                  : 'border-orange-200 bg-orange-50 text-orange-700 dark:border-orange-400/20 dark:bg-orange-500/10 dark:text-orange-200'"
              >
                <UIcon :name="item.done ? 'i-lucide-check' : item.icon" class="h-5 w-5" />
              </div>
              <div class="min-w-0 flex-1">
                <div class="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p class="text-sm font-semibold text-[var(--p-text)] dark:text-white">{{ item.label }}</p>
                    <p class="mt-1 text-sm leading-6 text-[var(--p-text-dim)] dark:text-slate-300">{{ item.description }}</p>
                  </div>
                  <UBadge :color="item.done ? 'success' : 'warning'" variant="soft" size="sm">
                    {{ item.done ? 'Complete' : 'Next' }}
                  </UBadge>
                </div>
                <div class="mt-3 flex flex-wrap items-center gap-3">
                  <NuxtLink
                    v-if="!item.done"
                    :to="item.to"
                    class="inline-flex items-center gap-2 text-sm font-medium text-orange-700 transition hover:text-orange-800 dark:text-orange-200 dark:hover:text-orange-100"
                  >
                    {{ item.action }}
                    <UIcon name="i-lucide-arrow-right" class="h-4 w-4" />
                  </NuxtLink>
                  <span v-else class="text-sm text-emerald-700 dark:text-emerald-200/90">{{ item.completeNote }}</span>
                </div>
              </div>
            </div>
          </article>
        </div>
      </DashboardFormSection>
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
    return 'This homepage should answer one question quickly: can this shop support live quoting today? Finish the missing setup blocks below to get there.'
  }
  return 'Keep attention on the few signals that matter most: setup readiness, product availability, and the next operational move likely to improve quoting confidence.'
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

const nextStepAction = computed(() => {
  if (!sellerStore.shops.length) return 'Register shop'
  if (!activeMachineCount.value) return 'Add machine'
  if (!papers.value.length) return 'Add papers'
  if (!products.value.length) return 'Create product'
  if (!activeMaterialCount.value) return 'Add materials'
  if (!activeFinishingCount.value) return 'Add finishing'
  return 'Review pricing'
})

const heroMetrics = computed(() => [
  {
    label: 'Readiness',
    value: `${readinessScore.value}%`,
    description: readinessLabel.value,
    icon: 'i-lucide-gauge',
    iconClass: 'text-orange-500 dark:text-orange-300',
  },
  {
    label: 'Active Machines',
    value: activeMachineCount.value,
    description: activeMachineCount.value ? 'Production capacity is connected.' : 'No machine is active yet.',
    icon: 'i-lucide-printer',
    iconClass: 'text-sky-600 dark:text-sky-300',
  },
  {
    label: 'Products Ready',
    value: publishedProductCount.value,
    description: publishedProductCount.value ? 'Sellable output exists.' : 'No usable products yet.',
    icon: 'i-lucide-package',
    iconClass: 'text-emerald-600 dark:text-emerald-300',
  },
])

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

const quickActions = computed(() => {
  const shopSlug = activeShop.value?.slug
  return [
    { label: 'Open shop setup', description: 'Review business details and workspace settings for the active shop.', to: shopSlug ? `/dashboard/shops/${shopSlug}` : '/dashboard/shops', icon: 'i-lucide-store' },
    { label: 'Add paper stock', description: 'Add a parent sheet or supplier line used in daily quoting.', to: '/dashboard/papers', icon: 'i-lucide-file-stack' },
    { label: 'Review machines', description: 'Check whether current equipment matches the jobs you want to quote.', to: shopSlug ? `/dashboard/shops/${shopSlug}/machines` : '/dashboard/machines', icon: 'i-lucide-settings-2' },
    { label: 'Expand products', description: 'Add another repeatable product instead of pricing from scratch.', to: shopSlug ? `/dashboard/shops/${shopSlug}/products/create` : '/dashboard/products', icon: 'i-lucide-plus-circle' },
  ]
})

const guidanceTitle = computed(() => {
  if (!sellerStore.shops.length) return 'Get Started'
  if (readinessScore.value < 84) return 'Focus Today'
  return 'Stay Operational'
})

const guidanceDescription = computed(() => {
  if (!sellerStore.shops.length) return 'Start with the few setup blocks that unlock the rest of the dashboard.'
  if (readinessScore.value < 84) return `The clearest next move right now is "${nextStepLabel.value}". Keep the guidance list short and complete the blockers in order.`
  return 'Core setup is in place. Keep the dashboard useful by acting on only the highest-signal operational checks.'
})

const focusItems = computed(() => {
  const machineRoute = activeShop.value ? `/dashboard/shops/${activeShop.value.slug}/machines` : '/dashboard/machines'
  const productRoute = activeShop.value ? `/dashboard/shops/${activeShop.value.slug}/products/create` : '/dashboard/products'
  const materialRoute = activeShop.value ? `/dashboard/shops/${activeShop.value.slug}/materials` : '/dashboard/materials'

  const items = [
    {
      label: 'Register a shop workspace',
      description: 'Everything else in the seller dashboard depends on a real shop container.',
      done: sellerStore.shops.length > 0,
      to: '/dashboard/shops/create',
      action: 'Create shop',
      icon: 'i-lucide-store',
      completeNote: `${sellerStore.shops.length} shop workspace${sellerStore.shops.length === 1 ? '' : 's'} connected.`,
      priority: 1,
    },
    {
      label: 'Connect production machines',
      description: 'Machines unlock believable routing, sheet limits, and costing assumptions.',
      done: activeMachineCount.value > 0,
      to: machineRoute,
      action: 'Add machine',
      icon: 'i-lucide-printer',
      completeNote: `${activeMachineCount.value} active machine${activeMachineCount.value === 1 ? '' : 's'} configured.`,
      priority: 2,
    },
    {
      label: 'Define parent sheet stock',
      description: 'Paper setup gives quoting a real stock base instead of vague estimates.',
      done: papers.value.length > 0,
      to: '/dashboard/papers',
      action: 'Add papers',
      icon: 'i-lucide-file-stack',
      completeNote: `${papers.value.length} paper line${papers.value.length === 1 ? '' : 's'} available.`,
      priority: 3,
    },
    {
      label: 'Create sellable products',
      description: 'Products turn setup into repeatable jobs your team can quote faster.',
      done: products.value.length > 0,
      to: productRoute,
      action: 'Create product',
      icon: 'i-lucide-package',
      completeNote: `${products.value.length} product${products.value.length === 1 ? '' : 's'} configured.`,
      priority: 4,
    },
    {
      label: 'Attach materials and finishing',
      description: 'These extras stop lamination, binding, and material charges from becoming manual guesswork.',
      done: activeMaterialCount.value > 0 || activeFinishingCount.value > 0,
      to: materialRoute,
      action: 'Add materials',
      icon: 'i-lucide-layers',
      completeNote: `${activeMaterialCount.value + activeFinishingCount.value} material/finishing line${activeMaterialCount.value + activeFinishingCount.value === 1 ? '' : 's'} configured.`,
      priority: 5,
    },
    {
      label: 'Review low stock paper',
      description: `${lowStockPaperCount.value} paper line${lowStockPaperCount.value === 1 ? '' : 's'} are already at or below reorder level.`,
      done: lowStockPaperCount.value === 0,
      to: '/dashboard/papers',
      action: 'Review papers',
      icon: 'i-lucide-triangle-alert',
      completeNote: 'No low-stock paper lines need attention.',
      priority: 6,
    },
  ]

  const pending = items.filter(item => !item.done).sort((a, b) => a.priority - b.priority).slice(0, 3)
  if (pending.length) return pending

  return items.filter(item => item.done).slice(0, 3)
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
