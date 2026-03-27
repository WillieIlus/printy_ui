import { useAuthStore } from '~/stores/auth'
import { useSetupChecklist } from '~/composables/useSetupChecklist'
import { useShopStore } from '~/stores/shop'
import { useSellerStore } from '~/stores/seller'

export interface WorkspaceNavItem {
  label: string
  to?: string
  icon: string
  helper?: string
  action?: () => void | Promise<void>
}

export interface WorkspaceNavSection {
  label: string
  items: Array<WorkspaceNavItem | null | undefined>
  kind?: 'workspace' | 'shop' | 'utility'
}

export function useAdminWorkspace() {
  const authStore = useAuthStore()
  const shopStore = useShopStore()
  const sellerStore = useSellerStore()
  const { summary } = useSetupChecklist()
  const route = useRoute()

  const routeShopSlug = computed(() => {
    const slug = route.params.slug
    return typeof slug === 'string' ? slug : ''
  })
  const selectedShopSlug = computed(() =>
    routeShopSlug.value
    || shopStore.currentShop?.slug
    || shopStore.selectedShopSlug
    || sellerStore.shops[0]?.slug
    || ''
  )
  const selectedShop = computed(() => shopStore.currentShop)
  const hasShop = computed(() => Boolean(selectedShop.value))
  const isSuperuser = computed(() => Boolean(authStore.user?.is_superuser))

  function shopRoute(path: string, fallback = '/dashboard/shops/create') {
    return selectedShopSlug.value ? `/dashboard/shops/${selectedShopSlug.value}${path}` : fallback
  }

  const navSections = computed<WorkspaceNavSection[]>(() => [
    {
      label: 'Workspace',
      kind: 'workspace',
      items: [
        { label: 'Dashboard', to: '/dashboard', icon: 'i-lucide-layout-dashboard', helper: 'Owner workspace desk' },
        { label: 'Setup Guide', to: '/dashboard/setup-guide', icon: 'i-lucide-list-checks', helper: 'Backend setup status' },
        { label: 'Quote Drafts', to: '/quote-draft', icon: 'i-lucide-files', helper: 'Client draft workspace' },
      ],
    },
    {
      label: 'Shop',
      kind: 'shop',
      items: [
        { label: 'Shop Home', to: shopRoute(''), icon: 'i-lucide-store', helper: 'Selected shop workspace' },
        { label: 'Materials', to: shopRoute('/materials'), icon: 'i-lucide-file-stack', helper: 'Papers and materials' },
        { label: 'Pricing', to: shopRoute('/pricing'), icon: 'i-lucide-banknote', helper: 'Machine and material pricing' },
        { label: 'Finishing', to: shopRoute('/finishing'), icon: 'i-lucide-scissors', helper: 'Billing basis and lamination' },
        { label: 'Products', to: shopRoute('/products'), icon: 'i-lucide-package', helper: 'Catalog and product rules' },
      ],
    },
    {
      label: 'Utility',
      kind: 'utility',
      items: [
        { label: 'Home', to: '/', icon: 'i-lucide-house', helper: 'Public homepage' },
        {
          label: 'View Public Shop',
          to: selectedShopSlug.value ? `/shops/${selectedShopSlug.value}` : '/shops',
          icon: 'i-lucide-external-link',
          helper: selectedShopSlug.value ? 'Open the current shop public page' : 'Open the public shops directory',
        },
        {
          label: 'Sign out',
          icon: 'i-lucide-log-out',
          helper: 'End this session',
          action: () => authStore.logout(),
        },
      ],
    },
  ].map((section) => ({
    ...section,
    items: section.items.filter((item): item is WorkspaceNavItem => Boolean(item)),
  })))

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
