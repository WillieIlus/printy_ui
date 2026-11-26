<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { getIcon } from '~/utils/design/icon-registry'
import { formatDue } from '~/utils/design/next-format'
import { API } from '~/shared/api-paths'
import { getApiErrorMessage } from '~/shared/api'
import { isDispatchAction, isPerformableAction, performJobAction } from '~/shared/job-actions'
import type { JobCardEnvelope, JobCardJob } from '~/shared/job-card'
import DesignWorkflowRail from '~/components/design/tracker/WorkflowRail.vue'
import {
  OBJECT_LABELS,
  normalizeRole,
  ownerExplanation,
  roleLabel,
  stageLabel,
  viewerOwnerLabel,
  waitingOnLabel,
  type ViewerRole,
} from '~/shared/vocabulary'

export interface JobCardShopOption {
  id: number
  name: string
  location?: string
}

const props = withDefaults(defineProps<{
  /** Law 24: the card takes a list. One job is rendered today. */
  jobs?: JobCardJob[]
  card?: JobCardEnvelope | null
  viewerRole: ViewerRole
  loading?: boolean
  error?: string
  fallbackTarget?: string
  /** Manager dispatch choices. The backend card projection has no shop list. */
  shopOptions?: JobCardShopOption[]
}>(), {
  jobs: () => [],
  card: null,
  loading: false,
  error: '',
  fallbackTarget: '',
  shopOptions: () => [],
})

const emit = defineEmits<{
  updated: [card: JobCardEnvelope, code: string]
  'note-added': []
  secondary: [code: string]
}>()

const { api } = useApi()

const job = computed<JobCardJob | null>(() => props.jobs[0] ?? props.card?.jobs?.[0] ?? null)
const nextAction = computed(() => job.value?.next_action ?? null)
const isOwner = computed(() => {
  if (!job.value || !nextAction.value) return false
  if (nextAction.value.code === 'none') return false
  return normalizeRole(nextAction.value.actor || job.value.owner.role) === normalizeRole(props.viewerRole)
})
const performable = computed(() => isPerformableAction(nextAction.value?.code))
const needsShop = computed(() => isDispatchAction(nextAction.value?.code))
const selectedShopId = ref<number | null>(null)
const selectedShop = computed(() => props.shopOptions.find(shop => shop.id === selectedShopId.value) ?? null)
const fallbackTarget = computed(() => {
  const target = nextAction.value?.params?.target
  return props.fallbackTarget || (typeof target === 'string' ? target : '')
})
const dueLabel = computed(() => {
  const due = job.value?.due?.due_date
  return typeof due === 'string' && due ? formatDue(due) : null
})
const audience = computed(() => (props.viewerRole === 'printer' ? 'printer' : 'client'))

watch(
  () => [job.value?.id, nextAction.value?.code, props.shopOptions.map(shop => shop.id).join(',')] as const,
  () => {
    if (!needsShop.value) return
    if (selectedShopId.value && props.shopOptions.some(shop => shop.id === selectedShopId.value)) return
    const assigned = job.value?.shop?.id
    selectedShopId.value = props.shopOptions.find(shop => shop.id === assigned)?.id
      ?? props.shopOptions[0]?.id
      ?? null
  },
  { immediate: true },
)

const actionBusy = ref(false)
const actionError = ref('')
const actionNotice = ref('')
const note = ref('')
const noteBusy = ref(false)
const noteError = ref('')
const noteNotice = ref('')

function threadTime(value: string | null): string {
  return value ? formatDue(value) : ''
}

async function runPrimary() {
  if (!job.value || !nextAction.value || actionBusy.value) return
  actionBusy.value = true
  actionError.value = ''
  actionNotice.value = ''
  try {
    const result = await performJobAction(api, job.value.id, nextAction.value.code, needsShop.value && selectedShopId.value
      ? { shop_id: selectedShopId.value }
      : {})
    actionNotice.value = result.code === 'confirm_delivery'
      ? 'Delivery confirmed.'
      : result.applied
        ? 'Action recorded.'
        : 'That action was already recorded.'
    emit('updated', result.card, result.code)
  } catch (error) {
    actionError.value = getApiErrorMessage(error, "We couldn't perform that action.")
  } finally {
    actionBusy.value = false
  }
}

