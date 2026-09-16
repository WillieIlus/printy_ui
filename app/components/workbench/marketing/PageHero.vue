<script setup lang="ts">
import type { Component } from 'vue'

defineProps<{ eyebrow: string; title: string; lead: string; icon?: Component }>()
</script>

<template>
  <section class="mx-auto w-full max-w-[1180px] px-4 pt-12 sm:pt-16">
    <div class="hero-in max-w-[60ch]">
      <div class="flex items-center gap-2 font-mono2 text-[10px] uppercase tracking-[0.22em] text-[var(--sub)]">
        <component :is="icon" v-if="icon" :size="12" style="color: var(--accent)" />
        {{ eyebrow }}
      </div>
      <h1 class="mt-3 font-disp text-[38px] font-bold leading-[1.03] tracking-tight sm:text-[52px]" style="white-space: pre-line">{{ title }}</h1>
      <p class="mt-4 text-[15px] leading-relaxed text-[var(--sub)]">{{ lead }}</p>
    </div>
    <div class="mt-10 h-px w-full" style="background: var(--line)" />
  </section>
</template>

<style scoped>
@keyframes printy-hero-in {
  from {
    opacity: 0;
    transform: translateY(18px);
  }
  to {
    opacity: 1;
    transform: none;
  }
}
.hero-in {
  animation: printy-hero-in 0.5s ease both;
}
</style>