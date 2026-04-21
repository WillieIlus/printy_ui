import { parseApiError } from '~/utils/api-error'

export type LoginErrorCode =
  | 'invalid_credentials'
  | 'email_not_verified'
  | 'network'
  | 'server'
  | 'rate_limited'
  | 'unknown'

export interface LoginErrorFeedback {
  code: LoginErrorCode
  message: string
}

function getErrorStatus(err: unknown): number | null {
  if (!err || typeof err !== 'object') return null

  const error = err as { statusCode?: number; status?: number }
  return error.statusCode ?? error.status ?? null
}

function getRawErrorMessage(err: unknown): string {
  if (err instanceof Error) return err.message
  if (typeof err === 'string') return err
  return parseApiError(err, '')
}

function matchesAny(message: string, patterns: string[]): boolean {
  return patterns.some(pattern => message.includes(pattern))
}

export function normalizeLoginError(err: unknown): LoginErrorFeedback {
  const status = getErrorStatus(err)
  const rawMessage = getRawErrorMessage(err).toLowerCase()
  const parsedMessage = parseApiError(err, '').toLowerCase()
  const combinedMessage = `${rawMessage} ${parsedMessage}`.trim()

  if (status === 429) {
    return {
      code: 'rate_limited',
      message: 'Too many requests. Please wait a minute before trying again.',
    }
  }

  if (
    matchesAny(combinedMessage, [
      'fetch failed',
      'failed to fetch',
      '<no response>',
      'networkerror',
      'network error',
      'network request failed',
      'load failed',
      'connection refused',
      'timed out',
      '[post]',
    ])
    || (!status && matchesAny(combinedMessage, ['typeerror', 'ecconnrefused', 'enotfound']))
  ) {
    return {
      code: 'network',
      message: "We couldn't connect right now. Please try again in a moment.",
    }
  }

  if (matchesAny(combinedMessage, ['verify your email', 'verify email', 'email verification', 'not verified', 'email address is not verified'])) {
    return {
      code: 'email_not_verified',
      message: 'Please verify your email before signing in.',
    }
  }

  if (
    status === 401
    || status === 400
    || matchesAny(combinedMessage, [
      'no active account found',
      'invalid credentials',
      'invalid login',
      'incorrect password',
      'incorrect email',
      'unable to log in',
    ])
  ) {
    return {
      code: 'invalid_credentials',
      message: 'Email or password is incorrect.',
    }
  }

  if (status !== null && status >= 500) {
    return {
      code: 'server',
      message: "We're having trouble signing you in right now.",
    }
  }

  if (matchesAny(combinedMessage, ['server error', 'internal server error', 'bad gateway', 'service unavailable'])) {
    return {
      code: 'server',
      message: "We're having trouble signing you in right now.",
    }
  }

  return {
    code: 'unknown',
    message: "We're having trouble signing you in right now.",
  }
}
