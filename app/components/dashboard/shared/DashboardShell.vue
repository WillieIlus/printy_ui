<!-- Purpose: Shared dashboard layout container with sidebar and content region. -->
<template>
  <div class="mx-auto flex min-h-screen w-full max-w-[1440px] gap-6 px-4 py-4 md:px-6">
    <aside :class="sidebarClass">
      <slot name="sidebar" />
    </aside>
    <main class="min-w-0 flex-1 rounded-[2rem] bg-[var(--p-surface)] p-5 text-[var(--p-text)] shadow-[var(--shadow-control)] ring-1 ring-[var(--p-border)] backdrop-blur md:p-8">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  sidebarTone?: 'light' | 'dark'
}>(), {
  sidebarTone: 'light',
})

const sidebarClass = computed(() => [
  'hidden w-72 shrink-0 rounded-[2rem] p-6 lg:block',
  props.sidebarTone === 'dark'
    ? 'bg-[var(--p-surface-dark)] text-[var(--p-text-on-dark)] ring-1 ring-[var(--p-border)] shadow-[var(--shadow-panel)]'
    : 'bg-[var(--p-surface)] text-[var(--p-text)] ring-1 ring-[var(--p-border)] shadow-[var(--shadow-control)]',
])
</script>