async function submitNote() {
  if (!job.value || noteBusy.value) return
  const body = note.value.trim()
  if (!body) {
    noteError.value = 'Write a note before adding it.'
    return
  }
  noteBusy.value = true
  noteError.value = ''
  noteNotice.value = ''
  try {
    await api(API.managedJobs.messages(job.value.id), {
      method: 'POST',
      body: {
        body,
        stage: job.value.stage.key,
        audience: audience.value,
      },
    })
    note.value = ''
    noteNotice.value = 'Note added to this job.'
    emit('note-added')
  } catch (error) {
    noteError.value = getApiErrorMessage(error, "We couldn't add that note.")
  } finally {
    noteBusy.value = false
  }
}
</script>

<template>
  <article data-test="job-card" class="flex flex-col gap-5">
    <p v-if="props.loading" data-test="job-card-loading" class="text-[13px] text-ink-2">
      Loading the job card…
    </p>
    <p v-else-if="props.error" data-test="job-card-error" class="text-[13px] text-red">
      {{ props.error }}
    </p>

    <template v-else-if="job">
      <header class="rounded-2xl border border-line bg-card p-5 shadow-card sm:p-6">
        <div class="flex flex-wrap items-start justify-between gap-4">
          <div class="min-w-0">
            <p class="font-mono text-[10px] font-semibold tracking-[0.16em] text-brand uppercase">
              {{ OBJECT_LABELS.job }} card
            </p>
            <p data-test="job-card-code" class="mt-1 font-mono text-[12px] font-semibold tracking-[0.12em] text-ink-3">
              {{ job.code }}
            </p>
            <h2 data-test="job-card-title" class="mt-1 text-[24px] font-bold leading-tight tracking-tight text-ink">
              {{ job.title }}
            </h2>
          </div>
          <span
            data-test="job-card-stage"
            class="rounded-full border border-brand/35 bg-mint px-3 py-1 font-mono text-[9.5px] font-semibold tracking-[0.1em] text-brand-deep uppercase"
          >
            {{ OBJECT_LABELS.stage }}: {{ job.workflow?.current?.label || stageLabel(job.stage.key) }}
          </span>
        </div>

        <DesignWorkflowRail
          v-if="job.workflow?.stages?.length"
          data-test="job-card-workflow"
          class="mt-4"
          :stages="job.workflow.stages"
          :current-note="job.workflow.current?.substate || job.workflow.current?.label || ''"
          :current-number="job.workflow.current?.index || 0"
          :total-stages="job.workflow.stages.length"
          aria-label="Job workflow"
        />

        <p data-test="job-card-owner" class="mt-4 text-[13px] leading-relaxed text-ink-2">
          <span class="font-semibold text-ink">Next up: {{ viewerOwnerLabel(job.owner.role, props.viewerRole) || job.owner.label || waitingOnLabel(job.owner.role, props.viewerRole) }}</span>
          <span class="ml-1">{{ ownerExplanation(job.owner.role, props.viewerRole) }}</span>
        </p>

        <div v-if="job.manager || job.client || job.shop" data-test="job-card-parties" class="mt-3 flex flex-wrap gap-x-4 gap-y-1 font-mono text-[9.5px] tracking-[0.08em] text-ink-3 uppercase">
          <span v-if="job.manager">{{ OBJECT_LABELS.manager }}: {{ job.manager.name }}</span>
          <span v-if="job.client">Client: {{ job.client.name }}</span>
          <span v-if="job.shop">{{ OBJECT_LABELS.printer }}: {{ job.shop.name }}</span>
        </div>

        <p v-if="job.internal_status_label" data-test="job-card-internal" class="mt-2 font-mono text-[9px] tracking-[0.1em] text-ink-3 uppercase">
          Internal status: {{ job.internal_status_label }}
        </p>

        <p v-if="dueLabel" class="mt-2 font-mono text-[10px] tracking-[0.08em] text-ink-3 uppercase">
          Due {{ dueLabel }}
        </p>
      </header>

      <section
        v-if="isOwner"
        data-test="job-card-primary"
        class="relative overflow-hidden rounded-2xl border border-ink bg-ink p-6 text-paper shadow-lift sm:p-7"
      >
        <div class="halftone absolute -top-8 -right-8 h-36 w-36 rounded-full opacity-25" aria-hidden="true" />
        <div class="relative">
          <p class="font-mono text-[10px] tracking-[0.18em] text-paper/50 uppercase">Next step</p>
          <p data-test="job-card-primary-label" class="mt-2 text-[23px] font-bold leading-tight tracking-tight text-white sm:text-[26px]">
            {{ job.next_action.label }}
          </p>
          <p class="mt-2 font-mono text-[10.5px] tracking-[0.04em] text-paper/55">
            Waiting on you
            <span v-if="dueLabel"> · due {{ dueLabel }}</span>
          </p>

          <label v-if="needsShop" class="mt-4 block text-left">
            <span class="font-mono text-[9px] font-semibold tracking-[0.14em] text-paper/45 uppercase">Assign a printer</span>
            <select
              v-model.number="selectedShopId"
              data-test="job-card-shop-select"
              class="mt-1 w-full rounded-xl border border-paper/15 bg-[#1f1c17] px-3 py-2.5 text-[13px] text-paper focus:border-brand-bright focus:outline-none"
            >
              <option v-if="!props.shopOptions.length" :value="null">No printer shops available</option>
              <option v-for="shop in props.shopOptions" :key="shop.id" :value="shop.id">
                {{ shop.name }}<template v-if="shop.location"> · {{ shop.location }}</template>
              </option>
            </select>
          </label>

          <button
            v-if="performable"
            type="button"
            data-job-card-primary-action="true"
            :data-test="job.next_action.code === 'confirm_delivery' ? 'confirm-delivery' : 'job-card-primary-action'"
            class="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-brand py-3.5 text-[15px] font-semibold text-white shadow-brand transition-all hover:bg-brand-deep disabled:cursor-not-allowed disabled:opacity-50"
            :disabled="actionBusy || (needsShop && !selectedShopId)"
            @click="runPrimary"
          >
            <component :is="getIcon(actionBusy ? 'Loader2' : 'ArrowRight')" :class="actionBusy ? 'h-4 w-4 animate-spin' : 'h-4 w-4'" :stroke-width="2" />
            {{ actionBusy ? 'Working…' : job.next_action.label }}
          </button>

          <NuxtLink
            v-else-if="fallbackTarget"
            :to="fallbackTarget"
            data-job-card-primary-action="true"
            data-test="job-card-primary-link"
            class="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-brand py-3.5 text-[15px] font-semibold text-white shadow-brand transition-all hover:bg-brand-deep"
          >
            {{ job.next_action.label }}
            <component :is="getIcon('ArrowRight')" class="h-4 w-4" :stroke-width="2" />
          </NuxtLink>

          <button
            v-else
            type="button"
            data-job-card-primary-action="true"
            data-test="job-card-primary-action"
            class="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-brand py-3.5 text-[15px] font-semibold text-white opacity-60"
            disabled
            title="Continue in the job workflow."
          >
            {{ job.next_action.label }}
          </button>

          <p v-if="actionError" data-test="job-card-action-error" class="mt-3 text-[12px] text-red">{{ actionError }}</p>
          <p v-if="actionNotice" data-test="job-card-action-notice" class="mt-3 text-[12px] text-green">{{ actionNotice }}</p>
        </div>
      </section>

      <p v-else data-test="job-card-waiting" class="flex flex-wrap items-center gap-x-2 gap-y-1 rounded-xl border border-line bg-paper-2 px-4 py-3 text-[12.5px] text-ink-2">
        <span class="h-1.5 w-1.5 shrink-0 rounded-full bg-ink-3" aria-hidden="true" />
        <span>{{ waitingOnLabel(job.owner.role, props.viewerRole) }}</span>
        <span>{{ ownerExplanation(job.owner.role, props.viewerRole) }}</span>
      </p>

      <section data-test="job-card-thread" class="rounded-2xl border border-line bg-card p-5 shadow-card sm:p-6">
        <div class="flex items-center justify-between gap-3">
          <h3 class="text-[15px] font-bold tracking-tight text-ink">Thread</h3>
          <span class="font-mono text-[9px] tracking-[0.1em] text-ink-3 uppercase">{{ job.thread.length }} events</span>
        </div>
        <ol v-if="job.thread.length" class="mt-4 space-y-3">
          <li
            v-for="item in job.thread"
            :key="item.id"
            data-test="job-card-thread-item"
            class="rounded-xl border border-line bg-paper px-3.5 py-3"
          >
            <div class="flex flex-wrap items-center gap-x-2 gap-y-1">
              <span class="text-[12.5px] font-semibold text-ink">{{ item.actor.name }}</span>
              <span class="font-mono text-[9px] tracking-[0.08em] text-ink-3 uppercase">{{ roleLabel(item.actor.role) }}</span>
              <span v-if="item.stage" class="rounded-full bg-paper-2 px-2 py-0.5 font-mono text-[8.5px] tracking-[0.08em] text-ink-3 uppercase">{{ stageLabel(item.stage) }}</span>
              <span class="ml-auto font-mono text-[9px] text-ink-3">{{ threadTime(item.at) }}</span>
            </div>
            <p class="mt-1 text-[12.5px] font-medium text-ink">{{ item.title }}</p>
            <p v-if="item.body" class="mt-0.5 text-[12px] leading-relaxed text-ink-2">{{ item.body }}</p>
          </li>
        </ol>
        <p v-else class="mt-3 text-[12.5px] text-ink-3">No events yet. The first stage update will appear here.</p>
      </section>

      <div class="flex flex-wrap items-start justify-between gap-3">
        <details v-if="job.secondary_actions.length" data-test="job-card-more" class="relative">
          <summary class="inline-flex min-h-[36px] cursor-pointer list-none items-center gap-1.5 rounded-xl border border-line bg-card px-3 text-[12px] font-semibold text-ink-2 transition-colors hover:border-line-strong hover:text-ink">
            More
          </summary>
          <div class="mt-2 flex min-w-[160px] flex-col gap-1 rounded-xl border border-line bg-card p-2 shadow-card">
            <button
              v-for="action in job.secondary_actions"
              :key="action.code"
              type="button"
              data-test="job-card-secondary"
              class="rounded-lg px-2.5 py-2 text-left text-[12.5px] text-ink-2 transition-colors hover:bg-paper-2 hover:text-ink"
              @click="emit('secondary', action.code)"
            >
              {{ action.label }}
            </button>
          </div>
        </details>
        <span class="font-mono text-[9px] tracking-[0.08em] text-ink-3 uppercase">{{ job.code }}</span>
      </div>

      <form data-test="job-card-note-form" class="rounded-2xl border border-line bg-card p-4" @submit.prevent="submitNote">
        <label for="job-card-note" class="text-[12.5px] font-semibold text-ink">Add a note</label>
        <textarea
          id="job-card-note"
          v-model="note"
          data-test="job-card-note"
          rows="2"
          maxlength="2000"
          placeholder="What changed?"
          class="mt-2 w-full resize-none rounded-xl border border-line bg-paper px-3 py-2.5 text-[13px] text-ink outline-none placeholder:text-ink-3 focus:border-brand"
        />
        <div class="mt-2 flex flex-wrap items-center gap-2">
          <button
            type="submit"
            data-test="job-card-note-submit"
            class="inline-flex min-h-[36px] items-center rounded-xl border border-line-strong bg-card px-3 text-[12px] font-semibold text-ink transition-colors hover:border-brand hover:text-brand disabled:opacity-50"
            :disabled="noteBusy"
          >
            {{ noteBusy ? 'Adding…' : 'Add note' }}
          </button>
          <p v-if="noteError" data-test="job-card-note-error" class="text-[11.5px] text-red">{{ noteError }}</p>
          <p v-if="noteNotice" data-test="job-card-note-notice" class="text-[11.5px] text-green">{{ noteNotice }}</p>
        </div>
      </form>
    </template>
  </article>
</template>
