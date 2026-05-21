<template>
  <section class="space-y-6">
    <div class="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
      <UiCard class="space-y-5">
        <div class="inline-flex w-fit items-center gap-2 rounded-full border border-[#fbc9ad] bg-[#fef1ed] px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#c92f13]">
          Public job tracking
        </div>
        <div>
          <h1 class="text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">Track a print job without hunting for updates.</h1>
          <p class="mt-5 max-w-2xl text-base leading-7 text-slate-600">
            Enter the tracking token or reference from your Printy link. This public route stays limited to safe job status and next-step visibility.
          </p>
        </div>
        <div class="grid gap-4 sm:grid-cols-3">
          <div class="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm leading-6 text-slate-600">Status is shareable without exposing the full account workspace.</div>
          <div class="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm leading-6 text-slate-600">Use the token exactly as sent in the Printy tracking link.</div>
          <div class="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm leading-6 text-slate-600">If you need deeper history, sign in to the account that owns the job.</div>
        </div>
      </UiCard>

      <UiCard class="space-y-5">
        <div>
          <p class="text-sm font-semibold uppercase tracking-[0.18em] text-[#e13515]">Enter token</p>
          <h2 class="mt-3 text-2xl font-black tracking-tight text-slate-950">Open the tracking page</h2>
        </div>
        <form class="space-y-4" @submit.prevent="submit">
          <UiInput v-model="token" label="Tracking token or reference" placeholder="Paste the token from your Printy link" />
          <p class="text-sm leading-6 text-slate-600">Example route format: <span class="font-semibold text-slate-900">/track-job/&lt;token&gt;</span></p>
          <div class="flex flex-wrap gap-3">
            <UiButton type="submit" size="lg">Track this job</UiButton>
            <UiButton to="/auth/login" variant="secondary" size="lg">Sign in instead</UiButton>
          </div>
        </form>
      </UiCard>
    </div>
  </section>
</template>

<script setup lang="ts">
import UiButton from '~/components/ui/UiButton.vue'
import UiCard from '~/components/ui/UiCard.vue'
import UiInput from '~/components/ui/UiInput.vue'

definePageMeta({ layout: 'track' })

const token = ref('')

async function submit() {
  const value = token.value.trim()
  if (!value) {
    return
  }
  await navigateTo(`/track-job/${encodeURIComponent(value)}`)
}
</script>
