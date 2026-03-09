<template>
  <Teleport to="body">
    <Transition name="drawer">
      <div
        v-if="open"
        class="quote-request-overlay fixed inset-0 z-50 flex"
        role="dialog"
        aria-modal="true"
        @keydown.esc="$emit('update:open', false)"
      >
        <!-- Backdrop -->
        <div
          class="absolute inset-0 bg-black/50 backdrop-blur-sm"
          aria-hidden
          @click="$emit('update:open', false)"
        />
        <!-- Panel (desktop: centered modal, mobile: drawer from bottom) -->
        <div
          class="quote-request-panel drawer-panel relative flex flex-col bg-white dark:bg-gray-900 shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
          @click.stop
      role="dialog"
      aria-modal="true"
      :aria-labelledby="titleId"
    >
      <div class="flex items-center justify-between p-4 sm:px-6 border-b border-gray-200 dark:border-gray-700 shrink-0">
        <h2 :id="titleId" class="text-lg font-semibold text-gray-900 dark:text-white">
          {{ title }}
        </h2>
        <button
          type="button"
          class="rounded-lg p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          aria-label="Close"
          @click="$emit('update:open', false)"
        >
          <UIcon name="i-lucide-x" class="h-5 w-5" />
        </button>
      </div>
      <div class="flex-1 overflow-y-auto min-h-0">
        <slot />
      </div>
    </div>
    </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
const props = defineProps<{
  open: boolean
  title: string
}>()

const emit = defineEmits<{ 'update:open': [value: boolean] }>()

const titleId = 'quote-request-title'

watch(() => props.open, (open) => {
  if (open) document.body.style.overflow = 'hidden'
  else document.body.style.overflow = ''
}, { immediate: true })

onUnmounted(() => {
  document.body.style.overflow = ''
})
</script>

<style scoped>
/* Desktop: centered modal, max-width card */
.quote-request-overlay {
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
}

.quote-request-panel {
  max-width: 42rem;
  width: 100%;
  max-height: calc(100dvh - 3rem);
  border-radius: 1rem;
}

@media (max-width: 768px) {
  /* Mobile: full-screen drawer from bottom */
  .quote-request-overlay {
    align-items: flex-end;
    justify-content: center;
    padding: 0;
  }

  .quote-request-panel {
    max-width: none;
    max-height: 92dvh;
    border-radius: 1rem 1rem 0 0;
  }
}
</style>
