<script setup lang="ts">
/**
 * Inert placeholder for a design admin element that has no Printy data or API
 * behind it. It is always tagged NO_DATA and never renders mock values.
 */
withDefaults(defineProps<{ title: string; hint?: string }>(), {
  hint: undefined,
})
</script>

<template>
  <div data-design-placeholder="NO_DATA" class="rounded-xl border border-dashed border-line-strong bg-paper-2/60 px-5 py-4">
    <p class="font-mono text-[10px] font-semibold tracking-[0.14em] text-ink-3 uppercase">No data yet</p>
    <p class="mt-1 text-[13px] font-semibold text-ink">{{ title }}</p>
    <p v-if="hint" class="mt-1 text-[12px] leading-relaxed text-ink-2">{{ hint }}</p>
  </div>
</template>
