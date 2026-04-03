<template>
  <div class="min-h-screen bg-[var(--p-bg)]">
    <div class="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <div class="mb-8">
        <NuxtLink :to="`/shops/${slug}`" class="inline-flex items-center gap-2 text-sm font-medium text-[var(--p-text-muted)] hover:text-[var(--p-text)]">
          <UIcon name="i-lucide-arrow-left" class="h-4 w-4" />
          Back to shop
        </NuxtLink>
        <h1 class="mt-4 text-3xl font-bold text-[var(--p-text)]">Request custom print</h1>
        <p class="mt-2 max-w-2xl text-sm text-[var(--p-text-muted)]">
          Build a request for this shop, then track its progress and any received quote from your requests workspace.
        </p>
      </div>

      <QuotesCalculatorHub>
        <template #flat>
          <section class="rounded-3xl border border-[var(--p-border)] bg-[var(--p-surface)] p-5 shadow-sm sm:p-8">
            <QuotesPublicCalculator
              title="Single-shop custom request"
              description="Keep the shop fixed, capture a structured custom job spec, and save it into your requests workspace."
              eyebrow="Request Custom Print"
              mode="single-shop"
              :fixed-shop-slug="slug"
              :fixed-shop-name="shopName"
              @submit="onSubmit"
            />
          </section>
        </template>
        <template #booklet>
          <section class="rounded-3xl border border-[var(--p-border)] bg-[var(--p-surface)] p-5 shadow-sm sm:p-8">
            <QuotesBookletCalculator
              title="Single-shop booklet request"
              description="Keep the shop fixed, preview booklet pricing, and save the job into your requests workspace."
              eyebrow="Request Custom Booklet"
              :fixed-shop-slug="slug"
              :fixed-shop-name="shopName"
            />
          </section>
        </template>
      </QuotesCalculatorHub>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useToast } from '#imports'
import type { AddCustomItemPayload, AddProductItemPayload } from '~/services/quoteDraft'
import { getCatalog } from '~/services/public'
import { useQuoteDraftStore } from '~/stores/quoteDraft'

definePageMeta({ layout: 'default' })

const route = useRoute()
const slug = computed(() => route.params.slug as string)
const shopName = ref('')
const quoteDraftStore = useQuoteDraftStore()
const toast = useToast()

onMounted(async () => {
  quoteDraftStore.setShop(slug.value)
  const catalog = await getCatalog(slug.value)
  shopName.value = catalog?.shop?.name ?? slug.value
})

async function onSubmit(payload: AddCustomItemPayload | AddProductItemPayload) {
  if (payload.item_type !== 'CUSTOM') return
  quoteDraftStore.setShop(slug.value)
  await quoteDraftStore.addCustomToQuote(payload)
  toast.add({ title: 'Saved to workspace', description: 'Custom request saved to your requests and quotes workspace.', color: 'success' })
  await navigateTo('/quote-draft')
}
</script>
