<script setup lang="ts">
import DesignBuyerSurface from '~/components/design/buyer/BuyerSurface.vue'
import DesignBuyerPageHeader from '~/components/design/buyer/BuyerPageHeader.vue'
import DesignCalculator from '~/components/design/calculator/DesignCalculator.vue'
import DesignCalculatorSurface from '~/components/design/calculator/CalculatorSurface.vue'

definePageMeta({
  layout: 'design-workspace',
  middleware: 'proto-role',
  breadcrumb: [
    { label: 'My quotes', to: '/app/buyer' },
    { label: 'New quote', to: '' },
  ],
})

useHead({
  title: 'New quote',
  meta: [{ name: 'robots', content: 'noindex' }],
})

function onQuoteCreated(reference: string, _total: number | null, requestId: number | null) {
  if (requestId) {
    return navigateTo(`/app/buyer/requests/${requestId}`)
  }
  return navigateTo({ path: '/app/buyer', query: { quote: 'sent', reference } })
}
</script>

<template>
  <DesignBuyerSurface>
    <div class="mx-auto flex w-full max-w-[1180px] flex-col gap-6 pb-40">
      <DesignBuyerPageHeader
        index="NQ"
        kicker="Buyer desk"
        title="New quote"
        description="Tell us what you need. The server prices it, then your manager confirms the final quote."
      >
        <template #actions>
          <NuxtLink
            to="/app/buyer"
            class="inline-flex h-10 items-center gap-1.5 rounded-xl border border-line-strong bg-card px-4 text-sm font-semibold text-ink transition-colors hover:border-brand hover:text-brand"
          >
            Back to my quotes
          </NuxtLink>
        </template>
      </DesignBuyerPageHeader>

      <DesignCalculatorSurface>
        <DesignCalculator authed @quote-created="onQuoteCreated" />
      </DesignCalculatorSurface>
    </div>
  </DesignBuyerSurface>
</template>
