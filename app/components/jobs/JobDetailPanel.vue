<template>
  <DashboardDetailPanel :title="title" :subtitle="subtitle" padding="lg">
    <template v-if="$slots.actions" #actions>
      <slot name="actions" />
    </template>
    <div v-if="items.length" class="grid gap-4" :class="columnsClass">
      <div v-for="item in items" :key="item.label" class="rounded-2xl border border-slate-200 p-4" :class="itemClass">
        <p class="text-xs font-bold uppercase tracking-widest text-slate-400">{{ item.label }}</p>
        <p class="mt-2 text-sm font-bold text-slate-900">{{ item.value }}</p>
        <p v-if="item.meta" class="mt-1 text-xs text-slate-400">{{ item.meta }}</p>
      </div>
    </div>
    <slot />
  </DashboardDetailPanel>
</template>

<script setup lang="ts">
import DashboardDetailPanel from '~/components/dashboard/DashboardDetailPanel.vue'

const props = withDefaults(defineProps<{
  title?: string
  subtitle?: string
  items?: Array<{ label: string, value: string, meta?: string }>
  columns?: 1 | 2 | 3 | 4
  itemClass?: string
}>(), {
  title: '',
  subtitle: '',
  items: () => [],
  columns: 2,
  itemClass: '',
})

const columnsClass = computed(() => ({
  1: 'grid-cols-1',
  2: 'sm:grid-cols-2',
  3: 'sm:grid-cols-2 xl:grid-cols-3',
  4: 'sm:grid-cols-2 xl:grid-cols-4',
}[props.columns]))
</script>
