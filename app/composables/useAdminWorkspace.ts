import { useAuthStore } from '~/stores/auth'
import { useSellerStore } from '~/stores/seller'
import { useSetupStatus } from '~/composables/useSetupStatus'
import { useSetupChecklist } from '~/composables/useSetupChecklist'

type SetupKey = 'shop' | 'machines' | 'papers' | 'pricing' | 'products'

export interface WorkspaceNavItem {
  label: string
  to?: string
  icon: string
  helper?: string
  setupKey?: SetupKey
  badge?: string | null
  action?: () => void | Promise<void>
}

export interface WorkspaceNavSection {
  label: string
  items: WorkspaceNavItem[]
}

export function useAdminWorkspace() {
  const route = useRoute()
  const authStore = useAuthStore()
  const sellerStore = useSellerStore()
  const { status } = useSetupStatus()
  const { items: checklistItems, summary } = useSetupChecklist()

  const selectedShopSlug = computed(() => {
    const routeSlug = typeof route.params.slug === 'string' ? route.params.slug : ''
    if (routeSlug) return routeSlug
    return sellerStore.shops[0]?.slug ?? ''
  })

  const selectedShop = computed(() =>
    sellerStore.shops.find(shop => shop.slug === selectedShopSlug.value) ?? sellerStore.shops[0] ?? null
  )

  const hasShop = computed(() => Boolean(selectedShop.value))
  const isSuperuser = computed(() => Boolean(authStore.user?.is_superuser))

  const setupStates = computed<Record<SetupKey, boolean>>(() => ({
    shop: Boolean(status.value?.has_shop),
    machines: Boolean(status.value?.has_machines),
    papers: Boolean(status.value?.has_papers),
    pricing: Boolean(status.value?.has_pricing),
    products: Boolean(status.value?.has_published_products),
  }))

  function sectionBadge(key: SetupKey) {
    const item = checklistItems.value.find(check => check.key === key)
    if (!item) return null
    if (item.state === 'required') return 'Required'
    if (item.state === 'missing') return 'Missing'
    return null
  }

  function shopRoute(path: string, fallback = '/dashboard/shops/create') {
    return selectedShopSlug.value ? `/dashboard/shops/${selectedShopSlug.value}${path}` : fallback
  }

  const navSections = computed<WorkspaceNavSection[]>(() => {
    const sections: WorkspaceNavSection[] = [
      {
        label: 'Dashboard',
        items: [
          {
            label: 'Home',
            to: '/',
            icon: 'i-lucide-house',
            helper: 'Public homepage',
          },
          {
            label: 'Overview',
            to: '/dashboard',
            icon: 'i-lucide-layout-dashboard',
            helper: 'Workspace summary',
          },
          {
            label: 'Setup Guide',
            to: '/dashboard/setup-guide',
            icon: 'i-lucide-list-checks',
            helper: 'Essential setup status',
            badge: status.value?.next_step === 'done' ? null : `${checklistItems.value.filter(item => item.done).length}/${checklistItems.value.length}`,
          },
        ],
      },
      {
        label: 'Shop',
        items: [
          {
            label: 'Shop Profile',
            to: shopRoute('/edit'),
            icon: 'i-lucide-store',
            helper: 'Business details',
            setupKey: 'shop',
            badge: sectionBadge('shop'),
          },
          {
            label: 'View Shop as Outsider',
            to: selectedShopSlug.value ? `/shops/${selectedShopSlug.value}` : '/shops',
            icon: 'i-lucide-external-link',
            helper: 'Open the public-facing shop page',
          },
          {
            label: 'Machines',
            to: shopRoute('/machines'),
            icon: 'i-lucide-printer',
            helper: 'Equipment and capacity',
            setupKey: 'machines',
            badge: sectionBadge('machines'),
          },
          {
            label: 'Paper Stock',
            to: shopRoute('/papers'),
            icon: 'i-lucide-file-stack',
            helper: 'Paper inventory',
            setupKey: 'papers',
            badge: sectionBadge('papers'),
          },
          {
            label: 'Pricing',
            to: shopRoute('/pricing'),
            icon: 'i-lucide-banknote',
            helper: 'Printing and material rates',
            setupKey: 'pricing',
            badge: sectionBadge('pricing'),
          },
          {
            label: 'Finishings',
            to: shopRoute('/finishing'),
            icon: 'i-lucide-scissors',
            helper: 'Post-press services',
          },
          {
            label: 'Products',
            to: shopRoute('/products'),
            icon: 'i-lucide-package',
            helper: 'Sellable catalog',
            setupKey: 'products',
            badge: sectionBadge('products'),
          },
        ],
      },
      {
        label: 'Quotes',
        items: [
          {
            label: 'Incoming Requests',
            to: shopRoute('/incoming-requests'),
            icon: 'i-lucide-inbox',
            helper: 'Customer quote requests',
          },
          {
            label: 'Draft Quotes',
            to: shopRoute('/sent-quotes?status=draft'),
            icon: 'i-lucide-file-pen-line',
            helper: 'Unsent or draft pricing work',
          },
          {
            label: 'Sent Quotes',
            to: shopRoute('/sent-quotes'),
            icon: 'i-lucide-send',
            helper: 'Quotes awaiting response',
          },
        ],
      },
      {
        label: 'Settings',
        items: [
          {
            label: 'Settings',
            to: '/dashboard/settings',
            icon: 'i-lucide-settings',
            helper: 'Account and workspace settings',
          },
          {
            label: 'Sign Out',
            icon: 'i-lucide-log-out',
            helper: 'Leave the admin workspace',
            action: () => authStore.logout(),
          },
        ],
      },
    ]

    if (isSuperuser.value) {
      sections.push({
        label: 'Super Admin',
        items: [
          {
            label: 'Analytics',
            to: '/super-admin/analytics',
            icon: 'i-lucide-chart-column',
            helper: 'Platform-wide analytics',
          },
        ],
      })
    }

    return sections
  })

  return {
    selectedShopSlug,
    selectedShop,
    hasShop,
    isSuperuser,
    setupStates,
    setupSummary: summary,
    navSections,
    shopRoute,
  }
}
