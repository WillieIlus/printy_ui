<script setup lang="ts">
/**
 * /track-job  — public job lookup page.
 *
 * Visitors paste a job reference (e.g. JB-20491) plus the email or
 * phone the job was placed with, and we redirect them into the
 * authenticated tracker, or display a public read-only status if the
 * backend exposes one. Designed to fix the broken header link.
 */

import { ref, computed } from 'vue'
import { useRuntimeConfig, useSeoMeta, useHead, navigateTo } from '#imports'

useSeoMeta({
  title: 'Track a print job',
  description:
    'Enter your Printy job reference (for example JB-20491) and the email '
    + 'or phone you used to place it. We\'ll show you exactly where the job '
    + 'is — prepress, printing, finishing, or out for delivery.',
  ogTitle: 'Track your print job · Printy',
  ogDescription:
    'Live status for every Printy job — prepress, printing, finishing, delivery.',
  ogImage: 'https://printy.ke/assets/og/printy-og-default.jpg',
  ogUrl: 'https://printy.ke/track-job',
  twitterCard: 'summary_large_image',
  twitterImage: 'https://printy.ke/assets/og/printy-og-default.jpg',
  robots: 'index,follow',
})

useHead({
  link: [{ rel: 'canonical', href: 'https://printy.ke/track-job' }],
  script: [{
    type: 'application/ld+json',
    innerHTML: JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: 'Track a print job',
      url: 'https://printy.ke/track-job',
      isPartOf: { '@id': 'https://printy.ke/#website' },
    }),
  }],
})

const config = useRuntimeConfig()
const apiBase = (config.public as any).apiBaseUrl ?? 'https://api.printy.ke/api'

const reference = ref('')
const contact   = ref('')
const loading   = ref(false)
const error     = ref<string | null>(null)
const status    = ref<null | {
  reference: string
  product: string
  quantity: number | null
  stage: 'order_confirmed' | 'artwork_approved' | 'printing' | 'finishing' | 'delivery' | 'completed'
  stageLabel: string
  estCompletion?: string
}>(null)

const refIsValid = computed(() => /^JB-\d{4,8}$/i.test(reference.value.trim()))
const contactIsValid = computed(() => {
  const v = contact.value.trim()
  return /^\S+@\S+\.\S+$/.test(v) || /^\+?[0-9 \-]{7,}$/.test(v)
})
const canSubmit = computed(() => refIsValid.value && contactIsValid.value && !loading.value)

const stages = [
  { id: 'order_confirmed',   label: 'Order confirmed' },
  { id: 'artwork_approved',  label: 'Artwork approved' },
  { id: 'printing',          label: 'Printing' },
  { id: 'finishing',         label: 'Finishing' },
  { id: 'delivery',          label: 'Out for delivery' },
] as const

const activeIndex = computed(() =>
  status.value ? stages.findIndex(s => s.id === status.value!.stage) : -1,
)

