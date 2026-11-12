import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, it, expect } from 'vitest'
import { nextTick } from 'vue'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import LegalDocument from '~/components/legal/LegalDocument.vue'
import LegalHelp from '~/components/legal/LegalHelp.vue'
import {
  HELP_GROUPS,
  LEGAL_UPDATED,
  LEGAL_VERSION,
  PRIVACY_SECTIONS,
  TERMS_SECTIONS,
} from '~/shared/legal/content'

const appDir = resolve(__dirname, '../../app')
const read = (rel: string) => readFileSync(resolve(appDir, rel), 'utf8')

describe('Legal pages (Terms, Privacy, Help)', () => {
  it('uses one shared version and last-updated constant', () => {
    expect(LEGAL_VERSION).toBe('2.0')
    expect(LEGAL_UPDATED).toBe('12 November 2026')

    for (const file of ['pages/terms.vue', 'pages/privacy.vue', 'pages/help.vue']) {
      expect(read(file), `${file} must use the shared document shell`).toMatch(/LegalDocument|LegalHelp/)
    }

    const document = read('components/legal/LegalDocument.vue')
    expect(document).toContain('LEGAL_VERSION')
    expect(document).toContain('LEGAL_UPDATED')
    expect(document).toContain('Version {{ LEGAL_VERSION }}')
    expect(document).toContain('Last updated {{ LEGAL_UPDATED }}')

    const help = read('components/legal/LegalHelp.vue')
    expect(help).toContain('LEGAL_VERSION')
    expect(help).toContain('LEGAL_UPDATED')
  })

  it('renders the Terms document with header, version, plain words, anchors and TOC', async () => {
    const wrapper = await mountSuspended(LegalDocument, {
      props: {
        title: 'Terms of Service',
        eyebrow: 'The agreement',
        intro: 'The rules for using Printy.',
        sections: TERMS_SECTIONS,
        plainWords: ['A plain-words promise.'],
        currentLabel: 'Terms',
      },
    })

    expect(wrapper.get('h1').text()).toBe('Terms of Service')
    expect(wrapper.text()).toContain(`Version ${LEGAL_VERSION}`)
    expect(wrapper.text()).toContain(`Last updated ${LEGAL_UPDATED}`)
    expect(wrapper.text()).toContain('A plain-words promise.')
    expect(wrapper.find('#who-we-are').exists()).toBe(true)
    expect(wrapper.find('a[href="#who-we-are"]').exists()).toBe(true)
    expect(wrapper.text()).toContain('Fair-price cap')
  })

  it('renders Privacy with role-visibility table and no placeholder tokens', async () => {
    const wrapper = await mountSuspended(LegalDocument, {
      props: {
        title: 'Privacy Notice',
        eyebrow: 'Your data',
        intro: 'What Printy collects.',
        sections: PRIVACY_SECTIONS,
        plainWords: ['We do not sell your personal data.'],
        currentLabel: 'Privacy',
      },
    })

    expect(wrapper.get('h1').text()).toBe('Privacy Notice')
    expect(wrapper.text()).toContain('Public tracker')
    expect(wrapper.text()).toContain('We do not sell your personal data.')
    expect(wrapper.html()).not.toMatch(/⟦|⟧/)
  })

  it('renders Help with grouped questions, search and a contact block', async () => {
    const wrapper = await mountSuspended(LegalHelp)
    const totalQuestions = HELP_GROUPS.reduce((total, group) => total + group.items.length, 0)

    expect(wrapper.get('h1').text()).toBe('How can we help?')
    expect(wrapper.findAll('details')).toHaveLength(totalQuestions)
    expect(wrapper.text()).toContain('Getting started')
    expect(wrapper.text()).toContain('support@printy.ke')

    const search = wrapper.get('#help-search')
    await search.setValue('zzzz-no-match')
    await nextTick()
    expect(wrapper.text()).toContain('No answer matched')
    expect(wrapper.findAll('details')).toHaveLength(0)

    await search.setValue('M-Pesa')
    await nextTick()
    expect(wrapper.text()).toContain('How does payment work?')
    expect(wrapper.html()).not.toMatch(/⟦|⟧/)
  })

  it('never ships owner-decision tokens or internal Parts A/E in the live content or pages', () => {
    const sources = [
      'shared/legal/content.ts',
      'pages/terms.vue',
      'pages/privacy.vue',
      'pages/help.vue',
      'pages/legal.vue',
      'components/legal/LegalDocument.vue',
      'components/legal/LegalHelp.vue',
      'components/legal/LegalBreadcrumbs.vue',
    ]

    for (const file of sources) {
      const source = read(file)
      expect(source, `${file} must not contain ⟦`).not.toContain('⟦')
      expect(source, `${file} must not contain ⟧`).not.toContain('⟧')
      expect(source, `${file} must not contain Part A`).not.toContain('PART A')
      expect(source, `${file} must not contain Part E`).not.toContain('PART E')
    }
  })

  it('uses "desk", never "dashboard", on the legal pages', () => {
    const sources = [
      'shared/legal/content.ts',
      'pages/terms.vue',
      'pages/privacy.vue',
      'pages/help.vue',
      'pages/legal.vue',
      'components/legal/LegalDocument.vue',
      'components/legal/LegalHelp.vue',
    ]

    for (const file of sources) {
      expect(read(file).toLowerCase(), `${file} must not say dashboard`).not.toContain('dashboard')
    }
  })

  it('links every public footer and workspace menu to the three pages', () => {
    const footer = read('components/design/layout/SiteFooter.vue')
    expect(footer).toContain("href: '/terms'")
    expect(footer).toContain("href: '/privacy'")
    expect(footer).toContain("href: '/help'")
    expect(footer).not.toContain('/legal#')

    const account = read('components/design/layout/AccountMenu.vue')
    expect(account).toContain("href: '/terms'")
    expect(account).toContain("href: '/privacy'")
    expect(account).toContain("href: '/help'")
    expect(account).not.toContain('/legal#')

    const workspace = read('components/design/layout/WorkspaceShell.vue')
    expect(workspace).toContain('to="/terms"')
    expect(workspace).toContain('to="/privacy"')
    expect(workspace).toContain('to="/help"')
    expect(workspace).not.toContain('/legal#')

    const legacyLayout = read('layouts/default.vue')
    expect(legacyLayout).toContain("['Terms', '/terms']")
    expect(legacyLayout).toContain("['Privacy', '/privacy']")
    expect(legacyLayout).toContain("['Help', '/help']")
  })

  it('links Terms and Privacy where the user agrees at sign-up and at payment', () => {
    const signUp = read('components/workbench/views/SignUpView.vue')
    expect(signUp).toContain('By creating an account you agree to our')
    expect(signUp).toContain('to="/terms"')
    expect(signUp).toContain('to="/privacy"')

    const checkout = read('components/workbench/MpesaCheckout.vue')
    expect(checkout).toContain('By paying you agree to our')
    expect(checkout).toContain('to="/terms"')
    expect(checkout).toContain('to="/privacy"')
  })

  it('keeps /legal as a working hub and redirects old hashes', () => {
    const legal = read('pages/legal.vue')
    expect(legal).toContain("layout: 'design-public'")
    expect(legal).toContain("to: '/terms'")
    expect(legal).toContain("to: '/privacy'")
    expect(legal).toContain("to: '/help'")
    expect(legal).toContain("hash === 'terms'")
    expect(legal).toContain('navigateTo(`/${hash}`')
  })

  it('contains the hardened promises and not the contradicted ones', () => {
    const content = read('shared/legal/content.ts')

    expect(content).toContain('releases payouts manually')
    expect(content).toContain('it remains an estimate')
    expect(content).toContain('manager-side')
    expect(content).toContain('already exists in Printy is reused')

    for (const removed of [
      '10% of the late party',
      'deemed confirmed',
      'delivery is treated as confirmed',
      'Frankfurt',
      'DigitalOcean',
    ]) {
      expect(content, `must not promise: ${removed}`).not.toContain(removed)
    }
  })
})
