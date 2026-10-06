<template>
  <div v-if="jobs.length" class="space-y-2">
    <AdminJobRow
      v-for="job in jobs"
      :key="job.id"
      :job="job"
      :partner="partner"
      :alert="alert(job)"
      @open="emit('open', $event)"
    >
      <template #actions>
        <slot name="actions" :job="job" />
      </template>
    </AdminJobRow>
  </div>

  <div v-else class="rounded-2xl border p-6 text-center" :style="{ borderColor: 'var(--line)' }">
    <Inbox :size="20" class="mx-auto" :style="{ color: 'var(--accent)' }" />
    <p class="mt-2.5 text-[12.5px] text-[var(--sub)]">{{ emptyCopy }}</p>
  </div>
</template>

<script setup lang="ts">
import { Inbox } from 'lucide-vue-next'
import { mgr, prn, type Job } from '~/shared/workflow/printy'

const props = withDefaults(defineProps<{
  jobs: Job[]
  emptyCopy: string
  partner?: 'manager' | 'printer' | 'none'
}>(), { partner: 'printer' })

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