<template>
  <BaseCard :variant="variant === 'dashboard' ? 'dashboard' : 'default'" padding="none" radius="xl" class="overflow-hidden">
    <div class="overflow-x-auto">
      <table class="w-full">
        <thead>
          <tr :class="variant === 'dashboard' ? 'bg-slate-50 border-b border-slate-100' : 'border-b border-slate-200'">
            <th v-for="column in columns" :key="column.key" class="px-6 py-3 text-left text-xs font-bold uppercase tracking-wide text-slate-400">
              {{ column.label }}
            </th>
            <th v-if="showActionColumn" class="px-6 py-3 text-right text-xs font-bold uppercase tracking-wide text-slate-400">
              {{ actionColumnLabel }}
            </th>
          </tr>
        </thead>
        <tbody v-if="!loading && rows.length" class="divide-y divide-slate-100">
          <tr
            v-for="(row, rowIndex) in rows"
            :key="row.id ?? rowIndex"
            class="transition-colors"
            :class="rowAction ? 'cursor-pointer hover:bg-slate-50 focus-within:bg-slate-50' : 'hover:bg-white'"
            @click="handleRowClick(row)"
          >
            <td v-for="column in columns" :key="column.key" :class="dense ? 'px-6 py-3 text-sm text-slate-600' : 'px-6 py-4 text-sm text-slate-600'">
              <slot :name="`cell-${column.key}`" :row="row" :value="row[column.key]" :column="column">
                {{ row[column.key] ?? '-' }}
              </slot>
            </td>
            <td v-if="showActionColumn" :class="dense ? 'px-6 py-3 text-right text-sm' : 'px-6 py-4 text-right text-sm'">
              <button
                type="button"
                class="rounded-lg px-2 py-1 font-bold text-[#175cd3] transition hover:bg-blue-50 hover:text-[#1849a9] focus:outline-none focus:ring-2 focus:ring-blue-100"
                @click.stop="handleRowClick(row)"
              >
                {{ getRowActionLabel(row) }}
              </button>
            </td>
          </tr>
        </tbody>
        <tbody v-else>
          <tr>
            <td :colspan="columns.length + (showActionColumn ? 1 : 0)" class="px-6 py-10 text-center">
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
  rowActionLabel?: string | ((row: Record<string, any>) => string)
  actionColumnLabel?: string
  showActionColumn?: boolean
}>()

const actionColumnLabel = computed(() => props.actionColumnLabel || 'Action')
const showActionColumn = computed(() => Boolean(props.rowAction && (props.showActionColumn || props.rowActionLabel)))

function handleRowClick(row: Record<string, any>) {
  props.rowAction?.(row)
}

function getRowActionLabel(row: Record<string, any>) {
  if (typeof props.rowActionLabel === 'function') {
    return props.rowActionLabel(row)
  }
  return props.rowActionLabel || 'View details'
}
</script>
