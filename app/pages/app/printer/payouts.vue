<script setup lang="ts">
import DesignPrinterSurface from '~/components/design/printer/PrinterSurface.vue'
import DesignPrinterPageHeader from '~/components/design/printer/PrinterPageHeader.vue'
import DesignCard from '~/components/design/ui/Card.vue'
import DesignStat from '~/components/design/ui/Stat.vue'
import { usePrinterJobsStore } from '~/stores/printer-jobs'
import { formatKES } from '~/utils/printy'

definePageMeta({
  layout: 'design-workspace',
  middleware: 'proto-role',
  breadcrumb: [
    { label: 'Setup', to: '/app/printer/setup' },
    { label: 'Payouts', to: '' },
  ],
})

useHead({ title: 'Payouts', meta: [{ name: 'robots', content: 'noindex' }] })

const store = usePrinterJobsStore()

const completed = computed(() => store.items.filter((item) => String(item.status) === 'completed' || item.muted))
const pending = computed(() => store.items
  .filter((item) => String(item.status) !== 'completed')
  .reduce((sum, item) => sum + Number(item.canonical?.printer_payout ?? 0), 0))
const released = computed(() => completed.value
  .reduce((sum, item) => sum + Number(item.canonical?.printer_payout ?? 0), 0))

onMounted(() => {
  void store.load()
})
</script>

<template>
  <DesignPrinterSurface>
    <div class="mx-auto flex w-full max-w-[900px] flex-col gap-6 pb-40">
      <DesignPrinterPageHeader
        index="PO"
        kicker="Printer desk"
        title="Payouts"
        description="Your share is held by Printy until delivery is confirmed, then released to your payout details."
      >
        <template #actions>
          <NuxtLink
            to="/app/printer/setup"
            class="inline-flex h-10 items-center rounded-xl border border-line-strong bg-card px-4 text-sm font-semibold text-ink transition-colors hover:border-brand hover:text-brand"
          >
            Back to setup
          </NuxtLink>
        </template>
      </DesignPrinterPageHeader>

      <section class="grid gap-4 sm:grid-cols-2">
        <DesignCard class="p-5">
          <DesignStat label="Payouts pending" :value="formatKES(pending)" tone="amber" hint="held until delivery" />
        </DesignCard>
        <DesignCard class="p-5">
          <DesignStat label="Paid out" :value="formatKES(released)" tone="green" :hint="`${completed.length} completed job${completed.length === 1 ? '' : 's'}`" />
        </DesignCard>
      </section>

      <DesignCard class="p-5">
        <p class="text-[15px] font-bold tracking-tight">Completed jobs</p>
        <p class="mt-1 text-[12.5px] leading-relaxed text-ink-2">
          Payout records appear here when delivery is confirmed. Printy currently records releases manually.
        </p>
        <div v-if="completed.length" class="mt-4 divide-y divide-line">
          <div v-for="job in completed" :key="job.id" class="flex flex-wrap items-center justify-between gap-3 py-3">
            <div>
              <p class="text-[13px] font-semibold">{{ job.title || job.managed_reference || 'Completed job' }}</p>
              <p class="mt-0.5 font-mono text-[10px] uppercase tracking-[0.1em] text-ink-3">{{ job.managed_reference || job.code }}</p>
            </div>
            <p class="font-mono text-[12.5px] font-semibold text-green">{{ formatKES(Number(job.canonical?.printer_payout ?? 0)) }}</p>
          </div>
        </div>
        <p v-else class="mt-4 text-[12.5px] text-ink-2">No completed jobs yet. Delivered jobs appear here once the buyer confirms receipt.</p>
      </DesignCard>
    </div>
  </DesignPrinterSurface>
</template>
