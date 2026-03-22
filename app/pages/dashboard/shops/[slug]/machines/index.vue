<template>
  <div class="col-span-12 space-y-6 pb-2">
    <section class="relative overflow-hidden rounded-[34px] border border-white/12 bg-[linear-gradient(145deg,rgba(15,23,42,0.94),rgba(10,15,26,0.84))] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.32)] backdrop-blur-2xl sm:p-7 lg:p-8">
      <div class="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(251,146,60,0.18),transparent_24%),radial-gradient(circle_at_80%_20%,rgba(59,130,246,0.12),transparent_22%),radial-gradient(circle_at_bottom_right,rgba(15,23,42,0.5),transparent_30%)]" />
      <div class="relative flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
        <div class="max-w-4xl space-y-4">
          <div class="flex flex-wrap items-center gap-2">
            <span class="inline-flex items-center gap-2 rounded-full border border-orange-400/25 bg-orange-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.28em] text-orange-200">
              <span class="h-2 w-2 rounded-full bg-orange-300" />
              Machine Management
            </span>
            <span class="inline-flex items-center rounded-full border border-white/10 bg-white/[0.06] px-3 py-1 text-xs text-slate-300">
              {{ shopName }}
            </span>
          </div>

          <div class="space-y-3">
            <h1 class="max-w-3xl text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Build a machine list your products can trust
            </h1>
            <p class="max-w-3xl text-sm leading-7 text-slate-300 sm:text-base">
              Machines are the operational link between products, paper size compatibility, and believable imposition. If the press cannot take the parent sheet, the product should not quietly assume it can.
            </p>
          </div>

          <div class="grid gap-3 sm:grid-cols-3">
            <div class="rounded-[24px] border border-white/10 bg-white/[0.07] p-4 backdrop-blur-xl">
              <p class="text-[11px] uppercase tracking-[0.24em] text-slate-500">Machine coverage</p>
              <p class="mt-3 text-3xl font-semibold text-white">{{ machineStore.machines.length }}</p>
              <p class="mt-1 text-sm text-slate-300">{{ machineCoverageLabel }}</p>
            </div>
            <div class="rounded-[24px] border border-white/10 bg-white/[0.07] p-4 backdrop-blur-xl">
              <p class="text-[11px] uppercase tracking-[0.24em] text-slate-500">Largest parent sheet</p>
              <p class="mt-3 text-base font-semibold text-white">{{ largestSheetLabel }}</p>
              <p class="mt-1 text-sm text-slate-300">{{ largestSheetNarrative }}</p>
            </div>
            <div class="rounded-[24px] border border-white/10 bg-white/[0.07] p-4 backdrop-blur-xl">
              <p class="text-[11px] uppercase tracking-[0.24em] text-slate-500">Operational signal</p>
              <p class="mt-3 text-base font-semibold text-white">{{ operationsSignal.title }}</p>
              <p class="mt-1 text-sm text-slate-300">{{ operationsSignal.description }}</p>
            </div>
          </div>
        </div>

        <div class="grid gap-3 sm:grid-cols-2 xl:w-[27rem]">
          <NuxtLink
            :to="`/dashboard/shops/${slug}`"
            class="rounded-[26px] border border-white/10 bg-white/[0.06] p-4 transition hover:border-white/15 hover:bg-white/[0.09]"
          >
            <div class="flex items-start gap-3">
              <div class="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/10 text-slate-100">
                <UIcon name="i-lucide-arrow-left" class="h-5 w-5" />
              </div>
              <div>
                <p class="text-sm font-semibold text-white">Back to shop</p>
                <p class="mt-1 text-sm leading-6 text-slate-300">Return to the main workspace overview for this shop.</p>
              </div>
            </div>
          </NuxtLink>

          <button
            type="button"
            class="rounded-[26px] border border-flamingo-400/30 bg-flamingo-500/[0.12] p-4 text-left transition hover:bg-flamingo-500/[0.16]"
            @click="openModal()"
          >
            <div class="flex items-start gap-3">
              <div class="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-flamingo-300/25 bg-flamingo-500/15 text-flamingo-100">
                <UIcon name="i-lucide-plus" class="h-5 w-5" />
              </div>
              <div>
                <p class="text-sm font-semibold text-white">Add machine</p>
                <p class="mt-1 text-sm leading-6 text-slate-300">Register the press or finishing unit your team uses most often.</p>
              </div>
            </div>
          </button>
        </div>
      </div>
    </section>

    <section class="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
      <article v-for="metric in metrics" :key="metric.label" class="rounded-[28px] border border-white/10 bg-white/[0.06] p-5 shadow-[0_16px_50px_rgba(0,0,0,0.18)] backdrop-blur-xl">
        <div class="flex items-start justify-between gap-3">
          <div class="space-y-1">
            <p class="text-[11px] uppercase tracking-[0.26em] text-slate-500">{{ metric.label }}</p>
            <p class="text-3xl font-semibold text-white">{{ metric.value }}</p>
          </div>
          <div class="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/10">
            <UIcon :name="metric.icon" class="h-5 w-5" :class="metric.iconClass" />
          </div>
        </div>
        <p class="mt-4 text-sm leading-6 text-slate-300">{{ metric.description }}</p>
      </article>
    </section>

    <div class="grid gap-6 xl:grid-cols-[1.45fr_1fr]">
      <div class="space-y-6">
        <DashboardFormSection
          title="Machine Registry"
          description="Each machine should tell the team what it can run, what paper sizes fit, and whether products should rely on it for quoting."
        >
          <template #actions>
            <UButton color="primary" variant="solid" class="justify-center bg-flamingo-500 text-white hover:bg-flamingo-400" @click="openModal()">
              <UIcon name="i-lucide-plus" class="mr-2 h-4 w-4" />
              Add machine
            </UButton>
          </template>

          <div v-if="machineStore.loading && !machineStore.machines.length" class="space-y-3">
            <DashboardSkeletonState variant="cards" :card-count="4" />
          </div>

          <div v-else-if="machineStore.machines.length" class="grid gap-4 lg:grid-cols-2">
            <article
              v-for="machine in sortedMachines"
              :key="machine.id"
              class="rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.04))] p-5 backdrop-blur-xl"
            >
              <div class="flex items-start justify-between gap-4">
                <div class="min-w-0">
                  <p class="truncate text-lg font-semibold text-white">{{ machine.name }}</p>
                  <p class="mt-1 text-sm text-slate-300">{{ machineTypeLabel(machine) }}</p>
                </div>
                <UBadge :color="machine.is_active !== false ? 'success' : 'neutral'" variant="soft" size="sm">
                  {{ machine.is_active !== false ? 'Active' : 'Inactive' }}
                </UBadge>
              </div>

              <div class="mt-4 grid gap-3 sm:grid-cols-2">
                <div class="rounded-[22px] border border-white/10 bg-slate-950/45 p-3">
                  <p class="text-[11px] uppercase tracking-[0.24em] text-slate-500">Parent sheet limit</p>
                  <p class="mt-2 text-sm font-semibold text-white">{{ sheetSizeSummary(machine) }}</p>
                  <p class="mt-1 text-sm text-slate-300">{{ sheetCompatibilityHint(machine) }}</p>
                </div>
                <div class="rounded-[22px] border border-white/10 bg-slate-950/45 p-3">
                  <p class="text-[11px] uppercase tracking-[0.24em] text-slate-500">Paper range</p>
                  <p class="mt-2 text-sm font-semibold text-white">{{ gsmSummary(machine) }}</p>
                  <p class="mt-1 text-sm text-slate-300">{{ gsmHint(machine) }}</p>
                </div>
              </div>

              <div class="mt-4 grid gap-3 sm:grid-cols-3">
                <div class="rounded-2xl border border-white/10 bg-white/[0.05] p-3">
                  <p class="text-[11px] uppercase tracking-[0.24em] text-slate-500">Products</p>
                  <p class="mt-2 text-sm font-semibold text-white">{{ productFitLabel(machine) }}</p>
                </div>
                <div class="rounded-2xl border border-white/10 bg-white/[0.05] p-3">
                  <p class="text-[11px] uppercase tracking-[0.24em] text-slate-500">Paper fit</p>
                  <p class="mt-2 text-sm font-semibold text-white">{{ paperFitLabel(machine) }}</p>
                </div>
                <div class="rounded-2xl border border-white/10 bg-white/[0.05] p-3">
                  <p class="text-[11px] uppercase tracking-[0.24em] text-slate-500">Imposition</p>
                  <p class="mt-2 text-sm font-semibold text-white">{{ impositionLabel(machine) }}</p>
                </div>
              </div>

              <p class="mt-4 text-sm leading-6 text-slate-300">{{ machineNarrative(machine) }}</p>

              <div class="mt-5 flex flex-wrap gap-2">
                <UButton color="primary" variant="soft" @click="editMachine(machine)">Edit details</UButton>
                <UButton variant="soft" :to="`/dashboard/shops/${slug}/products/create`">Add matching product</UButton>
                <UButton variant="soft" color="error" @click="confirmDelete(machine)">Delete</UButton>
              </div>
            </article>
          </div>

          <DashboardEmptyStateCard
            v-else
            title="No machines registered yet"
            description="Start with the press, printer, or finishing unit your team uses most. Once a machine exists, Printy can ground products, parent sheet assumptions, and imposition logic in real capability."
            icon="i-lucide-printer"
          >
            <UButton color="primary" class="justify-center" @click="openModal()">
              <UIcon name="i-lucide-plus" class="mr-2 h-4 w-4" />
              Add first machine
            </UButton>
          </DashboardEmptyStateCard>
        </DashboardFormSection>

        <DashboardFormSection
          title="Why Machines Matter"
          description="This page should explain operational consequences, not just list equipment names."
        >
          <div class="grid gap-3 md:grid-cols-3">
            <div class="rounded-[24px] border border-white/10 bg-white/[0.06] p-4 backdrop-blur-xl">
              <p class="text-sm font-semibold text-white">Products</p>
              <p class="mt-2 text-sm leading-6 text-slate-300">
                Products should only default to machines that can actually handle their finished size, paper expectations, and run type.
              </p>
            </div>
            <div class="rounded-[24px] border border-white/10 bg-white/[0.06] p-4 backdrop-blur-xl">
              <p class="text-sm font-semibold text-white">Paper compatibility</p>
              <p class="mt-2 text-sm leading-6 text-slate-300">
                If stock papers are larger than the machine can accept, pricing and sheet planning drift away from reality quickly.
              </p>
            </div>
            <div class="rounded-[24px] border border-white/10 bg-white/[0.06] p-4 backdrop-blur-xl">
              <p class="text-sm font-semibold text-white">Imposition</p>
              <p class="mt-2 text-sm leading-6 text-slate-300">
                Imposition only stays believable when the assumed parent sheet and the selected machine agree on what can physically run.
              </p>
            </div>
          </div>
        </DashboardFormSection>
      </div>

      <div class="space-y-6">
        <DashboardFormSection
          title="Add Machine Guidance"
          description="What to record first so the machine list becomes useful immediately."
        >
          <div class="space-y-3">
            <DashboardInfoCard
              title="Start with the most-used press"
              description="Do not wait for a perfect equipment register. Add the machine that handles the highest volume of real jobs first."
              icon="i-lucide-printer"
              tone="orange"
            />
            <DashboardInfoCard
              title="Use true max sheet size"
              description="Record the largest parent sheet the machine can reliably accept, not the finished size of your most common product."
              icon="i-lucide-layout-template"
              tone="blue"
            />
            <DashboardInfoCard
              title="Keep GSM realistic"
              description="If a machine struggles with heavy boards or very light stock, capture that now so products are not overly permissive later."
              icon="i-lucide-file-stack"
              tone="green"
            />
          </div>
        </DashboardFormSection>

        <DashboardFormSection
          title="Coverage Checks"
          description="A fast read on where this machine setup is strong and where it still needs work."
        >
          <div class="space-y-3">
            <div v-for="check in coverageChecks" :key="check.label" class="rounded-[24px] border border-white/10 bg-white/[0.06] p-4 backdrop-blur-xl">
              <div class="flex items-center justify-between gap-3">
                <div>
                  <p class="text-sm font-semibold text-white">{{ check.label }}</p>
                  <p class="mt-1 text-sm leading-6 text-slate-300">{{ check.description }}</p>
                </div>
                <UBadge :color="check.color" variant="soft" size="sm">{{ check.badge }}</UBadge>
              </div>
            </div>
          </div>
        </DashboardFormSection>

        <DashboardFormSection
          title="Next Best Actions"
          description="Use these when you want the machine list to affect the rest of the shop setup."
        >
          <div class="space-y-3">
            <NuxtLink
              v-for="action in nextActions"
              :key="action.label"
              :to="action.to"
              class="flex items-start gap-3 rounded-[24px] border border-white/10 bg-white/[0.06] p-4 transition hover:border-orange-300/30 hover:bg-orange-500/10"
            >
              <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-orange-400/20 bg-orange-500/10">
                <UIcon :name="action.icon" class="h-4 w-4 text-orange-200" />
              </div>
              <div>
                <p class="text-sm font-semibold text-white">{{ action.label }}</p>
                <p class="mt-1 text-sm leading-6 text-slate-300">{{ action.description }}</p>
              </div>
            </NuxtLink>
          </div>
        </DashboardFormSection>
      </div>
    </div>

    <DashboardModalForm
      v-model="modalOpen"
      :title="editing ? 'Machine Details' : 'Add Machine'"
      :description="editing ? 'Update this machine so products, paper fit, and pricing reflect current capability.' : 'Add the equipment your shop relies on so quoting and imposition stop guessing.'"
    >
      <MachinesMachineForm
        v-if="modalOpen"
        :key="editing?.id ?? 'new-machine'"
        :machine="editing"
        :loading="formLoading"
        :can-add-printing="subscription?.can_add_printing_machine ?? true"
        :can-add-finishing="subscription?.can_add_finishing_machine ?? true"
        @submit="onSubmit"
        @cancel="closeModal"
      />
    </DashboardModalForm>
  </div>
