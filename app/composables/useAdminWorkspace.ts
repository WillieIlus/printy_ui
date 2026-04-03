import { useI18n } from 'vue-i18n'
import { useAuthStore } from '~/stores/auth'
import { useSetupChecklist } from '~/composables/useSetupChecklist'
import { useShopStore } from '~/stores/shop'
import { useSellerStore } from '~/stores/seller'
import { useActivityBadgesStore } from '~/stores/activityBadges'
import { useSetupStatus } from '~/composables/useSetupStatus'
import { resolveSetupFlow } from '~/utils/setupFlow'

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
  const { t } = useI18n()
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
    const flow = resolveSetupFlow(status.value, selectedShopSlug.value)
    const step = path.slice(1) as 'machines' | 'papers' | 'pricing' | 'finishing' | 'products'
    return flow.steps.find(item => item.key === step)?.ctaTo ?? shopRoute(path)
  }

  const navSections = computed<WorkspaceNavSection[]>(() => {
    const sections: WorkspaceNavSection[] = [
      {
        label: t('adminWorkspace.workspace'),
        kind: 'workspace',
        items: [
          { label: t('adminWorkspace.dashboard'), to: '/dashboard', icon: 'i-lucide-layout-dashboard', helper: t('adminWorkspace.dashboardHelper') },
          { label: t('adminWorkspace.setupGuide'), to: '/dashboard/setup-guide', icon: 'i-lucide-list-checks', helper: t('adminWorkspace.setupGuideHelper') },
          { label: t('adminWorkspace.requestsQuotes'), to: '/quote-draft', icon: 'i-lucide-files', helper: t('adminWorkspace.requestsQuotesHelper') },
          ...(isSuperuser.value
            ? [{ label: t('adminWorkspace.metrics'), to: '/super-admin/analytics', icon: 'i-lucide-chart-column', helper: t('adminWorkspace.metricsHelper') }]
            : []),
        ],
      },
      {
        label: t('adminWorkspace.shop'),
        kind: 'shop',
        items: [
          { label: t('adminWorkspace.shopHome'), to: shopRoute(''), icon: 'i-lucide-store', helper: t('adminWorkspace.shopHomeHelper') },
          {
            label: t('adminWorkspace.incomingRequests'),
            to: shopRoute('/incoming-requests?view=new'),
            icon: 'i-lucide-inbox',
            helper: t('adminWorkspace.incomingRequestsHelper'),
            badgeCount: activityBadgesStore.summary.shop.incoming_requests,
          },
          {
            label: t('adminWorkspace.messagesReplies'),
            to: shopRoute('/incoming-requests?view=messages'),
            icon: 'i-lucide-messages-square',
            helper: t('adminWorkspace.messagesRepliesHelper'),
            badgeCount: activityBadgesStore.summary.shop.messages_replies,
          },
          {
            label: t('adminWorkspace.pendingQuoteActions'),
            to: shopRoute('/incoming-requests?view=actions'),
            icon: 'i-lucide-list-todo',
            helper: t('adminWorkspace.pendingQuoteActionsHelper'),
            badgeCount: activityBadgesStore.summary.shop.pending_quote_actions,
          },
          { label: t('adminWorkspace.machines'), to: setupAwareShopRoute('/machines'), icon: 'i-lucide-printer', helper: t('adminWorkspace.machinesHelper') },
          { label: t('adminWorkspace.materials'), to: setupAwareShopRoute('/papers'), icon: 'i-lucide-file-stack', helper: t('adminWorkspace.materialsHelper') },
          { label: t('adminWorkspace.pricing'), to: setupAwareShopRoute('/pricing'), icon: 'i-lucide-banknote', helper: t('adminWorkspace.pricingHelper') },
          { label: t('adminWorkspace.finishing'), to: setupAwareShopRoute('/finishing'), icon: 'i-lucide-scissors', helper: t('adminWorkspace.finishingHelper') },
          { label: t('adminWorkspace.products'), to: setupAwareShopRoute('/products'), icon: 'i-lucide-package', helper: t('adminWorkspace.productsHelper') },
        ],
      },
      {
        label: t('adminWorkspace.utility'),
        kind: 'utility',
        items: [
          { label: t('adminWorkspace.home'), to: '/', icon: 'i-lucide-house', helper: t('adminWorkspace.homeHelper') },
          {
            label: t('adminWorkspace.viewPublicShop'),
            to: selectedShopSlug.value ? `/shops/${selectedShopSlug.value}` : '/shops',
            icon: 'i-lucide-external-link',
            helper: selectedShopSlug.value ? t('adminWorkspace.viewCurrentPublicShop') : t('adminWorkspace.viewPublicDirectory'),
          },
          {
            label: t('adminWorkspace.signOut'),
            icon: 'i-lucide-log-out',
            helper: t('adminWorkspace.signOutHelper'),
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
