<template>
  <div>
    <PageHero
      eyebrow="legal"
      :icon="Scale"
      title="Terms &amp; privacy"
      lead="Plain-language terms for using Printy, and a clear statement of what we do with your data. Last updated November 2025."
    />

    <Section>
      <div class="flex gap-1 rounded-full border p-1" style="border-color: var(--line); background: var(--panel); width: fit-content">
        <button
          v-for="[k, label] in tabs"
          :key="k"
          type="button"
          class="rounded-full px-4 py-2 font-mono2 text-[10px] font-semibold uppercase tracking-[0.14em] transition-colors"
          :style="{
            background: tab === k ? 'var(--accent)' : 'transparent',
            color: tab === k ? 'var(--accentInk)' : 'var(--sub)',
          }"
          @click="tab = k"
        >
          {{ label }}
        </button>
      </div>

      <div class="mt-6 max-w-[78ch] space-y-6 rounded-3xl border p-6 sm:p-8" style="border-color: var(--line); background: var(--panel)">
        <div v-for="[h, b] in items" :key="h">
          <h2 class="font-disp text-[16px] font-bold tracking-tight">{{ h }}</h2>
          <p class="mt-1.5 text-[13.5px] leading-relaxed text-[var(--sub)]">{{ b }}</p>
        </div>
        <div class="border-t pt-5 font-mono2 text-[10px] uppercase tracking-[0.14em] text-[var(--sub)]" style="border-color: var(--line)">
          Questions about these terms? hello@printy.ke
        </div>
      </div>
    </Section>

    <div class="pb-20" />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { Scale } from 'lucide-vue-next'

const tabs: Array<['terms' | 'privacy', string]> = [
  ['terms', 'Terms of service'],
  ['privacy', 'Privacy policy'],
]

const tab = ref<'terms' | 'privacy'>('terms')

const TERMS: [string, string][] = [
  ['1. What Printy is', 'Printy is a print-production platform. We connect clients with verified print partners, coordinate production through print managers, and hold payment in custody until delivery is confirmed. Printy is not itself the printer unless expressly stated on a job.'],
  ['2. Quotes and pricing', 'Quotes are generated from live partner rate cards using real imposition, spoilage and finishing rules. A quote is an offer to produce the specified job and remains valid for the period shown on it. If the supplied artwork materially differs from the specification quoted, the job may be re-quoted before production begins.'],
  ['3. Artwork and approval', 'You are responsible for holding the rights to the artwork you supply. Once you approve a proof, that approved file is what goes to press. Printy and its partners are not liable for spelling, layout or content errors present in an approved file.'],
  ['4. Payment and custody', 'Payment is made after proof approval and is held in Printy Custody. Funds are released to the print partner only after delivery is confirmed, or automatically after the confirmation window stated on the job. Raising a dispute freezes the funds until resolution.'],
  ['5. Production and delivery', 'Turnaround estimates are working-day based and begin when payment clears custody. Delivery dates are targets, not guarantees; where an SLA is breached, the job is escalated to your print manager and Printy operations.'],
  ['6. Quality and disputes', 'Commercial print tolerances apply, including reasonable colour variation between proofs and production runs. If output falls outside those tolerances, raise a dispute from the job page within seven days of delivery. Remedies are reprint or refund at Printy\'s reasonable discretion.'],
  ['7. Cancellations', 'You may cancel before production begins for a full refund from custody. Once plates are made, materials are cut, or the press run has started, cancellation is limited to the unrecovered portion of the job.'],
  ['8. Partner obligations', 'Print partners must hold the capabilities they list, meet accepted deadlines, and maintain the quality standards recorded on their profile. Repeated SLA breaches or unresolved disputes may result in suspension from the marketplace.'],
  ['9. Manager markup', 'Print managers may apply a markup to production cost. That markup is capped by job size under Printy\'s fee policy and is always included in the price you are shown. You are never charged an amount above the quoted total.'],
  ['10. Liability', 'Printy\'s aggregate liability for any job is limited to the value of that job. We are not liable for indirect or consequential loss, including lost profit or missed events, arising from production or delivery delays.'],
]

const PRIVACY: [string, string][] = [
  ['What we collect', 'Account details (name, email, phone, organisation and location), job specifications, artwork files you upload, payment references, and technical logs needed to operate the service.'],
  ['Why we collect it', 'To produce quotes, route jobs to suitable print partners, process payments through custody, provide tracking, and resolve disputes. We do not sell your data.'],
  ['Artwork files', 'Artwork is shared only with the print manager and the print partner assigned to your job. Files are retained for reprint purposes and can be deleted on request once a job is complete.'],
  ['Payment data', 'Mobile-money and card payments are processed by regulated payment providers. Printy stores payment references and status, never full card numbers.'],
  ['Who can see what', 'Public tracking pages anonymise the print partner, manager and order value. Full production detail is visible only to the account holders involved in that job and to Printy operations.'],
  ['Your rights', 'You can request a copy of your data, correct it, or ask us to delete your account and associated records, subject to records we must retain for tax and dispute purposes. Contact hello@printy.ke.'],
]

const items = computed(() => (tab.value === 'terms' ? TERMS : PRIVACY))
</script>