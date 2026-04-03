<template>
  <header class="fixed top-0 left-0 right-0 h-16 bg-[var(--p-surface)] border-b border-[var(--p-border)] z-50">
    <div class="flex items-center justify-between h-full px-4">
      <NuxtLink to="/dashboard" class="flex items-center gap-3.5 shrink-0">
        <CommonAppLogo icon-class="h-8 w-8" />
        <span class="hidden items-center sm:flex">
          <CommonPrintyWordmark img-class="h-6 w-auto max-w-[124px]" />
        </span>
      </NuxtLink>
      <div class="flex items-center gap-4">
        <UButton variant="soft" size="sm" color="neutral" aria-label="Notifications">
          <UIcon name="i-lucide-bell" class="w-5 h-5" />
        </UButton>
        <UDropdownMenu>
          <UButton
            color="neutral"
            variant="soft"
            class="flex items-center gap-2"
            aria-label="Account menu"
          >
            <UAvatar :src="profile?.avatar ?? undefined" :alt="user?.first_name ?? undefined" size="sm" />
            <span class="hidden md:block text-[var(--p-text)]">{{ user?.first_name }} {{ user?.last_name }}</span>
            <UIcon name="i-lucide-chevron-down" class="w-4 h-4" />
          </UButton>
          <template #content>
            <UDropdownMenuItem to="/dashboard/profile">
              <template #leading><UIcon name="i-lucide-user" /></template>
              Profile Settings
            </UDropdownMenuItem>
            <UDropdownMenuSeparator />
            <UDropdownMenuItem @click="logout">
              <template #leading><UIcon name="i-lucide-log-out" /></template>
              Logout
            </UDropdownMenuItem>
          </template>
        </UDropdownMenu>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { useProfileStore } from '~/stores/profile'

const { user, logout } = useAuth()
const profileStore = useProfileStore()
const profile = computed(() => profileStore.profile)
</script>
