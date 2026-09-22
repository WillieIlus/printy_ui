<template>
  <div class="mx-auto w-full max-w-[1000px] px-4 pb-24 pt-10 sm:pt-14">
    <!-- ── search ── -->
    <div class="text-center">
      <div class="inline-flex items-center gap-2 font-mono2 text-[10px] uppercase tracking-[0.22em] text-[var(--sub)]">
        <PackageSearch :size="12" style="color: var(--accent)" /> live job tracking
      </div>
      <h1 class="mt-3 font-disp text-[34px] font-bold leading-[1.05] tracking-tight sm:text-[42px]">
        Where is my print job?
      </h1>
      <p class="mx-auto mt-3 max-w-[50ch] text-[14px] leading-relaxed text-[var(--sub)]">
        Enter your Printy job code. You'll see the current status, when it's expected to be ready and what happens next.
      </p>
    </div>

    <div class="mx-auto mt-7 max-w-[560px]">
      <form
        class="flex items-center gap-2 rounded-2xl border p-2 pl-4 shadow-[0_10px_40px_-24px_rgba(27,23,16,.5)] focus-within:border-[var(--accent)]"
        style="border-color: var(--line); background: var(--panel)"
        @submit.prevent="search()"
      >
        <Search :size="16" style="color: var(--sub)" class="shrink-0" />
        <input
          v-model="query"
          placeholder="PTY-1041"
          class="w-full bg-transparent py-2.5 font-mono2 text-[14px] uppercase tracking-[0.08em] outline-none placeholder:text-[var(--sub)] placeholder:opacity-50"
        />
        <button
          type="submit"
          :disabled="loading || !query.trim()"
          class="press-key shrink-0 rounded-xl px-5 py-3 font-mono2 text-[11px] font-bold uppercase tracking-[0.14em] text-white disabled:opacity-50"
          style="background: var(--accent)"
        >
          <Loader2 v-if="loading" :size="14" class="animate-spin" />
          <template v-else>Track</template>
        </button>
      </form>

      <div class="mt-3 flex flex-wrap items-center justify-center gap-1.5">
        <span class="font-mono2 text-[9px] uppercase tracking-[0.14em] text-[var(--sub)]">try:</span>
        <button
          v-for="h in HINTS"
          :key="h"
          class="press-key rounded-full border px-2.5 py-1 font-mono2 text-[9.5px] tracking-[0.1em] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]"
          style="border-color: var(--line); color: var(--sub)"
          :disabled="loading"
          @click="query = h; search()"
        >
          {{ h }}
        </button>
      </div>
    </div>

    <!-- ── loading ── -->
    <div v-if="loading && !result" class="mx-auto mt-10 flex max-w-[560px] justify-center">
      <span class="inline-flex items-center gap-2 rounded-full border px-4 py-2 font-mono2 text-[10px] uppercase tracking-[0.14em] text-[var(--sub)]" style="border-color: var(--line); background: var(--panel)">
        <Loader2 :size="13" class="animate-spin" style="color: var(--accent)" /> looking up {{ lastQuery }}…
      </span>
    </div>

    <!-- ── not found ── -->
    <div v-if="notFound" class="mx-auto mt-8 max-w-[520px] rounded-2xl border p-6 text-center" style="border-color: var(--line); background: var(--panel)">
      <CircleDashed :size="22" class="mx-auto" style="color: var(--sub)" />
      <div class="mt-3 font-disp text-[16px] font-bold">No job found for "{{ lastQuery }}"</div>
      <p class="mt-1.5 text-[12.5px] leading-relaxed text-[var(--sub)]">
        Check the code on your order confirmation — it looks like <span class="font-mono2">PTY-1041</span>.
      </p>
      <button class="press-key mt-4 inline-flex items-center gap-1.5 rounded-xl border px-4 py-2.5 font-mono2 text-[10px] font-bold uppercase tracking-[0.14em]" style="border-color: var(--line); color: var(--accent)" @click="resetSearch()">
        <Search :size="12" /> Try another code
      </button>
    </div>

    <!-- ── error ── -->
    <div v-if="error && !notFound" class="mx-auto mt-8 max-w-[520px] rounded-2xl border p-6 text-center" style="border-color: var(--line); background: var(--panel)">
      <CircleDashed :size="22" class="mx-auto" style="color: var(--sub)" />
      <div class="mt-3 font-disp text-[16px] font-bold">We couldn't look that up</div>
      <p class="mt-1.5 text-[12.5px] leading-relaxed text-[var(--sub)]">{{ error }}</p>
      <button class="press-key mt-4 inline-flex items-center gap-1.5 rounded-xl border px-4 py-2.5 font-mono2 text-[10px] font-bold uppercase tracking-[0.14em]" style="border-color: var(--line); color: var(--accent)" @click="resetSearch()">
        <Search :size="12" /> Try again
      </button>
    </div>

    <!-- ── found ── -->
    <div v-if="result" class="mt-9">
      <div class="overflow-hidden rounded-3xl border" style="border-color: var(--line); background: var(--panel)">
        <div class="h-1.5" style="background: var(--accent)" />
        <div class="p-5 sm:p-6">
          <div class="flex flex-wrap items-start justify-between gap-3">
            <div class="min-w-0">
              <div class="flex flex-wrap items-center gap-2">
                <span class="font-mono2 text-[12px] font-semibold tracking-[0.14em]" style="color: var(--accent)">{{ result.tracking_reference }}</span>
                <span class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-[3px] font-mono2 text-[8.5px] uppercase tracking-[0.14em]" style="background: rgba(47,191,113,.14); color: #0E7A45">
                  <Ball :size="6" color="#2FBF71" /> on track
                </span>
              </div>
              <h2 class="mt-2 font-disp text-[22px] font-bold leading-tight tracking-tight sm:text-[26px]">Status: {{ jobStatusLabel }}</h2>
            </div>
            <button
              class="press-key inline-flex items-center gap-1.5 rounded-full border px-3 py-2 font-mono2 text-[9px] uppercase tracking-[0.14em]"
              style="border-color: var(--line); color: var(--sub)"
              @click="refresh()"
            >
              <RefreshCw :size="11" :class="{ 'animate-spin': loading }" /> refresh
            </button>
          </div>

          <!-- status panel -->
          <div class="mt-5 grid gap-3 sm:grid-cols-[1.2fr_1fr]">
            <div class="rounded-2xl p-4" style="background: var(--panel2)">
              <ML>Current status</ML>
              <div class="mt-2.5 flex items-center gap-3.5">
                <span class="ball-ping h-3 w-3 shrink-0 rounded-full" style="background: #2FBF71" />
                <div class="min-w-0">
                  <div class="font-disp text-[16px] font-bold">{{ jobStatusLabel }}</div>
                  <div class="mt-0.5 font-mono2 text-[9px] uppercase tracking-[0.14em] text-[var(--sub)]">tracked via printy status link</div>
                </div>
              </div>
            </div>

            <div class="rounded-2xl p-4" style="background: var(--panel2)">
              <ML>What happens next</ML>
              <div class="mt-2.5 flex items-start gap-2.5">
                <span class="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full" style="background: color-mix(in srgb, var(--accent) 14%, transparent)">
                  <Clock :size="13" style="color: var(--accent)" />
                </span>
                <p class="text-[12.5px] leading-snug text-[var(--sub)]">{{ result.next_action }}</p>
              </div>
            </div>
          </div>

          <!-- estimated ready -->
          <div class="mt-4 flex items-center gap-2 rounded-2xl px-4 py-3" style="background: color-mix(in srgb, var(--accent) 7%, transparent)">
            <Truck :size="15" style="color: var(--accent)" />
            <span class="font-mono2 text-[9.5px] uppercase tracking-[0.12em] text-[var(--sub)]">Estimated ready</span>
            <span v-if="estimatedReadyLabel" class="ml-auto font-disp text-[14px] font-bold" style="color: var(--ink)">{{ estimatedReadyLabel }}</span>
            <span v-else class="ml-auto font-mono2 text-[10px] uppercase tracking-[0.1em] text-[var(--sub)]">being confirmed</span>
          </div>

          <p class="mt-4 text-[11.5px] leading-relaxed text-[var(--sub)]">
            Status links are intentionally minimal — private pricing, files and custody details stay behind your login.
          </p>
        </div>
      </div>

      <div v-if="!isAuthed" class="mx-auto mt-5 max-w-[520px]">
        <NuxtLink to="/sign-in" class="press-key flex w-full items-center justify-center gap-2 rounded-2xl py-3.5 font-mono2 text-[11px] font-bold uppercase tracking-[0.16em] text-white" style="background: var(--accent)">
          <ShieldCheck :size="14" /> Sign in for full job detail <ArrowRight :size="14" />
        </NuxtLink>
      </div>
    </div>

    <!-- ── empty hint ── -->
    <div v-if="!submitted && !result" class="mx-auto mt-12 grid max-w-[760px] gap-3 sm:grid-cols-3">
      <div v-for="[Icon, t, d] in FEATURES" :key="t" class="rounded-2xl border p-4" style="border-color: var(--line); background: var(--panel)">
        <component :is="Icon" :size="16" style="color: var(--accent)" />
        <div class="mt-2.5 font-disp text-[13.5px] font-bold">{{ t }}</div>
        <div class="mt-1 text-[11.5px] leading-snug text-[var(--sub)]">{{ d }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ArrowRight, CircleDashed, Clock, Loader2, PackageSearch, RefreshCw, Search, ShieldCheck, Truck } from 'lucide-vue-next'