async function submit() {
  if (!canSubmit.value) return
  error.value = null
  status.value = null
  loading.value = true
  try {
    const res = await $fetch<any>(`${apiBase}/jobs/public-status/`, {
      method: 'POST',
      body: { reference: reference.value.trim().toUpperCase(), contact: contact.value.trim() },
    })
    // Backend may return either a public summary or a signed URL to the
    // authenticated tracker. Handle both shapes gracefully.
    if (res?.redirect) return navigateTo(res.redirect, { external: true })
    status.value = res
  } catch (e: any) {
    if (e?.status === 404)      error.value = "We couldn't find that job. Double-check the reference."
    else if (e?.status === 401) error.value = 'That contact does not match this job.'
    else if (e?.status === 429) error.value = 'Too many attempts — try again in a minute.'
    else                        error.value = 'Something went wrong. Please try again or email support@printy.ke.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <main class="min-h-screen bg-[var(--p-bg,#f9fafb)] text-[var(--p-text,#101828)]">
    <section class="max-w-3xl mx-auto px-6 py-16">
      <header class="mb-10">
        <p class="text-sm font-medium text-[#e13515] uppercase tracking-wider mb-3">
          Job tracker
        </p>
        <h1 class="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
          Track your print job
        </h1>
        <p class="text-lg text-[#475467] max-w-2xl">
          Paste your job reference (for example
          <code class="px-1.5 py-0.5 rounded bg-[#f2f4f7] text-[#101828]">JB-20491</code>)
          and the email or phone you used at checkout. We'll show exactly
          where the job is right now.
        </p>
      </header>

      <form
        class="bg-white rounded-2xl shadow-sm border border-[#e4e7ec] p-6 md:p-8 grid gap-5"
        novalidate
        @submit.prevent="submit"
      >
        <label class="grid gap-2">
          <span class="text-sm font-semibold">Job reference</span>
          <input
            v-model="reference"
            type="text"
            inputmode="text"
            autocomplete="off"
            spellcheck="false"
            placeholder="JB-20491"
            class="px-4 py-3 rounded-lg border border-[#d0d5dd] focus:ring-2 focus:ring-[#e13515]/30 focus:border-[#e13515] outline-none"
            :aria-invalid="reference !== '' && !refIsValid"
            required
          >
          <span v-if="reference !== '' && !refIsValid" class="text-xs text-[#b42318]">
            Format should look like JB-20491.
          </span>
        </label>

        <label class="grid gap-2">
          <span class="text-sm font-semibold">Email or phone used at checkout</span>
          <input
            v-model="contact"
            type="text"
            inputmode="email"
            autocomplete="email"
            placeholder="you@example.com  or  +2547XXXXXXXX"
            class="px-4 py-3 rounded-lg border border-[#d0d5dd] focus:ring-2 focus:ring-[#e13515]/30 focus:border-[#e13515] outline-none"
            :aria-invalid="contact !== '' && !contactIsValid"
            required
          >
        </label>

        <button
          type="submit"
          :disabled="!canSubmit"
          class="justify-self-start inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-white bg-[#e13515] hover:bg-[#c12d11] disabled:bg-[#fda08c] disabled:cursor-not-allowed transition-colors"
        >
          <span v-if="!loading">Track this job</span>
          <span v-else>Looking it up…</span>
        </button>

        <p v-if="error" role="alert" class="text-sm text-[#b42318]">{{ error }}</p>
      </form>

      <!-- Live status block -->
      <section
        v-if="status"
        class="mt-10 bg-white rounded-2xl shadow-sm border border-[#e4e7ec] p-6 md:p-8"
        aria-live="polite"
      >
        <div class="flex flex-wrap items-baseline justify-between gap-3 mb-6">
          <div>
            <p class="text-xs uppercase tracking-wider text-[#667085]">Job reference</p>
            <h2 class="text-2xl font-bold">{{ status.reference }} — {{ status.product }}</h2>
          </div>
          <span class="inline-flex items-center px-3 py-1 rounded-full bg-[#fef3f2] text-[#b42318] text-sm font-semibold">
            {{ status.stageLabel }}
          </span>
        </div>

        <ol class="grid gap-3 md:grid-cols-5">
          <li
            v-for="(s, i) in stages"
            :key="s.id"
            class="rounded-lg border p-3 text-sm"
            :class="i <= activeIndex
              ? 'border-[#e13515] bg-[#fff4f1] text-[#101828]'
              : 'border-[#e4e7ec] bg-[#f9fafb] text-[#667085]'"
          >
            <div class="font-bold mb-1">{{ i + 1 }}. {{ s.label }}</div>
            <div v-if="i < activeIndex">Done</div>
            <div v-else-if="i === activeIndex">In progress</div>
            <div v-else>Pending</div>
          </li>
        </ol>

        <p v-if="status.estCompletion" class="mt-6 text-sm text-[#475467]">
          Estimated completion: <strong>{{ status.estCompletion }}</strong>
        </p>
      </section>

      <!-- Help block -->
      <aside class="mt-10 text-sm text-[#475467]">
        Can't find your reference? It's in the confirmation email or SMS you
        received from Printy after payment. Still stuck?
        <a href="mailto:support@printy.ke" class="text-[#e13515] font-semibold hover:underline">
          Email support@printy.ke
        </a>
        or
        <a href="https://wa.me/254700000000" class="text-[#e13515] font-semibold hover:underline">
          WhatsApp us
        </a>.
      </aside>
    </section>
  </main>
</template>
