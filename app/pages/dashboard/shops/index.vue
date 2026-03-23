<template>
  <div class="space-y-6">
    <DashboardPageHeader
      title="My Shops"
      subtitle="Open a shop workspace from here. Editing now happens on the shop profile page instead of a modal."
    >
      <template #actions>
        <UButton to="/dashboard/shops/create" color="primary">
          <UIcon name="i-lucide-plus" class="mr-2 h-4 w-4" />
          Add Shop
        </UButton>
      </template>
    </DashboardPageHeader>

    <DashboardSkeletonState v-if="sellerStore.loading" variant="cards" :card-count="4" />

    <div v-else-if="sellerStore.shops.length" class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      <article
        v-for="shop in sellerStore.shops"
        :key="shop.id"
        class="rounded-3xl border border-[var(--p-border)] bg-[var(--p-surface)] p-5 shadow-sm"
      >
        <div class="flex items-start gap-3">
          <span class="flex h-12 w-12 items-center justify-center rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface-sunken)]">
            <UIcon name="i-lucide-store" class="h-5 w-5" />
          </span>
          <div class="min-w-0 flex-1">
            <p class="truncate text-base font-semibold text-[var(--p-text)]">{{ shop.name }}</p>
            <p class="mt-1 truncate text-sm text-[var(--p-text-muted)]">/{{ shop.slug }}</p>
          </div>
        </div>

        <div class="mt-5 flex gap-2">
          <UButton :to="`/dashboard/shops/${shop.slug}`" color="primary" variant="soft">Open Workspace</UButton>
          <UButton :to="`/dashboard/shops/${shop.slug}/edit`" variant="soft">Shop Profile</UButton>
        </div>
      </article>
    </div>

    <DashboardEmptyState
      v-else
      title="No shops yet"
      description="Create your first shop to unlock the admin workspace."
      icon="i-lucide-store"
    >
      <UButton to="/dashboard/shops/create" color="primary">Create Shop</UButton>
    </DashboardEmptyState>
  </div>
</template>

<script setup lang="ts">
import { useSellerStore } from '~/stores/seller'

definePageMeta({
  layout: 'dashboard',
  middleware: 'auth',
})

const sellerStore = useSellerStore()

onMounted(async () => {
  await sellerStore.fetchShops()
})
</script>
