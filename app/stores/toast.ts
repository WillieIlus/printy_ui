export type ToastType = 'success' | 'error' | 'warning' | 'info' | 'loading'
export type ToastContext = 'upload' | 'calculator' | 'quote' | 'whatsapp' | 'auth' | 'payment' | 'dashboard' | 'system'

export type ToastRecord = {
  id: string
  type: ToastType
  title: string
  message?: string
  context?: ToastContext
  duration?: number
  persistent?: boolean
  progress?: number
  actionLabel?: string
  action?: (() => void) | null
  created_at: number
}

type ToastShowInput = Partial<Omit<ToastRecord, 'id' | 'created_at'>> & Pick<ToastRecord, 'type' | 'title'>
type ToastPatch = Partial<Omit<ToastRecord, 'id' | 'created_at'>>
type ToastOptions = Omit<ToastShowInput, 'type' | 'title' | 'message'>

function createToastId() {
  return `toast-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

function clampProgress(progress?: number) {
  if (typeof progress !== 'number' || Number.isNaN(progress)) return undefined
  return Math.min(100, Math.max(0, Math.round(progress)))
}

function normalizeToast(input: ToastShowInput): ToastRecord {
  const persistent = input.persistent ?? input.type === 'loading'
  const duration = persistent ? undefined : (typeof input.duration === 'number' && input.duration > 0 ? input.duration : 5000)

  return {
    id: createToastId(),
    type: input.type,
    title: input.title.trim(),
    message: input.message?.trim() || undefined,
    context: input.context,
    duration,
    persistent,
    progress: clampProgress(input.progress),
    actionLabel: input.actionLabel?.trim() || undefined,
    action: input.action ?? null,
    created_at: Date.now(),
  }
}

export const useToastStore = defineStore('toast', () => {
  const toasts = ref<ToastRecord[]>([])

  function show(input: ToastShowInput) {
    const record = normalizeToast(input)
    toasts.value = [record, ...toasts.value]
    return record.id
  }

  function update(id: string, patch: ToastPatch) {
    toasts.value = toasts.value.map((toast) => {
      if (toast.id !== id) return toast

      const nextPersistent = patch.persistent ?? toast.persistent ?? false
      const nextDuration = nextPersistent
        ? undefined
        : (typeof patch.duration === 'number' && patch.duration > 0 ? patch.duration : toast.duration ?? 5000)

      return {
        ...toast,
        ...patch,
        title: patch.title?.trim() || toast.title,
        message: patch.message === undefined ? toast.message : (patch.message?.trim() || undefined),
        actionLabel: patch.actionLabel === undefined ? toast.actionLabel : (patch.actionLabel?.trim() || undefined),
        action: patch.action === undefined ? toast.action : patch.action,
        persistent: nextPersistent,
        duration: nextDuration,
        progress: clampProgress(patch.progress === undefined ? toast.progress : patch.progress),
      }
    })
  }

  function dismiss(id: string) {
    toasts.value = toasts.value.filter(toast => toast.id !== id)
  }

  function clearContext(context: ToastContext) {
    toasts.value = toasts.value.filter(toast => toast.context !== context)
  }

  function success(title: string, message?: string, options: ToastOptions = {}) {
    return show({ ...options, type: 'success', title, message })
  }

  function error(title: string, message?: string, options: ToastOptions = {}) {
    return show({ ...options, type: 'error', title, message })
  }

  function warning(title: string, message?: string, options: ToastOptions = {}) {
    return show({ ...options, type: 'warning', title, message })
  }

  function info(title: string, message?: string, options: ToastOptions = {}) {
    return show({ ...options, type: 'info', title, message })
  }

  function loading(title: string, message?: string, options: ToastOptions = {}) {
    return show({ ...options, type: 'loading', title, message, persistent: options.persistent ?? true })
  }

  return {
    toasts,
    show,
    success,
    error,
    warning,
    info,
    loading,
    update,
    dismiss,
    clearContext,
  }
})
