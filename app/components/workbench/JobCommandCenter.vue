<template>
  <template v-if="job">
    <div class="fixed inset-0 z-50 flex justify-end">
      <div class="absolute inset-0 bg-black/55 backdrop-blur-[6px]" @click="onClose" />
      <aside
        class="relative flex h-full w-full max-w-[600px] flex-col border-l shadow-2xl"
        :style="{ background: 'var(--bg)', borderColor: 'var(--line)' }"
      >
        <div class="flex items-start justify-between gap-3 border-b p-5" :style="{ borderColor: 'var(--line)' }">
          <div class="min-w-0">
            <div class="flex flex-wrap items-center gap-2">
              <span class="font-mono2 text-[11px] font-semibold tracking-[0.14em] text-[var(--accent)]">{{ job.code }}</span>
              <StatusPill :status="job.status" size="sm" />
              <span
                class="inline-flex items-center gap-1 rounded-full px-2 py-[3px] font-mono2 text-[9px] uppercase tracking-[0.14em] text-[var(--sub)]"
                :style="{ boxShadow: 'inset 0 0 0 1px var(--line)' }"
              >
                <Lock :size="9" /> {{ job.custody === 'held' ? `held ${money(job.value)}` : job.custody === 'released' ? 'paid out' : 'unpaid' }}
              </span>
            </div>
            <h2 class="mt-1.5 font-disp text-[21px] font-bold leading-tight tracking-tight text-[var(--ink)]">{{ job.title }}</h2>
            <div class="mt-1 font-mono2 text-[10px] uppercase tracking-[0.14em] text-[var(--sub)]">
              {{ job.qty.toLocaleString() }} units · {{ money(job.value) }} · placed {{ job.placedAt }}
            </div>
          </div>
          <button class="rounded-full p-2 transition-colors hover:bg-[var(--panel2)]" :style="{ color: 'var(--sub)' }" @click="onClose">
            <X :size="18" />
          </button>
        </div>

        <div class="flex-1 overflow-y-auto p-5 pb-36">
          <FiveW :job="job" />

          <div v-if="job.dispute" class="mt-4 overflow-hidden rounded-2xl border" :style="{ borderColor: 'rgba(251,77,109,.4)' }">
            <div class="hazard h-1.5" />
            <div class="bg-[rgba(251,77,109,.07)] p-4">
              <div class="flex items-center gap-2 font-mono2 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#FB4D6D]">
                <Flag :size="12" /> {{ job.dispute.resolved ? 'Dispute resolved' : 'Open dispute' }} · {{ money(job.dispute.amount) }} frozen
              </div>
              <p class="mt-1.5 text-[13px] leading-snug text-[var(--ink)]">{{ job.dispute.reason }}</p>
              <div class="mt-1 font-mono2 text-[9.5px] uppercase tracking-[0.12em] text-[var(--sub)]">
                Opened by {{ job.dispute.openedBy }} · {{ job.dispute.at }}
              </div>
            </div>
          </div>

          <div v-if="role === 'buyer'" class="mt-4 rounded-2xl border p-4" :style="{ borderColor: 'var(--line)', background: 'var(--panel)' }">
            <div class="flex items-center gap-2 font-disp text-[14px] font-semibold text-[var(--ink)]">
              <ShieldCheck :size="16" :style="{ color: 'var(--accent)' }" />
              Your money is safe
            </div>
            <p class="mt-1.5 text-[13px] leading-relaxed text-[var(--sub)]">
              {{ job.custody === 'held' ? `${money(job.value)} is held in Printy Custody. It's only released to the printer after you confirm delivery — never before.` : job.custody === 'awaiting' ? "You haven't been charged. Payment is only due once you're happy with the proof." : 'Payment was released to the printer after you confirmed delivery.' }}
            </p>
          </div>

          <div v-if="role === 'buyer'" class="mt-5 rounded-2xl border p-4" :style="{ borderColor: 'var(--line)', background: 'var(--panel)' }">
            <div class="flex items-center">
              <div v-for="(s, i) in steps" :key="s" class="flex flex-1 items-center last:flex-none">
                <div class="flex flex-col items-center gap-1.5">
                  <div
                    class="flex h-5 w-5 items-center justify-center rounded-full transition-all duration-500"
                    :style="{
                      background: i < buyerStepMap ? 'var(--accent)' : 'transparent',
                      boxShadow: i === buyerStepMap ? 'inset 0 0 0 2px var(--accent)' : i < buyerStepMap ? 'none' : 'inset 0 0 0 2px var(--line)',
                    }"
                  >
                    <CheckCheck v-if="i < buyerStepMap" :size="10" :style="{ color: 'var(--accentInk)' }" />
                    <span v-else-if="i === buyerStepMap" class="ball-ping h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
                  </div>
                  <span class="font-mono2 text-[8px] uppercase tracking-[0.1em]" :style="{ color: i <= buyerStepMap ? 'var(--ink)' : 'var(--sub)' }">{{ s }}</span>
                </div>
                <div v-if="i < steps.length - 1" class="mx-1 mb-4 h-[2px] flex-1 rounded" :style="{ background: i < buyerStepMap ? 'var(--accent)' : 'var(--line)' }" />
              </div>
            </div>
          </div>

          <div v-if="role !== 'buyer'" class="mt-4 rounded-2xl border p-4" :style="{ borderColor: `${statusColor}55`, background: 'var(--panel)' }">
            <ML>Who has the ball</ML>
            <div class="mt-3 flex items-center gap-3.5">
              <SlaRing :job="job" :size="58" />
              <div class="min-w-0 flex-1">
                <div class="font-disp text-[15.5px] font-semibold leading-tight text-[var(--ink)]">{{ job.owner.name }}</div>
                <div class="font-mono2 text-[9.5px] uppercase tracking-[0.18em]" :style="{ color: statusColor }">
                  {{ job.owner.role }} · holding {{ job.owner.waitingHrs }}h / {{ job.owner.slaHrs }}h SLA
                </div>
                <div class="mt-1 text-[12.5px] leading-snug text-[var(--sub)]">Next action: {{ job.owner.action }}</div>
              </div>
            </div>
          </div>

          <div v-if="job.proofImg" class="mt-4 overflow-hidden rounded-2xl border" :style="{ borderColor: 'var(--line)' }">
            <img :src="job.proofImg" :alt="`${job.title} proof`" class="h-44 w-full object-cover" />
            <div class="flex items-center justify-between px-3.5 py-2.5" :style="{ background: 'var(--panel)' }">
              <span class="font-mono2 text-[9.5px] uppercase tracking-[0.16em] text-[var(--sub)]">Artwork proof · final</span>
              <span class="font-mono2 text-[9.5px] uppercase tracking-[0.16em]" :style="{ color: 'var(--accent)' }">{{ job.specs.colors }}</span>
            </div>
          </div>

          <div class="mt-5">
            <ML>Specification</ML>
            <div class="mt-2 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border sm:grid-cols-4" :style="{ borderColor: 'var(--line)', background: 'var(--line)' }">
              <div v-for="[k, v] in specRows" :key="k" class="bg-[var(--panel)] p-3">
                <div class="font-mono2 text-[8.5px] uppercase tracking-[0.18em] text-[var(--sub)]">{{ k }}</div>
                <div class="mt-1 text-[12px] font-medium leading-snug text-[var(--ink)]">{{ v }}</div>
              </div>
            </div>
          </div>

          <div v-if="role !== 'buyer' && manager" class="mt-5 grid grid-cols-2 gap-2.5">
            <div class="rounded-2xl border p-3.5" :style="{ borderColor: 'var(--line)', background: 'var(--panel)' }">
              <ML>Print manager</ML>
              <div class="mt-2 flex items-center gap-2.5">
                <Avatar :initials="manager.initials" :hue="manager.hue" :size="30" />
                <div class="min-w-0">
                  <div class="truncate font-disp text-[13px] font-semibold text-[var(--ink)]">{{ manager.name }}</div>
                  <div class="font-mono2 text-[9px] uppercase tracking-[0.12em] text-[var(--sub)]">{{ manager.onTime }}% on-time</div>
                </div>
              </div>
            </div>
            <div class="rounded-2xl border p-3.5" :style="{ borderColor: 'var(--line)', background: 'var(--panel)' }">
              <ML>Printer</ML>
              <div class="mt-2 flex items-center gap-2.5">
                <template v-if="printer">
                  <Avatar :initials="printer.initials" :hue="printer.hue" :size="30" />
                  <div class="min-w-0">
                    <div class="flex items-center gap-1 truncate font-disp text-[13px] font-semibold text-[var(--ink)]">
                      {{ printer.name }}
                      <BadgeCheck v-if="printer.verified" :size="12" :style="{ color: 'var(--accent)' }" />
                    </div>
                    <div class="font-mono2 text-[9px] uppercase tracking-[0.12em] text-[var(--sub)]">{{ printer.city }}</div>
                  </div>
                </template>
                <div v-else class="text-[12px] text-[var(--sub)]">Awaiting assignment</div>
              </div>
            </div>
          </div>

          <div class="mt-6">
            <div class="flex items-baseline justify-between">
              <ML>What happened · what happens next</ML>
              <span class="font-mono2 text-[9.5px] uppercase tracking-[0.14em]" :style="{ color: statusColor }">
                ETA {{ job.eta }}
              </span>
            </div>
            <div class="mt-3 rounded-2xl border p-4" :style="{ borderColor: 'var(--line)', background: 'var(--panel)' }">
              <JobTimeline :job="job" :compact="role === 'buyer'" />
            </div>
          </div>

          <div v-if="nx && role !== 'buyer'" class="mt-4 flex items-center gap-3 rounded-2xl border p-3.5" :style="{ borderColor: 'var(--line)' }">
            <Truck :size="15" class="text-[var(--sub)]" />
            <span class="text-[12.5px] text-[var(--sub)]">
              Next: <span class="font-semibold text-[var(--ink)]">{{ nx.label }}</span> — {{ nx.ownerRole }} takes the ball · SLA {{ nx.sla }}h
            </span>
          </div>

          <PrinterPicker v-if="pickerOpen && needsAssign" :job="job" @done="pickerOpen = false" />
        </div>

        <div class="absolute inset-x-0 bottom-0 border-t p-4" :style="{ borderColor: 'var(--line)', background: 'var(--bg)', backdropFilter: 'blur(10px)' }">
          <div v-if="role === 'buyer' && isAvas" class="flex flex-col gap-2">
            <template v-if="job.stage === 'approval'">
              <ML className="!text-[var(--accent)]">Your action — approve artwork</ML>
              <div class="flex gap-2">
                <ActionBtn variant="ghost" className="flex-1" @click="w.act('review-proof', job)"><Eye :size="13" /> Review proof</ActionBtn>
                <ActionBtn variant="ghost" @click="w.act('request-changes', job)"><PencilRuler :size="13" /> Changes</ActionBtn>
                <ActionBtn className="flex-1" @click="w.act('approve', job)"><CheckCheck :size="13" /> Approve</ActionBtn>
              </div>
            </template>
            <template v-else-if="job.stage === 'payment'">
              <ML className="!text-[#B45309]">Payment required</ML>
              <ActionBtn @click="w.act('pay', job)"><CreditCard :size="13" /> Pay {{ money(job.value) }} — held in custody</ActionBtn>
            </template>
            <template v-else-if="job.stage === 'delivery'">
              <ActionBtn @click="w.act('confirm-delivery', job)"><PackageCheck :size="13" /> Confirm delivery & release funds</ActionBtn>
            </template>
            <div v-else class="flex items-center gap-2 text-[13px] text-[var(--sub)]">
              <ShieldCheck :size="14" :style="{ color: 'var(--accent)' }" />
              {{ job.stage === 'completed' ? 'Nothing needed from you — this order is complete.' : `Nothing needed from you — ${job.owner.name} is on it. We'll nudge you when it's your turn.` }}
            </div>
          </div>

          <div v-if="role === 'manager' && job.status !== 'completed'" class="flex flex-col gap-2">
            <ActionBtn v-if="needsAssign && !pickerOpen" @click="pickerOpen = true"><ArrowRight :size="13" /> Assign a printer</ActionBtn>
            <ActionBtn v-if="job.status === 'disputed' && !job.dispute?.resolved" variant="danger" @click="w.act('resolve-dispute', job)"><Flag :size="13" /> Resolve dispute — approve reprint</ActionBtn>
            <ActionBtn variant="ghost" @click="w.act('nudge', job)"><BellRing :size="13" /> Nudge {{ ownerFirstName }}</ActionBtn>
          </div>

          <div v-if="role === 'printer'">
            <ActionBtn v-if="label && printerMine" className="w-full !py-3.5 !text-[13px]" @click="w.act('press-advance', job)">{{ label }}</ActionBtn>
            <div v-else class="text-[12.5px] text-[var(--sub)]">
              {{ printerMine ? 'No press action available at this stage.' : 'This job belongs to another print shop.' }}
            </div>
          </div>

          <div v-if="role === 'admin'" class="flex items-center gap-2">
            <div class="mr-auto flex items-center gap-2 font-mono2 text-[10px] uppercase tracking-[0.14em] text-[var(--sub)]">
              <Wallet :size="13" />
              {{ job.custody === 'held' ? `${money(job.value)} in custody` : job.custody === 'released' ? `${money(job.value)} released` : 'not yet paid' }}
            </div>
            <ActionBtn v-if="job.status === 'disputed' && !job.dispute?.resolved" variant="danger" @click="w.act('resolve-dispute', job)"><Flag :size="12" /> Resolve</ActionBtn>
            <ActionBtn v-if="job.status !== 'completed'" variant="ghost" @click="w.act('nudge', job)"><BellRing :size="12" /> Nudge owner</ActionBtn>
          </div>
        </div>
      </aside>
    </div>
  </template>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import {
  ArrowRight, BadgeCheck, BellRing, CheckCheck, CreditCard, Eye, Flag, Lock,
  PackageCheck, PencilRuler, ShieldCheck, Truck, Wallet, X,
} from 'lucide-vue-next'
import {
  SESSION_PRINTER_ID, STATUS_META, mgr, money, nextStage, pressLabel, prn, stIdx,
} from '~/shared/workflow/printy'
import { useWorkflowStore } from '~/stores/workflow'

