export interface SocialLink {
  id: number
  platform: string
  url: string
  profile?: number
  shop?: number
}

export interface Profile {
  id: number
  user: number
  bio: string | null
  avatar: string | null
  phone: string | null
  address: string | null
  city: string | null
  state: string | null
  country: string | null
  postal_code: string | null
  social_links: SocialLink[]
  created_at: string
  updated_at: string
}
