<script setup lang="ts">
import DesignAdminJobRow from './AdminJobRow.vue'
import DesignEmptyNote from '../ui/EmptyNote.vue'
import { mgr, prn, type Job } from '~/shared/workflow/printy'

const props = withDefaults(defineProps<{
  jobs: Job[]
  emptyCopy: string
  partner?: 'manager' | 'printer' | 'none'
}>(), {
  partner: 'printer',
})

const emit = defineEmits<{ open: [job: Job] }>()

function partnerFor(job: Job) {
  if (props.partner === 'none') return null
  if (props.partner === 'manager') return mgr(job.managerId)?.name ?? null
  return prn(job.printerId)?.name ?? mgr(job.managerId)?.name ?? null
}

function alert(job: Job) {
  return job.status === 'disputed' || job.status === 'overdue'
}
</script>

<template>
  <div v-if="props.jobs.length" class="space-y-2">
    <DesignAdminJobRow
      v-for="job in props.jobs"
      :key="job.id"
      :job="job"
      :partner="partnerFor(job)"
      :alert="alert(job)"
      @open="emit('open', $event)"
    >
      <template #actions>
        <slot name="actions" :job="job" />
      </template>
    </DesignAdminJobRow>
  </div>
  <DesignEmptyNote v-else :title="props.emptyCopy" />
</template>
