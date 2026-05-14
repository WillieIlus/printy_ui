<template>
  <div class="rounded-[2rem] border border-[var(--p-border)] bg-[#101828] p-6 text-white shadow-[0_24px_44px_rgba(15,23,42,0.2)]">
    <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div class="space-y-1">
        <p class="text-[10px] font-bold uppercase tracking-[0.28em] text-white/60">{{ eyebrow }}</p>
        <h3 class="text-xl font-bold text-white">{{ title }}</h3>
        <p class="text-sm text-slate-300">{{ description }}</p>
      </div>
      <div class="flex flex-wrap gap-2">
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  eyebrow: string
  title: string
  description: string
}>()
</script>
