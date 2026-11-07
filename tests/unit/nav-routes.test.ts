import { describe, it, expect } from 'vitest'
import { existsSync } from 'node:fs'
import path from 'node:path'

import { DASHBOARD_HOME_ROUTES } from '~/shared/workspace'

const PAGES_DIR = path.resolve(process.cwd(), 'app/pages')

const NAV_TARGETS: Array<[string, string]> = [
  ['/', 'index.vue'],
  ['/how-it-works', 'how-it-works.vue'],
  ['/track', 'track.vue'],
  ['/about', 'about.vue'],
  ['/contact', 'contact.vue'],
  ['/legal', 'legal.vue'],
  ['/sign-in', 'sign-in.vue'],
  ['/sign-up', 'sign-up.vue'],
  ['/app', 'app/index.vue'],
  ['/app/buyer', 'app/buyer.vue'],
  ['/app/manager', 'app/manager.vue'],
  ['/app/printer', 'app/printer.vue'],
  ['/app/printer/rates', 'app/printer/rates.vue'],
  ['/app/admin', 'app/admin.vue'],
  ['/auth/change-password', 'auth/change-password.vue'],
  ['/auth/forgot-password', 'auth/forgot-password.vue'],
]

describe('nav targets resolve to real pages', () => {
  it('every current nav target has a matching page file', () => {
    for (const [target, file] of NAV_TARGETS) {
      expect(existsSync(path.join(PAGES_DIR, file)), `${target} should resolve to ${file}`).toBe(true)
    }
  })

  it('role dashboard home routes all point to real pages', () => {
    for (const route of Object.values(DASHBOARD_HOME_ROUTES)) {
      expect(NAV_TARGETS.some(([target]) => target === route), `${route} should be a nav target`).toBe(true)
    }
  })

  it('contains no dead /dashboard/* nav targets', () => {
    for (const [target] of NAV_TARGETS) {
      expect(target).not.toMatch(/^\/dashboard\//)
    }
  })
})