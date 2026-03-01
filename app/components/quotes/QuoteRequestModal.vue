<template>
  <DialogRoot :open="open" @update:open="$emit('update:open', $event)">
    <DialogPortal to="#modal-portal">
      <DialogOverlay
        class="fixed inset-0 z-[9999] bg-black/50 transition-opacity"
        aria-hidden
        @click="$emit('update:open', false)"
      />
      <DialogContent
        class="quote-request-dialog fixed z-[9999] focus:outline-none"
        :aria-describedby="descriptionId"
      >
        <div
          class="quote-request-panel relative flex flex-col bg-white dark:bg-gray-900 shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
          role="document"
        >
          <div class="flex items-center justify-between p-4 sm:px-6 border-b border-gray-200 dark:border-gray-700 shrink-0">
            <DialogTitle class="text-lg font-semibold text-gray-900 dark:text-white">
              {{ title }}
            </DialogTitle>
            <DialogClose as-child>
              <UButton
                icon="i-lucide-x"
                color="neutral"
                variant="ghost"
                aria-label="Close"
              />
            </DialogClose>
          </div>
          <div class="flex-1 overflow-y-auto min-h-0">
            <slot />
          </div>
        </div>
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>

<script setup lang="ts">
import {
  DialogRoot,
  DialogPortal,
  DialogOverlay,
  DialogContent,
  DialogTitle,
  DialogClose,
} from 'reka-ui'

defineProps<{
  open: boolean
  title: string
}>()

defineEmits<{ 'update:open': [value: boolean] }>()

const descriptionId = 'quote-request-desc'
</script>

<style scoped>
/* Desktop: centered modal, max-width card */
@media (min-width: 769px) {
  .quote-request-dialog {
    inset: 0;
    display: flex;
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
}

/* Mobile: full-screen drawer from bottom */
@media (max-width: 768px) {
  .quote-request-dialog {
    inset: 0;
    top: auto;
    display: flex;
    align-items: flex-end;
    justify-content: center;
    padding: 0;
  }

  .quote-request-panel {
    width: 100%;
    max-height: 92dvh;
    border-radius: 1rem 1rem 0 0;
  }
}
</style>
