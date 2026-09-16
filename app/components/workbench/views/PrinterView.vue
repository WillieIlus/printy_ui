<template>
  <div class="mx-auto w-full max-w-[820px] px-4 pb-28 pt-6 sm:pt-8">
    <div class="flex items-center justify-between rounded-2xl border px-5 py-3" :style="{ borderColor: 'var(--line)', background: 'var(--panel)' }">
      <div>
        <div class="font-disp text-[19px] font-bold tracking-tight sm:text-[22px]">North Press Co.</div>
        <div class="font-mono2 text-[9.5px] uppercase tracking-[0.2em] text-[var(--sub)]">Press floor · shift B · Jon Weber</div>
      </div>
      <div class="text-right">
        <div class="font-disp text-[19px] font-bold" :style="{ color: 'var(--accent)' }">{{ mine.length }}</div>
        <div class="font-mono2 text-[8.5px] uppercase tracking-[0.18em] text-[var(--sub)]">jobs live</div>
      </div>
    </div>

      <div class="space-y-4 pt-6">
        <section v-if="current" :key="current.id + current.stage + (current.press ?? '')" class="overflow-hidden rounded-[1.6rem] border" :style="{ borderColor: 'var(--line)', background: 'var(--panel)' }">
          <div class="px-5 pt-5">
            <div class="flex items-center justify-between">
              <ML class="!text-[var(--accent)]">{{ headline }}</ML>
              <span class="rounded-full px-2 py-[3px] font-mono2 text-[9px] uppercase tracking-[0.14em]" :style="{ background: (curMeta?.color ?? '') + '22', color: curMeta?.color ?? '' }">
                {{ curStageLabel }}
              </span>
            </div>
            <h2 class="mt-2 font-disp text-[24px] font-bold leading-[1.08] tracking-tight sm:text-[28px]">{{ current.title }}</h2>
            <div class="mt-1 font-mono2 text-[10px] uppercase tracking-[0.16em] text-[var(--sub)]">
              {{ current.code }} · {{ money(current.value) }} · for {{ current.buyerCompany }}
            </div>
          </div>

          <div class="mt-4 grid grid-cols-1 gap-2 px-5 sm:grid-cols-2">
            <div class="flex items-center gap-3 rounded-xl px-3.5 py-2.5" :style="{ background: 'var(--panel2)' }">
              <Box :size="15" :style="{ color: 'var(--accent)' }" class="shrink-0" />
              <span class="font-mono2 text-[9.5px] uppercase tracking-[0.16em] text-[var(--sub)]">Quantity</span>
              <span class="ml-auto text-right text-[12.5px] font-semibold text-[var(--ink)]">{{ current.qty.toLocaleString() }}</span>
            </div>
            <div class="flex items-center gap-3 rounded-xl px-3.5 py-2.5" :style="{ background: 'var(--panel2)' }">
              <Layers :size="15" :style="{ color: 'var(--accent)' }" class="shrink-0" />
              <span class="font-mono2 text-[9.5px] uppercase tracking-[0.16em] text-[var(--sub)]">Material</span>
              <span class="ml-auto text-right text-[12.5px] font-semibold text-[var(--ink)]">{{ current.specs.material }}</span>
            </div>
            <div class="flex items-center gap-3 rounded-xl px-3.5 py-2.5" :style="{ background: 'var(--panel2)' }">
              <Droplets :size="15" :style="{ color: 'var(--accent)' }" class="shrink-0" />
              <span class="font-mono2 text-[9.5px] uppercase tracking-[0.16em] text-[var(--sub)]">Colour</span>
              <span class="ml-auto text-right text-[12.5px] font-semibold text-[var(--ink)]">{{ current.specs.colors }}</span>
            </div>
            <div class="flex items-center gap-3 rounded-xl px-3.5 py-2.5" :style="{ background: 'var(--panel2)' }">
              <Scissors :size="15" :style="{ color: 'var(--accent)' }" class="shrink-0" />
              <span class="font-mono2 text-[9.5px] uppercase tracking-[0.16em] text-[var(--sub)]">Finishing</span>
              <span class="ml-auto text-right text-[12.5px] font-semibold text-[var(--ink)]">{{ current.specs.finish }}</span>
            </div>
            <div class="flex items-center gap-3 rounded-xl px-3.5 py-2.5" :style="{ background: 'var(--panel2)' }">
              <Ruler :size="15" :style="{ color: 'var(--accent)' }" class="shrink-0" />
              <span class="font-mono2 text-[9.5px] uppercase tracking-[0.16em] text-[var(--sub)]">Size</span>
              <span class="ml-auto text-right text-[12.5px] font-semibold text-[var(--ink)]">{{ current.specs.size }}</span>
            </div>
            <div class="flex items-center gap-3 rounded-xl px-3.5 py-2.5" :style="{ background: 'var(--panel2)' }">
              <CalendarClock :size="15" :style="{ color: 'var(--accent)' }" class="shrink-0" />
              <span class="font-mono2 text-[9.5px] uppercase tracking-[0.16em] text-[var(--sub)]">Deadline</span>
              <span class="ml-auto text-right text-[12.5px] font-semibold text-[var(--ink)]">{{ current.eta }}</span>
            </div>
          </div>

          <div class="mt-4 px-5">
            <div class="flex items-center justify-between pb-2">
              <ML>Pipeline</ML>
              <span v-if="current.progress != null" class="font-mono2 text-[10px] font-semibold" :style="{ color: 'var(--accent)' }">{{ current.progress }}% of stage</span>
            </div>
            <StageDots :job="current" />
            <div v-if="current.progress != null" class="mt-2.5 h-1.5 w-full overflow-hidden rounded-full" :style="{ background: 'var(--line)' }">
              <div class="h-full rounded-full" :style="{ background: 'var(--accent)', width: current.progress + '%' }" />
            </div>
          </div>

          <div class="p-5">
            <div v-if="current.stage === 'delivery'" class="flex h-[68px] w-full flex-col items-center justify-center gap-1 rounded-2xl border font-mono2 text-[11px] uppercase tracking-[0.16em]" :style="{ borderColor: 'var(--line)', color: 'var(--sub)' }">
              <Truck :size="17" :style="{ color: 'var(--accent)' }" />
              Awaiting courier — ball passed
            </div>
            <template v-else>
              <button
                v-if="pressLabel(current)"
                @click="w.act('press-advance', current)"
                class="press-key relative flex h-[68px] w-full items-center justify-center gap-3 overflow-hidden rounded-2xl font-mono2 text-[15px] font-bold uppercase tracking-[0.18em]"
                :style="{ background: 'var(--accent)', color: 'var(--accentInk)', boxShadow: '0 12px 40px -12px var(--glow), inset 0 -3px 0 rgba(0,0,0,.22)' }"
              >
                <span class="halftone absolute inset-0 opacity-20" :style="{ '--dot': 'rgba(0,0,0,.35)' }" />
                <Play :size="18" class="relative" fill="currentColor" />
                <span class="relative">{{ pressLabel(current) }}</span>
              </button>
            </template>
            <button
              @click="w.act('toast', current, 'Issue reported — manager pinged')"
              class="press-key mt-2.5 flex w-full items-center justify-center gap-2 rounded-2xl border py-3 font-mono2 text-[10.5px] font-semibold uppercase tracking-[0.18em] text-[var(--sub)]"
              :style="{ borderColor: 'var(--line)' }"
            >
              <AlertTriangle :size="13" /> Report issue
            </button>
          </div>
        </section>

        <section v-for="(j) in requests" :key="j.id" class="overflow-hidden rounded-[1.6rem] border-2 border-dashed p-5" :style="{ borderColor: 'var(--accent)', background: 'var(--panel)' }">
          <ML class="!text-[var(--accent)]">New job request</ML>
          <h3 class="mt-2 font-disp text-[20px] font-bold leading-tight tracking-tight">{{ j.title }}</h3>
          <div class="mt-1 font-mono2 text-[10px] uppercase tracking-[0.14em] text-[var(--sub)]">
            {{ j.qty.toLocaleString() }} units · {{ money(j.value) }} · deadline {{ j.eta }}
          </div>
          <div class="mt-3 grid grid-cols-2 gap-2">
            <div class="rounded-xl p-3" :style="{ background: 'var(--panel2)' }">
              <div class="font-mono2 text-[8.5px] uppercase tracking-[0.16em] text-[var(--sub)]">Material</div>
              <div class="mt-0.5 text-[12px] font-semibold leading-snug">{{ j.specs.material }}</div>
            </div>
            <div class="rounded-xl p-3" :style="{ background: 'var(--panel2)' }">
              <div class="font-mono2 text-[8.5px] uppercase tracking-[0.16em] text-[var(--sub)]">Finishing</div>
              <div class="mt-0.5 text-[12px] font-semibold leading-snug">{{ j.specs.finish }}</div>
            </div>
          </div>
          <div class="mt-3"><StageDots :job="j" /></div>
          <div class="mt-4">
            <button
              v-if="pressLabel(j)"
              @click="w.act('press-advance', j)"
              class="press-key relative flex h-[68px] w-full items-center justify-center gap-3 overflow-hidden rounded-2xl font-mono2 text-[15px] font-bold uppercase tracking-[0.18em]"
              :style="{ background: 'var(--accent)', color: 'var(--accentInk)', boxShadow: '0 12px 40px -12px var(--glow), inset 0 -3px 0 rgba(0,0,0,.22)' }"
            >
              <span class="halftone absolute inset-0 opacity-20" :style="{ '--dot': 'rgba(0,0,0,.35)' }" />
              <Play :size="18" class="relative" fill="currentColor" />
              <span class="relative">{{ pressLabel(j) }}</span>
            </button>
          </div>
        </section>

        <div v-if="!current && requests.length === 0" class="flex flex-col items-center rounded-[1.6rem] border p-10 text-center" :style="{ borderColor: 'var(--line)', background: 'var(--panel)' }">
          <CircleCheck :size="30" :style="{ color: 'var(--accent)' }" />
          <div class="mt-3 font-disp text-[17px] font-bold">Floor is clear</div>
          <div class="mt-1 text-[12.5px] text-[var(--sub)]">No live jobs on your presses. New requests land here first.</div>
        </div>

        <section class="overflow-hidden rounded-[1.6rem] border-2 border-dashed p-4" :style="{ borderColor: 'var(--accent)', background: 'var(--panel)' }">
          <NuxtLink to="/app/printer/rates" class="flex items-center gap-3">
            <span class="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl" :style="{ background: 'var(--accent)' }">
              <Coins :size="18" style="color: var(--accentInk)" />
            </span>
            <div class="min-w-0 flex-1">
              <div class="font-disp text-[16px] font-bold tracking-tight">My rate card</div>
              <div class="text-[11.5px] leading-snug text-[var(--sub)]">Set your prices once — every quote updates instantly.</div>
            </div>
            <ChevronRight :size="17" style="color: var(--accent)" class="shrink-0" />
          </NuxtLink>
        </section>

        <section class="rounded-[1.6rem] border p-5" :style="{ borderColor: 'var(--line)', background: 'var(--panel)' }">
          <ML>Today on the floor</ML>
          <div class="mt-3 grid grid-cols-3 gap-2 text-center">
            <div v-for="([n, l]) in todayStats" :key="l" class="rounded-xl py-3" :style="{ background: 'var(--panel2)' }">
              <div class="font-disp text-[18px] font-bold" :style="{ color: 'var(--accent)' }">{{ n }}</div>
              <div class="mt-0.5 font-mono2 text-[8px] uppercase tracking-[0.14em] text-[var(--sub)]">{{ l }}</div>
            </div>
          </div>
          <div class="mt-3 flex items-center gap-2 rounded-xl p-3" :style="{ background: 'var(--panel2)' }">
            <CheckCheck :size="14" :style="{ color: 'var(--accent)' }" />
            <span class="text-[11.5px] text-[var(--sub)]">QC station is green. Densitometer calibrated 06:00.</span>
          </div>
        </section>
      </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import {
  Layers, Droplets, Scissors, Ruler, CalendarClock,
  AlertTriangle, Truck, CheckCheck, Play, Box, CircleCheck, Coins, ChevronRight,
} from 'lucide-vue-next'
import {
  SESSION_PRINTER_ID, money, pressLabel, stIdx, STAGES, STATUS_META,
} from '~/shared/workflow/printy'
import { useWorkflowStore } from '~/stores/workflow'

const w = useWorkflowStore()

const mine = computed(() => w.jobs.filter((j) => j.printerId === SESSION_PRINTER_ID && j.stage !== 'completed'))
const requests = computed(() => mine.value.filter((j) => j.press === 'accept'))
const running = computed(() => mine.value.filter((j) => j.press === 'ready' || j.press === 'active'))
const waiting = computed(() => mine.value.filter((j) => j.stage === 'delivery'))
const current = computed(() => running.value[0] ?? waiting.value[0] ?? null)
const headline = computed(() =>
  current.value?.press === 'active' ? 'Now on press'
    : current.value?.press === 'ready' ? 'Up on your press'
    : 'Awaiting courier',
)
const curMeta = computed(() => (current.value ? STATUS_META[current.value.status] : undefined))
const curStageLabel = computed(() => (current.value ? STAGES[stIdx(current.value.stage)]?.label : undefined))
const todayStats: [string, string][] = [
  ['3,841', 'sheets run'],
  ['98.2%', 'register ok'],
  ['2', 'jobs cleared'],
]
</script>