import type { Component } from 'vue'
import { API } from '~/shared/api-paths'
import { getApiErrorMessage } from '~/shared/api'
import { useAuthStore } from '~/stores/auth'

const props = defineProps<{
  token?: string
}>()

const HINTS = ['PTY-1041', 'PTY-1044', 'PTY-1045', 'PTY-1046', 'PTY-1047']

interface TrackResult {
  tracking_reference: string
  job_status: string
  estimated_ready: string | null
  next_action: string
}

const auth = useAuthStore()
const isAuthed = computed(() => auth.isAuthenticated)
const { publicApi } = useApi()

const query = ref(props.token ?? '')
const submitted = ref(props.token ?? '')
const lastQuery = ref(props.token ?? '')
const loading = ref(false)
const notFound = ref(false)
const error = ref('')
const result = ref<TrackResult | null>(null)

const jobStatusLabel = computed(() => result.value?.job_status || 'Unknown')

const estimatedReadyLabel = computed(() => {
  const raw = result.value?.estimated_ready
  if (!raw) return ''
  const date = new Date(raw)
  if (Number.isNaN(date.getTime())) return raw
  return date.toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' })
})

const FEATURES: Array<[Component, string, string]> = [
  [Clock, 'Every handoff timed', 'See exactly how long each person has held your job.'],
  [PackageSearch, 'Clear next step', 'Know precisely what happens to your job next.'],
  [ShieldCheck, 'Money stays safe', 'Funds release only after you confirm delivery.'],
]

async function lookup(value: string) {
  const token = value.trim().toLowerCase().replace(/\s+/g, '')
  if (!token) return
  lastQuery.value = token
  loading.value = true
  notFound.value = false
  error.value = ''
  result.value = null
  try {
    const data = await publicApi<TrackResult | { detail?: string }>(API.jobs.publicManagedTrack(token), { auth: false })
    if (data && 'tracking_reference' in data && data.tracking_reference) {
      result.value = data as TrackResult
      submitted.value = token
    } else {
      notFound.value = true
      submitted.value = token
    }
  } catch (e: any) {
    if (e?.statusCode === 410 || e?.statusCode === 404 || e?.statusCode === 400) {
      notFound.value = true
    } else {
      error.value = getApiErrorMessage(e, 'The tracking service could not be reached right now.')
    }
    submitted.value = token
  } finally {
    loading.value = false
  }
}

function search() {
  return lookup(query.value)
}

function refresh() {
  return lookup(query.value || lastQuery.value)
}

function resetSearch() {
  submitted.value = ''
  notFound.value = false
  error.value = ''
  result.value = null
  query.value = ''
}

onMounted(() => {
  if (props.token) {
    query.value = props.token
    lookup(props.token)
  }
})
</script>