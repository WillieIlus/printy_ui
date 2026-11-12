<script setup lang="ts">
import { computed } from 'vue'
import { useAuthStore } from '~/stores/auth'
import DesignSiteFooter from '~/components/design/layout/SiteFooter.vue'
import DesignSiteHeader from '~/components/design/layout/SiteHeader.vue'
import DesignToastHost from '~/components/design/ui/ToastHost.vue'
import {
  designInstantQuoteHref,
  designMarketingNav,
  designMarketingRoleFromMeta,
  designWorkspaceRoleFromUser,
  type DesignWorkspaceRole,
} from '~/utils/design/nav'

const route = useRoute()
const auth = useAuthStore()

const designRole = computed<DesignWorkspaceRole | null>(() => designWorkspaceRoleFromUser(auth.user))
const marketingRole = computed(() => designMarketingRoleFromMeta(route.meta as Record<string, unknown> | undefined))
const nav = computed(() => designMarketingNav())
const instantQuoteHref = computed(() => designInstantQuoteHref(auth.isAuthenticated, designRole.value))
const signInHref = '/sign-in'

/**
 * Phase 12 follow-up: marketing links (How it works / For managers / For print
 * shops) are relegated to the site footer; the top nav keeps utility links only.
 */
const RESERVED_TOP_NAV_HREFS = ['/for-managers', '/for-shops']
const headerNav = computed(() => nav.value.filter((item) => !RESERVED_TOP_NAV_HREFS.includes(item.href)))
const relegatedMarketingLinks = computed(() => nav.value.filter((item) => RESERVED_TOP_NAV_HREFS.includes(item.href)))
</script>

<template>
  <div class="design-root" :data-role="marketingRole">
    <DesignSiteHeader
      :role="marketingRole"
      :nav="headerNav"
      :authed="auth.isAuthenticated"
      :sign-in-href="signInHref"
      :quote-href="instantQuoteHref"
    />
    <slot />
    <DesignSiteFooter :marketing-links="relegatedMarketingLinks" />
    <DesignToastHost />
  </div>
</template>
