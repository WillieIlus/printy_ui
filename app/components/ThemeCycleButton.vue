<template>
  <ClientOnly>
    <div
      class="inline-flex items-center gap-1 rounded-full border border-[var(--p-border)] bg-[var(--p-surface)] p-1 shadow-sm"
      aria-label="Change theme"
      role="group"
    >
      <button
        v-for="option in options"
        :key="option.value"
        type="button"
        class="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors"
        :class="option.value === colorMode.preference
          ? 'bg-[var(--p-primary-fixed)] text-[var(--p-on-primary-fixed)]'
          : 'text-[var(--p-text-dim)] hover:bg-[var(--p-surface-sunken)] hover:text-[var(--p-text)]'"
        :aria-pressed="option.value === colorMode.preference"
        @click="colorMode.preference = option.value"
      >
        <UIcon :name="option.icon" class="h-3.5 w-3.5 shrink-0" />
        <span class="hidden sm:inline">{{ option.label }}</span>
      </button>
    </div>
  </ClientOnly>
</template>

<script setup lang="ts">
const colorMode = useColorMode()

const options = [
  { value: 'light', label: 'Light', icon: 'i-lucide-sun-medium' },
  { value: 'dark', label: 'Dark', icon: 'i-lucide-moon-star' },
  { value: 'system', label: 'System', icon: 'i-lucide-monitor' },
] as const
</script>
