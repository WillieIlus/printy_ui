<template>
  <div>
    <section class="paper-noise mx-auto max-w-6xl px-5 pt-16 pb-12 sm:px-8 sm:pt-20">
      <div class="grid items-center gap-10 lg:grid-cols-2">
        <DesignSectionHead
          index="FS"
          eyebrow="For print shops"
          :copy="`Verified shops get a live queue of escrow-funded jobs matched to their rate card. Print well, advance the stage, and the money releases itself.`"
        >
          <template #title>Fill the press. <span class="text-brand">Skip the chase.</span></template>
        </DesignSectionHead>
        <div class="crop-marks relative overflow-hidden rounded-2xl border border-line shadow-lift">
          <img
            src="/images/design/pexels-9550363.jpg"
            alt="Industrial press running sheets on a verified shop floor"
            width="940"
            height="600"
            class="h-72 w-full object-cover sm:h-80"
          />
          <span class="stamp absolute bottom-4 left-4 border-paper bg-ink/85 text-paper">Verified shop</span>
        </div>
      </div>
    </section>

    <section class="mx-auto grid max-w-6xl gap-4 px-5 pb-12 sm:grid-cols-3 sm:px-8">
      <DesignCard
        v-for="value in VALUES"
        :key="value.title"
        class="group p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lift"
      >
        <component :is="getIcon(value.icon)" class="h-6 w-6 text-brand transition-transform duration-500 group-hover:-translate-y-1" :stroke-width="1.8" />
        <h3 class="mt-4 text-[16px] font-bold tracking-tight">{{ value.title }}</h3>
        <p class="mt-2 text-[13.5px] leading-relaxed text-ink-2">{{ value.body }}</p>
      </DesignCard>
    </section>

    <section class="mx-auto max-w-6xl px-5 pb-16 sm:px-8">
      <DesignSectionHead
        index="RC"
        eyebrow="Live example"
        title="A sample rate card, caps included."
        copy="A sample card - unit bands, setup fees, lead times and the server-enforced cap on every row. The real one lives in your workspace, computed by the server."
      />
      <div class="mt-8">
        <div class="rounded-2xl border border-line bg-card p-6 shadow-card sm:p-7">
          <div class="flex items-baseline justify-between">
            <p class="font-mono text-[10.5px] tracking-[0.16em] text-ink-3 uppercase">Sample shop - rate card</p>
            <span class="font-mono text-[10px] tracking-[0.16em] text-ink-3 uppercase">Escrow funded</span>
          </div>
          <div class="mt-5 space-y-3">
            <div v-for="(row, i) in RATE_ROWS" :key="i" class="flex flex-wrap items-baseline justify-between gap-2 border-b pb-2.5 last:border-b-0" :class="i === 0 ? 'border-line/70' : 'border-line/70'">
              <div>
                <p class="text-[13px] font-semibold text-ink">{{ row.label }}</p>
              </div>
              <p class="tabular font-mono text-sm font-semibold text-ink">{{ row.value }}</p>
            </div>
          </div>
        </div>
      </div>
      <div class="mt-8">
        <DesignButtonLink href="/sign-in" tone="charcoal" size="lg">Open the shop floor</DesignButtonLink>
      </div>
    </section>

    <DesignFinalCta />
  </div>
</template>

<script setup lang="ts">
import { getIcon } from '~/utils/design/icon-registry'
import DesignCard from '~/components/design/ui/Card.vue'
import DesignSectionHead from '~/components/design/marketing/SectionHead.vue'
import DesignButtonLink from '~/components/design/ui/ButtonLink.vue'
import DesignFinalCta from '~/components/design/marketing/FinalCta.vue'

definePageMeta({ layout: 'design-public', role: 'production' })

useHead({
  title: 'For print shops',
  meta: [
    {
      name: 'description',
      content: 'Jobs matched to your rate card, escrow-funded before you start, paid the moment QC clears delivery. List your press on Printy.',
    },
  ],
})

const VALUES = [
  { icon: 'Layers3', title: 'Jobs matched to your rates', body: 'Set your bands once. The server only routes work your press can produce at your price - no lowball bidding wars.' },
  { icon: 'ListChecks', title: 'Advance the line as you print', body: 'Printing, finishing, QC - one tap moves the stage and every dashboard in the network updates with it.' },
  { icon: 'Banknote', title: 'Paid on delivery, every time', body: 'Client money is already in escrow before ink touches paper. QC clears, delivery confirms, payout releases.' },
] as const

const RATE_ROWS = [
  { label: 'Business cards - matt lamination', value: 'KES 4,200 / pc' },
  { label: 'Setup fee - first production', value: 'KES 1,800' },
  { label: 'Lead time - standard', value: '4 working days' },
  { label: 'Fair-price cap', value: 'KES 5,900 / pc' },
]
</script>
