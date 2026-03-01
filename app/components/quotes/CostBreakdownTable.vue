<template>
  <div class="border-t border-gray-200 dark:border-gray-700 pt-3 mt-3">
    <h4 class="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Cost Breakdown</h4>
    <table class="w-full text-sm">
      <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
        <tr v-for="row in rows" :key="row.label">
          <td class="py-1.5 text-gray-600 dark:text-gray-400">{{ row.label }}</td>
          <td class="py-1.5 text-right font-medium text-gray-900 dark:text-white">
            {{ row.configured ? formatKES(row.amount) : `0 (not configured)` }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { formatKES } from '~/utils/formatters'

export interface CostRow {
  label: string
  amount: string | number
  configured: boolean
}

defineProps<{
  rows: CostRow[]
}>()
</script>
