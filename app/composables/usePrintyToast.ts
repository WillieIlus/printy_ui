import { useToastStore, type ToastContext } from '~/stores/toast'
import { normalizeApiError } from '~/utils/normalizeApiError'

type ToastOptions = {
  context?: ToastContext
  duration?: number
  persistent?: boolean
  progress?: number
  actionLabel?: string
  action?: () => void
}

function formatBytesPerSecond(bytesPerSecond?: number | null) {
  if (!bytesPerSecond || bytesPerSecond <= 0) return null
  if (bytesPerSecond < 1024 * 1024) return `${(bytesPerSecond / 1024).toFixed(1)} KB/s`
  return `${(bytesPerSecond / (1024 * 1024)).toFixed(1)} MB/s`
}

function formatEta(seconds?: number | null) {
  if (!seconds || seconds <= 0) return null
  if (seconds < 60) return `about ${Math.round(seconds)}s left`
  return `about ${Math.ceil(seconds / 60)}m left`
}

export function usePrintyToast() {
  const store = useToastStore()

  return {
    show: store.show,
    update: store.update,
    dismiss: store.dismiss,
    clearContext: store.clearContext,
    success(title: string, message?: string, options?: ToastOptions) {
      return store.success(title, message, options)
    },
    error(title: string, message?: string, options?: ToastOptions) {
      return store.error(title, message, options)
    },
    warning(title: string, message?: string, options?: ToastOptions) {
      return store.warning(title, message, options)
    },
    info(title: string, message?: string, options?: ToastOptions) {
      return store.info(title, message, options)
    },
    loading(title: string, message?: string, options?: ToastOptions) {
      return store.loading(title, message, options)
    },
    uploadStarted(fileName: string, fileSize?: string) {
      return store.loading(
        'Uploading artwork',
        [fileName, fileSize].filter(Boolean).join(' · '),
        { context: 'upload', persistent: true, progress: 0 },
      )
    },
    uploadProgress(id: string, percent: number, speed?: number | null, eta?: number | null) {
      const parts = [`${Math.round(percent)}%`]
      const speedLabel = formatBytesPerSecond(speed)
      const etaLabel = formatEta(eta)
      if (speedLabel) parts.push(speedLabel)
      if (etaLabel) parts.push(etaLabel)

      store.update(id, {
        type: 'loading',
        title: 'Uploading artwork',
        message: parts.join(' · '),
        persistent: true,
        progress: percent,
      })
    },
    uploadComplete(fileName: string, id?: string) {
      const message = "Your PDF is attached. We'll use it with your quote request."
      if (id) {
        store.update(id, { type: 'success', title: 'Artwork uploaded', message, persistent: false, duration: 5000, progress: 100 })
        return id
      }
      return store.success('Artwork uploaded', message, { context: 'upload' })
    },
    uploadAnalysisFailed(fileName: string, id?: string) {
      const message = 'We could not read the PDF details automatically. Please confirm pages and size manually.'
      if (id) {
        store.update(id, { type: 'warning', title: 'Artwork uploaded', message, persistent: false, duration: 7000, progress: 100 })
        return id
      }
      return store.warning('Artwork uploaded', message, { context: 'upload', duration: 7000 })
    },
    uploadFailed(error: unknown, id?: string) {
      const message = normalizeApiError(error, 'The file could not be uploaded. Try again or use a smaller PDF.')
      if (id) {
        store.update(id, { type: 'error', title: 'Upload failed', message, persistent: false, duration: 7000, progress: undefined })
        return id
      }
      return store.error('Upload failed', message, { context: 'upload', duration: 7000 })
    },
    missingFields(fields: string[]) {
      const unique = Array.from(new Set(fields.filter(Boolean)))
      const message = unique.length
        ? `${unique.join(', ')} before pricing.`
        : 'Complete the required job details before pricing.'
      return store.warning('Complete booklet details', message, { context: 'calculator', duration: 7000 })
    },
    priceReady(matchCount: number) {
      const label = matchCount === 1 ? 'shop' : 'shops'
      return store.success('Prices ready', `We found ${matchCount} matching ${label} for this request.`, { context: 'calculator' })
    },
    priceFailed(error: unknown) {
      return store.error('Pricing unavailable', normalizeApiError(error, 'We could not calculate prices right now. Please try again.'), { context: 'calculator' })
    },
    quoteSent(shopCount: number) {
      const label = shopCount === 1 ? 'shop' : 'matching shops'
      return store.success('Quote request sent', `Your request has been sent to ${shopCount} ${label}.`, { context: 'quote' })
    },
    quoteSaved() {
      return store.success('Quote draft saved', 'Your request is saved so you can return and send it later.', { context: 'quote' })
    },
    quoteFailed(error: unknown) {
      return store.error('Quote request failed', normalizeApiError(error, 'We could not send your request right now.'), { context: 'quote' })
    },
    responseReceived(shopName: string) {
      return store.success('Shop response received', `${shopName} sent a quote response for your request.`, { context: 'quote' })
    },
    whatsappReady(shopName: string) {
      return store.info('WhatsApp ready', `${shopName} is ready to continue on WhatsApp.`, { context: 'whatsapp' })
    },
    whatsappMissingNumber() {
      return store.warning('WhatsApp number missing', 'This shop has not added a WhatsApp number yet.', { context: 'whatsapp' })
    },
    whatsappFailed(error: unknown) {
      return store.error('WhatsApp unavailable', normalizeApiError(error, 'We could not open WhatsApp for this request.'), { context: 'whatsapp' })
    },
    loginSuccess() {
      return store.success('Welcome back', 'You are signed in and your workspace is ready.', { context: 'auth' })
    },
    sessionExpired() {
      return store.warning('Session expired', 'Please log in again to continue.', { context: 'auth', duration: 7000 })
    },
    signupSuccess() {
      return store.success('Account created', 'Your account is ready. You can continue with your Printy workflow now.', { context: 'auth' })
    },
    authFailed(error: unknown) {
      return store.error('Sign-in failed', normalizeApiError(error, 'We could not complete authentication. Please try again.'), { context: 'auth' })
    },
    paymentStarted() {
      return store.loading('Payment started', 'Check your phone and enter your M-PESA PIN to continue.', { context: 'payment', persistent: true })
    },
    paymentSuccess() {
      return store.success('Payment received', 'Your payment was confirmed successfully.', { context: 'payment' })
    },
    paymentFailed(error: unknown) {
      return store.error('Payment failed', normalizeApiError(error, 'We could not complete the payment. Please try again.'), { context: 'payment' })
    },
    dashboardLoadFailed(error: unknown) {
      return store.error('Dashboard unavailable', normalizeApiError(error, 'We could not load this dashboard right now.'), { context: 'dashboard' })
    },
    emptyRequestsHint() {
      return store.info('No requests yet', 'Your quote requests will appear here as soon as you send one.', { context: 'dashboard' })
    },
  }
}
