<template>
  <NuxtLink
    :to="to"
    class="group flex flex-col rounded-2xl border p-4 transition-colors hover:border-[var(--accent)]"
    :style="{ borderColor: 'var(--line)', background: 'var(--panel)' }"
  >
    <div class="flex items-center justify-between gap-2">
      <ML>{{ title }}</ML>
      <span class="rounded-full px-2 py-[1px] font-mono2 text-[9px] font-bold" :style="{ background: 'var(--panel2)', color: 'var(--sub)' }">
        {{ rows.length }}
      </span>
    </div>

    <div v-if="rows.length" class="mt-2.5 space-y-1.5">
      <div v-for="row in rows.slice(0, 4)" :key="row.key" class="flex items-center gap-2.5">
        <span class="mt-[5px] h-1 w-1 shrink-0 rounded-full" :style="{ background: row.color }" />
        <span class="min-w-0 flex-1">
          <span class="block truncate font-disp text-[12.5px] font-semibold">{{ row.lead }}</span>
          <span class="block truncate font-mono2 text-[8.5px] uppercase tracking-[0.12em] text-[var(--sub)]">{{ row.trail }}</span>
        </span>
        <span class="shrink-0 font-mono2 text-[9px] uppercase tracking-[0.12em]" :style="{ color: row.color }">{{ row.value }}</span>
      </div>
      <p v-if="rows.length > 4" class="font-mono2 text-[9px] uppercase tracking-[0.14em] text-[var(--sub)]">
        + {{ rows.length - 4 }} more
      </p>
    </div>

    <p v-else class="mt-2.5 text-[12px] text-[var(--sub)]">{{ emptyCopy }}</p>

    <div class="mt-3 flex items-center gap-1.5 border-t pt-2.5 font-mono2 text-[9px] uppercase tracking-[0.14em] text-[var(--sub)] transition-colors group-hover:text-[var(--accent)]" :style="{ borderColor: 'var(--line)' }">
      Open list <ChevronRight :size="11" />
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
import { ChevronRight } from 'lucide-vue-next'

defineProps<{
  to: string
  title: string
  emptyCopy: string
  rows: Array<{ key: string; lead: string; trail: string; value: string; color: string }>
}>()
</script>