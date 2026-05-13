import type { AuthUser } from '~/shared/types'

export type AccountCapability =
  | 'can_manage_clients'
  | 'can_source_jobs'
  | 'can_receive_assignments'
  | 'can_manage_production'
  | 'can_receive_payouts'

const CAPABILITY_KEYS: AccountCapability[] = [
  'can_manage_clients',
  'can_source_jobs',
  'can_receive_assignments',
  'can_manage_production',
  'can_receive_payouts',
]

function asBool(value: unknown): boolean {
  return value === true
}

export function getAccountCapabilities(user: AuthUser | null | undefined): Record<AccountCapability, boolean> {
  const raw = user?.capabilities && typeof user.capabilities === 'object' ? user.capabilities : {}
  return CAPABILITY_KEYS.reduce((result, key) => {
    result[key] = asBool((raw as Record<string, unknown>)[key])
    return result
  }, {} as Record<AccountCapability, boolean>)
}

export function hasAccountCapability(
  user: AuthUser | null | undefined,
  capability: AccountCapability,
): boolean {
  return getAccountCapabilities(user)[capability]
}
