<script setup lang="ts">
import { computed, ref } from 'vue'
import { ArrowRight, ChevronDown, Clock3, Loader2 } from 'lucide-vue-next'
import type { NextActionItem } from './NextActionCard.vue'
import { useApi } from '../../../composables/useApi'
import { API } from '../../../shared/api-paths'
import { getApiErrorMessage } from '../../../shared/api'
import { formatDue, formatLeft } from '../../../utils/design/next-format'

type ViewerRole = 'buyer' | 'manager' | 'printer'

const props = withDefaults(defineProps<{
  item: NextActionItem | null
  jobId?: number | null
  role: ViewerRole
  currentStage?: string
  readOnly?: boolean
  overdue?: boolean
}>(), {
  jobId: null,
  currentStage: '',
  readOnly: false,
  overdue: false,
})

const emit = defineEmits<{ updated: [] }>()
const { api } = useApi()

const formOpen = ref(false)
const selectedStage = ref('')
const note = ref('')
const expectedBy = ref('')
const delayed = ref(false)
const delayReason = ref('')
const submitting = ref(false)
const submitError = ref('')
const submitNotice = ref('')

const stageDefs = [
  { key: 'quote_accepted', label: 'Quote accepted', owners: ['buyer', 'manager'] },
  { key: 'artwork_approval', label: 'Artwork approval', owners: ['buyer', 'manager'] },
  { key: 'production', label: 'Production', owners: ['printer', 'manager'] },
  { key: 'qc', label: 'Quality check', owners: ['manager'] },
  { key: 'delivery', label: 'Delivery', owners: ['printer', 'manager'] },
]

const ownerLabel = computed(() => {
  const role = props.item?.owner_role || 'none'
  if (role === 'manager') return props.role === 'buyer' ? 'your manager' : 'the manager'
  if (role === 'printer') return 'the printer'
  if (role === 'buyer') return 'the buyer'
  return 'Printy'
})

const isMine = computed(() => Boolean(props.item?.is_mine && !props.readOnly))
const visible = computed(() => Boolean(props.item && !props.item.completed))

const stageOptions = computed(() => {
  const role = props.role
  const roleRows = stageDefs.filter((stage) => role === 'manager' || stage.owners.includes(role))
  const currentIndex = stageDefs.findIndex((stage) => stage.key === props.currentStage)
  const rows = currentIndex >= 0
    ? roleRows.filter((stage) => {
        const index = stageDefs.findIndex((row) => row.key === stage.key)
        return index >= Math.max(0, currentIndex - 1) && index <= currentIndex + 1
      })
    : roleRows
  if (props.currentStage && !rows.some((stage) => stage.key === props.currentStage)) {
    const current = stageDefs.find((stage) => stage.key === props.currentStage)
    if (current) rows.unshift(current)
  }
  return rows
})

const dueLabel = computed(() => (props.item?.due_at ? formatDue(props.item.due_at) : null))
const waitingLabel = computed(() => (props.item?.waiting_since ? formatLeft(props.item.waiting_since).replace(' left', '') : null))
const showDelay = computed(() => Boolean(props.overdue || props.item?.overdue_level === 'warn' || props.item?.overdue_level === 'late'))
const audience = computed<'client' | 'printer'>(() => {
  if (props.role === 'buyer') return 'client'
  if (props.role === 'printer') return 'printer'
  return ['production', 'qc', 'delivery'].includes(selectedStage.value) ? 'printer' : 'client'
})
const statusHint = computed(() => {
  if (props.role === 'buyer') return 'Your manager receives this stage update. Printer conversations stay private.'
  if (props.role === 'printer') return 'This update goes to your manager only.'
  return audience.value === 'printer' ? 'This update goes to the printer thread.' : 'This update goes to the client thread.'
})
const dockClass = computed(() => formOpen.value
  ? 'fixed inset-x-4 bottom-[calc(env(safe-area-inset-bottom,0px)+4.75rem)] z-40 max-h-[calc(100dvh-6rem)] overflow-y-auto overscroll-contain sm:inset-x-auto sm:right-6 sm:bottom-6 sm:w-[420px]'
  : 'fixed inset-x-4 bottom-[calc(env(safe-area-inset-bottom,0px)+4.75rem)] z-30 sm:inset-x-auto sm:right-6 sm:bottom-6 sm:w-[420px] lg:sticky lg:inset-x-auto lg:right-auto lg:bottom-6 lg:ml-auto lg:w-full lg:max-w-[420px]')

