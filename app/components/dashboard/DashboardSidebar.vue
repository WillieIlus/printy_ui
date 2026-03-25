<template>
  <aside class="fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 shrink-0 overflow-y-auto border-r border-[var(--p-border)] bg-[var(--p-surface-raised)]">
    <nav class="p-4 space-y-2">
      <NuxtLink
        v-for="item in menuItems"
        :key="item.to"
        :to="item.to"
        class="flex items-center gap-3 rounded-lg px-3 py-2.5 text-[0.95rem] font-medium leading-6 text-[var(--p-text-dim)] transition-colors hover:bg-[var(--p-surface-container-low)] hover:text-[var(--p-text)]"
        active-class="bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400"
      >
        <UIcon :name="item.icon" class="w-5 h-5 shrink-0" />
        <span>{{ item.label }}</span>
      </NuxtLink>
      <div class="border-t border-[var(--p-border)] pt-4">
        <h3 class="mb-2 px-3 text-[0.75rem] font-semibold uppercase tracking-[0.14em] text-[var(--p-text-muted)]">My Shops</h3>
        <template v-if="shopStore.myShops.length">
          <NuxtLink
            v-for="shop in shopStore.myShops"
            :key="shop.slug"
            :to="`/dashboard/shops/${shop.slug}`"
            class="flex items-center gap-3 rounded-lg px-3 py-2 text-[0.95rem] font-medium leading-6 text-[var(--p-text-dim)] transition-colors hover:bg-[var(--p-surface-container-low)] hover:text-[var(--p-text)]"
            active-class="bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400"
          >
            <UAvatar :src="shop.logo ?? undefined" :alt="shop.name" size="xs" />
            <span class="truncate">{{ shop.name }}</span>
          </NuxtLink>
        </template>
        <p v-else class="px-3 text-sm leading-6 text-[var(--p-text-muted)]">No shops yet</p>
        <NuxtLink
          to="/dashboard/shops/create"
          class="mt-2 flex items-center gap-3 rounded-lg px-3 py-2 text-[0.95rem] font-medium leading-6 text-primary-600 transition-colors hover:bg-primary-50 dark:text-primary-400 dark:hover:bg-primary-900/20"
        >
          <UIcon name="i-lucide-plus" class="w-5 h-5 shrink-0" />
          <span>Add New Shop</span>
        </NuxtLink>
      </div>
    </nav>
  </aside>
</template>

<script setup lang="ts">
import { useShopStore } from '~/stores/shop'

const shopStore = useShopStore()
const menuItems = [
  { to: '/dashboard', icon: 'i-lucide-layout-dashboard', label: 'Dashboard' },
  { to: '/dashboard/profile', icon: 'i-lucide-user', label: 'Profile' },
  { to: '/dashboard/shops', icon: 'i-lucide-store', label: 'My Shops' },
  { to: '/dashboard/quotes', icon: 'i-lucide-file-text', label: 'Staff Quotes' },
  { to: '/dashboard/claims', icon: 'i-lucide-shield-check', label: 'Claims' },
]
onMounted(() => shopStore.fetchMyShops())
</script>