</template>

<script setup lang="ts">
import type { Machine } from '~/stores/machine'
import { useNotification } from '~/composables/useNotification'
import { useMachineStore } from '~/stores/machine'
import { useShopStore } from '~/stores/shop'
import { useSubscriptionStore } from '~/stores/subscription'

definePageMeta({
  layout: 'dashboard',
  middleware: ['auth', 'shop-owner'],
})

const route = useRoute()
const notification = useNotification()
const machineStore = useMachineStore()
const shopStore = useShopStore()
const subscriptionStore = useSubscriptionStore()

const slug = computed(() => route.params.slug as string)
const modalOpen = ref(false)
const editing = ref<Machine | null>(null)
const formLoading = ref(false)

const subscription = computed(() => subscriptionStore.getSubscription(slug.value))
const shopName = computed(() => shopStore.currentShop?.name ?? 'This shop')
const sortedMachines = computed(() => [...machineStore.machines].sort((left, right) => {
  if ((left.is_active !== false) !== (right.is_active !== false)) return left.is_active !== false ? -1 : 1
  return left.name.localeCompare(right.name)
}))
const activeMachines = computed(() => machineStore.machines.filter(machine => machine.is_active !== false))
const finishingMachines = computed(() => machineStore.machines.filter(machine => machine.machine_type === 'FINISHING'))
const printingMachines = computed(() => machineStore.machines.filter(machine => machine.machine_type !== 'FINISHING'))
const machinesWithSheetSize = computed(() => activeMachines.value.filter(machine => machine.max_width_mm && machine.max_height_mm))
const machinesWithGsmRange = computed(() => activeMachines.value.filter(machine => machine.min_gsm != null || machine.max_gsm != null))

