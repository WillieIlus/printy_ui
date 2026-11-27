<script setup lang="ts">
import DesignPrinterSurface from '~/components/design/printer/PrinterSurface.vue'
import DesignPrinterPageHeader from '~/components/design/printer/PrinterPageHeader.vue'

definePageMeta({
  layout: 'design-workspace',
  middleware: 'proto-role',
  breadcrumb: [{ label: 'Setup', to: '/app/printer/setup' }],
})

useHead({ title: 'Shop setup', meta: [{ name: 'robots', content: 'noindex' }] })

const links = [
  { href: '/app/printer/get-started', title: 'Get started', body: 'The five short steps that make your shop visible to managers.' },
  { href: '/app/printer/rates', title: 'Prices', body: 'Your rate card: one printing price per standard sheet, plus finishing.' },
  { href: '/app/printer/shop', title: 'Shop profile', body: 'Paper stock, finishing services and presses.' },
  { href: '/app/printer/payouts', title: 'Payouts', body: 'What Printy has released and what is still held until delivery.' },
] as const
</script>

<template>
  <DesignPrinterSurface>
    <div class="mx-auto flex w-full max-w-[900px] flex-col gap-6 pb-40">
      <DesignPrinterPageHeader
        index="ST"
        kicker="Printer desk"
        title="Shop setup"
        description="Keep your shop, prices and press details current. Each card opens the existing setup screen."
      />

      <div class="grid gap-4 sm:grid-cols-2">
        <NuxtLink
          v-for="link in links"
          :key="link.href"
          :to="link.href"
          class="group rounded-2xl border border-line bg-card p-5 shadow-card transition-colors hover:border-brand/60"
        >
          <div class="flex items-start justify-between gap-3">
            <div>
              <h2 class="text-[15px] font-bold tracking-tight">{{ link.title }}</h2>
              <p class="mt-1 text-[12.5px] leading-relaxed text-ink-2">{{ link.body }}</p>
            </div>
            <span class="font-mono text-[10px] text-ink-3 transition-colors group-hover:text-brand">Open</span>
          </div>
        </NuxtLink>
      </div>
    </div>
  </DesignPrinterSurface>
</template>
