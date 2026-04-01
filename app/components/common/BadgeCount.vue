<template>
  <span
    v-if="normalizedCount > 0"
    class="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-red-600 px-1.5 text-[10px] font-bold leading-none text-white"
  >
    {{ label }}
  </span>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  count?: number | null
}>(), {
  count: 0,
})

const normalizedCount = computed(() => {
  const value = Number(props.count ?? 0)
  return Number.isFinite(value) && value > 0 ? value : 0
})

const label = computed(() => normalizedCount.value > 99 ? '99+' : String(normalizedCount.value))
</script>
