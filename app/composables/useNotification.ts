import { notificationIcons, type NotificationVariant } from '~/utils/notification-theme'
import { useToast } from '~/services/toast'

export function useNotification() {
  const toast = useToast()

  function addToast(variant: NotificationVariant, title?: string | null, message?: string | null) {
    const description = typeof message === 'string' ? message.trim() : ''
    const resolvedTitle = typeof title === 'string' ? title.trim() : ''

    if (!description && !resolvedTitle) return

    toast.add({
      title: resolvedTitle || undefined,
      description: description || resolvedTitle,
      color: variant,
      context: 'system',
      icon: notificationIcons[variant],
    })
  }

  return {
    success(message?: string | null, title?: string | null) {
      addToast('success', title, message)
    },
    error(message?: string | null, title?: string | null) {
      addToast('error', title, message)
    },
    warning(message?: string | null, title?: string | null) {
      addToast('warning', title, message)
    },
    info(message?: string | null, title?: string | null) {
      addToast('info', title, message)
    },
  }
}
