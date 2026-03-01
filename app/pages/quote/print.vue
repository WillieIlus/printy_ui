<template>
  <div class="min-h-screen bg-white dark:bg-gray-900 p-8 print:p-4 print:!bg-white">
    <div v-if="!quote" class="text-center py-12 text-gray-500 dark:text-gray-400">
      Quote not found. Go back and save a quote first.
    </div>
    <article v-else class="max-w-2xl mx-auto">
      <!-- Shop header -->
      <header class="border-b border-gray-200 dark:border-gray-700 pb-4 mb-6">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">{{ quote.shopName }}</h1>
        <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">Quote #{{ quote.id }}</p>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">{{ formatDate(quote.createdAt) }}</p>
      </header>

      <!-- Client (if any) -->
      <section v-if="quote.customerName || quote.customerEmail" class="mb-6">
        <h2 class="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2">Client</h2>
        <p v-if="quote.customerName" class="text-gray-900 dark:text-white">{{ quote.customerName }}</p>
        <p v-if="quote.customerEmail" class="text-sm text-gray-600 dark:text-gray-400">{{ quote.customerEmail }}</p>
        <p v-if="quote.customerPhone" class="text-sm text-gray-600 dark:text-gray-400">{{ quote.customerPhone }}</p>
      </section>

      <!-- Job summary -->
      <section class="mb-6">
        <h2 class="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2">Job Summary</h2>
        <p class="text-gray-900 dark:text-white">{{ quote.snapshot.sheetSize }} | {{ quote.snapshot.gsm }}gsm {{ quote.snapshot.paperType }}</p>
        <p class="text-gray-900 dark:text-white">Qty: {{ quote.snapshot.quantity }} sheets | {{ quote.snapshot.sides === 2 ? 'Double-sided' : 'Single-sided' }}</p>
        <p v-if="quote.snapshot.finishingNames?.length" class="text-gray-900 dark:text-white">Finishing: {{ quote.snapshot.finishingNames.join(', ') }}</p>
      </section>

      <!-- Cost breakdown (optional) -->
      <section v-if="quote.costBreakdown?.length" class="mb-6">
        <h2 class="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2">Cost Breakdown</h2>
        <table class="w-full text-sm">
          <tbody>
            <tr v-for="row in quote.costBreakdown" :key="row.label" class="border-b border-gray-100 dark:border-gray-800">
              <td class="py-1.5 text-gray-600 dark:text-gray-400">{{ row.label }}</td>
              <td class="py-1.5 text-right font-medium text-gray-900 dark:text-white">{{ formatKES(row.amount) }}</td>
            </tr>
          </tbody>
        </table>
      </section>

      <!-- Final price -->
      <section class="border-t border-gray-200 dark:border-gray-700 pt-4 mb-6">
        <div class="flex justify-between items-center">
          <span class="text-lg font-semibold text-gray-900 dark:text-white">Suggested Selling Price</span>
          <span class="text-2xl font-bold text-gray-900 dark:text-white">{{ formatKES(quote.suggestedPrice) }}</span>
        </div>
      </section>

      <!-- Terms -->
      <footer class="text-sm text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700 pt-4">
        <p>Valid for {{ quote.snapshot.validityDays ?? 7 }} days from date of quote.</p>
        <p class="mt-2">Delivery terms as agreed. Payment on completion unless otherwise stated.</p>
      </footer>
    </article>
  </div>
</template>

<script setup lang="ts">
import { formatKES, formatDate } from '~/utils/formatters'
import { useLocalQuotesStore } from '~/stores/localQuotes'

definePageMeta({
  layout: false,
})

const route = useRoute()
const localQuotesStore = useLocalQuotesStore()

const quoteId = computed(() => route.query.id as string)
const quote = computed(() =>
  quoteId.value ? localQuotesStore.getById(quoteId.value) : null
)

onMounted(() => {
  if (quote.value) {
    nextTick(() => window.print())
  }
})
</script>
