<template>
  <span class="font-semibold">
    {{ formatted }}
  </span>
</template>

<script setup lang="ts">
const props = defineProps<{
  value?: string | number | null
}>()

const formatted = computed(() => {
  if (props.value === null || props.value === undefined || props.value === '') {
    return 'KES -'
  }

  const numeric = Number(props.value)
  if (Number.isNaN(numeric)) {
    return `KES ${props.value}`
  }

  return `KES ${new Intl.NumberFormat('en-KE', { minimumFractionDigits: 0, maximumFractionDigits: 2 }).format(numeric)}`
})
</script>
