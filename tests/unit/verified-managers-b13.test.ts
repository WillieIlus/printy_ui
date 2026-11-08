import { describe, it, expect, vi, beforeEach } from 'vitest'
import { flushPromises } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import VerifiedManagersStrip from '~/components/design/marketing/VerifiedManagersStrip.vue'
import ClientMyManagersPanel from '~/components/workbench/ClientMyManagersPanel.vue'
import {
  VERIFIED_MANAGERS_CHOICE_KEY,
  clearVerifiedManagersChoice,
  readVerifiedManagersChoice,
  saveVerifiedManagersChoice,
  type ChoiceStorage,
} from '~/shared/verified-managers'

const { publicApiMock, apiMock } = vi.hoisted(() => ({
  publicApiMock: vi.fn(),
  apiMock: vi.fn(),
}))

vi.mock('~/composables/useApi', () => ({
  useApi: () => ({
    api: apiMock,
    publicApi: publicApiMock,
    publicApiNoAuth: publicApiMock,
    getMediaUrl: vi.fn(),
  }),
}))

function memoryStorage(): ChoiceStorage & { dump(): Record<string, string> } {
  const data: Record<string, string> = {}
  return {
    getItem: (key) => (key in data ? data[key]! : null),
    setItem: (key, value) => {
      data[key] = value
    },
    removeItem: (key) => {
      delete data[key]
    },
    dump: () => data,
  }
}

const featured = {
  results: [
    { first_name: 'Olive', photo: 'https://cdn.example/olive.jpg', speciality: 'Same-day booklets in Nairobi CBD', verified: true },
    { first_name: 'Wes', photo: 'https://cdn.example/wes.jpg', speciality: 'Bulk flyers', verified: true },
    { first_name: 'Flo', photo: 'https://cdn.example/flo.jpg', speciality: 'Posters and large format', verified: true },
  ],
  count: 3,
}

async function mountStrip() {
  const pinia = createPinia()
  setActivePinia(pinia)
  const wrapper = await mountSuspended(VerifiedManagersStrip, { global: { plugins: [pinia] } })
  await flushPromises()
  return wrapper
}

describe('homepage Verified managers strip (B1.3)', () => {
  beforeEach(() => {
    publicApiMock.mockReset()
  })

  it('is hidden entirely when the endpoint returns an empty list', async () => {
    publicApiMock.mockResolvedValueOnce({ results: [], count: 0 })
    const wrapper = await mountStrip()
    expect(publicApiMock).toHaveBeenCalledWith('/public/print-managers/featured/')
    expect(wrapper.find('#verified-managers').exists()).toBe(false)
    expect(wrapper.text()).not.toContain('Verified managers')
  })

  it('is hidden rather than broken when the request fails', async () => {
    publicApiMock.mockRejectedValueOnce(new Error('offline'))
    const wrapper = await mountStrip()
    expect(wrapper.find('#verified-managers').exists()).toBe(false)
  })

  it('shows photo, first name, one speciality line and the Verified badge', async () => {
    publicApiMock.mockResolvedValueOnce(featured)
    const wrapper = await mountStrip()

    const cards = wrapper.findAll('[data-test="verified-manager-card"]')
    expect(cards).toHaveLength(3)
    expect(cards[0]!.text()).toContain('Olive')
    expect(cards[0]!.text()).toContain('Same-day booklets in Nairobi CBD')
    expect(cards[0]!.find('[data-test="verified-manager-badge"]').exists()).toBe(true)
    expect(cards[0]!.find('img').attributes('src')).toBe('https://cdn.example/olive.jpg')
    // First name only - no surname is invented or requested.
    expect(cards[0]!.text()).not.toContain('Olive ')
  })

  it('carries no prices, ratings, rankings or filters', async () => {
    publicApiMock.mockResolvedValueOnce(featured)
    const wrapper = await mountStrip()
    const text = wrapper.text()
    for (const forbidden of ['KES', 'KSh', 'rating', 'Rank', 'Best match', 'Filter', 'jobs']) {
      expect(text.toLowerCase(), `strip must not show ${forbidden}`).not.toContain(forbidden.toLowerCase())
    }
    expect(wrapper.findAll('input').length).toBe(0)
    expect(wrapper.findAll('select').length).toBe(0)
  })

  it('has exactly one Request a quote button', async () => {
    publicApiMock.mockResolvedValueOnce(featured)
    const wrapper = await mountStrip()
    const ctas = wrapper.findAll('[data-test="verified-managers-cta"]')
    expect(ctas).toHaveLength(1)
    expect(ctas[0]!.text()).toContain('Request a quote')
    // No per-card action.
    expect(wrapper.findAll('[data-test="verified-manager-card"] button')).toHaveLength(0)
  })
})

