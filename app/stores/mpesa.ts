import { defineStore } from 'pinia'
import { useApi } from '~/composables/useApi'
import { API } from '~/shared/api-paths'

/**
 * Buyer-facing M-Pesa checkout (Phase 7.5a): real STK push + callback polling.
 *
 * The checkout no longer simulates the Daraja round-trip with timeouts. It posts
 * to `/payments/mpesa/stk-push/`, then polls `/payments/mpesa/{id}/` until the
 * payment reaches a terminal state — the callback arrives on the backend from
 * Safaricom asynchronously, so the frontend can only ever *observe* paid.
 *
 * `error` is deliberately distinct from `failed`/`cancelled`: it means we could
 * not even get the request to/from M-Pesa (network, Daraja, or session), so no
 * money moved and the user can safely retry.
 */

export type MpesaCheckoutPhase =
  | 'initiated'
  | 'pending'
  | 'paid'
  | 'failed'
  | 'cancelled'
  | 'needs_review'
  | 'error'

interface MpesaPaymentRead {
  id: number
  status: string
  is_terminal: boolean
  is_paid: boolean
  mpesa_receipt_number: string
  result_desc: string
}

export const MPESA_POLL_INTERVAL_MS = 3000
export const MPESA_MAX_CONSECUTIVE_POLL_ERRORS = 3

let tickerTimer: number | null = null
let pollTimer: number | null = null

export const useMpesaStore = defineStore('mpesa', {
  state: () => ({
    phase: null as MpesaCheckoutPhase | null,
    paymentId: null as number | null,
    receipt: '' as string,
    seconds: 0 as number,
    errorMessage: '' as string,
    consecutivePollErrors: 0,
    polling: false,
  }),
  getters: {
    terminal(state): boolean {
      return (
        state.phase === 'paid' ||
        state.phase === 'failed' ||
        state.phase === 'cancelled' ||
        state.phase === 'needs_review'
      )
    },
  },
  actions: {
    reset() {
      this.stop()
      this.phase = null
      this.paymentId = null
      this.receipt = ''
      this.seconds = 0
      this.errorMessage = ''
      this.consecutivePollErrors = 0
    },
    async initiate(phoneNumber: string, amount: number, managedJobId?: number | null) {
      const { api } = useApi()
      this.stop()
      this.paymentId = null
      this.receipt = ''
      this.seconds = 0
      this.errorMessage = ''
      this.consecutivePollErrors = 0
      this.phase = 'initiated'
      try {
        const payment = await api<MpesaPaymentRead>(API.payments.mpesaStkPush, {
          method: 'POST',
          body: { phone_number: phoneNumber, amount, ...(managedJobId ? { managed_job_id: managedJobId } : {}) },
        })
        this.paymentId = payment.id
        this.applyStatus(payment)
      } catch {
        this.phase = 'error'
        this.errorMessage = "We couldn't reach M-Pesa. No payment was taken. Please try again."
      }
    },
    async poll() {
      if (this.paymentId == null) {
        return
      }
      const { api } = useApi()
      try {
        const payment = await api<MpesaPaymentRead>(API.payments.mpesaDetail(this.paymentId), {})
        this.applyStatus(payment)
      } catch {
        this.consecutivePollErrors += 1
        if (this.consecutivePollErrors >= MPESA_MAX_CONSECUTIVE_POLL_ERRORS) {
          this.stop()
          this.phase = 'error'
          this.errorMessage =
            'We lost the live link while watching your payment. Check your M-Pesa message for a receipt; if you got one your job is safe. Tap Try again to continue.'
        }
      }
    },
    applyStatus(payment: MpesaPaymentRead) {
      this.paymentId = payment.id
      switch (payment.status) {
        case 'paid':
          this.phase = 'paid'
          this.receipt = payment.mpesa_receipt_number || this.receipt
          this.stop()
          break
        case 'failed':
          this.phase = 'failed'
          this.stop()
          break
        case 'cancelled':
          this.phase = 'cancelled'
          this.stop()
          break
        case 'needs_review':
          this.phase = 'needs_review'
          this.stop()
          break
        default:
          // 'initiated' / 'pending' — the callback has not landed yet.
          this.phase = 'pending'
          this.consecutivePollErrors = 0
      }
    },
    startTicker() {
      this.stopTicker()
      if (!import.meta.client) {
        return
      }
      tickerTimer = window.setInterval(() => {
        this.seconds += 1
      }, 1000)
    },
    startPolling() {
      this.stopPolling()
      if (!import.meta.client) {
        return
      }
      this.polling = true
      pollTimer = window.setInterval(() => {
        this.poll()
      }, MPESA_POLL_INTERVAL_MS)
    },
    stopPolling() {
      if (pollTimer != null) {
        window.clearInterval(pollTimer)
        pollTimer = null
      }
      this.polling = false
    },
    stopTicker() {
      if (tickerTimer != null) {
        window.clearInterval(tickerTimer)
        tickerTimer = null
      }
    },
    stop() {
      this.stopPolling()
      this.stopTicker()
    },
  },
})