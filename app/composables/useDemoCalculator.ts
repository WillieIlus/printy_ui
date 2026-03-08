/**
 * Demo calculator — fetches templates from Django API when available,
 * falls back to static data. Quote calculation uses API or local compute.
 */
import { API } from '~/shared/api-paths'
import { useApi } from '~/shared/api'
import { templates as staticTemplates } from '~/shared/demoTemplates'
import { demoRateCard } from '~/shared/demoRateCard'
import { computeDemoQuote } from '~/shared/demoPricing'
import type { DemoGalleryTemplate } from '~/shared/demoTemplates'
import type { DemoQuoteResult } from '~/shared/demoPricing'

/** API template shape (matches DemoGalleryTemplate) */
interface ApiTemplate {
  id: number
  name: string
  description: string
  category: string
  pricing_mode: string
  default_finished_width_mm: number
  default_finished_height_mm: number
  default_sides: string
  min_quantity: number
  default_sheet_size: string
  copies_per_sheet: number
  min_gsm: number | null
  max_gsm: number | null
  finishing_options: Array<{
    finishing_rate: number
    is_default: boolean
    price_adjustment: string | null
  }>
  badge: string | null
}

export function useDemoCalculator() {
  const api = useApi()
  const templatesFromApi = ref<DemoGalleryTemplate[] | null>(null)
  const apiAvailable = ref(false)

  /** Templates to use — API if available, else static */
  const demoTemplatesList = computed<DemoGalleryTemplate[]>(() => {
    if (templatesFromApi.value && templatesFromApi.value.length > 0) {
      return templatesFromApi.value
    }
    return staticTemplates
  })

  /** Fetch templates from API (call in onMounted) */
  async function fetchTemplates() {
    try {
      const res = await api<{ templates: ApiTemplate[] }>(API.demoTemplates())
      if (res?.templates?.length) {
        templatesFromApi.value = res.templates.map((t) => ({
          ...t,
          finishing_options: t.finishing_options.map((o) => ({
            finishing_rate: o.finishing_rate,
            is_default: o.is_default,
            price_adjustment: o.price_adjustment ? parseFloat(o.price_adjustment) : null,
          })),
        })) as DemoGalleryTemplate[]
        apiAvailable.value = true
      }
    } catch {
      templatesFromApi.value = null
      apiAvailable.value = false
    }
  }

  /** Compute quote — uses API when templates from API, else local */
  async function computeQuote(
    productId: number,
    quantity: number,
    sheetSize?: string,
    gsm?: number,
  ): Promise<DemoQuoteResult> {
    if (apiAvailable.value) {
      try {
        const res = await api<DemoQuoteResult>(API.demoQuote(), {
          method: 'POST',
          body: {
            product_id: productId,
            quantity,
            sheet_size: sheetSize,
            gsm,
          },
        })
        if (res) return res
      } catch {
        // Fall through to local
      }
    }
    const tmpl = demoTemplatesList.value.find((t) => t.id === productId)
    if (!tmpl) return { printing: 0, material: 0, finishing: 0, total: 0 }
    return computeDemoQuote(
      { ...tmpl, min_quantity: quantity },
      demoRateCard,
    )
  }

  return {
    demoTemplatesList,
    apiAvailable,
    fetchTemplates,
    computeQuote,
  }
}