function toggleForm() {
  formOpen.value = !formOpen.value
  submitError.value = ''
  submitNotice.value = ''
  if (formOpen.value && !selectedStage.value) {
    selectedStage.value = props.currentStage || stageOptions.value[0]?.key || ''
  }
}

async function submit() {
  if (!props.jobId || submitting.value) return
  const stage = selectedStage.value || props.currentStage || stageOptions.value[0]?.key || ''
  if (!stage || (!note.value.trim() && !expectedBy.value && !(delayed.value && delayReason.value.trim()))) {
    submitError.value = 'Add a note, an expected date, or a delay reason before submitting.'
    return
  }
  submitting.value = true
  submitError.value = ''
  submitNotice.value = ''
  const lines: string[] = []
  if (note.value.trim()) lines.push(note.value.trim())
  if (expectedBy.value) {
    const parsed = new Date(expectedBy.value)
    lines.push(`Expected by: ${Number.isNaN(parsed.getTime()) ? expectedBy.value : parsed.toLocaleString('en-KE')}`)
  }
  if (delayed.value && delayReason.value.trim()) lines.push(`Delayed: ${delayReason.value.trim()}`)
  try {
    await api(API.managedJobs.messages(props.jobId), {
      method: 'POST',
      body: {
        body: lines.join('\n'),
        stage,
        audience: audience.value,
      },
    })
    submitNotice.value = 'Status note added to this stage.'
    note.value = ''
    expectedBy.value = ''
    delayed.value = false
    delayReason.value = ''
    emit('updated')
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('printy:job-message-updated', { detail: { jobId: props.jobId } }))
    }
  } catch (error) {
    submitError.value = getApiErrorMessage(error, "We couldn't save that status update.")
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <template v-if="visible && isMine && item">
    <div :class="dockClass" data-test="floating-next-step">
      <div class="relative overflow-hidden rounded-2xl border border-ink bg-ink p-6 text-paper shadow-lift sm:p-7">
        <div class="halftone absolute -top-8 -right-8 h-36 w-36 rounded-full opacity-25" aria-hidden="true" />
        <div class="flex items-center justify-between">
          <p class="font-mono text-[10.5px] tracking-[0.18em] text-paper/50 uppercase">Next step</p>
          <Clock3 class="h-4 w-4 text-brand-bright" aria-hidden="true" />
        </div>

        <p class="mt-3 text-[22px] font-bold leading-tight tracking-tight text-white sm:text-[26px]">
          {{ item.next_action?.label || item.headline }}
        </p>
        <p class="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[11px] tracking-[0.04em] text-paper/55">
          <span class="font-semibold text-paper/75">Waiting on you</span>
          <span v-if="dueLabel" class="tabular">due {{ dueLabel }}</span>
          <span v-if="waitingLabel" class="tabular">waiting {{ waitingLabel }}</span>
        </p>
        <p v-if="item.overdue_level !== 'none'" class="mt-2 font-mono text-[10px] font-semibold uppercase tracking-[0.1em]" :class="item.overdue_level === 'late' ? 'text-red' : 'text-amber'">
          {{ item.overdue_level === 'late' ? '48h+ overdue' : '24h+ overdue' }}
        </p>

        <NuxtLink
          v-if="item.next_action?.target"
          :to="item.next_action.target"
          class="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-brand py-3.5 text-[15px] font-semibold text-white shadow-brand transition-all hover:bg-brand-deep"
        >
          {{ item.next_action.label }}
          <ArrowRight class="h-4 w-4" aria-hidden="true" />
        </NuxtLink>

        <p class="mt-3 flex items-center justify-center gap-1.5 text-center text-[12px] text-paper/45">
          {{ item.reassurance }}
        </p>
      </div>

      <div class="rounded-b-2xl border-x border-b border-ink bg-[#24211b] px-5 py-4 text-paper shadow-lift sm:px-6">
        <button
          type="button"
          class="flex w-full cursor-pointer items-center justify-between gap-3 text-left"
          :aria-expanded="formOpen"
          @click="toggleForm"
        >
          <span class="font-mono text-[10px] font-semibold tracking-[0.18em] text-paper/60 uppercase">Update job status</span>
          <ChevronDown class="h-4 w-4 text-paper/50 transition-transform" :class="formOpen && 'rotate-180'" />
        </button>

        <form v-if="formOpen" class="mt-4 flex max-h-[45vh] flex-col gap-3 overflow-y-auto pr-1" @submit.prevent="submit">
          <label class="block">
            <span class="font-mono text-[9px] font-semibold tracking-[0.14em] text-paper/45 uppercase">Stage</span>
            <select v-model="selectedStage" class="mt-1 w-full rounded-xl border border-paper/15 bg-[#1f1c17] px-3 py-2.5 text-[13px] text-paper focus:border-brand-bright focus:outline-none">
              <option v-for="stage in stageOptions" :key="stage.key" :value="stage.key">{{ stage.label }}</option>
            </select>
          </label>

          <label class="block">
            <span class="font-mono text-[9px] font-semibold tracking-[0.14em] text-paper/45 uppercase">Short note (optional)</span>
            <textarea v-model="note" rows="2" maxlength="2000" placeholder="What changed?" class="mt-1 w-full resize-none rounded-xl border border-paper/15 bg-[#1f1c17] px-3 py-2.5 text-[13px] text-paper placeholder:text-paper/30 focus:border-brand-bright focus:outline-none" />
          </label>

          <label class="block">
            <span class="font-mono text-[9px] font-semibold tracking-[0.14em] text-paper/45 uppercase">Expected by (optional)</span>
            <input v-model="expectedBy" type="datetime-local" class="mt-1 w-full rounded-xl border border-paper/15 bg-[#1f1c17] px-3 py-2.5 text-[13px] text-paper focus:border-brand-bright focus:outline-none">
          </label>

          <template v-if="showDelay">
            <label class="flex items-center gap-2 text-[12px] text-paper/75">
              <input v-model="delayed" type="checkbox" class="h-4 w-4 accent-brand">
              This stage is delayed
            </label>
            <label v-if="delayed" class="block">
              <span class="font-mono text-[9px] font-semibold tracking-[0.14em] text-paper/45 uppercase">Delay reason</span>
              <input v-model="delayReason" maxlength="240" placeholder="Why is it delayed?" class="mt-1 w-full rounded-xl border border-paper/15 bg-[#1f1c17] px-3 py-2.5 text-[13px] text-paper placeholder:text-paper/30 focus:border-brand-bright focus:outline-none">
            </label>
          </template>

          <p v-if="submitError" class="rounded-lg border border-red/40 bg-red/10 px-3 py-2 text-[11.5px] text-red">{{ submitError }}</p>
          <p v-if="submitNotice" class="rounded-lg border border-green/40 bg-green/10 px-3 py-2 text-[11.5px] text-green">{{ submitNotice }}</p>

          <button type="submit" :disabled="submitting" class="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl bg-brand px-4 text-[13px] font-bold text-white transition-colors hover:bg-brand-deep disabled:cursor-not-allowed disabled:opacity-50">
            <Loader2 v-if="submitting" class="h-4 w-4 animate-spin" />
            {{ submitting ? 'Saving…' : 'Save status update' }}
          </button>
          <p class="text-center font-mono text-[9px] leading-relaxed tracking-[0.04em] text-paper/40">{{ statusHint }}</p>
        </form>
      </div>
    </div>
  </template>

  <p v-else-if="visible" class="mt-4 flex items-center gap-2 text-[12px] text-ink-3" data-test="waiting-next-step">
    <span class="h-1.5 w-1.5 rounded-full bg-ink-3" aria-hidden="true" />
    Waiting on {{ ownerLabel }}
  </p>
</template>
