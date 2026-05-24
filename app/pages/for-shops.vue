<template>
  <section class="px-4 py-8 sm:px-6">
    <div class="mx-auto max-w-7xl space-y-6">
      <div class="grid gap-6 lg:grid-cols-[1fr_0.95fr]">
        <UiCard class="space-y-6">
          <div class="inline-flex w-fit items-center gap-2 rounded-full border border-[#fbc9ad] bg-[#fef1ed] px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#c92f13]">
            For print shops
          </div>
          <div>
            <h1 class="text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">Receive better print jobs without chasing for specs, payment status, or approvals.</h1>
            <p class="mt-5 max-w-2xl text-base leading-7 text-slate-600">
              Printy is a production intake and payout workflow for real shops. Jobs come in with clearer quantities, stock, finishing, and turnaround context, while Printy keeps the client communication, payment state, and dispatch flow organized.
            </p>
          </div>
          <div class="grid gap-4 sm:grid-cols-3">
            <div class="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
              <p class="text-sm font-semibold text-slate-950">Structured job briefs</p>
              <p class="mt-1 text-sm leading-6 text-slate-600">Less time decoding WhatsApp threads and vague print requests.</p>
            </div>
            <div class="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
              <p class="text-sm font-semibold text-slate-950">Payout-safe workflow</p>
              <p class="mt-1 text-sm leading-6 text-slate-600">You see your production amount and job state without client-margin noise.</p>
            </div>
            <div class="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
              <p class="text-sm font-semibold text-slate-950">Cleaner handoff</p>
              <p class="mt-1 text-sm leading-6 text-slate-600">Proofs, approvals, and completion updates stay tied to the same job.</p>
            </div>
          </div>
        </UiCard>

        <ForShopsRateCardBuilder v-model:quantity="quantity" v-model:notes="notes" :loading="loading" @submit="submit" />
      </div>

      <div class="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <RatePreviewPanel :preview="preview" />
        <UiCard class="space-y-4">
          <p class="text-sm font-semibold uppercase tracking-[0.2em] text-[#e13515]">Why shops care</p>
          <h2 class="text-2xl font-black tracking-tight text-slate-950">Printy should feel like better work arriving, not another storefront to maintain.</h2>
          <div class="space-y-3">
            <div class="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm leading-6 text-slate-600">
              Work arrives with clearer production assumptions instead of open-ended client back-and-forth.
            </div>
            <div class="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm leading-6 text-slate-600">
              Printy handles the client-facing quote, approval, and payment checkpoints before the job reaches production.
            </div>
            <div class="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm leading-6 text-slate-600">
              This page keeps the demo simple: preview how pricing is framed, then move into onboarding and job intake when you are ready.
            </div>
          </div>
        </UiCard>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import RatePreviewPanel from '~/components/shops/RatePreviewPanel.vue'
import ForShopsRateCardBuilder from '~/components/shops/ForShopsRateCardBuilder.vue'
import UiCard from '~/components/ui/UiCard.vue'
import { useForShopsApi } from '~/services/for-shops'

const auth = useAuthStore()
const { previewForShops } = useForShopsApi()
await auth.initialize()

if (auth.isAuthenticated && auth.canAccessClientDashboard && !auth.canAccessPartnerDashboard && !auth.canAccessProductionDashboard) {
  await navigateTo('/dashboard/client')
}

const quantity = ref(100)
const notes = ref('')
const preview = ref<Record<string, any> | null>(null)
const loading = ref(false)

async function submit() {
  loading.value = true
  try {
    preview.value = await previewForShops({
      paper_rows: [],
      finishing_rows: [],
      notes: notes.value,
      quantity: quantity.value,
    })
  } finally {
    loading.value = false
  }
}
</script>
