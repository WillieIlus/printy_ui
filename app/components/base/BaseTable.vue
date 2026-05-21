<template>
  <BaseCard :variant="variant === 'dashboard' ? 'dashboard' : 'default'" padding="none" radius="xl" class="overflow-hidden">
    <div class="overflow-x-auto">
      <table class="w-full">
        <thead>
          <tr :class="variant === 'dashboard' ? 'bg-slate-50 border-b border-slate-100' : 'border-b border-slate-200'">
            <th v-for="column in columns" :key="column.key" class="px-6 py-3 text-left text-xs font-bold uppercase tracking-wide text-slate-400">
              {{ column.label }}
            </th>
          </tr>
        </thead>
        <tbody v-if="!loading && rows.length" class="divide-y divide-slate-100">
          <tr
            v-for="(row, rowIndex) in rows"
            :key="row.id ?? rowIndex"
            class="hover:bg-slate-50"
            :class="rowAction ? 'cursor-pointer' : ''"
            @click="handleRowClick(row)"
          >
            <td v-for="column in columns" :key="column.key" :class="dense ? 'px-6 py-3 text-sm text-slate-600' : 'px-6 py-4 text-sm text-slate-600'">
              <slot :name="`cell-${column.key}`" :row="row" :value="row[column.key]" :column="column">
                {{ row[column.key] ?? '-' }}
              </slot>
            </td>
          </tr>
        </tbody>
        <tbody v-else>
          <tr>
            <td :colspan="columns.length" class="px-6 py-10 text-center">
              <p class="text-sm font-semibold text-slate-700">{{ loading ? 'Loading...' : emptyText }}</p>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </BaseCard>
</template>

<script setup lang="ts">
import BaseCard from '~/components/base/BaseCard.vue'

const props = defineProps<{
  columns: ReadonlyArray<{ key: string, label: string }>
  rows: ReadonlyArray<Record<string, any>>
  loading?: boolean
  emptyText?: string
  dense?: boolean
  variant?: 'default' | 'dashboard'
  rowAction?: ((row: Record<string, any>) => void) | null
}>()

function handleRowClick(row: Record<string, any>) {
  props.rowAction?.(row)
}
</script>
