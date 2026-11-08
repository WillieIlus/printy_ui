<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { ArrowLeft, Loader2 } from 'lucide-vue-next'
import DesignPrinterSurface from '~/components/design/printer/PrinterSurface.vue'
import DesignPrinterOnboarding from '~/components/design/printer/PrinterOnboarding.vue'
import type {
  PrinterOnboardingState,
  PrinterOnboardingStep,
  PrinterOnboardingStepStatus,
} from '~/components/design/printer/PrinterOnboarding.vue'
import { useApi } from '~/composables/useApi'
import { getApiErrorMessage } from '~/shared/api'
import { API } from '~/shared/api-paths'
import { useAuthStore } from '~/stores/auth'
import { useShopStore } from '~/stores/shop'

definePageMeta({
  layout: 'design-workspace',
  middleware: 'proto-role',
  breadcrumb: [{ label: 'Get started', to: '/app/printer/get-started' }],
})

interface RateCardSetupStep {
  code: string
  title: string
  hint: string
  done: boolean
  route: string
}

interface RateCardSetupStatus {
  is_confirmed: boolean
  is_ready_to_confirm: boolean
  completed_steps: number
  total_steps: number
  next_step: RateCardSetupStep | null
  steps: RateCardSetupStep[]
}

interface RateCardSetupPayload {
  setup_status?: RateCardSetupStatus
}

const auth = useAuthStore()
const shop = useShopStore()
const { api } = useApi()

const setup = ref<RateCardSetupStatus | null>(null)
const loading = ref(true)
const errorText = ref('')

const activeShop = computed(() => shop.active)

const printerName = computed(() => {
  const fromUser = String(auth.user?.shop_name ?? '').trim()
  if (fromUser) return fromUser
  const fromShop = String(activeShop.value?.name ?? '').trim()
  if (fromShop) return fromShop
  const first = String(auth.user?.name ?? '').trim().split(/\s+/)[0]
  return first ? `${first} Press` : 'your print shop'
})

const profileDone = computed(() => {
  const record = activeShop.value
  if (!record) return false
  const hasName = Boolean(String(record.name ?? '').trim())
  const hasContact = Boolean(
    String(record.phone_number ?? '').trim() || String(record.public_whatsapp_number ?? '').trim(),
  )
  const hasLocation = Boolean(String(record.city ?? '').trim() || String(record.service_area ?? '').trim())
  return hasName && hasContact && hasLocation
})

const machinesDone = computed(() => shop.machines.length > 0)
const paperDone = computed(() => shop.papers.some((paper) => Number(paper.selling_price) > 0))
const rateCardDone = computed(() => Boolean(setup.value?.is_confirmed))
const printingRateDone = computed(() => Boolean(
  setup.value?.steps.find((step) => step.code === 'printing_rate')?.done,
))
const hoursDone = computed(() => {
  const record = activeShop.value
  if (!record) return false
  return Boolean(String(record.opening_hours_text ?? '').trim())
})
const deliveryDone = computed(() => {
  const record = activeShop.value
  if (!record) return false
  return Boolean(
    String(record.turnaround_statement ?? '').trim() || String(record.service_area ?? '').trim(),
  )
})

function statusFor(done: boolean, started = false): PrinterOnboardingStepStatus {
  if (done) return 'done'
  return started ? 'in_progress' : 'not_started'
}

const steps = computed<PrinterOnboardingStep[]>(() => {
  const record = activeShop.value
  const rateCardSummary = setup.value
    ? `${setup.value.completed_steps} of ${setup.value.total_steps} rate-card checks done`
    : 'Rate-card checks are loading.'

  return [
    {
      id: 'profile',
      title: 'Shop profile',
      why: 'Managers pick shops by name, contact and location — a blank name can never be routed a job.',
      cta: 'Edit shop profile',
      href: '/app/printer/shop',
      status: statusFor(profileDone.value, Boolean(String(record?.name ?? '').trim())),
      fields: ['Shop name', 'Phone or WhatsApp', 'City or service area'],
    },
    {
      id: 'machines',
      title: 'Machines',
      why: 'Tell us which press you print on so jobs are matched to equipment that can actually run them.',
      cta: machinesDone.value ? 'Review machines' : 'Add your first machine',
      href: '/app/printer/shop',
      status: statusFor(machinesDone.value),
      fields: ['Press name', 'Max sheet size', 'GSM range'],
      note: machinesDone.value
        ? `${shop.machines.length} machine${shop.machines.length === 1 ? '' : 's'} on file.`
        : 'A machine is required before a rate card can go live.',
    },
    {
      id: 'paper',
      title: 'Paper stock',
      why: 'Add at least one paper with a selling price so Printy can quote every sheet you hold.',
      cta: paperDone.value ? 'Review paper stock' : 'Add priced paper',
      href: '/app/printer/shop',
      status: statusFor(paperDone.value, shop.papers.length > 0),
      fields: ['Paper name', 'Sheet size', 'Selling price'],
      note: shop.papers.length
        ? `${shop.papers.length} paper${shop.papers.length === 1 ? '' : 's'} on file.`
        : 'No paper stock has been added yet.',
    },
    {
      id: 'printing-rate',
      title: 'Printing rate',
      why: 'Set your per-sheet price so managers can match jobs to you inside the server-enforced fair band.',
      cta: printingRateDone.value ? 'Review printing rates' : 'Set a printing rate',
      href: '/app/printer/rates',
      status: statusFor(printingRateDone.value, Boolean(setup.value?.completed_steps)),
      fields: ['Single-sided rate', 'Double-sided rate', 'Heavy-paper surcharge'],
      note: rateCardSummary,
    },
    {
      id: 'ratecard',
      title: 'Confirm and go live',
      why: 'Confirm your rate card so managers can find and pick your shop. This is the visibility gate.',
      cta: rateCardDone.value ? 'Review rate card' : 'Confirm rate card',
      href: '/app/printer/rates',
      status: statusFor(rateCardDone.value, Boolean(setup.value?.is_ready_to_confirm)),
      gate: true,
      fields: ['Paper rows', 'Printing rates', 'Finishing rates'],
      note: rateCardDone.value
        ? 'Confirmed — managers can see your shop.'
        : 'Saving alone is not enough: the card must be confirmed.',
    },
    {
      id: 'hours',
      title: 'Hours and delivery',
      why: 'Opening hours and a turnaround statement set the expectation buyers see before they order.',
      cta: 'Edit hours and delivery',
      href: '/app/printer/shop',
      status: statusFor(
        hoursDone.value && deliveryDone.value,
        hoursDone.value || deliveryDone.value,
      ),
      fields: ['Opening hours', 'Turnaround statement', 'Service area'],
    },
  ]
})

