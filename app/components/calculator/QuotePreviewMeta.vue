<template>
  <section class="space-y-2">
    <p class="text-[0.68rem] font-extrabold uppercase tracking-[0.18em] text-flamingo-500">
      {{ title }}
    </p>
    <div class="space-y-1.5">
      <div
        v-for="line in lines"
        :key="line.label"
        class="flex items-start justify-between gap-3 text-sm"
      >
        <span class="text-slate-500">{{ line.label }}</span>
        <span class="text-right font-medium text-slate-900">{{ line.value || placeholder }}</span>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  title: string
  lines: Array<{ label: string; value: string }>
  placeholder?: string
}>(), {
  placeholder: 'Pending',
})
</script>
