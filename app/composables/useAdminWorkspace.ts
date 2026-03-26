import { useAuthStore } from '~/stores/auth'
import { useSetupChecklist } from '~/composables/useSetupChecklist'
import { useShopStore } from '~/stores/shop'

export interface WorkspaceNavItem {
  label: string
  to?: string
  icon: string
  helper?: string
}

export interface WorkspaceNavSection {
  label: string
  items: WorkspaceNavItem[]
}

export function useAdminWorkspace() {
  const authStore = useAuthStore()
  const shopStore = useShopStore()
  const { summary } = useSetupChecklist()

  const selectedShopSlug = computed(() => shopStore.selectedShopSlug ?? '')
  const selectedShop = computed(() => shopStore.currentShop)
  const hasShop = computed(() => Boolean(selectedShop.value))
  const isSuperuser = computed(() => Boolean(authStore.user?.is_superuser))

  function shopRoute(path: string, fallback = '/dashboard/shops/create') {
    return selectedShopSlug.value ? `/dashboard/shops/${selectedShopSlug.value}${path}` : fallback
  }

  const navSections = computed<WorkspaceNavSection[]>(() => [
    {
      label: 'Workspace',
      items: [
        { label: 'Dashboard', to: '/dashboard', icon: 'i-lucide-layout-dashboard', helper: 'Owner workspace desk' },
        { label: 'Setup Guide', to: '/dashboard/setup-guide', icon: 'i-lucide-list-checks', helper: 'Backend setup status' },
        { label: 'Quote Drafts', to: '/quote-draft', icon: 'i-lucide-files', helper: 'Client draft workspace' },
      ],
    },
    {
      label: 'Shop',
      items: [
        { label: 'Shop Home', to: shopRoute(''), icon: 'i-lucide-store', helper: 'Selected shop workspace' },
        { label: 'Materials', to: shopRoute('/materials'), icon: 'i-lucide-file-stack', helper: 'Papers and materials' },
        { label: 'Pricing', to: shopRoute('/pricing'), icon: 'i-lucide-banknote', helper: 'Machine and material pricing' },
        { label: 'Finishing', to: shopRoute('/finishing'), icon: 'i-lucide-scissors', helper: 'Billing basis and lamination' },
        { label: 'Products', to: shopRoute('/products'), icon: 'i-lucide-package', helper: 'Catalog and product rules' },
      ],
    },
  ])

  return {
    selectedShopSlug,
    selectedShop,
    hasShop,
    isSuperuser,
    setupSummary: summary,
    navSections,
    shopRoute,
  }
}
