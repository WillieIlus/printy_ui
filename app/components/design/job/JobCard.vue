<template>
  <article
    data-test="job-card"
    class="relative overflow-hidden rounded-2xl border border-[#DDD4C3] bg-[#FAF7F2] p-5 shadow-[0_1px_0_rgba(32,28,24,0.06),0_18px_38px_-26px_rgba(32,28,24,0.45)] sm:p-7"
  >
    <div
      aria-hidden="true"
      class="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-gradient-to-bl from-[#ECE4D8]/80 to-transparent blur-2xl"
    />

    <p v-if="props.loading" data-test="job-card-loading" class="relative p-2 text-[13px] text-[#726A5E]">
      Loading job card...
    </p>
    <p v-else-if="props.error" data-test="job-card-error" class="relative p-2 text-[13px] text-[#9D1C17]">
      {{ props.error }}
    </p>

    <template v-else-if="job">
      <div class="relative flex flex-wrap items-center justify-between gap-3">
        <div class="flex flex-wrap items-center gap-2.5">
          <span class="inline-flex items-center gap-1.5 rounded-md border border-[#F3BCB0] bg-[#FDF1EE] px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-[#DE644D]">
            <span class="h-1.5 w-1.5 animate-pulse rounded-full bg-[#DE644D]" />
            Job card
          </span>

          <button
            type="button"
            data-test="job-card-copy"
            class="group inline-flex items-center gap-1.5 rounded-md border border-[#DDD4C3] bg-[#ECE4D8] px-2.5 py-1 text-[#201C18] transition-colors hover:bg-[#E2DACB]"
            title="Copy job code"
            @click="copyCode"
          >
            <span data-test="job-card-code" class="font-mono text-[11px] font-semibold tracking-[0.04em]">{{ job.code }}</span>
            <component :is="copied ? getIcon('Check') : Copy" :size="13" :class="copied ? 'text-[#0D5C57]' : 'text-[#726A5E]'" />
            <span v-if="copied" class="font-sans text-[9px] font-bold text-[#0D5C57]">Copied</span>
          </button>
        </div>

        <span
          data-test="job-card-stage"
          class="inline-flex items-center gap-1.5 rounded-full border border-[#DE644D]/50 bg-[#FDF1EE] px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-[#DE644D]"
        >
          <span class="h-2 w-2 rounded-full bg-[#DE644D]" />
          {{ OBJECT_LABELS.stage }}: {{ job.workflow?.current?.label || stageLabel(job.stage.key) }}
        </span>
      </div>

      <div class="relative mt-5 max-w-4xl">
        <h2 data-test="job-card-title" class="text-[24px] font-semibold leading-tight tracking-tight text-[#201C18] sm:text-[28px]">
          {{ job.title }}
        </h2>
        <p data-test="job-card-owner" class="mt-2.5 text-[13px] leading-relaxed text-[#524B40]">
          <span class="font-semibold text-[#201C18]">Next up: {{ viewerOwnerLabel(job.owner.role, props.viewerRole) || job.owner.label || waitingOnLabel(job.owner.role, props.viewerRole) }}</span>
          <span class="ml-1">{{ ownerExplanation(job.owner.role, props.viewerRole) }}</span>
        </p>

        <div v-if="job.manager || job.client || job.shop" data-test="job-card-parties" class="mt-3 flex flex-wrap gap-x-4 gap-y-1 font-mono text-[9.5px] uppercase tracking-[0.08em] text-[#726A5E]">
          <span v-if="job.manager">{{ OBJECT_LABELS.manager }}: {{ job.manager.name }}</span>
          <span v-if="job.client">Client: {{ job.client.name }}</span>
          <span v-if="job.shop">{{ OBJECT_LABELS.printer }}: {{ job.shop.name }}</span>
        </div>

        <p v-if="job.internal_status_label" data-test="job-card-internal" class="mt-2 font-mono text-[9px] uppercase tracking-[0.1em] text-[#726A5E]">
          Internal status: {{ job.internal_status_label }}
        </p>

        <p v-if="dueLabel" class="mt-2 font-mono text-[10px] uppercase tracking-[0.08em] text-[#726A5E]">
          Due {{ dueLabel }}
        </p>
      </div>

      <DesignWorkflowRail
        v-if="job.workflow?.stages?.length"
        data-test="job-card-workflow"
        class="relative mt-5"
        :stages="job.workflow.stages"
        :current-note="job.workflow.current?.substate || job.workflow.current?.label || ''"
        :current-number="job.workflow.current?.index || 0"
        :total-stages="job.workflow.stages.length"
        aria-label="Job workflow"
      />

      <section
        v-if="isOwner"
        data-test="job-card-primary"
        class="relative mt-5 overflow-hidden rounded-2xl border border-[#0D5C57]/30 bg-[#0D5C57] p-5 text-white shadow-[0_18px_36px_-24px_rgba(13,92,87,0.8)] sm:p-6"
      >
        <div class="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" aria-hidden="true" />
        <div class="relative">
          <div class="flex flex-wrap items-center justify-between gap-2">
            <p class="font-mono text-[10px] uppercase tracking-[0.18em] text-white/60">Next action</p>
            <span class="rounded-full border border-white/25 bg-white/10 px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.1em] text-white/80">
              Waiting on you
            </span>
          </div>
          <p data-test="job-card-primary-label" class="mt-2 text-[23px] font-bold leading-tight tracking-tight text-white sm:text-[26px]">
            {{ job.next_action.label }}
          </p>
          <p v-if="dueLabel" class="mt-2 font-mono text-[10.5px] tracking-[0.04em] text-white/65">
            Due {{ dueLabel }}
          </p>

          <label v-if="needsShop" class="mt-4 block text-left">
            <span class="font-mono text-[9px] font-semibold uppercase tracking-[0.14em] text-white/55">Assign a printer</span>
            <select
              v-model.number="selectedShopId"
              data-test="job-card-shop-select"
              class="mt-1 w-full rounded-xl border border-white/20 bg-[#0A4844] px-3 py-2.5 text-[13px] text-white focus:border-white/50 focus:outline-none"
            >
              <option v-if="!props.shopOptions.length" :value="null">No printer shops available</option>
              <option v-for="shop in props.shopOptions" :key="shop.id" :value="shop.id">
                {{ shop.name }}<template v-if="shop.location">, {{ shop.location }}</template>
              </option>
            </select>
          </label>

          <button
            v-if="performable"
            type="button"
            data-job-card-primary-action="true"
            :data-test="job.next_action.code === 'confirm_delivery' ? 'confirm-delivery' : 'job-card-primary-action'"
            class="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#FAF7F2] py-3.5 text-[14px] font-semibold text-[#0D5C57] shadow-sm transition-all hover:bg-white disabled:cursor-not-allowed disabled:opacity-50"
            :disabled="actionBusy || (needsShop && !selectedShopId)"
            @click="runPrimary"
          >
            <component :is="getIcon(actionBusy ? 'Loader2' : 'ArrowRight')" :class="actionBusy ? 'h-4 w-4 animate-spin' : 'h-4 w-4'" :stroke-width="2" />
            {{ actionBusy ? 'Working...' : job.next_action.label }}
          </button>

          <NuxtLink
            v-else-if="fallbackTarget"
            :to="fallbackTarget"
            data-job-card-primary-action="true"
            data-test="job-card-primary-link"
            class="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#FAF7F2] py-3.5 text-[14px] font-semibold text-[#0D5C57] shadow-sm transition-all hover:bg-white"
          >
            {{ job.next_action.label }}
            <component :is="getIcon('ArrowRight')" class="h-4 w-4" :stroke-width="2" />
          </NuxtLink>

          <button
            v-else
            type="button"
            data-job-card-primary-action="true"
            data-test="job-card-primary-action"
            class="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#FAF7F2] py-3.5 text-[14px] font-semibold text-[#0D5C57] opacity-60"
            disabled
            title="Continue in the job workflow."
          >
            {{ job.next_action.label }}
          </button>

          <p v-if="actionError" data-test="job-card-action-error" class="mt-3 text-[12px] text-[#FFD1CB]">{{ actionError }}</p>
          <p v-if="actionNotice" data-test="job-card-action-notice" class="mt-3 text-[12px] text-[#CFF3E3]">{{ actionNotice }}</p>
        </div>
      </section>

      <div
        v-else
        data-test="job-card-waiting"
        class="relative mt-5 flex flex-wrap items-center gap-x-2 gap-y-1 rounded-xl border border-[#0D5C57]/20 bg-[#E6F2F0] px-4 py-3 text-[12.5px] text-[#0D5C57]"
      >
        <span class="h-2 w-2 shrink-0 rounded-full bg-[#0D5C57]" aria-hidden="true" />
        <span class="font-semibold">{{ waitingOnLabel(job.owner.role, props.viewerRole) }}</span>
        <span class="text-[#0D5C57]/75">{{ ownerExplanation(job.owner.role, props.viewerRole) }}</span>
      </div>

      <section data-test="job-card-thread" class="relative mt-5 overflow-hidden rounded-2xl border border-[#DDD4C3] bg-[#ECE4D8] shadow-sm">
        <div class="border-b border-[#DDD4C3] bg-[#FAF7F2]/80 px-4 py-4 sm:px-5">
          <div class="flex flex-wrap items-center justify-between gap-3">
            <div class="flex flex-wrap items-center gap-2">
              <h3 class="text-[16px] font-bold tracking-tight text-[#201C18]">Thread</h3>
              <span class="rounded-full bg-[#ECE4D8] px-2.5 py-1 font-mono text-[9px] font-semibold uppercase tracking-[0.1em] text-[#524B40]">
                {{ job.thread.length }} events, open
              </span>
            </div>

            <div class="flex items-center gap-1 rounded-xl border border-[#DDD4C3] bg-[#ECE4D8] p-1">
              <button
                v-for="tab in threadTabs"
                :key="tab.key"
                type="button"
                class="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[11px] font-semibold transition-all"
                :class="threadFilter === tab.key ? 'bg-white text-[#201C18] shadow-sm' : 'text-[#726A5E] hover:text-[#201C18]'"
                :aria-pressed="threadFilter === tab.key"
                @click="threadFilter = tab.key"
              >
                <component :is="getIcon(tab.icon)" :size="13" aria-hidden="true" />
                {{ tab.label }}
              </button>
            </div>
          </div>
        </div>

        <ol v-if="filteredThread.length" class="max-h-[560px] space-y-3 overflow-y-auto p-4 sm:p-5">
          <li
            v-for="item in filteredThread"
            :key="item.id"
            data-test="job-card-thread-item"
            class="rounded-xl border p-3.5 shadow-[0_1px_0_rgba(32,28,24,0.04)] sm:p-4"
            :class="item.type === 'delivery'
              ? 'border-[#0D5C57]/25 bg-[#E6F2F0]/70'
              : item.type === 'note'
                ? 'border-[#DE644D]/25 bg-[#FDF1EE]/70'
                : 'border-[#DDD4C3] bg-white'"
          >
            <div class="flex items-start justify-between gap-3">
              <div class="flex min-w-0 items-center gap-2.5">
                <span
                  class="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[11px] font-bold"
                  :class="item.type === 'delivery'
                    ? 'bg-[#0D5C57] text-white'
                    : item.type === 'note'
                      ? 'bg-[#DE644D] text-white'
                      : 'bg-[#ECE4D8] text-[#201C18]'"
                >
                  <component v-if="item.type === 'delivery'" :is="getIcon('Truck')" :size="13" aria-hidden="true" />
                  <template v-else>{{ item.actor.name.charAt(0) }}</template>
                </span>
                <div class="min-w-0">
                  <div class="flex flex-wrap items-center gap-2">
                    <span class="truncate text-[12.5px] font-bold text-[#201C18]">{{ item.actor.name }}</span>
                    <span
                      v-if="item.actor.role === 'manager'"
                      class="rounded border border-[#E4D1B0] bg-[#FAF1DF] px-1.5 py-0.5 font-mono text-[8.5px] font-semibold uppercase tracking-[0.08em] text-[#825C18]"
                    >
                      Manager
                    </span>
                  </div>
                  <span class="font-mono text-[9px] uppercase tracking-[0.08em] text-[#726A5E]">{{ roleLabel(item.actor.role) }}</span>
                </div>
              </div>
              <span class="shrink-0 font-mono text-[9.5px] text-[#726A5E]">{{ threadTime(item.at) }}</span>
            </div>

            <div class="mt-2.5 pl-9">
              <div class="flex flex-wrap items-center gap-2">
                <h4 class="flex items-center gap-1.5 text-[12px] font-semibold text-[#201C18]">
                  <component v-if="item.type === 'delivery'" :is="getIcon('CheckCircle2')" :size="13" class="text-[#0D5C57]" aria-hidden="true" />
                  {{ item.title }}
                </h4>
                <span
                  v-if="item.stage"
                  class="rounded-full bg-[#ECE4D8] px-2 py-0.5 font-mono text-[8.5px] uppercase tracking-[0.08em] text-[#726A5E]"
                >
                  {{ stageLabel(item.stage) }}
                </span>
              </div>
              <p v-if="item.body" class="mt-1 text-[12px] leading-relaxed text-[#524B40]">{{ item.body }}</p>

              <dl v-if="item.metadata && Object.keys(item.metadata).length" class="mt-2.5 grid gap-2 rounded-lg border border-[#DDD4C3]/70 bg-[#FAF7F2] p-2.5 font-mono text-[10px] sm:grid-cols-3">
                <div v-for="(value, key) in item.metadata" :key="key">
                  <dt class="text-[8.5px] uppercase tracking-[0.08em] text-[#726A5E]">{{ key }}</dt>
                  <dd class="mt-0.5 font-semibold text-[#201C18]">{{ value }}</dd>
                </div>
              </dl>
            </div>
          </li>
        </ol>
        <p v-else class="p-5 text-[12.5px] text-[#726A5E]">
          No events in this view yet. The first stage update will appear here.
        </p>

        <form data-test="job-card-note-form" class="border-t border-[#DDD4C3] bg-[#FAF7F2] p-4 sm:p-5" @submit.prevent="submitNote">
          <div class="flex flex-wrap items-center justify-between gap-2">
            <label for="job-card-note" class="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-[#201C18]">
              Add a note
            </label>
            <span class="inline-flex items-center gap-1 rounded-full border border-[#0D5C57]/20 bg-[#E6F2F0] px-2 py-0.5 font-mono text-[9px] font-semibold uppercase tracking-[0.08em] text-[#0D5C57]">
              <component :is="getIcon('ShieldCheck')" :size="11" aria-hidden="true" />
              Thread logged
            </span>
          </div>
          <textarea
            id="job-card-note"
            v-model="note"
            data-test="job-card-note"
            rows="3"
            maxlength="2000"
            placeholder="What changed? Add an internal note or a message for the client."
            class="mt-2.5 w-full resize-none rounded-xl border border-[#DDD4C3] bg-white px-3.5 py-2.5 text-[13px] text-[#201C18] outline-none placeholder:text-[#8E8477] focus:border-[#0D5C57] focus:ring-2 focus:ring-[#0D5C57]/15"
          />
          <div class="mt-2.5 flex flex-wrap items-center justify-between gap-2">
            <div class="flex flex-wrap items-center gap-2">
              <p v-if="noteError" data-test="job-card-note-error" class="text-[11.5px] text-[#9D1C17]">{{ noteError }}</p>
              <p v-if="noteNotice" data-test="job-card-note-notice" class="text-[11.5px] text-[#0D5C57]">{{ noteNotice }}</p>
            </div>
            <button
              type="submit"
              data-test="job-card-note-submit"
              class="inline-flex items-center gap-1.5 rounded-full bg-[#201C18] px-4 py-2 text-[11.5px] font-semibold text-white transition-colors hover:bg-[#38322C] disabled:cursor-not-allowed disabled:bg-[#DDD4C3] disabled:text-[#8E8477]"
              :disabled="noteBusy"
            >
              {{ noteBusy ? 'Adding...' : 'Add note' }}
              <component :is="getIcon('Send')" :size="12" aria-hidden="true" />
            </button>
          </div>
        </form>
      </section>

      <div class="relative mt-4 flex flex-wrap items-start justify-between gap-3">
        <details v-if="job.secondary_actions.length" data-test="job-card-more" class="relative">
          <summary class="inline-flex min-h-[36px] cursor-pointer list-none items-center gap-1.5 rounded-xl border border-[#DDD4C3] bg-[#FAF7F2] px-3 text-[12px] font-semibold text-[#524B40] transition-colors hover:border-[#201C18] hover:text-[#201C18]">
            More
            <component :is="getIcon('ChevronDown')" :size="13" aria-hidden="true" />
          </summary>
          <div class="absolute z-20 mt-2 flex min-w-[170px] flex-col gap-1 rounded-xl border border-[#DDD4C3] bg-[#FAF7F2] p-2 shadow-lg">
            <button
              v-for="action in job.secondary_actions"
              :key="action.code"
              type="button"
              data-test="job-card-secondary"
              class="rounded-lg px-2.5 py-2 text-left text-[12.5px] text-[#524B40] transition-colors hover:bg-[#ECE4D8] hover:text-[#201C18]"
              @click="emit('secondary', action.code)"
            >
              {{ action.label }}
            </button>
          </div>
        </details>
        <span class="font-mono text-[9px] uppercase tracking-[0.08em] text-[#726A5E]">{{ job.code }}</span>
      </div>

      <footer class="relative mt-3 flex flex-wrap items-center justify-between gap-3 border-t border-[#DDD4C3] pt-3">
        <span class="font-mono text-[10px] uppercase tracking-[0.14em] text-[#726A5E]">
          Stage: {{ job.workflow?.current?.label || stageLabel(job.stage.key) }}
        </span>
        <span class="font-mono text-[10px] uppercase tracking-[0.12em] text-[#726A5E]">{{ job.code }}</span>
        <span v-if="dueLabel" class="font-mono text-[10px] uppercase tracking-[0.12em] text-[#726A5E]">Due {{ dueLabel }}</span>
      </footer>
    </template>
  </article>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { Copy } from 'lucide-vue-next'
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

const threadFilter = ref<'all' | 'message' | 'history'>('all')
const threadTabs = [
  { key: 'all' as const, label: 'All', icon: 'MessageSquare' as const },
  { key: 'message' as const, label: 'Message', icon: 'MessageSquare' as const },
  { key: 'history' as const, label: 'History', icon: 'Clock3' as const },
]

const filteredThread = computed(() => {
  const items = job.value?.thread ?? []
  if (threadFilter.value === 'all') return items
  if (threadFilter.value === 'message') {
    return items.filter((item) => ['message', 'note', 'proof'].includes(item.type))
  }
  return items.filter((item) => !['message', 'note', 'proof'].includes(item.type))
})

const copied = ref(false)
let copiedTimer: ReturnType<typeof setTimeout> | null = null

async function copyCode() {
  if (!job.value?.code) return
  try {
    await navigator.clipboard.writeText(job.value.code)
    copied.value = true
    if (copiedTimer) clearTimeout(copiedTimer)
    copiedTimer = setTimeout(() => {
      copied.value = false
    }, 2000)
  } catch {
    copied.value = false
  }
}

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
