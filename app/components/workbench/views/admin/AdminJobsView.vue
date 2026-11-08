<template>
  <div class="flex flex-col gap-8">
    <DesignAdminPageHeader
      index="JB"
      kicker="Production"
      title="Jobs"
      description="Every job on the marketplace, grouped by what it needs from you. Nothing waits on a second page."
    >
      <template #actions>
        <span class="inline-flex items-center gap-2 rounded-full border border-line bg-card px-3 py-1.5 font-mono text-[9px] tracking-[0.1em] text-ink-2 uppercase">
          <component :is="getIcon('Briefcase')" class="h-3.5 w-3.5 text-brand" :stroke-width="2" />
          {{ workflow.jobs.length }} tracked · {{ counts.managed_jobs }} in the database
        </span>
      </template>
    </DesignAdminPageHeader>

    <DesignAdminSection
      index="01"
      title="Needs a decision"
      :count="riskJobs.length"
      hint="overdue, at risk or disputed"
    >
      <DesignAdminJobList :jobs="riskJobs" empty-copy="Nothing is at risk right now." @open="openJob" />
    </DesignAdminSection>

    <DesignAdminSection
      index="02"
      title="On track"
      :count="onTrackJobs.length"
      hint="inside their SLA with the ball moving"
    >
      <DesignAdminJobList :jobs="onTrackJobs" empty-copy="No jobs are currently on track." @open="openJob" />
    </DesignAdminSection>

    <DesignAdminSection
      index="03"
      title="Completed"
      :count="completedJobs.length"
      hint="delivered, paid out and archived"
    >
      <DesignAdminJobList :jobs="completedJobs" partner="none" empty-copy="Nothing has completed yet." @open="openJob" />
    </DesignAdminSection>
  </div>
</template>

<script setup lang="ts">
import { getIcon } from '~/utils/design/icon-registry'
import type { Job } from '~/shared/workflow/printy'
import DesignAdminJobList from '~/components/design/admin/AdminJobList.vue'
import DesignAdminPageHeader from '~/components/design/admin/AdminPageHeader.vue'
import DesignAdminSection from '~/components/design/admin/AdminSection.vue'

const { admins, workflow, counts, riskJobs, onTrackJobs, completedJobs } = useAdminNav()

function openJob(job: Job) {
  admins.clearFocus()
  workflow.act('open-job', job)
}
</script>