const largestSheet = computed(() => {
  const sizes = activeMachines.value
    .map(machine => ({ width: machine.max_width_mm ?? 0, height: machine.max_height_mm ?? 0 }))
    .sort((left, right) => (right.width * right.height) - (left.width * left.height))
  return sizes[0] ?? null
})

const largestSheetLabel = computed(() => {
  if (!largestSheet.value?.width || !largestSheet.value?.height) return 'Not set yet'
  return `${largestSheet.value.width} x ${largestSheet.value.height} mm`
})

const largestSheetNarrative = computed(() => {
  if (!machinesWithSheetSize.value.length) return 'No active machine has a reliable parent sheet limit yet.'
  return 'This is the largest active sheet footprint available in the current machine list.'
})

const machineCoverageLabel = computed(() => {
  if (!machineStore.machines.length) return 'No equipment on record'
  if (activeMachines.value.length === machineStore.machines.length) return 'All machines active'
  return `${activeMachines.value.length} active / ${machineStore.machines.length} total`
})

const operationsSignal = computed(() => {
  if (!machineStore.machines.length) {
    return {
      title: 'Products are still guessing',
      description: 'Without at least one machine, product defaults and imposition assumptions have nothing operational to anchor to.',
    }
  }
  if (!machinesWithSheetSize.value.length) {
    return {
      title: 'Sheet compatibility is still weak',
      description: 'Machines exist, but none of the active ones define a max sheet size yet.',
    }
  }
  if (!machinesWithGsmRange.value.length) {
    return {
      title: 'Paper constraints are mostly implied',
      description: 'The machine list is usable, but GSM limits are still too loose to guide product eligibility well.',
    }
  }
  return {
    title: 'Machine setup is operational',
    description: 'This shop has enough machine data to support believable product, stock, and imposition decisions.',
  }
})

