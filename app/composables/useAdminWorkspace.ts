import { useAuthStore } from '~/stores/auth'
import { useSetupChecklist } from '~/composables/useSetupChecklist'
import { useShopStore } from '~/stores/shop'
import { useSellerStore } from '~/stores/seller'
import { useActivityBadgesStore } from '~/stores/activityBadges'
import { useSetupStatus } from '~/composables/useSetupStatus'

export interface WorkspaceNavItem {
  label: string
  to?: string
  icon: string
  helper?: string
  action?: () => void | Promise<void>
  badge?: string
  badgeCount?: number | null
}

export interface WorkspaceNavSection {
  label: string
  items: WorkspaceNavItem[]
  kind?: 'workspace' | 'shop' | 'utility'
}

export function useAdminWorkspace() {
  const authStore = useAuthStore()
  const shopStore = useShopStore()
  const sellerStore = useSellerStore()
  const activityBadgesStore = useActivityBadgesStore()
  const { status } = useSetupStatus()
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

  function setupAwareShopRoute(path: '/machines' | '/papers' | '/pricing' | '/finishing' | '/products') {
    if (!selectedShopSlug.value) return '/dashboard/shops/create'
    if (path === '/pricing') {
      if (!status.value?.has_machines) return shopRoute('/machines')
      if (!status.value?.has_papers) return shopRoute('/papers')
    }
    if (path === '/finishing' || path === '/products') {
      if (!status.value?.has_machines) return shopRoute('/machines')
      if (!status.value?.has_papers) return shopRoute('/papers')
      if (!status.value?.has_pricing) return shopRoute('/pricing')
    }
    return shopRoute(path)
  }

  const navSections = computed<WorkspaceNavSection[]>(() => {
    const sections: WorkspaceNavSection[] = [
      {
        label: 'Workspace',
        kind: 'workspace',
        items: [
          { label: 'Dashboard', to: '/dashboard', icon: 'i-lucide-layout-dashboard', helper: 'Owner workspace desk' },
          { label: 'Setup Guide', to: '/dashboard/setup-guide', icon: 'i-lucide-list-checks', helper: 'Backend setup status' },
          { label: 'Requests & Quotes', to: '/quote-draft', icon: 'i-lucide-files', helper: 'Client request tracking workspace' },
          ...(isSuperuser.value
            ? [{ label: 'Metrics', to: '/super-admin/analytics', icon: 'i-lucide-chart-column', helper: 'Super-admin analytics dashboard' }]
            : []),
        ],
      },
      {
        label: 'Shop',
        kind: 'shop',
        items: [
          { label: 'Shop Home', to: shopRoute(''), icon: 'i-lucide-store', helper: 'Selected shop workspace' },
          {
            label: 'Incoming Requests',
            to: shopRoute('/incoming-requests?view=new'),
            icon: 'i-lucide-inbox',
            helper: 'New requests from clients',
            badgeCount: activityBadgesStore.summary.shop.incoming_requests,
          },
          {
            label: 'Messages / Replies',
            to: shopRoute('/incoming-requests?view=messages'),
            icon: 'i-lucide-messages-square',
            helper: 'Client replies waiting on your team',
            badgeCount: activityBadgesStore.summary.shop.messages_replies,
          },
          {
            label: 'Pending Quote Actions',
            to: shopRoute('/incoming-requests?view=actions'),
            icon: 'i-lucide-list-todo',
            helper: 'Requests that still need action',
            badgeCount: activityBadgesStore.summary.shop.pending_quote_actions,
          },
          { label: 'Machines', to: setupAwareShopRoute('/machines'), icon: 'i-lucide-printer', helper: 'Presses and production equipment' },
          { label: 'Materials', to: setupAwareShopRoute('/papers'), icon: 'i-lucide-file-stack', helper: 'Paper stock and material setup' },
          { label: 'Pricing', to: setupAwareShopRoute('/pricing'), icon: 'i-lucide-banknote', helper: 'Machine and material pricing' },
          { label: 'Finishing', to: setupAwareShopRoute('/finishing'), icon: 'i-lucide-scissors', helper: 'Per-sheet lamination and post-press pricing' },
          { label: 'Products', to: setupAwareShopRoute('/products'), icon: 'i-lucide-package', helper: 'Catalog and product rules' },
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
    ]
    return sections
  })

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
