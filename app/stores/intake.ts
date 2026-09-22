import { defineStore } from 'pinia'
import { useApi } from '~/composables/useApi'
import { API } from '~/shared/api-paths'
import type {
  IntakeSubmitPayload,
  IntakeSubmitResult,
  RecommendedManagerResponse,
  RecommendedPrintManager,
} from '~/shared/types'

/**
 * "Choose Print Manager" intake flow.
 *
 * The buyer keeps a calculator draft and, instead of blasting it to every shop,
 * either picks one of Printy's recommended managers or lets Printy auto-assign.
 */
export const useIntakeStore = defineStore('intake', {
  state: () => ({
    managers: [] as RecommendedPrintManager[],
    summary: '' as string,
    message: '' as string,
    loading: false,
    submitting: false,
    error: '' as string,
  }),
  getters: {
    hasManagers: (state) => state.managers.length > 0,
  },
  actions: {
    async fetchRecommendedManagers(params: Record<string, string | number | null | undefined>) {
      const { api } = useApi()
      const query = new URLSearchParams()
      Object.entries(params).forEach(([key, value]) => {
        if (value === null || value === undefined || value === '') {
          return
        }
        query.set(key, String(value))
      })
      const suffix = query.toString()
      this.loading = true
      this.error = ''
      try {
        const response = await api<RecommendedManagerResponse>(
          suffix ? `${API.intake.recommendedManagers}?${suffix}` : API.intake.recommendedManagers,
        )
        this.managers = Array.isArray(response.results) ? response.results : []
        this.summary = response.summary || ''
        this.message = response.message || ''
        return response
      } catch (error) {
        this.error = 'We could not load manager recommendations right now.'
        throw error
      } finally {
        this.loading = false
      }
    },
    async submit(payload: IntakeSubmitPayload) {
      const { api } = useApi()
      this.submitting = true
      this.error = ''
      try {
        return await api<IntakeSubmitResult>(API.intake.submit, {
          method: 'POST',
          body: payload,
        })
      } finally {
        this.submitting = false
      }
    },
  },
})
