<template>
  <div class="max-w-4xl mx-auto p-6 space-y-6">
    <div class="flex justify-between items-center">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">My Quotes</h1>
      <UButton to="/shops" variant="outline" size="sm">Browse Shops</UButton>
    </div>
    <p class="text-gray-600 dark:text-gray-400">
      Quotes saved locally. Visit a shop page to create and save new quotes.
    </p>
    <div v-if="!quotes.length" class="rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700 p-12 text-center">
      <UIcon name="i-lucide-file-text" class="w-12 h-12 text-gray-400 mx-auto mb-4" />
      <p class="text-gray-600 dark:text-gray-400">No quotes yet</p>
      <UButton to="/shops" class="mt-4">Find a shop to quote</UButton>
    </div>
    <div v-else class="space-y-4">
      <UCard
        v-for="q in quotes"
        :key="q.id"
        class="hover:shadow-md transition-shadow"
      >
        <div class="flex justify-between items-start gap-4">
          <div>
            <h3 class="font-semibold text-gray-900 dark:text-white">{{ q.shopName }}</h3>
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
              {{ q.snapshot.sheetSize }} {{ q.snapshot.gsm }}gsm · {{ q.snapshot.quantity }} sheets
            </p>
            <p class="text-lg font-bold text-emerald-600 dark:text-emerald-400 mt-2">
              {{ formatKES(q.suggestedPrice) }}
            </p>
          </div>
          <div class="flex gap-2 shrink-0">
            <UButton
              variant="outline"
              size="sm"
              @click="openPrint(q.id)"
            >
              Export PDF
            </UButton>
            <UButton
              variant="ghost"
              color="error"
              size="sm"
              @click="confirmDelete(q)"
            >
              Delete
            </UButton>
          </div>
        </div>
      </UCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { formatKES } from '~/utils/formatters'
import { useLocalQuotesStore } from '~/stores/localQuotes'

definePageMeta({ layout: 'default' })

const localQuotesStore = useLocalQuotesStore()
const quotes = computed(() => localQuotesStore.quotes)

function openPrint(id: string) {
  window.open(`/quote/print?id=${encodeURIComponent(id)}`, '_blank')
}

function confirmDelete(q: { id: string; shopName: string }) {
  if (confirm(`Delete quote for ${q.shopName}?`)) {
    localQuotesStore.removeQuote(q.id)
  }
}
</script>
