<template>
  <ol class="space-y-4">
    <li v-for="item in items" :key="item.id || item.summary" class="flex gap-4">
      <div class="mt-1 h-3 w-3 rounded-full bg-primary-600" />
      <div class="min-w-0 flex-1">
        <p class="text-sm font-semibold text-slate-900">{{ item.summary || item.event_type }}</p>
        <p v-if="item.created_at" class="mt-1 text-xs text-slate-500">{{ formatDate(item.created_at) }}</p>
        <p v-if="item.metadataText" class="mt-2 text-sm text-slate-600">{{ item.metadataText }}</p>
      </div>
    </li>
  </ol>
</template>

<script setup lang="ts">
defineProps<{
  items: Array<Record<string, any>>
}>()

function formatDate(value?: string) {
  if (!value) return ''
  return new Date(value).toLocaleString()
}
</script>
