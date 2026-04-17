<template>
  <div v-if="eyebrow || title || description" :class="compact ? 'space-y-1.5' : 'space-y-2.5'">
    <p v-if="eyebrow" class="text-[0.68rem] font-extrabold uppercase tracking-[0.18em] text-flamingo-300">
      {{ eyebrow }}
    </p>
    <h2 v-if="title" :class="compact ? 'text-xl font-semibold text-white' : 'text-2xl font-semibold text-white sm:text-3xl'">
      {{ title }}
    </h2>
    <p v-if="description" class="max-w-3xl text-sm leading-6 text-slate-300">
      {{ description }}
    </p>
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  eyebrow?: string
  title?: string
  description?: string
  compact?: boolean
}>(), {
  eyebrow: '',
  title: '',
  description: '',
  compact: false,
})
</script>
