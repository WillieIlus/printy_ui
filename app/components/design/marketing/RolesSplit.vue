<script setup lang="ts">
import { computed } from 'vue'
import { getIcon } from '../../../utils/design/icon-registry'

export type DesignRoleSplitImage = {
  src: string
  alt: string
}

const props = withDefaults(defineProps<{
  managerImage?: DesignRoleSplitImage
  shopImage?: DesignRoleSplitImage
}>(), {
  managerImage: undefined,
  shopImage: undefined,
})

const cards = computed(() => [
  {
    eyebrow: 'For managers',
    title: 'Run quote, jobs and clients from one desk.',
    copy: 'Priced requests land pre-computed under the fair-price cap. Send them, assign verified shops, and watch margin build without a single spreadsheet.',
    href: '/for-managers',
    cta: 'See the manager desk',
    tone: 'ink' as const,
    image: props.managerImage,
  },
  {
    eyebrow: 'For print shops',
    title: 'Jobs matched to your rate card. Paid on delivery.',
    copy: 'Set your rates once. Orders arrive sized, specced and escrow-funded - you print, advance the stage, and get paid the moment QC clears.',
    href: '/for-shops',
    cta: 'See the shop floor',
    tone: 'paper' as const,
    image: props.shopImage,
  },
])
</script>

<template>
  <section class="mx-auto grid max-w-6xl gap-5 px-5 pb-20 sm:px-8 lg:grid-cols-2">
    <article
      v-for="card in cards" :key="card.title"
      :class="[
        'group relative flex flex-col overflow-hidden rounded-2xl border p-7 transition-shadow duration-300 hover:shadow-lift sm:p-9',
        card.tone === 'ink' ? 'border-ink bg-ink text-paper' : 'border-line bg-card',
      ]"
    >
      <p :class="['font-mono text-[10.5px] tracking-[0.18em] uppercase', card.tone === 'ink' ? 'text-brand-bright' : 'text-brand']">
        {{ card.eyebrow }}
      </p>
      <h3 class="mt-3 max-w-sm text-2xl leading-tight font-bold tracking-tight text-balance sm:text-3xl">{{ card.title }}</h3>
      <p :class="['mt-3 max-w-md text-[15px] leading-relaxed', card.tone === 'ink' ? 'text-paper/65' : 'text-ink-2']">{{ card.copy }}</p>
      <div v-if="card.image" class="relative mt-6 overflow-hidden rounded-xl border border-line/60">
        <img
          :src="card.image.src"
          :alt="card.image.alt"
          width="940"
          height="600"
          loading="lazy"
          class="h-44 w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
        />
      </div>
      <NuxtLink
        :to="card.href"
        :class="[
          'mt-6 inline-flex w-fit items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition-colors',
          card.tone === 'ink'
            ? 'border-paper/25 text-paper hover:border-brand-bright hover:text-brand-bright'
            : 'border-line-strong text-ink hover:border-brand hover:text-brand',
        ]"
      >
        {{ card.cta }}
        <component :is="getIcon('ArrowUpRight')" class="h-4 w-4" />
      </NuxtLink>
    </article>
  </section>
</template>
