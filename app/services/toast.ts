import { useToastStore, type ToastType, type ToastContext } from '~/stores/toast'

type ToastAddPayload = {
  title?: string
  description?: string
  message?: string
  color?: ToastType
  type?: ToastType
  icon?: string
  duration?: number
  context?: ToastContext
  persistent?: boolean
  progress?: number
  actionLabel?: string
  action?: () => void
}

function normalizeToastTitle(message: string, explicitTitle?: string) {
  if (explicitTitle?.trim()) return explicitTitle.trim()

  const compact = message.trim().replace(/\s+/g, ' ')
  if (!compact) return 'Notice'

  const sentence = compact.split(/[.!?]/)[0]?.trim() || compact
  return sentence.length > 48 ? `${sentence.slice(0, 45).trimEnd()}...` : sentence
}

function pushTypedToast(type: ToastType, title: string, message?: string, options: Omit<ToastAddPayload, 'title' | 'description' | 'message' | 'color' | 'type' | 'icon'> = {}) {
  const toastStore = useToastStore()
  return toastStore.show({
    ...options,
    type,
    title: title.trim(),
    message: message?.trim() || undefined,
  })
}

export function useToast() {
  const toastStore = useToastStore()

  return {
    toasts: toastStore.toasts,
    add(payload: ToastAddPayload) {
      const type = payload.type ?? payload.color ?? 'info'
      const message = (payload.message ?? payload.description ?? '').trim()
      const title = payload.title?.trim() || normalizeToastTitle(message)

      return toastStore.show({
        type,
        title,
        message: message || undefined,
        duration: payload.duration,
        context: payload.context,
        persistent: payload.persistent,
        progress: payload.progress,
        actionLabel: payload.actionLabel,
        action: payload.action,
      })
    },
    update: toastStore.update,
    remove: toastStore.dismiss,
    clear: () => toastStore.toasts.splice(0, toastStore.toasts.length),
    success(message: string, title?: string, options?: Omit<ToastAddPayload, 'title' | 'description' | 'message' | 'color' | 'type' | 'icon'>) {
      return pushTypedToast('success', title || normalizeToastTitle(message, title), message, options)
    },
    error(message: string, title?: string, options?: Omit<ToastAddPayload, 'title' | 'description' | 'message' | 'color' | 'type' | 'icon'>) {
      return pushTypedToast('error', title || normalizeToastTitle(message, title), message, options)
    },
    warning(message: string, title?: string, options?: Omit<ToastAddPayload, 'title' | 'description' | 'message' | 'color' | 'type' | 'icon'>) {
      return pushTypedToast('warning', title || normalizeToastTitle(message, title), message, options)
    },
    info(message: string, title?: string, options?: Omit<ToastAddPayload, 'title' | 'description' | 'message' | 'color' | 'type' | 'icon'>) {
      return pushTypedToast('info', title || normalizeToastTitle(message, title), message, options)
    },
  }
}
