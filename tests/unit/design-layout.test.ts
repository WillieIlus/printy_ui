import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'

import DesignAccountMenu from '~/components/design/layout/AccountMenu.vue'
import DesignSiteFooter from '~/components/design/layout/SiteFooter.vue'
import DesignSiteHeader from '~/components/design/layout/SiteHeader.vue'
import DesignWorkspaceShell from '~/components/design/layout/WorkspaceShell.vue'

const designPublicLayoutSource = readFileSync(resolve(__dirname, '../../app/layouts/design-public.vue'), 'utf8')
const designWorkspaceLayoutSource = readFileSync(resolve(__dirname, '../../app/layouts/design-workspace.vue'), 'utf8')

const designFiles = [
  designPublicLayoutSource,
  designWorkspaceLayoutSource,
  readFileSync(resolve(__dirname, '../../app/components/design/layout/SiteHeader.vue'), 'utf8'),
  readFileSync(resolve(__dirname, '../../app/components/design/layout/SiteFooter.vue'), 'utf8'),
  readFileSync(resolve(__dirname, '../../app/components/design/layout/WorkspaceShell.vue'), 'utf8'),
  readFileSync(resolve(__dirname, '../../app/components/design/layout/AccountMenu.vue'), 'utf8'),
  readFileSync(resolve(__dirname, '../../app/components/design/layout/Wordmark.vue'), 'utf8'),
  readFileSync(resolve(__dirname, '../../app/utils/design/nav.ts'), 'utf8'),
  readFileSync(resolve(__dirname, '../../app/assets/css/design/base.css'), 'utf8'),
]

describe('Design layouts (Phase 3)', () => {
  it('design-public layout file exists', () => {
    expect(existsSync(resolve(__dirname, '../../app/layouts/design-public.vue'))).toBe(true)
  })

  it('design-workspace layout file exists', () => {
    expect(existsSync(resolve(__dirname, '../../app/layouts/design-workspace.vue'))).toBe(true)
  })

  it('design-public layout wraps content in a design-root and renders header/footer', () => {
    expect(designPublicLayoutSource).toContain('design-root')
    expect(designPublicLayoutSource).toContain('DesignSiteHeader')
    expect(designPublicLayoutSource).toContain('DesignSiteFooter')
  })

  it('design-workspace layout wraps content in a design-root and renders the design shell', () => {
    expect(designWorkspaceLayoutSource).toContain('design-root')
    expect(designWorkspaceLayoutSource).toContain('DesignWorkspaceShell')
  })

  it('design-workspace layout passes the page slot into the workspace shell', () => {
    // Regression: the shell was rendered self-closing, so the page slot was
    // always empty and every /app dashboard showed only the chrome.
    expect(designWorkspaceLayoutSource).toMatch(/<DesignWorkspaceShell[\s\S]*?<slot\s*\/>[\s\S]*?<\/DesignWorkspaceShell>/)
  })

  it('design layouts contain no forbidden content', () => {
    for (const source of designFiles) {
      expect(source, 'design file must not reference the design source').not.toMatch(/New[_]Design/)
      expect(source, 'design file must not contain absolute URLs').not.toMatch(/https?:\/\//)
    }
  })

  it('design-site-header renders nav links, sign-in and instant price', () => {
    const wrapper = mount(DesignSiteHeader, {
      props: {
        nav: [
          { label: 'How it works', href: '/how-it-works' },
          { label: 'Track a job', href: '/track' },
        ],
        authed: false,
      },
      global: {
        stubs: {
          NuxtLink: { name: 'NuxtLink', template: '<a><slot /></a>' },
          RouterLink: { name: 'RouterLink', template: '<a><slot /></a>' },
        },
      },
    })
    expect(wrapper.find('nav[aria-label="Primary"]').exists()).toBe(true)
    expect(wrapper.text()).toContain('How it works')
    expect(wrapper.text()).toContain('Instant price')
    expect(wrapper.text()).toContain('Sign in')
  })

  it('design-site-header hides sign-in for authenticated users', () => {
    const wrapper = mount(DesignSiteHeader, {
      props: { nav: [], authed: true },
    })
    expect(wrapper.text()).not.toContain('Sign in')
  })

  it('design-site-footer renders legal links', () => {
    const wrapper = mount(DesignSiteFooter, {
      global: {
        stubs: {
          NuxtLink: { name: 'NuxtLink', template: '<a><slot /></a>' },
          RouterLink: { name: 'RouterLink', template: '<a><slot /></a>' },
        },
      },
    })
    expect(wrapper.find('footer').exists()).toBe(true)
    expect(wrapper.text()).toContain('Terms')
  })

  it('design-account-menu renders sign-out for authenticated sessions', () => {
    const wrapper = mount(DesignAccountMenu, {
      props: { name: 'Amara Wanjiru', roleLabel: 'Manager', signOut: () => {} },
    })
    expect(wrapper.find('summary').exists()).toBe(true)
    expect(wrapper.text()).toContain('Sign out')
  })

  it('design-workspace-shell renders nav items and active route state', () => {
    const wrapper = mount(DesignWorkspaceShell, {
      props: {
        role: 'client',
        sections: [
          {
            label: 'Workspace',
            items: [
              { label: 'Overview', href: '/app/buyer' },
              { label: 'My jobs', href: '/app/buyer#jobs', icon: 'jobs' },
            ],
          },
        ],
        currentPath: '/app/buyer',
        account: {
          name: 'Wanjiku Njeri',
          roleLabel: 'Buyer',
          workspaceLabel: 'Buyer workspace',
          extraLinks: [{ href: '/', label: 'Back to printy.ke' }],
        },
      },
      global: {
        stubs: {
          NuxtLink: { name: 'NuxtLink', template: '<a><slot /></a>' },
          RouterLink: { name: 'RouterLink', template: '<a><slot /></a>' },
        },
      },
    })
    expect(wrapper.text()).toContain('Overview')
    expect(wrapper.text()).toContain('My jobs')
    expect(wrapper.find('[aria-current="page"]').exists()).toBe(true)
  })
})
