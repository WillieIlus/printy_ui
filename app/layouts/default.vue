<template>
  <div class="min-h-screen flex flex-col bg-[#f3f6fc] dark:bg-[#101828] text-[#101828] dark:text-gray-100">
    <header v-if="$slots.header" class="sticky top-0 z-50 shrink-0">
      <slot name="header" />
    </header>
    <AppHeader v-else />

    <div v-if="$slots.breadcrumb" class="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-[#101828] shrink-0">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-2">
        <slot name="breadcrumb" />
      </div>
    </div>

    <main class="flex-1" :class="containerClass">
      <div v-if="$slots.title || $slots.actions" class="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div v-if="$slots.title"><slot name="title" /></div>
        <div v-if="$slots.actions" class="shrink-0"><slot name="actions" /></div>
      </div>
      <slot />
    </main>

    <footer v-if="$slots.footer" class="shrink-0"><slot name="footer" /></footer>
    <AppFooter v-else-if="showFooter" />
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    container?: boolean
    showFooter?: boolean
  }>(),
  { container: true, showFooter: true }
)
const containerClass = computed(() =>
  'mx-auto w-full px-4 sm:px-6 lg:px-8' + (props.container ? ' max-w-7xl' : '')
)
</script>
