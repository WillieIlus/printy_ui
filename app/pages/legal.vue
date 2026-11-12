<template>
  <main id="top" class="mx-auto w-full max-w-4xl px-5 pb-20 pt-8 sm:px-8 sm:pt-10">
    <LegalBreadcrumbs current="Legal" parent-label="Home" parent-to="/" />

    <header class="mt-6 max-w-2xl">
      <DesignSectionLabel index="LP" tone="brand">Small print</DesignSectionLabel>
      <h1 class="mt-3 text-[34px] leading-[1.03] font-bold tracking-tight text-ink text-balance sm:text-[46px]">
        The rules, the data, and the help.
      </h1>
      <p class="mt-4 text-[14.5px] leading-relaxed text-ink-2">
        Printy's legal documents now live on their own pages. Pick one below, or use the footer links anywhere in the app.
      </p>
    </header>

    <div class="mt-9 grid gap-4 sm:grid-cols-3">
      <NuxtLink
        v-for="item in DOCUMENTS"
        :key="item.to"
        :to="item.to"
        class="group rounded-2xl border border-line bg-card p-6 shadow-card transition-all duration-300 hover:-translate-y-0.5 hover:border-brand/40 hover:shadow-lift"
      >
        <p class="font-mono text-[9.5px] uppercase tracking-[0.14em] text-ink-3">{{ item.index }}</p>
        <h2 class="mt-3 text-[18px] font-bold tracking-tight text-ink">{{ item.title }}</h2>
        <p class="mt-2 text-[13px] leading-relaxed text-ink-2">{{ item.copy }}</p>
        <span class="mt-4 inline-flex items-center gap-1 font-mono text-[10px] font-semibold uppercase tracking-[0.1em] text-brand">
          Read {{ item.title }}
          <ArrowRight :size="12" class="transition-transform group-hover:translate-x-0.5" />
        </span>
      </NuxtLink>
    </div>

    <p class="mt-8 text-[13px] leading-relaxed text-ink-2">
      You can also email
      <a href="mailto:support@printy.ke" class="font-medium text-brand underline underline-offset-4">support@printy.ke</a>
      with any question about a document, a job or your data.
    </p>
  </main>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { ArrowRight } from 'lucide-vue-next'
import DesignSectionLabel from '~/components/design/ui/SectionLabel.vue'
import LegalBreadcrumbs from '~/components/legal/LegalBreadcrumbs.vue'

definePageMeta({ layout: 'design-public', role: 'client' })

useHead({ title: 'Printy - Legal' })

const DOCUMENTS = [
  {
    index: '01',
    title: 'Terms',
    to: '/terms',
    copy: 'Quotes, artwork, payment and custody, deadlines, disputes and account rules.',
  },
  {
    index: '02',
    title: 'Privacy',
    to: '/privacy',
    copy: 'What we collect, who can see it, how long we keep it and your data rights.',
  },
  {
    index: '03',
    title: 'Help',
    to: '/help',
    copy: 'Fast answers about quotes, artwork, M-Pesa, tracking and late jobs.',
  },
] as const

/** Old /legal#terms, #privacy and #help links must keep working. */
onMounted(() => {
  const hash = window.location.hash.replace('#', '').toLowerCase()
  if (hash === 'terms' || hash === 'privacy' || hash === 'help') {
    void navigateTo(`/${hash}`, { replace: true })
  }
})
</script>
