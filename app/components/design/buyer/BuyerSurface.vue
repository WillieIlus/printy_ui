<script setup lang="ts">
/**
 * Maps the design colour tokens onto the CSS variables the existing Printy
 * buyer widgets already consume (jobs, quotes, tracker strip). No store, API
 * or pricing logic lives here; the buyer view stays API-authoritative.
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
  '--manager-index': '#0e7c5f',
}
</script>

<template>
  <div data-design-buyer-surface class="text-ink" :style="surfaceTheme">
    <slot />
  </div>
</template>
