<script setup lang="ts">
import DesignAuthFrame from '~/components/design/auth/AuthFrame.vue'

/**
 * Auth shell for Printy's real JWT screens (decision C-001). The forms stay in
 * their existing workbench views so field names, validation and store calls are
 * untouched; this layout only supplies the design surface and design tokens.
 */
const authTheme: Record<string, string> = {
  '--bg': 'var(--color-paper)',
  '--panel': 'var(--color-card)',
  '--panel2': 'var(--color-paper-2)',
  '--line': 'var(--color-line)',
  '--sub': 'var(--color-ink-2)',
  '--ink': 'var(--color-ink)',
  '--accent': 'var(--color-brand)',
  '--accentInk': 'var(--color-paper)',
}
</script>

<template>
  <DesignAuthFrame :style="authTheme">
    <slot />
  </DesignAuthFrame>
</template>
