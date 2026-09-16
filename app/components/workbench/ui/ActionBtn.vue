<template>
  <button
    type="button"
    :class="['press-key inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 font-mono2 text-[11px] font-semibold uppercase tracking-[0.16em] disabled:opacity-40', className]"
    :disabled="disabled"
    :style="style"
    @click="$emit('click')"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  variant?: 'primary' | 'ghost' | 'danger'
  disabled?: boolean
  className?: string
}>(), {
  variant: 'primary',
  disabled: false,
  className: '',
})

defineEmits<{ click: [] }>()

const style = computed(() => {
  if (props.variant === 'primary') {
    return { background: 'var(--accent)', color: 'var(--accentInk)' }
  }
  if (props.variant === 'danger') {
    return { background: 'rgba(251,77,109,.14)', color: '#FB4D6D', boxShadow: 'inset 0 0 0 1px rgba(251,77,109,.35)' }
  }
  return { background: 'transparent', color: 'var(--ink)', boxShadow: 'inset 0 0 0 1px var(--line)' }
})
</script>