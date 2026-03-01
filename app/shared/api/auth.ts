import type { SignupCredentials } from '~/shared/types'
import { API } from '~/shared/api-paths'
import { parseApiError } from '~/utils/api-error'

export interface VerifyEmailPayload {
  email: string
  code: string
}

export interface ResendVerificationPayload {
  email: string
}

export interface AuthApiResult<T = void> {
  success: boolean
  data?: T
  error?: string
}

/**
 * Sign up a new user. Backend may require email verification before login.
 */
export async function signup(payload: SignupCredentials): Promise<AuthApiResult> {
  try {
    const { $api } = useNuxtApp()
    await $api(API.auth.signup, {
      method: 'POST',
      body: {
        email: payload.email,
        password: payload.password,
        password_confirmation: payload.password_confirm,
        first_name: payload.first_name,
        last_name: payload.last_name,
      },
    })
    return { success: true }
  } catch (err: unknown) {
    const message = parseApiError(err, 'Signup failed')
    return { success: false, error: message }
  }
}

/**
 * Verify email with 6-digit code sent to user.
 */
export async function verifyEmail(payload: VerifyEmailPayload): Promise<AuthApiResult> {
  try {
    const { $api } = useNuxtApp()
    await $api(API.auth.verifyEmail, {
      method: 'POST',
      body: {
        email: payload.email,
        code: payload.code,
      },
    })
    return { success: true }
  } catch (err: unknown) {
    const message = parseApiError(err, 'Verification failed')
    return { success: false, error: message }
  }
}

/**
 * Resend verification code to email.
 */
export async function resendVerification(payload: ResendVerificationPayload): Promise<AuthApiResult> {
  try {
    const { $api } = useNuxtApp()
    await $api(API.auth.resendVerification, {
      method: 'POST',
      body: {
        email: payload.email,
      },
    })
    return { success: true }
  } catch (err: unknown) {
    const message = parseApiError(err, 'Failed to resend verification code')
    return { success: false, error: message }
  }
}
