<template>
  <div class="w-full overflow-hidden rounded-full" :style="{ height: `${h}px`, background: 'var(--line)' }">
    <div
      class="h-full rounded-full"
      :style="{
        background: color,
        width: `${clamped * 100}%`,
        transition: 'width 0.9s cubic-bezier(0.22, 1, 0.36, 1)',
      }"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{ value: number; color?: string; h?: number }>(), { color: 'var(--accent)', h: 4 })
const clamped = computed(() => Math.min(Math.max(props.value, 0), 1))
</script>