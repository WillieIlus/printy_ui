<template>
  <DashboardSection :title="title" :subtitle="subtitle" :class="wrapperClass">
    <template v-if="$slots.actions" #actions>
      <slot name="actions" />
    </template>
    <template v-if="$slots.filters">
      <slot name="filters" />
    </template>
    <BaseTable
      :columns="columns"
      :rows="rows"
      :loading="loading"
      :empty-text="emptyText"
      :dense="dense"
      :row-action="rowAction"
      :row-action-label="rowActionLabel"
      :action-column-label="actionColumnLabel"
      :show-action-column="showActionColumn"
      variant="dashboard"
    >
      <template v-for="column in columns" :key="column.key" #[`cell-${column.key}`]="slotProps">
        <slot :name="`cell-${column.key}`" v-bind="slotProps">
          {{ slotProps.value }}
        </slot>
      </template>
    </BaseTable>
    <template v-if="$slots.footer">
      <slot name="footer" />
    </template>
  </DashboardSection>
</template>

<script setup lang="ts">
import BaseTable from '~/components/base/BaseTable.vue'
import DashboardSection from '~/components/dashboard/DashboardSection.vue'

withDefaults(defineProps<{
  title?: string
  subtitle?: string
  columns: ReadonlyArray<{ key: string, label: string }>
  rows: ReadonlyArray<Record<string, any>>
  loading?: boolean
  emptyText?: string
  dense?: boolean
  wrapperClass?: string
  rowAction?: ((row: Record<string, any>) => void) | null
  rowActionLabel?: string | ((row: Record<string, any>) => string)
  actionColumnLabel?: string
  showActionColumn?: boolean
}>(), {
  title: '',
  subtitle: '',
  loading: false,
  emptyText: 'No records available.',
  dense: false,
  wrapperClass: '',
  rowAction: null,
  rowActionLabel: '',
  actionColumnLabel: 'Action',
  showActionColumn: false,
})
</script>
