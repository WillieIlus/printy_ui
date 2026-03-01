import type { Profile, SocialLink, PaginatedResponse } from '~/shared/types'
import { API } from '~/shared/api-paths'
import { parseApiError } from '~/utils/api-error'

export const useProfileStore = defineStore('profile', () => {
  const profile = ref<Profile | null>(null)
  const profiles = ref<Profile[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const pagination = ref({
    count: 0,
    next: null as string | null,
    previous: null as string | null,
  })

  async function fetchProfiles(params?: Record<string, string | number>) {
    loading.value = true
    error.value = null
    try {
      const { $api } = useNuxtApp()
      const response = await $api<PaginatedResponse<Profile>>(API.profiles(), { params })
      profiles.value = response.results
      pagination.value = {
        count: response.count,
        next: response.next,
        previous: response.previous,
      }
    } catch (err: unknown) {
      error.value = parseApiError(err, 'Failed to fetch profiles')
    } finally {
      loading.value = false
    }
  }

  async function fetchProfile() {
    loading.value = true
    error.value = null
    try {
      const { $api } = useNuxtApp()
      profile.value = await $api<Profile>(API.profileMe())
    } catch (err: unknown) {
      const e = err as { statusCode?: number; status?: number }
      const status = e?.statusCode ?? e?.status
      // 404 = no profile yet; create one so user can edit
      if (status === 404) {
        const ok = await createProfile()
        if (!ok) error.value = parseApiError(err, 'Failed to create profile')
      } else {
        error.value = parseApiError(err, 'Failed to fetch profile')
      }
    } finally {
      loading.value = false
    }
  }

  /** Create profile when none exists (POST profiles/). Backend typically auto-assigns user from JWT. */
  async function createProfile() {
    try {
      const { $api } = useNuxtApp()
      profile.value = await $api<Profile>(API.profiles(), {
        method: 'POST',
        body: {},
      })
      return true
    } catch (err: unknown) {
      error.value = parseApiError(err, 'Failed to create profile')
      return false
    }
  }

  async function fetchProfileById(pk: string | number) {
    loading.value = true
    error.value = null
    try {
      const { $api } = useNuxtApp()
      profile.value = await $api<Profile>(API.profileDetail(pk))
    } catch (err: unknown) {
      error.value = parseApiError(err, 'Failed to fetch profile')
    } finally {
      loading.value = false
    }
  }

  async function updateProfile(data: Partial<Profile>) {
    loading.value = true
    error.value = null
    try {
      const { $api } = useNuxtApp()
      profile.value = await $api<Profile>(API.profileMe(), {
        method: 'PATCH',
        body: data,
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

  async function addProfileSocialLink(profileId: number, link: Omit<SocialLink, 'id'>) {
    try {
      const { $api } = useNuxtApp()
      const newLink = await $api<SocialLink>(API.profileSocialLinks(profileId), {
        method: 'POST',
        body: link,
      })
      if (profile.value?.id === profileId) {
        profile.value.social_links = profile.value.social_links || []
        profile.value.social_links.push(newLink)
      }
      return { success: true, link: newLink }
    } catch (err: unknown) {
      const message = parseApiError(err, 'Failed to add link')
      return { success: false, error: message }
    }
  }

  async function deleteSocialLink(pk: number) {
    try {
      const { $api } = useNuxtApp()
      await $api(API.socialLinkDetail(pk), { method: 'DELETE' })
      if (profile.value) {
        profile.value.social_links = (profile.value.social_links || []).filter((l) => l.id !== pk)
      }
      return { success: true }
    } catch (err: unknown) {
      const message = parseApiError(err, 'Failed to delete link')
      return { success: false, error: message }
    }
  }

  return {
    profile,
    profiles,
    loading,
    error,
    pagination,
    fetchProfiles,
    fetchProfile,
    fetchProfileById,
    createProfile,
    updateProfile,
    addProfileSocialLink,
    deleteSocialLink,
  }
})
