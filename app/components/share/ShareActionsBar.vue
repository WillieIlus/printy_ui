<template>
  <div v-if="summaryText" class="flex flex-wrap items-center gap-2">
    <UButton
      variant="soft"
      size="sm"
      color="neutral"
      @click="copySummary"
    >
      <UIcon name="i-lucide-copy" class="w-4 h-4 mr-1.5" />
      {{ copyLabel }}
    </UButton>
    <UButton
      variant="soft"
      size="sm"
      color="neutral"
      @click="openWhatsApp"
    >
      <UIcon name="i-lucide-message-circle" class="w-4 h-4 mr-1.5" />
      Send via WhatsApp
    </UButton>
    <p v-if="attachments?.length" class="text-xs text-[var(--p-text-muted)] mt-1 w-full">
      <span class="font-medium">Attachments:</span>
      <a
        v-for="att in attachments"
        :key="att.id"
        :href="att.file"
        target="_blank"
        rel="noopener noreferrer"
        class="ml-1 text-flamingo-600 dark:text-flamingo-400 hover:underline"
      >
        {{ att.name || 'Download' }}
      </a>
    </p>
  </div>
</template>

<script setup lang="ts">
import { getWhatsAppShareUrl } from '~/utils/quoteMessage'

const props = withDefaults(
  defineProps<{
    summaryText: string
    copyLabel?: string
    attachments?: { id: number; file: string; name: string }[]
  }>(),
  { copyLabel: 'Copy summary', attachments: () => [] }
)

const toast = useToast()

function copySummary() {
  navigator.clipboard.writeText(props.summaryText).then(
    () => toast.add({ title: 'Copied to clipboard', color: 'success' }),
    () => toast.add({ title: 'Could not copy', color: 'error' })
  )
}

function openWhatsApp() {
  const url = getWhatsAppShareUrl(props.summaryText)
  window.open(url, '_blank', 'noopener,noreferrer')
}
</script>
