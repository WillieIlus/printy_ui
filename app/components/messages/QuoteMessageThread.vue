<template>
  <div class="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
    <UiCard class="space-y-4">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm font-semibold uppercase tracking-[0.18em] text-primary-600">Conversation</p>
          <h2 class="mt-2 text-2xl font-black text-slate-950">Quote thread</h2>
        </div>
        <StatusBadge :value="request.status" />
      </div>
      <div class="space-y-4">
        <MessageBubble
          v-for="message in messages"
          :key="message.id"
          :message="message"
          :mine="message.sender_role === mineRole"
        />
      </div>
      <MessageComposer v-model="draft" :loading="loading" :attachment-unsupported="true" @submit="$emit('send')" />
    </UiCard>

    <UiCard class="space-y-4">
      <p class="text-sm font-semibold uppercase tracking-[0.18em] text-primary-600">Quote details</p>
      <p class="text-sm text-slate-700">Reference: <span class="font-semibold text-slate-950">{{ request.request_reference || request.id }}</span></p>
      <p class="text-sm text-slate-700">Customer: <span class="font-semibold text-slate-950">{{ request.customer_name || request.customer_email || 'Client' }}</span></p>
      <p class="text-sm text-slate-700">Latest response count: <span class="font-semibold text-slate-950">{{ responses.length }}</span></p>
      <div v-if="responses.length" class="space-y-3 border-t border-slate-200 pt-4">
        <div v-for="response in responses" :key="response.id" class="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <div class="flex items-center justify-between gap-3">
            <StatusBadge :value="response.status" />
            <MoneyText :value="response.total" />
          </div>
          <p class="mt-2 text-sm text-slate-600">{{ response.turnaround_label || response.human_ready_text || 'Turnaround not provided.' }}</p>
        </div>
      </div>
    </UiCard>
  </div>
</template>

<script setup lang="ts">
import MessageBubble from '~/components/messages/MessageBubble.vue'
import MessageComposer from '~/components/messages/MessageComposer.vue'
import MoneyText from '~/components/ui/MoneyText.vue'
import StatusBadge from '~/components/ui/UiStatusBadge.vue'
import UiCard from '~/components/ui/UiCard.vue'

const draft = defineModel<string>('draft', { required: true })

defineProps<{
  request: Record<string, any>
  messages: Array<Record<string, any>>
  responses: Array<Record<string, any>>
  mineRole: string
  loading?: boolean
}>()

defineEmits<{
  send: []
}>()
</script>
