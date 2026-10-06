<template>
  <div>
    <AdminPageHead
      eyebrow="People"
      title="Managers"
      lede="Who is carrying the desks, who is inside their SLA, and who needs a hand this week."
    >
      <template #meta>
        <span
          class="inline-flex items-center gap-2 rounded-full border px-3 py-1.5 font-mono2 text-[9px] uppercase tracking-[0.14em] text-[var(--sub)]"
          :style="{ borderColor: 'var(--line)' }"
        >
          <Users :size="12" :style="{ color: 'var(--accent)' }" />
          {{ MANAGERS.length }} managers · {{ managersNeedingHelp.length }} need help
        </span>
      </template>
    </AdminPageHead>

    <AdminSection
      icon="users"
      tone="bad"
      title="Needs help"
      :count="managersNeedingHelp.length"
      subtitle="Managers carrying an at-risk, overdue or disputed job. Reassign before the SLA clock runs out."
    >
      <div v-if="managersNeedingHelp.length" class="space-y-2">
        <AdminManagerRow
          v-for="m in managersNeedingHelp"
          :key="m.id"
          :manager="m"
          :stats="statsFor(m.id)"
          needs-help
          @open="openManager"
        />
      </div>
      <div v-else class="rounded-2xl border p-6 text-center" :style="{ borderColor: 'var(--line)' }">
        <CheckCircle2 :size="20" class="mx-auto" style="color: #0E7A45" />
        <p class="mt-2.5 text-[12.5px] text-[var(--sub)]">Every manager has a clear desk.</p>
      </div>
    </AdminSection>

    <AdminSection
      icon="users"
      tone="accent"
      title="All desks"
      :count="MANAGERS.length"
      subtitle="Live job load, SLA exposure and on-time rate per manager, in roster order."
    >
      <div class="space-y-2">
        <AdminManagerRow v-for="m in MANAGERS" :key="m.id" :manager="m" :stats="statsFor(m.id)" @open="openManager" />
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
          aria-label="Close manager details"
          @click="closeDrill"
        >
          <X :size="16" />
        </button>

        <div class="flex items-center gap-3">
          <Avatar :initials="drill.initials" :hue="drill.hue" :size="52" />
          <div class="min-w-0">
            <div class="truncate font-disp text-[20px] font-bold tracking-tight">{{ drill.name }}</div>
            <div class="truncate font-mono2 text-[9.5px] uppercase tracking-[0.14em] text-[var(--sub)]">{{ drill.tag }}</div>
          </div>
        </div>

        <div class="mt-5 grid grid-cols-3 gap-2 text-center">
          <div v-for="row in drillRows" :key="row[1]" class="rounded-xl p-3" :style="{ background: 'var(--panel2)' }">
            <div class="font-disp text-[16px] font-bold">{{ row[0] }}</div>
            <div class="mt-0.5 font-mono2 text-[8px] uppercase tracking-[0.12em] text-[var(--sub)]">{{ row[1] }}</div>
          </div>
        </div>

        <ML class="mt-6">Their jobs · {{ drillJobs.length }}</ML>
        <div class="mt-2 space-y-2">
          <AdminJobList :jobs="drillJobs" partner="none" empty-copy="No jobs on this desk yet." @open="closeAndOpen" />
        </div>
      </aside>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { CheckCircle2, Users, X } from 'lucide-vue-next'
import { MANAGERS, money, type Job, type Manager } from '~/shared/workflow/printy'

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