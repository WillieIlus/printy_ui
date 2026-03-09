<script setup lang="ts">
import { getWhatsAppShareUrl } from '~/utils/quoteMessage'

const props = defineProps<{
  open: boolean
  shareUrl: string
  whatsappText: string
}>()

const emit = defineEmits<{ 'update:open': [value: boolean] }>()

const toast = useToast()

function close() {
  emit('update:open', false)
}

function copyLink() {
  navigator.clipboard.writeText(props.shareUrl).then(
    () => toast.add({ title: 'Link copied', color: 'success' }),
    () => toast.add({ title: 'Could not copy link', color: 'error' })
  )
}

function copyWhatsApp() {
  navigator.clipboard.writeText(props.whatsappText).then(
    () => toast.add({ title: 'WhatsApp summary copied', color: 'success' }),
    () => toast.add({ title: 'Could not copy', color: 'error' })
  )
}

function sendOnWhatsApp() {
  const url = getWhatsAppShareUrl(props.whatsappText)
  window.open(url, '_blank', 'noopener,noreferrer')
}

watch(() => props.open, (open) => {
  if (open) document.body.style.overflow = 'hidden'
  else document.body.style.overflow = ''
}, { immediate: true })

onUnmounted(() => {
  document.body.style.overflow = ''
})
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="open"
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
        role="dialog"
        aria-modal="true"
        @keydown.esc="close"
      >
        <div
          class="absolute inset-0 bg-black/50 backdrop-blur-sm"
          aria-hidden
          @click="close"
        />
        <div
          class="modal-panel relative w-full max-w-md rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface)] p-6 shadow-xl z-10"
          @click.stop
        >
          <div class="flex items-center justify-between mb-4">
            <div>
              <h2 class="text-lg font-semibold text-[var(--p-text)]">Share Quote</h2>
              <p class="mt-0.5 text-sm text-[var(--p-text-muted)]">
                Copy the link or WhatsApp summary to share with your customer.
              </p>
            </div>
            <button
              type="button"
              class="rounded-lg p-1.5 text-[var(--p-text-muted)] hover:text-[var(--p-text)] hover:bg-[var(--p-surface-sunken)] transition-colors"
              aria-label="Close"
              @click="close"
            >
              <UIcon name="i-lucide-x" class="h-5 w-5" />
            </button>
          </div>

          <div class="space-y-3">
            <UButton
              block
              variant="outline"
              color="neutral"
              :disabled="!shareUrl"
              @click="copyLink"
            >
              <UIcon name="i-lucide-link" class="h-4 w-4 mr-2" />
              Copy link
            </UButton>
            <UButton
              block
              variant="outline"
              color="neutral"
              :disabled="!whatsappText"
              @click="copyWhatsApp"
            >
              <UIcon name="i-lucide-copy" class="h-4 w-4 mr-2" />
              Copy WhatsApp summary
            </UButton>
            <UButton
              block
              color="success"
              :disabled="!whatsappText"
              @click="sendOnWhatsApp"
            >
              <UIcon name="i-lucide-message-circle" class="h-4 w-4 mr-2" />
              Send on WhatsApp
            </UButton>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
