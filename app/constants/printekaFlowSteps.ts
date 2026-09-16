export interface PrintyFlowStep {
  step: number
  label: string
  description: string
  icon: 'edit' | 'search' | 'credit-card' | 'printer' | 'check-circle'
}

export const printyFlowSteps: PrintyFlowStep[] = [
  { step: 1, label: 'Request quote', description: 'Tell us what you need printed', icon: 'edit' },
  { step: 2, label: 'Review quote', description: 'Check pricing and details', icon: 'search' },
  { step: 3, label: 'Pay securely', description: 'Pay via MPESA or card', icon: 'credit-card' },
  { step: 4, label: 'Production', description: 'We print your order', icon: 'printer' },
  { step: 5, label: 'Complete', description: 'Collect or get delivery', icon: 'check-circle' },
]
