import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, it, expect } from 'vitest'

const appDir = resolve(__dirname, '../../app')
const read = (rel: string) => readFileSync(resolve(appDir, rel), 'utf8')

const authPages = [
  { file: 'pages/sign-in.vue', view: 'SignInView', middleware: "middleware: 'guest'", title: 'Printy - Sign In' },
  { file: 'pages/sign-up.vue', view: 'SignUpView', middleware: "middleware: 'guest'", title: 'Printy - Sign Up' },
  { file: 'pages/auth/forgot-password.vue', view: 'ForgotPasswordView', middleware: "middleware: 'guest'", title: 'Printy - Forgot Password' },
  { file: 'pages/auth/reset-password.vue', view: 'ResetPasswordView', middleware: null, title: 'Printy - Reset Password' },
  { file: 'pages/auth/change-password.vue', view: 'ChangePasswordView', middleware: "middleware: 'auth'", title: 'Printy - Change Password' },
] as const

describe('Design auth layout (Phase 5)', () => {
  it('design-auth layout and auth frame exist', () => {
    expect(existsSync(resolve(appDir, 'layouts/design-auth.vue'))).toBe(true)
    expect(existsSync(resolve(appDir, 'components/design/auth/AuthFrame.vue'))).toBe(true)
  })

  it('design-auth maps the design tokens onto the variables the existing views consume', () => {
    const layout = read('layouts/design-auth.vue')
    expect(layout).toContain('DesignAuthFrame')
    for (const token of ['--bg', '--panel', '--panel2', '--line', '--sub', '--ink', '--accent', '--accentInk']) {
      expect(layout, `layout should map ${token}`).toContain(token)
    }

    const frame = read('components/design/auth/AuthFrame.vue')
    expect(frame).toContain('design-root')
    expect(frame).toContain('Secure JWT session')
    expect(frame).toContain('DesignWordmark')
  })
})

describe('Auth pages keep their behaviour while wearing the design-auth layout', () => {
  it('every auth page uses design-auth, keeps its view component, middleware and title', () => {
    for (const page of authPages) {
      const source = read(page.file)
      expect(source, `${page.file} should use design-auth`).toContain("layout: 'design-auth'")
      expect(source, `${page.file} should keep ${page.view}`).toContain(`<${page.view} />`)
      expect(source, `${page.file} should keep its title`).toContain(page.title)
      if (page.middleware) {
        expect(source, `${page.file} should keep ${page.middleware}`).toContain(page.middleware)
      }
    }
  })

  it('auth page files keep the field and submit logic in the existing views', () => {
    for (const page of authPages) {
      const source = read(page.file)
      expect(source, `${page.file} must not duplicate auth logic`).not.toMatch(/useAuthStore|\$fetch|auth\.signIn|auth\.signUp/)
    }
  })

  it('confirm-email keeps the same field, API calls and scanner-safe confirm action', () => {
    const source = read('pages/auth/confirm-email.vue')
    expect(source).toContain("layout: 'design-auth'")
    expect(source).toContain('Printy - Confirm Email')
    expect(source).toContain('v-model="email"')
    expect(source).toContain('type="email"')
    expect(source).toContain('auth.confirmEmail(key.value)')
    expect(source).toContain('auth.resendConfirmation(email.value.trim())')
    expect(source).toContain('@click="confirm()"')
    expect(source).toContain('@click="resend()"')
    expect(source).toContain('getApiErrorCode')
    expect(source).toContain('already_verified')
  })

  it('auth pages and the auth frame render no unsupported social, 2FA or magic-link controls', () => {
    const sources = [
      read('layouts/design-auth.vue'),
      read('components/design/auth/AuthFrame.vue'),
      ...authPages.map(page => read(page.file)),
      read('pages/auth/confirm-email.vue'),
    ]
    for (const source of sources) {
      expect(source).not.toMatch(/google|facebook|apple|2fa|magic[ -]?link|social login/i)
    }
  })
})
