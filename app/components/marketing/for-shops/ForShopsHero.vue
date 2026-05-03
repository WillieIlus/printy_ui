<!-- Purpose: Hero section for persuading print shop owners to join the early rollout. -->
<template>
  <section
    id="for-shops-hero"
    class="rounded-[2rem] border border-[#f2d3c8] bg-[linear-gradient(180deg,#fffaf7_0%,#fff7f3_100%)] px-6 py-8 shadow-[0_28px_80px_-52px_rgba(16,24,40,0.3)] md:px-8 md:py-10 lg:px-10 lg:py-12"
  >
    <div class="grid gap-10 lg:grid-cols-[minmax(0,1.08fr)_minmax(320px,0.92fr)] lg:items-center">
      <div class="space-y-6">
        <div class="space-y-4">
          <p class="inline-flex rounded-full border border-[#f4c9bd] bg-white/80 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.24em] text-[#e13515]">
            For print shop owners
          </p>
          <div class="space-y-4">
            <h1 class="max-w-3xl font-[Montserrat] text-4xl font-semibold tracking-[-0.05em] text-[#101828] md:text-5xl lg:text-6xl">
              Stop answering the same print price questions all day.
            </h1>
            <p class="max-w-2xl text-base leading-8 text-[#667085] md:text-lg">
              Printy turns your shop&apos;s prices, materials, finishing, and turnaround rules into clearer quote-ready requests
              so customers reach you with better specs before you waste time on back-and-forth.
            </p>
          </div>
        </div>

        <div class="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <BaseButton to="#join-early" variant="primary" size="lg" class="bg-[#e13515] hover:bg-[#bd2d12] focus-visible:outline-[#e13515]">
            Join early shops
          </BaseButton>
          <BaseButton to="#rate-card-check" variant="outline" size="lg" class="border-[#f2d3c8] bg-white/80 text-[#101828] hover:bg-[#fff1eb]">
            Get free rate-card check
          </BaseButton>
        </div>

        <p class="text-sm font-semibold tracking-[0.02em] text-[#101828] md:text-base">
          Your prices. Your materials. Your turnaround. Your decision.
        </p>
      </div>

      <div class="space-y-4">
        <article class="rounded-[2rem] border border-[#f2d3c8] bg-white p-6 shadow-[0_20px_60px_-38px_rgba(16,24,40,0.4)]">
          <div class="flex items-start justify-between gap-3">
            <div class="space-y-1">
              <p class="text-sm font-semibold uppercase tracking-[0.16em] text-[#e13515]">New quote-ready request</p>
              <h2 class="font-[Montserrat] text-2xl font-semibold tracking-[-0.03em] text-[#101828]">Business Cards</h2>
            </div>
            <span class="rounded-full border border-[#b7ebcd] bg-[#ecfdf3] px-3 py-1 text-xs font-semibold text-[#12b76a]">
              Ready for shop review
            </span>
          </div>

          <dl class="mt-6 space-y-3 text-sm text-[#101828]">
            <div v-for="detail in details" :key="detail.label" class="flex items-start justify-between gap-4 border-b border-[#f7e0d8] pb-3 last:border-b-0 last:pb-0">
              <dt class="font-medium text-[#667085]">{{ detail.label }}</dt>
              <dd class="text-right font-semibold text-[#101828]">{{ detail.value }}</dd>
            </div>
          </dl>

          <div class="mt-6 flex flex-wrap gap-2">
            <span
              v-for="action in actions"
              :key="action.label"
              class="inline-flex rounded-full border px-3 py-1.5 text-xs font-semibold"
              :class="action.className"
            >
              {{ action.label }}
            </span>
          </div>

          <p class="mt-5 rounded-2xl bg-[#fff7f3] px-4 py-3 text-sm leading-6 text-[#667085]">
            Review before confirming. Printy prepares the request, your shop decides.
          </p>
        </article>

        <div class="flex flex-wrap gap-2">
          <span
            v-for="chip in benefitChips"
            :key="chip"
            class="rounded-full border border-[#f2d3c8] bg-white px-3 py-2 text-sm font-medium text-[#667085] shadow-[0_8px_24px_-20px_rgba(16,24,40,0.35)]"
          >
            {{ chip }}
          </span>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import BaseButton from '~/components/ui/BaseButton.vue'

const details = [
  { label: 'Quantity', value: '500 pcs' },
  { label: 'Paper', value: '350gsm Art Card' },
  { label: 'Finishing', value: 'Matte Lamination + Round Corners' },
  { label: 'Turnaround', value: '24-48 hrs' },
]

const actions = [
  { label: 'Accept', className: 'border-[#b7ebcd] bg-[#ecfdf3] text-[#067647]' },
  { label: 'Modify', className: 'border-[#f2d3c8] bg-[#fff7f3] text-[#e13515]' },
  { label: 'Reject', className: 'border-slate-200 bg-slate-50 text-[#667085]' },
]

const benefitChips = ['Less missing specs', 'Faster replies', 'Cleaner job requests']
</script>
