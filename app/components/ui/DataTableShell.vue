<template>
  <UiCard padding="p-0">
    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-slate-200">
        <thead class="bg-slate-50">
          <tr>
            <th v-for="column in columns" :key="column" class="px-4 py-3 text-left text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
              {{ column }}
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-200 bg-white">
          <slot />
        </tbody>
      </table>
    </div>
  </UiCard>
</template>

<script setup lang="ts">
import UiCard from '~/components/ui/UiCard.vue'

defineProps<{
  columns: string[]
}>()
</script>
