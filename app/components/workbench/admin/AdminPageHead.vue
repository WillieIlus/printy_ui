<template>
  <div class="flex flex-wrap items-end justify-between gap-x-4 gap-y-3">
    <div class="min-w-0">
      <div class="flex items-center gap-2 font-mono2 text-[9.5px] uppercase tracking-[0.22em] text-[var(--sub)]">
        <span class="h-1.5 w-1.5 animate-pulse rounded-full" style="background: #2FBF71" />
        {{ eyebrow }}
      </div>
      <h1 class="mt-1.5 font-disp text-[26px] font-bold leading-tight tracking-tight sm:text-[28px]">{{ title }}</h1>
      <p v-if="lede" class="mt-1.5 max-w-[68ch] text-[12.5px] leading-relaxed text-[var(--sub)]">{{ lede }}</p>
    </div>
    <div v-if="$slots.meta" class="flex shrink-0 flex-wrap items-center gap-2">
      <slot name="meta" />
    </div>
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{ eyebrow?: string; title: string; lede?: string }>(), {
  eyebrow: 'Marketplace oversight',
})
</script>