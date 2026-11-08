<script setup lang="ts">
import { useWorkflowStore } from '~/stores/workflow'

/**
 * Design toast host for the existing workflow store. Every trigger still calls
 * workflow.pushToast unchanged; this component only renders the queue that the
 * design layouts previously had no host for.
 */
const w = useWorkflowStore()

function toastColor(toast: { color: string }) {
  return toast.color.startsWith('#') ? toast.color : 'var(--color-brand)'
}
</script>

<template>
  <div
    class="pointer-events-none fixed bottom-5 left-1/2 z-[70] flex w-full max-w-[520px] -translate-x-1/2 flex-col items-center gap-2 px-4"
    aria-live="polite"
    aria-atomic="false"
    data-design-toasts
  >
    <TransitionGroup name="design-toast">
      <div
        v-for="toast in w.toasts"
        :key="toast.id"
        class="pointer-events-auto flex items-center gap-3 rounded-2xl border border-line-strong bg-ink px-4 py-3 text-paper shadow-lift"
      >
        <span
          class="h-2 w-2 shrink-0 rounded-full"
          :style="{ background: toastColor(toast), boxShadow: '0 0 10px currentColor' }"
        />
        <span class="font-mono text-[11px] leading-snug tracking-[0.04em]">{{ toast.text }}</span>
      </div>
    </TransitionGroup>
  </div>
</template>

<style scoped>
.design-toast-enter-active,
.design-toast-leave-active {
  transition: all 0.28s cubic-bezier(0.22, 1, 0.36, 1);
}
.design-toast-enter-from {
  opacity: 0;
  transform: translateY(10px) scale(0.98);
}
.design-toast-leave-to {
  opacity: 0;
  transform: translateY(6px) scale(0.98);
}
</style>
