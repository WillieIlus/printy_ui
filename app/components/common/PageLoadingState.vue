<template>
  <div
    class="flex w-full items-center justify-center"
    :class="variant === 'full' ? 'min-h-screen px-6 py-10' : 'min-h-[18rem] px-4 py-6'"
    role="status"
    aria-live="polite"
  >
    <div
      class="w-full overflow-hidden rounded-[1.75rem] border shadow-[0_24px_60px_-28px_rgba(15,23,42,0.72)]"
      :class="surfaceClass"
    >
      <div class="relative p-6 sm:p-7">
        <div class="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(240,82,36,0.14),transparent_55%)]" />

        <div class="relative flex flex-col items-center text-center" :class="variant === 'full' ? 'gap-5' : 'gap-4'">
          <div class="relative flex h-16 w-16 items-center justify-center rounded-2xl border border-[var(--p-border)] bg-[color:color-mix(in_srgb,var(--p-surface)_80%,white_20%)] shadow-inner">
            <div class="absolute inset-0 rounded-2xl bg-[radial-gradient(circle_at_center,rgba(240,82,36,0.18),transparent_60%)]" />
            <CommonPrintyLogoMark
              v-if="showLogo"
              img-class="relative h-7 w-7 opacity-95"
            />
            <UIcon
              name="i-lucide-loader-circle"
              class="absolute h-7 w-7 animate-spin text-flamingo-500"
              :class="showLogo ? 'opacity-90' : ''"
            />
          </div>

          <div class="space-y-1.5">
            <p class="text-sm font-semibold tracking-[0.08em] text-[var(--p-text)] uppercase">
              {{ title }}
            </p>
            <p v-if="subtitle" class="max-w-md text-sm leading-6 text-[var(--p-text-muted)]">
              {{ subtitle }}
            </p>
          </div>

          <div
            v-if="showShell"
            class="grid w-full max-w-lg gap-3"
            :class="variant === 'full' ? 'sm:grid-cols-2' : 'sm:grid-cols-3'"
          >
            <div
              v-for="index in shellCount"
              :key="index"
              class="h-16 animate-pulse rounded-2xl border border-[var(--p-border)] bg-[color:color-mix(in_srgb,var(--p-surface-sunken)_88%,white_12%)]"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  variant?: 'full' | 'compact'
  title?: string
  subtitle?: string
  showLogo?: boolean
  showShell?: boolean
  shellCount?: number
}>(), {
  variant: 'compact',
  title: 'Loading',
  subtitle: 'Preparing the next page.',
  showLogo: true,
  showShell: false,
  shellCount: 3,
})

const surfaceClass = computed(() => (
  props.variant === 'full'
    ? 'border-[var(--p-border)] bg-[color:color-mix(in_srgb,var(--p-surface)_92%,black_8%)] backdrop-blur'
    : 'border-[var(--p-border)] bg-[color:color-mix(in_srgb,var(--p-surface)_96%,black_4%)]'
))
</script>
