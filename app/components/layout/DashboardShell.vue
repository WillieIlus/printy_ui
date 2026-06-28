<template>
  <BasePage :variant="variant">
    <div class="min-h-screen lg:flex">
      <aside v-if="$slots.sidebar" class="hidden lg:block shrink-0">
        <slot name="sidebar" />
      </aside>
      <div class="min-w-0 flex-1">
        <header v-if="$slots.topbar || $slots.header" class="sticky top-0 z-30">
          <slot name="topbar" />
          <slot name="header" />
        </header>
        <main :class="mainClass">
          <slot name="actions" />
          <slot />
        </main>
      </div>
    </div>
  </BasePage>
</template>

<script setup lang="ts">
import BasePage from '~/components/base/BasePage.vue'

const props = withDefaults(defineProps<{
  title?: string
  subtitle?: string
  user?: Record<string, any> | null
  shop?: Record<string, any> | null
  navItems?: Array<Record<string, any>>
  activeKey?: string
  loading?: boolean
  error?: string
  variant?: 'dashboard' | 'workspace'
}>(), {
  variant: 'dashboard',
  loading: false,
  error: '',
  navItems: () => [],
})

const mainClass = computed(() => props.variant === 'workspace' ? 'px-4 py-7 lg:px-7' : 'px-4 py-6 md:px-6 lg:px-8')
</script>
