<template>
  <div class="min-h-screen bg-[var(--p-bg)] text-[var(--p-text)]">
    <header class="sticky top-0 z-40 border-b border-[var(--p-border)] bg-[color:color-mix(in_srgb,var(--p-surface)_90%,white_10%)]/95 backdrop-blur">
      <div class="mx-auto flex h-16 max-w-[1500px] items-center gap-4 px-4 sm:px-6 lg:px-8">
        <UButton
          icon="i-lucide-menu"
          color="neutral"
          variant="ghost"
          class="lg:hidden"
          :aria-label="t('workspace.toggleNavigation')"
          @click="sidebarOpen = true"
        />

        <NuxtLink to="/quote-draft" class="flex min-w-0 items-center gap-3.5">
          <span class="grid h-10 w-10 place-items-center rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface)] shadow-sm sm:h-11 sm:w-11">
            <CommonPrintyLogoMark img-class="h-5.5 w-5.5 sm:h-6 sm:w-6" />
          </span>
          <div class="min-w-0 self-center">
            <CommonPrintyWordmark img-class="h-6 w-auto max-w-[124px]" />
            <p class="text-[11px] uppercase tracking-[0.24em] text-[var(--p-text-muted)]">{{ t('workspace.clientWorkspace') }}</p>
          </div>
        </NuxtLink>

        <div class="min-w-0 flex-1">
          <p class="truncate text-sm text-[var(--p-text-muted)]">{{ headerLine }}</p>
        </div>

        <ThemeCycleButton />
      </div>
    </header>

    <div class="mx-auto flex min-h-[calc(100vh-4rem)] max-w-[1500px]">
      <Transition name="fade">
        <div
          v-if="sidebarOpen"
          class="fixed inset-0 z-40 bg-slate-950/35 lg:hidden"
          @click="sidebarOpen = false"
        />
      </Transition>

      <aside
        class="fixed inset-y-0 left-0 z-50 w-[18rem] border-r border-[var(--p-border)] bg-[var(--p-surface)] transition-transform duration-200 lg:sticky lg:top-16 lg:z-10 lg:h-[calc(100vh-4rem)] lg:translate-x-0"
        :class="sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'"
      >
        <div class="flex h-full flex-col">
          <div class="border-b border-[var(--p-border)] px-4 py-4">
            <div class="flex items-center justify-between gap-3 lg:hidden">
              <p class="text-sm font-semibold text-[var(--p-text)]">{{ t('common.workspace') }}</p>
              <UButton
                color="neutral"
                variant="ghost"
                icon="i-lucide-x"
                :aria-label="t('workspace.closeNavigation')"
                @click="sidebarOpen = false"
              />
            </div>

            <div class="mt-1 rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface-sunken)] p-4 lg:mt-0">
              <p class="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--p-text-muted)]">{{ t('workspace.workspaceSummary') }}</p>
              <div class="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                <div class="rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface)] px-4 py-3">
                  <p class="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--p-text-muted)]">{{ t('workspace.myQuote') }}</p>
                  <p class="mt-1 text-lg font-extrabold text-[var(--p-text)]">{{ quoteInboxStore.quoteBuilderItemCount }}</p>
                </div>
                <div class="rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface)] px-4 py-3">
                  <p class="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--p-text-muted)]">{{ t('workspace.inbox') }}</p>
                  <p class="mt-1 text-lg font-extrabold text-[var(--p-text)]">{{ activityBadgesStore.clientTotal }}</p>
                </div>
              </div>
            </div>
          </div>

          <nav class="flex-1 space-y-6 overflow-y-auto px-4 py-5">
            <section>
              <p class="mb-2 px-3 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--p-text-muted)]">{{ t('workspace.workspaceSection') }}</p>
              <div class="space-y-1">
                <NuxtLink
                  v-for="item in workspaceItems"
                  :key="item.to"
                  :to="item.to"
                  class="flex items-start gap-3 rounded-2xl px-3 py-3 transition"
                  :class="navItemClass(item.to)"
                  @click="sidebarOpen = false"
                >
                  <span class="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[var(--p-border)] bg-[var(--p-surface)]">
                    <UIcon :name="item.icon" class="h-4 w-4" />
                  </span>
                  <span class="min-w-0 flex-1">
                    <span class="flex items-center justify-between gap-3">
                      <span class="truncate text-sm font-medium">{{ item.label }}</span>
                      <CommonBadgeCount :count="item.badgeCount" />
                    </span>
                    <span v-if="item.helper" class="mt-1 block text-xs leading-5 text-[var(--p-text-muted)]">
                      {{ item.helper }}
                    </span>
                  </span>
                </NuxtLink>
              </div>
            </section>

            <section class="border-t border-[var(--p-border)] pt-5">
              <p class="mb-2 px-3 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--p-text-muted)]">{{ t('workspace.utility') }}</p>
              <div class="space-y-1">
                <NuxtLink
                  v-for="item in utilityItems"
                  :key="item.to"
                  :to="item.to"
                  class="flex items-start gap-3 rounded-2xl px-3 py-3 text-[var(--p-text-muted)] transition hover:bg-[var(--p-surface-sunken)]/70 hover:text-[var(--p-text)]"
                  @click="sidebarOpen = false"
                >
                  <span class="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[var(--p-border)] bg-[var(--p-surface)]">
                    <UIcon :name="item.icon" class="h-4 w-4" />
                  </span>
                  <span class="min-w-0 flex-1">
                    <span class="truncate text-sm font-medium">{{ item.label }}</span>
                    <span v-if="item.helper" class="mt-1 block text-xs leading-5 text-[var(--p-text-muted)]">
                      {{ item.helper }}
                    </span>
                  </span>
                </NuxtLink>
              </div>
            </section>
          </nav>
        </div>
      </aside>

      <main class="min-w-0 flex-1 px-4 py-5 sm:px-6 lg:px-8 lg:py-8">
        <div class="mx-auto max-w-6xl">
          <slot />
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import CommonBadgeCount from '~/components/common/BadgeCount.vue'
import { useActivityBadgesStore } from '~/stores/activityBadges'
import { useAuthStore } from '~/stores/auth'
import { useQuoteInboxStore } from '~/stores/quoteInbox'

