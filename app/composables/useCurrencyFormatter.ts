import { computed, unref } from 'vue'
import type { MaybeRef } from 'vue'
import {
  formatCurrency,
  formatCurrencyRange,
  formatItemPrice,
  normalizeCurrencyCode,
} from '~/utils/formatters'

export function useCurrencyFormatter(defaultCurrency?: MaybeRef<string | null | undefined>) {
  const resolvedCurrency = computed(() => normalizeCurrencyCode(unref(defaultCurrency)))

  function formatMoney(
    value: string | number | null | undefined,
    currency?: string | null,
    fallback = 'N/A'
  ) {
    return formatCurrency(value, currency ?? resolvedCurrency.value, fallback)
  }

  function formatMoneyRange(
    minValue: string | number | null | undefined,
    maxValue: string | number | null | undefined,
    currency?: string | null
  ) {
    return formatCurrencyRange(minValue, maxValue, currency ?? resolvedCurrency.value)
  }

  function formatDisplayPrice(value: string | number | null | undefined, currency?: string | null) {
    return formatItemPrice(value, currency ?? resolvedCurrency.value)
  }

  return {
    resolvedCurrency,
    formatMoney,
    formatMoneyRange,
    formatDisplayPrice,
  }
}
