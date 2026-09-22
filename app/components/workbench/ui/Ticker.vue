<template>
  <div class="overflow-hidden border-b py-1.5" style="border-color: var(--line); background: var(--panel)">
    <div class="ticker flex w-max gap-10 whitespace-nowrap font-mono2 text-[9.5px] uppercase tracking-[0.16em] text-[var(--sub)]">
      <span v-for="rep in 2" :key="rep" class="flex gap-10">
        <span v-for="j in live" :key="`${rep}${j.id}`" class="inline-flex items-center gap-2">
          <span style="color: var(--accent)">{{ j.code }}</span>
          <span>{{ stageLabel(j.stage) }}</span>
          <span :style="{ color: j.status === 'disputed' ? '#C81E44' : 'var(--sub)' }">
            ball: {{ ownerLabel(j) }} · {{ j.owner.waitingHrs }}/{{ j.owner.slaHrs }}h
          </span>
        </span>
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useWorkflowStore } from '~/stores/workflow'
import { STAGES } from '~/shared/workflow/printy'

const w = useWorkflowStore()

const live = computed(() => w.jobs.filter((j) => j.status !== 'completed'))

function stageLabel(key: string) {
  return STAGES.find((s) => s.key === key)?.label
}

function ownerLabel(j: { owner: { name: string } }) {
  return (j.owner.name.split('·')[0] ?? j.owner.name).trim()
}
</script>