import { computed, unref } from 'vue';
import { n as normalizeCurrencyCode, b as formatItemPrice, c as formatCurrencyRange, f as formatCurrency } from './formatters-FW8HHCjc.mjs';

function useCurrencyFormatter(defaultCurrency) {
  const resolvedCurrency = computed(() => normalizeCurrencyCode(unref(defaultCurrency)));
  function formatMoney(value, currency, fallback = "N/A") {
    return formatCurrency(value, currency ?? resolvedCurrency.value, fallback);
  }
  function formatMoneyRange(minValue, maxValue, currency) {
    return formatCurrencyRange(minValue, maxValue, currency ?? resolvedCurrency.value);
  }
  function formatDisplayPrice(value, currency) {
    return formatItemPrice(value, currency ?? resolvedCurrency.value);
  }
  return {
    resolvedCurrency,
    formatMoney,
    formatMoneyRange,
    formatDisplayPrice
  };
}

export { useCurrencyFormatter as u };
//# sourceMappingURL=useCurrencyFormatter-tIWAo1tq.mjs.map
