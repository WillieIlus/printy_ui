<template>
  <div class="flex flex-col gap-2">
    <div class="flex gap-2">
      <UButton
        variant="outline"
        size="sm"
        block
        :disabled="!canCopy"
        @click="copyToClipboard"
      >
        <UIcon name="i-lucide-copy" class="w-4 h-4 mr-1.5" />
        Copy
      </UButton>
      <UButton
        variant="outline"
        size="sm"
        block
        :disabled="!canCopy"
        @click="openWhatsApp"
      >
        <UIcon name="i-lucide-message-circle" class="w-4 h-4 mr-1.5" />
        WhatsApp
      </UButton>
    </div>
    <UButton
      v-if="showSave"
      color="primary"
      size="sm"
      block
      :disabled="!canSave"
      :loading="saving"
      @click="$emit('save')"
    >
      <UIcon name="i-lucide-save" class="w-4 h-4 mr-1.5" />
      Save Quote
    </UButton>
    <UButton
      v-if="showPrint && printUrl"
      variant="outline"
      size="sm"
      block
      :disabled="!canPrint"
      @click="openPrint"
    >
      <UIcon name="i-lucide-file-output" class="w-4 h-4 mr-1.5" />
      Export PDF
    </UButton>
  </div>
</template>

<script setup lang="ts">
import { buildQuoteMessage, getWhatsAppShareUrl } from '~/utils/quoteMessage'
import type { QuoteSnapshot } from '~/utils/quoteMessage'
import { useNotification } from '~/composables/useNotification'

const props = withDefaults(
  defineProps<{
    snapshot: QuoteSnapshot | null
    showSave?: boolean
    showPrint?: boolean
    printUrl?: string | null
    saving?: boolean
  }>(),
  { showSave: true, showPrint: true, printUrl: null, saving: false }
)

defineEmits<{
  save: []
}>()

const notification = useNotification()

const canCopy = computed(() => !!props.snapshot && parseFloat(props.snapshot.suggestedPrice) > 0)
const canSave = computed(() => canCopy.value)
const canPrint = computed(() => !!props.printUrl)

const message = computed(() =>
  props.snapshot ? buildQuoteMessage(props.snapshot) : ''
)

async function copyToClipboard() {
  if (!message.value) return
  try {
    await navigator.clipboard.writeText(message.value)
    notification.success('Quote copied to clipboard')
  } catch {
    notification.error('Could not copy. Try WhatsApp instead.')
  }
}

function openWhatsApp() {
  if (!message.value) return
  const url = getWhatsAppShareUrl(message.value, props.snapshot?.shopPhone)
  window.open(url, '_blank', 'noopener,noreferrer')
}

function openPrint() {
  if (!props.printUrl) return
  window.open(props.printUrl, '_blank', 'noopener,noreferrer')
}
</script>
