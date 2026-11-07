import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import path from 'node:path'

const appDir = path.resolve(process.cwd(), 'app')
const read = (rel: string) => readFileSync(path.join(appDir, rel), 'utf8')

describe('law 9.1 — buyer entry points hidden from manager/printer navigation', () => {
  const layout = read('layouts/default.vue')

  it('gates the header Quote chip and the brand home link by role', () => {
    expect(layout).toContain('const showBuyerEntries = computed')
    expect(layout).toMatch(/v-if="showBuyerEntries"/)
    expect(layout).toContain(':to="homeLink"')
    expect(layout).toContain('const homeLink = computed')
  })

  it('drops the buyer footer entries for signed-in managers/printers', () => {
    expect(layout).toContain('const footerCols = computed')
    expect(layout).toMatch(/if \(showBuyerEntries\.value\) \{/)
    expect(layout).toContain("['Get a quote', '/']")
  })

  it('never sends a signed-in non-buyer to the homepage from the Quote chip', () => {
    expect(layout).toMatch(
      /if \(authed\.value && !isBuyer\.value\) \{\s*return navigateTo\(dashPath\.value\)/,
    )
  })
})

describe('law 9.1 — homepage is guardable and guests/buyers pass through', () => {
  it('attaches the buyer-entry middleware to the homepage', () => {
    expect(read('pages/index.vue')).toContain("definePageMeta({ middleware: 'buyer-entry' })")
  })

  it('defines a buyer-entry route middleware that redirects by role', () => {
    const mw = read('middleware/buyer-entry.ts')
    expect(mw).toContain('resolveBuyerEntryRedirect')
    expect(mw).toMatch(/navigateTo\(redirect/)
  })
})

describe('law 9.1 — post-login / sign-up / email-confirmation routing', () => {
  it('sign-in resolves the destination by the active role', () => {
    const signIn = read('components/workbench/views/SignInView.vue')
    expect(signIn).toContain('resolvePostAuthRedirect')
    expect(signIn).toContain('dashboardRole: auth.dashboardRole')
  })

  it('sign-up "Enter Printy" routes by the signup role, never the generic /app', () => {
    const signUp = read('components/workbench/views/SignUpView.vue')
    expect(signUp).toContain('protoHomeRoute(protoRoleFor(ROLE_BY_MODE[mode.value]))')
    expect(signUp).not.toContain("navigateTo('/app')")
  })

  it('email confirmation routes a signed-in user by the active role', () => {
    expect(read('pages/auth/confirm-email.vue')).toContain('dashboardRouteForRole(auth.dashboardRole)')
  })
})

describe('law 9.4 — manager/printer sign-up clears the guest selection', () => {
  const signUp = read('components/workbench/views/SignUpView.vue')

  it('clears the pending manager selection for non-buyer sign-up', () => {
    expect(signUp).toMatch(/else if \(!isBuyerSignup\) \{[\s\S]{0,300}forgetPendingManagerSelection/)
  })

  it('always clears the guest draft', () => {
    expect(signUp).toContain('calc.forgetPendingDraft()')
  })
})
