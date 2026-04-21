import { notificationIcons, type NotificationVariant } from '~/utils/notification-theme'

export function useNotification() {
  const toast = useToast()

  function addToast(variant: NotificationVariant, title: string, message?: string | null) {
    const description = typeof message === 'string' ? message.trim() : ''

    toast.add({
      title,
      ...(description ? { description } : {}),
      color: variant,
      icon: notificationIcons[variant],
    })
  }

  return {
    success(message?: string | null, title = 'Success') {
      addToast('success', title, message)
    },
    error(message?: string | null, title = 'Error') {
      addToast('error', title, message)
    },
    warning(message?: string | null, title = 'Warning') {
      addToast('warning', title, message)
    },
    info(message?: string | null, title = 'Info') {
      addToast('info', title, message)
    },
  }
}
