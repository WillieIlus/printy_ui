<script setup lang="ts">
import { computed } from 'vue'
import { useAuthStore } from '~/stores/auth'
import DesignSiteFooter from '~/components/design/layout/SiteFooter.vue'
import DesignSiteHeader from '~/components/design/layout/SiteHeader.vue'
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
const nav = designMarketingNav()
const instantQuoteHref = computed(() => designInstantQuoteHref(auth.isAuthenticated, designRole.value))
const signInHref = '/sign-in'
</script>

<template>
  <div class="design-root" :data-role="marketingRole">
    <DesignSiteHeader
      :role="marketingRole"
      :nav="nav"
      :authed="auth.isAuthenticated"
      :sign-in-href="signInHref"
      :quote-href="instantQuoteHref"
    />
    <slot />
    <DesignSiteFooter />
  </div>
</template>
