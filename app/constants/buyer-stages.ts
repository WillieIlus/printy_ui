/**
 * The buyer-facing stage names, in one place.
 *
 * The dashboard tracker renders whatever labels the API sends (the API owns
 * state). The homepage demo uses this same list so the demo and the real
 * tracker can never drift apart in wording.
 */
export interface BuyerStageDefinition {
  key: string
  label: string
  note: string
}

export const BUYER_STAGES: BuyerStageDefinition[] = [
  { key: 'payment_received', label: 'Payment received', note: 'Payment received' },
  { key: 'artwork_check', label: 'Artwork check', note: 'Checking your artwork' },
  { key: 'printing', label: 'Printing', note: 'Printing' },
  { key: 'finishing', label: 'Finishing', note: 'Being laminated' },
  { key: 'quality_check', label: 'Quality check', note: 'Quality check' },
  { key: 'out_for_delivery', label: 'Out for delivery', note: 'Out for delivery' },
  { key: 'delivered', label: 'Delivered', note: 'Delivered' },
]