const metrics = computed(() => [
  {
    label: 'Total Machines',
    value: machineStore.machines.length,
    icon: 'i-lucide-printer',
    iconClass: 'text-orange-200',
    description: machineStore.machines.length ? 'Registered equipment available to the shop workspace.' : 'No machine records yet.',
  },
  {
    label: 'Active Today',
    value: activeMachines.value.length,
    icon: 'i-lucide-badge-check',
    iconClass: 'text-emerald-200',
    description: activeMachines.value.length ? 'Machines currently marked available for production use.' : 'No active machine currently available.',
  },
  {
    label: 'Printing Units',
    value: printingMachines.value.length,
    icon: 'i-lucide-file-output',
    iconClass: 'text-sky-200',
    description: printingMachines.value.length ? 'Digital, offset, or large-format devices recorded for print output.' : 'No printing device recorded yet.',
  },
  {
    label: 'Finishing Units',
    value: finishingMachines.value.length,
    icon: 'i-lucide-scissors',
    iconClass: 'text-rose-200',
    description: finishingMachines.value.length ? 'Finishing equipment that can support post-press workflow.' : 'No finishing equipment recorded yet.',
  },
  {
    label: 'Sized For Imposition',
    value: machinesWithSheetSize.value.length,
    icon: 'i-lucide-layout-template',
    iconClass: 'text-amber-200',
    description: machinesWithSheetSize.value.length ? 'Active machines with max sheet data that products can rely on.' : 'No active machine has parent sheet limits yet.',
  },
])

