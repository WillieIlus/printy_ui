<template>
  <div class="min-h-screen flex flex-col bg-[var(--p-bg)] text-[var(--p-text)]">
    <header v-if="$slots.header" class="sticky top-0 z-50 shrink-0">
      <slot name="header" />
    </header>
    <AppHeader v-else />

    <div v-if="$slots.breadcrumb" class="border-b border-[var(--p-border)] bg-[var(--p-surface)] shrink-0">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-2">
        <slot name="breadcrumb" />
      </div>
    </div>

    <main class="flex-1 w-full">
      <div :class="containerClass">
        <div v-if="$slots.title || $slots.actions" class="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div v-if="$slots.title"><slot name="title" /></div>
          <div v-if="$slots.actions" class="shrink-0"><slot name="actions" /></div>
        </div>
        <slot v-if="props.container" />
      </div>
      <slot v-if="!props.container" />
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
  props.container ? 'mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8' : ''
)
</script>
