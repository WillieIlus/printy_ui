<template>
  <button
    type="button"
    class="relative h-[22px] w-[40px] shrink-0 rounded-full transition-colors"
    :style="{ background: on ? 'var(--accent)' : 'var(--line)' }"
    :aria-pressed="on"
    @click="emit('change', !on)"
  >
    <span
      class="absolute top-[3px] h-4 w-4 rounded-full bg-white transition-all"
      :style="{ left: on ? '21px' : '3px' }"
    />
  </button>
</template>

<script setup lang="ts">
defineProps<{ on: boolean }>()

const emit = defineEmits<{
  change: [value: boolean]
}>()
</script>