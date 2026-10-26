<template>
  <div class="mx-auto w-full max-w-[1200px]">
    <div class="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <div class="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">
          <PrinterIcon :size="12" class="text-violet-600" /> {{ shopName }}
        </div>
        <h1 class="mt-1 text-2xl font-extrabold tracking-tight text-gray-900 sm:text-[28px]">Production Floor</h1>
        <p class="mt-1 max-w-3xl text-sm text-gray-500">
          Printer projection: sheet math and your own payout — buyer prices and manager margins are excluded at the API (law 1.2).
        </p>
      </div>
      <div class="flex flex-wrap items-center gap-2">
        <span class="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-2.5 py-1.5 text-xs text-gray-500">
          <span class="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          Live shop data
        </span>
        <span class="rounded-full bg-violet-50 px-2.5 py-1.5 text-xs font-semibold text-violet-700">
          {{ activeJobs.length }} jobs live
        </span>
        <NuxtLink
          to="/app/printer/rates"
          class="inline-flex items-center gap-1.5 rounded-xl border border-violet-200 bg-violet-50 px-3 py-2 text-xs font-semibold text-violet-700 transition-colors hover:bg-violet-100"
        >
          <Coins :size="14" /> My rate card
          <span v-if="rateCardStatus" class="font-normal text-violet-600">
            · {{ rateCardStatus.is_confirmed ? 'You are live to managers.' : `${rateCardStatus.completed_steps} of ${rateCardStatus.total_steps} steps done` }}
          </span>
        </NuxtLink>
      </div>
    </div>

    <div class="mb-6 grid gap-3 sm:grid-cols-2">
      <div class="rounded-xl border border-violet-200 bg-violet-50/60 p-4">
        <p class="mb-2 text-xs font-bold uppercase tracking-wide text-violet-700">You see (printer allowlist)</p>
        <div class="flex flex-wrap gap-1.5">
          <span
            v-for="field in visibleFields"
            :key="field"
            class="rounded-lg border border-violet-200 bg-white px-2 py-1 text-[10px] font-semibold text-violet-700"
          >
            {{ field }}
          </span>
        </div>
      </div>
      <div class="rounded-xl border border-slate-200 bg-slate-50 p-4">
        <p class="mb-2 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-slate-600">
          <Lock :size="12" /> Never visible to you
        </p>
        <div class="flex flex-wrap gap-1.5">
          <span
            v-for="field in hiddenFields"
            :key="field"
            class="rounded-lg border border-slate-200 bg-white px-2 py-1 text-[10px] font-semibold text-slate-500 line-through decoration-slate-300"
          >
            {{ field }}
          </span>
        </div>
      </div>
    </div>

    <div id="jobs" class="mb-6 overflow-hidden rounded-2xl border border-gray-200 bg-white">
      <div class="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 px-5 py-4">
        <h2 class="text-base font-bold text-gray-900">Assigned jobs</h2>
        <span class="text-[11px] text-gray-400">Sheets billed match the manager view exactly (law 3.3)</span>
      </div>

      <div v-if="assignments.loading && !assignments.hasAssignments" class="flex items-center gap-2 px-5 py-8 text-sm text-gray-500">
        <Loader2 :size="15" class="animate-spin text-violet-600" /> Loading your job queue…
      </div>
      <div v-else-if="assignments.error" class="px-5 py-8 text-sm text-red-600">{{ assignments.error }}</div>
      <div v-else-if="activeJobs.length === 0" class="flex flex-col items-center px-5 py-12 text-center">
        <CheckCheck :size="28" class="text-violet-600" />
        <div class="mt-3 text-base font-bold text-gray-900">Floor is clear</div>
        <div class="mt-1 text-sm text-gray-500">No live jobs on your presses. New requests land here first.</div>
      </div>

      <div v-else class="overflow-x-auto">
        <table class="w-full min-w-[1020px] text-sm">
          <thead>
            <tr class="border-b border-gray-100 text-left">
              <th class="px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-gray-500">Job / spec</th>
              <th class="px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-gray-500">Sheet plan</th>
              <th class="px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-gray-500">Sheets</th>
              <th class="px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-gray-500">Your payout</th>
              <th class="px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-gray-500">Status / SLA</th>
              <th class="px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-gray-500">Due (ack)</th>
              <th class="px-5 py-3" />
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="job in activeJobs"
              :key="job.id"
              class="border-b border-gray-50 transition-colors hover:bg-gray-50/50"
            >
              <td class="px-5 py-4">
                <div class="font-semibold text-gray-900">{{ jobCode(job) }}</div>
                <div class="max-w-[280px] truncate text-xs text-gray-500">{{ jobSpec(job) }}</div>
                <div class="mt-0.5 flex items-center gap-1 text-[10px] text-gray-400">
                  <User :size="11" /> {{ jobSubline(job) }}
                </div>
              </td>
              <td class="px-5 py-4">
                <div class="font-medium text-gray-900">{{ sheetPlan(job) }}</div>
                <div class="text-[10px] text-gray-400">{{ upsLine(job) }}</div>
              </td>
              <td class="px-5 py-4">
                <div class="font-bold text-gray-900">{{ sheetsBilledLine(job) }}</div>
                <div class="text-[10px] text-gray-400">{{ sheetsDetailLine(job) }}</div>
              </td>
              <td class="px-5 py-4">
                <div class="font-bold text-violet-700">{{ payoutLine(job) }}</div>
                <div class="text-[10px] text-gray-400">your payout only</div>
              </td>
              <td class="px-5 py-4">
                <span class="inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide" :class="stageClass(job)">
                  {{ job.production_stage_label || humanise(job.production_stage) }}
                </span>
                <div class="mt-1 flex items-center gap-1 text-[10px]" :class="isLate(job) ? 'text-red-600' : 'text-gray-500'">
                  <Clock :size="11" /> {{ slaLine(job) }}
                </div>
              </td>
              <td class="px-5 py-4">
                <div class="text-sm font-medium text-gray-900">{{ dueLine(job) }}</div>
                <div class="text-[10px] text-gray-400">{{ dueLabel(job) }}</div>
                <div v-if="revisionCount(job)" class="text-[10px] text-gray-400">revisions {{ revisionCount(job) }}</div>
              </td>
              <td class="px-5 py-4 text-right">
                <button
                  type="button"
                  class="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-violet-700"
                  :aria-label="`Open ${jobCode(job)}`"
                  @click="openDetail(job)"
                >
                  <Eye :size="16" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div id="production" class="grid gap-6 lg:grid-cols-2">
      <div id="machines" class="overflow-hidden rounded-2xl border border-gray-200 bg-white">
        <div class="flex items-center justify-between border-b border-gray-100 px-5 py-4">
          <h2 class="text-base font-bold text-gray-900">Machines</h2>
          <span class="text-[11px] text-gray-400">Live setup status</span>
        </div>

        <div v-if="shop.loading && shop.machines.length === 0" class="px-5 py-6 text-sm text-gray-500">Loading machines…</div>
        <div v-else-if="shop.machines.length === 0" class="px-5 py-8 text-center">
          <div class="text-sm font-semibold text-gray-900">No machines yet</div>
          <div class="mt-1 text-xs text-gray-500">Add your presses so managers can match work to your floor.</div>
          <NuxtLink to="/app/printer/shop" class="mt-3 inline-flex items-center gap-1 text-xs font-bold text-violet-700 hover:text-violet-800">
            Set up machines <ChevronRight :size="13" />
          </NuxtLink>
        </div>
        <div v-else>
          <div v-for="machine in shop.machines" :key="machine.id" class="border-b border-gray-50 px-5 py-4 last:border-b-0">
            <div class="flex items-center gap-3">
              <div class="flex h-9 w-9 items-center justify-center rounded-lg" :class="machine.is_active ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-400'">
                <PrinterIcon :size="16" />
              </div>
              <div class="min-w-0 flex-1">
                <div class="truncate text-sm font-semibold text-gray-900">{{ machine.name || 'Unnamed machine' }}</div>
                <div class="text-xs text-gray-500">{{ humanise(machine.machine_type) }}<span v-if="machineSize(machine)"> · {{ machineSize(machine) }}</span></div>
              </div>
              <span class="rounded-full px-2 py-0.5 text-[10px] font-bold uppercase" :class="machine.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'">
                {{ machine.is_active ? 'active' : 'offline' }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div class="rounded-2xl border border-slate-200 bg-slate-50 p-6">
        <div class="mb-4 flex items-center gap-3">
          <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-200">
            <BarChart3 :size="20" class="text-slate-600" />
          </div>
          <div>
            <h2 class="text-base font-bold text-gray-900">Reliability record</h2>
            <p class="text-xs text-gray-500">Event-driven · no placeholders by law</p>
          </div>
        </div>
        <div class="space-y-2 rounded-xl border border-slate-200 bg-white p-4 text-sm text-gray-600">
          <p>Recording is live: every stage start, handoff, completion and delay against jobs is written to the append-only event log (law 6.3).</p>
          <p class="text-xs text-gray-500">
            Your public on-time score unlocks only after the minimum completed-jobs threshold. Below the threshold the platform shows
            <strong>no score — never a placeholder, never an estimate</strong> (law 6.7). Buyer-caused waiting never counts against you (law 6.4).
          </p>
        </div>
        <div class="mt-4 grid grid-cols-3 gap-2">
          <div v-for="key in reliabilityKeys" :key="key" class="rounded-lg border border-dashed border-slate-300 bg-white/60 p-3 text-center">
            <p class="text-[10px] font-bold uppercase tracking-wide text-slate-400">{{ key }}</p>
            <p class="mt-1 text-[11px] text-slate-500">hidden until threshold</p>
          </div>
        </div>
        <div class="mt-4 flex items-start gap-2 text-[11px] text-gray-500">
          <AlertTriangle :size="14" class="mt-0.5 shrink-0 text-amber-500" />
          {{ completedCount }} completed job{{ completedCount === 1 ? '' : 's' }} recorded. Lateness flags are logged now, but no payout or fee changes apply until a consequence policy is approved (law 6.6).
        </div>
      </div>
    </div>

    <div id="events" class="mt-6 overflow-hidden rounded-2xl border border-gray-200 bg-white">
      <div class="flex items-center gap-3 border-b border-gray-100 px-5 py-4">
        <div class="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-50">
          <FileText :size="16" class="text-violet-600" />
        </div>
        <div>
          <h2 class="text-base font-bold text-gray-900">Job event log</h2>
          <p class="text-[11px] text-gray-500">Append-only — corrections arrive as new events, never edits (law 6.3)</p>
        </div>
      </div>
      <ol v-if="productionEvents.length" class="space-y-3 px-5 py-4">
        <li v-for="event in productionEvents" :key="event.key" class="flex items-center gap-4">
          <CheckCircle2 :size="16" class="shrink-0 text-emerald-500" />
          <div class="flex-1">
            <span class="text-sm font-semibold text-gray-900">{{ event.job }}</span>
            <span class="text-sm text-gray-600"> — {{ event.label }}</span>
            <p class="text-[11px] text-gray-400">{{ event.actor }} · role: {{ event.role }} · <span class="font-mono">{{ event.ts }}</span></p>
          </div>
        </li>
      </ol>
      <div v-else class="px-5 py-8 text-center text-sm text-gray-500">
        No production events recorded yet. Events appear as jobs move through the floor.
      </div>
    </div>

    <Teleport to="body">
      <div v-if="selected" class="fixed inset-0 z-50 flex justify-end bg-gray-900/50" @click.self="closeDetail">
        <aside class="flex h-full w-full max-w-xl flex-col overflow-y-auto bg-white shadow-2xl">
          <div class="sticky top-0 z-10 flex items-start justify-between gap-3 border-b border-gray-100 bg-white px-5 py-4">
            <div>
              <div class="flex items-center gap-2">
                <span class="font-mono text-[11px] font-bold text-gray-400">{{ selected.managed_reference }}</span>
                <span class="rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide" :class="stageClass(selected)">
                  {{ selected.production_stage_label || humanise(selected.production_stage) }}
                </span>
              </div>
              <h2 class="mt-1 text-lg font-extrabold tracking-tight text-gray-900">{{ jobCode(selected) }}</h2>
              <p class="mt-0.5 text-xs text-gray-500">{{ jobSpec(selected) }}</p>
            </div>
            <button type="button" class="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-700" aria-label="Close" @click="closeDetail">
              <X :size="18" />
            </button>
          </div>

          <div class="space-y-5 p-5">
            <div class="grid gap-3 sm:grid-cols-2">
              <div class="rounded-xl bg-gray-50 p-3">
                <div class="text-[10px] font-bold uppercase tracking-wide text-gray-400">Sheet plan</div>
                <div class="mt-1 text-sm font-semibold text-gray-900">{{ sheetPlan(selected) }}</div>
                <div class="text-[11px] text-gray-500">{{ upsLine(selected) }}</div>
              </div>
              <div class="rounded-xl bg-gray-50 p-3">
                <div class="text-[10px] font-bold uppercase tracking-wide text-gray-400">Sheets</div>
                <div class="mt-1 text-sm font-semibold text-gray-900">{{ sheetsBilledLine(selected) }}</div>
                <div class="text-[11px] text-gray-500">{{ sheetsDetailLine(selected) }}</div>
              </div>
              <div class="rounded-xl bg-violet-50 p-3">
                <div class="text-[10px] font-bold uppercase tracking-wide text-violet-500">Your payout</div>
                <div class="mt-1 text-sm font-extrabold text-violet-700">{{ payoutLine(selected) }}</div>
                <div class="text-[11px] text-violet-600">{{ selected.payout_status_label || 'your payout only' }}</div>
              </div>
              <div class="rounded-xl bg-gray-50 p-3">
                <div class="text-[10px] font-bold uppercase tracking-wide text-gray-400">Due (ack)</div>
                <div class="mt-1 text-sm font-semibold text-gray-900">{{ dueLine(selected) }}</div>
                <div class="text-[11px] text-gray-500">{{ dueLabel(selected) }}</div>
              </div>
              <div class="rounded-xl bg-gray-50 p-3">
                <div class="text-[10px] font-bold uppercase tracking-wide text-gray-400">Quantity</div>
                <div class="mt-1 text-sm font-semibold text-gray-900">{{ quantityLine(selected) }}</div>
              </div>
              <div class="rounded-xl bg-gray-50 p-3">
                <div class="text-[10px] font-bold uppercase tracking-wide text-gray-400">Method</div>
                <div class="mt-1 text-sm font-semibold text-gray-900">{{ methodLine(selected) }}</div>
                <div class="text-[11px]" :class="isLate(selected) ? 'text-red-600' : 'text-gray-500'">{{ slaLine(selected) }}</div>
              </div>
            </div>

            <div v-if="selected.timeline">
              <h3 class="mb-2 text-xs font-bold uppercase tracking-wide text-gray-500">Stage timeline</h3>
              <div class="rounded-xl border border-gray-200 p-4">
                <StageTimeline :timeline="selected.timeline" />
              </div>
            </div>

            <div v-if="selected.production_timeline_steps.length">
              <h3 class="mb-2 text-xs font-bold uppercase tracking-wide text-gray-500">Progress</h3>
              <div class="flex flex-wrap gap-1.5">
                <span
                  v-for="step in selected.production_timeline_steps"
                  :key="step.key"
                  class="rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide"
                  :class="stepClass(step.state)"
                >
                  {{ step.label }}
                </span>
              </div>
            </div>

            <div v-if="notice" class="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700">
              {{ notice }}
            </div>
            <div v-if="error" class="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-700">
              {{ error }}
            </div>

            <div v-if="needsPrinterAck(selected)" class="rounded-xl border border-amber-200 bg-amber-50 p-4">
              <div class="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wide text-amber-700">
                <AlertTriangle :size="12" /> Artwork acknowledgement required
              </div>
              <p class="mt-1 text-xs leading-relaxed text-amber-800">
                Confirm you hold the artwork before production can start (law 7.2).
              </p>
              <button
                type="button"
                class="mt-3 inline-flex items-center gap-2 rounded-xl bg-amber-600 px-3 py-2 text-[10px] font-bold uppercase tracking-wide text-white disabled:opacity-50"
                :disabled="acknowledging"
                @click="acknowledgeArtwork(selected)"
              >
                <Loader2 v-if="acknowledging" :size="11" class="animate-spin" />
                <CheckCheck v-else :size="11" /> I acknowledge I hold the artwork
              </button>
            </div>

            <div v-if="noteMode" class="rounded-xl border border-gray-200 p-4">
              <label class="text-[10px] font-bold uppercase tracking-wide text-gray-500">
                {{ noteMode === 'reject' ? 'Reason for declining' : 'Describe the issue' }}
              </label>
              <textarea v-model="note" rows="3" class="mt-2 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-violet-400" />
              <div class="mt-2 flex items-center gap-2">
                <button
                  type="button"
                  class="rounded-xl bg-violet-600 px-4 py-2 text-xs font-bold text-white disabled:opacity-50"
                  :disabled="!note.trim() || assignments.actingId === selected.id"
                  @click="submitNote(selected)"
                >
                  {{ noteMode === 'reject' ? 'Decline job' : 'Report issue' }}
                </button>
                <button type="button" class="text-xs font-semibold text-gray-500" @click="cancelNote">Cancel</button>
              </div>
            </div>

            <div class="border-t border-gray-100 pt-4">
              <h3 class="mb-2 text-xs font-bold uppercase tracking-wide text-gray-500">Actions</h3>
              <div class="flex flex-wrap gap-2">
                <button
                  v-for="action in selected.next_allowed_actions"
                  :key="action"
                  type="button"
                  class="inline-flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-[11px] font-bold uppercase tracking-wide disabled:opacity-50"
                  :class="action === 'reject' ? 'border border-gray-200 text-red-600' : action === 'accept' || action === 'upload_proof' ? 'bg-violet-600 text-white' : 'border border-gray-200 text-gray-700'"
                  :disabled="assignments.actingId === selected.id"
                  @click="chooseAction(selected, action)"
                >
                  <Loader2 v-if="assignments.actingId === selected.id" :size="12" class="animate-spin" />
                  <component :is="actionIcon(action)" v-else :size="12" />
                  {{ actionLabel(action) }}
                </button>
                <button
                  type="button"
                  class="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 px-4 py-2.5 text-[11px] font-bold uppercase tracking-wide text-gray-500"
                  @click="startNote('issue')"
                >
                  <AlertTriangle :size="12" /> Report issue
                </button>
              </div>
              <input ref="proofInput" type="file" class="hidden" @change="onProofChange(selected, $event)">
            </div>
          </div>
        </aside>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import {
  AlertTriangle, BarChart3, CheckCheck, CheckCircle2, ChevronRight, Clock, Coins,
  Eye, FileText, Loader2, Lock, Play, Printer as PrinterIcon, Upload, User, X,
} from 'lucide-vue-next'
import StageTimeline from '~/components/workbench/StageTimeline.vue'
import { useAssignmentsStore, ASSIGNMENT_ACTION_LABELS } from '~/stores/assignments'
import { useAuthStore } from '~/stores/auth'
import { useShopStore } from '~/stores/shop'
import { useApi } from '~/composables/useApi'
import { API } from '~/shared/api-paths'
import { formatKSh } from '~/utils/money'
import type {
  AssignmentAction, CanonicalJobResult, CanonicalLayout, CanonicalMethod, CanonicalSpoilage,
  JobAssignment, JobTiming, ShopMachineRecord,
} from '~/shared/types'

interface SetupStatusSummary {
  is_confirmed: boolean
  completed_steps: number
  total_steps: number
}

interface ProductionEvent {
  key: string
  job: string
  label: string
  actor: string
  role: string
  ts: string
  sort: string
}

const assignments = useAssignmentsStore()
const auth = useAuthStore()
const shop = useShopStore()
const { api } = useApi()

const rateCardStatus = ref<SetupStatusSummary | null>(null)
const selectedId = ref<number | null>(null)
const noteMode = ref<'reject' | 'issue' | null>(null)
const note = ref('')
const notice = ref('')
const error = ref('')
const acknowledging = ref(false)
const proofInput = ref<HTMLInputElement | null>(null)

const visibleFields = [
  'spec summary', 'due date', 'press sheet & layout', 'ups', 'good sheets',
  'spoilage', 'sheets billed', 'machine / method', 'your payout',
]
const hiddenFields = ['buyer total / per-piece', 'manager margin', 'fee tier', 'cost breakdown beyond payout']
const reliabilityKeys = ['On-time rate', 'Avg slip', 'Revisions']

const operatorName = computed(() => auth.user?.name?.trim() || 'Shop operator')
const shopName = computed(() =>
  shop.active?.name?.trim()
    || auth.user?.shop_name?.trim()
    || `${operatorName.value.split(' ')[0]} Press`,
)
const activeJobs = computed(() => assignments.active)
const selected = computed(() => assignments.items.find((item) => item.id === selectedId.value) ?? null)
const completedCount = computed(() => assignments.items.filter((item) => {
  const stage = String(item.production_stage || '').toLowerCase()
  return item.status === 'completed' || stage === 'completed' || stage === 'delivered'
}).length)

const productionEvents = computed<ProductionEvent[]>(() => {
  const events: ProductionEvent[] = []
  for (const job of assignments.items) {
    const stages = job.timeline?.stages ?? []
    if (stages.length) {
      for (const stage of stages) {
        if (!stage.completed_at) continue
        events.push({
          key: `${job.id}-${stage.key}`,
          job: jobCode(job),
          label: `${stage.label.toLowerCase()} completed`,
          actor: eventActor(stage.owner),
          role: stage.owner || 'system',
          ts: formatEventTime(stage.completed_at),
          sort: stage.completed_at,
        })
      }
    } else if (job.accepted_at) {
      events.push({
        key: `${job.id}-accepted`,
        job: jobCode(job),
        label: 'assignment accepted',
        actor: shopName.value,
        role: 'printer',
        ts: formatEventTime(job.accepted_at),
        sort: job.accepted_at,
      })
    }
  }
  return events.sort((a, b) => b.sort.localeCompare(a.sort)).slice(0, 8)
})

onMounted(async () => {
  void assignments.fetch()
  try {
    const payload = await api<{ setup_status?: SetupStatusSummary }>(API.rateCard.setup)
    rateCardStatus.value = payload?.setup_status ?? null
  } catch {
    rateCardStatus.value = null
  }
  if (shop.shops.length === 0) await shop.fetchShops()
  if (shop.identifier) await shop.fetchMachines()
})

function num(value: unknown): number | null {
  if (value === null || value === undefined || value === '') return null
  const numeric = Number(value)
  return Number.isFinite(numeric) ? numeric : null
}

function money(value: unknown): string {
  if (value === null || value === undefined || value === '') return '—'
  const numeric = num(value)
  return numeric === null ? String(value) : formatKSh(numeric, 2)
}

function humanise(value: unknown): string {
  const cleaned = String(value ?? '').replace(/_/g, ' ').trim()
  return cleaned ? cleaned.replace(/\b\w/g, (char) => char.toUpperCase()) : '—'
}

function jobCode(job: JobAssignment): string {
  return job.code || job.managed_reference || job.job_reference || job.assignment_reference
}

function specLabel(spec: Record<string, unknown> | null | undefined): string {
  if (!spec) return ''
  const order = ['product_type', 'size_label', 'paper', 'print_sides', 'color_mode', 'finishing']
  return order
    .map((key) => spec[key])
    .filter((value) => value !== null && value !== undefined && value !== '')
    .map((value) => humanise(value))
    .join(' · ')
}

function jobSpec(job: JobAssignment): string {
  return specLabel(job.canonical?.spec_summary) || job.job_reference || job.managed_reference
}

function methodLabel(method: CanonicalMethod | null | undefined): string {
  if (!method) return ''
  return [method.machine_name, method.color_mode, method.sides]
    .filter((value) => value !== null && value !== undefined && value !== '')
    .map((value) => humanise(value))
    .join(' · ') || (method.material_label ? humanise(method.material_label) : '')
}

function methodLine(job: JobAssignment): string {
  return methodLabel(job.canonical?.method) || humanise(job.canonical?.method?.pricing_mode) || '—'
}

function quantityLine(job: JobAssignment): string {
  const quantity = num(job.canonical?.quantity)
  return quantity === null ? '—' : `${new Intl.NumberFormat('en-KE').format(quantity)} pcs`
}

function jobSubline(job: JobAssignment): string {
  const parts = [job.managed_reference, quantityLine(job), methodLine(job)]
    .filter((part) => part && part !== '—')
  return parts.join(' · ') || job.assignment_reference
}

function layoutLabel(layout: CanonicalLayout | null | undefined): string {
  if (!layout) return ''
  const dims = layout.cols && layout.rows ? `${layout.cols} × ${layout.rows}` : ''
  const orientation = layout.orientation ? humanise(layout.orientation).toLowerCase() : ''
  return [dims, orientation].filter(Boolean).join(' · ')
}

function sheetPlan(job: JobAssignment): string {
  const canonical = job.canonical
  if (!canonical) return '—'
  const ups = num(canonical.ups)
  return [
    canonical.press_sheet,
    ups === null ? layoutLabel(canonical.layout) : `${ups}-up`,
  ].filter(Boolean).join(' · ') || '—'
}

function upsLine(job: JobAssignment): string {
  const ups = num(job.canonical?.ups)
  return ups === null ? 'Ups not provided' : `${ups} ups per sheet`
}

function sheetsBilledLine(job: JobAssignment): string {
  const billed = num(job.canonical?.sheets_billed)
  return billed === null ? '—' : `${billed} billed`
}

function spoilageText(spoilage: CanonicalSpoilage | null | undefined): string {
  if (!spoilage) return ''
  const rawRate = num(spoilage.variable_waste_rate)
  const rate = rawRate === null ? null : rawRate <= 1 ? rawRate * 100 : rawRate
  const added = num(spoilage.waste_sheets_added) ?? num(spoilage.variable_waste_sheets)
  const capped = spoilage.spoilage_capped ? ' · capped' : ''
  if (rate !== null) return `${Number(rate.toFixed(2))}% spoil${capped}`
  if (added !== null) return `${added} spoil${capped}`
  return capped ? 'capped' : ''
}

function sheetsDetailLine(job: JobAssignment): string {
  const canonical = job.canonical
  if (!canonical) return 'Sheet counts not exposed'
  const good = num(canonical.good_sheets)
  const spoil = spoilageText(canonical.spoilage)
  const parts = [
    good === null ? '' : `${good} good`,
    spoil,
  ].filter(Boolean)
  return parts.join(' · ') || 'Sheet counts not exposed'
}

function payoutLine(job: JobAssignment): string {
  return money(job.canonical?.printer_payout ?? job.payout_amount)
}

function stageKey(job: JobAssignment): string {
  return String(job.production_stage || job.status || '').toLowerCase()
}

function stageClass(job: JobAssignment): string {
  const stage = stageKey(job)
  if (stage === 'printing' || stage === 'in_production') return 'bg-violet-100 text-violet-700'
  if (stage === 'prepress') return 'bg-purple-100 text-purple-700'
  if (stage === 'finishing') return 'bg-amber-100 text-amber-700'
  if (stage === 'ready' || stage === 'completed' || stage === 'delivered') return 'bg-green-100 text-green-700'
  return 'bg-gray-100 text-gray-700'
}

function stepClass(state: string): string {
  if (state === 'completed') return 'bg-green-100 text-green-700'
  if (state === 'current') return 'bg-violet-600 text-white'
  return 'bg-gray-100 text-gray-500'
}

function timing(job: JobAssignment): JobTiming | null {
  return job.timing ?? null
}

function isLate(job: JobAssignment): boolean {
  return Boolean(timing(job)?.is_late)
}

function slaLine(job: JobAssignment): string {
  const value = timing(job)
  if (!value) return 'No SLA published'
  const minutes = value.time_remaining_minutes
  if (minutes === null || minutes === undefined) {
    const hours = num(value.stage_sla_hours)
    return hours === null ? 'No SLA published' : `${hours}h stage SLA`
  }
  if (minutes <= 0) {
    return value.is_late ? `Overdue by ${duration(Math.abs(minutes))}` : 'Due now'
  }
  return `${duration(minutes)} left (working hrs)`
}

function duration(minutes: number): string {
  if (minutes < 60) return `${Math.max(1, Math.round(minutes))}m`
  const hours = Math.floor(minutes / 60)
  const rest = Math.round(minutes % 60)
  return rest ? `${hours}h ${rest}m` : `${hours}h`
}

function dueValue(job: JobAssignment): string | null {
  return timing(job)?.due_date
    || job.canonical?.ready_date
    || job.due_at
    || job.requested_deadline
    || null
}

function dueLine(job: JobAssignment): string {
  const value = dueValue(job)
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleString('en-KE', {
    weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
    timeZone: 'Africa/Nairobi', timeZoneName: 'short',
  })
}

function dueLabel(job: JobAssignment): string {
  if (timing(job)?.due_date_acknowledged_at) return 'buyer-acknowledged'
  if (job.due_at || job.requested_deadline) return 'requested due date'
  return 'due date'
}

function revisionCount(job: JobAssignment): number | null {
  const count = num(timing(job)?.revision_count)
  return count && count > 0 ? count : null
}

function eventActor(owner: string | null | undefined): string {
  if (owner === 'printer') return shopName.value
  if (owner === 'manager') return 'Print manager'
  if (owner === 'buyer') return 'Buyer'
  return humanise(owner)
}

function formatEventTime(value: string): string {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleString('en-KE', {
    day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
  })
}

function machineSize(machine: ShopMachineRecord): string {
  if (machine.max_width_mm && machine.max_height_mm) {
    return `${machine.max_width_mm} × ${machine.max_height_mm} mm`
  }
  return ''
}

function openDetail(job: JobAssignment) {
  selectedId.value = job.id
  noteMode.value = null
  note.value = ''
  notice.value = ''
  error.value = ''
}

function closeDetail() {
  selectedId.value = null
  noteMode.value = null
  note.value = ''
  notice.value = ''
  error.value = ''
}

function actionLabel(action: AssignmentAction): string {
  return ASSIGNMENT_ACTION_LABELS[action] ?? action
}

function actionIcon(action: AssignmentAction) {
  if (action === 'accept') return CheckCheck
  if (action === 'reject') return X
  if (action === 'upload_proof') return Upload
  return Play
}

function needsPrinterAck(job: JobAssignment): boolean {
  const stage = stageKey(job)
  if (['ready', 'completed', 'delivered'].includes(stage)) return false
  return job.artwork_available
}

function chooseAction(job: JobAssignment, action: AssignmentAction) {
  error.value = ''
  notice.value = ''
  if (action === 'upload_proof') {
    proofInput.value?.click()
    return
  }
  if (action === 'reject') {
    startNote('reject')
    return
  }
  void perform(job, action)
}

async function perform(job: JobAssignment, action: Exclude<AssignmentAction, 'upload_proof'>) {
  try {
    await assignments.perform(job, action)
    notice.value = `${actionLabel(action)} — done.`
  } catch {
    error.value = 'That update could not be applied.'
  }
}

function startNote(mode: 'reject' | 'issue') {
  notice.value = ''
  error.value = ''
  noteMode.value = mode
  note.value = ''
}

function cancelNote() {
  noteMode.value = null
  note.value = ''
}

async function submitNote(job: JobAssignment) {
  const text = note.value.trim()
  if (!text) return
  error.value = ''
  try {
    if (noteMode.value === 'reject') {
      await assignments.perform(job, 'reject', text)
      notice.value = 'Job declined.'
    } else {
      await assignments.reportIssue(job, text)
      notice.value = 'Issue reported — your partner has been notified.'
    }
    cancelNote()
  } catch {
    error.value = 'That update could not be applied.'
  }
}

async function onProofChange(job: JobAssignment, event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return
  error.value = ''
  try {
    await assignments.uploadProof(job, file)
    notice.value = 'Proof uploaded.'
  } catch {
    error.value = 'The proof could not be uploaded.'
  } finally {
    input.value = ''
  }
}

async function acknowledgeArtwork(job: JobAssignment) {
  acknowledging.value = true
  error.value = ''
  try {
    await api(API.managedJobs.artworkWorkflow(job.managed_job), {
      method: 'POST',
      body: { action: 'printer_acknowledge' },
    })
    notice.value = 'Printer acknowledged artwork — production can proceed.'
    await assignments.fetch()
  } catch {
    error.value = 'The acknowledgement could not be recorded.'
  } finally {
    acknowledging.value = false
  }
}
</script>
