<script setup lang="ts">
defineProps<{ items: [string, string][] }>()
</script>

<template>
  <div class="divide-y rounded-2xl border" style="border-color: var(--line); background: var(--panel)">
    <details v-for="([q, a], i) in items" :key="q" class="group px-5 py-4" :open="i === 0">
      <summary class="flex cursor-pointer list-none items-center justify-between gap-4">
        <span class="font-disp text-[14.5px] font-semibold">{{ q }}</span>
        <span class="shrink-0 font-mono2 text-[16px] transition-transform group-open:rotate-45" style="color: var(--accent)">+</span>
      </summary>
      <p class="mt-2.5 max-w-[70ch] text-[13px] leading-relaxed text-[var(--sub)]">{{ a }}</p>
    </details>
  </div>
</template>