<template>
  <div>
    <section class="paper-noise mx-auto max-w-6xl px-5 pt-16 pb-12 sm:px-8 sm:pt-20">
      <div class="grid items-center gap-10 lg:grid-cols-2">
        <DesignSectionHead
          index="FM"
          eyebrow="For managers"
          :copy="`Verified managers are the network's account layer: you keep clients happy, assign verified shops, and watch the seven-stage line without a single 'iniendaje?' phone call.`"
        >
          <template #title>Run a print desk, <span class="text-brand">not a guessing game.</span></template>
        </DesignSectionHead>
        <div class="crop-marks relative overflow-hidden rounded-2xl border border-line shadow-lift">
          <img
            src="/images/design/pexels-6620970.jpg"
            alt="Printing manager reviewing fresh sheets beside the press"
            width="940"
            height="600"
            class="h-72 w-full object-cover sm:h-80"
          />
          <span class="stamp absolute bottom-4 left-4 border-paper bg-ink/85 text-paper">Verified manager</span>
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
      <div class="grid items-center gap-8 lg:grid-cols-2">
        <DesignCard class="p-6 sm:p-7" tone="ink">
          <p class="font-mono text-[10.5px] tracking-[0.18em] text-paper/50 uppercase">A manager's ledger - demo figures</p>
          <div class="mt-4">
            <DesignLedgerRows
              tone="ink"
              :rows="[
                { label: 'Buyer total', hint: 'what the client pays', value: 'KES 21,400', strong: true },
                { label: 'Print cost', hint: 'shop production layer', value: 'KES 15,900' },
                { label: 'Your margin', hint: 'inside the cap', value: 'KES 2,890', tone: 'brand' },
                { label: 'Fair-price cap', hint: 'server-enforced ceiling', value: 'KES 23,700', tone: 'amber' },
              ]"
            />
          </div>
          <p class="mt-4 font-mono text-[10px] tracking-[0.06em] text-paper/40 uppercase">The real one lives in your workspace - computed by the server, never the browser.</p>
        </DesignCard>
        <div>
          <DesignSectionHead
            index="CAP"
            eyebrow="The deal"
            copy="Buyers see a locked price. Shops see a funded job. You see your margin. Nobody sees anyone else's layer - the server masks it by role, every time."
          >
            <template #title>You earn. The cap protects <span class="text-amber">everyone.</span></template>
          </DesignSectionHead>
          <div class="mt-8">
            <DesignButtonLink href="/sign-in" tone="charcoal" size="lg">Open the manager desk</DesignButtonLink>
          </div>
        </div>
      </div>
    </section>

    <DesignFinalCta />
  </div>
</template>

<script setup lang="ts">
import { getIcon } from '~/utils/design/icon-registry'
import DesignCard from '~/components/design/ui/Card.vue'
import DesignLedgerRows from '~/components/design/ui/LedgerRows.vue'
import DesignSectionHead from '~/components/design/marketing/SectionHead.vue'
import DesignButtonLink from '~/components/design/ui/ButtonLink.vue'
import DesignFinalCta from '~/components/design/marketing/FinalCta.vue'

definePageMeta({ layout: 'design-public', role: 'partner' })

useHead({
  title: 'For managers',
  meta: [
    {
      name: 'description',
      content: 'Run quotes, jobs and clients from one desk. Pre-priced requests under a server-enforced fair-price cap - margin without the spreadsheet.',
    },
  ],
})

const VALUES = [
  { icon: 'ReceiptText', title: 'Requests arrive pre-priced', body: 'Every quote request lands with a server-computed total, unit band and due date. You send or decline - you never build a price from scratch.' },
  { icon: 'Gauge', title: 'Margin, inside the cap', body: 'Your margin is visible to you on every job, always under the fair-price ceiling. Honest room, hard limit - buyers trust the network because of it.' },
  { icon: 'Landmark', title: 'Escrow does the chasing', body: 'Clients pay before production starts and funds sit in escrow until delivery. No invoices, no follow-up calls, no bad debt.' },
] as const
</script>
