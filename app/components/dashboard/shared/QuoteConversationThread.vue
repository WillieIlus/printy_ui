<template>
  <div class="space-y-3">
    <div
      v-if="!messages.length"
      class="rounded-2xl border border-dashed border-[var(--p-border)] bg-[var(--p-bg-soft)] px-4 py-5 text-sm text-[var(--p-text-muted)]"
    >
      {{ emptyMessage }}
    </div>

    <article
      v-for="message in messages"
      :key="message.id"
      class="rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface)] p-4"
    >
      <div class="flex flex-wrap items-center gap-2">
        <BaseBadge :tone="senderTone(message.sender_role)">{{ senderLabel(message.sender_role) }}</BaseBadge>
        <BaseBadge tone="neutral">{{ typeLabel(message.message_type) }}</BaseBadge>
        <span class="text-xs text-[var(--p-text-muted)]">{{ formatDate(message.created_at) }}</span>
      </div>

      <p v-if="message.subject" class="mt-3 text-sm font-semibold text-[var(--p-text)]">
        {{ message.subject }}
      </p>
      <p class="mt-2 whitespace-pre-wrap text-sm leading-6 text-[var(--p-text-muted)]">
        {{ message.message }}
      </p>

      <div
        v-if="proposedRows(message).length"
        class="mt-4 grid gap-2 rounded-2xl bg-[var(--p-bg-soft)] p-3 sm:grid-cols-2"
      >
        <div
          v-for="row in proposedRows(message)"
          :key="row.label"
          class="rounded-xl border border-[var(--p-border)] bg-[var(--p-surface)] px-3 py-2"
        >
          <p class="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--p-text-muted)]">{{ row.label }}</p>
          <p class="mt-1 text-sm font-medium text-[var(--p-text)]">{{ row.value }}</p>
        </div>
      </div>
    </article>
  </div>
</template>

<script setup lang="ts">
import BaseBadge from '~/components/ui/BaseBadge.vue'
import type { QuoteConversationMessage } from '~/stores/quoteResponseLoop'

withDefaults(defineProps<{
  messages: QuoteConversationMessage[]
  emptyMessage?: string
}>(), {
  emptyMessage: 'No conversation yet.',
})

function senderLabel(senderRole: string) {
  if (senderRole === 'client') return 'You'
  if (senderRole === 'shop_owner' || senderRole === 'shop') return 'Shop'
  return 'System'
}

function senderTone(senderRole: string): 'primary' | 'info' | 'neutral' {
  if (senderRole === 'client') return 'primary'
  if (senderRole === 'shop_owner' || senderRole === 'shop') return 'info'
  return 'neutral'
}

function typeLabel(messageType: string) {
  return messageType
    .replace(/_/g, ' ')
    .replace(/\b\w/g, char => char.toUpperCase())
}

function formatDate(value: string) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

function proposedRows(message: QuoteConversationMessage) {
  const rows: Array<{ label: string; value: string }> = []
  if (message.proposed_price != null && message.proposed_price !== '') {
    rows.push({ label: 'Proposed price', value: `KES ${Number(message.proposed_price).toLocaleString()}` })
  }
  if (message.proposed_turnaround) {
    rows.push({ label: 'Proposed turnaround', value: message.proposed_turnaround })
  }
  if (message.proposed_quantity) {
    rows.push({ label: 'Proposed quantity', value: `${message.proposed_quantity}` })
  }
  if (message.proposed_material || message.proposed_gsm) {
    rows.push({
      label: 'Material / GSM',
      value: [message.proposed_material, message.proposed_gsm].filter(Boolean).join(' / '),
    })
  }
  if (message.proposed_size) {
    rows.push({ label: 'Proposed size', value: message.proposed_size })
  }
  if (message.proposed_finishing) {
    rows.push({
      label: 'Proposed finishing',
      value: Array.isArray(message.proposed_finishing)
        ? message.proposed_finishing.map(item => String(item)).join(', ')
        : String(message.proposed_finishing),
    })
  }
  return rows
}
</script>
