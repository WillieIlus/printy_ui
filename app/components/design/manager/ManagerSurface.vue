<script setup lang="ts">
/**
 * Maps the design workspace colour tokens onto the CSS variables the existing
 * Printy manager widgets already consume (margin panel, client link, shop
 * options, job cards). No store, API or pricing logic lives here; the manager
 * views stay API-authoritative.
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
  <div data-design-manager-surface class="text-ink" :style="surfaceTheme">
    <slot />
  </div>
</template>
