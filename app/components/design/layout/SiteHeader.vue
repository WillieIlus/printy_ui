<script setup lang="ts">
import { getIcon } from '../../../utils/design/icon-registry'
import { DESIGN_NAV_CTA } from '../../../utils/design/nav'
import DesignButtonLink from '../ui/ButtonLink.vue'
import DesignWordmark from './Wordmark.vue'
import type { DesignMarketingRole, DesignNavItem } from '../../../utils/design/nav'

const props = withDefaults(defineProps<{
  role?: DesignMarketingRole
  nav?: DesignNavItem[]
  authed?: boolean
  signInHref?: string
  quoteHref?: string
}>(), {
  role: 'client',
  nav: () => [],
  authed: false,
  signInHref: '/sign-in',
  quoteHref: '/',
})

const arrow = getIcon('ArrowUpRight')
</script>

<template>
  <header class="sticky top-0 z-50 border-b border-line bg-paper/85 backdrop-blur-md">
    <div class="mx-auto flex h-16 max-w-6xl items-center justify-between gap-6 px-5 sm:px-8">
      <DesignWordmark />

      <nav v-if="props.nav.length > 0" class="hidden items-center gap-7 md:flex" aria-label="Primary">
        <NuxtLink
          v-for="item in props.nav"
          :key="item.href"
          :to="item.href"
          class="text-[13.5px] font-medium text-ink-2 transition-colors hover:text-brand"
        >
          {{ item.label }}
        </NuxtLink>
      </nav>

      <div class="flex items-center gap-2.5" :data-role="props.role">
        <DesignButtonLink v-if="!props.authed" :href="props.signInHref" tone="ghost" size="sm" class="hidden sm:inline-flex">
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
