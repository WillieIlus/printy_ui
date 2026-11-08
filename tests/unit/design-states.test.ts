import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import DesignAlert from '~/components/design/ui/Alert.vue'
import DesignEmptyNote from '~/components/design/ui/EmptyNote.vue'
import DesignFieldError from '~/components/design/ui/FieldError.vue'
import DesignLoading from '~/components/design/ui/Loading.vue'
import DesignToastHost from '~/components/design/ui/ToastHost.vue'
import { useWorkflowStore } from '~/stores/workflow'

const read = (path: string) => readFileSync(resolve(__dirname, '../../', path), 'utf8')

describe('Design state primitives (Phase 10)', () => {
  it('DesignAlert chooses an assertive role for errors and warnings', () => {
    const error = mount(DesignAlert, { props: { tone: 'error' } })
    const warning = mount(DesignAlert, { props: { tone: 'warning' } })
    expect(error.attributes('role')).toBe('alert')
    expect(warning.attributes('role')).toBe('alert')
    expect(error.attributes('data-design-alert')).toBeDefined()
  })

  it('DesignAlert chooses a polite role for success and info', () => {
    const success = mount(DesignAlert, { props: { tone: 'success' } })
    const info = mount(DesignAlert, { props: { tone: 'info' } })
    expect(success.attributes('role')).toBe('status')
    expect(info.attributes('role')).toBe('status')
  })

  it('DesignAlert renders title, message and actions slots', () => {
    const wrapper = mount(DesignAlert, {
      props: { tone: 'error', title: 'Could not save' },
      slots: {
        default: '<p>Server rejected the form.</p>',
        actions: '<button type="button">Retry</button>',
      },
    })
    expect(wrapper.text()).toContain('Could not save')
    expect(wrapper.text()).toContain('Server rejected the form.')
    expect(wrapper.find('button').text()).toBe('Retry')
    expect(wrapper.classes()).toContain('border-red/35')
  })

  it('DesignFieldError stays hidden until a message exists', () => {
    expect(mount(DesignFieldError).find('[data-design-field-error]').exists()).toBe(false)
    const wrapper = mount(DesignFieldError, { props: { message: 'Phone number is required' } })
    expect(wrapper.get('[data-design-field-error]').attributes('role')).toBe('alert')
    expect(wrapper.text()).toContain('Phone number is required')
  })

  it('DesignLoading renders panel, inline and skeleton variants', () => {
    const panel = mount(DesignLoading, { props: { label: 'Loading jobs…' } })
    expect(panel.get('[data-design-loading]').attributes('role')).toBe('status')
    expect(panel.text()).toContain('Loading jobs…')

    const inline = mount(DesignLoading, { props: { variant: 'inline', label: 'Saving…' } })
    expect(inline.text()).toContain('Saving…')
    expect(inline.classes()).toContain('flex')

    const skeleton = mount(DesignLoading, { props: { variant: 'skeleton', rows: 3, label: 'Loading rows…' } })
    expect(skeleton.text()).toContain('Loading rows…')
    expect(skeleton.findAll('.animate-pulse')).toHaveLength(3)
  })

  it('DesignEmptyNote supports icons and default-slot actions', () => {
    const wrapper = mount(DesignEmptyNote, {
      props: { title: 'No clients yet', hint: 'Add one to begin', icon: 'Users' },
      slots: { default: '<button type="button">Add client</button>' },
    })
    expect(wrapper.get('[data-design-empty]').text()).toContain('No clients yet')
    expect(wrapper.text()).toContain('Add one to begin')
    expect(wrapper.find('svg').exists()).toBe(true)
    expect(wrapper.find('button').text()).toBe('Add client')
  })

  it('DesignEmptyNote keeps its original title/hint API', () => {
    const wrapper = mount(DesignEmptyNote, { props: { title: 'Nothing here' } })
    expect(wrapper.text()).toContain('Nothing here')
    expect(wrapper.find('svg').exists()).toBe(false)
    expect(wrapper.find('[data-design-empty]').classes()).toContain('border-dashed')
  })
})

describe('Design toast host', () => {
  it('renders the existing workflow toast queue without changing pushToast', () => {
    const pinia = createPinia()
    setActivePinia(pinia)
    const workflow = useWorkflowStore()
    const wrapper = mount(DesignToastHost, { global: { plugins: [pinia] } })

    expect(wrapper.get('[data-design-toasts]').attributes('aria-live')).toBe('polite')
    expect(wrapper.text()).toBe('')

    workflow.pushToast('Quote saved', '#2867b2')
    return wrapper.vm.$nextTick().then(() => {
      expect(wrapper.text()).toContain('Quote saved')
      expect(wrapper.findAll('.pointer-events-auto')).toHaveLength(1)
    })
  })
})

describe('Design state adoption (Phase 10)', () => {
  const designStateImport = /design\/ui\/(Alert|EmptyNote|FieldError|Loading|ToastHost)\.vue/

  it('design layouts mount the workflow toast host', () => {
    expect(read('app/layouts/design-public.vue')).toContain('DesignToastHost')
    expect(read('app/layouts/design-workspace.vue')).toContain('DesignToastHost')
    expect(read('app/components/design/auth/AuthFrame.vue')).toContain('DesignToastHost')
  })

  it('orphan pages use the matching design layout', () => {
    expect(read('app/pages/app/settings.vue')).toContain("layout: 'design-workspace'")
    expect(read('app/pages/app/offline-claim.vue')).toContain("layout: 'design-workspace'")
    expect(read('app/pages/app/client-invite.vue')).toContain("layout: 'design-auth'")
  })

  it('redirect-only pages keep the default layout', () => {
    for (const path of ['app/pages/app/index.vue', 'app/pages/[...slug].vue']) {
      const source = read(path)
      expect(source, path).toMatch(/navigateTo|middleware: 'proto-home'/)
      expect(source).not.toContain("layout: 'design-")
    }
  })

  it('representative pages render shared state primitives', () => {
    const pages = [
      'app/components/workbench/views/MessagesView.vue',
      'app/pages/notifications.vue',
      'app/components/workbench/views/TrackView.vue',
      'app/components/workbench/views/BuyerView.vue',
      'app/components/workbench/views/ManagerJobsView.vue',
      'app/components/workbench/views/PrinterView.vue',
      'app/components/workbench/ClientJobsPanel.vue',
      'app/components/workbench/QuoteResponsesPanel.vue',
    ]
    for (const path of pages) {
      expect(read(path), path).toMatch(designStateImport)
    }
  })

  it('auth views use the shared alert and field-error primitives', () => {
    for (const path of [
      'app/components/workbench/views/SignInView.vue',
      'app/components/workbench/views/SignUpView.vue',
      'app/components/workbench/views/ForgotPasswordView.vue',
      'app/components/workbench/views/ResetPasswordView.vue',
      'app/components/workbench/views/ChangePasswordView.vue',
      'app/components/workbench/ui/AuthField.vue',
    ]) {
      expect(read(path), path).toMatch(designStateImport)
    }
  })
})
