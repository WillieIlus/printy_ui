<!-- Purpose: Dashboard sidebar nav for both client and shop-owner roles. -->
<template>
  <aside
    :class="[
      'flex h-full flex-col border-r border-[var(--p-border)] bg-[var(--p-surface)] transition-all duration-200',
      collapsed ? 'w-16' : 'w-64',
    ]"
  >
    <div class="flex h-14 items-center justify-between border-b border-[var(--p-border)] px-3">
      <NuxtLink to="/" class="flex items-center gap-2 font-bold text-[var(--p-text)]">
        <span v-if="!collapsed">Printy</span>
        <span v-else class="text-xl text-primary-600">P</span>
      </NuxtLink>
      <BaseIconButton label="Toggle sidebar" @click="collapsed = !collapsed">
        <Icon name="lucide:menu" class="size-5" />
      </BaseIconButton>
    </div>

    <nav class="flex-1 overflow-y-auto px-2 py-3">
      <ul class="space-y-0.5">
        <li v-for="item in navItems" :key="item.to">
          <NuxtLink
            :to="item.to"
            :class="[
              'flex items-center rounded-[var(--radius-sm)] px-3 py-2 text-sm font-medium transition-colors',
              collapsed ? 'justify-center gap-0' : 'gap-3',
              'text-[var(--p-text-muted)] hover:bg-[var(--p-surface-container)] hover:text-[var(--p-text)]',
            ]"
            active-class="!bg-primary-50 dark:!bg-primary-950/30 !text-primary-700 dark:!text-primary-300"
            :title="collapsed ? item.label : undefined"
          >
            <Icon :name="item.icon" class="size-5 shrink-0" />
            <span v-if="!collapsed">{{ item.label }}</span>
          </NuxtLink>
        </li>
      </ul>
    </nav>

    <div class="border-t border-[var(--p-border)] p-3">
      <slot name="user-menu" />
    </div>
  </aside>
</template>

<script setup lang="ts">
import BaseIconButton from '~/components/atoms/BaseIconButton.vue'

const props = withDefaults(defineProps<{
  role?: 'client' | 'shop'
}>(), {
  role: 'client',
})

const collapsed = ref(false)

const clientNav = [
  { label: 'Overview',    to: '/dashboard/client',            icon: 'lucide:house' },
  { label: 'My quotes',   to: '/dashboard/client/quotes',     icon: 'lucide:file-text' },
  { label: 'Orders',      to: '/dashboard/client/orders',     icon: 'lucide:shopping-bag' },
  { label: 'Favourites',  to: '/dashboard/client/favourites', icon: 'lucide:heart' },
  { label: 'Settings',    to: '/dashboard/client/settings',   icon: 'lucide:settings' },
]

const shopNav = [
  { label: 'Overview',       to: '/dashboard/shop',           icon: 'lucide:house' },
  { label: 'Quote requests', to: '/dashboard/shop/requests',  icon: 'lucide:inbox' },
  { label: 'Products',       to: '/dashboard/shop/products',  icon: 'lucide:grid-2x2' },
  { label: 'Analytics',      to: '/dashboard/shop/analytics', icon: 'lucide:bar-chart-2' },
  { label: 'Setup',          to: '/dashboard/shop/setup',     icon: 'lucide:wrench' },
  { label: 'Settings',       to: '/dashboard/shop/settings',  icon: 'lucide:settings' },
]

const navItems = computed(() => props.role === 'shop' ? shopNav : clientNav)
</script>
