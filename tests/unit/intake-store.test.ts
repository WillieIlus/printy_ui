import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useIntakeStore } from '~/stores/intake'
import type { IntakeSubmitResult, RecommendedManagerResponse } from '~/shared/types'

const { apiMock } = vi.hoisted(() => ({ apiMock: vi.fn() }))

vi.mock('~/composables/useApi', () => ({
  useApi: () => ({
    api: apiMock,
    publicApi: vi.fn(),
    publicApiNoAuth: vi.fn(),
    getMediaUrl: vi.fn(),
  }),
}))

function makeResponse(overrides: Partial<RecommendedManagerResponse> = {}): RecommendedManagerResponse {
  return {
    product_type: 'business_card',
    summary: 'Three managers can run this job.',
    results: [
      {
        id: 11,
        display_name: 'Metro Print Desk',
        brand_name: 'Metro',
        specializations: ['business cards'],
        avg_response_hours: 1.5,
        completed_jobs: 240,
        satisfaction_rating: 4.9,
        distance_km: 3.2,
        is_previous_manager: false,
        badge: 'most_recommended',
        recommendation_reason: 'Best match for your spec.',
      },
    ],
    ...overrides,
  }
}

describe('intake store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    apiMock.mockReset()
  })

  it('fetches recommended managers with a query string', async () => {
    apiMock.mockResolvedValue(makeResponse())
    const store = useIntakeStore()

    await store.fetchRecommendedManagers({ product_type: 'business_card', quantity: 100, size: '90x54mm' })

    expect(apiMock).toHaveBeenCalledWith('/intake/recommended-managers/?product_type=business_card&quantity=100&size=90x54mm')
    expect(store.managers).toHaveLength(1)
    expect(store.hasManagers).toBe(true)
  })

  it('omits empty query params', async () => {
    apiMock.mockResolvedValue(makeResponse())
    const store = useIntakeStore()

    await store.fetchRecommendedManagers({ product_type: 'flyer', quantity: 500, paper_gsm: null, size: '' })

    expect(apiMock).toHaveBeenCalledWith('/intake/recommended-managers/?product_type=flyer&quantity=500')
  })

  it('records an error instead of throwing', async () => {
    apiMock.mockRejectedValue(new Error('down'))
    const store = useIntakeStore()

    await expect(store.fetchRecommendedManagers({ product_type: 'flyer', quantity: 100 })).rejects.toThrow()
    expect(store.error).toContain('could not load')
    expect(store.managers).toEqual([])
  })

  it('submits a client-selected intake', async () => {
    const result: IntakeSubmitResult = { intake_id: 5, manager_name: 'Metro Print Desk', expected_response_by: null }
    apiMock.mockResolvedValue(result)
    const store = useIntakeStore()

    const response = await store.submit({ draft_id: 9, selected_manager_id: 11, manager_selection_mode: 'client_selected' })

    expect(apiMock).toHaveBeenCalledWith('/intake/submit/', {
      method: 'POST',
      body: { draft_id: 9, selected_manager_id: 11, manager_selection_mode: 'client_selected' },
    })
    expect(response.manager_name).toBe('Metro Print Desk')
    expect(store.submitting).toBe(false)
  })
})
