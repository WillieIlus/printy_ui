<template>
  <DialogRoot :open="open" @update:open="$emit('update:open', $event)">
    <DialogPortal to="#modal-portal">
      <DialogOverlay
        class="fixed inset-0 z-[9999] bg-black/50"
        aria-hidden
        @click="$emit('update:open', false)"
      />
      <DialogContent
        class="fixed inset-0 z-[9999] flex items-end justify-center p-0 focus:outline-none sm:items-center sm:p-4"
        :aria-describedby="descriptionId"
        @open-auto-focus="onOpenAutoFocus"
      >
        <div
          class="relative flex max-h-[85dvh] w-full flex-col overflow-hidden rounded-t-xl border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-900 sm:max-h-[90dvh] sm:max-w-lg sm:rounded-xl"
          role="document"
        >
          <div class="flex items-center justify-between p-4 sm:px-6 border-b border-gray-200 dark:border-gray-700 shrink-0">
            <div>
              <DialogTitle class="text-lg font-semibold text-gray-900 dark:text-white">
                {{ title }}
              </DialogTitle>
              <DialogDescription
                v-if="description"
                :id="descriptionId"
                class="mt-0.5 text-sm text-gray-500 dark:text-gray-400"
              >
                {{ description }}
              </DialogDescription>
              <DialogDescription v-else :id="descriptionId" class="sr-only">
                Modal dialog
              </DialogDescription>
            </div>
            <DialogClose as-child>
              <UButton
                icon="i-lucide-x"
                color="neutral"
                variant="ghost"
                aria-label="Close"
              />
            </DialogClose>
          </div>
          <div ref="slotRef" class="p-4 sm:p-6 overflow-y-auto flex-1">
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
  DialogDescription,
  DialogClose,
  useId,
} from 'reka-ui'

defineProps<{
  open: boolean
  title: string
  description?: string
}>()

defineEmits<{ 'update:open': [value: boolean] }>()

const descriptionId = useId(undefined, 'dialog-desc')
const slotRef = ref<HTMLElement | null>(null)

function onOpenAutoFocus(e: Event) {
  nextTick(() => {
    const slot = slotRef.value
    if (!slot) return
    const first = slot.querySelector<HTMLElement>(
      'input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), [tabindex]:not([tabindex="-1"])'
    )
    if (first) {
      ;(e as FocusEvent).preventDefault()
      first.focus()
    }
  })
}
</script>