const doneCount = computed(() => steps.value.filter((step) => step.status === 'done').length)
const total = computed(() => steps.value.length)
const visibleToManagers = computed(() => Boolean(setup.value?.is_confirmed))

const nextOpenStep = computed(() => steps.value.find((step) => step.status !== 'done') ?? null)

const state = computed<PrinterOnboardingState>(() => ({
  printerName: printerName.value,
  steps: steps.value,
  doneCount: doneCount.value,
  total: total.value,
  chipLabel: visibleToManagers.value
    ? 'Live to managers'
    : `${doneCount.value} of ${total.value} steps done`,
  chipQuiet: !visibleToManagers.value,
  visibleToManagers: visibleToManagers.value,
  visibilityTitle: visibleToManagers.value
    ? 'You are live to managers'
    : 'Not visible to managers yet',
  visibilityBody: visibleToManagers.value
    ? 'Your rate card is confirmed. Managers can now match jobs to your shop.'
    : 'Your rate card must be saved and confirmed before managers can find your shop.',
  tip: visibleToManagers.value
    ? 'Your shop is live. Keep paper prices and machine limits current so every match stays accurate. Payouts release automatically after delivery — there is no payout step to configure.'
    : 'The rate card is the last gate. Save it once and your shop appears to every manager inside the fair band. Payouts release automatically after delivery.',
  banner: nextOpenStep.value
    ? {
        title: nextOpenStep.value.title,
        body: nextOpenStep.value.why,
        cta: nextOpenStep.value.cta,
        href: nextOpenStep.value.href,
      }
    : null,
}))

async function load() {
  loading.value = true
  errorText.value = ''
  try {
    await shop.fetchShops()
    if (shop.hasShop) {
      await Promise.all([
        shop.fetchPapers(),
        shop.fetchMachines(),
        shop.fetchFinishings(),
      ])
    }
    try {
      const payload = await api<RateCardSetupPayload>(API.rateCard.setup)
      setup.value = payload.setup_status ?? null
    } catch (error) {
      setup.value = null
      errorText.value = getApiErrorMessage(error, 'Rate-card setup status is unavailable right now.')
    }
  } catch (error) {
    errorText.value = getApiErrorMessage(error, 'Your shop setup could not be loaded.')
  } finally {
    loading.value = false
  }
}

onMounted(load)
</script>

<template>
  <DesignPrinterSurface>
    <div class="flex flex-col gap-6">
      <NuxtLink
        to="/app/printer"
        class="inline-flex w-fit items-center gap-1.5 font-mono text-[10px] font-semibold tracking-[0.14em] text-ink-3 uppercase transition-colors hover:text-brand"
      >
        <ArrowLeft :size="12" /> Back to the floor
      </NuxtLink>

      <div
        v-if="loading"
        class="flex items-center justify-center gap-2 rounded-2xl border border-line bg-card py-14 text-sm text-ink-2"
      >
        <Loader2 :size="16" class="animate-spin text-brand" aria-hidden="true" />
        Loading your setup checklist…
      </div>

      <template v-else>
        <div
          v-if="errorText || shop.error"
          class="rounded-2xl border border-amber/45 bg-amber-soft/60 px-4 py-3 text-[13px] text-ink-2"
          role="status"
        >
          {{ errorText || shop.error }}
        </div>
        <DesignPrinterOnboarding :state="state" />
      </template>
    </div>
  </DesignPrinterSurface>
</template>
