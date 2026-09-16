<script setup lang="ts">
import type { Component } from 'vue'

withDefaults(
  defineProps<{ title: string; body: string; icon?: Component; index?: number; accentTitle?: boolean }>(),
  { index: 0 },
)
</script>

<template>
  <div
    class="card-in rounded-2xl border p-5"
    :style="{ borderColor: 'var(--line)', background: 'var(--panel)', animationDelay: `${index * 0.06}s` }"
  >
    <div
      v-if="icon"
      class="flex h-10 w-10 items-center justify-center rounded-xl"
      style="background: color-mix(in srgb, var(--accent) 12%, transparent)"
    >
      <component :is="icon" :size="18" style="color: var(--accent)" />
    </div>
    <h3
      class="mt-3 font-disp text-[15.5px] font-bold tracking-tight"
      :style="accentTitle ? { color: 'var(--accent)' } : undefined"
    >
      {{ title }}
    </h3>
    <p class="mt-1.5 text-[12.5px] leading-relaxed text-[var(--sub)]">{{ body }}</p>
  </div>
</template>

<style scoped>
@keyframes printy-card-in {
  from {
    opacity: 0;
    transform: translateY(18px);
  }
  to {
    opacity: 1;
    transform: none;
  }
}
.card-in {
  animation: printy-card-in 0.45s ease both;
}
</style>