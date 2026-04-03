<template>
  <div class="min-h-screen flex flex-col bg-[var(--p-bg)] text-[var(--p-text)]">
    <!-- Top bar: back link + theme toggle -->
    <div class="shrink-0 flex items-center justify-between px-4 py-3 border-b border-[var(--p-border)] bg-[var(--p-surface)]">
      <NuxtLink
        v-if="backTo"
        :to="backTo"
        class="inline-flex items-center gap-2 text-sm font-medium text-[var(--p-text-muted)] hover:text-[var(--p-text)] transition-colors"
      >
        <UIcon name="i-lucide-arrow-left" class="w-4 h-4" />
        {{ backLabel }}
      </NuxtLink>
      <span v-else />
      <ThemeCycleButton />
    </div>

    <!-- Centered card -->
    <div class="flex-1 flex items-center justify-center p-4 sm:p-6">
      <div class="w-full max-w-md">
        <div v-if="$slots.branding || showBranding" class="text-center mb-8">
          <slot name="branding">
            <NuxtLink to="/" class="inline-flex items-center gap-3.5 group">
              <span class="grid h-12 w-12 place-items-center rounded-xl shadow-lg transition-transform group-hover:scale-105 overflow-hidden shrink-0" style="background: var(--color-primary-600);">
                <CommonPrintyLogoMark img-class="h-7 w-7" />
              </span>
              <span class="flex items-center">
                <CommonPrintyWordmark img-class="h-7 w-auto max-w-[132px]" />
              </span>
            </NuxtLink>
          </slot>
        </div>

        <div v-if="$slots.title || $slots.subtitle" class="text-center mb-8">
          <slot name="title">
            <h1 v-if="title" class="text-2xl font-bold text-[var(--p-text)]">
              {{ title }}
            </h1>
          </slot>
          <slot name="subtitle">
            <p v-if="subtitle" class="mt-2 text-sm text-[var(--p-text-muted)]">
              {{ subtitle }}
            </p>
          </slot>
        </div>

        <div class="rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface)] shadow-sm hover:shadow-md transition-shadow p-6 sm:p-8">
          <slot />
        </div>

        <div v-if="$slots.footer" class="mt-6 text-center">
          <slot name="footer" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    backTo?: string
    backLabel?: string
    title?: string
    subtitle?: string
    showBranding?: boolean
  }>(),
  {
    backTo: '/',
    backLabel: 'Back',
    title: undefined,
    subtitle: undefined,
    showBranding: true,
  }
)
</script>
