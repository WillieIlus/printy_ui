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
}

export interface AuthTokens {
  access: string
  refresh: string
}

import type { UserRole } from './user'

export interface AuthUser {
  id: number
  email: string
  first_name?: string
  last_name?: string
  name?: string
  is_active: boolean
  date_joined?: string
  is_staff?: boolean
  role?: UserRole
}
