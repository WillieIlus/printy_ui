<!-- Purpose: Centered auth page layout – branded card on a subtle background. -->
<template>
  <div class="flex min-h-screen items-center justify-center bg-[var(--p-bg)] px-4 py-12">
    <div class="w-full max-w-md space-y-6">
      <!-- Brand header -->
      <div class="text-center">
        <NuxtLink to="/" class="text-2xl font-bold text-[var(--p-text)]">Printy</NuxtLink>
        <h1 v-if="title" class="mt-3 text-xl font-semibold text-[var(--p-text)]">{{ title }}</h1>
        <p v-if="subtitle" class="mt-1 text-sm text-[var(--p-text-muted)]">{{ subtitle }}</p>
      </div>

      <!-- Card -->
      <div class="rounded-[var(--radius-xl)] border border-[var(--p-border)] bg-[var(--p-surface)] p-6 shadow-[var(--shadow-md)] md:p-8">
        <slot />
      </div>

      <!-- Footer link (e.g. "Don't have an account? Sign up") -->
      <p v-if="$slots.footer" class="text-center text-sm text-[var(--p-text-muted)]">
        <slot name="footer" />
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  title?: string
  subtitle?: string
}>(), {})
</script>
