<script setup lang="ts">
import { computed } from 'vue'
import { useAuthStore } from '~/stores/auth'
import DesignWorkspaceShell from '~/components/design/layout/WorkspaceShell.vue'
import DesignActiveRoleIndicator from '~/components/design/layout/ActiveRoleIndicator.vue'
import DesignToastHost from '~/components/design/ui/ToastHost.vue'
import AppBreadcrumbs from '~/components/workbench/ui/AppBreadcrumbs.vue'
import { designNavFor, designWorkspaceRoleFromUser, type DesignWorkspaceRole } from '~/utils/design/nav'
import { activeRoleLabel, activeWorkspaceLabel } from '~/shared/vocabulary'

const route = useRoute()
const auth = useAuthStore()

useHead({
  title: 'Workspace',
  meta: [{ name: 'robots', content: 'noindex' }],
})

const designRole = computed<DesignWorkspaceRole | null>(() => designWorkspaceRoleFromUser(auth.user, auth.activeRole) ?? 'client')
const sections = computed(() => designNavFor(auth.user, designRole.value))
const currentPath = computed(() => route.path)

const extraLinks = computed(() => {
  const designWorkspaceRole = designRole.value
  const links: { href: string; label: string; onSelect?: () => void }[] = []
  if (designWorkspaceRole === 'production') {
    links.push({ href: '/app/printer/shop', label: 'Shop setup' })
  }
  // Phase 12 follow-up: workspace-switch and back-to-site links are no longer
  // surfaced in the top-bar account menu (owner decision).
  return links
})

const account = computed(() => ({
  name: auth.user?.name ?? 'Printy user',
  roleLabel: activeRoleLabel(designRole.value),
  workspaceLabel: activeWorkspaceLabel(designRole.value),
  extraLinks: extraLinks.value,
  signOut: () => {
    auth.logout()
  },
}))
</script>

<template>
  <div class="design-root">
    <DesignWorkspaceShell
      :role="designRole ?? 'client'"
      :sections="sections"
      :current-path="currentPath"
      :account="account"
    >
      <!-- Law: every workspace screen carries the same breadcrumb trail. The
           admin frame renders its own, so it is not repeated here. -->
      <AppBreadcrumbs v-if="designRole !== 'super_admin'" class="mb-5" />
      <DesignActiveRoleIndicator :role="designRole ?? 'client'" class="mb-5" />
      <slot />
    </DesignWorkspaceShell>
    <DesignToastHost />
  </div>
</template>
