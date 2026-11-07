import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import {
  DEFAULT_API_BASE,
  ensureValidApiBase,
  getApiBase,
  getSafeApiBase,
} from '../../app/shared/runtime-url'

describe('API base URL resolution', () => {
  it('normalizes values with or without an /api suffix', () => {
    expect(getApiBase('https://api.printy.ke')).toBe('https://api.printy.ke/api')
    expect(getApiBase('https://api.printy.ke/api')).toBe('https://api.printy.ke/api')
    expect(getApiBase('http://127.0.0.1:8000')).toBe('http://127.0.0.1:8000/api')
    expect(getApiBase('http://127.0.0.1:8000/api/')).toBe('http://127.0.0.1:8000/api')
  })

  it('falls back to the production API base when nothing is configured', () => {
    expect(DEFAULT_API_BASE).toBe('https://api.printy.ke/api')
    expect(getApiBase(null)).toBe(DEFAULT_API_BASE)
    expect(getApiBase(undefined)).toBe(DEFAULT_API_BASE)
    expect(getApiBase({})).toBe(DEFAULT_API_BASE)
    expect(getApiBase({ apiBaseUrl: '   ' })).toBe(DEFAULT_API_BASE)
    expect(getSafeApiBase(null)).toBe(DEFAULT_API_BASE)
  })

  it('reads apiBaseUrl from the runtime config object', () => {
    expect(getSafeApiBase({ apiBaseUrl: 'https://api.printy.ke/' })).toBe('https://api.printy.ke/api')
    expect(getSafeApiBase({ apiBase: 'https://api.printy.ke' })).toBe('https://api.printy.ke/api')
  })

  it('rejects non-http(s) and empty bases', () => {
    expect(ensureValidApiBase('')).toBe(DEFAULT_API_BASE)
    expect(ensureValidApiBase('ftp://printy')).toBe(DEFAULT_API_BASE)
    expect(ensureValidApiBase('printy.ke')).toBe(DEFAULT_API_BASE)
  })

  it('allows the same-origin dev proxy base ("/api")', () => {
    // Relative bases resolve to the frontend origin itself, never to an
    // external host; nuxt.config only emits them for development builds.
    expect(ensureValidApiBase('/api')).toBe('/api')
    expect(getSafeApiBase({ apiBaseUrl: '/api' })).toBe('/api')
  })

  it('calculator config path stays a relative API path (base URL decides origin)', async () => {
    const { API } = await import('../../app/shared/api-paths')
    expect(API.calculator.config).toBe('/calculator/config/')
    expect(API.calculator.config.startsWith('http')).toBe(false)
  })
})

describe('nuxt.config.ts dev proxy wiring', () => {
  const source = readFileSync(resolve(__dirname, '../../nuxt.config.ts'), 'utf8')

  it('defaults development to the same-origin proxy base, not a hardcoded localhost URL', () => {
    expect(source).toContain("return isDevBuild ? '/api' : defaultApiBase")
    expect(source).not.toMatch(
      /process\.env\.NODE_ENV === 'production' \? defaultApiBase : 'http:\/\/127\.0\.0\.1:8000\/api'/,
    )
  })

  it('proxies /api/** to Django in development via NUXT_PROXY_TARGET', () => {
    expect(source).toContain('NUXT_PROXY_TARGET')
    expect(source).toMatch(/proxy:\s*\{\s*to:\s*`\$\{devApiProxyTarget\}\/api\/\*\*`/)
  })

  it('keeps the production guard that rejects localhost API hosts', () => {
    expect(source).toContain("localApiHosts.has(parsed.hostname.toLowerCase()) ? defaultApiBase : withApi")
    expect(source).toContain("const apiUrl = 'https://api.printy.ke'")
  })
})
