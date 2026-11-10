/**
 * Buyer-facing speed options — design source parity (New_Design speed cards).
 *
 * The design source offers buyers Standard / Faster +50% / Fastest +100% and shows
 * the ready-by time and the total updating together. The backend speed tier config
 * (`printy_api/services/pricing/speed_config.py`) carries the same ramp — standard
 * x1, faster x1.5 (+50% surcharge), fastest x2 (+100% surcharge) — so the design
 * buyer options and the backend pricing engine speak the same language.
 *
 * Nothing here prices anything and no figure is invented: labels, multipliers and
 * surcharge percentages mirror the design source and the backend tier config, while
 * the server stays the only source of price and ready-by figures.
 */

export type BuyerSpeedId = 'standard' | 'faster' | 'fastest'

export interface BuyerSpeedOption {
  id: BuyerSpeedId
  /** Plain-language chip label. Never a stock, finishing or internal term. */
  label: string
  /** Price multiplier implied by the design speed uplift. */
  multiplier: number
  /** Buyer-facing surcharge percent the backend applies for the tier. */
  surchargePercent: number
}

export const BUYER_SPEED_OPTIONS: BuyerSpeedOption[] = [
  { id: 'standard', label: 'Standard', multiplier: 1, surchargePercent: 0 },
  { id: 'faster', label: 'Faster +50%', multiplier: 1.5, surchargePercent: 50 },
  { id: 'fastest', label: 'Fastest +100%', multiplier: 2, surchargePercent: 100 },
]

export function buyerSpeedChoice(id: string | null | undefined): BuyerSpeedOption | undefined {
  const key = (id ?? '').trim().toLowerCase()
  if (!key) {
    return BUYER_SPEED_OPTIONS[0]
  }
  return BUYER_SPEED_OPTIONS.find((option) => option.id === key)
}

export function buyerSpeedChoices(): Array<{ value: string; label: string }> {
  return BUYER_SPEED_OPTIONS.map((option) => ({ value: option.id, label: option.label }))
}
