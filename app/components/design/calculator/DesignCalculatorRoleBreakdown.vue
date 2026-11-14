<script setup lang="ts">
/**
 * Role-projected cost detail for the same calculator price.
 *
 * The server sends exactly one canonical split and projects it per role:
 * printers get raw production lines plus their own payout, managers get the
 * same lines with their markup and the client-inclusive total. Buyers never
 * receive this object, so this component can never leak it to them.
 */
import { computed } from 'vue'
import type { ServerRoleEconomics, ServerRolePriceLine } from '~/shared/types'
import { formatKSh } from '~/utils/money'

const props = defineProps<{
  economics: ServerRoleEconomics
}>()

const isManager = computed(() => props.economics.role === 'manager')

const markupPercentText = computed(() => {
  const value = Number(props.economics.markup_percent)
  if (!Number.isFinite(value)) {
    return ''
  }
  return `${value.toFixed(2).replace(/\.00$/, '')}%`
})

function money(value: unknown): string {
  return formatKSh(value as string | number | null | undefined, 2)
}

function unitLabel(unit: unknown): string {
  return String(unit ?? '').replace(/_/g, ' ').trim()
}

function lineMeta(line: ServerRolePriceLine): string {
  const quantity = line.quantity
    ? `${line.quantity}${line.unit ? ` ${unitLabel(line.unit)}` : ''}`
    : ''
  if (quantity && line.rate) {
    return `${quantity} @ ${money(line.rate)}`
  }
  return quantity || (line.rate ? `@ ${money(line.rate)}` : '')
}
</script>

<template>
  <div data-calculator-role-breakdown class="mt-5 mb-4 border-t border-paper/15 pt-4">
    <div class="flex items-center justify-between gap-3">
      <p class="font-mono text-[10px] tracking-[0.16em] text-paper/45 uppercase">
        {{ isManager ? 'Your cost and markup' : 'Production cost' }}
      </p>
      <span
        v-if="isManager && markupPercentText"
        class="rounded-full border border-brand-bright/40 bg-brand-bright/10 px-2 py-0.5 font-mono text-[9.5px] font-semibold text-brand-bright"
      >
        +{{ markupPercentText }} markup
      </span>
    </div>

    <ul class="mt-3 space-y-2.5">
      <li v-for="(line, index) in economics.lines" :key="`${line.label}-${index}`">
        <div class="flex items-start justify-between gap-3">
          <div class="min-w-0">
            <p class="text-[12.5px] leading-snug font-medium text-paper">
              {{ line.label }}
            </p>
            <p v-if="line.spec || line.quantity" class="mt-0.5 font-mono text-[10px] leading-snug text-paper/45">
              <span v-if="lineMeta(line)">
                {{ lineMeta(line) }}
              </span>
              <span v-if="line.spec" :class="{ 'ml-1': line.quantity }">{{ line.spec }}</span>
            </p>
          </div>
          <p class="tabular shrink-0 font-mono text-[12.5px] font-semibold text-paper">
            {{ money(line.total) }}
          </p>
        </div>
        <p v-if="isManager" class="tabular mt-0.5 font-mono text-[10px] text-paper/45">
          cost {{ money(line.production_total) }}
          <span class="text-brand-bright/80">+ {{ money(line.markup_amount) }} markup</span>
        </p>
      </li>
    </ul>

    <dl class="tabular mt-3.5 space-y-1.5 border-t border-paper/15 pt-3 font-mono text-[11.5px]">
      <div class="flex items-center justify-between gap-3">
        <dt class="text-paper/55">
          Production
        </dt>
        <dd class="text-paper">
          {{ money(economics.production_total) }}
        </dd>
      </div>
      <template v-if="isManager">
        <div class="flex items-center justify-between gap-3">
          <dt class="text-paper/55">
            Your markup<span v-if="markupPercentText"> ({{ markupPercentText }})</span>
          </dt>
          <dd class="text-paper">
            {{ money(economics.markup_total) }}
          </dd>
        </div>
        <div class="flex items-center justify-between gap-3">
          <dt class="text-paper/55">
            Your price to client
          </dt>
          <dd class="font-semibold text-paper">
            {{ money(economics.manager_total) }}
          </dd>
        </div>
        <div class="flex items-center justify-between gap-3">
          <dt class="text-paper/45">
            Printy fee
          </dt>
          <dd class="text-paper/70">
            {{ money(economics.printy_fee) }}
          </dd>
        </div>
        <div class="flex items-center justify-between gap-3">
          <dt class="text-paper/45">
            Client pays incl. fee
          </dt>
          <dd class="text-paper/70">
            {{ money(economics.client_total_inclusive) }}
          </dd>
        </div>
      </template>
      <div
        v-else-if="economics.printer_payout !== null && economics.printer_payout !== undefined"
        class="flex items-center justify-between gap-3"
      >
        <dt class="text-paper/55">
          Your payout
        </dt>
        <dd class="font-semibold text-paper">
          {{ money(economics.printer_payout) }}
        </dd>
      </div>
    </dl>

    <p class="mt-2 text-[10.5px] leading-snug text-paper/40">
      <template v-if="isManager">
        Printer cost, your markup and the client price all come from the same server calculation.
      </template>
      <template v-else>
        Production rates from the Printy rate card. Payout adds the active tier's printer floor.
      </template>
    </p>
  </div>
</template>