const w = useWorkflowStore()

const job = computed(() => w.jobs.find((j) => j.id === w.selectedId) ?? null)
const role = computed(() => w.role)

const onClose = () => {
  w.selectedId = null
}

const pickerOpen = ref(false)

const statusColor = computed(() => (job.value ? STATUS_META[job.value.status].color : ''))
const nx = computed(() => (job.value ? nextStage(job.value) : null))
const printer = computed(() => (job.value ? prn(job.value.printerId) : null))
const manager = computed(() => (job.value ? mgr(job.value.managerId) : null))
const isAvas = computed(() => job.value?.buyerId === 'b-ava')
const ownerFirstName = computed(() => {
  if (!job.value) return ''
  return (job.value.owner.name.split('·')[0] ?? job.value.owner.name).trim()
})
const label = computed(() => (job.value ? pressLabel(job.value) : null))
const printerMine = computed(() => job.value?.printerId === SESSION_PRINTER_ID)
const needsAssign = computed(() => job.value?.stage === 'production' && !job.value.printerId)

const steps = ['Placed', 'Artwork', 'Approval', 'Payment', 'In production', 'Delivered']
const buyerStepMap = computed(() => {
  const j = job.value
  if (!j) return 0
  const idx = stIdx(j.stage)
  return idx === 0 ? 0 : idx === 1 ? 1 : idx === 2 ? 2 : idx === 3 ? 3 : idx < 9 ? 4 : 5
})
const specRows = computed(() => {
  const j = job.value
  if (!j) return [] as string[][]
  return [
    ['Material', j.specs.material],
    ['Colour', j.specs.colors],
    ['Finishing', j.specs.finish],
    ['Size', j.specs.size],
  ]
})
</script>