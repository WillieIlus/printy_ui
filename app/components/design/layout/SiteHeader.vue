<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { getIcon } from '../../../utils/design/icon-registry'
import { DESIGN_NAV_CTA } from '../../../utils/design/nav'
import DesignButtonLink from '../ui/ButtonLink.vue'
import DesignAccountGreetingMenu from './AccountGreetingMenu.vue'
import DesignWordmark from './Wordmark.vue'
import type { DesignMarketingRole, DesignNavItem } from '../../../utils/design/nav'

const props = withDefaults(defineProps<{
  role?: DesignMarketingRole
  nav?: DesignNavItem[]
  authed?: boolean
  signInHref?: string
  quoteHref?: string
  /** Signed-in visitor's name, resolved from the auth store by the layout. */
  userName?: string
  /** Role-aware dashboard route, resolved by the auth store. */
  dashboardHref?: string
  signOut?: () => void | Promise<void>
}>(), {
  role: 'client',
  nav: () => [],
  authed: false,
  signInHref: '/sign-in',
  quoteHref: '/',
  userName: '',
  dashboardHref: '/app/buyer',
  signOut: undefined,
})

const arrow = getIcon('ArrowUpRight')
/**
 * Auth-only markup is deferred until after hydration.
 *
 * Public pages are server-rendered (the homepage is even prerendered), while
 * the session is restored on the client from cookies. Rendering `Hi {name}`
 * before that restore would hydrate a different tree than the server produced.
 * The server and first client render therefore both show Sign In, then the
 * greeting replaces it as soon as the client is mounted.
 */
const accountReady = ref(false)
onMounted(() => {
  accountReady.value = true
})
</script>

<template>
  <header class="sticky top-0 z-50 border-b border-line bg-paper/85 backdrop-blur-md">
    <div class="mx-auto flex h-16 max-w-6xl items-center justify-between gap-6 px-5 sm:px-8">
      <DesignWordmark />

      <nav
        v-if="props.nav.length > 0 || (accountReady && props.authed)"
        class="hidden items-center gap-7 md:flex"
        aria-label="Primary"
      >
        <NuxtLink
          v-for="item in props.nav"
          :key="item.href"
          :to="item.href"
          class="text-[13.5px] font-medium text-ink-2 transition-colors hover:text-brand"
        >
          {{ item.label }}
        </NuxtLink>
        <NuxtLink
          v-if="accountReady && props.authed"
          :to="props.dashboardHref"
          class="text-[13.5px] font-semibold text-brand transition-colors hover:text-brand-deep"
          data-nav-dashboard
        >
          Dashboard
        </NuxtLink>
      </nav>

      <div class="flex items-center gap-2 sm:gap-2.5" :data-role="props.role">
        <DesignAccountGreetingMenu
          v-if="accountReady && props.authed"
          :name="props.userName"
          :dashboard-href="props.dashboardHref"
          :sign-out="props.signOut"
        />
        <DesignButtonLink v-else :href="props.signInHref" tone="ghost" size="sm">
          {{ DESIGN_NAV_CTA.signIn }}
        </DesignButtonLink>
        <DesignButtonLink :href="props.quoteHref" tone="primary" size="sm">
          {{ DESIGN_NAV_CTA.instantPrice }}
          <component :is="arrow" class="h-3.5 w-3.5" />
        </DesignButtonLink>
      </div>
    </div>
  </header>
</template>
