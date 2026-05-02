<template>
  <article
    class="pointer-events-auto relative overflow-hidden rounded-xl border shadow-[0_24px_60px_rgba(15,23,42,0.2)]"
    :class="theme.wrapper"
    :role="ariaRole"
    :aria-live="ariaLive"
    @mouseenter="pauseTimer"
    @mouseleave="resumeTimer"
  >
    <div class="flex items-start gap-3 p-4">
      <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white shadow-sm" :class="theme.iconWrap">
        <Icon :name="theme.icon" :class="['size-4.5', toast.type === 'loading' ? 'animate-spin' : '']" />
      </div>
      <div class="min-w-0 flex-1">
        <p class="text-sm font-semibold" :class="theme.title">{{ toast.title }}</p>
        <p v-if="toast.message" class="mt-1 text-sm leading-5" :class="theme.body">{{ toast.message }}</p>
        <button
          v-if="toast.action && toast.actionLabel"
          type="button"
          class="mt-3 inline-flex items-center rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-900 transition hover:border-slate-400 hover:bg-slate-50"
          @click="toast.action?.()"
        >
          {{ toast.actionLabel }}
        </button>
      </div>
      <button
        type="button"
        class="rounded-md p-1 text-slate-500 transition hover:bg-white hover:text-slate-800"
        aria-label="Dismiss toast"
        @click="$emit('dismiss')"
      >
        <Icon name="lucide:x" class="size-4" />
      </button>
    </div>
    <div v-if="showProgressBar" class="absolute inset-x-0 bottom-0 h-1 bg-black/5">
      <div
        class="h-full origin-left"
        :class="[theme.progress, showCountdown ? 'toast-countdown' : 'transition-[width] duration-200 ease-out']"
        :style="progressStyle"
      />
    </div>
  </article>
</template>

<script setup lang="ts">
import type { ToastRecord, ToastType } from '~/stores/toast'

const props = defineProps<{
  toast: ToastRecord
}>()

const emit = defineEmits<{ dismiss: [] }>()

const elapsedMs = ref(0)
const remainingMs = ref(props.toast.duration ?? 0)
const paused = ref(false)
const activeSince = ref(Date.now())
let timeoutId: ReturnType<typeof setTimeout> | null = null

const themes: Record<ToastType, { wrapper: string; iconWrap: string; icon: string; title: string; body: string; progress: string }> = {
  success: {
    wrapper: 'border-emerald-200 bg-emerald-50',
    iconWrap: 'bg-emerald-500',
    icon: 'lucide:check',
    title: 'text-emerald-950',
    body: 'text-emerald-950',
    progress: 'bg-emerald-500',
  },
  error: {
    wrapper: 'border-red-200 bg-red-50',
    iconWrap: 'bg-red-500',
    icon: 'lucide:circle-x',
    title: 'text-red-950',
    body: 'text-red-950',
    progress: 'bg-red-500',
  },
  warning: {
    wrapper: 'border-orange-200 bg-orange-50',
    iconWrap: 'bg-orange-500',
    icon: 'lucide:triangle-alert',
    title: 'text-orange-950',
    body: 'text-orange-950',
    progress: 'bg-orange-500',
  },
  info: {
    wrapper: 'border-blue-200 bg-blue-50',
    iconWrap: 'bg-blue-500',
    icon: 'lucide:info',
    title: 'text-blue-950',
    body: 'text-blue-950',
    progress: 'bg-blue-500',
  },
  loading: {
    wrapper: 'border-slate-200 bg-slate-50',
    iconWrap: 'bg-slate-700',
    icon: 'lucide:loader-2',
    title: 'text-slate-950',
    body: 'text-slate-950',
    progress: 'bg-slate-700',
  },
}

const theme = computed(() => themes[props.toast.type])
const ariaRole = computed(() => (props.toast.type === 'error' || props.toast.type === 'warning' ? 'alert' : 'status'))
const ariaLive = computed(() => (props.toast.type === 'error' || props.toast.type === 'warning' ? 'assertive' : 'polite'))
const showCountdown = computed(() => !props.toast.persistent && typeof props.toast.duration === 'number' && props.toast.duration > 0 && props.toast.progress == null)
const showProgressBar = computed(() => showCountdown.value || typeof props.toast.progress === 'number')
const progressStyle = computed(() => {
  if (typeof props.toast.progress === 'number') {
    return { width: `${props.toast.progress}%` }
  }

  return {
    animationDuration: `${props.toast.duration ?? 5000}ms`,
    animationDelay: `${-elapsedMs.value}ms`,
    animationPlayState: paused.value ? 'paused' : 'running',
  }
})

function clearTimer() {
  if (timeoutId) {
    clearTimeout(timeoutId)
    timeoutId = null
  }
}

function scheduleTimer(delayMs: number) {
  clearTimer()
  if (props.toast.persistent || !props.toast.duration) return
  if (delayMs <= 0) {
    emit('dismiss')
    return
  }
  timeoutId = setTimeout(() => {
    clearTimer()
    emit('dismiss')
  }, delayMs)
}

function pauseTimer() {
  if (!showCountdown.value || paused.value) return
  paused.value = true
  const now = Date.now()
  elapsedMs.value = Math.min(props.toast.duration ?? 0, elapsedMs.value + (now - activeSince.value))
  remainingMs.value = Math.max(0, (props.toast.duration ?? 0) - elapsedMs.value)
  clearTimer()
}

function resumeTimer() {
  if (!showCountdown.value || !paused.value) return
  paused.value = false
  activeSince.value = Date.now()
  scheduleTimer(remainingMs.value)
}

onMounted(() => {
  activeSince.value = Date.now()
  scheduleTimer(props.toast.duration ?? 0)
})

watch(() => props.toast.duration, (duration) => {
  if (!showCountdown.value || !duration) return
  elapsedMs.value = 0
  remainingMs.value = duration
  paused.value = false
  activeSince.value = Date.now()
  scheduleTimer(duration)
})

onBeforeUnmount(() => {
  clearTimer()
})
</script>

<style scoped>
.toast-countdown {
  animation-name: toast-countdown;
  animation-timing-function: linear;
  animation-fill-mode: forwards;
}

@keyframes toast-countdown {
  from {
    transform: scaleX(1);
  }

  to {
    transform: scaleX(0);
  }
}
</style>
