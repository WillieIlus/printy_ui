<template>
  <div>
    <main class="mx-auto max-w-3xl px-5 py-14 sm:px-8">
      <DesignSectionHead index="LP" eyebrow="Small print" title="Terms, privacy and help." />

      <div class="mt-9 flex flex-col gap-5">
        <DesignCard v-for="block in BLOCKS" :key="block.id" class="scroll-mt-24 p-6">
          <section :id="block.id">
            <h2 class="text-xl font-bold tracking-tight">{{ block.title }}</h2>
            <div class="mt-3 space-y-2.5">
              <p v-for="paragraph in block.body" :key="paragraph" class="text-[14.5px] leading-relaxed text-ink-2">{{ paragraph }}</p>
            </div>
          </section>
        </DesignCard>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import DesignCard from '~/components/design/ui/Card.vue'
import DesignSectionHead from '~/components/design/marketing/SectionHead.vue'

definePageMeta({ layout: 'design-public', role: 'client' })

useHead({
  title: 'Terms, privacy and help',
})

const BLOCKS = [
  {
    id: 'terms',
    index: 'T',
    title: 'Terms',
    body: [
      'Printy is a marketplace for verified printing managers and print shops in Kenya. Prices shown before you sign up are estimates produced by our server.',
      'Once you accept a sent quote and pay, the price and the ready-by date are locked. Funds are held in escrow and released only after delivery is confirmed.',
      'A fair-price cap sits above every job size. No manager can charge you more than that cap.',
    ],
  },
  {
    id: 'privacy',
    index: 'P',
    title: 'Privacy',
    body: [
      'Buyers never see a print shop\'s costs, and shops never see your total or a manager\'s margin. The server masks money fields by role before anything reaches a screen.',
      'Your name and phone number are shared only with the manager and shop serving your job.',
      'Public tracking links show stages and times - never amounts or internal parties.',
    ],
  },
  {
    id: 'help',
    index: 'H',
    title: 'Help',
    body: [
      'Track a job any time from the public tracker using the code in your confirmation.',
      'Payment questions: payment only opens on a sent quote, and only after your artwork is uploaded. You will see an OTP step, then M-Pesa, then confirmation.',
      'Something late? A job shows At risk or Late on your dashboard the moment the server sees it - message your manager straight from there.',
    ],
  },
]
</script>
