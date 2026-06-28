<template>
  <div :class="wrapperClass">
    <div :class="bubbleClass">
      <p class="text-xs font-semibold uppercase tracking-[0.14em] opacity-70">{{ message.sender_role || 'message' }}</p>
      <p class="mt-2 text-sm leading-6">{{ message.body || message.subject }}</p>
      <p class="mt-3 text-xs opacity-60">{{ formatDate(message.created_at || message.sent_at) }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  message: Record<string, any>
  mine?: boolean
}>()

const wrapperClass = computed(() => props.mine ? 'flex justify-end' : 'flex justify-start')
const bubbleClass = computed(() => props.mine
  ? 'max-w-2xl rounded-2xl rounded-br-md bg-primary-600 px-4 py-3 text-white'
  : 'max-w-2xl rounded-2xl rounded-bl-md border border-slate-200 bg-white px-4 py-3 text-slate-900')

function formatDate(value?: string) {
  return value ? new Date(value).toLocaleString() : ''
}
</script>
