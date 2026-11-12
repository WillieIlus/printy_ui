<template>
  <div>
    <section class="paper-noise mx-auto max-w-6xl px-5 pt-16 pb-10 sm:px-8 sm:pt-20">
      <DesignSectionHead
        index="HW"
        eyebrow="The loop"
        :copy="`Printy is a marketplace with a referee built in: the server prices it, escrow protects it, and the seven-stage line proves it - for buyers, managers, shops and admins alike.`"
      >
        <template #title>Four moves. <span class="text-brand">Seven stages.</span> Zero phone calls.</template>
      </DesignSectionHead>
      <div class="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <article
          v-for="item in LOOP"
          :key="item.step"
          class="group rounded-2xl border border-line bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lift"
        >
          <p class="tabular font-mono text-4xl font-semibold text-paper-3 transition-colors group-hover:text-brand/40">{{ item.step }}</p>
          <h3 class="mt-4 text-[16px] leading-snug font-bold tracking-tight">{{ item.title }}</h3>
          <p class="mt-2.5 text-[13.5px] leading-relaxed text-ink-2">{{ item.body }}</p>
        </article>
      </div>
    </section>

    <DesignTickerStrip />

    <DesignStageRailSection />

    <DesignQuoteSection />

    <DesignFairPriceNote />

    <DesignPillarsStrip />

    <DesignVerifiedManagersStrip />

    <DesignRolesSplit
      :manager-image="{ src: '/images/design/pexels-6620970.jpg', alt: 'Printing manager reviewing fresh sheets beside the press' }"
      :shop-image="{ src: '/images/design/pexels-9550363.jpg', alt: 'Industrial press running sheets on a verified shop floor' }"
    />

    <DesignFinalCta />
  </div>
</template>

<script setup lang="ts">
import DesignSectionHead from '~/components/design/marketing/SectionHead.vue'
import DesignTickerStrip from '~/components/design/marketing/TickerStrip.vue'
import DesignStageRailSection from '~/components/design/marketing/StageRailSection.vue'
import DesignQuoteSection from '~/components/design/marketing/QuoteSection.vue'
import DesignFairPriceNote from '~/components/design/marketing/FairPriceNote.vue'
import DesignFinalCta from '~/components/design/marketing/FinalCta.vue'
import DesignPillarsStrip from '~/components/design/marketing/PillarsStrip.vue'
import DesignVerifiedManagersStrip from '~/components/design/marketing/VerifiedManagersStrip.vue'
import DesignRolesSplit from '~/components/design/marketing/RolesSplit.vue'

definePageMeta({ layout: 'design-public', role: 'client' })

useHead({
  title: 'How it works',
  meta: [
    {
      name: 'description',
      content: 'Quote in seconds, pay into escrow, watch seven live stages, confirm delivery - escrow releases. That\'s the whole Printy loop.',
    },
  ],
})

const LOOP = [
  { step: '01', title: 'Tell us what you\'re printing', body: 'Product, size, quantity, finish, turnaround. The server\'s pricing engine answers in about a second - a locked price under a hard fair-price cap.' },
  { step: '02', title: 'Pay once, into escrow', body: 'One M-PESA prompt. Your money sits in escrow and is visible on the ticket - the shop never touches it early.' },
  { step: '03', title: 'Watch the seven-stage line', body: 'Artwork check, printing, finishing, QC, delivery - each stage lights up live with time remaining, on any device.' },
  { step: '04', title: 'Confirm. Everyone gets paid.', body: 'You confirm delivery, escrow releases to manager and shop, and the job closes on the record. No calls, no chasing.' },
]
</script>
