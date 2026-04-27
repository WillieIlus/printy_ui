<!-- Purpose: Minimal fallback loading state used by app-level suspense. -->
<template>
  <div class="flex min-h-screen items-center justify-center px-4">
    <div class="max-w-md rounded-[2rem] bg-white/90 p-8 text-center shadow-sm ring-1 ring-slate-200">
      <div class="mx-auto h-12 w-12 animate-pulse rounded-full bg-primary-100" />
      <h1 class="mt-5 text-xl font-semibold text-slate-950">{{ title }}</h1>
      <p class="mt-2 text-sm text-slate-600">{{ subtitle }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  variant?: 'full' | 'inline'
  title?: string
  subtitle?: string
  showShell?: boolean
}>(), {
  variant: 'full',
  title: 'Loading workspace',
  subtitle: 'Preparing the next screen.',
  showShell: true,
})
</script>
