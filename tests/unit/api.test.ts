import { describe, it, expect } from 'vitest'
import { FetchError } from 'ofetch'

import {
  getApiErrorCode,
  getApiErrorDetail,
  getApiErrorField,
  getApiErrorMessage,
  getApiErrorPayload,
  normalizeApiList,
  type ApiRequestOptions,
} from '~/shared/api'

function makeFetchError(status: number, data: unknown): FetchError {
  const error = new FetchError('fetch failed')
  error.statusCode = status
  ;(error as { response?: { status: number; headers: { get: () => string } } }).response = {
    status,
    headers: { get: () => 'application/json' },
  }
  ;(error as { data?: unknown }).data = data
  return error
}

describe('getApiErrorDetail', () => {
  it('returns a plain string payload', () => {
    const err = makeFetchError(400, { detail: 'Bad request' })
    expect(getApiErrorDetail(err)).toBe('Bad request')
  })

  it('reads field_errors', () => {
    const err = makeFetchError(400, { field_errors: { email: ['Email is required.'] } })
    expect(getApiErrorDetail(err)).toBe('Email: Email is required.')
  })

  it('labels the manager markup field as Markup % not partner markup', () => {
    const err = makeFetchError(400, { field_errors: { markup_pct: ['Markup cannot be below 5%.'] } })
    expect(getApiErrorDetail(err)).toBe('Markup %: Markup cannot be below 5%.')
  })

  it('humanizes a required-field message', () => {
    const err = makeFetchError(400, { qty: ['This field is required.'] })
    expect(getApiErrorDetail(err)).toBe('Qty is required.')
  })

  it('returns API unreachable for failed to fetch', () => {
    const err = makeFetchError(0, 'failed to fetch')
    ;(err as { message?: string }).message = 'Failed to fetch'
    expect(getApiErrorDetail(err)).toContain("could not reach Printy's server")
  })

  it('returns generic message for non-json string body', () => {
    const err = makeFetchError(500, '<h1>oops</h1>')
    expect(getApiErrorDetail(err)).toContain('unexpected response')
  })

  it('returns null for empty error', () => {
    expect(getApiErrorDetail(null)).toBeNull()
    expect(getApiErrorDetail(undefined)).toBeNull()
  })
})

describe('getApiErrorMessage', () => {
  it('falls back to supplied default', () => {
    expect(getApiErrorMessage(null, 'fallback!')).toBe('fallback!')
  })
})

describe('getApiErrorPayload', () => {
  it('parses a FetchError data payload', () => {
    const err = makeFetchError(400, { field_errors: { a: 'x' } })
    expect(getApiErrorPayload(err)).toEqual({ field_errors: { a: 'x' } })
  })

  it('parses a generic object with data', () => {
    const err = { data: JSON.stringify({ detail: 'hi' }) }
    expect(getApiErrorPayload(err)).toEqual({ detail: 'hi' })
  })

  it('returns null for nothing', () => {
    expect(getApiErrorPayload(null)).toBeNull()
  })
})

describe('getApiErrorCode', () => {
  it('extracts a top-level code', () => {
    const err = makeFetchError(400, { code: 'DUPLICATE' })
    expect(getApiErrorCode(err)).toBe('DUPLICATE')
  })

  it('extracts a field code', () => {
    const err = makeFetchError(400, { field_errors: { code: 'INVALID' } })
    expect(getApiErrorCode(err)).toBe('INVALID')
  })

  it('filters out generic VALIDATION_ERROR', () => {
    const err = makeFetchError(400, { code: 'VALIDATION_ERROR', field_errors: { code: 'PASSWORD_TOO_WEAK' } })
    expect(getApiErrorCode(err)).toBe('PASSWORD_TOO_WEAK')
  })
})

describe('getApiErrorField', () => {
  it('pulls a field value from top level, then field_errors', () => {
    const err = makeFetchError(400, { field_errors: { email: 'already taken' } })
    expect(getApiErrorField(err, 'email')).toBe('already taken')
  })
})

describe('normalizeApiList', () => {
  it('passes arrays through', () => {
    expect(normalizeApiList([1, 2, 3])).toEqual([1, 2, 3])
  })

  it('extracts a results array', () => {
    expect(normalizeApiList({ results: ['a'], count: 1 })).toEqual(['a'])
  })

  it('returns empty for nothing', () => {
    expect(normalizeApiList(null)).toEqual([])
    expect(normalizeApiList({})).toEqual([])
  })
})