<template>
  <label class="block">
    <div v-if="label" class="mb-1.5 flex items-center gap-1.5">
      <span class="text-[13px] font-semibold text-[#344054]">{{ label }}</span>
      <span v-if="required" class="text-[#e13515]">*</span>
    </div>
    <slot />
    <slot name="help">
      <p v-if="help" class="mt-1.5 text-[12px] text-[#667085]">{{ help }}</p>
    </slot>
    <slot name="error">
      <p v-if="error" class="mt-1.5 text-[12px] text-[#b42318]">{{ error }}</p>
    </slot>
  </label>
</template>

<script setup lang="ts">
defineProps<{
  label?: string
  error?: string
  help?: string
  required?: boolean
  for?: string
}>()
</script>
