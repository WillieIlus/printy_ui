<template>
  <div class="upload-progress-card">
    <div class="flex items-start justify-between gap-3">
      <div class="min-w-0 flex-1 space-y-0.5">
        <p class="truncate text-sm font-semibold text-[var(--p-text)]">{{ fileName }}</p>
        <p class="text-xs text-[var(--p-text-muted)]">{{ formattedSize }}</p>
      </div>
      <button
        type="button"
        class="mt-0.5 shrink-0 rounded-lg p-1 text-[var(--p-text-muted)] transition hover:bg-[color:color-mix(in_srgb,var(--p-border)_40%,transparent)] hover:text-[var(--p-text)]"
        :aria-label="state === 'uploading' ? 'Cancel upload' : 'Remove file'"
        @click="emit('remove')"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </div>

    <div class="space-y-2">
      <div class="upload-progress-track">
        <div
          class="upload-progress-fill"
          :class="state === 'error' ? 'upload-progress-fill-error' : ''"
          :style="{ width: `${clampedProgress}%` }"
        />
      </div>
      <div class="flex items-center justify-between gap-4">
        <span class="text-xs font-bold text-[var(--p-text)]">
          {{ state === 'error' ? 'Failed' : `${clampedProgress}%` }}
        </span>
        <span class="text-[11px] text-[var(--p-text-muted)]">{{ statusLine }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  fileName: string
  fileSize: number
  uploadedBytes: number
  totalBytes: number
  progress: number
  speedBytesPerSecond: number | null
  etaSeconds: number | null
  state: 'idle' | 'uploading' | 'success' | 'error' | 'cancelled'
  errorMessage?: string | null
}>()

const emit = defineEmits<{ remove: [] }>()

const clampedProgress = computed(() => Math.min(100, Math.max(0, props.progress || 0)))

const formattedSize = computed(() => {
  const n = props.fileSize || props.totalBytes
  return n ? formatBytes(n) : ''
})

const statusLine = computed(() => {
  if (props.state === 'error') return props.errorMessage ?? 'Upload failed'
  if (props.state === 'success') return 'Upload complete'
  if (props.state === 'cancelled') return 'Cancelled'

  const speed = props.speedBytesPerSecond
  const eta = props.etaSeconds

  if (!speed || speed <= 0) return 'Calculating time left…'

  const speedStr = `${formatBytes(speed)}/s`
  const etaStr = eta != null && eta > 0 ? formatEta(eta) : null
  return etaStr ? `${speedStr} · ${etaStr}` : speedStr
})

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`
}

function formatEta(seconds: number): string {
  if (seconds < 5) return 'Almost done'
  if (seconds < 60) return `About ${Math.round(seconds)}s left`
  const m = Math.floor(seconds / 60)
  const s = Math.round(seconds % 60)
  return s > 0 ? `About ${m}m ${s}s left` : `About ${m}m left`
}
</script>

<style scoped>
.upload-progress-card {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  border: 1px solid color-mix(in srgb, var(--p-border) 72%, transparent);
  border-radius: 1rem;
  background: color-mix(in srgb, var(--p-surface) 98%, white);
  box-shadow: 0 2px 8px rgb(15 23 42 / 0.05);
  padding: 1rem;
}

.upload-progress-track {
  height: 0.45rem;
  overflow: hidden;
  border-radius: 999px;
  background: color-mix(in srgb, var(--p-border) 48%, transparent);
}

.upload-progress-fill {
  height: 100%;
  border-radius: 999px;
  background: linear-gradient(90deg, var(--p-primary), color-mix(in srgb, var(--p-primary) 70%, white));
  transition: width 0.3s ease;
}

.upload-progress-fill-error {
  background: var(--p-error, #dc2626);
}
</style>
