import { describe, it, expect, vi, beforeEach } from 'vitest'
import { nextTick } from 'vue'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import JobCardPage from '~/components/workbench/JobCardPage.vue'

const { apiMock } = vi.hoisted(() => ({ apiMock: vi.fn() }))

vi.mock('~/composables/useApi', () => ({
  useApi: () => ({ api: apiMock, publicApi: vi.fn(), publicApiNoAuth: vi.fn(), getMediaUrl: vi.fn() }),
}))

async function flush() {
  for (let i = 0; i < 8; i += 1) await nextTick()
}

const managerCard = {
  id: 'job-card-12',
  viewer: { role: 'manager' },
  jobs: [{
    id: 12,
    code: 'MJ-12',
    title: 'Business cards',
    stage: { key: 'production', label: 'Production' },
    owner: { role: 'manager', label: 'Waiting on you' },
    next_action: { code: 'dispatch_job', label: 'Assign a printer', actor: 'manager', params: { job_id: 12 } },
    thread: [],
    secondary_actions: [],
  }],
}

describe('JobCardPage — manager dispatch', () => {
  beforeEach(() => {
    apiMock.mockReset()
    apiMock.mockImplementation(async (path: string) => {
      if (path === '/managed-jobs/12/card/') return managerCard
      if (path === '/dashboard/partner/production-shops/') {
        return { results: [{ id: 9, name: 'North Press', location: 'Nairobi' }] }
      }
      throw new Error(`unexpected api call ${path}`)
    })
  })

  it('loads the printer choices and renders dispatch inside the shared card', async () => {
    const wrapper = await mountSuspended(JobCardPage, {
      props: { jobId: 12, viewerRole: 'manager', backTo: '/app/manager/jobs', backLabel: 'Back to jobs' },
    })
    await flush()

    expect(apiMock).toHaveBeenCalledWith('/managed-jobs/12/card/')
    expect(apiMock).toHaveBeenCalledWith('/dashboard/partner/production-shops/')
    const select = wrapper.get('[data-test="job-card-shop-select"]')
    expect(select.text()).toContain('North Press')
    expect(wrapper.get('[data-job-card-primary-action="true"]').text()).toContain('Assign a printer')
  })
})
