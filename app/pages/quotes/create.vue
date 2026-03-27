<template>
  <div class="min-h-screen bg-[var(--p-bg)]">
    <div class="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-12">
      <div class="mb-8">
        <NuxtLink to="/quotes" class="text-sm font-medium text-[var(--p-text-muted)] hover:text-[var(--p-text)] flex items-center gap-1 mb-4">
          <UIcon name="i-lucide-arrow-left" class="h-4 w-4" />
          Quote Requests
        </NuxtLink>
        <h1 class="text-2xl font-bold text-[var(--p-text)]">Request a quote</h1>
        <p class="mt-2 text-[var(--p-text-muted)]">
          Add products from a print shop to your draft, then submit your request. The shop will respond with a quote.
        </p>
      </div>

      <div class="space-y-4">
        <NuxtLink
          to="/shops"
          class="flex items-center gap-4 rounded-xl border border-[var(--p-border)] bg-[var(--p-surface)] p-6 transition-colors hover:border-flamingo-300 dark:hover:border-flamingo-700 hover:bg-flamingo-50/30 dark:hover:bg-flamingo-900/10"
        >
          <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-flamingo-100 dark:bg-flamingo-900/40">
            <UIcon name="i-lucide-store" class="h-6 w-6 text-flamingo-600 dark:text-flamingo-400" />
          </div>
          <div class="min-w-0 flex-1">
            <h2 class="font-semibold text-[var(--p-text)]">Browse shops</h2>
            <p class="text-sm text-[var(--p-text-muted)]">Find a print shop and add products to your request.</p>
          </div>
          <UIcon name="i-lucide-chevron-right" class="h-5 w-5 text-[var(--p-text-muted)] shrink-0" />
        </NuxtLink>

        <NuxtLink
          to="/quote-draft"
          class="flex items-center gap-4 rounded-xl border border-[var(--p-border)] bg-[var(--p-surface)] p-6 transition-colors hover:border-flamingo-300 dark:hover:border-flamingo-700 hover:bg-flamingo-50/30 dark:hover:bg-flamingo-900/10"
        >
          <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-100 dark:bg-amber-900/40">
            <UIcon name="i-lucide-shopping-cart" class="h-6 w-6 text-amber-600 dark:text-amber-400" />
          </div>
          <div class="min-w-0 flex-1">
            <h2 class="font-semibold text-[var(--p-text)]">Quote draft</h2>
            <p class="text-sm text-[var(--p-text-muted)]">
              {{ hasDraftItems ? `Continue with ${draftItemCount} item(s) and submit.` : 'View or edit items in your draft.' }}
            </p>
          </div>
          <UIcon name="i-lucide-chevron-right" class="h-5 w-5 text-[var(--p-text-muted)] shrink-0" />
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useQuoteDraftStore } from '~/stores/quoteDraft'

definePageMeta({
  layout: 'default',
  middleware: 'auth',
})

const quoteDraftStore = useQuoteDraftStore()

const hasDraftItems = computed(() => {
  const draft = quoteDraftStore.activeDraft
  return draft && (draft.items?.length ?? 0) > 0
})

const draftItemCount = computed(() => {
  const draft = quoteDraftStore.activeDraft
  return draft?.items?.length ?? 0
})

onMounted(async () => {
  if (quoteDraftStore.currentShopSlug) {
    await quoteDraftStore.loadActiveDraft()
  }
})
</script>
