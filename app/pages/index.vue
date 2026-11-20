<template>
  <main>
    <DesignHero primary-cta-href="#quote" />
    <DesignVerifiedManagersStrip />
    <DesignTickerStrip />
    <DesignHomeQuoteSection />
    <DesignSpeedSection cta-href="/quote" show-managers :live-spec="calcStore.spec" :live-preview="calcStore.preview" />
    <DesignTrackSection />
  </main>
</template>

<script setup lang="ts">
import DesignHero from '~/components/design/marketing/Hero.vue'
import DesignHomeQuoteSection from '~/components/design/marketing/HomeQuoteSection.vue'
import DesignSpeedSection from '~/components/design/marketing/SpeedSection.vue'
import DesignTickerStrip from '~/components/design/marketing/TickerStrip.vue'
import DesignTrackSection from '~/components/design/marketing/TrackSection.vue'
import DesignVerifiedManagersStrip from '~/components/design/marketing/VerifiedManagersStrip.vue'
import { useCalculatorStore } from '~/stores/calculator'

const calcStore = useCalculatorStore()

definePageMeta({ layout: 'design-public', middleware: 'buyer-entry', role: 'client' })

useHead({
  title: 'Printy — price your print run, track every stage',
  meta: [
    {
      name: 'description',
      content: 'Instant, server-verified print prices in Nairobi. Choose your speed, see the managers who can handle this job, and track all seven stages of your run. Escrow on every order.',
    },
  ],
})
</script>
