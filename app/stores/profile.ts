import { defineStore } from 'pinia'
import { useApi } from '~/composables/useApi'
import { API } from '~/shared/api-paths'
import type { UserProfilePatch, UserProfileRecord } from '~/shared/types'

/**
 * Signed-in user's persisted profile (bio, contact details, avatar).
 * Backs the account settings screen; `/profiles/me/` auto-creates a row.
 */
export const useProfileStore = defineStore('profile', {
  state: () => ({
    profile: null as UserProfileRecord | null,
    loading: false,
    saving: false,
    uploading: false,
    error: '' as string,
  }),
  getters: {
    avatarUrl: (state) => state.profile?.avatar ?? null,
  },
  actions: {
    async fetch() {
      const { api } = useApi()
      this.loading = true
      this.error = ''
      try {
        this.profile = await api<UserProfileRecord>(API.profile.me)
      } catch {
        this.error = "We couldn't load your profile."
      } finally {
        this.loading = false
      }
    },
    async update(patch: UserProfilePatch) {
      const { api } = useApi()
      this.saving = true
      try {
        this.profile = await api<UserProfileRecord>(API.profile.me, { method: 'PATCH', body: patch })
        return this.profile
      } finally {
        this.saving = false
      }
    },
    async uploadAvatar(file: File) {
      const { api } = useApi()
      this.uploading = true
      try {
        const form = new FormData()
        form.append('avatar', file)
        this.profile = await api<UserProfileRecord>(API.profile.avatar, { method: 'POST', body: form })
        return this.profile
      } finally {
        this.uploading = false
      }
    },
  },
})
