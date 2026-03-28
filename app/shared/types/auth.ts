import type { UserRole } from './user'

export interface LoginCredentials {
  email: string
  password: string
  remember_me?: boolean
}

export interface SignupCredentials {
  email: string
  password: string
  password_confirm: string
  first_name: string
  last_name: string
  role?: 'client' | 'shop_owner' | 'staff'
}

export interface AuthTokens {
  access: string
  refresh: string
}

export interface AuthUser {
  id: number
  email: string
  first_name?: string
  last_name?: string
  name?: string
  preferred_language?: string
  is_active: boolean
  date_joined?: string
  is_staff?: boolean
  is_superuser?: boolean
  role?: UserRole
}
