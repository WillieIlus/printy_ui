<script setup lang="ts">
useHead({
  title: 'About Printy - How Printy Works',
})

const steps = [
  { number: '1', title: 'Enter specs', copy: 'Select product type, quantity, material, size, sides, and finishing.' },
  { number: '2', title: 'Preview range', copy: 'See a public price range from configured production capacity and imposition logic.' },
  { number: '3', title: 'Upload artwork', copy: 'Attach files so the manager can confirm quality, size, bleed, and turnaround.' },
  { number: '4', title: 'Track job', copy: 'Follow quote approval, payment, production, finishing, and delivery from one place.' },
]

const audiences = [
  { title: 'Clients', copy: 'Get a price range before committing, then pay and track the job through Printy.' },
  { title: 'Print Managers', copy: 'Quote faster, keep client pricing organized, and route production without exposing shop rates.' },
  { title: 'Print Shops', copy: 'Receive structured jobs with clearer specs, artwork state, payment status, and production tracking.' },
]

const comparison = [
  { title: 'A directory', items: ['Lists shops', 'No live pricing', 'No job workflow'], featured: false },
  { title: 'A quote tool', items: ['Shows estimates', 'No production tracking', 'No payment workflow'], featured: false },
  { title: 'Printy', items: ['Live pricing logic', 'Verified production shops', 'Quote, payment, and tracking workflow'], featured: true },
]
</script>

<template>
  <main class="bg-white text-slate-900">
    <section class="mx-auto max-w-6xl px-6 py-16">
      <p class="text-sm font-semibold uppercase tracking-[0.2em] text-[#e13515]">About Printy</p>
      <h1 class="mt-4 max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl">
        Kenya's print operating system for pricing, payment, production, and tracking.
      </h1>
      <p class="mt-5 max-w-2xl text-base leading-7 text-slate-600">
        Printy helps clients get clearer quotes, managers run structured workflows, and production shops receive jobs with the details needed to print accurately.
      </p>
    </section>

    <section class="border-y border-slate-200 bg-slate-50">
      <div class="mx-auto grid max-w-6xl gap-4 px-6 py-12 md:grid-cols-4">
        <article v-for="step in steps" :key="step.number" class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <span class="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#fff4ed] text-sm font-bold text-[#e13515]">{{ step.number }}</span>
          <h2 class="mt-4 text-base font-bold text-slate-900">{{ step.title }}</h2>
          <p class="mt-2 text-sm leading-6 text-slate-600">{{ step.copy }}</p>
        </article>
      </div>
    </section>

    <section class="mx-auto grid max-w-6xl gap-6 px-6 py-12 md:grid-cols-3">
      <article v-for="audience in audiences" :key="audience.title" class="rounded-2xl border border-slate-200 p-6">
        <h2 class="text-lg font-bold text-slate-900">{{ audience.title }}</h2>
        <p class="mt-2 text-sm leading-6 text-slate-600">{{ audience.copy }}</p>
      </article>
    </section>

    <section class="mx-auto grid max-w-6xl gap-4 px-6 pb-16 md:grid-cols-3">
      <article
        v-for="item in comparison"
        :key="item.title"
        class="rounded-2xl border p-6"
        :class="item.featured ? 'border-[#fed7b5] bg-[#fff4ed]' : 'border-slate-200 bg-white'"
      >
        <h2 class="text-base font-bold text-slate-900">{{ item.title }}</h2>
        <ul class="mt-4 space-y-2 text-sm text-slate-600">
          <li v-for="point in item.items" :key="point">{{ point }}</li>
        </ul>
      </article>
    </section>
  </main>
</template>
