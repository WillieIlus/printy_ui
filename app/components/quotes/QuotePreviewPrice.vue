<template>
  <div class="rounded-2xl border border-amber-200/80 dark:border-amber-800/50 bg-white dark:bg-stone-900 overflow-hidden">
    <div class="px-6 py-4 border-b border-amber-200/60 dark:border-amber-800/40">
      <h3 class="font-semibold text-stone-800 dark:text-stone-100">Price preview</h3>
      <p v-if="!result && !error" class="text-sm text-stone-500 dark:text-stone-400">
        Get an estimate for your quote
      </p>
    </div>
    <div class="p-6">
      <template v-if="loading">
        <p class="text-amber-600 dark:text-amber-400 font-medium mb-4">
          {{ calculatingText }}
        </p>
        <div class="space-y-3">
          <div
            v-for="i in 4"
            :key="i"
            class="h-5 rounded bg-amber-100/80 dark:bg-amber-900/30 animate-pulse"
            :style="{ width: `${60 + (i % 3) * 15}%` }"
          />
        </div>
      </template>
      <template v-else-if="error">
        <p class="text-red-600 dark:text-red-400 text-sm">{{ error }}</p>
      </template>
      <template v-else-if="result">
        <div class="space-y-2">
          <div
            v-for="(line, idx) in revealedLines"
            :key="idx"
            class="flex justify-between text-sm"
            :class="{ 'pl-3': line.amount && idx > 0 }"
          >
            <span class="text-stone-600 dark:text-stone-400">{{ line.label }}</span>
            <span v-if="line.amount" class="font-medium text-stone-800 dark:text-stone-100 tabular-nums">
              {{ line.amount }} {{ result.currency }}
            </span>
          </div>
        </div>
        <div
          v-if="showTotal"
          class="mt-4 pt-4 border-t border-amber-200/60 dark:border-amber-800/40 flex justify-between font-semibold text-stone-800 dark:text-stone-100"
        >
          <span>Total</span>
          <span class="tabular-nums">{{ result.total }} {{ result.currency }}</span>
        </div>
        <p v-if="result.hasNegotiable" class="mt-2 text-xs text-stone-500 dark:text-stone-400">
          Some charges are negotiable.
        </p>
      </template>
      <UButton
        v-if="!loading && (!result || hasItems)"
        color="primary"
        class="mt-4"
        :disabled="!draftId || !hasItems"
        @click="calculate"
      >
        <UIcon name="i-lucide-calculator" class="mr-2 h-4 w-4" />
        {{ result ? 'Recalculate' : 'Calculate' }}
      </UButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PreviewPriceResponse } from '~/services/quoteDraft'
import { previewPrice } from '~/services/quoteDraft'

const props = defineProps<{
  draftId: number | null
  hasItems?: boolean
}>()

const result = ref<PreviewPriceResponse | null>(null)
const loading = ref(false)
const error = ref<string | null>(null)
const revealedLines = ref<{ label: string; amount: string }[]>([])
const showTotal = ref(false)

const calculatingText = ref('Tuna-calculate…')

const messages = ['Tuna-calculate…', 'Calculating quote…']
let messageInterval: ReturnType<typeof setInterval> | null = null

function startCalculatingMessages() {
  let i = 0
  calculatingText.value = messages[0]
  messageInterval = setInterval(() => {
    i = (i + 1) % messages.length
    calculatingText.value = messages[i]
  }, 1200)
}

function stopCalculatingMessages() {
  if (messageInterval) {
    clearInterval(messageInterval)
    messageInterval = null
  }
}

async function revealLinesProgressive(lines: { label: string; amount: string }[]) {
  revealedLines.value = []
  showTotal.value = false
  for (let i = 0; i < lines.length; i++) {
    await new Promise((r) => setTimeout(r, 100))
    revealedLines.value = [...lines.slice(0, i + 1)]
  }
  await new Promise((r) => setTimeout(r, 200))
  showTotal.value = true
}

async function calculate() {
  if (!props.draftId || !props.hasItems) return
  loading.value = true
  error.value = null
  result.value = null
  revealedLines.value = []
  showTotal.value = false

  const minDelay = 3000 + Math.random() * 3000
  startCalculatingMessages()

  const apiPromise = previewPrice(props.draftId)
  const delayPromise = new Promise<void>((r) => setTimeout(r, minDelay))

  try {
    const [apiResult] = await Promise.all([apiPromise, delayPromise])
    result.value = apiResult
    stopCalculatingMessages()
    await revealLinesProgressive(apiResult.lines)
  } catch (err) {
    stopCalculatingMessages()
    error.value = err instanceof Error ? err.message : 'Failed to calculate'
  } finally {
    loading.value = false
  }
}
</script>
