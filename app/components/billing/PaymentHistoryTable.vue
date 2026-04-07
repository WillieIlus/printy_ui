<template>
  <div class="rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface)] shadow-sm overflow-hidden">
    <div class="flex items-center justify-between border-b border-[var(--p-border)] px-5 py-4">
      <h3 class="text-sm font-semibold text-[var(--p-text)]">Payment history</h3>
      <button
        v-if="!loading"
        type="button"
        class="text-xs text-[var(--p-text-muted)] hover:text-[var(--p-text)] flex items-center gap-1"
        @click="$emit('refresh')"
      >
        <UIcon name="i-lucide-refresh-cw" class="h-3.5 w-3.5" />
        Refresh
      </button>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex items-center justify-center py-12">
      <UIcon name="i-lucide-loader-circle" class="h-6 w-6 animate-spin text-[var(--p-text-muted)]" />
    </div>

    <!-- Empty -->
    <div v-else-if="!payments.length" class="flex flex-col items-center justify-center py-12 text-center px-4">
      <UIcon name="i-lucide-receipt" class="h-10 w-10 text-[var(--p-text-muted)] mb-3" />
      <p class="text-sm font-medium text-[var(--p-text-dim)]">No payment history yet</p>
      <p class="mt-1 text-xs text-[var(--p-text-muted)]">Your M-PESA transactions will appear here.</p>
    </div>

    <!-- Table — desktop -->
    <div v-else class="hidden sm:block overflow-x-auto">
      <table class="w-full text-sm">
        <thead>
          <tr class="border-b border-[var(--p-border)] text-left text-xs font-semibold uppercase tracking-wide text-[var(--p-text-muted)]">
            <th class="px-5 py-3">Date</th>
            <th class="px-5 py-3">Plan</th>
            <th class="px-5 py-3">Type</th>
            <th class="px-5 py-3">Amount</th>
            <th class="px-5 py-3">Receipt</th>
            <th class="px-5 py-3">Status</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-[var(--p-border-dim)]">
          <tr
            v-for="txn in payments"
            :key="txn.id"
            class="hover:bg-[var(--p-surface-sunken)] dark:hover:bg-[var(--p-surface-raised)] transition-colors"
          >
            <td class="px-5 py-3.5 text-[var(--p-text-dim)]">{{ formatDate(txn.created_at) }}</td>
            <td class="px-5 py-3.5 font-medium text-[var(--p-text)]">{{ txn.plan_name || '—' }}</td>
            <td class="px-5 py-3.5 capitalize text-[var(--p-text-dim)]">{{ txn.transaction_type.replace('_', ' ') }}</td>
            <td class="px-5 py-3.5 font-semibold text-[var(--p-text)]">{{ formatAmount(txn) }}</td>
            <td class="px-5 py-3.5 font-mono text-xs text-[var(--p-text-muted)]">
              {{ txn.mpesa_receipt_number || '—' }}
            </td>
            <td class="px-5 py-3.5">
              <span
                class="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold"
                :class="statusBadgeClass(txn.status)"
              >
                <span class="h-1.5 w-1.5 rounded-full" :class="statusDotClass(txn.status)" />
                {{ txnStatusLabel(txn.status) }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Mobile cards -->
    <div class="sm:hidden divide-y divide-[var(--p-border-dim)]">
      <div
        v-for="txn in payments"
        :key="txn.id"
        class="px-4 py-4 flex items-start justify-between gap-3"
      >
        <div class="min-w-0">
          <p class="text-sm font-semibold text-[var(--p-text)]">{{ txn.plan_name || '—' }}</p>
          <p class="mt-0.5 text-xs text-[var(--p-text-muted)]">{{ formatDate(txn.created_at) }} · {{ txn.transaction_type.replace('_', ' ') }}</p>
          <p v-if="txn.mpesa_receipt_number" class="mt-0.5 font-mono text-[11px] text-[var(--p-text-muted)]">{{ txn.mpesa_receipt_number }}</p>
        </div>
        <div class="text-right shrink-0">
          <p class="text-sm font-bold text-[var(--p-text)]">{{ formatAmount(txn) }}</p>
          <span
            class="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold mt-1"
            :class="statusBadgeClass(txn.status)"
          >
            {{ txnStatusLabel(txn.status) }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useBilling } from '~/composables/useBilling'
import type { PaymentTransaction } from '~/shared/types/billing'

defineProps<{ payments: PaymentTransaction[]; loading?: boolean }>()
defineEmits<{ (e: 'refresh'): void }>()

const { txnStatusLabel, formatKes } = useBilling()

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-KE', {
    day: 'numeric', month: 'short', year: 'numeric',
  })
}

function formatAmount(txn: PaymentTransaction): string {
  return formatKes(txn.amount)
}

function statusBadgeClass(status: string): string {
  if (status === 'success') return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400'
  if (status === 'pending' || status === 'processing') return 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400'
  return 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400'
}

function statusDotClass(status: string): string {
  if (status === 'success') return 'bg-emerald-500'
  if (status === 'pending' || status === 'processing') return 'bg-amber-500'
  return 'bg-red-500'
}
</script>
