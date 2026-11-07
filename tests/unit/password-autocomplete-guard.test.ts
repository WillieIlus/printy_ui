import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import path from 'node:path'

const VIEWS_DIR = path.resolve(process.cwd(), 'app/components/workbench/views')
const FIELD_DIR = path.resolve(process.cwd(), 'app/components/workbench/ui')

describe('password autocomplete attributes', () => {
  it('auth field forwards an explicit autocomplete attr to the input', () => {
    const src = readFileSync(path.join(FIELD_DIR, 'AuthField.vue'), 'utf8')
    expect(src).toContain('autocomplete?: string')
    expect(src).toContain(':autocomplete="autocomplete"')
  })

  it('login uses current-password', () => {
    const src = readFileSync(path.join(VIEWS_DIR, 'SignInView.vue'), 'utf8')
    expect(src).toMatch(/autocomplete="current-password"/)
  })

  it('signup uses new-password', () => {
    const src = readFileSync(path.join(VIEWS_DIR, 'SignUpView.vue'), 'utf8')
    expect(src).toContain('type="password"')
    expect(src).toMatch(/type="password"[^/>]*autocomplete="new-password"/)
  })

  it('change-password uses current-password then new-password', () => {
    const src = readFileSync(path.join(VIEWS_DIR, 'ChangePasswordView.vue'), 'utf8')
    expect(src).toContain('autocomplete="current-password"')
    const newPasswordCount = (src.match(/autocomplete="new-password"/g) || []).length
    expect(newPasswordCount).toBeGreaterThanOrEqual(2)
  })

  it('reset-password uses new-password for both fields', () => {
    const src = readFileSync(path.join(VIEWS_DIR, 'ResetPasswordView.vue'), 'utf8')
    const newPasswordCount = (src.match(/autocomplete="new-password"/g) || []).length
    expect(newPasswordCount).toBeGreaterThanOrEqual(2)
  })
})