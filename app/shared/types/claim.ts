import type { Shop } from './shop'

export interface Claim {
  id: number
  shop: number
  user: number
  status: 'pending' | 'approved' | 'rejected'
  verification_code: string | null
  notes: string | null
  reviewed_by: number | null
  reviewed_at: string | null
  created_at: string
  updated_at: string
  shop_details?: Shop
}
