/**
 * Simple toast notification utility for the printer dashboard.
 * Used for: "Done. Undo" toasts, "Not sent yet" indicators, and sync status.
 * 
 * This is a minimal implementation that renders a toast element directly
 * into the page. In a production build with Nuxt UI, this would be replaced
 * by the framework's toast system.
 */

/**
 * Show a toast notification.
 * @param options - Toast configuration
 * @param options.message - The toast message text
 * @param options.type - The toast type: 'success', 'info', or 'danger'
 * @param options.duration - Milliseconds before auto-dismiss (0 = persistent)
 * @param options.hasUndo - Whether to show an undo action
 * @returns A cleanup function to dismiss the toast manually
 */
export function useToast() {
  let toastTimer: ReturnType<typeof setTimeout> | null = null
  let currentToast: HTMLDivElement | null = null

  const SHOW_CLASS_MAP = {
    success: 'toast--success',
    info: 'toast--info',
    danger: 'toast--danger',
  }

  const createToast = (options: {
    message: string
    type: 'success' | 'info' | 'danger'
    duration: number
    hasUndo: boolean
  }) => {
    // Remove existing toast if any
    if (currentToast) {
      currentToast.remove()
    }

    const toast = document.createElement('div')
    toast.className = `toast ${SHOW_CLASS_MAP[options.type]}`
    toast.setAttribute('role', 'alert')
    toast.setAttribute('aria-live', 'polite')

    const iconMap: Record<string, string> = {
      success: '✓',
      info: 'ℹ',
      danger: '!',
    }

    toast.innerHTML = `
      <div style="display: flex; align-items: center; gap: 8px;">
        <span style="font-size: 16px;">${iconMap[options.type]}</span>
        <span style="flex: 1;">${options.message}</span>
        ${options.hasUndo 
          ? `<button 
                class="undo-btn"
                style="background: none; border: none; color: inherit; font-size: 12px; cursor: pointer;"
                aria-label="Undo"
              >Undo</button>`
          : ''}
      </div>
    `

    // Add to page body
    document.body.appendChild(toast)
    currentToast = toast

    // Auto-dismiss if duration > 0
    if (options.duration > 0 && toastTimer) {
      clearTimeout(toastTimer)
    }
    toastTimer = setTimeout(() => {
      if (toast.parentNode) {
        toast.remove()
        currentToast = null
      }
    }, options.duration)

    // Handle undo button if present
    if (options.hasUndo) {
      const undoBtn = toast.querySelector('.undo-btn')
      if (undoBtn) {
        undoBtn.addEventListener('click', (e) => {
          e.stopPropagation()
          if (toast.parentNode) {
            toast.remove()
            currentToast = null
          }
          // Trigger undo action - the caller can handle this
          options.onUndo?.()
        })
      }
    }

    return () => {
      if (toast.parentNode) {
        toast.remove()
      }
      if (toastTimer) {
        clearTimeout(toastTimer)
        toastTimer = null
      }
      currentToast = null
    }
  }

  return {
    show: (options: {
      message: string
      type?: 'success' | 'info' | 'danger'
      duration?: number
      hasUndo?: boolean
      onUndo?: () => void
    }) => {
      return createToast({
        message: options.message,
        type: options.type ?? 'success',
        duration: options.duration ?? 5000,
        hasUndo: options.hasUndo ?? false,
        onUndo: options.onUndo,
      })
    },
    success: (message: string, duration?: number, hasUndo?: boolean, onUndo?: () => void) =>
      show({ message, type: 'success', duration, hasUndo, onUndo }),
    info: (message: string, duration?: number, hasUndo?: boolean, onUndo?: () => void) =>
      show({ message, type: 'info', duration, hasUndo, onUndo }),
    danger: (message: string, duration?: number, hasUndo?: boolean, onUndo?: () => void) =>
      show({ message, type: 'danger', duration, hasUndo, onUndo }),
  }
}