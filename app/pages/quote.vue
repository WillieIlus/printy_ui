<script setup lang="ts">
import { onMounted } from 'vue'
import DesignCalculatorSurface from '~/components/design/calculator/CalculatorSurface.vue'
import DesignSectionHead from '~/components/design/marketing/SectionHead.vue'
import DesignSpeedSection from '~/components/design/marketing/SpeedSection.vue'
import DesignFinalCta from '~/components/design/marketing/FinalCta.vue'
import DesignCalculator from '~/components/design/calculator/DesignCalculator.vue'
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

function goSignUp() {
  return navigateTo('/sign-up?mode=buyer')
}

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
    <section id="quote" class="paper-noise relative scroll-mt-20">
      <div class="relative z-10 mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24">
        <div class="flex flex-wrap items-end justify-between gap-6">
          <DesignSectionHead
            index="02"
            eyebrow="Instant quote"
            title="What does your job cost?"
            copy="Server-verified prices from the live network. Locked at order, escrow on every order."
          />
          <span class="stamp border-brand bg-mint text-brand-deep">No login needed</span>
        </div>
        <div class="mt-8">
          <DesignCalculatorSurface>
            <DesignCalculator embedded stacked compact cta-label="Get a quote" @unlock="goSignUp" />
          </DesignCalculatorSurface>
        </div>
      </div>
    </section>

    <DesignSpeedSection cta-href="/quote" />
    <DesignFinalCta quote-href="/quote" track-href="/track" />
  </main>
</template>
