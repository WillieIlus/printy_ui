<template>
  <div class="flex flex-col gap-8">
    <DesignAdminPageHeader
      index="MG"
      kicker="People"
      title="Managers"
      description="Who is carrying the desks, who is inside their SLA, and who needs a hand this week."
    >
      <template #actions>
        <span class="inline-flex items-center gap-2 rounded-full border border-line bg-card px-3 py-1.5 font-mono text-[9px] tracking-[0.1em] text-ink-2 uppercase">
          <component :is="getIcon('Users')" class="h-3.5 w-3.5 text-brand" :stroke-width="2" />
          {{ MANAGERS.length }} managers · {{ managersNeedingHelp.length }} need help
        </span>
      </template>
    </DesignAdminPageHeader>

    <DesignAdminSection
      index="01"
      title="Needs help"
      :count="managersNeedingHelp.length"
      hint="carrying an at-risk, overdue or disputed job"
    >
      <div v-if="managersNeedingHelp.length" class="space-y-2">
        <DesignAdminManagerRow
          v-for="manager in managersNeedingHelp"
          :key="manager.id"
          :manager="manager"
          :stats="statsFor(manager.id)"
          needs-help
          @open="openManager"
        />
      </div>
      <DesignEmptyNote v-else title="Every manager has a clear desk." />
    </DesignAdminSection>

    <DesignAdminSection
      index="02"
      title="All desks"
      :count="MANAGERS.length"
      hint="live job load, SLA exposure and on-time rate"
    >
      <div class="space-y-2">
        <DesignAdminManagerRow
          v-for="manager in MANAGERS"
          :key="manager.id"
          :manager="manager"
          :stats="statsFor(manager.id)"
          @open="openManager"
        />
      </div>
    </DesignAdminSection>

    <DesignAdminSection index="03" title="Verification" hint="design-only queue">
      <DesignAdminPlaceholder
        title="Manager verification queue is not available"
        hint="Printy managers do not carry a pending/verified/rejected state in the current API. Only desk load and SLA exposure are shown."
      />
    </DesignAdminSection>

    <!-- drill-down -->
    <div v-if="drill" class="fixed inset-0 z-[65] flex justify-end">
      <div class="absolute inset-0 bg-ink/50 backdrop-blur-sm" @click="closeDrill" />
      <aside class="relative h-full w-full max-w-[440px] overflow-y-auto border-l border-line bg-paper p-6">
        <button
          type="button"
          class="absolute top-4 right-4 rounded-full p-2 text-ink-3 transition-colors hover:bg-paper-2 hover:text-ink"
          aria-label="Close manager details"
          @click="closeDrill"
        >
          <component :is="getIcon('X')" class="h-4 w-4" :stroke-width="2" />
        </button>

        <div class="flex items-center gap-3">
          <span class="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-mint font-mono text-[14px] font-bold text-brand-deep">
            {{ drill.initials }}
          </span>
          <div class="min-w-0">
            <div class="truncate text-[20px] font-bold tracking-tight text-ink">{{ drill.name }}</div>
            <div class="truncate font-mono text-[9.5px] tracking-[0.12em] text-ink-3 uppercase">{{ drill.tag }}</div>
          </div>
        </div>

        <div class="mt-5 grid grid-cols-3 gap-2 text-center">
          <div v-for="row in drillRows" :key="row[1]" class="rounded-xl border border-line bg-card p-3">
            <div class="tabular font-mono text-[16px] font-semibold text-ink">{{ row[0] }}</div>
            <div class="mt-0.5 font-mono text-[8px] tracking-[0.1em] text-ink-3 uppercase">{{ row[1] }}</div>
          </div>
        </div>

        <p class="mt-6 font-mono text-[10px] tracking-[0.14em] text-ink-3 uppercase">Their jobs · {{ drillJobs.length }}</p>
        <div class="mt-2">
          <DesignAdminJobList :jobs="drillJobs" partner="none" empty-copy="No jobs on this desk yet." @open="closeAndOpen" />
        </div>
      </aside>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { getIcon } from '~/utils/design/icon-registry'
import { MANAGERS, money, type Job, type Manager } from '~/shared/workflow/printy'
import DesignAdminJobList from '~/components/design/admin/AdminJobList.vue'
import DesignAdminManagerRow from '~/components/design/admin/AdminManagerRow.vue'
import DesignAdminPageHeader from '~/components/design/admin/AdminPageHeader.vue'
import DesignAdminPlaceholder from '~/components/design/admin/AdminPlaceholder.vue'
import DesignAdminSection from '~/components/design/admin/AdminSection.vue'
import DesignEmptyNote from '~/components/design/ui/EmptyNote.vue'

const { admins, workflow, managersNeedingHelp, statsFor, jobsForManager } = useAdminNav()

const drill = ref<Manager | null>(null)

const drillJobs = computed(() => (drill.value ? jobsForManager(drill.value.id) : []))

const drillRows = computed<[string, string][]>(() => {
  const manager = drill.value
  if (!manager) return []
  const stats = statsFor(manager.id)
  return [
    [String(stats.active), 'live jobs'],
    [money(stats.value), 'in play'],
    [`${manager.onTime}%`, 'on-time'],
  ]
})

function openManager(manager: Manager) {
  drill.value = manager
  admins.setFocus(manager.name)
}

function closeDrill() {
  drill.value = null
  admins.clearFocus()
}

function closeAndOpen(job: Job) {
  closeDrill()
  workflow.act('open-job', job)
}
</script>
