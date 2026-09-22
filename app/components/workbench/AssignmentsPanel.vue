<template>
  <section class="space-y-4">
    <div class="flex items-center justify-between">
      <ML>Live job queue · {{ store.active.length }}</ML>
      <button class="font-mono2 text-[9.5px] uppercase tracking-[0.14em] text-[var(--sub)] hover:text-[var(--accent)]" @click="store.fetch()">
        Refresh
      </button>
    </div>

    <div v-if="store.loading && !store.hasAssignments" class="flex items-center gap-2 rounded-2xl border px-4 py-4 text-[12.5px] text-[var(--sub)]" :style="{ borderColor: 'var(--line)', background: 'var(--panel)' }">
      <Loader2 :size="14" class="animate-spin" :style="{ color: 'var(--accent)' }" /> Loading your queue…
    </div>

    <div v-else-if="store.error" class="rounded-2xl border px-4 py-4 text-[12.5px]" :style="{ borderColor: 'rgba(251,77,109,.4)', background: 'rgba(251,77,109,.08)', color: '#B4243F' }">
      {{ store.error }}
    </div>

    <div v-else-if="!store.hasAssignments" class="rounded-2xl border px-4 py-6 text-center text-[12.5px] text-[var(--sub)]" :style="{ borderColor: 'var(--line)', background: 'var(--panel)' }">
      No dispatched jobs yet. Accept a request and it will appear here.
    </div>

    <article
      v-for="assignment in store.items"
      :key="assignment.id"
      class="overflow-hidden rounded-[1.6rem] border"
      :style="{ borderColor: 'var(--line)', background: 'var(--panel)' }"
    >
      <div class="flex flex-wrap items-center justify-between gap-2 px-5 py-3" :style="{ background: 'var(--panel2)' }">
        <div class="flex items-center gap-2">
          <span class="font-disp text-[14px] font-bold tracking-tight">{{ assignment.assignment_reference }}</span>
          <span class="rounded-full px-2 py-[2px] font-mono2 text-[8.5px] font-semibold uppercase tracking-[0.1em]" :style="stageStyle(assignment.production_stage)">
            {{ assignment.production_stage_label }}
          </span>
        </div>
        <span class="font-mono2 text-[9.5px] uppercase tracking-[0.14em] text-[var(--sub)]">{{ assignment.managed_reference }}</span>
      </div>

      <div class="p-5">
        <div class="flex flex-wrap items-center gap-4 font-mono2 text-[9.5px] uppercase tracking-[0.12em] text-[var(--sub)]">
          <span>{{ assignment.urgency_label || 'Standard' }}</span>
          <span v-if="assignment.requested_deadline">Due {{ formatDate(assignment.requested_deadline) }}</span>
          <span v-if="assignment.payout_amount" class="inline-flex items-center gap-1" style="color: var(--accent)">
            <Wallet :size="11" /> {{ assignment.payout_amount }}
          </span>
          <span :style="{ color: assignment.payment_confirmed ? '#1E8E52' : '#B45309' }">{{ assignment.payout_status_label }}</span>
        </div>

        <!-- timeline -->
        <div class="mt-4 flex flex-wrap gap-1.5">
          <span
            v-for="step in assignment.production_timeline_steps"
            :key="step.key"
            class="rounded-full px-2.5 py-1 font-mono2 text-[8.5px] font-semibold uppercase tracking-[0.1em]"
            :style="stepChip(step.state)"
          >
            {{ step.label }}
          </span>
        </div>

        <!-- actions -->
        <div class="mt-4 flex flex-wrap gap-2">
          <button
            v-for="action in assignment.next_allowed_actions"
            :key="action"
            class="press-key inline-flex items-center gap-1.5 rounded-xl px-4 py-2.5 font-mono2 text-[10.5px] font-semibold uppercase tracking-[0.12em] disabled:opacity-60"
            :style="action === 'reject'
              ? { borderColor: 'var(--line)', color: '#B4243F' }
              : action === 'upload_proof' || action === 'accept'
                ? { background: 'var(--accent)', color: 'var(--accentInk)' }
                : { borderColor: 'var(--line)', color: 'var(--ink)' }"
            :disabled="store.actingId === assignment.id"
            @click="onAction(assignment, action)"
          >
            <Loader2 v-if="store.actingId === assignment.id" :size="12" class="animate-spin" />
            <component :is="actionIcon(action)" v-else :size="12" />
            {{ label(action) }}
          </button>
          <button
            class="press-key inline-flex items-center gap-1.5 rounded-xl border px-4 py-2.5 font-mono2 text-[10.5px] font-semibold uppercase tracking-[0.12em]"
            :style="{ borderColor: 'var(--line)', color: 'var(--sub)' }"
            @click="openIssue(assignment)"
          >
            <AlertTriangle :size="12" /> Report issue
          </button>
        </div>

        <input
          v-if="uploadFor === assignment.id"
          type="file"
          class="mt-3 block w-full text-[12px]"
          @change="onFileChange(assignment, $event)"
        />

        <div v-if="noteFor === assignment.id" class="mt-3 rounded-xl border p-3" :style="{ borderColor: 'var(--line)' }">
          <ML>{{ pendingAction === 'reject' ? 'Reason for declining' : 'Describe the issue' }}</ML>
          <textarea v-model="note" rows="2" class="mt-1.5 w-full rounded-lg border bg-transparent px-2.5 py-2 text-[12.5px]" :style="{ borderColor: 'var(--line)' }" />
          <div class="mt-2 flex items-center gap-2">
            <button class="press-key rounded-xl px-4 py-2 font-mono2 text-[10px] font-semibold uppercase tracking-[0.12em] disabled:opacity-60" :style="{ background: 'var(--accent)', color: 'var(--accentInk)' }" :disabled="!note.trim() || store.actingId === assignment.id" @click="submitNote(assignment)">
              {{ pendingAction === 'reject' ? 'Decline job' : 'Report issue' }}
            </button>
            <button class="font-mono2 text-[10px] uppercase tracking-[0.12em] text-[var(--sub)]" @click="noteFor = null">Cancel</button>
          </div>
        </div>

        <div v-if="messageFor === assignment.id" class="mt-3 text-[12px]" style="color: #1E8E52">{{ message }}</div>
        <div v-if="errorFor === assignment.id" class="mt-3 text-[12px]" style="color: #B4243F">{{ error }}</div>
      </div>
    </article>
  </section>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import {
  AlertTriangle, CheckCheck, Loader2, Play, Upload, Wallet, X,
} from 'lucide-vue-next'
import { ASSIGNMENT_ACTION_LABELS, useAssignmentsStore } from '~/stores/assignments'
import { getApiErrorMessage } from '~/shared/api'
import type { AssignmentAction, JobAssignment } from '~/shared/types'

