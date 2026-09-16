<script setup lang="ts">
defineProps<{ active: boolean; sub?: string }>()
const emit = defineEmits<{ click: [] }>()
</script>

<template>
  <button
    class="press-key relative rounded-xl border px-3.5 py-2.5 text-left transition-colors"
    :style="{
      borderColor: active ? 'var(--accent)' : 'var(--line)',
      background: active ? 'color-mix(in srgb, var(--accent) 9%, transparent)' : 'var(--panel)',
      boxShadow: active ? 'inset 0 0 0 1px var(--accent)' : 'none',
    }"
    @click="emit('click')"
  >
    <div class="font-disp text-[13px] font-semibold leading-tight" :style="{ color: active ? 'var(--accent)' : 'var(--ink)' }"><slot /></div>
    <div v-if="sub" class="mt-0.5 font-mono2 text-[9px] uppercase tracking-[0.1em] text-[var(--sub)]">{{ sub }}</div>
  </button>
</template>