<script setup lang="ts">
import { ref, useAttrs, watch } from 'vue'
import { getIcon } from '../../../utils/design/icon-registry'
import { cx } from '../../../utils/design/cx'
import { useDebouncedTask } from '../../../composables/design/useDebouncedTask'
import DesignAlert from '../ui/Alert.vue'
import DesignLoading from '../ui/Loading.vue'
import StatusPill from '../ui/StatusPill.vue'
import type { StatusTone } from '../../../types/design/status-tone'

export type DesignJobView = {
  code: string
  specLabel: string
  currentStageIndex: number
  currentStageLabel: string
  stageCount: number
  tone: StatusTone
  statusLabel: string
}

const DEMO_JOB_CODE = 'SAMPLE-1042'

function designTrackUrl(code: string): string {
  return `/track?code=${encodeURIComponent(code)}`
}

const props = withDefaults(defineProps<{
  initialCode?: string
  fetchJob?: (code: string) => Promise<DesignJobView>
}>(), {
  initialCode: '',
  fetchJob: undefined,
})

const emit = defineEmits<{ track: [code: string] }>()
const attrs = useAttrs()

const code = ref(props.initialCode)
const preview = ref<DesignJobView | null>(null)
const miss = ref<string | null>(null)
const prompt = ref<string | null>(null)
const checking = ref(false)
let requestId = 0

const lookup = useDebouncedTask(async () => {
  const normalized = code.value.trim()
  if (normalized.length < 4) {
    preview.value = null
    miss.value = null
    return
  }
  if (!props.fetchJob) return
  const id = ++requestId
  checking.value = true
  try {
    const job = await props.fetchJob(normalized)
    if (requestId !== id) return
    preview.value = job
    miss.value = null
  } catch (error) {
    if (requestId !== id) return
    preview.value = null
    miss.value = error instanceof Error ? error.message : 'No job matches that code'
  } finally {
    if (requestId === id) checking.value = false
  }
}, 350)

watch(code, () => lookup.run())

function submit() {
  const next = code.value.trim().toUpperCase()
  if (next.length < 4) {
    prompt.value = 'Enter your job code'
    return
  }
  prompt.value = null
  if (attrs.onTrack) {
    emit('track', next)
    return
  }
  void navigateTo(designTrackUrl(next))
}

function readCode(event: Event) {
  code.value = (event.target as HTMLInputElement).value.toUpperCase()
  if (prompt.value) {
    prompt.value = null
  }
}

function openPreview() {
  if (!preview.value) return
  code.value = preview.value.code
  const next = preview.value.code.trim().toUpperCase()
  if (attrs.onTrack) {
    emit('track', next)
    return
  }
  void navigateTo(designTrackUrl(next))
}
</script>

<template>
  <div class="crop-marks rounded-2xl border border-line bg-card p-6 shadow-card sm:p-8">
    <p class="font-mono text-[10.5px] tracking-[0.18em] text-ink-3 uppercase">Job code from your confirmation</p>
    <form
      class="mt-3 flex flex-col gap-2.5 sm:flex-row"
      @submit.prevent="submit"
    >
      <input
        :value="code"
        placeholder="PRT-0000"
        autocomplete="off"
        spellcheck="false"
        :aria-invalid="Boolean(prompt)"
        :aria-describedby="prompt ? 'job-code-prompt' : undefined"
        :class="cx(
          'tabular w-full flex-1 rounded-xl border bg-paper px-4 py-3 font-mono text-lg font-semibold tracking-[0.08em] text-ink placeholder:text-ink-3',
          prompt ? 'border-amber focus:border-amber' : 'border-line-strong focus:border-brand',
        )"
        @input="readCode"
      />
      <button type="submit" class="inline-flex min-h-[48px] cursor-pointer items-center justify-center gap-2 rounded-xl bg-ink px-6 py-3 text-sm font-semibold text-paper transition-colors hover:bg-brand-deep">
        <component :is="getIcon('Search')" class="h-4 w-4" />
        Track my job
      </button>
    </form>

    <p
      id="job-code-prompt"
      class="mt-3 text-[13px] transition-opacity"
      :class="prompt ? 'text-amber opacity-100' : 'opacity-0'"
      role="status"
    >
      {{ prompt ?? '\u00A0' }}
    </p>

    <div v-if="props.fetchJob" class="mt-1 min-h-12" aria-live="polite">
      <DesignLoading v-if="checking && code.trim().length >= 4" variant="inline" label="Checking the live line…" />
      <button
        v-if="preview"
        type="button"
        class="flex w-full cursor-pointer items-center justify-between gap-3 rounded-xl border border-brand/40 bg-mint/60 px-4 py-3 text-left transition-colors hover:bg-mint"
        @click="openPreview"
      >
        <span>
          <span class="tabular block font-mono text-sm font-semibold text-ink">{{ preview.code }}</span>
          <span class="block text-[12.5px] text-ink-2">{{ preview.specLabel }} - stage {{ preview.currentStageIndex }}/{{ preview.stageCount }} {{ preview.currentStageLabel }}</span>
        </span>
        <span class="flex items-center gap-2">
          <StatusPill :tone="preview.tone" :pulse="preview.tone === 'ontrack'">{{ preview.statusLabel }}</StatusPill>
          <component :is="getIcon('ArrowRight')" class="h-4 w-4 text-brand-deep" />
        </span>
      </button>
      <DesignAlert v-if="miss && !checking" tone="error" class="mt-3">
        {{ miss }}
      </DesignAlert>
    </div>

    <div class="mt-2 flex flex-wrap items-center gap-2">
      <span class="font-mono text-[10.5px] tracking-[0.1em] text-ink-3 uppercase">See how it works:</span>
      <NuxtLink
        :to="designTrackUrl(DEMO_JOB_CODE)"
        :class="cx('rounded-md border px-2.5 py-1 font-mono text-[11px] font-semibold tracking-[0.06em] transition-colors', code.trim().toUpperCase() === DEMO_JOB_CODE ? 'border-brand bg-mint text-brand-deep' : 'border-line bg-paper-2 text-ink-2 hover:border-brand hover:text-brand')"
      >{{ DEMO_JOB_CODE }} demo run</NuxtLink>
    </div>
  </div>
</template>