const coverageChecks = computed(() => [
  {
    label: 'Product compatibility',
    description: machineStore.machines.length ? 'Products can start pointing to real equipment instead of relying on generic assumptions.' : 'Add at least one machine so products have a realistic production target.',
    badge: machineStore.machines.length ? 'Connected' : 'Missing',
    color: machineStore.machines.length ? 'success' as const : 'warning' as const,
  },
  {
    label: 'Paper size compatibility',
    description: machinesWithSheetSize.value.length ? 'Some active machines define max sheet size, so parent-sheet rules can be checked more confidently.' : 'No active machine currently defines max sheet size, so sheet fit is still guess-based.',
    badge: machinesWithSheetSize.value.length ? 'Usable' : 'Weak',
    color: machinesWithSheetSize.value.length ? 'success' as const : 'warning' as const,
  },
  {
    label: 'Imposition realism',
    description: machinesWithSheetSize.value.length && machineStore.machines.length ? 'Imposition logic can start rejecting impossible machine/sheet combinations earlier.' : 'Imposition assumptions still have too little machine context.',
    badge: machinesWithSheetSize.value.length && machineStore.machines.length ? 'Improving' : 'Blocked',
    color: machinesWithSheetSize.value.length && machineStore.machines.length ? 'success' as const : 'warning' as const,
  },
])

const nextActions = computed(() => [
  {
    label: 'Create a machine-aware product',
    description: 'Use this machine data when defining a product so default routing starts from real capacity.',
    to: `/dashboard/shops/${slug.value}/products/create`,
    icon: 'i-lucide-package',
  },
  {
    label: 'Review stock and pricing',
    description: 'Align parent sheets and print pricing with the equipment you have just recorded.',
    to: `/dashboard/shops/${slug.value}/pricing`,
    icon: 'i-lucide-wallet',
  },
  {
    label: 'Return to shop overview',
    description: 'See how machine readiness fits into the rest of the workspace setup.',
    to: `/dashboard/shops/${slug.value}`,
    icon: 'i-lucide-layout-dashboard',
  },
])

