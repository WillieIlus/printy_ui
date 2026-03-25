<template>
  <div v-if="summaryText" class="flex flex-wrap items-center gap-2">
    <UButton
      variant="soft"
      size="sm"
      color="neutral"
      :loading="copying"
      @click="copySummary"
    >
      <UIcon :name="copied ? 'i-lucide-check' : 'i-lucide-copy'" class="w-4 h-4 mr-1.5" />
      {{ copyLabel }}
    </UButton>
    <UButton
      variant="soft"
      size="sm"
      color="neutral"
      :loading="openingWhatsApp"
      @click="openWhatsApp"
    >
      <UIcon :name="openingWhatsApp ? 'i-lucide-loader-circle' : 'i-lucide-message-circle'" class="w-4 h-4 mr-1.5" :class="{ 'animate-spin': openingWhatsApp }" />
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
const copied = ref(false)
const copying = ref(false)
const openingWhatsApp = ref(false)
let copiedTimer: ReturnType<typeof setTimeout> | null = null

function showCopiedState() {
  copied.value = true
  if (copiedTimer) clearTimeout(copiedTimer)
  copiedTimer = setTimeout(() => {
    copied.value = false
    copiedTimer = null
  }, 1800)
}

async function copySummary() {
  copying.value = true
  try {
    await navigator.clipboard.writeText(props.summaryText)
    showCopiedState()
    toast.add({ title: 'Copied to clipboard', color: 'success' })
  } catch {
    toast.add({ title: 'Could not copy', color: 'error' })
  } finally {
    copying.value = false
  }
}

async function openWhatsApp() {
  openingWhatsApp.value = true
  try {
    const url = getWhatsAppShareUrl(props.summaryText)
    window.open(url, '_blank', 'noopener,noreferrer')
  } finally {
    setTimeout(() => {
      openingWhatsApp.value = false
    }, 600)
  }
}

onUnmounted(() => {
  if (copiedTimer) clearTimeout(copiedTimer)
})
</script>
