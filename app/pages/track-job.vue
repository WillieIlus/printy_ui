<script setup lang="ts">
useSeoMeta({
  title: 'Track a print job',
  description: 'Enter your Printy job reference and checkout contact to see where your print job is right now.',
  ogTitle: 'Track your print job - Printy',
  ogDescription: 'Live status for every Printy job from prepress to delivery.',
  ogImage: 'https://printy.ke/assets/og/printy-og-default.jpg',
  ogUrl: 'https://printy.ke/track-job',
  twitterCard: 'summary_large_image',
  twitterImage: 'https://printy.ke/assets/og/printy-og-default.jpg',
  robots: 'index,follow',
})

useHead({
  link: [{ rel: 'canonical', href: 'https://printy.ke/track-job' }],
})

type PublicJobStatus = {
  reference: string
  product: string
  quantity: number | null
  stage: 'order_confirmed' | 'artwork_approved' | 'printing' | 'finishing' | 'delivery' | 'completed'
  stageLabel: string
  estCompletion?: string
}

const config = useRuntimeConfig()
const apiBase = String(config.public.apiBaseUrl || 'https://api.printy.ke/api')

const reference = ref('')
const contact = ref('')
const loading = ref(false)
const error = ref('')
const status = ref<PublicJobStatus | null>(null)

const refIsValid = computed(() => /^JB-\d{4,8}$/i.test(reference.value.trim()))
const contactIsValid = computed(() => {
  const value = contact.value.trim()
  return /^\S+@\S+\.\S+$/.test(value) || /^\+?[0-9 -]{7,}$/.test(value)
})
const canSubmit = computed(() => refIsValid.value && contactIsValid.value && !loading.value)

const stages = [
  { id: 'order_confirmed', label: 'Order confirmed' },
  { id: 'artwork_approved', label: 'Artwork approved' },
  { id: 'printing', label: 'Printing' },
  { id: 'finishing', label: 'Finishing' },
  { id: 'delivery', label: 'Out for delivery' },
] as const

const activeIndex = computed(() => (
  status.value ? stages.findIndex(stage => stage.id === status.value?.stage) : -1
))

async function submit() {
  if (!canSubmit.value) return

  error.value = ''
  status.value = null
  loading.value = true

  try {
    const result = await $fetch<PublicJobStatus | { redirect?: string }>(`${apiBase}/jobs/public-status/`, {
      method: 'POST',
      body: {
        reference: reference.value.trim().toUpperCase(),
        contact: contact.value.trim(),
      },
    })

    if ('redirect' in result && result.redirect) {
      await navigateTo(result.redirect, { external: true })
      return
    }

    status.value = result as PublicJobStatus
  } catch (caught: unknown) {
    const responseError = caught as { status?: number }
    if (responseError.status === 404) {
      error.value = "We couldn't find that job. Double-check the reference."
    } else if (responseError.status === 401) {
      error.value = 'That contact does not match this job.'
    } else if (responseError.status === 429) {
      error.value = 'Too many attempts. Try again in a minute.'
    } else {
      error.value = 'Something went wrong. Please try again or email support@printy.ke.'
    }
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <main class="min-h-screen bg-[var(--p-bg,#f9fafb)] text-[var(--p-text,#101828)]">
    <section class="mx-auto max-w-3xl px-6 py-16">
      <header class="mb-10">
        <p class="mb-3 text-sm font-medium uppercase tracking-wider text-[#e13515]">
          Job tracker
        </p>
        <h1 class="mb-4 text-4xl font-extrabold tracking-tight md:text-5xl">
          Track your print job
        </h1>
        <p class="max-w-2xl text-lg text-[#475467]">
          Paste your job reference and the email or phone you used at checkout. We'll show exactly where the job is right now.
        </p>
      </header>

      <form
        class="grid gap-5 rounded-2xl border border-[#e4e7ec] bg-white p-6 shadow-sm md:p-8"
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
            class="rounded-lg border border-[#d0d5dd] px-4 py-3 outline-none focus:border-[#e13515] focus:ring-2 focus:ring-[#e13515]/30"
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
            placeholder="you@example.com or +2547XXXXXXXX"
            class="rounded-lg border border-[#d0d5dd] px-4 py-3 outline-none focus:border-[#e13515] focus:ring-2 focus:ring-[#e13515]/30"
            :aria-invalid="contact !== '' && !contactIsValid"
            required
          >
        </label>

        <button
          type="submit"
          :disabled="!canSubmit"
          class="inline-flex items-center justify-center rounded-lg bg-[#e13515] px-6 py-3 font-semibold text-white transition-colors hover:bg-[#c12d11] disabled:cursor-not-allowed disabled:bg-[#fda08c] sm:justify-self-start"
        >
          {{ loading ? 'Looking it up...' : 'Track this job' }}
        </button>

        <p v-if="error" role="alert" class="text-sm text-[#b42318]">{{ error }}</p>
      </form>

      <section
        v-if="status"
        class="mt-10 rounded-2xl border border-[#e4e7ec] bg-white p-6 shadow-sm md:p-8"
        aria-live="polite"
      >
        <div class="mb-6 flex flex-wrap items-baseline justify-between gap-3">
          <div>
            <p class="text-xs uppercase tracking-wider text-[#667085]">Job reference</p>
            <h2 class="text-2xl font-bold">{{ status.reference }} - {{ status.product }}</h2>
          </div>
          <span class="inline-flex items-center rounded-full bg-[#fef3f2] px-3 py-1 text-sm font-semibold text-[#b42318]">
            {{ status.stageLabel }}
          </span>
        </div>

        <ol class="grid gap-3 md:grid-cols-5">
          <li
            v-for="(stage, index) in stages"
            :key="stage.id"
            class="rounded-lg border p-3 text-sm"
            :class="index <= activeIndex
              ? 'border-[#e13515] bg-[#fff4f1] text-[#101828]'
              : 'border-[#e4e7ec] bg-[#f9fafb] text-[#667085]'"
          >
            <div class="mb-1 font-bold">{{ index + 1 }}. {{ stage.label }}</div>
            <div v-if="index < activeIndex">Done</div>
            <div v-else-if="index === activeIndex">In progress</div>
            <div v-else>Pending</div>
          </li>
        </ol>

        <p v-if="status.estCompletion" class="mt-6 text-sm text-[#475467]">
          Estimated completion: <strong>{{ status.estCompletion }}</strong>
        </p>
      </section>

      <aside class="mt-10 text-sm text-[#475467]">
        Can't find your reference? It is in the confirmation email or SMS you received from Printy after payment.
        <a href="mailto:support@printy.ke" class="font-semibold text-[#e13515] hover:underline">
          Email support@printy.ke
        </a>.
      </aside>
    </section>
  </main>
</template>
