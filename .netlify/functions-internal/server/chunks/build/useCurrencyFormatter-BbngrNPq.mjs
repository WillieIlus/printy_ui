import { computed, unref } from 'vue';
import { n as normalizeCurrencyCode, a as formatItemPrice, b as formatCurrencyRange, c as formatCurrency } from './formatters-Cc_7PG6h.mjs';

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
//# sourceMappingURL=useCurrencyFormatter-BbngrNPq.mjs.map
