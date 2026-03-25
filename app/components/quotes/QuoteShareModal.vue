<script setup lang="ts">
import { getWhatsAppShareUrl } from '~/utils/quoteMessage'

const props = defineProps<{
  open: boolean
  shareUrl: string
  whatsappText: string
}>()

const emit = defineEmits<{ 'update:open': [value: boolean] }>()

const toast = useToast()
const copiedLink = ref(false)
const copiedMessage = ref(false)
const copyingLink = ref(false)
const copyingMessage = ref(false)
const openingWhatsApp = ref(false)
let copiedLinkTimer: ReturnType<typeof setTimeout> | null = null
let copiedMessageTimer: ReturnType<typeof setTimeout> | null = null

function close() {
  emit('update:open', false)
}

function setCopiedState(kind: 'link' | 'message') {
  const stateRef = kind === 'link' ? copiedLink : copiedMessage
  const timerRef = kind === 'link' ? copiedLinkTimer : copiedMessageTimer
  stateRef.value = true
  if (timerRef) clearTimeout(timerRef)
  const nextTimer = setTimeout(() => {
    stateRef.value = false
  }, 1800)
  if (kind === 'link') copiedLinkTimer = nextTimer
  else copiedMessageTimer = nextTimer
}

async function copyLink() {
  copyingLink.value = true
  try {
    await navigator.clipboard.writeText(props.shareUrl)
    setCopiedState('link')
    toast.add({ title: 'Link copied', color: 'success' })
  } catch {
    toast.add({ title: 'Could not copy link', color: 'error' })
  } finally {
    copyingLink.value = false
  }
}

async function copyWhatsApp() {
  copyingMessage.value = true
  try {
    await navigator.clipboard.writeText(props.whatsappText)
    setCopiedState('message')
    toast.add({ title: 'WhatsApp summary copied', color: 'success' })
  } catch {
    toast.add({ title: 'Could not copy', color: 'error' })
  } finally {
    copyingMessage.value = false
  }
}

async function sendOnWhatsApp() {
  openingWhatsApp.value = true
  try {
    const url = getWhatsAppShareUrl(props.whatsappText)
    window.open(url, '_blank', 'noopener,noreferrer')
  } finally {
    setTimeout(() => {
      openingWhatsApp.value = false
    }, 600)
  }
}

watch(() => props.open, (open) => {
  if (open) document.body.style.overflow = 'hidden'
  else document.body.style.overflow = ''
}, { immediate: true })

onUnmounted(() => {
  document.body.style.overflow = ''
  if (copiedLinkTimer) clearTimeout(copiedLinkTimer)
  if (copiedMessageTimer) clearTimeout(copiedMessageTimer)
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
              :loading="copyingLink"
              @click="copyLink"
            >
              <UIcon :name="copiedLink ? 'i-lucide-check' : 'i-lucide-link'" class="h-4 w-4 mr-2" />
              Copy link
            </UButton>
            <UButton
              block
              variant="outline"
              color="neutral"
              :disabled="!whatsappText"
              :loading="copyingMessage"
              @click="copyWhatsApp"
            >
              <UIcon :name="copiedMessage ? 'i-lucide-check' : 'i-lucide-copy'" class="h-4 w-4 mr-2" />
              Copy WhatsApp summary
            </UButton>
            <UButton
              block
              color="success"
              :disabled="!whatsappText"
              :loading="openingWhatsApp"
              @click="sendOnWhatsApp"
            >
              <UIcon :name="openingWhatsApp ? 'i-lucide-loader-circle' : 'i-lucide-message-circle'" class="h-4 w-4 mr-2" :class="{ 'animate-spin': openingWhatsApp }" />
              Send on WhatsApp
            </UButton>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
