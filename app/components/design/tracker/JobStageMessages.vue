<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { ChevronDown, MessageSquare, Paperclip, Send, Loader2 } from 'lucide-vue-next'
import { useApi } from '../../../composables/useApi'
import { API } from '../../../shared/api-paths'
import { getApiErrorMessage } from '../../../shared/api'
import { cx } from '../../../utils/design/cx'

type JobMessage = {
  id: number
  body: string
  stage: string
  sender_role: string
  sender_name: string
  is_mine: boolean
  audience: 'client' | 'printer'
  created_at: string
  read_at: string | null
  attachments: { id: string; name: string }[]
}

type StageGroup = {
  key: string
  label: string
  owner: string
  messages: JobMessage[]
  unread_count: number
}

type Audience = {
  key: 'client' | 'printer'
  label: string
  unread_count: number
  can_reply: boolean
}

type Bundle = {
  job_id: number
  job_reference: string
  current_stage: string
  viewer_role: string
  audiences: Audience[]
  stages: StageGroup[]
  total_unread: number
  latest: JobMessage | null
  files: { id: number | string; name: string; url: string }[]
  can_reply: boolean
}

const props = defineProps<{
  jobId?: number | null
  initialStage?: string
}>()

const { api } = useApi()
const bundle = ref<Bundle | null>(null)
const loading = ref(false)
const error = ref('')
const expanded = ref(false)
const selectedStage = ref('')
const selectedAudience = ref<'client' | 'printer'>('client')
const replyBody = ref('')
const sending = ref(false)
const sendError = ref('')
const showFiles = ref(false)

const availableAudiences = computed(() => bundle.value?.audiences ?? [])
const activeAudience = computed(() => availableAudiences.value.find((row) => row.key === selectedAudience.value) ?? availableAudiences.value[0] ?? null)
const stageRows = computed<StageGroup[]>(() => bundle.value?.stages ?? [])
const activeStage = computed(() => stageRows.value.find((row) => row.key === selectedStage.value) ?? stageRows.value[0] ?? null)
const visibleMessages = computed(() => {
  const rows = activeStage.value?.messages ?? []
  if (bundle.value?.viewer_role === 'manager' && availableAudiences.value.length > 1) {
    return rows.filter((message) => message.audience === selectedAudience.value)
  }
  return rows
})
const unread = computed(() => bundle.value?.total_unread ?? 0)
const latest = computed(() => {
  let rows = stageRows.value.flatMap((stage) => stage.messages)
  if (bundle.value?.viewer_role === 'manager' && availableAudiences.value.length > 1) {
    rows = rows.filter((message) => message.audience === selectedAudience.value)
  }
  return [...rows].sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()).at(-1) ?? null
})
const canReply = computed(() => Boolean(activeAudience.value?.can_reply && activeStage.value))
const replyNote = computed(() => {
  if (bundle.value?.viewer_role === 'client') return 'Your message goes to your manager. Printer conversations stay private.'
  if (bundle.value?.viewer_role === 'printer') return 'Your message goes to the manager.'
  return selectedAudience.value === 'printer'
    ? 'This message stays inside the manager–printer thread.'
    : 'This message goes to the client.'
})

function stageUnread(stage: StageGroup): number {
  const rows = bundle.value?.viewer_role === 'manager' && availableAudiences.value.length > 1
    ? stage.messages.filter((message) => message.audience === selectedAudience.value)
    : stage.messages
  return rows.filter((message) => !message.is_mine && !message.read_at).length
}

