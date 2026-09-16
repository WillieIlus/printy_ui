<template>
  <div class="pointer-events-none fixed bottom-5 left-1/2 z-[70] flex w-full max-w-[520px] -translate-x-1/2 flex-col items-center gap-2 px-4">
    <TransitionGroup name="toast">
      <div
        v-for="t in w.toasts"
        :key="t.id"
        class="flex items-center gap-3 rounded-2xl border px-4 py-3 shadow-2xl"
        :style="toastStyle"
      >
        <span
          class="h-2 w-2 shrink-0 rounded-full"
          :style="{ background: toastColor(t), boxShadow: '0 0 10px currentColor' }"
        />
        <span class="font-mono2 text-[11px] leading-snug tracking-[0.04em]">{{ t.text }}</span>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useWorkflowStore } from '~/stores/workflow'
import { useProtoTheme } from '~/composables/useProtoTheme'

const w = useWorkflowStore()
const { theme } = useProtoTheme()

const toastStyle = computed(() => ({
  background: theme.value.dark ? '#131720' : '#1B1710',
  borderColor: 'color-mix(in srgb, white 10%, transparent)',
  color: '#fff',
}))

function toastColor(t: { color: string }) {
  return t.color.startsWith('#') ? t.color : 'var(--accent)'
}
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.28s cubic-bezier(0.22, 1, 0.36, 1);
}
.toast-enter-from {
  opacity: 0;
  transform: translateY(26px) scale(0.95);
}
.toast-leave-to {
  opacity: 0;
  transform: translateY(12px) scale(0.97);
}
.toast-move {
  transition: all 0.28s cubic-bezier(0.22, 1, 0.36, 1);
}
</style>