<template>
  <div class="min-h-screen font-sans antialiased" :class="pageClass">
    <slot />
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  variant?: 'public' | 'auth' | 'dashboard' | 'workspace' | 'dark' | 'light'
  constrained?: boolean
  bleed?: boolean
}>(), {
  variant: 'light',
  constrained: false,
  bleed: false,
})

const pageClass = computed(() => ({
  public: 'bg-[var(--p-bg)] text-[var(--p-text)]',
  auth: 'bg-[#f2f4f7] text-[#101828]',
  dashboard: 'bg-slate-50 text-slate-800',
  workspace: 'bg-[#f8f9fc] text-slate-800',
  dark: 'bg-[#101828] text-white',
  light: 'bg-white text-[#101828]',
}[props.variant]))
</script>