describe('saved verified-managers choice', () => {
  it('saves, reads and clears the choice for a signed-out visitor', () => {
    const storage = memoryStorage()
    expect(readVerifiedManagersChoice(storage)).toBeNull()

    const saved = saveVerifiedManagersChoice(storage, new Date('2026-11-08T10:00:00Z'))
    expect(saved?.at).toBe('2026-11-08T10:00:00.000Z')
    expect(storage.dump()[VERIFIED_MANAGERS_CHOICE_KEY]).toBeTruthy()
    expect(readVerifiedManagersChoice(storage)?.at).toBe('2026-11-08T10:00:00.000Z')

    clearVerifiedManagersChoice(storage)
    expect(readVerifiedManagersChoice(storage)).toBeNull()
  })

  it('never throws without storage (SSR)', () => {
    expect(saveVerifiedManagersChoice(null)).toBeNull()
    expect(readVerifiedManagersChoice(null)).toBeNull()
    expect(() => clearVerifiedManagersChoice(null)).not.toThrow()
  })
})

describe('client dashboard "Your managers" panel (B1.3)', () => {
  beforeEach(() => {
    apiMock.mockReset()
  })

  it('renders the client managers with the Your managers stamp and no money', async () => {
    apiMock.mockResolvedValueOnce({
      results: [
        {
          id: 4,
          first_name: 'Olive',
          name: 'Olive Origin',
          photo: 'https://cdn.example/olive.jpg',
          speciality: 'Booklets',
          verified: true,
          sources: ['origin', 'paid_job'],
          paid_jobs: 2,
          last_paid_job_at: '2026-10-01T10:00:00Z',
        },
      ],
      count: 1,
    })
    const pinia = createPinia()
    setActivePinia(pinia)
    const wrapper = await mountSuspended(ClientMyManagersPanel, { global: { plugins: [pinia] } })
    await flushPromises()

    expect(apiMock).toHaveBeenCalledWith('/client-portal/my-managers/')
    expect(wrapper.find('[data-test="client-managers-panel"]').exists()).toBe(true)
    expect(wrapper.find('[data-test="your-managers-stamp"]').text()).toBe('Your managers')
    expect(wrapper.findAll('[data-test="client-manager-row"]')).toHaveLength(1)
    expect(wrapper.text()).toContain('Olive')
    expect(wrapper.text()).toContain('Booklets')
    // Verified is its own, differently drawn badge.
    expect(wrapper.find('[data-test="verified-badge"]').exists()).toBe(true)

    const text = wrapper.text().toLowerCase()
    for (const forbidden of ['fee', 'kes', 'margin', 'markup', 'payout']) {
      expect(text, `client must never see ${forbidden}`).not.toContain(forbidden)
    }
  })

  it('stays hidden when the client has no managers', async () => {
    apiMock.mockResolvedValueOnce({ results: [], count: 0 })
    const pinia = createPinia()
    setActivePinia(pinia)
    const wrapper = await mountSuspended(ClientMyManagersPanel, { global: { plugins: [pinia] } })
    await flushPromises()
    expect(wrapper.find('[data-test="client-managers-panel"]').exists()).toBe(false)
  })
})
