import { computed } from 'vue'
import {
  ADMIN_NAV,
  adminCrumbTrail,
  isAdminNavActive,
  isAwaitingQuote,
  isQuotedItem,
  type AdminCrumb,
  type AdminNavIcon,
} from '~/shared/admin-nav'
import {
  MANAGERS,
  PRINTERS,
  custody,
  managerStats,
  pulse,
} from '~/shared/workflow/printy'
import { useAdminStore } from '~/stores/admin'
import { useWorkflowStore } from '~/stores/workflow'

export interface AdminNavBadgeItem {
  key: string
  label: string
  to: string
  icon: AdminNavIcon
  blurb: string
  badge: number
}

export interface AdminNavBadgeGroup {
  key: string
  label: string
  items: AdminNavBadgeItem[]
}

/**
 * Single source of truth for admin navigation: the section list, the live
 * badge counts, the breadcrumb trail and the data every admin page renders.
 */
export function useAdminNav() {
  const route = useRoute()
  const w = useWorkflowStore()
  const a = useAdminStore()

  const pulseStats = computed(() => pulse(w.jobs))
  const custodyTotals = computed(() => custody(w.jobs))

  const awaitingQuotes = computed(() => w.jobs.filter(isAwaitingQuote))
  const quotedItems = computed(() => w.jobs.filter(isQuotedItem))
  const openDisputes = computed(() => w.jobs.filter((job) => job.status === 'disputed'))
  const resolvedDisputes = computed(() => w.jobs.filter((job) => job.dispute?.resolved))
  const riskJobs = computed(() => w.jobs.filter((job) => job.status === 'at-risk' || job.status === 'overdue' || job.status === 'disputed'))
  const onTrackJobs = computed(() => w.jobs.filter((job) => job.status === 'on-track'))
  const completedJobs = computed(() => w.jobs.filter((job) => job.status === 'completed'))

  const managersNeedingHelp = computed(() =>
    MANAGERS.filter((m) => {
      const stats = managerStats(w.jobs, m.id)
      return stats.risk + stats.disputed > 0
    }),
  )
  const printersPendingVerification = computed(() => PRINTERS.filter((printer) => !printer.verified))

  const badges = computed<Record<string, number>>(() => ({
    overview: pulseStats.value.onTrack + pulseStats.value.atRisk + pulseStats.value.overdue + pulseStats.value.disputed,
    quotes: awaitingQuotes.value.length,
    jobs: riskJobs.value.length,
    managers: managersNeedingHelp.value.length,
    printers: printersPendingVerification.value.length,
    custody: w.jobs.filter((job) => job.custody === 'held').length,
    disputes: openDisputes.value.length,
  }))

  const groups = computed<AdminNavBadgeGroup[]>(() =>
    ADMIN_NAV.map((group) => ({
      key: group.key,
      label: group.label,
      items: group.items.map((item) => ({ ...item, badge: badges.value[item.key] ?? 0 })),
    })),
  )

  const crumbs = computed<AdminCrumb[]>(() => adminCrumbTrail(route.path, a.focus))
  const isActive = (to: string) => isAdminNavActive(route.path, to)
  const busy = computed(() => a.loading || w.syncing)
  const loadError = computed(() => a.error)

  async function refresh() {
    await Promise.all([a.fetchHome(), w.syncFromApi()])
  }

  function hydrate() {
    if (w.jobs.length === 0) {
      w.syncFromApi()
    }
    if (!a.hasCounts) {
      a.fetchHome()
    }
  }

  function statsFor(managerId: string) {
    return managerStats(w.jobs, managerId)
  }
  function jobsForPrinter(printerId: string) {
    return w.jobs.filter((job) => job.printerId === printerId)
  }
  function jobsForManager(managerId: string) {
    return managerStats(w.jobs, managerId).jobs
  }

  return {
    admins: a,
    workflow: w,
    groups,
    crumbs,
    badges,
    busy,
    loadError,
    isActive,
    refresh,
    hydrate,
    counts: computed(() => a.counts),
    pulseStats,
    custodyTotals,
    awaitingQuotes,
    quotedItems,
    openDisputes,
    resolvedDisputes,
    riskJobs,
    onTrackJobs,
    completedJobs,
    managersNeedingHelp,
    printersPendingVerification,
    statsFor,
    jobsForPrinter,
    jobsForManager,
  }
}