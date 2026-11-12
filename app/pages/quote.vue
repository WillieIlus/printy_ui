<script setup lang="ts">
import { onMounted } from 'vue'
import DesignHomeQuoteSection from '~/components/design/marketing/HomeQuoteSection.vue'
import DesignSpeedSection from '~/components/design/marketing/SpeedSection.vue'
import DesignFinalCta from '~/components/design/marketing/FinalCta.vue'
import { clearVerifiedManagersChoice, readVerifiedManagersChoice } from '~/shared/verified-managers'

definePageMeta({ layout: 'design-public', role: 'client' })

useHead({
  title: 'Instant price',
  meta: [
    {
      name: 'description',
      content: 'Tell us what you need and see a live, server-verified print price in seconds. No signup to start - escrow on every order.',
    },
  ],
})

/* B1.3 — a visitor who chose "Request a quote" on the homepage's verified-managers
   strip arrives here with that choice saved. The quote flow has now taken it over,
   so clear it: a later visit starts clean instead of re-using a stale choice. */
onMounted(() => {
  if (!readVerifiedManagersChoice()) {
    return
  }
  clearVerifiedManagersChoice()
})
</script>

<template>
  <main class="min-h-[70vh]">
    <DesignHomeQuoteSection />

    <DesignSpeedSection cta-href="/quote" />
    <DesignFinalCta quote-href="/quote" track-href="/track" />
  </main>
</template>