function when(raw: string): string {
  if (!raw) return ''
  const date = new Date(raw)
  if (Number.isNaN(date.getTime())) return ''
  return date.toLocaleString('en-KE', { day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' })
}

async function load() {
  if (!props.jobId) return
  loading.value = true
  error.value = ''
  try {
    bundle.value = await api<Bundle>(API.managedJobs.messages(props.jobId))
    if (!selectedStage.value) {
      const latestMessage = bundle.value.latest
      selectedStage.value = latestMessage?.stage || bundle.value.current_stage || bundle.value.stages[0]?.key || ''
    }
    if (bundle.value.viewer_role === 'manager' && bundle.value.latest?.audience) {
      selectedAudience.value = bundle.value.latest.audience
    }
    if (!availableAudiences.value.some((row) => row.key === selectedAudience.value)) {
      selectedAudience.value = availableAudiences.value[0]?.key ?? 'client'
    }
  } catch (caught) {
    error.value = getApiErrorMessage(caught, "We couldn't load this job's messages.")
  } finally {
    loading.value = false
  }
}

async function markVisibleRead() {
  const unreadRows = visibleMessages.value.filter((message) => !message.is_mine && !message.read_at)
  if (!unreadRows.length || !props.jobId) return
  try {
    for (const message of unreadRows) {
      bundle.value = await api<Bundle>(API.managedJobs.messageRead(props.jobId, message.id), { method: 'POST' })
    }
  } catch {
    /* unread stays until the next successful refresh */
  }
}

async function toggleExpanded() {
  expanded.value = !expanded.value
  if (expanded.value) {
    await markVisibleRead()
  }
}

async function selectStage(key: string) {
  selectedStage.value = key
  await markVisibleRead()
}

async function selectAudience(key: 'client' | 'printer') {
  selectedAudience.value = key
  const stageHasMessages = stageRows.value.some(
    (stage) => stage.key === selectedStage.value && stage.messages.some((message) => message.audience === key),
  )
  if (!stageHasMessages) {
    const latestForAudience = [...stageRows.value.flatMap((stage) => stage.messages)]
      .filter((message) => message.audience === key)
      .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
      .at(-1)
    if (latestForAudience) selectedStage.value = latestForAudience.stage
  }
  await markVisibleRead()
}

async function send() {
  if (!props.jobId || !replyBody.value.trim() || sending.value) return
  sending.value = true
  sendError.value = ''
  try {
    bundle.value = await api<Bundle>(API.managedJobs.messages(props.jobId), {
      method: 'POST',
      body: {
        body: replyBody.value.trim(),
        stage: activeStage.value?.key || props.initialStage || '',
        audience: selectedAudience.value,
      },
    })
    replyBody.value = ''
  } catch (caught) {
    sendError.value = getApiErrorMessage(caught, "We couldn't send that message.")
  } finally {
    sending.value = false
  }
}

watch(() => props.jobId, () => {
  bundle.value = null
  selectedStage.value = props.initialStage || ''
  void load()
})

onMounted(load)

function onStatusUpdate(event: Event) {
  const detail = (event as CustomEvent<{ jobId?: number }>).detail
  if (!detail?.jobId || detail.jobId === props.jobId) void load()
}

if (typeof window !== 'undefined') {
  window.addEventListener('printy:job-message-updated', onStatusUpdate)
}

onBeforeUnmount(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('printy:job-message-updated', onStatusUpdate)
  }
})
</script>

