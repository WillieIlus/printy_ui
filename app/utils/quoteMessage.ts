import { formatCurrency } from '~/utils/formatters'

export interface QuoteSnapshot {
  shopName: string
  shopPhone?: string
  jobName?: string
  currency?: string | null
  sheetSize: string
  gsm: number
  paperType: string
  quantity: number
  sides: 1 | 2
  finishingNames?: string[]
  suggestedPrice: string
  leadTime?: string
  validityDays?: number
  paymentInstructions?: string
}

export function buildQuoteMessage(
  snapshot: QuoteSnapshot,
  options?: { includeContact?: boolean }
): string {
  const { includeContact = true } = options ?? {}
  const lines: string[] = []

  lines.push(`*${snapshot.shopName}*`)
  lines.push('')
  lines.push('*Quote*' + (snapshot.jobName ? ` - ${snapshot.jobName}` : ''))
  lines.push('')
  lines.push(`- ${snapshot.sheetSize} | ${snapshot.gsm}gsm ${snapshot.paperType}`)
  lines.push(`- Qty: ${snapshot.quantity} sheets`)
  lines.push(`- ${snapshot.sides === 2 ? 'Double-sided' : 'Single-sided'} print`)
  if (snapshot.finishingNames?.length) {
    lines.push(`- Finishing: ${snapshot.finishingNames.join(', ')}`)
  }
  lines.push('')
  lines.push(`*Suggested Price: ${formatCurrency(snapshot.suggestedPrice, snapshot.currency ?? 'KES')}*`)
  lines.push('')
  if (snapshot.leadTime) {
    lines.push(`Lead time: ${snapshot.leadTime}`)
  }
  lines.push(`Valid for ${snapshot.validityDays ?? 7} days`)
  if (snapshot.paymentInstructions) {
    lines.push(snapshot.paymentInstructions)
  }
  if (includeContact && snapshot.shopPhone) {
    lines.push('')
    lines.push(`Contact: ${snapshot.shopPhone}`)
  }

  return lines.join('\n')
}

export function getWhatsAppShareUrl(message: string, phone?: string): string {
  const encoded = encodeURIComponent(message)
  const base = phone ? `https://wa.me/${phone.replace(/\D/g, '')}` : 'https://wa.me/'
  return `${base}?text=${encoded}`
}
