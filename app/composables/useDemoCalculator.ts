/**
 * Demo calculator — tries real shop rate card first, falls back to static.
 * No demo/rate-card fetch (avoids 404 when demo app not deployed).
 */
import { API } from '~/shared/api-paths'
import { usePublicApi } from '~/shared/api'
import { templates as staticTemplates } from '~/shared/demoTemplates'
import { demoRateCard } from '~/shared/demoRateCard'
import { computeDemoQuote } from '~/shared/demoPricing'
import type { DemoGalleryTemplate } from '~/shared/demoTemplates'
import type { DemoQuoteResult } from '~/shared/demoPricing'
import type { DemoRateCardApiResponse } from '~/shared/demoTypes'

/** Normalize API template to DemoGalleryTemplate shape */
function normalizeApiTemplate(
  t: DemoRateCardApiResponse['templates'][0],
): DemoGalleryTemplate {
  return {
    ...t,
    default_bleed_mm: 3,
    min_width_mm: null,
    min_height_mm: null,
    allow_simplex: true,
    allow_duplex: true,
    lowest_price: null,
    highest_price: null,
    finishing_options: t.finishing_options.map((o) => ({
      finishing_rate: o.finishing_rate,
      is_default: o.is_default,
      price_adjustment: o.price_adjustment,
    })),
  }
}

export function useDemoCalculator() {
  const publicApi = usePublicApi()
  const rateCardFromApi = ref<DemoRateCardApiResponse | null>(null)

  /** Templates to use — from real shop rate card if available, else static */
  const demoTemplatesList = computed<DemoGalleryTemplate[]>(() => {
    const rc = rateCardFromApi.value
    if (rc?.templates?.length) {
      return rc.templates.map(normalizeApiTemplate)
    }
    return staticTemplates
  })

  /** Whether rate card from API is available (real shop data) */
  const apiAvailable = computed(() => !!rateCardFromApi.value)

  /** Finishing rates for label lookup (from rate card or static) */
  const finishingRatesForLabels = computed(() => {
    const rc = rateCardFromApi.value
    if (rc?.finishing_rates?.length) {
      return rc.finishing_rates.map((f) => ({ id: f.id, name: f.name }))
    }
    return demoRateCard.finishing_rates.map((f) => ({ id: f.id, name: f.name }))
  })

  /**
   * Fetch rate card — try real shop first, fallback to static.
   * 1) GET public/shops — get first shop slug
   * 2) GET shops/{slug}/rate-card-for-calculator/
   * 3) If success, use it. Else use static (no 404).
   */
  async function fetchTemplates() {
    try {
      const shopsRes = await publicApi<{ results?: Array<{ slug: string }> }>(API.publicShops())
      const shops = shopsRes?.results ?? (Array.isArray(shopsRes) ? shopsRes : [])
      const first = shops[0] as { slug?: string } | undefined
      const firstSlug = first?.slug
      if (firstSlug) {
        const res = await publicApi<DemoRateCardApiResponse>(
          API.shopRateCardForCalculator(firstSlug),
        )
        if (res?.templates?.length || res?.papers?.length) {
          rateCardFromApi.value = res
          return
        }
      }
    } catch {
      // Fall through to static
    }
    rateCardFromApi.value = null
  }

  /**
   * Compute quote — uses rate card for local computation when available.
   * Falls back to static demoRateCard + staticTemplates when API unavailable.
   */
  async function computeQuote(
    productId: number,
    quantity: number,
    sheetSize?: string,
    gsm?: number,
  ): Promise<DemoQuoteResult> {
    const rc = rateCardFromApi.value
    if (rc) {
      const tmpl = rc.templates.find((t) => t.id === productId)
      if (!tmpl) return { printing: 0, material: 0, finishing: 0, total: 0 }
      return computeDemoQuote(
        { ...tmpl, min_quantity: quantity },
        rc,
      )
    }
    const tmpl = staticTemplates.find((t) => t.id === productId)
    if (!tmpl) return { printing: 0, material: 0, finishing: 0, total: 0 }
    return computeDemoQuote(
      { ...tmpl, min_quantity: quantity },
      demoRateCard,
    )
  }

  return {
    demoTemplatesList,
    apiAvailable,
    finishingRatesForLabels,
    fetchTemplates,
    computeQuote,
  }
}
