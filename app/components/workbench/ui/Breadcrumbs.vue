<template>
  <nav aria-label="Breadcrumb" class="min-w-0">
    <ol class="flex flex-wrap items-center gap-x-1.5 gap-y-1">
      <li v-for="(item, idx) in items" :key="`${item.label}-${idx}`" class="flex items-center gap-1.5">
        <ChevronRight v-if="idx > 0" :size="11" class="shrink-0 text-[var(--sub)] opacity-60" aria-hidden="true" />
        <NuxtLink
          v-if="item.to"
          :to="item.to"
          class="font-mono2 text-[9.5px] uppercase tracking-[0.18em] text-[var(--sub)] transition-colors hover:text-[var(--accent)]"
        >
          {{ item.label }}
        </NuxtLink>
        <span
          v-else
          aria-current="page"
          class="truncate font-mono2 text-[9.5px] font-semibold uppercase tracking-[0.18em] text-[var(--ink)]"
        >
          {{ item.label }}
        </span>
      </li>
    </ol>
  </nav>
</template>

<script setup lang="ts">
import { ChevronRight } from 'lucide-vue-next'
import type { AdminCrumb } from '~/shared/admin-nav'

defineProps<{ items: AdminCrumb[] }>()
</script>