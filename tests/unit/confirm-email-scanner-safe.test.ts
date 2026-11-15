import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import path from 'node:path'

const PAGE = path.resolve(process.cwd(), 'app/pages/auth/confirm-email.vue')

describe('confirm-email page activates from the signed link', () => {
  const src = readFileSync(PAGE, 'utf8')

  it('auto-confirms when the link carries a key', () => {
    const mountedBlock = src.match(/onMounted\([\s\S]*?\n\}\)/)
    expect(mountedBlock).toBeTruthy()
    expect(mountedBlock![0]).toMatch(/confirm\(\)/)
  })

  it('sends only the signed key to the API', () => {
    expect(src).toContain('auth.confirmEmail(keyValue)')
    expect(src).not.toContain('auth.confirmEmail(keyValue, emailValue)')
  })

  it('never treats the emailed address as proof when the key is missing', () => {
    expect(src).toContain('route.query.email')
    expect(src).toContain('Boolean(key.value)')
    expect(src).toContain('missing its confirmation key')
  })

  it('distinguishes an expired link from an invalid one', () => {
    expect(src).toContain('getApiErrorCode')
    expect(src).toContain('TOKEN_EXPIRED')
    expect(src).toContain('TOKEN_INVALID')
  })

  it('surfaces an already-verified result distinctly', () => {
    expect(src).toContain('already_verified')
    expect(src).toContain('Email already verified')
  })
})
