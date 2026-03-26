import { useSetupStatus } from '~/composables/useSetupStatus'
import { useShopStore } from '~/stores/shop'

export type SetupChecklistKey = 'shop' | 'materials' | 'pricing' | 'finishing' | 'products'
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
  const shopStore = useShopStore()
  const { status } = useSetupStatus()

  function shopRoute(path: string, fallback = '/dashboard/shops/create') {
    const slug = shopStore.selectedShopSlug
    return slug ? `/dashboard/shops/${slug}${path}` : fallback
  }

  const items = computed<SetupChecklistItem[]>(() => {
    const nextStep = status.value?.next_step
    const definitions: Array<Omit<SetupChecklistItem, 'done' | 'state'>> = [
      { key: 'shop', label: 'Shop', description: 'Create the shop workspace.', icon: 'i-lucide-store', to: '/dashboard/shops/create' },
      { key: 'materials', label: 'Materials', description: 'Add papers and materials.', icon: 'i-lucide-file-stack', to: shopRoute('/materials') },
      { key: 'pricing', label: 'Pricing', description: 'Add machine pricing rules.', icon: 'i-lucide-banknote', to: shopRoute('/pricing') },
      { key: 'finishing', label: 'Finishing', description: 'Add finishing rules and lamination metadata.', icon: 'i-lucide-scissors', to: shopRoute('/finishing') },
      { key: 'products', label: 'Products', description: 'Create the first product.', icon: 'i-lucide-package', to: shopRoute('/products') },
    ]
    const doneMap: Record<SetupChecklistKey, boolean> = {
      shop: Boolean(status.value?.has_shop),
      materials: Boolean(status.value?.has_materials),
      pricing: Boolean(status.value?.has_pricing),
      finishing: Boolean(status.value?.has_finishing),
      products: Boolean(status.value?.has_products),
    }
    return definitions.map((definition) => ({
      ...definition,
      done: doneMap[definition.key],
      state: doneMap[definition.key] ? 'complete' : nextStep === definition.key ? 'required' : 'missing',
    }))
  })

  const completedSteps = computed(() => items.value.filter((item) => item.done).length)
  const totalSteps = computed(() => items.value.length)
  const progressPercent = computed(() => Math.round((completedSteps.value / totalSteps.value) * 100))
  const summary = computed(() => `${completedSteps.value} of ${totalSteps.value} backend setup steps complete`)
  const nextRequiredItem = computed(() => items.value.find((item) => item.state === 'required') ?? null)

  return {
    items,
    completedSteps,
    totalSteps,
    progressPercent,
    summary,
    nextRequiredItem,
  }
}