const store = useAssignmentsStore()

const uploadFor = ref<number | null>(null)
const noteFor = ref<number | null>(null)
const messageFor = ref<number | null>(null)
const errorFor = ref<number | null>(null)
const note = ref('')
const message = ref('')
const error = ref('')
const pendingAction = ref<'reject' | 'issue'>('issue')

function label(action: AssignmentAction) {
  return ASSIGNMENT_ACTION_LABELS[action] ?? action
}

function actionIcon(action: AssignmentAction) {
  if (action === 'accept') return CheckCheck
  if (action === 'reject') return X
  if (action === 'upload_proof') return Upload
  return Play
}

function stageStyle(stage: string) {
  if (stage === 'completed') return { background: 'rgba(47,191,113,.14)', color: '#1E8E52' }
  if (stage === 'ready') return { background: 'rgba(47,191,113,.14)', color: '#1E8E52' }
  return { background: 'color-mix(in srgb, var(--accent) 13%, transparent)', color: 'var(--accent)' }
}

function stepChip(state: string) {
  if (state === 'completed') return { background: 'rgba(47,191,113,.14)', color: '#1E8E52' }
  if (state === 'current') return { background: 'var(--accent)', color: 'var(--accentInk)' }
  return { background: 'var(--panel2)', color: 'var(--sub)' }
}

function formatDate(value: string) {
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString(undefined, { day: 'numeric', month: 'short' })
}

function reset() {
  uploadFor.value = null
  noteFor.value = null
  messageFor.value = null
  errorFor.value = null
  note.value = ''
  message.value = ''
  error.value = ''
}

function openIssue(assignment: JobAssignment) {
  reset()
  pendingAction.value = 'issue'
  noteFor.value = assignment.id
}

async function onAction(assignment: JobAssignment, action: AssignmentAction) {
  if (action === 'upload_proof') {
    reset()
    uploadFor.value = assignment.id
    return
  }
  if (action === 'reject') {
    reset()
    pendingAction.value = 'reject'
    noteFor.value = assignment.id
    return
  }
  reset()
  try {
    await store.perform(assignment, action)
    messageFor.value = assignment.id
    message.value = `${label(action)} — done.`
  } catch (e) {
    errorFor.value = assignment.id
    error.value = getApiErrorMessage(e, 'That update could not be applied.')
  }
}

async function submitNote(assignment: JobAssignment) {
  const text = note.value.trim()
  if (!text) return
  errorFor.value = null
  try {
    if (pendingAction.value === 'reject') {
      await store.perform(assignment, 'reject', text)
      message.value = 'Job declined.'
    } else {
      await store.reportIssue(assignment, text)
      message.value = 'Issue reported — your partner has been notified.'
    }
    noteFor.value = null
    note.value = ''
    messageFor.value = assignment.id
  } catch (e) {
    errorFor.value = assignment.id
    error.value = getApiErrorMessage(e, 'That update could not be applied.')
  }
}

async function onFileChange(assignment: JobAssignment, event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return
  errorFor.value = null
  try {
    await store.uploadProof(assignment, file)
    messageFor.value = assignment.id
    message.value = 'Proof uploaded.'
    uploadFor.value = null
  } catch (e) {
    errorFor.value = assignment.id
    error.value = getApiErrorMessage(e, 'The proof could not be uploaded.')
  } finally {
    input.value = ''
  }
}

onMounted(() => {
  store.fetch()
})
</script>
