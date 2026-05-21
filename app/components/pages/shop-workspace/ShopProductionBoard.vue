<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <div>
        <p class="text-base font-bold text-slate-900">{{ title }}</p>
        <p class="mt-0.5 text-xs text-slate-400">{{ subtitle }}</p>
      </div>
      <span class="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">
        <span class="h-1.5 w-1.5 rounded-full bg-blue-500"></span>
        {{ liveCount }} live
      </span>
    </div>

    <div class="grid grid-cols-1 gap-3 md:grid-cols-4">
      <div v-for="column in columns" :key="column.key" class="space-y-2.5 rounded-2xl p-3" :class="column.columnClass">
        <div class="mb-1 flex items-center justify-between">
          <p class="text-xs font-bold uppercase tracking-wide" :class="column.headingClass">{{ column.label }}</p>
          <span class="flex h-5 w-5 items-center justify-center rounded-full text-xs font-bold" :class="column.countClass">{{ column.items.length }}</span>
        </div>
        <div v-for="item in column.items" :key="item.id" class="rounded-xl border bg-white p-3 shadow-sm" :class="column.cardBorderClass">
          <p class="text-xs font-bold text-slate-800">{{ item.reference }} - {{ item.product }}</p>
          <p class="mt-0.5 text-xs text-slate-400">{{ item.clientLine }}</p>
          <div class="mt-2 flex items-center justify-between border-t border-slate-100 pt-2">
            <span class="text-xs" :class="column.metaClass">{{ item.meta }}</span>
            <button
              v-if="column.actionLabel"
              type="button"
              class="rounded-lg border px-2 py-0.5 text-xs font-bold"
              :class="column.actionClass"
              @click="$emit('action', { columnKey: column.key, assignmentId: item.assignmentId })"
            >
              {{ column.actionLabel }}
            </button>
            <span v-else class="inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-xs font-semibold" :class="item.badgeClass">
              <span class="inline-block h-1.5 w-1.5 rounded-full" :class="item.badgeDotClass"></span>
              {{ item.badge }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface BoardItem {
  id: string | number
  assignmentId: number
  reference: string
  product: string
  clientLine: string
  meta: string
  badge: string
  badgeClass: string
  badgeDotClass: string
}

interface BoardColumn {
  key: string
  label: string
  items: BoardItem[]
  columnClass: string
  headingClass: string
  countClass: string
  cardBorderClass: string
  metaClass: string
  actionLabel?: string
  actionClass?: string
}

withDefaults(defineProps<{
  title?: string
  subtitle?: string
  liveCount: number
  columns: BoardColumn[]
}>(), {
  title: 'Production Tracking Board',
  subtitle: 'Live status across all production shops',
})

defineEmits<{
  action: [payload: { columnKey: string, assignmentId: number }]
}>()
</script>
