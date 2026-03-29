<template>
  <div class="space-y-2">
    <label v-if="label" class="block text-sm font-semibold text-slate-100">
      {{ label }}
    </label>
    <slot />
    <p v-if="help" class="text-xs leading-5 text-slate-400">
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
