<script setup lang="ts">
/**
 * /contact — single source of truth for how to reach Printy.
 * Mirrors the structured-data ContactPoint declared in app.head.ts.
 */

import { useSeoMeta, useHead } from '#imports'

useSeoMeta({
  title: 'Contact Printy',
  description:
    'Talk to a human at Printy. Email, WhatsApp, or call — we answer fast in Nairobi office hours.',
  ogTitle: 'Contact Printy',
  ogUrl: 'https://printy.ke/contact',
  ogImage: 'https://printy.ke/assets/og/printy-og-default.jpg',
  robots: 'index,follow',
})
useHead({
  link: [{ rel: 'canonical', href: 'https://printy.ke/contact' }],
  script: [{
    type: 'application/ld+json',
    innerHTML: JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'ContactPage',
      url: 'https://printy.ke/contact',
      name: 'Contact Printy',
      isPartOf: { '@id': 'https://printy.ke/#website' },
      mainEntity: {
        '@type': 'Organization',
        '@id': 'https://printy.ke/#org',
        name: 'Printy',
        email: 'support@printy.ke',
        telephone: '+254-700-000000',
        address: {
          '@type': 'PostalAddress',
          addressCountry: 'KE',
          addressLocality: 'Nairobi',
          streetAddress: '[[Street, building, floor]]',
        },
        openingHoursSpecification: [{
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: ['Monday','Tuesday','Wednesday','Thursday','Friday'],
          opens: '08:30',
          closes: '17:30',
        }, {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: 'Saturday',
          opens: '09:00',
          closes: '13:00',
        }],
      },
    }),
  }],
})
</script>

<template>
  <main class="bg-[#f9fafb] text-[#101828]">
    <section class="max-w-4xl mx-auto px-6 py-16">
      <p class="text-sm font-semibold uppercase tracking-wider text-[#e13515] mb-3">Contact</p>
      <h1 class="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
        Talk to a human at Printy
      </h1>
      <p class="text-lg text-[#475467] max-w-2xl mb-10">
        Real questions deserve real answers. Email gets a reply within a
        few hours during Nairobi office hours; WhatsApp is usually faster.
      </p>

      <div class="grid md:grid-cols-2 gap-5">
        <a
          href="mailto:support@printy.ke"
          class="block p-6 bg-white rounded-2xl border border-[#e4e7ec] hover:border-[#e13515] hover:shadow-md transition"
        >
          <div class="text-sm font-semibold text-[#667085]">Email support</div>
          <div class="text-xl font-bold mt-1">support@printy.ke</div>
          <div class="text-sm text-[#475467] mt-2">For job questions, refunds, and anything that needs a paper trail.</div>
        </a>

        <a
          href="https://wa.me/254700000000"
          class="block p-6 bg-white rounded-2xl border border-[#e4e7ec] hover:border-[#e13515] hover:shadow-md transition"
        >
          <div class="text-sm font-semibold text-[#667085]">WhatsApp</div>
          <div class="text-xl font-bold mt-1">+254 700 000 000</div>
          <div class="text-sm text-[#475467] mt-2">Fastest path to a human during office hours.</div>
        </a>

        <a
          href="tel:+254700000000"
          class="block p-6 bg-white rounded-2xl border border-[#e4e7ec] hover:border-[#e13515] hover:shadow-md transition"
        >
          <div class="text-sm font-semibold text-[#667085]">Phone</div>
          <div class="text-xl font-bold mt-1">+254 700 000 000</div>
          <div class="text-sm text-[#475467] mt-2">Mon–Fri 08:30–17:30 · Sat 09:00–13:00 EAT.</div>
        </a>

        <a
          href="mailto:partners@printy.ke"
          class="block p-6 bg-white rounded-2xl border border-[#e4e7ec] hover:border-[#e13515] hover:shadow-md transition"
        >
          <div class="text-sm font-semibold text-[#667085]">Partners &amp; Print Shops</div>
          <div class="text-xl font-bold mt-1">partners@printy.ke</div>
          <div class="text-sm text-[#475467] mt-2">Onboarding for Print Managers and verified production shops.</div>
        </a>
      </div>

      <div class="mt-10 p-6 bg-white rounded-2xl border border-[#e4e7ec]">
        <h2 class="text-xl font-bold mb-2">Office</h2>
        <address class="not-italic text-[#475467]">
          [[Building name]], [[Street]],<br>
          Nairobi, Kenya
        </address>
      </div>
    </section>
  </main>
</template>
