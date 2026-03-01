import type { Claim, PaginatedResponse } from '~/shared/types'
import { API } from '~/shared/api-paths'

export const useClaimStore = defineStore('claim', () => {
  const claims = ref<Claim[]>([])
  const currentClaim = ref<Claim | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const pagination = ref({
    count: 0,
    next: null as string | null,
    previous: null as string | null,
  })

  async function fetchClaims(params?: Record<string, string | number>) {
    loading.value = true
    error.value = null
    try {
      const { $api } = useNuxtApp()
      const response = await $api<PaginatedResponse<Claim>>(API.claims(), { params })
      claims.value = response.results
      pagination.value = {
        count: response.count,
        next: response.next,
        previous: response.previous,
      }
    } catch (err: unknown) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch claims'
    } finally {
      loading.value = false
    }
  }

  async function fetchClaim(pk: number) {
    loading.value = true
    error.value = null
    try {
      const { $api } = useNuxtApp()
      currentClaim.value = await $api<Claim>(API.claimDetail(pk))
    } catch (err: unknown) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch claim'
    } finally {
      loading.value = false
    }
  }

  async function createClaim(data: { shop: number; notes?: string }) {
    loading.value = true
    error.value = null
    try {
      const { $api } = useNuxtApp()
      const claim = await $api<Claim>(API.claims(), {
        method: 'POST',
        body: data,
      })
      claims.value.push(claim)
      return { success: true, claim }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to create claim'
      error.value = message
      return { success: false, error: message }
    } finally {
      loading.value = false
    }
  }

  async function verifyClaim(verificationCode: string) {
    loading.value = true
    error.value = null
    try {
      const { $api } = useNuxtApp()
      await $api(API.claimVerify(), {
        method: 'POST',
        body: { verification_code: verificationCode },
      })
      return { success: true }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Verification failed'
      error.value = message
      return { success: false, error: message }
    } finally {
      loading.value = false
    }
  }

  async function reviewClaim(pk: number, status: 'approved' | 'rejected', notes?: string) {
    loading.value = true
    error.value = null
    try {
      const { $api } = useNuxtApp()
      const claim = await $api<Claim>(API.claimReview(pk), {
        method: 'POST',
        body: { status, notes },
      })
      currentClaim.value = claim
      const idx = claims.value.findIndex((c) => c.id === pk)
      if (idx !== -1) claims.value[idx] = claim
      return { success: true, claim }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to review claim'
      error.value = message
      return { success: false, error: message }
    } finally {
      loading.value = false
    }
  }

  return {
    claims,
    currentClaim,
    loading,
    error,
    pagination,
    fetchClaims,
    fetchClaim,
    createClaim,
    verifyClaim,
    reviewClaim,
  }
})
