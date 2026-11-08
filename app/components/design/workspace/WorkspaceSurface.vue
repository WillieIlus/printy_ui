<script setup lang="ts">
/**
 * Shared token bridge for workspace pages (messages, notifications) that host
 * Printy widgets originally written against the legacy surface variables.
 */
const surfaceTheme: Record<string, string> = {
  '--bg': 'var(--color-paper)',
  '--panel': 'var(--color-card)',
  '--panel2': 'var(--color-paper-2)',
  '--line': 'var(--color-line)',
  '--sub': 'var(--color-ink-2)',
  '--ink': 'var(--color-ink)',
  '--accent': 'var(--color-brand)',
  '--accentInk': '#ffffff',
  '--glow': 'color-mix(in srgb, var(--color-brand) 16%, transparent)',
}
</script>

<template>
  <div data-design-workspace-surface class="text-ink" :style="surfaceTheme">
    <slot />
  </div>
</template>
