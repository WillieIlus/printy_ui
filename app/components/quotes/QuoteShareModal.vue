<script setup lang="ts">
import {
  DialogRoot,
  DialogPortal,
  DialogOverlay,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from 'reka-ui'
import { getWhatsAppShareUrl } from '~/utils/quoteMessage'

const props = defineProps<{
  open: boolean
  shareUrl: string
  whatsappText: string
}>()

const emit = defineEmits<{ 'update:open': [value: boolean] }>()

const toast = useToast()

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

function handleOpenChange(value: boolean) {
  emit('update:open', value)
}

const descriptionId = 'quote-share-desc'
</script>

<template>
  <DialogRoot :open="open" @update:open="handleOpenChange">
    <DialogPortal to="#modal-portal">
      <DialogOverlay
        class="fixed inset-0 z-[9999] bg-black/50"
        aria-hidden
        @click="handleOpenChange(false)"
      />
      <DialogContent
        class="fixed inset-0 z-[9999] flex items-center justify-center p-4 focus:outline-none"
        :aria-describedby="descriptionId"
      >
        <div
          class="relative w-full max-w-md rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface)] p-6 shadow-xl"
          role="document"
        >
          <div class="flex items-center justify-between mb-4">
            <div>
              <DialogTitle class="text-lg font-semibold text-[var(--p-text)]">
                Share Quote
              </DialogTitle>
              <DialogDescription :id="descriptionId" class="mt-0.5 text-sm text-[var(--p-text-muted)]">
                Copy the link or WhatsApp summary to share with your customer.
              </DialogDescription>
            </div>
            <DialogClose as-child>
              <UButton icon="i-lucide-x" color="neutral" variant="soft" aria-label="Close" />
            </DialogClose>
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
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>
