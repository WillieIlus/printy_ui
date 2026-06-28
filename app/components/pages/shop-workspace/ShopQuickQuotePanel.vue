<template>
  <QuoteResponsePanel title="Quick Quote Builder" subtitle="Configure and price a job instantly" :error="messageTone === 'error' ? message : ''">
    <template #actions>
      <span class="inline-flex items-center gap-1.5 rounded-full border border-green-200 bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-700">
        <span class="h-1.5 w-1.5 rounded-full bg-green-500"></span>
        Live Pricing
      </span>
    </template>

    <div class="grid grid-cols-2 gap-5 p-6">
      <div class="col-span-2">
        <label class="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-500">Client</label>
        <button type="button" class="flex w-full items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-left" @click="$emit('cycle-request')">
          <svg class="h-4 w-4 shrink-0 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <span class="text-sm font-semibold text-slate-700">{{ selectedCustomer }}</span>
          <svg class="ml-auto h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      <div v-for="field in fields" :key="field.label" :class="field.fullWidth ? 'col-span-2' : ''">
        <label class="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-500">{{ field.label }}</label>
        <div class="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
          <span class="text-sm font-semibold text-slate-700">{{ field.value }}</span>
          <span v-if="field.meta" class="text-xs text-slate-400">{{ field.meta }}</span>
          <svg class="ml-auto h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      <div class="col-span-2">
        <label class="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-500">Turnaround</label>
        <div class="flex items-center gap-2">
          <button
            v-for="option in turnaroundOptions"
            :key="option.key"
            type="button"
            class="flex-1 rounded-xl border-2 py-2.5 text-xs font-semibold transition-colors"
            :style="selectedTurnaround === option.key ? 'background:#e13515; border-color:#e13515; color:white;' : ''"
            :class="selectedTurnaround === option.key ? '' : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'"
            @click="$emit('update:turnaround', option.key)"
          >
            {{ option.label }}
          </button>
        </div>
      </div>

      <div class="col-span-2 overflow-hidden rounded-2xl border border-slate-200">
        <div class="grid grid-cols-3 divide-x divide-slate-200">
          <div class="bg-slate-50 px-5 py-4">
            <p class="mb-1 text-xs font-bold uppercase tracking-wide text-slate-400">Production Cost</p>
            <p class="text-xl font-extrabold text-slate-700">{{ productionCost }}</p>
            <p class="mt-1 text-xs text-slate-400">Estimated from shop rate card</p>
          </div>

          <div class="bg-green-50 px-5 py-4">
            <p class="mb-1 text-xs font-bold uppercase tracking-wide text-green-600">Your Margin</p>
            <div class="flex items-center gap-2">
              <p class="text-xl font-extrabold text-green-700">{{ marginAmount }}</p>
              <span class="rounded-full border border-green-200 bg-green-100 px-2 py-0.5 text-xs font-bold text-green-600">+{{ marginPercent }}%</span>
            </div>
            <p class="mt-1 text-xs text-green-600">Margin on this job</p>
          </div>

          <div class="px-5 py-4" style="background:#101828;">
            <p class="mb-1 text-xs font-bold uppercase tracking-wide text-slate-400">Client Price</p>
            <p class="text-xl font-extrabold text-white">{{ clientPrice }}</p>
            <p class="mt-1 text-xs text-slate-400">What client pays</p>
          </div>
        </div>

        <div class="flex items-center justify-between border-t border-slate-200 bg-slate-50 px-5 py-3">
          <div class="flex items-center gap-2">
            <div class="h-2 w-32 flex-1 overflow-hidden rounded-full bg-slate-200">
              <div class="h-2 rounded-full" :style="{ width: `${Math.min(marginPercent, 100)}%`, background: '#e13515' }"></div>
            </div>
            <span class="text-xs font-medium text-slate-500">{{ marginPercent }}% margin</span>
          </div>
          <div class="flex items-center gap-2">
            <BaseButton variant="secondary" size="sm" @click="$emit('adjust-margin')">Adjust margin</BaseButton>
            <BaseButton variant="primary" size="sm" :disabled="quoteSending || !canSend" @click="$emit('send-quote')">
              {{ quoteSending ? 'Sending...' : 'Send Quote ->' }}
            </BaseButton>
          </div>
        </div>
      </div>

      <div v-if="message && messageTone !== 'error'" class="col-span-2 rounded-xl border px-4 py-3" :class="messageTone === 'success' ? 'border-green-200 bg-green-50 text-green-700' : 'border-slate-200 bg-slate-50 text-slate-700'">
        <p class="text-xs font-semibold">{{ message }}</p>
      </div>
    </div>
  </QuoteResponsePanel>
</template>

<script setup lang="ts">
import BaseButton from '~/components/base/BaseButton.vue'
import QuoteResponsePanel from '~/components/jobs/QuoteResponsePanel.vue'

interface TurnaroundOption {
  key: string
  label: string
}

interface QuoteField {
  label: string
  value: string
  meta?: string
  fullWidth?: boolean
}

defineProps<{
  selectedCustomer: string
  fields: QuoteField[]
  turnaroundOptions: TurnaroundOption[]
  selectedTurnaround: string
  productionCost: string
  marginAmount: string
  marginPercent: number
  clientPrice: string
  quoteSending: boolean
  canSend: boolean
  message: string
  messageTone: 'success' | 'error' | 'neutral'
}>()

defineEmits<{
  'cycle-request': []
  'update:turnaround': [value: string]
  'adjust-margin': []
  'send-quote': []
}>()
</script>
