<template>
  <div class="col-span-12 space-y-6">
    <DashboardPageHeader
      title="Profile"
      subtitle="View and manage your profile"
    >
      <template #actions>
        <UButton to="/dashboard/profile/edit" variant="outline" size="sm">
          <UIcon name="i-lucide-edit" class="w-4 h-4 mr-2" />
          Edit profile
        </UButton>
      </template>
    </DashboardPageHeader>

    <DashboardSkeletonState v-if="profileStore.loading" variant="block" />
    <template v-else>
      <div class="col-span-12 space-y-6">
        <DashboardSectionCard>
          <ProfileProfileCard :profile="profileStore.profile">
            <template #actions>
              <UButton to="/dashboard/profile/edit" variant="outline" size="sm">
                <UIcon name="i-lucide-edit" class="w-4 h-4 mr-2" />
                Edit profile
              </UButton>
            </template>
          </ProfileProfileCard>
        </DashboardSectionCard>
        <DashboardSectionCard>
          <ProfileSocialLinksManager
            :links="profileStore.profile?.social_links"
            @remove="onRemoveLink"
          >
            <template #add-button>
              <UButton to="/dashboard/profile/edit" variant="outline" size="sm">Add link</UButton>
            </template>
          </ProfileSocialLinksManager>
        </DashboardSectionCard>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { useProfileStore } from '~/stores/profile'

definePageMeta({
  layout: 'dashboard',
  middleware: 'auth',
})

const profileStore = useProfileStore()
const notification = useNotification()

onMounted(() => profileStore.fetchProfile())

async function onRemoveLink(id: number) {
  const result = await profileStore.deleteSocialLink(id)
  if (result.success) {
    notification.success('Social link removed')
  } else {
    notification.error(result.error ?? 'Failed to remove link')
  }
}
</script>
