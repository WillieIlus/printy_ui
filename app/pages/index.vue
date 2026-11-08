<template>
  <main>
    <DesignHero primary-cta-href="/quote" />
    <DesignTickerStrip />
    <DesignPillarsStrip />
    <DesignStageRailSection />
    <DesignQuoteSection quote-cta-href="/quote" />
    <DesignSpeedSection cta-href="/quote" />
    <DesignTrackSection />
    <DesignFairPriceNote />
    <DesignRolesSplit
      :manager-image="{ src: '/images/design/pexels-6620970.jpg', alt: 'Printing manager reviewing fresh sheets beside the press' }"
      :shop-image="{ src: '/images/design/pexels-9550363.jpg', alt: 'Industrial press running sheets on a verified shop floor' }"
    />
    <DesignFinalCta quote-href="/quote" track-href="/track" />
  </main>
</template>

<script setup lang="ts">
import DesignFinalCta from '~/components/design/marketing/FinalCta.vue'
import DesignFairPriceNote from '~/components/design/marketing/FairPriceNote.vue'
import DesignHero from '~/components/design/marketing/Hero.vue'
import DesignPillarsStrip from '~/components/design/marketing/PillarsStrip.vue'
import DesignQuoteSection from '~/components/design/marketing/QuoteSection.vue'
import DesignRolesSplit from '~/components/design/marketing/RolesSplit.vue'
import DesignSpeedSection from '~/components/design/marketing/SpeedSection.vue'
import DesignStageRailSection from '~/components/design/marketing/StageRailSection.vue'
import DesignTrackSection from '~/components/design/marketing/TrackSection.vue'
import DesignTickerStrip from '~/components/design/marketing/TickerStrip.vue'

definePageMeta({ layout: 'design-public', middleware: 'buyer-entry' })

useHead({
  title: "Printy — Kenya's verified printing manager network",
  meta: [
    {
      name: 'description',
      content: 'Instant, server-verified print prices. Escrow on every order. Live seven-stage tracking on every job. Nairobi, Kenya.',
    },
  ],
})
</script>
