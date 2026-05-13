<template>
  <section class="rounded-[1.9rem] border border-slate-200 bg-white p-6 shadow-[0_16px_36px_rgba(15,23,42,0.06)]">
    <div class="flex items-start justify-between gap-4">
      <div>
        <p class="text-[10px] font-bold uppercase tracking-[0.24em] text-slate-500">Production queue</p>
        <h3 class="mt-2 text-lg font-semibold tracking-tight text-slate-950">Assignment queue</h3>
      </div>
      <span class="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700">{{ assignments.length }} active</span>
    </div>

    <div v-if="assignments.length" class="mt-5 space-y-3">
      <button
        v-for="assignment in assignments"
        :key="assignment.id"
        type="button"
        class="w-full rounded-2xl border p-4 text-left transition"
        :class="selectedId === assignment.id ? 'border-[var(--p-primary)]/35 bg-[var(--p-primary)]/6' : 'border-slate-200 bg-slate-50/70 hover:bg-slate-100/80'"
        @click="$emit('select', assignment.id)"
      >
        <AssignmentCard :assignment="assignment" />
      </button>
    </div>

    <div v-else class="mt-5 rounded-2xl border border-dashed border-slate-200 px-5 py-10 text-center">
      <p class="text-sm font-semibold text-slate-950">No assignments yet</p>
      <p class="mt-2 text-sm text-slate-500">Assignments will appear here as soon as Printy routes work to this shop.</p>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { JobAssignmentRecord } from '~/stores/workflowSpine'
import AssignmentCard from '~/components/workflow/AssignmentCard.vue'

defineProps<{
  assignments: JobAssignmentRecord[]
  selectedId?: number | null
}>()

defineEmits<{
  (e: 'select', assignmentId: number): void
}>()
</script>
