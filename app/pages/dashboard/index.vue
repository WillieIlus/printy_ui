<template>
  <div class="col-span-12 space-y-6">
    <DashboardPageHeader
      :title="user?.first_name ? `Welcome back, ${user.first_name}` : 'Print Dashboard'"
      subtitle="Select a shop to manage incoming requests, pricing, and print jobs."
    />

    <!-- Setup checklist card -->
    <DashboardSetupChecklistCard />

    <CommonLoadingSpinner v-if="sellerStore.loading" />
    <div v-else-if="sellerStore.shops.length" class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <div
        v-for="shop in sellerStore.shops"
        :key="shop.id"
        class="group relative flex items-center gap-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-6 transition-colors hover:border-flamingo-300 dark:hover:border-flamingo-700 hover:bg-flamingo-50/50 dark:hover:bg-flamingo-900/20"
      >
        <NuxtLink
          :to="`/dashboard/shops/${shop.slug}`"
          class="flex min-w-0 flex-1 items-center gap-4"
        >
          <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-flamingo-100 dark:bg-flamingo-900/40">
            <UIcon name="i-lucide-store" class="h-6 w-6 text-flamingo-600 dark:text-flamingo-400" />
          </div>
          <div class="min-w-0 flex-1">
            <h3 class="font-semibold text-gray-900 dark:text-white truncate">{{ shop.name }}</h3>
            <p class="text-sm text-gray-500 dark:text-gray-400">/{{ shop.slug }}</p>
          </div>
          <UIcon name="i-lucide-chevron-right" class="h-5 w-5 text-gray-400 shrink-0" />
        </NuxtLink>
        <UButton
          variant="soft"
          size="sm"
          icon="i-lucide-pencil"
          aria-label="Edit shop"
          class="shrink-0 opacity-70 group-hover:opacity-100"
          :to="`/dashboard/shops?edit=${encodeURIComponent(shop.slug)}`"
        />
      </div>
    </div>
    <DashboardEmptyState
      v-else
      title="No print shops yet"
      description="Create your first shop to start receiving quote requests and pricing jobs."
      icon="i-lucide-store"
    >
      <UButton to="/dashboard/shops/create" color="primary">Create your first print shop</UButton>
    </DashboardEmptyState>
  </div>
</template>

<script setup lang="ts">
import { useSellerStore } from '~/stores/seller'

definePageMeta({
  layout: 'dashboard',
  middleware: ['auth', 'setup-guard'],
})

const { user } = useAuth()
const sellerStore = useSellerStore()

onMounted(() => sellerStore.fetchShops())
</script>
