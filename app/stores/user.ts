import type { User, UserUpdatePayload, PaginatedResponse } from '~/shared/types'
import { API } from '~/shared/api-paths'
import { parseApiError } from '~/utils/api-error'

export const useUserStore = defineStore('user', () => {
  const users = ref<User[]>([])
  const currentUser = ref<User | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const pagination = ref({
    count: 0,
    next: null as string | null,
    previous: null as string | null,
  })

  async function updateMe(payload: UserUpdatePayload) {
    loading.value = true
    error.value = null
    try {
      const { $api } = useNuxtApp()
      currentUser.value = await $api<User>(API.userMe(), {
        method: 'PATCH',
        body: payload,
      })
      return { success: true }
    } catch (err: unknown) {
      const message = parseApiError(err, 'Failed to update profile')
      error.value = message
      return { success: false, error: message }
    } finally {
      loading.value = false
    }
  }

  async function fetchUsers(params?: Record<string, string | number>) {
    loading.value = true
    error.value = null
    try {
      const { $api } = useNuxtApp()
      const response = await $api<PaginatedResponse<User>>(API.users(), { params })
      users.value = response.results
      pagination.value = {
        count: response.count,
        next: response.next,
        previous: response.previous,
      }
    } catch (err: unknown) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch users'
    } finally {
      loading.value = false
    }
  }

  async function fetchMe() {
    loading.value = true
    error.value = null
    try {
      const { $api } = useNuxtApp()
      currentUser.value = await $api<User>(API.userMe())
    } catch (err: unknown) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch current user'
    } finally {
      loading.value = false
    }
  }

  async function fetchUser(pk: string | number) {
    loading.value = true
    error.value = null
    try {
      const { $api } = useNuxtApp()
      currentUser.value = await $api<User>(API.userDetail(pk))
    } catch (err: unknown) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch user'
    } finally {
      loading.value = false
    }
  }

  return {
    users,
    currentUser,
    loading,
    error,
    pagination,
    fetchUsers,
    fetchMe,
    fetchUser,
    updateMe,
  }
})
