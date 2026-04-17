<template>
  <div class="grid min-w-0 content-start gap-1.5 self-start">
    <label v-if="label" class="block min-w-0 text-[0.82rem] font-semibold leading-5 text-slate-100">
      {{ label }}
    </label>
    <slot />
    <p v-if="help" class="min-w-0 text-xs leading-5 text-slate-400">
      {{ help }}
    </p>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  label?: string
  help?: string
}>()
</script>
