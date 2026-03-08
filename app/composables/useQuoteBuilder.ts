/**
 * Shared quote builder logic for ProductTweakModal and CustomPrintBuilderModal.
 * Single pipeline: from gallery product OR custom from scratch → add to draft.
 */
import type { AddProductItemPayload, AddCustomItemPayload } from '~/services/quoteDraft'
import { API } from '~/shared/api-paths'
import { useApi } from '~/shared/api'

export interface MatchShopsSpec {
  pricing_mode: 'SHEET' | 'LARGE_FORMAT'
  finished_width_mm?: number
  finished_height_mm?: number
  quantity: number
  sides?: 'SIMPLEX' | 'DUPLEX'
  color_mode?: 'BW' | 'COLOR'
  sheet_size?: string
  paper_gsm?: number
  paper_type?: string
  finishing_ids?: number[]
  lat?: number
  lng?: number
  radius_km?: number
}

export interface MatchShopsResult {
  id: number
  name: string
  slug: string
  can_calculate: boolean
  reason: string
  missing_fields: string[]
}

export function useQuoteBuilder() {
  const api = useApi()

  async function matchShops(spec: MatchShopsSpec): Promise<{ shops: MatchShopsResult[]; total: number }> {
    const data = await api<{ shops: MatchShopsResult[]; total: number }>(API.publicMatchShops(), {
      method: 'POST',
      body: {
        pricing_mode: spec.pricing_mode,
        finished_width_mm: spec.finished_width_mm ?? 0,
        finished_height_mm: spec.finished_height_mm ?? 0,
        quantity: spec.quantity,
        sides: spec.sides ?? 'SIMPLEX',
        color_mode: spec.color_mode ?? 'COLOR',
        sheet_size: spec.sheet_size ?? 'SRA3',
        paper_gsm: spec.paper_gsm,
        paper_type: spec.paper_type ?? '',
        finishing_ids: spec.finishing_ids ?? [],
        lat: spec.lat,
        lng: spec.lng,
        radius_km: spec.radius_km ?? 50,
      },
    })
    return data
  }

  return {
    matchShops,
  }
}
