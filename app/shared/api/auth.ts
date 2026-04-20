import { extractApiFeedback } from '~/utils/api-feedback'
import type { SignupCredentials } from '~/shared/types'
import { API } from '~/shared/api-paths'

export interface VerifyEmailPayload {
  key: string
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
    const message = extractApiFeedback(err, 'Signup failed').message
    return { success: false, error: message }
  }
}

/**
 * Verify email using the confirmation key from the emailed link.
 */
export async function verifyEmail(payload: VerifyEmailPayload): Promise<AuthApiResult> {
  try {
    const { $api } = useNuxtApp()
    await $api(API.auth.verifyEmail, {
      method: 'POST',
      body: {
        key: payload.key,
      },
    })
    return { success: true }
  } catch (err: unknown) {
    const message = extractApiFeedback(err, 'Verification failed').message
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
    const message = extractApiFeedback(err, 'Failed to resend verification email').message
    return { success: false, error: message }
  }
}
