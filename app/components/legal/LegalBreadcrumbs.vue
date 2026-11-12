<script setup lang="ts">
withDefaults(defineProps<{
  current: string
  parentLabel?: string
  parentTo?: string
}>(), {
  parentLabel: 'Legal',
  parentTo: '/legal',
})
</script>

<template>
  <nav aria-label="Breadcrumb" class="text-[11.5px] text-ink-3">
    <ol class="flex flex-wrap items-center gap-1.5">
      <li>
        <NuxtLink to="/" class="transition-colors hover:text-ink">Home</NuxtLink>
      </li>
      <li aria-hidden="true" class="text-ink-3/60">/</li>
      <li>
        <NuxtLink :to="parentTo" class="transition-colors hover:text-ink">{{ parentLabel }}</NuxtLink>
      </li>
      <li aria-hidden="true" class="text-ink-3/60">/</li>
      <li aria-current="page" class="font-medium text-ink-2">{{ current }}</li>
    </ol>
  </nav>
</template>