function openModal(machine?: Machine) {
  editing.value = machine ?? null
  modalOpen.value = true
}

function editMachine(machine: Machine) {
  openModal(machine)
}

function closeModal() {
  modalOpen.value = false
  editing.value = null
}

function machineTypeLabel(machine: Machine) {
  return machine.type_display ?? machine.machine_type ?? machine.type ?? 'Machine'
}

function sheetSizeSummary(machine: Machine) {
  if (!machine.max_width_mm || !machine.max_height_mm) return 'Not defined yet'
  return `${machine.max_width_mm} x ${machine.max_height_mm} mm`
}

function gsmSummary(machine: Machine) {
  if (machine.min_gsm != null && machine.max_gsm != null) return `${machine.min_gsm}-${machine.max_gsm} gsm`
  if (machine.max_gsm != null) return `Up to ${machine.max_gsm} gsm`
  if (machine.min_gsm != null) return `From ${machine.min_gsm} gsm`
  return 'General stock range'
}

function sheetCompatibilityHint(machine: Machine) {
  if (!machine.max_width_mm || !machine.max_height_mm) return 'Add the largest parent sheet this machine can accept.'
  return 'Use this when deciding which stock papers and products belong on this machine.'
}

function gsmHint(machine: Machine) {
  if (machine.min_gsm == null && machine.max_gsm == null) return 'No paper-weight guidance recorded yet.'
  return 'Useful when heavier boards or lighter text stocks should be screened out.'
}

function productFitLabel(machine: Machine) {
  if (machine.machine_type === 'FINISHING') return 'Supports post-press steps'
  if (!machine.max_width_mm || !machine.max_height_mm) return 'Needs size details'
  return 'Can guide default product routing'
}

function paperFitLabel(machine: Machine) {
  if (!machine.max_width_mm || !machine.max_height_mm) return 'Sheet limit missing'
  return 'Can validate parent sheet fit'
}

function impositionLabel(machine: Machine) {
  if (!machine.max_width_mm || !machine.max_height_mm) return 'Imposition still weak'
  return machine.is_active !== false ? 'Operationally useful' : 'Stored only'
}

function machineNarrative(machine: Machine) {
  const type = machineTypeLabel(machine)
  const maxSheet = sheetSizeSummary(machine)
  if (machine.machine_type === 'FINISHING') {
    return `${type} supports post-press planning for products that need cutting, lamination, binding, or other finishing steps after printing.`
  }
  return `${type} is recorded with a max sheet size of ${maxSheet}. Keep this aligned with product defaults and parent sheets so jobs only appear on equipment that can actually run them.`
}

async function onSubmit(data: { name: string; machine_type: string; max_width_mm?: number | null; max_height_mm?: number | null; min_gsm?: number | null; max_gsm?: number | null; is_active?: boolean }) {
  formLoading.value = true
  try {
    if (editing.value) {
      await machineStore.updateMachine(slug.value, editing.value.id, data)
      notification.success('Machine updated. Product and paper assumptions can now use the revised limits.')
    } else {
      await machineStore.createMachine(slug.value, data)
      notification.success('Machine added. This shop now has a stronger operational basis for products and imposition.')
    }
    closeModal()
  } catch (error) {
    notification.error(error instanceof Error ? error.message : 'We could not save this machine yet. Please check the highlighted fields.')
  } finally {
    formLoading.value = false
  }
}

async function confirmDelete(machine: Machine) {
  if (!confirm(`Delete "${machine.name}"? This can affect machine-linked pricing and product assumptions.`)) {
    return
  }

  try {
    await machineStore.deleteMachine(slug.value, machine.id)
    notification.success('Machine removed successfully.')
  } catch (error) {
    notification.error(error instanceof Error ? error.message : 'We could not delete this machine right now.')
  }
}

onMounted(async () => {
  await Promise.allSettled([
    shopStore.fetchShopBySlug(slug.value),
    machineStore.fetchMachines(slug.value),
  ])
})
</script>
