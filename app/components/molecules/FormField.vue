<!-- Purpose: Wraps any input atom with a label, hint text, and error message. -->
<template>
  <div class="flex flex-col gap-1.5">
    <label
      v-if="label"
      :for="htmlFor"
      class="text-sm font-medium text-[var(--p-text)]"
    >
      {{ label }}
      <span v-if="required" class="ml-0.5 text-[var(--p-error)]" aria-hidden="true">*</span>
    </label>
    <slot />
    <p v-if="errorMessage" role="alert" class="text-xs text-[var(--p-error)]">{{ errorMessage }}</p>
    <p v-else-if="hint" class="text-xs text-[var(--p-text-muted)]">{{ hint }}</p>
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  label?: string
  hint?: string
  error?: boolean | string
  required?: boolean
  htmlFor?: string
}>(), {})

const errorMessage = computed(() =>
  typeof props.error === 'string' && props.error.length ? props.error : undefined,
)
</script>