const route = useRoute()
const { t } = useI18n()
const authStore = useAuthStore()
const activityBadgesStore = useActivityBadgesStore()
const quoteInboxStore = useQuoteInboxStore()

const sidebarOpen = ref(false)

const workspaceItems = computed(() => [
  {
    to: '/quote-draft',
    label: t('workspace.myQuote'),
    icon: 'i-lucide-file-text',
    helper: t('workspace.quoteBuilderHelper'),
    badgeCount: quoteInboxStore.quoteBuilderItemCount,
  },
  {
    to: '/inbox',
    label: t('workspace.inbox'),
    icon: 'i-lucide-inbox',
    helper: t('workspace.inboxHelper'),
    badgeCount: activityBadgesStore.clientTotal,
  },
  {
    to: '/quotes',
    label: t('workspace.quoteHistory'),
    icon: 'i-lucide-history',
    helper: t('workspace.quoteHistoryHelper'),
    badgeCount: 0,
  },
  {
    to: '/account',
    label: t('workspace.account'),
    icon: 'i-lucide-user-round',
    helper: t('workspace.accountHelper'),
    badgeCount: 0,
  },
  {
    to: '/me/favorites',
    label: t('workspace.savedShops'),
    icon: 'i-lucide-heart',
    helper: t('workspace.savedShopsHelper'),
    badgeCount: 0,
  },
])

const utilityItems = computed(() => [
  {
    to: '/shops',
    label: t('workspace.browseShops'),
    icon: 'i-lucide-store',
    helper: t('workspace.browseShopsHelper'),
  },
  {
    to: '/',
    label: t('common.home'),
    icon: 'i-lucide-house',
    helper: t('workspace.homeHelper'),
  },
])

const headerLine = computed(() => {
  const name = authStore.user?.first_name || authStore.user?.name || t('common.user')
  return t('workspace.headerLine', { name })
})

function navItemClass(to: string) {
  const active = route.path === to || (to !== '/quote-draft' && route.path.startsWith(`${to}/`))
  if (active) {
    return 'bg-[var(--p-surface-sunken)] text-[var(--p-text)] shadow-sm'
  }
  return 'text-[var(--p-text-dim)] hover:bg-[var(--p-surface-sunken)]/70 hover:text-[var(--p-text)]'
}

onMounted(async () => {
  if (!authStore.isAuthenticated || !authStore.isClient) return
  await Promise.all([
    quoteInboxStore.fetchDraftFiles('dashboard').catch(() => undefined),
    activityBadgesStore.fetchSummary().catch(() => undefined),
  ])
  activityBadgesStore.startPolling()
})

onBeforeUnmount(() => {
  activityBadgesStore.stopPolling()
})
</script>
