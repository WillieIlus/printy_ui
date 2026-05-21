<template>
  <section class="px-4 py-8 sm:px-6">
    <div class="mx-auto max-w-7xl space-y-6">
      <div class="grid gap-6 lg:grid-cols-[1fr_0.95fr]">
        <UiCard class="space-y-6">
          <div class="inline-flex w-fit items-center gap-2 rounded-full border border-[#fbc9ad] bg-[#fef1ed] px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#c92f13]">
            For print shops
          </div>
          <div>
            <h1 class="text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">Receive quote-ready jobs with production math already prepared.</h1>
            <p class="mt-5 max-w-2xl text-base leading-7 text-slate-600">
              This is not generic shop software. It is a clearer intake surface for KES pricing, imposition logic, sheets, finishing, and a transparent marketplace pricing breakdown.
            </p>
          </div>
          <div class="grid gap-4 sm:grid-cols-3">
            <div class="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
              <p class="text-sm font-semibold text-slate-950">Quote-ready briefs</p>
              <p class="mt-1 text-sm leading-6 text-slate-600">Less time deciphering what the buyer meant.</p>
            </div>
            <div class="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
              <p class="text-sm font-semibold text-slate-950">Production-first inputs</p>
              <p class="mt-1 text-sm leading-6 text-slate-600">Paper, GSM, sides, quantity, and notes stay structured.</p>
            </div>
            <div class="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
              <p class="text-sm font-semibold text-slate-950">Cleaner handoff</p>
              <p class="mt-1 text-sm leading-6 text-slate-600">Estimate, response, and tracking stay connected.</p>
            </div>
          </div>
        </UiCard>

        <ForShopsRateCardBuilder v-model:quantity="quantity" v-model:notes="notes" :loading="loading" @submit="submit" />
      </div>

      <div class="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <RatePreviewPanel :preview="preview" />
        <UiCard class="space-y-4">
          <p class="text-sm font-semibold uppercase tracking-[0.2em] text-[#e13515]">Why shops care</p>
          <h2 class="text-2xl font-black tracking-tight text-slate-950">Printy makes job intake easier to trust before deeper dashboard work begins.</h2>
          <div class="space-y-3">
            <div class="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm leading-6 text-slate-600">
              Estimate requests arrive with clearer production assumptions instead of vague chat fragments.
            </div>
            <div class="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm leading-6 text-slate-600">
              Shared tokens and role-aware auth keep public and partner flows separated cleanly.
            </div>
            <div class="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm leading-6 text-slate-600">
              This pass prioritizes maneuverability and visual legibility so shops can see their base price, the standardized margins, and the client price clearly.
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
