import { useSellerStore } from '~/stores/seller'
import { useSetupStatus } from '~/composables/useSetupStatus'

export type SetupChecklistKey = 'shop' | 'machines' | 'papers' | 'pricing' | 'products'
export type SetupChecklistState = 'complete' | 'missing' | 'required'

export interface SetupChecklistItem {
  key: SetupChecklistKey
  label: string
  description: string
  icon: string
  to: string
  done: boolean
  state: SetupChecklistState
}

export function useSetupChecklist() {
  const route = useRoute()
  const sellerStore = useSellerStore()
  const { status } = useSetupStatus()

  const selectedShopSlug = computed(() => {
    const routeSlug = typeof route.params.slug === 'string' ? route.params.slug : ''
    return routeSlug || sellerStore.shops[0]?.slug || ''
  })

  function shopRoute(path: string, fallback = '/dashboard/shops/create') {
    return selectedShopSlug.value ? `/dashboard/shops/${selectedShopSlug.value}${path}` : fallback
  }

  const stepOrder: SetupChecklistKey[] = ['shop', 'machines', 'papers', 'pricing', 'products']

  const stepDone = computed<Record<SetupChecklistKey, boolean>>(() => ({
    shop: Boolean(status.value?.has_shop),
    machines: Boolean(status.value?.has_machines),
    papers: Boolean(status.value?.has_papers),
    pricing: Boolean(status.value?.has_pricing),
    products: Boolean(status.value?.has_published_products),
  }))

  const requiredKey = computed<SetupChecklistKey | null>(() => {
    const next = status.value?.next_step
    if (!next || next === 'done') return null
    if (stepOrder.includes(next)) return next as SetupChecklistKey
    return null
  })

  const items = computed<SetupChecklistItem[]>(() => [
    {
      key: 'shop',
      label: 'Shop Profile',
      description: 'Business identity, contact details, and address.',
      icon: 'i-lucide-store',
      to: shopRoute('/edit'),
      done: stepDone.value.shop,
      state: stepDone.value.shop ? 'complete' : requiredKey.value === 'shop' ? 'required' : 'missing',
    },
    {
      key: 'machines',
      label: 'Machines',
      description: 'Equipment, sheet limits, and machine capacity.',
      icon: 'i-lucide-printer',
      to: shopRoute('/machines'),
      done: stepDone.value.machines,
      state: stepDone.value.machines ? 'complete' : requiredKey.value === 'machines' ? 'required' : 'missing',
    },
    {
      key: 'papers',
      label: 'Paper Stock',
      description: 'Paper lines and stock used in quoting.',
      icon: 'i-lucide-file-stack',
      to: shopRoute('/papers'),
      done: stepDone.value.papers,
      state: stepDone.value.papers ? 'complete' : requiredKey.value === 'papers' ? 'required' : 'missing',
    },
    {
      key: 'pricing',
      label: 'Pricing',
      description: 'Printing rates, materials, and pricing rules.',
      icon: 'i-lucide-banknote',
      to: shopRoute('/pricing'),
      done: stepDone.value.pricing,
      state: stepDone.value.pricing ? 'complete' : requiredKey.value === 'pricing' ? 'required' : 'missing',
    },
    {
      key: 'products',
      label: 'Products',
      description: 'Published products ready for quoting.',
      icon: 'i-lucide-package',
      to: shopRoute('/products'),
      done: stepDone.value.products,
      state: stepDone.value.products ? 'complete' : requiredKey.value === 'products' ? 'required' : 'missing',
    },
  ])

  const totalSteps = computed(() => items.value.length)
  const completedSteps = computed(() => items.value.filter(item => item.done).length)
  const progressPercent = computed(() => Math.round((completedSteps.value / totalSteps.value) * 100))
  const summary = computed(() => `${completedSteps.value} of ${totalSteps.value} setup steps completed`)
  const nextRequiredItem = computed(() => items.value.find(item => item.state === 'required') ?? null)

  return {
    items,
    completedSteps,
    totalSteps,
    progressPercent,
    summary,
    nextRequiredItem,
    requiredKey,
  }
}
