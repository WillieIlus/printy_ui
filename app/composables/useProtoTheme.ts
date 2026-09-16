import { computed } from 'vue'
import { useAuthStore } from '~/stores/auth'
import { protoRoleFor } from '~/shared/workspace'
import type { Role } from '~/shared/workflow/printy'
import { PUBLIC_THEME, ROLE_META } from '~/shared/workflow/printy'

/**
 * Resolves the current canvas theme (role palette when signed in, the public
 * paper theme otherwise) and exposes it as CSS custom properties for the shell.
 */
export function useProtoTheme() {
  const auth = useAuthStore()

  const protoRole = computed<Role>(() => protoRoleFor(auth.dashboardRole))

  const meta = computed(() => ROLE_META[protoRole.value])

  const theme = computed(
    () => (auth.isAuthenticated ? ROLE_META[protoRole.value].theme : PUBLIC_THEME),
  )

  const themeVars = computed<Record<string, string>>(() => ({
    '--bg': theme.value.bg,
    '--panel': theme.value.panel,
    '--panel2': theme.value.panel2,
    '--ink': theme.value.ink,
    '--sub': theme.value.sub,
    '--line': theme.value.line,
    '--accent': theme.value.accent,
    '--accentInk': theme.value.accentInk,
    '--glow': theme.value.glow,
    '--grain-opacity': String(theme.value.grain),
    colorScheme: theme.value.dark ? 'dark' : 'light',
  }))

  return { protoRole, meta, theme, themeVars }
}