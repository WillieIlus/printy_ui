<template>
  <div class="flex flex-col gap-8">
    <DesignAdminPageHeader
      index="PR"
      kicker="People"
      title="Printers"
      description="Production partners on the marketplace — cleared shops first, then the ones still missing setup."
    >
      <template #actions>
        <span class="inline-flex items-center gap-2 rounded-full border border-line bg-card px-3 py-1.5 font-mono text-[9px] tracking-[0.1em] text-ink-2 uppercase">
          <component :is="getIcon('Store')" class="h-3.5 w-3.5 text-brand" :stroke-width="2" />
          {{ verifiedShops.length }} verified · {{ printersPendingVerification.length }} pending
        </span>
      </template>
    </DesignAdminPageHeader>

    <DesignAdminSection
      index="01"
      title="Verified shops"
      :count="verifiedShops.length"
      hint="cleared to take paid work"
    >
      <div class="grid gap-2 sm:grid-cols-2">
        <DesignAdminPrinterCard
          v-for="printer in verifiedShops"
          :key="printer.id"
          :printer="printer"
          :disputed="hasDisputeFor(printer)"
          :floor-label="floorLabel(printer)"
          @open="openPrinter"
        />
      </div>
    </DesignAdminSection>

    <DesignAdminSection
      index="02"
      title="Verification pending"
      :count="printersPendingVerification.length"
      hint="papers, machines or finishing rates still missing"
    >
      <div v-if="printersPendingVerification.length" class="grid gap-2 sm:grid-cols-2">
        <DesignAdminPrinterCard
          v-for="printer in printersPendingVerification"
          :key="printer.id"
          :printer="printer"
          pending
          :floor-label="pendingFloorLabel(printer)"
          @open="openPrinter"
        />
      </div>
      <DesignEmptyNote v-else title="Every shop on the marketplace is verified." />

      <div class="mt-3">
        <DesignAdminPlaceholder
          title="Verification decisions are not available"
          hint="The current API exposes each shop's verification state only. There is no verify or reject action to preserve yet."
        />
      </div>
    </DesignAdminSection>

    <!-- drill-down -->
    <div v-if="drill" class="fixed inset-0 z-[65] flex justify-end">
      <div class="absolute inset-0 bg-ink/50 backdrop-blur-sm" @click="closeDrill" />
      <aside class="relative h-full w-full max-w-[440px] overflow-y-auto border-l border-line bg-paper p-6">
        <button
          type="button"
          class="absolute top-4 right-4 rounded-full p-2 text-ink-3 transition-colors hover:bg-paper-2 hover:text-ink"
          aria-label="Close printer details"
          @click="closeDrill"
        >
          <component :is="getIcon('X')" class="h-4 w-4" :stroke-width="2" />
        </button>

        <div class="flex items-center gap-3">
          <span class="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-mint font-mono text-[14px] font-bold text-brand-deep">
            {{ drill.initials }}
          </span>
          <div class="min-w-0">
            <div class="flex items-center gap-1.5 text-[20px] font-bold tracking-tight text-ink">
              <span class="truncate">{{ drill.name }}</span>
              <component
                :is="getIcon(drill.verified ? 'BadgeCheck' : 'AlertTriangle')"
                :class="drill.verified ? 'h-4 w-4 text-brand' : 'h-4 w-4 text-amber'"
                :stroke-width="2"
              />
            </div>
            <div class="font-mono text-[9.5px] tracking-[0.12em] text-ink-3 uppercase">
              {{ drill.city }} · contact {{ drill.contact }}
            </div>
          </div>
        </div>

        <div class="mt-5 grid grid-cols-3 gap-2 text-center">
          <div v-for="row in drillRows" :key="row[1]" class="rounded-xl border border-line bg-card p-3">
            <div class="tabular font-mono text-[16px] font-semibold text-ink">{{ row[0] }}</div>
            <div class="mt-0.5 font-mono text-[8px] tracking-[0.1em] text-ink-3 uppercase">{{ row[1] }}</div>
          </div>
        </div>

        <p class="mt-6 font-mono text-[10px] tracking-[0.14em] text-ink-3 uppercase">Capabilities</p>
        <div class="mt-2 flex flex-wrap gap-1.5">
          <span
            v-for="cap in drill.caps"
            :key="cap"
            class="rounded-full border border-line bg-paper-2 px-2.5 py-1 font-mono text-[9px] tracking-[0.08em] text-ink-2 uppercase"
          >{{ cap }}</span>
        </div>

        <p class="mt-6 font-mono text-[10px] tracking-[0.14em] text-ink-3 uppercase">Jobs on their floor · {{ drillJobs.length }}</p>
        <div class="mt-2">
          <DesignAdminJobList :jobs="drillJobs" partner="none" empty-copy="No jobs on this floor right now." @open="closeAndOpen" />
        </div>
      </aside>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { getIcon } from '~/utils/design/icon-registry'
import { PRINTERS, type Job, type Printer } from '~/shared/workflow/printy'
import DesignAdminJobList from '~/components/design/admin/AdminJobList.vue'
import DesignAdminPageHeader from '~/components/design/admin/AdminPageHeader.vue'
import DesignAdminPlaceholder from '~/components/design/admin/AdminPlaceholder.vue'
import DesignAdminPrinterCard from '~/components/design/admin/AdminPrinterCard.vue'
import DesignAdminSection from '~/components/design/admin/AdminSection.vue'
import DesignEmptyNote from '~/components/design/ui/EmptyNote.vue'

const route = useRoute()
const router = useRouter()
const { admins, workflow, printersPendingVerification, jobsForPrinter } = useAdminNav()

const drill = ref<Printer | null>(null)

/** Supports /app/admin/printers?focus=p-north deep links from other admin pages. */
function openFromQuery(focus: unknown) {
  if (typeof focus !== 'string' || !focus) return
  const match = PRINTERS.find(printer => printer.id === focus)
  if (match && match.id !== drill.value?.id) {
    drill.value = match
    admins.setFocus(match.name)
  }
}

watch(() => route.query.focus, openFromQuery, { immediate: true })

function closeDrill() {
  drill.value = null
  admins.clearFocus()
  if (route.query.focus) {
    router.replace({ path: route.path })
  }
}

const verifiedShops = computed(() => PRINTERS.filter(printer => printer.verified))
const drillJobs = computed(() => (drill.value ? jobsForPrinter(drill.value.id) : []))

const drillRows = computed<[string, string][]>(() => {
  const printer = drill.value
  if (!printer) return []
  return [
    [String(printer.rating), 'rating'],
    [`${printer.onTime}%`, 'on-time'],
    [String(printer.jobsDone), 'jobs done'],
  ]
})

const activeFor = (printer: Printer) => jobsForPrinter(printer.id).filter(job => job.stage !== 'completed')
const hasDisputeFor = (printer: Printer) => activeFor(printer).some(job => job.status === 'disputed')

function floorLabel(printer: Printer) {
  if (hasDisputeFor(printer)) return '1 job in dispute'
  const live = activeFor(printer).length
  return live ? `${live} live job${live > 1 ? 's' : ''} on floor` : `${printer.jobsDone} jobs all-time`
}

function pendingFloorLabel(printer: Printer) {
  return `Verification pending · limited scopes · ${printer.jobsDone} jobs all-time`
}

function openPrinter(printer: Printer) {
  drill.value = printer
  admins.setFocus(printer.name)
  if (!route.query.focus) {
    router.replace({ path: route.path, query: { focus: printer.id } })
  }
}

function closeAndOpen(job: Job) {
  closeDrill()
  workflow.act('open-job', job)
}
</script>
