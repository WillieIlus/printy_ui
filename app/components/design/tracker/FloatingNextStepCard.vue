<script setup lang="ts">
import { computed, ref } from 'vue'
import { ArrowRight, Clock3, Loader2 } from 'lucide-vue-next'
import type { NextActionItem } from '~/shared/next-action-item'
import { useApi } from '../../../composables/useApi'
import { getApiErrorMessage } from '../../../shared/api'
import { isPerformableAction, performJobAction } from '../../../shared/job-actions'
import { ownerExplanation, ownerPhrase } from '~/shared/vocabulary'
import { formatDue, formatLeft } from '../../../utils/design/next-format'

type ViewerRole = 'buyer' | 'manager' | 'printer'

const props = withDefaults(defineProps<{
  item: NextActionItem | null
  jobId?: number | null
  role: ViewerRole
  currentStage?: string
  readOnly?: boolean
  overdue?: boolean
  cardTarget?: string
}>(), {
  jobId: null,
  currentStage: '',
  readOnly: false,
  overdue: false,
  cardTarget: '',
})

const emit = defineEmits<{ updated: [] }>()
const { api } = useApi()

const actionBusy = ref(false)
const actionError = ref('')
const actionNotice = ref('')

const ownerLabel = computed(() => ownerPhrase(props.item?.owner_role, props.role))
const waitingExplanation = computed(() => ownerExplanation(props.item?.owner_role, props.role))
const isMine = computed(() => Boolean(props.item?.is_mine && !props.readOnly))
const visible = computed(() => Boolean(props.item && !props.item.completed))
const performable = computed(() => isPerformableAction(props.item?.next_action?.key))
const target = computed(() => props.item?.next_action?.target ?? '')

const dueLabel = computed(() => (props.item?.due_at ? formatDue(props.item.due_at) : null))
const waitingLabel = computed(() => (props.item?.waiting_since ? formatLeft(props.item.waiting_since).replace(' left', '') : null))
const showDelay = computed(() => Boolean(props.overdue || props.item?.overdue_level === 'warn' || props.item?.overdue_level === 'late'))
const dockClass = 'fixed inset-x-4 bottom-[calc(env(safe-area-inset-bottom,0px)+4.75rem)] z-30 sm:inset-x-auto sm:right-6 sm:bottom-6 sm:w-[420px] lg:sticky lg:inset-x-auto lg:right-auto lg:bottom-6 lg:ml-auto lg:w-full lg:max-w-[420px]'

async function perform() {
  if (!props.jobId || !props.item?.next_action?.key || actionBusy.value) return
  actionBusy.value = true
  actionError.value = ''
  actionNotice.value = ''
  try {
    await performJobAction(api, props.jobId, props.item.next_action.key)
    actionNotice.value = 'Action recorded.'
    emit('updated')
  } catch (error) {
    actionError.value = getApiErrorMessage(error, "We couldn't perform that action.")
  } finally {
    actionBusy.value = false
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
        <p v-if="showDelay" class="mt-2 font-mono text-[10px] font-semibold uppercase tracking-[0.1em]" :class="item.overdue_level === 'late' ? 'text-red' : 'text-amber'">
          {{ item.overdue_level === 'late' ? '48h+ overdue' : '24h+ overdue' }}
        </p>

        <button
          v-if="performable"
          type="button"
          data-test="floating-next-step-action"
          class="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-brand py-3.5 text-[15px] font-semibold text-white shadow-brand transition-all hover:bg-brand-deep disabled:cursor-not-allowed disabled:opacity-50"
          :disabled="actionBusy"
          @click="perform"
        >
          <Loader2 v-if="actionBusy" class="h-4 w-4 animate-spin" aria-hidden="true" />
          {{ actionBusy ? 'Working…' : item.next_action?.label }}
          <ArrowRight v-if="!actionBusy" class="h-4 w-4" aria-hidden="true" />
        </button>

        <NuxtLink
          v-else-if="target"
          :to="target"
          data-test="floating-next-step-link"
          class="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-brand py-3.5 text-[15px] font-semibold text-white shadow-brand transition-all hover:bg-brand-deep"
        >
          {{ item.next_action?.label }}
          <ArrowRight class="h-4 w-4" aria-hidden="true" />
        </NuxtLink>

        <button
          v-else
          type="button"
          data-test="floating-next-step-action"
          class="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-brand py-3.5 text-[15px] font-semibold text-white opacity-60"
          disabled
        >
          {{ item.next_action?.label }}
        </button>

        <p v-if="actionError" data-test="floating-next-step-error" class="mt-3 text-[11.5px] text-red">{{ actionError }}</p>
        <p v-if="actionNotice" data-test="floating-next-step-notice" class="mt-3 text-[11.5px] text-green">{{ actionNotice }}</p>

        <p class="mt-3 flex items-center justify-center gap-1.5 text-center text-[12px] text-paper/45">
          {{ item.reassurance }}
        </p>

        <NuxtLink
          v-if="cardTarget"
          :to="cardTarget"
          data-test="floating-next-step-card-link"
          class="mt-3 flex items-center justify-center gap-1.5 text-center font-mono text-[10px] font-semibold tracking-[0.1em] text-brand-bright uppercase underline underline-offset-4"
        >
          Open the job card
        </NuxtLink>
      </div>
    </div>
  </template>

  <p v-else-if="visible" class="mt-4 flex items-center gap-2 text-[12px] text-ink-3" data-test="waiting-next-step">
    <span class="h-1.5 w-1.5 rounded-full bg-ink-3" aria-hidden="true" />
    Waiting on {{ ownerLabel }}. {{ waitingExplanation }}
  </p>
</template>
