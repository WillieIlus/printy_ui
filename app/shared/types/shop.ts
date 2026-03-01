import type { User } from './user'
import type { SocialLink } from './profile'

/** Opening hours from API - matches Django OpeningHours model */
export interface OpeningHours {
  id: number
  weekday: number
  weekday_display?: string
  from_hour: string | null
  to_hour: string | null
  is_closed: boolean
  created_at?: string
  updated_at?: string
}

/** @deprecated Use OpeningHours - kept for backward compatibility */
export type ShopHours = OpeningHours

export interface ShopMember {
  id: number
  shop: number
  user: number
  role: 'owner' | 'manager' | 'staff'
  joined_at: string
  user_details?: User
}

/** Owner object from ShopDetailSerializer (nested) */
export interface ShopOwner {
  id: number
  email: string
  first_name: string
  last_name: string
  full_name: string
}

export interface Shop {
  id: number
  name: string
  slug: string
  description: string | null
  logo?: string | null
  cover_image?: string | null
  business_email?: string | null
  phone_number?: string | null
  address_line?: string
  city: string
  state: string
  country: string
  zip_code?: string
  latitude?: number | null
  longitude?: number | null
  is_verified: boolean
  is_active?: boolean
  /** Owner ID or nested owner object from detail view; list views may have owner_name instead */
  owner?: number | ShopOwner
  owner_name?: string
  /** From ShopDetailSerializer; list views may omit */
  opening_hours?: OpeningHours[]
  social_links?: SocialLink[]
  /** From ShopDetailSerializer; list views use owner_name instead */
  member_count?: number
  members?: ShopMember[]
  /** From ShopDetailSerializer; shop's machines/equipment */
  machines?: ShopMachine[]
  created_at: string
  updated_at?: string
}

/** Machine displayed on public shop page */
export interface ShopMachine {
  id: number
  name: string
  machine_type?: string
  type_display?: string
}

export interface ShopCreateInput {
  name: string
  description?: string | null
  business_email: string
  phone_number?: string | null
  address_line: string
  city: string
  state: string
  country: string
  zip_code: string
}
