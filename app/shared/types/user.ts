import type { SocialLink } from './profile'

export type UserRole = 'CUSTOMER' | 'PRINTER'

export interface User {
  id: number
  email: string
  first_name: string
  last_name: string
  is_active: boolean
  date_joined: string
  last_login: string | null
  role?: UserRole
}

/** Payload for PATCH /api/users/me/ - user + profile + social links */
export interface UserUpdatePayload {
  first_name?: string
  last_name?: string
  role?: UserRole
  bio?: string
  phone?: string
  address?: string
  city?: string
  state?: string
  country?: string
  postal_code?: string
  social_links?: Array<{ platform: string; url: string } | Omit<SocialLink, 'id'>>
}
