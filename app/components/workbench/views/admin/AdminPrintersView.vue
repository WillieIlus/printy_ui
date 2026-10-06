<template>
  <div>
    <AdminPageHead
      eyebrow="People"
      title="Printers"
      lede="Production partners on the marketplace — cleared shops first, then the ones still missing setup."
    >
      <template #meta>
        <span
          class="inline-flex items-center gap-2 rounded-full border px-3 py-1.5 font-mono2 text-[9px] uppercase tracking-[0.14em] text-[var(--sub)]"
          :style="{ borderColor: 'var(--line)' }"
        >
          <Factory :size="12" :style="{ color: 'var(--accent)' }" />
          {{ verifiedShops.length }} verified · {{ printersPendingVerification.length }} pending
        </span>
      </template>
    </AdminPageHead>

    <AdminSection
      icon="badge-check"
      tone="good"
      title="Verified shops"
      :count="verifiedShops.length"
      subtitle="Cleared to take paid work. Capabilities, rating and what is on each floor right now."
    >
      <div class="grid gap-2 sm:grid-cols-2">
        <button
          v-for="pr in verifiedShops"
          :key="pr.id"
          type="button"
          class="rounded-2xl border p-4 text-left transition-transform hover:-translate-y-0.5"
          :style="{ borderColor: hasDisputeFor(pr) ? 'rgba(251,77,109,.5)' : 'var(--line)', background: 'var(--panel)' }"
          @click="openPrinter(pr)"
        >
          <div class="flex items-center gap-3">
            <Avatar :initials="pr.initials" :hue="pr.hue" :size="40" />
            <div class="min-w-0 flex-1">
              <div class="flex items-center gap-1.5 truncate font-disp text-[14.5px] font-bold tracking-tight">
                {{ pr.name }}
                <BadgeCheck :size="13" :style="{ color: 'var(--accent)' }" />
              </div>
              <div class="font-mono2 text-[9px] uppercase tracking-[0.12em] text-[var(--sub)]">{{ pr.city }} · {{ pr.contact }}</div>
            </div>
            <div class="text-right font-mono2 text-[9px] uppercase tracking-[0.1em] text-[var(--sub)]">
              <div class="inline-flex items-center gap-1"><Star :size="9" style="color: #B45309" /> {{ pr.rating }}</div>
              <div>{{ pr.onTime }}% on-time</div>
            </div>
          </div>
          <div class="mt-3 flex flex-wrap gap-1">
            <span
              v-for="cap in pr.caps"
              :key="cap"
              class="rounded-full px-2 py-[3px] font-mono2 text-[8.5px] uppercase tracking-[0.12em]"
              :style="{ background: 'var(--panel2)', color: 'var(--sub)' }"
            >{{ cap }}</span>
          </div>
          <div
            class="mt-3 border-t pt-2.5 font-mono2 text-[9px] uppercase tracking-[0.12em]"
            :style="{ borderColor: 'var(--line)', color: hasDisputeFor(pr) ? '#C81E44' : 'var(--sub)' }"
          >
            {{ floorLabel(pr) }}
          </div>
        </button>
      </div>
    </AdminSection>

    <AdminSection
      icon="alert-octagon"
      tone="warn"
      title="Verification pending"
      :count="printersPendingVerification.length"
      subtitle="Shops that still need papers, machines or finishing rates before Printy can price a job for them."
    >
      <div v-if="printersPendingVerification.length" class="grid gap-2 sm:grid-cols-2">
        <button
          v-for="pr in printersPendingVerification"
          :key="pr.id"
          type="button"
          class="rounded-2xl border border-dashed p-4 text-left opacity-90"
          :style="{ borderColor: 'rgba(245,166,35,.5)', background: 'var(--panel)' }"
          @click="openPrinter(pr)"
        >
          <div class="flex items-center gap-3">
            <Avatar :initials="pr.initials" :hue="pr.hue" :size="40" />
            <div class="min-w-0 flex-1">
              <div class="flex items-center gap-1.5 truncate font-disp text-[14.5px] font-bold tracking-tight">
                {{ pr.name }}
                <AlertOctagon :size="12" style="color: #B45309" />
              </div>
              <div class="font-mono2 text-[9px] uppercase tracking-[0.12em] text-[var(--sub)]">{{ pr.city }} · {{ pr.contact }}</div>
            </div>
          </div>
          <div class="mt-3 flex flex-wrap gap-1">
            <span
              v-for="cap in pr.caps"
              :key="cap"
              class="rounded-full px-2 py-[3px] font-mono2 text-[8.5px] uppercase tracking-[0.12em]"
              :style="{ background: 'var(--panel2)', color: 'var(--sub)' }"
            >{{ cap }}</span>
          </div>
          <div class="mt-3 border-t pt-2.5 font-mono2 text-[9px] uppercase tracking-[0.12em] text-[#B45309]" :style="{ borderColor: 'var(--line)' }">
            Verification pending · limited scopes · {{ pr.jobsDone }} jobs all-time
          </div>
        </button>
      </div>
      <div v-else class="rounded-2xl border p-6 text-center" :style="{ borderColor: 'var(--line)' }">
        <BadgeCheck :size="20" class="mx-auto" style="color: #0E7A45" />
        <p class="mt-2.5 text-[12.5px] text-[var(--sub)]">Every shop on the marketplace is verified.</p>
      </div>
    </AdminSection>

    <!-- ── drill-down ── -->
    <div v-if="drill" class="fixed inset-0 z-[65] flex justify-end">
      <div class="absolute inset-0 bg-black/55 backdrop-blur-[6px]" @click="closeDrill" />
      <aside class="relative h-full w-full max-w-[440px] overflow-y-auto border-l p-6" :style="{ background: 'var(--bg)', borderColor: 'var(--line)' }">
        <button
          type="button"
          class="press-key absolute right-4 top-4 rounded-full p-2 hover:bg-[var(--panel2)]"
          :style="{ color: 'var(--sub)' }"
          aria-label="Close printer details"
          @click="closeDrill"
        >
          <X :size="16" />
        </button>

        <div class="flex items-center gap-3">
          <Avatar :initials="drill.initials" :hue="drill.hue" :size="52" />
          <div class="min-w-0">
            <div class="flex items-center gap-1.5 font-disp text-[20px] font-bold tracking-tight">
              <span class="truncate">{{ drill.name }}</span>
              <BadgeCheck v-if="drill.verified" :size="15" :style="{ color: 'var(--accent)' }" />
              <AlertOctagon v-else :size="14" style="color: #B45309" />
            </div>
            <div class="font-mono2 text-[9.5px] uppercase tracking-[0.14em] text-[var(--sub)]">
              {{ drill.city }} · contact {{ drill.contact }}
            </div>
          </div>
        </div>

        <div class="mt-5 grid grid-cols-3 gap-2 text-center">
          <div v-for="row in drillRows" :key="row[1]" class="rounded-xl p-3" :style="{ background: 'var(--panel2)' }">
            <div class="font-disp text-[16px] font-bold">{{ row[0] }}</div>
            <div class="mt-0.5 font-mono2 text-[8px] uppercase tracking-[0.12em] text-[var(--sub)]">{{ row[1] }}</div>
          </div>
        </div>

        <ML class="mt-6">Capabilities</ML>
        <div class="mt-2 flex flex-wrap gap-1.5">
          <span
            v-for="cap in drill.caps"
            :key="cap"
            class="rounded-full px-2.5 py-1 font-mono2 text-[9px] uppercase tracking-[0.12em]"
            :style="{ background: 'var(--panel2)', color: 'var(--sub)' }"
          >{{ cap }}</span>
        </div>

        <ML class="mt-6">Jobs on their floor · {{ drillJobs.length }}</ML>
        <div class="mt-2">
          <AdminJobList :jobs="drillJobs" partner="none" empty-copy="No jobs on this floor right now." @open="closeAndOpen" />
        </div>
      </aside>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { AlertOctagon, BadgeCheck, Factory, Star, X } from 'lucide-vue-next'
import { PRINTERS, type Job, type Printer } from '~/shared/workflow/printy'

const route = useRoute()
const router = useRouter()
const { admins, workflow, printersPendingVerification, jobsForPrinter } = useAdminNav()

const drill = ref<Printer | null>(null)

/** Supports /app/admin/printers?focus=p-north deep links from other admin pages. */
function openFromQuery(focus: unknown) {
  if (typeof focus !== 'string' || !focus) return
  const match = PRINTERS.find((printer) => printer.id === focus)
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

const verifiedShops = computed(() => PRINTERS.filter((printer) => printer.verified))
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

const activeFor = (printer: Printer) => jobsForPrinter(printer.id).filter((job) => job.stage !== 'completed')
const hasDisputeFor = (printer: Printer) => activeFor(printer).some((job) => job.status === 'disputed')

function floorLabel(printer: Printer) {
  if (hasDisputeFor(printer)) return '1 job in dispute'
  const live = activeFor(printer).length
  return live ? `${live} live job${live > 1 ? 's' : ''} on floor` : `${printer.jobsDone} jobs all-time`
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