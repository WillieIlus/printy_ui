<script setup lang="ts">
import DesignStatusPill from '../ui/StatusPill.vue'
import type { StatusTone } from '~/types/design/status-tone'

export type AdminNetworkRow = {
  name: string
  role: string
  meta: string
  status: string
  tone: StatusTone
}

const props = defineProps<{ rows: AdminNetworkRow[] }>()
</script>

<template>
  <ul class="flex flex-col gap-3">
    <li v-for="row in props.rows" :key="row.name" class="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-line bg-card px-5 py-4">
      <div>
        <p class="text-sm font-semibold text-ink">{{ row.name }}</p>
        <p class="mt-0.5 font-mono text-[10.5px] tracking-[0.1em] text-ink-3 uppercase">{{ row.role }} · {{ row.meta }}</p>
      </div>
      <DesignStatusPill :tone="row.tone">{{ row.status }}</DesignStatusPill>
    </li>
  </ul>
</template>
