import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import path from 'node:path'

const PAGE = path.resolve(process.cwd(), 'app/pages/auth/confirm-email.vue')

describe('confirm-email page is scanner-safe', () => {
  const src = readFileSync(PAGE, 'utf8')

  it('does not consume the token merely by opening the link', () => {
    const mountedBlock = src.match(/onMounted\([\s\S]*?\n\}\)/)
    expect(mountedBlock).toBeTruthy()
    expect(mountedBlock![0]).not.toMatch(/confirmEmail/)
  })

  it('confirms only from an explicit user action', () => {
    expect(src).toMatch(/@click="confirm\(\)"/)
    expect(src).toMatch(/async function confirm\(/)
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
