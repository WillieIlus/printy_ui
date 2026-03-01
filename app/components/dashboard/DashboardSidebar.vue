<template>
  <aside class="fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-white dark:bg-gray-800 border-r dark:border-gray-700 overflow-y-auto shrink-0">
    <nav class="p-4 space-y-2">
      <NuxtLink
        v-for="item in menuItems"
        :key="item.to"
        :to="item.to"
        class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        active-class="bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400"
      >
        <UIcon :name="item.icon" class="w-5 h-5 shrink-0" />
        <span>{{ item.label }}</span>
      </NuxtLink>
      <div class="pt-4 border-t dark:border-gray-700">
        <h3 class="px-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">My Shops</h3>
        <template v-if="shopStore.myShops.length">
          <NuxtLink
            v-for="shop in shopStore.myShops"
            :key="shop.slug"
            :to="`/dashboard/shops/${shop.slug}`"
            class="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            active-class="bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400"
          >
            <UAvatar :src="shop.logo ?? undefined" :alt="shop.name" size="xs" />
            <span class="truncate">{{ shop.name }}</span>
          </NuxtLink>
        </template>
        <p v-else class="px-3 text-sm text-gray-500 dark:text-gray-400">No shops yet</p>
        <NuxtLink
          to="/dashboard/shops/create"
          class="mt-2 flex items-center gap-3 px-3 py-2 rounded-lg text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors"
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
  { to: '/dashboard/quotes', icon: 'i-lucide-file-text', label: 'My Quotes' },
  { to: '/dashboard/claims', icon: 'i-lucide-shield-check', label: 'Claims' },
]
onMounted(() => shopStore.fetchMyShops())
</script>
