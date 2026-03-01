<template>
  <div class="col-span-12 space-y-6">
    <DashboardPageHeader
      title="My quotes"
      subtitle="All quotes you've requested"
    />

    <DashboardSkeletonState v-if="quoteStore.loading" variant="cards" :card-count="6" />
    <QuotesQuoteList v-else :quotes="quoteStore.myQuotes" />
  </div>
</template>

<script setup lang="ts">
import { useQuoteStore } from '~/stores/quote'

definePageMeta({
  layout: 'dashboard',
  middleware: 'auth',
})

const quoteStore = useQuoteStore()
onMounted(() => quoteStore.fetchMyQuotes())
</script>
