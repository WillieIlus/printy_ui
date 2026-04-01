import type { SocialLink } from './profile'

export type UserRole = 'client' | 'shop_owner' | 'staff' | 'CUSTOMER' | 'PRINTER'

export interface User {
  id: number
  email: string
  name?: string
  first_name: string
  last_name: string
  avatar?: string | null
  is_active: boolean
  date_joined: string
  last_login: string | null
  role?: UserRole
  preferred_language?: string
  is_staff?: boolean
  is_superuser?: boolean
  bio?: string | null
  phone?: string | null
  address?: string | null
  city?: string | null
  state?: string | null
  country?: string | null
  postal_code?: string | null
  social_links?: SocialLink[]
}

/** Payload for PATCH /api/users/me/ - user + profile + social links */
export interface UserUpdatePayload {
  name?: string
  preferred_language?: string
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
