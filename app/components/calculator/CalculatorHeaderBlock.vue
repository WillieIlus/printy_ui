<template>
  <div :class="compact ? 'space-y-2' : 'space-y-3'">
    <p class="text-[0.68rem] font-extrabold uppercase tracking-[0.18em] text-flamingo-300">
      {{ eyebrow }}
    </p>
    <h2 :class="compact ? 'text-xl font-semibold text-white' : 'text-2xl font-semibold text-white sm:text-3xl'">
      {{ title }}
    </h2>
    <p class="max-w-3xl text-sm leading-6 text-slate-300">
      {{ description }}
    </p>
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  eyebrow: string
  title: string
  description: string
  compact?: boolean
}>(), {
  compact: false,
})
</script>
