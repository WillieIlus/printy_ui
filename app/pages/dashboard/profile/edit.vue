<template>
  <div class="col-span-12 space-y-6">
    <DashboardPageHeader
      title="Edit profile"
      subtitle="Update your profile information"
    >
      <template #actions>
        <UButton to="/dashboard/profile" variant="ghost" size="sm">Back</UButton>
      </template>
    </DashboardPageHeader>

    <DashboardSkeletonState v-if="profileStore.loading && !profileStore.profile" variant="block" />
    <ProfileProfileEditForm
      v-else
      :profile="profileStore.profile"
      :user="userForForm"
      :loading="saving"
      @submit="onSubmit"
      @cancel="goBack"
    />
  </div>
</template>

<script setup lang="ts">
import { useProfileStore } from '~/stores/profile'
import { useUserStore } from '~/stores/user'
import { useAuthStore } from '~/stores/auth'
import type { UserUpdatePayload } from '~/shared/types'
import { parseApiError } from '~/utils/api-error'

definePageMeta({
  layout: 'dashboard',
  middleware: 'auth',
})

const profileStore = useProfileStore()
const userStore = useUserStore()
const authStore = useAuthStore()
const notification = useNotification()
const saving = ref(false)

const userForForm = computed(() => authStore.user ?? userStore.currentUser)

onMounted(() => {
  profileStore.fetchProfile()
  if (!authStore.user && !userStore.currentUser) {
    userStore.fetchMe()
  }
})

function goBack() {
  navigateTo('/dashboard/profile')
}

async function onSubmit(data: UserUpdatePayload) {
  saving.value = true
  try {
    // Update user (PATCH /api/users/me/) - first_name, last_name
    const userResult = await userStore.updateMe({
      first_name: data.first_name,
      last_name: data.last_name,
    })
    if (!userResult.success) {
      notification.error(userResult.error ?? 'Failed to update name')
      return
    }

    // Ensure profile exists (create if 404 on profiles/me/)
    let profileId = profileStore.profile?.id
    if (!profileId) {
      const created = await profileStore.createProfile()
      if (created && profileStore.profile) {
        profileId = profileStore.profile.id
      } else {
        notification.error(profileStore.error ?? 'Failed to create profile. Please try again.')
        return
      }
    }

    // Update profile (PATCH /api/profiles/me/) - bio, phone, address, etc.
    if (profileId) {
      const profileResult = await profileStore.updateProfile({
        bio: data.bio ?? null,
        phone: data.phone ?? null,
        address: data.address ?? null,
        city: data.city ?? null,
        state: data.state ?? null,
        country: data.country ?? null,
        postal_code: data.postal_code ?? null,
      })
      if (!profileResult.success) {
        notification.error(profileResult.error ?? 'Failed to update profile')
        return
      }

      // Sync social links: delete existing, add new (backend uses profiles/{id}/social-links/ and social-links/{id}/)
      const existingIds = [...(profileStore.profile?.social_links ?? [])].map((l) => l.id)
      for (const id of existingIds) {
        const delResult = await profileStore.deleteSocialLink(id)
        if (!delResult.success) {
          notification.error(delResult.error ?? 'Failed to remove link')
          return
        }
      }
      const newLinks = (data.social_links ?? []).filter((l) => l.url?.trim())
      for (const link of newLinks) {
        const addResult = await profileStore.addProfileSocialLink(profileId, {
          platform: link.platform,
          url: link.url,
        })
        if (!addResult.success) {
          notification.error(addResult.error ?? 'Failed to add link')
          return
        }
      }
    }

    await userStore.fetchMe()
    await profileStore.fetchProfile()
    if (authStore.user) {
      await authStore.fetchMe()
    }
    notification.success('Profile and social links saved successfully')
    await navigateTo('/dashboard/profile')
  } catch (err) {
    console.error('Profile save error:', err)
    notification.error(parseApiError(err, 'Update failed'))
  } finally {
    saving.value = false
  }
}
</script>
