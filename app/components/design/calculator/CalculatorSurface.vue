<script setup lang="ts">
/**
 * Maps the design colour tokens onto the CSS variables the existing Printy
 * calculator view already consumes. No pricing or store logic lives here.
 */
const surfaceTheme: Record<string, string> = {
  '--bg': 'var(--color-paper)',
  '--panel': 'var(--color-card)',
  '--panel2': 'var(--color-paper-2)',
  '--line': 'var(--color-line)',
  '--sub': 'var(--color-ink-2)',
  '--ink': 'var(--color-ink)',
  '--accent': 'var(--color-brand)',
  '--accentInk': 'var(--color-paper)',
  '--glow': 'color-mix(in srgb, var(--color-brand) 16%, transparent)',
}
</script>

<template>
  <div data-design-calculator-surface :style="surfaceTheme">
    <slot />
  </div>
</template>
