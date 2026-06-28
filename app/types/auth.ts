export type UserRole = 'client' | 'manager' | 'printshop'

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  phone?: string
  role: UserRole
  emailVerified: boolean
  createdAt: string
  avatar?: string
}

export interface SignUpData {
  email: string
  password: string
  confirmPassword: string
  firstName: string
  lastName: string
  phone?: string
  role: UserRole
  businessName?: string
  businessLocation?: string
}

export interface SignInData {
  email: string
  password: string
  remember?: boolean
}

export interface ForgotPasswordData {
  email: string
}

export interface ResetPasswordData {
  token: string
  password: string
  confirmPassword: string
}

export interface ChangePasswordData {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

export interface ProfileUpdateData {
  firstName: string
  lastName: string
  phone?: string
  avatar?: string
}
