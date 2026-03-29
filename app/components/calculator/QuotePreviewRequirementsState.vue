<template>
  <section class="rounded-lg border border-amber-200 bg-amber-50 p-4">
    <p class="text-sm font-semibold text-amber-900">
      {{ title }}
    </p>
    <ul class="mt-3 space-y-2 text-sm text-amber-900">
      <li v-for="item in items" :key="item" class="flex items-start gap-2">
        <span class="mt-1 h-1.5 w-1.5 rounded-full bg-amber-500" />
        <span>{{ item }}</span>
      </li>
    </ul>
    <p v-if="helper" class="mt-3 text-xs leading-5 text-amber-700">
      {{ helper }}
    </p>
  </section>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  items: string[]
  helper?: string
}>()
</script>