<template>
  <section v-if="props.jobId" class="border-t border-line px-5 py-4 sm:px-6" data-test="job-stage-messages">
    <button
      type="button"
      class="flex w-full cursor-pointer items-center justify-between gap-3 text-left"
      :aria-expanded="expanded"
      @click="toggleExpanded"
    >
      <span class="flex min-w-0 items-center gap-2">
        <MessageSquare class="h-4 w-4 shrink-0 text-brand" aria-hidden="true" />
        <span class="font-mono text-[10px] font-semibold tracking-[0.16em] uppercase">
          Stage messages
        </span>
        <span v-if="unread > 0" class="rounded-full bg-brand px-2 py-[2px] font-mono text-[9px] font-bold text-white">
          {{ unread }} new
        </span>
      </span>
      <span class="flex min-w-0 items-center gap-3">
        <span v-if="latest && !expanded" class="hidden min-w-0 max-w-[38ch] truncate text-[12px] text-ink-3 sm:block">
          {{ latest.sender_name }}: {{ latest.body }}
        </span>
        <span v-if="latest && !expanded" class="shrink-0 font-mono text-[10px] text-ink-3">{{ when(latest.created_at) }}</span>
        <ChevronDown class="h-4 w-4 shrink-0 text-ink-3 transition-transform" :class="expanded && 'rotate-180'" />
      </span>
    </button>

    <div v-if="expanded" class="mt-4">
      <div v-if="loading" class="flex items-center gap-2 py-4 text-[12px] text-ink-3">
        <Loader2 class="h-4 w-4 animate-spin" /> Loading messages…
      </div>
      <p v-else-if="error" class="rounded-xl border border-red/40 bg-red-soft px-4 py-2.5 text-[12.5px] text-red">
        {{ error }}
      </p>
      <template v-else-if="bundle">
        <div v-if="availableAudiences.length > 1" class="mb-3 flex flex-wrap gap-1.5">
          <button
            v-for="audience in availableAudiences"
            :key="audience.key"
            type="button"
            class="inline-flex min-h-[32px] cursor-pointer items-center gap-1.5 rounded-full border px-3 font-mono text-[9.5px] font-semibold tracking-[0.08em] uppercase"
            :class="selectedAudience === audience.key ? 'border-brand bg-mint text-brand-deep' : 'border-line bg-card text-ink-2'"
            @click="selectAudience(audience.key)"
          >
            {{ audience.label }}
            <span v-if="audience.unread_count" class="rounded-full bg-brand px-1.5 text-[8px] font-bold text-white">{{ audience.unread_count }}</span>
          </button>
        </div>

        <div class="mb-3 flex flex-wrap gap-1.5">
          <button
            v-for="stage in stageRows"
            :key="stage.key"
            type="button"
            class="inline-flex min-h-[32px] cursor-pointer items-center gap-1.5 rounded-full border px-3 font-mono text-[9.5px] font-semibold tracking-[0.06em]"
            :class="selectedStage === stage.key ? 'border-brand bg-mint text-brand-deep' : 'border-line bg-card text-ink-2'"
            @click="selectStage(stage.key)"
          >
            {{ stage.label }}
            <span v-if="stageUnread(stage)" class="h-1.5 w-1.5 rounded-full bg-brand" />
          </button>
        </div>

        <div v-if="!visibleMessages.length" class="rounded-xl border border-dashed border-line-strong bg-paper-2/40 px-4 py-5 text-center">
          <p class="text-[12.5px] font-semibold text-ink">No messages on {{ activeStage?.label ?? 'this stage' }} yet.</p>
          <p class="mt-1 text-[11.5px] text-ink-3">Start the conversation below. Older stage conversations stay available in the tabs above.</p>
        </div>

        <ul v-else class="flex max-h-[280px] flex-col gap-2 overflow-y-auto pr-1">
          <li
            v-for="message in visibleMessages"
            :key="message.id"
            class="rounded-xl border px-3.5 py-2.5"
            :class="message.is_mine ? 'border-brand/30 bg-mint/40' : 'border-line bg-paper-2/50'"
          >
            <div class="flex flex-wrap items-baseline justify-between gap-2">
              <p class="text-[11.5px] font-semibold text-ink">
                {{ message.sender_name }}
                <span class="ml-1 font-mono text-[9px] font-normal uppercase tracking-[0.08em] text-ink-3">{{ message.sender_role }}</span>
              </p>
              <span class="font-mono text-[9.5px] text-ink-3">{{ when(message.created_at) }}</span>
            </div>
            <p class="mt-1 text-[12.5px] leading-relaxed text-ink-2">{{ message.body }}</p>
            <div v-if="message.attachments.length" class="mt-1.5 flex flex-wrap gap-2">
              <span v-for="file in message.attachments" :key="file.id" class="inline-flex items-center gap-1 rounded-md border border-line bg-card px-2 py-1 font-mono text-[9.5px] text-ink-2">
                <Paperclip class="h-3 w-3" /> {{ file.name }}
              </span>
            </div>
          </li>
        </ul>

        <button
          v-if="bundle.files.length"
          type="button"
          class="mt-2 inline-flex cursor-pointer items-center gap-1.5 font-mono text-[9.5px] uppercase tracking-[0.1em] text-ink-3 hover:text-brand"
          @click="showFiles = !showFiles"
        >
          <Paperclip class="h-3 w-3" /> Job files · {{ bundle.files.length }}
        </button>
        <ul v-if="showFiles && bundle.files.length" class="mt-2 flex flex-wrap gap-2">
          <li v-for="file in bundle.files" :key="file.id">
            <a :href="file.url" target="_blank" rel="noopener" class="inline-flex items-center gap-1 rounded-md border border-line bg-card px-2 py-1 font-mono text-[9.5px] text-ink-2 hover:border-brand hover:text-brand">
              <Paperclip class="h-3 w-3" /> {{ file.name }}
            </a>
          </li>
        </ul>

        <form v-if="canReply" class="mt-3 border-t border-line/70 pt-3" @submit.prevent="send">
          <p v-if="sendError" class="mb-2 rounded-lg border border-red/40 bg-red-soft px-3 py-1.5 text-[11.5px] text-red">{{ sendError }}</p>
          <div class="flex items-end gap-2">
            <textarea
              v-model="replyBody"
              rows="2"
              maxlength="2000"
              :placeholder="`Reply on ${activeStage?.label ?? 'this stage'}…`"
              class="min-h-[44px] flex-1 resize-none rounded-xl border border-line-strong bg-card px-3.5 py-2.5 text-[12.5px] text-ink focus:border-brand focus:outline-none"
            />
            <button
              type="submit"
              :disabled="sending || !replyBody.trim()"
              class="inline-flex min-h-[44px] shrink-0 items-center gap-1.5 rounded-xl bg-brand px-4 text-[12px] font-bold text-white transition-colors hover:bg-brand-deep disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Loader2 v-if="sending" class="h-4 w-4 animate-spin" />
              <Send v-else class="h-4 w-4" />
              Send
            </button>
          </div>
          <p class="mt-1.5 font-mono text-[9px] uppercase tracking-[0.08em] text-ink-3">
            {{ replyNote }}
          </p>
        </form>
      </template>
    </div>
  </section>
</template>
